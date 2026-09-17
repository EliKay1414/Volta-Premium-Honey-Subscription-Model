import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {UserPlus, Search, Phone, CheckCircle, X, Edit2, MoreVertical, Headphones} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'
import {Subscriber, mockSubscribers} from '../subscribers/SubscribersPage'
import {DeliveryCalendarPicker} from '@/components/calendar/DeliveryCalendarPicker'

export interface Prospect {
  id: string
  name: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  dob: string
  preferredSize: '500g plastic bottles' | '330g plastic bottles'
  supportAgent: string
  callStatus: 'Call Completed' | 'Pending Call' | 'Follow-up'
  status: 'Ready to Buy' | 'Sample Sent' | 'Registered via USSD'
  region: string
  landmark: string
  dateJoined: string
  ussdCode: string
  avatarColor: string
}

const GHANA_REGIONS = [
  'All',
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
]

const SUPPORT_AGENTS = [
  'Abena Osei',
  'Kofi Addo',
  'Elikplim Mensah',
  'Daniel Arthur',
  'Patricia Ansah',
]

const ORDERED_FREQUENCIES = [
  {value: 'Weekly', label: 'Weekly (Every 7 days)'},
  {value: 'Bi-Weekly', label: 'Bi-weekly (Every 2 weeks)'},
  {value: 'Monthly', label: 'Monthly (Once a month)'},
  {value: 'Quarterly', label: 'Quarterly (Every 3 months)'},
  {value: 'Semi-annually', label: 'Semi-annually (Every 6 months)'},
  {value: 'Annually', label: 'Annually (Once a year)'},
] as const

const mockProspects: Prospect[] = [
  {
    id: '1',
    name: 'Alex Lawrence',
    phoneNumber: '+233 24 123 4567',
    gender: 'Male',
    dob: '14/05/1992',
    preferredSize: '500g plastic bottles',
    supportAgent: 'Abena Osei',
    callStatus: 'Call Completed',
    status: 'Ready to Buy',
    region: 'Greater Accra',
    landmark: 'Near Accra Mall, Tetteh Quarshie',
    dateJoined: 'Sep 08, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'primary',
  },
  {
    id: '2',
    name: 'Rachel Bennett',
    phoneNumber: '+233 20 234 5678',
    gender: 'Female',
    dob: '22/11/1988',
    preferredSize: '330g plastic bottles',
    supportAgent: 'Kofi Addo',
    callStatus: 'Call Completed',
    status: 'Sample Sent',
    region: 'Ashanti',
    landmark: 'Opposite Shell Station, Adum',
    dateJoined: 'Sep 07, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'success',
  },
  {
    id: '3',
    name: 'Marcus Sterling',
    phoneNumber: '+233 55 345 6789',
    gender: 'Male',
    dob: '05/03/1995',
    preferredSize: '500g plastic bottles',
    supportAgent: 'Elikplim Mensah',
    callStatus: 'Pending Call',
    status: 'Registered via USSD',
    region: 'Volta',
    landmark: 'Near Ho Central Market',
    dateJoined: 'Sep 06, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'info',
  },
  {
    id: '4',
    name: 'Elena Rostova',
    phoneNumber: '+233 27 456 7890',
    gender: 'Female',
    dob: '18/08/1991',
    preferredSize: '330g plastic bottles',
    supportAgent: 'Daniel Arthur',
    callStatus: 'Call Completed',
    status: 'Registered via USSD',
    region: 'Eastern',
    landmark: 'Behind Total Filling Station, Koforidua',
    dateJoined: 'Sep 05, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'primary',
  },
  {
    id: '5',
    name: 'Gregory Paul',
    phoneNumber: '+233 24 567 8901',
    gender: 'Male',
    dob: '30/01/1985',
    preferredSize: '500g plastic bottles',
    supportAgent: 'Abena Osei',
    callStatus: 'Follow-up',
    status: 'Sample Sent',
    region: 'Central',
    landmark: 'Close to University Main Gate, Cape Coast',
    dateJoined: 'Sep 03, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'secondary',
  },
  {
    id: '6',
    name: 'Grace Mensah',
    phoneNumber: '+233 50 678 9012',
    gender: 'Female',
    dob: '09/09/1994',
    preferredSize: '330g plastic bottles',
    supportAgent: 'Patricia Ansah',
    callStatus: 'Call Completed',
    status: 'Ready to Buy',
    region: 'Greater Accra',
    landmark: 'Opposite Community 1 Police Station, Tema',
    dateJoined: 'Sep 01, 2026',
    ussdCode: '*713*65#',
    avatarColor: 'success',
  },
]

