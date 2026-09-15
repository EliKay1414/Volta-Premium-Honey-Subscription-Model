import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {Plus, Search, Calendar, Package, Phone, MapPin, X, Truck, PauseCircle, PlayCircle, Headphones, UserCheck, ShieldCheck, Barcode, CreditCard} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'
import {DeliveryCalendarPicker} from '@/components/calendar/DeliveryCalendarPicker'

export interface Subscriber {
  id: string
  name: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  dob: string
  customerType: 'Subscriber Only' | 'Active Customer / Buyer'
  planType: 'Monthly Plan' | 'Annual Plan' | 'One-Time Buyer'
  bottleChoice: '500g plastic bottles' | '330g plastic bottles'
  sku: string
  quantity: number
  frequency: 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually'
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery'
  paymentStatus: 'Paid' | 'Pending Payment' | 'Annual Pre-paid'
  billAmountGHS: string
  supportAgent: string
  region: string
  landmark: string
  totalBottlesBought: number
  totalSpentGHS: string
  status: 'Active' | 'Paused'
  nextDeliveryDate: string
  firstBuyDate: string
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

export const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phoneNumber: '+233 24 111 2233',
    gender: 'Female',
    dob: '12/04/1990',
    customerType: 'Active Customer / Buyer',
    planType: 'Monthly Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 4,
    frequency: 'Monthly',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Paid',
    billAmountGHS: 'GH₵ 400 / mo',
    supportAgent: 'Abena Osei',
    region: 'Greater Accra',
    landmark: 'Near Airport Residential Area',
    totalBottlesBought: 32,
    totalSpentGHS: 'GH₵ 3,200',
    status: 'Active',
    nextDeliveryDate: 'Sep 15, 2026',
    firstBuyDate: 'Jan 10, 2026',
    avatarColor: 'primary',
  },
  {
    id: '2',
    name: 'Michael Davis',
    phoneNumber: '+233 20 333 4455',
    gender: 'Male',
    dob: '28/09/1986',
    customerType: 'Subscriber Only',
    planType: 'Monthly Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 3,
    frequency: 'Monthly',
    paymentMethod: 'Telecel Cash',
    paymentStatus: 'Paid',
    billAmountGHS: 'GH₵ 300 / mo',
    supportAgent: 'Kofi Addo',
    region: 'Ashanti',
    landmark: 'Danyame, Near Golden Tulip',
    totalBottlesBought: 21,
    totalSpentGHS: 'GH₵ 2,100',
    status: 'Active',
    nextDeliveryDate: 'Sep 18, 2026',
    firstBuyDate: 'Feb 14, 2026',
    avatarColor: 'success',
  },
  {
    id: '3',
    name: 'David Wilson',
    phoneNumber: '+233 55 555 6677',
    gender: 'Male',
    dob: '17/02/1993',
    customerType: 'Active Customer / Buyer',
    planType: 'Annual Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 3,
    frequency: 'Monthly',
    paymentMethod: 'Bank Card / Visa',
    paymentStatus: 'Annual Pre-paid',
    billAmountGHS: 'GH₵ 3,240 / yr',
    supportAgent: 'Elikplim Mensah',
    region: 'Central',
    landmark: 'Near University Hospital, Cape Coast',
    totalBottlesBought: 18,
    totalSpentGHS: 'GH₵ 3,240',
    status: 'Active',
    nextDeliveryDate: 'Sep 25, 2026',
    firstBuyDate: 'Mar 20, 2026',
    avatarColor: 'primary',
  },
  {
    id: '4',
    name: 'Olivia Martinez',
    phoneNumber: '+233 27 777 8899',
    gender: 'Female',
    dob: '03/11/1995',
    customerType: 'Subscriber Only',
    planType: 'Monthly Plan',
    bottleChoice: '330g plastic bottles',
    sku: 'VIV-330-PL',
    quantity: 2,
    frequency: 'Bi-Weekly',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Pending Payment',
    billAmountGHS: 'GH₵ 170 / mo',
    supportAgent: 'Daniel Arthur',
    region: 'Volta',
    landmark: 'Near Mawuli Estate, Ho',
    totalBottlesBought: 10,
    totalSpentGHS: 'GH₵ 850',
    status: 'Paused',
    nextDeliveryDate: 'Paused',
    firstBuyDate: 'Apr 05, 2026',
    avatarColor: 'secondary',
  },
  {
    id: '5',
    name: 'James Taylor',
    phoneNumber: '+233 24 999 0011',
    gender: 'Male',
    dob: '21/07/1983',
    customerType: 'Active Customer / Buyer',
    planType: 'Annual Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 4,
    frequency: 'Monthly',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Annual Pre-paid',
    billAmountGHS: 'GH₵ 4,320 / yr',
    supportAgent: 'Patricia Ansah',
    region: 'Greater Accra',
    landmark: 'East Legon, Near American House',
    totalBottlesBought: 24,
    totalSpentGHS: 'GH₵ 4,320',
    status: 'Active',
    nextDeliveryDate: 'Oct 02, 2026',
    firstBuyDate: 'May 01, 2026',
    avatarColor: 'dark',
  },
  {
    id: '6',
    name: 'Grace Mensah',
    phoneNumber: '+233 50 678 9012',
    gender: 'Female',
    dob: '09/09/1994',
    customerType: 'Active Customer / Buyer',
    planType: 'Monthly Plan',
    bottleChoice: '330g plastic bottles',
    sku: 'VIV-330-PL',
    quantity: 2,
    frequency: 'Monthly',
    paymentMethod: 'Telecel Cash',
    paymentStatus: 'Paid',
    billAmountGHS: 'GH₵ 170 / mo',
    supportAgent: 'Abena Osei',
    region: 'Greater Accra',
    landmark: 'Community 1, Tema',
    totalBottlesBought: 8,
    totalSpentGHS: 'GH₵ 680',
    status: 'Active',
    nextDeliveryDate: 'Oct 05, 2026',
    firstBuyDate: 'Jun 12, 2026',
    avatarColor: 'success',
  },
]