const ProspectsPage: FC = () => {
  const {showToast} = useNotifications()
  const [prospects, setProspects] = usePersistentState<Prospect[]>('vivaldi_prospects', mockProspects)
  const [subscribers, setSubscribers] = usePersistentState<Subscriber[]>('vivaldi_subscribers', mockSubscribers)
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | number | null>('vivaldi_prospects_highlight_row', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_prospects_highlight_col', null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [makeBuyerProspect, setMakeBuyerProspect] = useState<Prospect | null>(null)
  const [editProspect, setEditProspect] = useState<Prospect | null>(null)

  // Add form state
  const [newProspect, setNewProspect] = useState({
    name: '',
    phoneNumber: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '15/06/1993',
    region: 'Greater Accra',
    landmark: '',
    preferredSize: '500g plastic bottles' as '500g plastic bottles' | '330g plastic bottles',
    supportAgent: 'Abena Osei',
    callStatus: 'Call Completed' as 'Call Completed' | 'Pending Call' | 'Follow-up',
    status: 'Registered via USSD' as 'Registered via USSD' | 'Sample Sent' | 'Ready to Buy',
  })

  // Make Buyer form state
  const [buyerPlanType, setBuyerPlanType] = useState<'Monthly Plan' | 'Annual Plan'>('Monthly Plan')
  const [buyerBottleType, setBuyerBottleType] = useState<'500g plastic bottles' | '330g plastic bottles'>('500g plastic bottles')
  const [buyerQuantity, setBuyerQuantity] = useState<number>(3)
  const [buyerFrequency, setBuyerFrequency] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually'>('Monthly')
  const [buyerCustomerType, setBuyerCustomerType] = useState<'Subscriber Only' | 'Active Customer / Buyer'>('Active Customer / Buyer')
  const [buyerPaymentMethod, setBuyerPaymentMethod] = useState<'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery'>('MTN Mobile Money')
  const [buyerPaymentStatus, setBuyerPaymentStatus] = useState<'Paid' | 'Pending Payment' | 'Annual Pre-paid'>('Paid')
  const [buyerFirstDate, setBuyerFirstDate] = useState('Next Monday')
  const [buyerSupportAgent, setBuyerSupportAgent] = useState('Abena Osei')

  const handleOpenMakeBuyer = (prospect: Prospect) => {
    setMakeBuyerProspect(prospect)
    setBuyerBottleType(prospect.preferredSize)
    setBuyerSupportAgent(prospect.supportAgent)
    setBuyerQuantity(3)
    setBuyerPlanType('Monthly Plan')
    setBuyerFrequency('Monthly')
    setBuyerCustomerType('Active Customer / Buyer')
    setBuyerPaymentMethod('MTN Mobile Money')
    setBuyerPaymentStatus('Paid')
  }

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProspect.name || !newProspect.phoneNumber) return

    const created: Prospect = {
      id: `prospect-${Date.now()}`,
      name: newProspect.name,
      phoneNumber: newProspect.phoneNumber,
      gender: newProspect.gender,
      dob: newProspect.dob || '01/01/1990',
      ussdCode: '*713*65#',
      region: newProspect.region,
      landmark: newProspect.landmark || 'Ghana Address',
      preferredSize: newProspect.preferredSize,
      supportAgent: newProspect.supportAgent,
      callStatus: newProspect.callStatus,
      status: newProspect.status,
      dateJoined: 'Just now',
      avatarColor: 'primary',
    }

    setProspects([created, ...prospects])
    setHighlightedRowId(created.id)
    setHighlightedColId('name')
    setIsAddModalOpen(false)
    setNewProspect({
      name: '',
      phoneNumber: '',
      gender: 'Male',
      dob: '15/06/1993',
      region: 'Greater Accra',
      landmark: '',
      preferredSize: '500g plastic bottles',
      supportAgent: 'Abena Osei',
      callStatus: 'Call Completed',
      status: 'Registered via USSD',
    })

    showToast({
      category: 'subscriber',
      title: 'New Prospect Logged (*713*65#)',
      description: `${created.name} (${created.phoneNumber}) verified by Support (${created.supportAgent})`,
      badgeColor: 'info',
    })
  }

  const handleConfirmMakeBuyer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!makeBuyerProspect) return

    const skuCode = buyerBottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'
    const unitPrice = buyerBottleType === '500g plastic bottles' ? 100 : 85
    const totalGHS =
      buyerPlanType === 'Annual Plan'
        ? Math.round(buyerQuantity * unitPrice * 12 * 0.9)
        : buyerQuantity * unitPrice
    const billFormatted =
      buyerPlanType === 'Annual Plan'
        ? `GH₵ ${totalGHS.toLocaleString()} / yr`
        : `GH₵ ${totalGHS.toLocaleString()} / mo`

    // Create complete subscriber profile from prospect data
    const newSubscriber: Subscriber = {
      id: `sub-${Date.now()}`,
      name: makeBuyerProspect.name,
      phoneNumber: makeBuyerProspect.phoneNumber,
      gender: makeBuyerProspect.gender,
      dob: makeBuyerProspect.dob,
      customerType: buyerCustomerType,
      planType: buyerPlanType,
      bottleChoice: buyerBottleType,
      sku: skuCode,
      quantity: buyerQuantity,
      frequency: buyerFrequency,
      paymentMethod: buyerPaymentMethod,
      paymentStatus: buyerPaymentStatus,
      billAmountGHS: billFormatted,
      supportAgent: buyerSupportAgent,
      region: makeBuyerProspect.region,
      landmark: makeBuyerProspect.landmark || 'Ghana Address',
      totalBottlesBought: buyerQuantity,
      totalSpentGHS: `GH₵ ${totalGHS.toLocaleString()}`,
      status: 'Active',
      nextDeliveryDate: buyerFirstDate,
      firstBuyDate: new Date().toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'}),
      avatarColor: makeBuyerProspect.avatarColor || 'primary',
      // Maintain full cross-dashboard compatibility
      ...({
        monthlyAmountGHS: billFormatted,
        nextDelivery: buyerFirstDate,
        bottlesCount: `${buyerQuantity} Bottles / Month`,
      } as any),
    }

    // 1. Transfer to Subscribers table
    setSubscribers((prev) => [newSubscriber, ...prev])

    // 2. Remove from Prospects table to prevent duplication
    setProspects((prev) => prev.filter((p) => p.id !== makeBuyerProspect.id))

    showToast({
      category: 'subscriber',
      title: 'Transferred to Subscribers',
      description: `${makeBuyerProspect.name} converted to ${buyerPlanType} (${buyerQuantity}x ${buyerBottleType} • Product Code: ${skuCode} • GH₵ ${totalGHS.toLocaleString()}) and moved from Prospects to Subscribers.`,
      badgeColor: 'success',
      link: '/subscribers',
      linkLabel: 'View in Subscribers',
    })

    setMakeBuyerProspect(null)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProspect) return

    setProspects((prev) =>
      prev.map((p) => (p.id === editProspect.id ? editProspect : p))
    )
    setHighlightedRowId(editProspect.id)
    setHighlightedColId('callStatus')

    showToast({
      category: 'subscriber',
      title: 'Prospect Updated',
      description: `Details and landmark for ${editProspect.name} updated successfully`,
      badgeColor: 'primary',
    })

    setEditProspect(null)
  }

  const filtered = prospects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phoneNumber.includes(searchTerm) ||
      p.supportAgent.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || p.region === selectedRegion
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter
    return matchesSearch && matchesRegion && matchesStatus
  })

  // Shadcn Table Columns in Primary Order:
  // Name, Tel, Gender, Dob, Preferred Bottle, Support Caller, Status, Region (before Actions), Actions
  const columns: ShadcnColumn<Prospect>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      render: (item) => (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-35px me-3'>
            <span className={`symbol-label bg-light-${item.avatarColor} text-${item.avatarColor} fw-bold fs-7`}>
              {item.name.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div>
            <span className='text-gray-900 fw-bold fs-7 d-block text-nowrap'>{item.name}</span>
            <span className='text-muted fs-8'>{item.ussdCode}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'phoneNumber',
      header: 'Tel',
      accessor: 'phoneNumber',
      render: (item) => (
        <span className='text-gray-800 fw-semibold fs-7 text-nowrap'>
          {item.phoneNumber}
        </span>
      ),
    },
    {
      id: 'gender',
      header: 'Gender',
      accessor: 'gender',
      render: (item) => (
        <span className='text-gray-700 fw-medium fs-7'>
          {item.gender}
        </span>
      ),
    },
    {
      id: 'dob',
      header: 'Dob',
      accessor: 'dob',
      render: (item) => (
        <span className='text-gray-700 fw-semibold fs-7 text-nowrap'>
          {item.dob}
        </span>
      ),
    },
    {
      id: 'preferredSize',
      header: 'Preferred Bottle & Product Code',
      accessor: 'preferredSize',
      render: (item) => {
        const skuCode = item.preferredSize === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'
        return (
          <div className='d-flex flex-column text-nowrap'>
            <span className='badge badge-light-primary fw-bold fs-8 w-fit'>
              {item.preferredSize}
            </span>
            <span className='product-code-text fs-8 mt-1'>
              Product Code: {skuCode}
            </span>
          </div>
        )
      },
    },
    {
      id: 'supportAgent',
      header: 'Support Caller',
      accessor: 'supportAgent',
      render: (item) => (
        <div className='d-flex align-items-center text-nowrap'>
          <Headphones size={13} className='text-muted me-1.5 flex-shrink-0' />
          <div>
            <span className='text-gray-800 fw-bold fs-8 d-block'>{item.supportAgent}</span>
            <span className={`fs-9 fw-semibold text-${item.callStatus === 'Call Completed' ? 'success' : item.callStatus === 'Follow-up' ? 'warning' : 'muted'}`}>
              {item.callStatus}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const isReady = item.status === 'Ready to Buy'
        const isSample = item.status === 'Sample Sent'
        const dotColor = isReady ? 'bg-success' : isSample ? 'bg-primary' : 'bg-warning'
        const textColor = isReady ? 'text-success' : isSample ? 'text-primary' : 'text-warning'

        return (
          <span className={`d-inline-flex align-items-center gap-1.5 fs-8 fw-bolder ${textColor} text-nowrap`}>
            <span className={`bullet bullet-dot ${dotColor} h-6px w-6px`}></span>
            {item.status.toUpperCase()}
          </span>
        )
      },
    },
    {
      id: 'region',
      header: 'Region',
      accessor: 'region',
      render: (item) => (
        <span className='text-gray-800 fw-medium fs-7 text-nowrap'>
          {item.region}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      sortable: false,
      headerClassName: 'text-end',
      className: 'text-end',
      render: (item) => (
        <div className='d-inline-flex gap-2'>
          <button
            type='button'
            onClick={() => {
              handleOpenMakeBuyer(item)
              setHighlightedRowId(item.id)
              setHighlightedColId('status')
            }}
            className='btn btn-xs btn-light-primary fw-bold text-nowrap'
            title='Call and convert prospect to subscriber'
          >
            <CheckCircle size={13} className='me-1' /> Make Buyer
          </button>
          <button
            type='button'
            onClick={() => {
              setEditProspect(item)
              setHighlightedRowId(item.id)
              setHighlightedColId('name')
            }}
            className='btn btn-xs btn-light btn-icon'
            title='View secondary details & edit landmark'
          >
            <Edit2 size={13} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>Prospects</PageTitle>

      <div className='card mb-5 mb-xl-8 shadow-xs border border-gray-200'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Prospects (*713*65# Registrations)</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              People who registered via USSD, verified by phone call before becoming subscribers
            </span>
          </h3>
          <div className='card-toolbar'>
            <button
              type='button'
              onClick={() => setIsAddModalOpen(true)}
              className='btn btn-sm btn-primary fw-bold d-flex align-items-center'
            >
              <UserPlus size={16} className='me-2' /> Add Prospect
            </button>
          </div>
        </div>

        <div className='card-body py-4'>
          {/* Filters Row */}
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5'>
            <div className='d-flex flex-wrap align-items-center gap-3 w-100 w-lg-auto'>
              {/* Search */}
              <div className='position-relative w-100 w-md-250px'>
                <input
                  type='text'
                  className='form-control form-control-solid ps-10 form-control-sm'
                  placeholder='Search name, phone, or caller...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className='position-absolute top-50 start-0 translate-middle-y ms-3 text-gray-500'>
                  <Search size={14} />
                </span>
              </div>

              {/* 16 Ghana Regions Dropdown */}
              <div className='w-100 w-md-180px'>
                <select
                  className='form-select form-select-solid form-select-sm'
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {GHANA_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region === 'All' ? 'All 16 Regions' : region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className='d-flex gap-2 flex-wrap'>
              {['All', 'Ready to Buy', 'Sample Sent', 'Registered via USSD'].map((st) => (
                <button
                  key={st}
                  type='button'
                  className={`btn btn-xs py-1.5 px-3 fw-bold ${
                    statusFilter === st ? 'btn-primary text-white' : 'btn-light'
                  }`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Shadcn UI Table Component */}
          <ShadcnTable
            data={filtered}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20]}
            emptyMessage='No prospects match your search criteria.'
            keyExtractor={(p) => p.id}
            highlightedRowId={highlightedRowId}
            highlightedColId={highlightedColId}
            onRowClick={(p) => setHighlightedRowId(p.id)}
          />
        </div>
      </div>

      {/* MODAL 1: Add Prospect Modal */}
      {isAddModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-2 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Log New Prospect (*713*65#)</h3>
                  <span className='text-muted fs-7'>Register a new inbound USSD customer prospect</span>
                </div>
                <button
                  type='button'
                  onClick={() => setIsAddModalOpen(false)}
                  className='btn btn-icon btn-sm btn-active-light-primary rounded-circle'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProspect}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  {/* Section 1: Personal Details */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Personal Details
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-3'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Full Name</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Alex Lawrence'
                          value={newProspect.name}
                          onChange={(e) => setNewProspect({...newProspect, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Phone (Tel)</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='+233 24 000 0000'
                          value={newProspect.phoneNumber}
                          onChange={(e) => setNewProspect({...newProspect, phoneNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Gender</label>
                        <select
                          className='form-select form-select-solid'
                          value={newProspect.gender}
                          onChange={(e) => setNewProspect({...newProspect, gender: e.target.value as 'Male' | 'Female'})}
                        >
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Date of Birth</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='DD/MM/YYYY e.g. 14/05/1992'
                          value={newProspect.dob}
                          onChange={(e) => setNewProspect({...newProspect, dob: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Location & Bottle Preference */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Location & Bottle Preference
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Region (Ghana)</label>
                        <select
                          className='form-select form-select-solid'
                          value={newProspect.region}
                          onChange={(e) => setNewProspect({...newProspect, region: e.target.value})}
                        >
                          {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Bottle Preference</label>
                        <select
                          className='form-select form-select-solid'
                          value={newProspect.preferredSize}
                          onChange={(e) =>
                            setNewProspect({
                              ...newProspect,
                              preferredSize: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (GH₵ 100 • Large)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (GH₵ 85 • Regular)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Verification & Support Caller */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Verification & Support Desk
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Support Caller</label>
                        <select
                          className='form-select form-select-solid'
                          value={newProspect.supportAgent}
                          onChange={(e) => setNewProspect({...newProspect, supportAgent: e.target.value})}
                        >
                          {SUPPORT_AGENTS.map((agent) => (
                            <option key={agent} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Call Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newProspect.callStatus}
                          onChange={(e) =>
                            setNewProspect({
                              ...newProspect,
                              callStatus: e.target.value as 'Call Completed' | 'Pending Call' | 'Follow-up',
                            })
                          }
                        >
                          <option value='Call Completed'>Call Completed</option>
                          <option value='Pending Call'>Pending Call</option>
                          <option value='Follow-up'>Follow-up Needed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Secondary Details (Landmark) */}
                  <div>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        4. Delivery Address & Landmark
                      </span>
                    </div>
                    <div className='row g-4'>
                      <div className='col-12'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Delivery Address & Landmark</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Near Accra Mall, Tetteh Quarshie'
                          value={newProspect.landmark}
                          onChange={(e) => setNewProspect({...newProspect, landmark: e.target.value})}
                        />
                        <div className='form-text text-muted fs-8'>Saved as secondary detail; does not clutter the main table.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setIsAddModalOpen(false)}
                    className='btn btn-light'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Save Prospect
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Make Buyer / Convert Modal with Support Caller */}
      {makeBuyerProspect && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-700px w-100 mx-auto'>
            <div className='modal-content rounded-3 shadow-sm border border-gray-200'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Convert to Honey Subscriber</h3>
                  <span className='text-muted fs-7'>
                    Onboard {makeBuyerProspect.name} as a subscriber after customer support phone call
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => setMakeBuyerProspect(null)}
                  className='btn btn-icon btn-sm btn-light-secondary rounded-circle'
                  aria-label='Close'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmMakeBuyer}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  {/* Prospect Overview Card */}
                  <div className='bg-light-primary rounded-3 p-4 mb-5 border border-primary border-opacity-25'>
                    <div className='row g-3 fs-7'>
                      <div className='col-6'>
                        <span className='text-muted d-block fs-8'>Phone (Tel):</span>
                        <span className='fw-bold text-gray-800 text-truncate d-block'>{makeBuyerProspect.phoneNumber}</span>
                      </div>
                      <div className='col-6'>
                        <span className='text-muted d-block fs-8'>Gender / Dob:</span>
                        <span className='fw-bold text-gray-800 text-truncate d-block'>{makeBuyerProspect.gender} • {makeBuyerProspect.dob}</span>
                      </div>
                      <div className='col-6'>
                        <span className='text-muted d-block fs-8'>Region:</span>
                        <span className='fw-bold text-gray-800 text-truncate d-block'>{makeBuyerProspect.region}</span>
                      </div>
                      <div className='col-6'>
                        <span className='text-muted d-block fs-8'>Product Preference:</span>
                        <span className='badge badge-light-primary fw-bold text-truncate'>{makeBuyerProspect.preferredSize}</span>
                      </div>
                      <div className='col-12 mt-2 pt-2 border-top border-primary border-opacity-25'>
                        <span className='text-muted'>Delivery Landmark:</span>{' '}
                        <span className='fw-bold text-gray-900'>{makeBuyerProspect.landmark}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Customer Classification & Support Caller */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Classification & Support Agent
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Customer Type</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerCustomerType}
                          onChange={(e) =>
                            setBuyerCustomerType(e.target.value as 'Subscriber Only' | 'Active Customer / Buyer')
                          }
                        >
                          <option value='Active Customer / Buyer'>Active Customer / Buyer</option>
                          <option value='Subscriber Only'>Subscriber Only</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Support Caller</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerSupportAgent}
                          onChange={(e) => setBuyerSupportAgent(e.target.value)}
                        >
                          {SUPPORT_AGENTS.map((agent) => (
                            <option key={agent} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Chosen Plan & Bottle Selection */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Plan & Bottle Size
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Chosen Plan</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerPlanType}
                          onChange={(e) =>
                            setBuyerPlanType(e.target.value as 'Monthly Plan' | 'Annual Plan')
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan</option>
                          <option value='Annual Plan'>Annual Plan (10% discount)</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Bottle Size</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerBottleType}
                          onChange={(e) =>
                            setBuyerBottleType(e.target.value as '500g plastic bottles' | '330g plastic bottles')
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (GH₵ 100 • Large)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (GH₵ 85 • Regular)</option>
                        </select>
                        <div className='form-text fs-8 text-muted mt-1'>
                          Product Code: {buyerBottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Quantity & Delivery Frequency */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Quantity & Delivery Frequency
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Quantity (Bottles)</label>
                        <div className='d-flex align-items-center gap-2 mb-2'>
                          <div className='input-group input-group-solid' style={{maxWidth: '140px'}}>
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setBuyerQuantity(Math.max(1, buyerQuantity - 1))}
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min={1}
                              max={200}
                              className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                              required
                              value={buyerQuantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10)
                                setBuyerQuantity(isNaN(val) || val < 1 ? 1 : val)
                              }}
                            />
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setBuyerQuantity(buyerQuantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Delivery Frequency</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerFrequency}
                          onChange={(e) =>
                            setBuyerFrequency(e.target.value as any)
                          }
                        >
                          {ORDERED_FREQUENCIES.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Payment & Dispatch Date */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        4. Payment Details & Dispatch
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-3'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Payment Method</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerPaymentMethod}
                          onChange={(e) =>
                            setBuyerPaymentMethod(
                              e.target.value as 'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery'
                            )
                          }
                        >
                          <option value='MTN Mobile Money'>MTN Mobile Money</option>
                          <option value='Telecel Cash'>Telecel Cash</option>
                          <option value='Bank Card / Visa'>Bank Card / Visa</option>
                          <option value='Cash on Delivery'>Cash on Delivery</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Payment Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={buyerPaymentStatus}
                          onChange={(e) =>
                            setBuyerPaymentStatus(
                              e.target.value as 'Paid' | 'Pending Payment' | 'Annual Pre-paid'
                            )
                          }
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Pending Payment'>Pending Payment</option>
                          <option value='Annual Pre-paid'>Annual Pre-paid</option>
                        </select>
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-12'>
                        <DeliveryCalendarPicker
                          value={buyerFirstDate}
                          onChange={setBuyerFirstDate}
                          label='First Delivery Schedule'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary Card */}
                  <div className='card bg-light-primary border border-primary border-dashed p-4 rounded-3 mb-2'>
                    <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3'>
                      <div>
                        <span className='fw-bold text-gray-800 fs-7 d-block'>
                          {buyerPlanType} • {buyerQuantity}x {buyerBottleType}
                        </span>
                        <span className='text-gray-700 fw-semibold fs-8'>
                          <span className='product-code-tag'>Product Code: {buyerBottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span> • Frequency: {buyerFrequency} • Via {buyerPaymentMethod} ({buyerPaymentStatus})
                        </span>
                      </div>
                      <div className='text-sm-end'>
                        <span className='fs-3 fw-bolder text-primary d-block'>
                          GH₵{' '}
                          {(
                            buyerPlanType === 'Annual Plan'
                              ? Math.round(buyerQuantity * (buyerBottleType === '500g plastic bottles' ? 100 : 85) * 12 * 0.9)
                              : buyerQuantity * (buyerBottleType === '500g plastic bottles' ? 100 : 85)
                          ).toLocaleString()}
                        </span>
                        <span className='badge badge-light-success fs-9 fw-bold'>
                          {buyerPlanType === 'Annual Plan' ? 'Annual (10% Saver)' : 'Billed Monthly'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setMakeBuyerProspect(null)}
                    className='btn btn-light'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-success fw-bold px-6'>
                    <CheckCircle size={16} className='me-1' /> Onboard as Subscriber
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Prospect & Secondary Details Modal */}
      {editProspect && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px w-100 mx-auto'>
            <div className='modal-content rounded-3 shadow-sm border border-gray-200'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>Edit Prospect & Landmark Details</h3>
                <button
                  type='button'
                  onClick={() => setEditProspect(null)}
                  className='btn btn-icon btn-sm btn-light-secondary rounded-circle'
                  aria-label='Close'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  {/* Section 1: Personal Details */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Personal Details
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-3'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Full Name</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          value={editProspect.name}
                          onChange={(e) => setEditProspect({...editProspect, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Phone (Tel)</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          value={editProspect.phoneNumber}
                          onChange={(e) => setEditProspect({...editProspect, phoneNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Gender</label>
                        <select
                          className='form-select form-select-solid'
                          value={editProspect.gender}
                          onChange={(e) => setEditProspect({...editProspect, gender: e.target.value as 'Male' | 'Female'})}
                        >
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Date of Birth</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          value={editProspect.dob}
                          onChange={(e) => setEditProspect({...editProspect, dob: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Location & Bottle Preference */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Location & Bottle Preference
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800 required'>Region (Ghana)</label>
                        <select
                          className='form-select form-select-solid'
                          value={editProspect.region}
                          onChange={(e) => setEditProspect({...editProspect, region: e.target.value})}
                        >
                          {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Bottle Preference</label>
                        <select
                          className='form-select form-select-solid'
                          value={editProspect.preferredSize}
                          onChange={(e) =>
                            setEditProspect({
                              ...editProspect,
                              preferredSize: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (GH₵ 100 • Large)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (GH₵ 85 • Regular)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Verification & Support Caller */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Verification & Support Desk
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Support Caller</label>
                        <select
                          className='form-select form-select-solid'
                          value={editProspect.supportAgent}
                          onChange={(e) => setEditProspect({...editProspect, supportAgent: e.target.value})}
                        >
                          {SUPPORT_AGENTS.map((agent) => (
                            <option key={agent} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Verification Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={editProspect.callStatus}
                          onChange={(e) =>
                            setEditProspect({
                              ...editProspect,
                              callStatus: e.target.value as 'Call Completed' | 'Pending Call' | 'Follow-up',
                            })
                          }
                        >
                          <option value='Call Completed'>Call Completed</option>
                          <option value='Pending Call'>Pending Call</option>
                          <option value='Follow-up'>Follow-up Needed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Secondary Details (Landmark) */}
                  <div>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        4. Delivery Address & Landmark (Secondary Detail)
                      </span>
                    </div>
                    <div className='row g-4'>
                      <div className='col-12'>
                        <label className='form-label fw-semibold fs-7 text-gray-800'>Delivery Address & Landmark</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          value={editProspect.landmark}
                          onChange={(e) => setEditProspect({...editProspect, landmark: e.target.value})}
                        />
                        <div className='form-text text-muted fs-8'>Saved as secondary detail; does not clutter the main table.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-end gap-2'>
                  <button
                    type='button'
                    onClick={() => setEditProspect(null)}
                    className='btn btn-light'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export {ProspectsPage}