const SubscribersPage: FC = () => {
  const {showToast} = useNotifications()
  const [subscribers, setSubscribers] = usePersistentState<Subscriber[]>('vivaldi_subscribers', mockSubscribers)
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | number | null>('vivaldi_subscribers_highlight_row', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_subscribers_highlight_col', null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Paused'>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Subscriber Only' | 'Active Customer / Buyer'>('All')
  const [planFilter, setPlanFilter] = useState<'All' | 'Monthly Plan' | 'Annual Plan'>('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [managingSubscriber, setManagingSubscriber] = useState<Subscriber | null>(null)

  // Add form state
  const [newSub, setNewSub] = useState({
    name: '',
    phoneNumber: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '15/06/1993',
    customerType: 'Subscriber Only' as 'Subscriber Only' | 'Active Customer / Buyer',
    planType: 'Monthly Plan' as 'Monthly Plan' | 'Annual Plan',
    bottleChoice: '500g plastic bottles' as '500g plastic bottles' | '330g plastic bottles',
    quantity: 4,
    frequency: 'Monthly' as 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Semi-annually' | 'Annually',
    paymentMethod: 'MTN Mobile Money' as 'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery',
    paymentStatus: 'Paid' as 'Paid' | 'Pending Payment' | 'Annual Pre-paid',
    supportAgent: 'Abena Osei',
    region: 'Greater Accra',
    landmark: '',
    nextDeliveryDate: 'Sep 28, 2026',
  })

  const calculatePlanBill = (
    bottleChoice: '500g plastic bottles' | '330g plastic bottles',
    quantity: number,
    planType: 'Monthly Plan' | 'Annual Plan'
  ) => {
    const unit = bottleChoice === '500g plastic bottles' ? 100 : 85
    const monthlyTotal = quantity * unit
    if (planType === 'Annual Plan') {
      // 10% annual saver discount
      const discountedYearly = Math.round(monthlyTotal * 12 * 0.9)
      return `GH₵ ${discountedYearly.toLocaleString()} / yr`
    }
    return `GH₵ ${monthlyTotal.toLocaleString()} / mo`
  }

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSub.name || !newSub.phoneNumber) return

    const skuCode = newSub.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'
    const bill = calculatePlanBill(newSub.bottleChoice, Number(newSub.quantity), newSub.planType)

    const created: Subscriber = {
      id: `sub-${Date.now()}`,
      name: newSub.name,
      phoneNumber: newSub.phoneNumber,
      gender: newSub.gender,
      dob: newSub.dob || '01/01/1990',
      customerType: newSub.customerType,
      planType: newSub.planType,
      bottleChoice: newSub.bottleChoice,
      sku: skuCode,
      quantity: Number(newSub.quantity),
      frequency: newSub.frequency,
      paymentMethod: newSub.paymentMethod,
      paymentStatus: newSub.paymentStatus,
      billAmountGHS: bill,
      supportAgent: newSub.supportAgent,
      region: newSub.region,
      landmark: newSub.landmark || 'Ghana Address',
      totalBottlesBought: Number(newSub.quantity),
      totalSpentGHS: bill.split(' ')[1] ? `GH₵ ${bill.split(' ')[1]}` : 'GH₵ 400',
      status: 'Active',
      nextDeliveryDate: newSub.nextDeliveryDate,
      firstBuyDate: 'Just now',
      avatarColor: 'primary',
    }

    setSubscribers([created, ...subscribers])
    setHighlightedRowId(created.id)
    setHighlightedColId('name')
    setIsAddModalOpen(false)
    setNewSub({
      name: '',
      phoneNumber: '',
      gender: 'Male',
      dob: '15/06/1993',
      customerType: 'Subscriber Only',
      planType: 'Monthly Plan',
      bottleChoice: '500g plastic bottles',
      quantity: 4,
      frequency: 'Monthly',
      paymentMethod: 'MTN Mobile Money',
      paymentStatus: 'Paid',
      supportAgent: 'Abena Osei',
      region: 'Greater Accra',
      landmark: '',
      nextDeliveryDate: 'Sep 28, 2026',
    })

    showToast({
      category: 'subscriber',
      title: 'Subscriber Enrolled',
      description: `${created.name} enrolled on ${created.planType} (${created.billAmountGHS}) by Support (${created.supportAgent})`,
      badgeColor: 'success',
    })
  }

  const handleToggleStatus = (subId: string) => {
    setHighlightedRowId(subId)
    setHighlightedColId('status')
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const nextStatus = s.status === 'Active' ? 'Paused' : 'Active'
          const updated: Subscriber = {
            ...s,
            status: nextStatus,
            nextDeliveryDate: nextStatus === 'Active' ? 'Next Monday' : 'Paused',
          }
          setManagingSubscriber(updated)
          showToast({
            category: 'subscriber',
            title: `Subscriber ${nextStatus}`,
            description: `${s.name}'s plan has been ${nextStatus.toLowerCase()}`,
            badgeColor: nextStatus === 'Active' ? 'success' : 'warning',
          })
          return updated
        }
        return s
      })
    )
  }

  const handleDispatchImmediateDelivery = (sub: Subscriber) => {
    setHighlightedRowId(sub.id)
    setHighlightedColId('status')
    showToast({
      category: 'delivery',
      title: 'Instant Delivery Dispatched',
      description: `Dispatched ${sub.quantity}x ${sub.bottleChoice} (Product Code: ${sub.sku}) to ${sub.name}`,
      badgeColor: 'primary',
      link: '/delivery',
      linkLabel: 'View Deliveries',
    })
    setManagingSubscriber(null)
  }

  const handleSaveManage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!managingSubscriber) return

    const skuCode = managingSubscriber.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'
    const bill = calculatePlanBill(
      managingSubscriber.bottleChoice,
      Number(managingSubscriber.quantity),
      managingSubscriber.planType === 'Annual Plan' ? 'Annual Plan' : 'Monthly Plan'
    )

    const updated: Subscriber = {
      ...managingSubscriber,
      sku: skuCode,
      billAmountGHS: bill,
    }

    setSubscribers((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    )
    setHighlightedRowId(updated.id)
    setHighlightedColId('sku')

    showToast({
      category: 'subscriber',
      title: 'Subscriber Plan Updated',
      description: `Plan for ${updated.name} saved (${updated.planType} • ${updated.billAmountGHS})`,
      badgeColor: 'primary',
    })

    setManagingSubscriber(null)
  }

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phoneNumber.includes(searchTerm) ||
      sub.supportAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || sub.region === selectedRegion
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter
    const matchesType = typeFilter === 'All' || sub.customerType === typeFilter
    const matchesPlan = planFilter === 'All' || sub.planType === planFilter
    return matchesSearch && matchesRegion && matchesStatus && matchesType && matchesPlan
  })

  // Columns definition: Primary order (Name, Tel, Gender, Dob, Type, Plan, SKU, Qty/Freq, Payment, Caller, Status, Region, Action)
  const columns: ShadcnColumn<Subscriber>[] = [
    {
      id: 'name',
      header: 'Buyer Name',
      accessor: 'name',
      render: (item) => (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-40px me-3'>
            <span className={`symbol-label bg-light-${item.avatarColor} text-${item.avatarColor} fw-bold`}>
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div className='d-flex flex-column'>
            <span className='text-gray-900 fw-bold fs-6 text-nowrap'>{item.name}</span>
            <span className='text-muted fs-8 text-nowrap'>Customer since {item.firstBuyDate}</span>
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
        <span className='badge badge-light fw-bold text-gray-700 fs-8'>
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
      id: 'customerType',
      header: 'Customer Type',
      accessor: 'customerType',
      render: (item) => {
        const isBuyer = item.customerType === 'Active Customer / Buyer'
        return (
          <span
            className={`badge ${
              isBuyer ? 'badge-light-success text-success' : 'badge-light-primary text-primary'
            } fw-bold fs-8 text-nowrap d-inline-flex align-items-center gap-1`}
          >
            {isBuyer ? <UserCheck size={12} /> : <ShieldCheck size={12} />}
            {item.customerType}
          </span>
        )
      },
    },
    {
      id: 'planType',
      header: 'Chosen Plan',
      accessor: 'planType',
      render: (item) => {
        const isAnnual = item.planType === 'Annual Plan'
        return (
          <div className='d-flex flex-column text-nowrap'>
            <span className={`badge ${isAnnual ? 'badge-light-warning text-warning' : 'badge-light-info text-info'} fw-bold fs-8 w-fit`}>
              {item.planType}
            </span>
            <span className='fw-bold text-gray-900 fs-8 mt-1'>{item.billAmountGHS}</span>
          </div>
        )
      },
    },
    {
      id: 'bottleChoice',
      header: 'Bottle & Product Code',
      accessor: 'bottleChoice',
      render: (item) => (
        <div className='d-flex flex-column text-nowrap'>
          <span className='badge badge-light-primary fw-bold fs-8 w-fit'>
            {item.bottleChoice}
          </span>
          <span className='product-code-text fs-8 mt-1 d-flex align-items-center'>
            <Barcode size={12} className='me-1 text-gray-500' />
            Product Code: {item.sku}
          </span>
        </div>
      ),
    },
    {
      id: 'quantity',
      header: 'Quantity & Frequency',
      accessor: 'quantity',
      render: (item) => (
        <div className='d-flex flex-column text-nowrap'>
          <span className='text-gray-900 fw-bold fs-7 d-flex align-items-center'>
            <Package size={13} className='text-primary me-1.5 flex-shrink-0' />
            {item.quantity} Bottles
          </span>
          <span className='text-muted fs-8'>{item.frequency}</span>
        </div>
      ),
    },
    {
      id: 'paymentStatus',
      header: 'Payment Follows',
      accessor: 'paymentStatus',
      render: (item) => {
        const isPaid = item.paymentStatus === 'Paid' || item.paymentStatus === 'Annual Pre-paid'
        return (
          <div className='d-flex flex-column text-nowrap'>
            <span className={`badge ${isPaid ? 'badge-light-success text-success' : 'badge-light-warning text-warning'} fw-bold fs-8 w-fit d-inline-flex align-items-center gap-1`}>
              <CreditCard size={11} />
              {item.paymentStatus}
            </span>
            <span className='text-muted fs-8 mt-0.5'>{item.paymentMethod}</span>
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
            <span className='text-success fs-9 fw-semibold'>Profile Verified</span>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span
          className={`badge badge-light-${
            item.status === 'Active' ? 'success' : 'secondary'
          } fw-bold text-nowrap`}
        >
          {item.status}
        </span>
      ),
    },
    {
      id: 'region',
      header: 'Region',
      accessor: 'region',
      render: (item) => (
        <span className='badge badge-light fw-bold text-gray-800 text-nowrap'>
          {item.region}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      sortable: false,
      headerClassName: 'text-end',
      className: 'text-end',
      render: (item) => (
        <button
          type='button'
          onClick={() => {
            setManagingSubscriber(item)
            setHighlightedRowId(item.id)
            setHighlightedColId('sku')
          }}
          className='btn btn-xs btn-light btn-active-light-primary fw-bold text-nowrap'
          title='View secondary details & manage plan'
        >
          Manage
        </button>
      ),
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>Subscribers</PageTitle>

      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Subscribers & Honey Buyers</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              List of monthly and annual subscribers with quantity, schedule, bottle size, and payments
            </span>
          </h3>
          <div className='card-toolbar'>
            <button
              type='button'
              onClick={() => setIsAddModalOpen(true)}
              className='btn btn-sm btn-primary fw-bold d-flex align-items-center'
            >
              <Plus size={16} className='me-2' /> Add Subscriber
            </button>
          </div>
        </div>

        <div className='card-body py-4'>
          {/* Symmetrical & Clean Filters Bar */}
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5'>
            <div className='d-flex flex-wrap align-items-center gap-3 w-100 w-lg-auto'>
              {/* Search */}
              <div className='position-relative w-100 w-md-250px'>
                <input
                  type='text'
                  className='form-control form-control-solid ps-10'
                  placeholder='Search name, phone, SKU...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className='position-absolute top-50 start-0 translate-middle-y ms-3 text-gray-500'>
                  <Search size={16} />
                </span>
              </div>

              {/* 16 Ghana Regions Dropdown */}
              <div className='w-100 w-md-180px'>
                <select
                  className='form-select form-select-solid'
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All 16 Regions' : r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Type Selector */}
              <div className='w-100 w-md-160px'>
                <select
                  className='form-select form-select-solid'
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                >
                  <option value='All'>All Plans</option>
                  <option value='Monthly Plan'>Monthly Plan</option>
                  <option value='Annual Plan'>Annual Plan</option>
                </select>
              </div>

              {/* Status Select Dropdown (Consolidated to eliminate duplicate 'All' button) */}
              <div className='w-100 w-md-150px'>
                <select
                  className='form-select form-select-solid'
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value='All'>All Statuses</option>
                  <option value='Active'>Active</option>
                  <option value='Paused'>Paused</option>
                </select>
              </div>
            </div>

            {/* Customer Type Filter Tabs (Single button group, no duplicate 'All') */}
            <div className='btn-group'>
              {(['All', 'Subscriber Only', 'Active Customer / Buyer'] as const).map((t) => (
                <button
                  key={t}
                  type='button'
                  className={`btn btn-sm ${
                    typeFilter === t ? 'btn-primary' : 'btn-light'
                  } fw-semibold fs-8`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t === 'All' ? 'All Types' : t === 'Subscriber Only' ? 'Subscribers Only' : 'Active Buyers'}
                </button>
              ))}
            </div>
          </div>

          {/* Shadcn UI Table */}
          <ShadcnTable
            data={filteredSubscribers}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
            emptyMessage='No subscribers found matching your criteria'
            keyExtractor={(sub) => sub.id}
            highlightedRowId={highlightedRowId}
            highlightedColId={highlightedColId}
            onRowClick={(sub) => setHighlightedRowId(sub.id)}
          />
        </div>
      </div>

      {/* MODAL 1: Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-750px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-6 px-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Add New Honey Subscriber</h3>
                  <span className='text-muted fs-7'>Register subscriber details, bottle preference, delivery frequency, and plan</span>
                </div>
                <button
                  type='button'
                  onClick={() => setIsAddModalOpen(false)}
                  className='btn btn-icon btn-sm btn-active-light rounded-circle'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubscriber}>
                <div className='modal-body py-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  {/* Section 1: Personal Information */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Personal Details
                      </span>
                    </div>
                    <div className='row g-4 mb-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Buyer Full Name</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Sarah Johnson'
                          value={newSub.name}
                          onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Phone Number</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='+233 24 000 0000'
                          value={newSub.phoneNumber}
                          onChange={(e) => setNewSub({...newSub, phoneNumber: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Gender</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.gender}
                          onChange={(e) => setNewSub({...newSub, gender: e.target.value as 'Male' | 'Female'})}
                        >
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Date of Birth (Dob)</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='DD/MM/YYYY'
                          value={newSub.dob}
                          onChange={(e) => setNewSub({...newSub, dob: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Bottle Preference & Delivery */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Bottle & Delivery Preferences
                      </span>
                    </div>

                    <div className='row g-4 mb-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Bottle Size</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.bottleChoice}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              bottleChoice: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (Large • Product Code: VIV-500-PL • GH₵ 100 each)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (Regular • Product Code: VIV-330-PL • GH₵ 85 each)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Delivery Frequency</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.frequency}
                          onChange={(e) => setNewSub({...newSub, frequency: e.target.value as any})}
                        >
                          {ORDERED_FREQUENCIES.map((freq) => (
                            <option key={freq.value} value={freq.value}>
                              {freq.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>
                          Quantity (Bottles per delivery)
                        </label>
                        <div className='input-group input-group-solid' style={{maxWidth: '140px'}}>
                          <button
                            type='button'
                            className='btn btn-light-primary px-3 py-2 fw-bold'
                            onClick={() => setNewSub({...newSub, quantity: Math.max(1, newSub.quantity - 1)})}
                          >
                            −
                          </button>
                          <input
                            type='number'
                            min={1}
                            max={200}
                            className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                            value={newSub.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10)
                              setNewSub({...newSub, quantity: isNaN(val) || val < 1 ? 1 : val})
                            }}
                            required
                          />
                          <button
                            type='button'
                            className='btn btn-light-primary px-3 py-2 fw-bold'
                            onClick={() => setNewSub({...newSub, quantity: newSub.quantity + 1})}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Plan Selection</label>
                        <select
                          className='form-select form-select-solid mb-3'
                          value={newSub.planType}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              planType: e.target.value as 'Monthly Plan' | 'Annual Plan',
                            })
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan (Billed monthly)</option>
                          <option value='Annual Plan'>Annual Plan (Full year with 10% discount)</option>
                        </select>

                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Classification</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.customerType}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              customerType: e.target.value as 'Subscriber Only' | 'Active Customer / Buyer',
                            })
                          }
                        >
                          <option value='Subscriber Only'>Subscriber Only</option>
                          <option value='Active Customer / Buyer'>Active Customer / Buyer</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Payment Details */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Payment Details
                      </span>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Payment Method</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.paymentMethod}
                          onChange={(e) => setNewSub({...newSub, paymentMethod: e.target.value as any})}
                        >
                          <option value='MTN Mobile Money'>MTN Mobile Money (MoMo)</option>
                          <option value='Telecel Cash'>Telecel Cash (Vodafone Cash)</option>
                          <option value='Bank Card / Visa'>Bank Card / Visa / MasterCard</option>
                          <option value='Cash on Delivery'>Cash on Delivery</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Payment Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.paymentStatus}
                          onChange={(e) => setNewSub({...newSub, paymentStatus: e.target.value as any})}
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Pending Payment'>Pending Payment</option>
                          <option value='Annual Pre-paid'>Annual Pre-paid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Plan Fee Summary Card */}
                  <div className='card bg-light-primary border-primary border border-dashed p-4 rounded-3 mb-5'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div>
                        <span className='fw-bold text-gray-800 fs-7 d-block'>Calculated Plan Fee:</span>
                        <span className='text-gray-700 fw-semibold fs-8'>
                          {newSub.quantity} × {newSub.bottleChoice} (<span className='product-code-tag'>Product Code: {newSub.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span>) • {newSub.planType} • {newSub.frequency}
                        </span>
                      </div>
                      <div className='text-end'>
                        <span className='fs-3 fw-bolder text-primary'>
                          {calculatePlanBill(newSub.bottleChoice, newSub.quantity, newSub.planType)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Support & Location */}
                  <div>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        4. Support Desk & Delivery Address
                      </span>
                    </div>
                    <div className='row g-4 mb-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Customer Support Caller</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.supportAgent}
                          onChange={(e) => setNewSub({...newSub, supportAgent: e.target.value})}
                        >
                          {SUPPORT_AGENTS.map((agent) => (
                            <option key={agent} value={agent}>
                              {agent}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700 required'>Region (Ghana)</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.region}
                          onChange={(e) => setNewSub({...newSub, region: e.target.value})}
                        >
                          {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700'>Delivery Landmark / Address</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Near Airport Residential Area'
                          value={newSub.landmark}
                          onChange={(e) => setNewSub({...newSub, landmark: e.target.value})}
                        />
                      </div>
                      <div className='col-md-6'>
                        <DeliveryCalendarPicker
                          value={newSub.nextDeliveryDate}
                          onChange={(date) => setNewSub({...newSub, nextDeliveryDate: date})}
                          label='Next Delivery Schedule'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-8 pb-6'>
                  <button
                    type='button'
                    onClick={() => setIsAddModalOpen(false)}
                    className='btn btn-sm btn-light'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-sm btn-primary fw-bold'>
                    Save Subscriber
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Manage Subscriber Modal */}
      {managingSubscriber && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-750px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>{managingSubscriber.name}</h3>
                  <span className='text-muted fs-7'>
                    {managingSubscriber.phoneNumber} • {managingSubscriber.gender} • Dob: {managingSubscriber.dob}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={() => setManagingSubscriber(null)}
                  className='btn btn-icon btn-sm btn-active-light rounded-circle'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveManage}>
                <div className='modal-body py-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  {/* Financial & Delivery Stats */}
                  <div className='bg-light-primary rounded-3 p-4 mb-4 border border-primary border-opacity-25'>
                    <div className='row g-3 fs-7'>
                      <div className='col-3'>
                        <span className='text-muted d-block fs-8'>Plan Billing</span>
                        <span className='fw-bolder text-primary fs-6'>{managingSubscriber.billAmountGHS}</span>
                      </div>
                      <div className='col-3'>
                        <span className='text-muted d-block fs-8'>Total Delivered</span>
                        <span className='fw-bolder text-gray-900 fs-6'>
                          {managingSubscriber.totalBottlesBought} Bottles
                        </span>
                      </div>
                      <div className='col-3'>
                        <span className='text-muted d-block fs-8'>Payment Status</span>
                        <span className='badge badge-light-success fw-bold mt-1'>
                          {managingSubscriber.paymentStatus}
                        </span>
                      </div>
                      <div className='col-3'>
                        <span className='text-muted d-block fs-8'>Current Status</span>
                        <span
                          className={`badge badge-light-${
                            managingSubscriber.status === 'Active' ? 'success' : 'secondary'
                          } fw-bold mt-1`}
                        >
                          {managingSubscriber.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Plan & Classification */}
                  <div className='mb-4'>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700'>Chosen Plan</label>
                        <select
                          className='form-select form-select-solid'
                          value={managingSubscriber.planType}
                          onChange={(e) =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              planType: e.target.value as 'Monthly Plan' | 'Annual Plan',
                            })
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan (Billed monthly)</option>
                          <option value='Annual Plan'>Annual Plan (Full year with 10% discount)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700'>Customer Classification</label>
                        <select
                          className='form-select form-select-solid'
                          value={managingSubscriber.customerType}
                          onChange={(e) =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              customerType: e.target.value as 'Subscriber Only' | 'Active Customer / Buyer',
                            })
                          }
                        >
                          <option value='Subscriber Only'>Subscriber Only</option>
                          <option value='Active Customer / Buyer'>Active Customer / Buyer</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Bottle & Delivery Frequency */}
                  <div className='mb-4'>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700'>Bottle Size</label>
                        <select
                          className='form-select form-select-solid'
                          value={managingSubscriber.bottleChoice}
                          onChange={(e) =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              bottleChoice: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                              sku: e.target.value === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (Large • Product Code: VIV-500-PL • GH₵ 100 each)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (Regular • Product Code: VIV-330-PL • GH₵ 85 each)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold fs-7 text-gray-700'>Delivery Frequency</label>
                        <select
                          className='form-select form-select-solid'
                          value={managingSubscriber.frequency}
                          onChange={(e) =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              frequency: e.target.value as any,
                            })
                          }
                        >
                          {ORDERED_FREQUENCIES.map((freq) => (
                            <option key={freq.value} value={freq.value}>
                              {freq.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Quantity with Stepper and Presets */}
                  <div className='mb-4'>
                    <label className='form-label fw-bold fs-7 text-gray-700'>Quantity (Bottles per delivery)</label>
                    <div className='d-flex align-items-center gap-2 mb-2'>
                      <div className='input-group input-group-solid' style={{maxWidth: '140px'}}>
                        <button
                          type='button'
                          className='btn btn-light-primary px-3 py-2 fw-bold'
                          onClick={() =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              quantity: Math.max(1, (managingSubscriber.quantity || 1) - 1),
                            })
                          }
                        >
                          −
                        </button>
                        <input
                          type='number'
                          min={1}
                          max={200}
                          className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                          value={managingSubscriber.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10)
                            setManagingSubscriber({
                              ...managingSubscriber,
                              quantity: isNaN(val) || val < 1 ? 1 : val,
                            })
                          }}
                        />
                        <button
                          type='button'
                          className='btn btn-light-primary px-3 py-2 fw-bold'
                          onClick={() =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              quantity: (managingSubscriber.quantity || 1) + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Plan Billing Summary Card */}
                  <div className='card bg-light-primary border-primary border border-dashed p-4 rounded-3 mb-4'>
                    <div className='d-flex align-items-center justify-content-between'>
                      <div>
                        <span className='fw-bold text-gray-800 fs-7 d-block'>Recalculated Plan Fee:</span>
                        <span className='text-gray-700 fw-semibold fs-8'>
                          {managingSubscriber.quantity} × {managingSubscriber.bottleChoice} (<span className='product-code-tag'>Product Code: {managingSubscriber.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span>) • {managingSubscriber.planType} • {managingSubscriber.frequency}
                        </span>
                      </div>
                      <div className='text-end'>
                        <span className='fs-3 fw-bolder text-primary'>
                          {calculatePlanBill(
                            managingSubscriber.bottleChoice,
                            Number(managingSubscriber.quantity),
                            managingSubscriber.planType === 'Annual Plan' ? 'Annual Plan' : 'Monthly Plan'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Payment Details */}
                  <div className='row g-4 mb-4'>
                    <div className='col-md-6'>
                      <label className='form-label fw-bold fs-7 text-gray-700'>Payment Method</label>
                      <select
                        className='form-select form-select-solid'
                        value={managingSubscriber.paymentMethod}
                        onChange={(e) =>
                          setManagingSubscriber({
                            ...managingSubscriber,
                            paymentMethod: e.target.value as any,
                          })
                        }
                      >
                        <option value='MTN Mobile Money'>MTN Mobile Money (MoMo)</option>
                        <option value='Telecel Cash'>Telecel Cash (Vodafone Cash)</option>
                        <option value='Bank Card / Visa'>Bank Card / Visa / MasterCard</option>
                        <option value='Cash on Delivery'>Cash on Delivery</option>
                      </select>
                    </div>

                    <div className='col-md-6'>
                      <label className='form-label fw-bold fs-7 text-gray-700'>Payment Status</label>
                      <select
                        className='form-select form-select-solid'
                        value={managingSubscriber.paymentStatus}
                        onChange={(e) =>
                          setManagingSubscriber({
                            ...managingSubscriber,
                            paymentStatus: e.target.value as any,
                          })
                        }
                      >
                        <option value='Paid'>Paid</option>
                        <option value='Pending Payment'>Pending Payment</option>
                        <option value='Annual Pre-paid'>Annual Pre-paid</option>
                      </select>
                    </div>
                  </div>

                  {/* Section 5: Support Desk & Location */}
                  <div className='row g-4 mb-4'>
                    <div className='col-md-6'>
                      <label className='form-label fw-bold fs-7 text-gray-700'>Customer Support Caller</label>
                      <select
                        className='form-select form-select-solid'
                        value={managingSubscriber.supportAgent}
                        onChange={(e) =>
                          setManagingSubscriber({
                            ...managingSubscriber,
                            supportAgent: e.target.value,
                          })
                        }
                      >
                        {SUPPORT_AGENTS.map((agent) => (
                          <option key={agent} value={agent}>
                            {agent}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='col-md-6'>
                      <label className='form-label fw-bold fs-7 text-gray-700'>Region</label>
                      <select
                        className='form-select form-select-solid'
                        value={managingSubscriber.region}
                        onChange={(e) =>
                          setManagingSubscriber({
                            ...managingSubscriber,
                            region: e.target.value,
                          })
                        }
                      >
                        {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Secondary Details: Landmark / Address & Next Delivery Schedule */}
                  <div className='row g-4 mb-4'>
                    <div className='col-md-6'>
                      <label className='form-label fw-bold fs-7 text-gray-700'>Delivery Landmark / Exact Address</label>
                      <div className='position-relative'>
                        <input
                          type='text'
                          className='form-control form-control-solid ps-10'
                          value={managingSubscriber.landmark}
                          onChange={(e) =>
                            setManagingSubscriber({
                              ...managingSubscriber,
                              landmark: e.target.value,
                            })
                          }
                        />
                        <MapPin size={16} className='position-absolute top-50 start-0 translate-middle-y ms-3 text-primary' />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <DeliveryCalendarPicker
                        value={managingSubscriber.nextDeliveryDate}
                        onChange={(date) =>
                          setManagingSubscriber({
                            ...managingSubscriber,
                            nextDeliveryDate: date,
                          })
                        }
                        label='Next Delivery Schedule'
                      />
                    </div>
                  </div>

                  {/* Immediate Action Buttons */}
                  <div className='d-flex gap-3 pt-2'>
                    <button
                      type='button'
                      onClick={() => handleToggleStatus(managingSubscriber.id)}
                      className={`btn btn-sm flex-grow-1 ${
                        managingSubscriber.status === 'Active' ? 'btn-light-warning' : 'btn-light-success'
                      } fw-bold d-flex align-items-center justify-content-center`}
                    >
                      {managingSubscriber.status === 'Active' ? (
                        <>
                          <PauseCircle size={15} className='me-1' /> Pause Subscription
                        </>
                      ) : (
                        <>
                          <PlayCircle size={15} className='me-1' /> Activate Subscription
                        </>
                      )}
                    </button>

                    <button
                      type='button'
                      onClick={() => handleDispatchImmediateDelivery(managingSubscriber)}
                      className='btn btn-sm btn-primary fw-bold d-flex align-items-center justify-content-center'
                    >
                      <Truck size={15} className='me-1' /> Instant Delivery
                    </button>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-8 pb-6'>
                  <button
                    type='button'
                    onClick={() => setManagingSubscriber(null)}
                    className='btn btn-sm btn-light'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-sm btn-primary fw-bold'>
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

export {SubscribersPage}
