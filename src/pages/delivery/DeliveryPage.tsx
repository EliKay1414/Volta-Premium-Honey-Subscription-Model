import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {Truck, Search, Phone, MapPin, CheckCircle, Package, Plus, X, Building2, UserCheck, ShieldCheck, Navigation, Barcode, Calendar, Download} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'

export interface DeliveryRecord {
  id: string
  trackingCode: string
  recipientName: string
  recipientType: 'Vendor' | 'Subscriber' | 'Customer / Buyer'
  phoneNumber: string
  region: string
  landmark: string
  honeyPackage: string
  bottleType: '500g plastic bottles' | '330g plastic bottles'
  sku: string
  numberOfBottles: number
  planType: 'Monthly Plan' | 'Annual Plan' | 'Wholesale Batch' | 'One-Time Order'
  frequency:
    | 'Weekly Dispatch'
    | 'Bi-Weekly Refill'
    | 'Monthly Refill'
    | 'Quarterly Refill'
    | 'Semi-annually Refill'
    | 'Annually Dispatch'
    | 'One-Time Delivery'
  perimeterTier: 'Tier 1 (0-5 km)' | 'Tier 2 (5-15 km)' | 'Tier 3 (15 km+)'
  deliveryFeeGHS: 'GH₵ 20.00' | 'GH₵ 40.00' | 'GH₵ 100.00'
  paymentStatus: 'Paid' | 'Pending Payment' | 'Annual Pre-paid'
  deliveryDate: string
  riderName: string
  riderPhone: string
  status: 'Delivered' | 'On the Way' | 'Packing'
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

const PERIMETER_FEE_MAP = {
  'Tier 1 (0-5 km)': 'GH₵ 20.00' as const,
  'Tier 2 (5-15 km)': 'GH₵ 40.00' as const,
  'Tier 3 (15 km+)': 'GH₵ 100.00' as const,
}

const ORDERED_FREQUENCIES = [
  {value: 'Weekly Dispatch', label: 'Weekly (Every 7 days)'},
  {value: 'Bi-Weekly Refill', label: 'Bi-weekly (Every 2 weeks)'},
  {value: 'Monthly Refill', label: 'Monthly (Once a month)'},
  {value: 'Quarterly Refill', label: 'Quarterly (Every 3 months)'},
  {value: 'Semi-annually Refill', label: 'Semi-annually (Every 6 months)'},
  {value: 'Annually Dispatch', label: 'Annually (Once a year)'},
  {value: 'One-Time Delivery', label: 'One-Time Delivery (Single fulfillment)'},
] as const

const mockDeliveries: DeliveryRecord[] = [
  {
    id: '1',
    trackingCode: 'DEL-081',
    recipientName: 'Sarah Johnson',
    recipientType: 'Subscriber',
    phoneNumber: '+233 24 111 2233',
    region: 'Greater Accra',
    landmark: 'Near Airport Residential Area',
    honeyPackage: '4 x 500g plastic bottles',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 4,
    planType: 'Monthly Plan',
    frequency: 'Monthly Refill',
    perimeterTier: 'Tier 1 (0-5 km)',
    deliveryFeeGHS: 'GH₵ 20.00',
    paymentStatus: 'Paid',
    deliveryDate: 'Today',
    riderName: 'Kofi Mensah',
    riderPhone: '+233 24 555 1234',
    status: 'On the Way',
  },
  {
    id: '2',
    trackingCode: 'DEL-080',
    recipientName: 'Melcom Central Mart',
    recipientType: 'Vendor',
    phoneNumber: '+233 30 222 8899',
    region: 'Ashanti',
    landmark: 'Adum Commercial Area, Kumasi',
    honeyPackage: '20 x 500g plastic bottles',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 20,
    planType: 'Wholesale Batch',
    frequency: 'Monthly Refill',
    perimeterTier: 'Tier 2 (5-15 km)',
    deliveryFeeGHS: 'GH₵ 40.00',
    paymentStatus: 'Paid',
    deliveryDate: 'Yesterday',
    riderName: 'Yaw Boateng',
    riderPhone: '+233 20 666 2345',
    status: 'Delivered',
  },
  {
    id: '3',
    trackingCode: 'DEL-079',
    recipientName: 'David Wilson',
    recipientType: 'Customer / Buyer',
    phoneNumber: '+233 55 555 6677',
    region: 'Central',
    landmark: 'Near University Hospital, Cape Coast',
    honeyPackage: '3 x 500g plastic bottles',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 3,
    planType: 'One-Time Order',
    frequency: 'One-Time Delivery',
    perimeterTier: 'Tier 1 (0-5 km)',
    deliveryFeeGHS: 'GH₵ 20.00',
    paymentStatus: 'Paid',
    deliveryDate: 'Sep 08, 2026',
    riderName: 'Kwesi Appiah',
    riderPhone: '+233 55 777 3456',
    status: 'Delivered',
  },
  {
    id: '4',
    trackingCode: 'DEL-078',
    recipientName: 'MaxMart Supermarket',
    recipientType: 'Vendor',
    phoneNumber: '+233 30 333 4455',
    region: 'Greater Accra',
    landmark: '37 Liberation Road, Cantonments',
    honeyPackage: '15 x 330g plastic bottles',
    bottleType: '330g plastic bottles',
    sku: 'VIV-330-PL',
    numberOfBottles: 15,
    planType: 'Wholesale Batch',
    frequency: 'Bi-Weekly Refill',
    perimeterTier: 'Tier 2 (5-15 km)',
    deliveryFeeGHS: 'GH₵ 40.00',
    paymentStatus: 'Paid',
    deliveryDate: 'Tomorrow',
    riderName: 'Elorm Gbeho',
    riderPhone: '+233 27 888 4567',
    status: 'Packing',
  },
  {
    id: '5',
    trackingCode: 'DEL-077',
    recipientName: 'James Taylor',
    recipientType: 'Subscriber',
    phoneNumber: '+233 24 999 0011',
    region: 'Eastern',
    landmark: 'Behind Total Filling Station, Koforidua Outskirts',
    honeyPackage: '4 x 500g plastic bottles',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 4,
    planType: 'Annual Plan',
    frequency: 'Monthly Refill',
    perimeterTier: 'Tier 3 (15 km+)',
    deliveryFeeGHS: 'GH₵ 100.00',
    paymentStatus: 'Annual Pre-paid',
    deliveryDate: 'Sep 06, 2026',
    riderName: 'Kofi Mensah',
    riderPhone: '+233 24 555 1234',
    status: 'Delivered',
  },
  {
    id: '6',
    trackingCode: 'DEL-076',
    recipientName: 'Shoprite West Hills',
    recipientType: 'Vendor',
    phoneNumber: '+233 20 888 1212',
    region: 'Greater Accra',
    landmark: 'West Hills Mall, Weija',
    honeyPackage: '25 x 500g plastic bottles',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 25,
    planType: 'Wholesale Batch',
    frequency: 'Weekly Dispatch',
    perimeterTier: 'Tier 3 (15 km+)',
    deliveryFeeGHS: 'GH₵ 100.00',
    paymentStatus: 'Paid',
    deliveryDate: 'Today',
    riderName: 'Abeiku Sam',
    riderPhone: '+233 50 999 5678',
    status: 'On the Way',
  },
]

const DeliveryPage: FC = () => {
  const {showToast} = useNotifications()
  const [deliveries, setDeliveries] = usePersistentState<DeliveryRecord[]>('vivaldi_deliveries', mockDeliveries)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [recipientTypeFilter, setRecipientTypeFilter] = useState<'All' | 'Vendor' | 'Subscriber' | 'Customer / Buyer'>('All')

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null)
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | null>('vivaldi_highlighted_row_delivery', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_highlighted_col_delivery', null)

  // New Delivery form state
  const [newDelivery, setNewDelivery] = useState({
    recipientName: '',
    recipientType: 'Subscriber' as 'Vendor' | 'Subscriber' | 'Customer / Buyer',
    phoneNumber: '',
    region: 'Greater Accra',
    landmark: '',
    bottleType: '500g plastic bottles' as '500g plastic bottles' | '330g plastic bottles',
    numberOfBottles: 4,
    planType: 'Monthly Plan' as 'Monthly Plan' | 'Annual Plan' | 'Wholesale Batch' | 'One-Time Order',
    frequency: 'Monthly Refill' as
      | 'Weekly Dispatch'
      | 'Bi-Weekly Refill'
      | 'Monthly Refill'
      | 'Quarterly Refill'
      | 'Semi-annually Refill'
      | 'Annually Dispatch'
      | 'One-Time Delivery',
    perimeterTier: 'Tier 1 (0-5 km)' as 'Tier 1 (0-5 km)' | 'Tier 2 (5-15 km)' | 'Tier 3 (15 km+)',
    paymentStatus: 'Paid' as 'Paid' | 'Pending Payment' | 'Annual Pre-paid',
    deliveryDate: 'Today',
    riderName: 'Kofi Mensah',
    riderPhone: '+233 24 555 1234',
    status: 'Packing' as 'Delivered' | 'On the Way' | 'Packing',
  })

  const handleExportCSV = () => {
    const headers = 'Tracking Code,Recipient,Type,Phone,Region,Landmark,Package,Bottle Type,SKU,Bottles,Plan,Status,Date,Rider\n'
    const rows = deliveries
      .map(
        (d) =>
          `"${d.trackingCode}","${d.recipientName}","${d.recipientType}","${d.phoneNumber}","${d.region}","${d.landmark}","${d.honeyPackage}","${d.bottleType}","${d.sku}","${d.numberOfBottles}","${d.planType}","${d.status}","${d.deliveryDate}","${d.riderName}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'vivaldi_deliveries.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast({
      category: 'delivery',
      title: 'Deliveries CSV Downloaded',
      description: `Exported ${deliveries.length} delivery records to vivaldi_deliveries.csv`,
      badgeColor: 'success',
    })
  }

  const handleScheduleDelivery = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDelivery.recipientName || !newDelivery.phoneNumber || !newDelivery.landmark) return

    const fee = PERIMETER_FEE_MAP[newDelivery.perimeterTier]
    const skuCode = newDelivery.bottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'

    const created: DeliveryRecord = {
      id: `del-${Date.now()}`,
      trackingCode: `DEL-${Math.floor(100 + Math.random() * 900)}`,
      recipientName: newDelivery.recipientName,
      recipientType: newDelivery.recipientType,
      phoneNumber: newDelivery.phoneNumber,
      region: newDelivery.region,
      landmark: newDelivery.landmark,
      honeyPackage: `${newDelivery.numberOfBottles} x ${newDelivery.bottleType}`,
      bottleType: newDelivery.bottleType,
      sku: skuCode,
      numberOfBottles: Number(newDelivery.numberOfBottles),
      planType: newDelivery.planType,
      frequency: newDelivery.frequency,
      perimeterTier: newDelivery.perimeterTier,
      deliveryFeeGHS: fee,
      paymentStatus: newDelivery.paymentStatus,
      deliveryDate: newDelivery.deliveryDate,
      riderName: newDelivery.riderName,
      riderPhone: newDelivery.riderPhone,
      status: newDelivery.status,
    }

    setDeliveries([created, ...deliveries])
    setHighlightedRowId(created.id)
    setHighlightedColId('trackingCode')
    setIsScheduleModalOpen(false)
    setNewDelivery({
      recipientName: '',
      recipientType: 'Subscriber',
      phoneNumber: '',
      region: 'Greater Accra',
      landmark: '',
      bottleType: '500g plastic bottles',
      numberOfBottles: 4,
      planType: 'Monthly Plan',
      frequency: 'Monthly Refill',
      perimeterTier: 'Tier 1 (0-5 km)',
      paymentStatus: 'Paid',
      deliveryDate: 'Today',
      riderName: 'Kofi Mensah',
      riderPhone: '+233 24 555 1234',
      status: 'Packing',
    })

    showToast({
      category: 'delivery',
      title: `Delivery ${created.trackingCode} Scheduled`,
      description: `Dispatched to ${created.recipientName} (${created.recipientType} • ${fee}) via ${created.riderName}`,
      badgeColor: 'primary',
    })
  }

  const handleSaveDeliveryDetails = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDelivery) return

    const updatedFee = PERIMETER_FEE_MAP[selectedDelivery.perimeterTier]
    const updatedDelivery: DeliveryRecord = {
      ...selectedDelivery,
      deliveryFeeGHS: updatedFee,
    }

    setDeliveries((prev) =>
      prev.map((d) => (d.id === selectedDelivery.id ? updatedDelivery : d))
    )
    setHighlightedRowId(selectedDelivery.id)
    setHighlightedColId('status')

    showToast({
      category: 'delivery',
      title: `Delivery ${selectedDelivery.trackingCode} Updated`,
      description: `Status: ${selectedDelivery.status} • Rider: ${selectedDelivery.riderName} • Fee: ${updatedFee}`,
      badgeColor: 'primary',
    })

    setSelectedDelivery(null)
  }

  const handleMarkAsDelivered = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const updated: DeliveryRecord = {...d, status: 'Delivered'}
          setSelectedDelivery(updated)
          setHighlightedRowId(deliveryId)
          setHighlightedColId('status')
          showToast({
            category: 'delivery',
            title: `Package Delivered!`,
            description: `${d.trackingCode} handed to ${d.recipientName} (${d.recipientType})`,
            badgeColor: 'success',
          })
          return updated
        }
        return d
      })
    )
  }

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phoneNumber.includes(searchTerm) ||
      d.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter
    const matchesRecipient = recipientTypeFilter === 'All' || d.recipientType === recipientTypeFilter
    return matchesSearch && matchesRegion && matchesStatus && matchesRecipient
  })

  // Dynamic counts
  const deliveredCount = deliveries.filter((d) => d.status === 'Delivered').length
  const onTheWayCount = deliveries.filter((d) => d.status === 'On the Way').length
  const packingCount = deliveries.filter((d) => d.status === 'Packing').length
  const vendorCount = deliveries.filter((d) => d.recipientType === 'Vendor').length

  // Columns definition: Primary details first, symmetric and clean
  const columns: ShadcnColumn<DeliveryRecord>[] = [
    {
      id: 'trackingCode',
      header: 'Tracking #',
      accessor: 'trackingCode',
      render: (item) => (
        <span className='text-gray-900 fw-bold fs-6 text-nowrap'>
          {item.trackingCode}
        </span>
      ),
    },
    {
      id: 'recipientName',
      header: 'Recipient & Type',
      accessor: 'recipientName',
      render: (item) => {
        const isVendor = item.recipientType === 'Vendor'
        const isBuyer = item.recipientType === 'Customer / Buyer'
        const badgeClass = isVendor
          ? 'badge-light-warning text-warning'
          : isBuyer
          ? 'badge-light-success text-success'
          : 'badge-light-primary text-primary'
        const Icon = isVendor ? Building2 : isBuyer ? UserCheck : ShieldCheck

        return (
          <div className='d-flex flex-column'>
            <span className='text-gray-900 fw-bold fs-6 text-nowrap'>{item.recipientName}</span>
            <span className={`badge ${badgeClass} fw-bold fs-9 text-nowrap d-inline-flex align-items-center gap-1 w-fit mt-1`}>
              <Icon size={11} />
              {item.recipientType}
            </span>
          </div>
        )
      },
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
      id: 'sku',
      header: 'Bottle & Product Code',
      accessor: 'sku',
      render: (item) => (
        <div className='d-flex flex-column text-nowrap'>
          <span className='badge badge-light-primary fw-bold fs-8 w-fit'>
            {item.bottleType}
          </span>
          <span className='product-code-text fs-8 mt-1 d-flex align-items-center'>
            <Barcode size={12} className='me-1 text-gray-500' />
            Product Code: {item.sku}
          </span>
        </div>
      ),
    },
    {
      id: 'numberOfBottles',
      header: 'Quantity & Plan',
      accessor: 'numberOfBottles',
      render: (item) => (
        <div className='d-flex flex-column text-nowrap'>
          <span className='text-gray-900 fw-bolder fs-7'>
            {item.numberOfBottles} Bottles
          </span>
          <span className='text-muted fs-8 mt-0.5'>
            {item.planType} • {item.frequency}
          </span>
        </div>
      ),
    },
    {
      id: 'riderName',
      header: 'Assigned Rider',
      accessor: 'riderName',
      render: (item) => (
        <span className='text-gray-800 fw-semibold fs-7 text-nowrap'>
          {item.riderName}
        </span>
      ),
    },
    {
      id: 'perimeterTier',
      header: 'Delivery Fee',
      accessor: 'deliveryFeeGHS',
      render: (item) => {
        const isTier1 = item.perimeterTier.includes('Tier 1')
        const isTier2 = item.perimeterTier.includes('Tier 2')
        const badgeColor = isTier1 ? 'badge-light-success' : isTier2 ? 'badge-light-info' : 'badge-light-warning'

        return (
          <div className='d-flex flex-column text-nowrap'>
            <span className='text-gray-900 fw-bolder fs-7'>{item.deliveryFeeGHS}</span>
            <span className={`badge ${badgeColor} fs-9 fw-semibold mt-1 w-fit`}>
              {item.perimeterTier}
            </span>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => {
        const isDelivered = item.status === 'Delivered'
        const isOnWay = item.status === 'On the Way'
        const badgeColor = isDelivered ? 'badge-light-success' : isOnWay ? 'badge-light-primary' : 'badge-light-warning'

        return (
          <span className={`badge ${badgeColor} fw-bold text-nowrap`}>
            {item.status}
          </span>
        )
      },
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
      header: 'Action',
      sortable: false,
      headerClassName: 'text-end',
      className: 'text-end',
      render: (item) => (
        <button
          type='button'
          className='btn btn-xs btn-light btn-active-light-primary text-nowrap fw-bold'
          onClick={() => setSelectedDelivery(item)}
          title='View delivery details, plan, SKU and rider contact'
        >
          Details
        </button>
      ),
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>Delivery</PageTitle>

      {/* Summary Cards */}
      <div className='row g-5 g-xl-8 mb-6'>
        <div className='col-sm-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body d-flex align-items-center justify-content-between p-5'>
              <div>
                <span className='text-muted fs-7 fw-bold d-block'>Total Deliveries</span>
                <span className='fs-2hx fw-bolder text-gray-900'>{deliveries.length}</span>
              </div>
              <div className='symbol symbol-45px bg-light-primary'>
                <span className='symbol-label'>
                  <Truck size={22} className='text-primary' />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body d-flex align-items-center justify-content-between p-5'>
              <div>
                <span className='text-muted fs-7 fw-bold d-block'>Delivered</span>
                <span className='fs-2hx fw-bolder text-success'>{deliveredCount}</span>
              </div>
              <div className='symbol symbol-45px bg-light-success'>
                <span className='symbol-label'>
                  <CheckCircle size={22} className='text-success' />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body d-flex align-items-center justify-content-between p-5'>
              <div>
                <span className='text-muted fs-7 fw-bold d-block'>On the Way</span>
                <span className='fs-2hx fw-bolder text-primary'>{onTheWayCount}</span>
              </div>
              <div className='symbol symbol-45px bg-light-primary'>
                <span className='symbol-label'>
                  <Truck size={22} className='text-primary' />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='col-sm-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body d-flex align-items-center justify-content-between p-5'>
              <div>
                <span className='text-muted fs-7 fw-bold d-block'>Vendor Deliveries</span>
                <span className='fs-2hx fw-bolder text-warning'>{vendorCount}</span>
              </div>
              <div className='symbol symbol-45px bg-light-warning'>
                <span className='symbol-label'>
                  <Building2 size={22} className='text-warning' />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Delivery Table */}
      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Delivery Schedule & Logistics</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              Deliveries for Vendors, Subscribers, and Direct Buyers with bottle size, schedule, and delivery fees
            </span>
          </h3>
          <div className='card-toolbar d-flex gap-2'>
            <button
              type='button'
              onClick={() => setIsScheduleModalOpen(true)}
              className='btn btn-sm btn-primary fw-bold d-flex align-items-center'
            >
              <Plus size={16} className='me-1' /> Schedule Delivery
            </button>
            <button
              type='button'
              onClick={handleExportCSV}
              className='btn btn-sm btn-light-primary fw-bold d-flex align-items-center'
              title='Export deliveries to CSV file'
            >
              <Download size={16} className='me-1' /> Download List
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
                  placeholder='Search tracking #, name, SKU...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className='position-absolute top-50 start-0 translate-middle-y ms-3 text-gray-500'>
                  <Search size={16} />
                </span>
              </div>

              {/* 16 Regions Dropdown */}
              <div className='w-100 w-md-180px'>
                <select
                  className='form-select form-select-solid'
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {GHANA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Regions' : r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className='w-100 w-md-150px'>
                <select
                  className='form-select form-select-solid'
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value='All'>All Statuses</option>
                  <option value='Packing'>Packing</option>
                  <option value='On the Way'>On the Way</option>
                  <option value='Delivered'>Delivered</option>
                </select>
              </div>
            </div>

            {/* Recipient Type Segment Buttons */}
            <div className='d-flex gap-2 flex-wrap'>
              {(['All', 'Vendor', 'Subscriber', 'Customer / Buyer'] as const).map((t) => (
                <button
                  key={t}
                  type='button'
                  className={`btn btn-sm ${
                    recipientTypeFilter === t ? 'btn-primary' : 'btn-light'
                  } fw-semibold fs-8`}
                  onClick={() => setRecipientTypeFilter(t)}
                >
                  {t === 'All' ? 'All Recipients' : t === 'Customer / Buyer' ? 'Direct Buyers' : `${t}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Shadcn UI Table */}
          <ShadcnTable
            data={filtered}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
            emptyMessage='No delivery records match your filters'
            keyExtractor={(d) => d.id}
            highlightedRowId={highlightedRowId}
            highlightedColId={highlightedColId}
            onRowClick={(d) => setHighlightedRowId(d.id)}
          />
        </div>
      </div>

      {/* MODAL 1: Schedule Delivery Modal */}
      {isScheduleModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-700px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Schedule Honey Delivery</h3>
                  <span className='text-muted fs-7'>Assign product, plan, perimeter distance fee and dispatch rider</span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-color-primary'
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleScheduleDelivery}>
                <div className='modal-body pt-4 pb-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  {/* Section 1: Recipient Information */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='badge badge-circle badge-light-primary fw-bolder me-2'>1</span>
                      <h5 className='text-dark fw-bold mb-0'>Recipient Information</h5>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Recipient Type</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.recipientType}
                          onChange={(e) =>
                            setNewDelivery({
                              ...newDelivery,
                              recipientType: e.target.value as 'Vendor' | 'Subscriber' | 'Customer / Buyer',
                            })
                          }
                        >
                          <option value='Subscriber'>Subscriber (Regular Refill)</option>
                          <option value='Vendor'>Vendor (Supermarket / Retail Mart)</option>
                          <option value='Customer / Buyer'>Customer / Buyer (Direct Order)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>
                          {newDelivery.recipientType === 'Vendor' ? 'Vendor / Mart Name' : 'Recipient Name'}
                        </label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder={newDelivery.recipientType === 'Vendor' ? 'e.g. Melcom Central Mart' : 'e.g. Sarah Johnson'}
                          required
                          value={newDelivery.recipientName}
                          onChange={(e) => setNewDelivery({...newDelivery, recipientName: e.target.value})}
                        />
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Phone Number</label>
                        <input
                          type='tel'
                          className='form-control form-control-solid'
                          placeholder='+233 24 000 0000'
                          required
                          value={newDelivery.phoneNumber}
                          onChange={(e) => setNewDelivery({...newDelivery, phoneNumber: e.target.value})}
                        />
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Region</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.region}
                          onChange={(e) => setNewDelivery({...newDelivery, region: e.target.value})}
                        >
                          {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Order & Product Specification */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='badge badge-circle badge-light-primary fw-bolder me-2'>2</span>
                      <h5 className='text-dark fw-bold mb-0'>Order & Product Specification</h5>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Selected Plan</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.planType}
                          onChange={(e) =>
                            setNewDelivery({
                              ...newDelivery,
                              planType: e.target.value as 'Monthly Plan' | 'Annual Plan' | 'Wholesale Batch' | 'One-Time Order',
                            })
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan</option>
                          <option value='Annual Plan'>Annual Plan (Full Year)</option>
                          <option value='Wholesale Batch'>Wholesale Batch (Vendors)</option>
                          <option value='One-Time Order'>One-Time Order (Direct)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Delivery Frequency</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.frequency}
                          onChange={(e) =>
                            setNewDelivery({
                              ...newDelivery,
                              frequency: e.target.value as any,
                            })
                          }
                        >
                          {ORDERED_FREQUENCIES.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Bottle Product</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.bottleType}
                          onChange={(e) =>
                            setNewDelivery({
                              ...newDelivery,
                              bottleType: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (Large • Product Code: VIV-500-PL • GH₵ 100)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (Regular • Product Code: VIV-330-PL • GH₵ 85)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>
                          Quantity (Bottles)
                        </label>
                        <div className='input-group mb-2'>
                          <button
                            type='button'
                            className='btn btn-light-primary px-3 py-2 fw-bold'
                            onClick={() =>
                              setNewDelivery((prev) => ({
                                ...prev,
                                numberOfBottles: Math.max(1, (prev.numberOfBottles || 1) - 1),
                              }))
                            }
                          >
                            −
                          </button>
                          <input
                            type='number'
                            min={1}
                            max={500}
                            className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                            placeholder='Custom quantity'
                            value={newDelivery.numberOfBottles}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10)
                              setNewDelivery((prev) => ({
                                ...prev,
                                numberOfBottles: isNaN(val) ? 1 : Math.max(1, val),
                              }))
                            }}
                            required
                          />
                          <button
                            type='button'
                            className='btn btn-light-primary px-3 py-2 fw-bold'
                            onClick={() =>
                              setNewDelivery((prev) => ({
                                ...prev,
                                numberOfBottles: (prev.numberOfBottles || 1) + 1,
                              }))
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Delivery Location & Perimeter Distance */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='badge badge-circle badge-light-primary fw-bolder me-2'>3</span>
                      <h5 className='text-dark fw-bold mb-0'>Location & Perimeter Distance</h5>
                    </div>
                    <div className='row g-4'>
                      <div className='col-12'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Delivery Address & Landmark</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Near Airport Residential Area, Accra'
                          required
                          value={newDelivery.landmark}
                          onChange={(e) => setNewDelivery({...newDelivery, landmark: e.target.value})}
                        />
                      </div>

                      <div className='col-12'>
                        <div className='card bg-light-primary border border-primary border-opacity-25 p-4 rounded-3'>
                          <div className='d-flex align-items-center justify-content-between mb-2'>
                            <label className='form-label fw-bold text-gray-800 fs-7 mb-0 d-flex align-items-center'>
                              <Navigation size={15} className='text-primary me-2' />
                              Perimeter Distance (3-Tier Fee Structure)
                            </label>
                            <span className='badge badge-primary fw-bolder fs-7'>
                              Delivery Fee: {PERIMETER_FEE_MAP[newDelivery.perimeterTier]}
                            </span>
                          </div>
                          <select
                            className='form-select form-select-solid'
                            value={newDelivery.perimeterTier}
                            onChange={(e) =>
                              setNewDelivery({
                                ...newDelivery,
                                perimeterTier: e.target.value as 'Tier 1 (0-5 km)' | 'Tier 2 (5-15 km)' | 'Tier 3 (15 km+)',
                              })
                            }
                          >
                            <option value='Tier 1 (0-5 km)'>Tier 1 (0 - 5 km Inner Perimeter) → GH₵ 20.00</option>
                            <option value='Tier 2 (5-15 km)'>Tier 2 (5 - 15 km Mid Perimeter) → GH₵ 40.00</option>
                            <option value='Tier 3 (15 km+)'>Tier 3 (15 km+ Outer Perimeter) → GH₵ 100.00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Rider Assignment & Initial Status */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3'>
                      <span className='badge badge-circle badge-light-primary fw-bolder me-2'>4</span>
                      <h5 className='text-dark fw-bold mb-0'>Rider Assignment & Status</h5>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Assigned Dispatch Rider</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.riderName}
                          onChange={(e) => {
                            const val = e.target.value
                            let phone = '+233 24 555 1234'
                            if (val === 'Yaw Boateng') phone = '+233 20 666 2345'
                            else if (val === 'Kwesi Appiah') phone = '+233 55 777 3456'
                            else if (val === 'Elorm Gbeho') phone = '+233 27 888 4567'
                            else if (val === 'Abeiku Sam') phone = '+233 50 999 5678'
                            setNewDelivery({...newDelivery, riderName: val, riderPhone: phone})
                          }}
                        >
                          <option value='Kofi Mensah'>Kofi Mensah (+233 24 555 1234)</option>
                          <option value='Yaw Boateng'>Yaw Boateng (+233 20 666 2345)</option>
                          <option value='Kwesi Appiah'>Kwesi Appiah (+233 55 777 3456)</option>
                          <option value='Elorm Gbeho'>Elorm Gbeho (+233 27 888 4567)</option>
                          <option value='Abeiku Sam'>Abeiku Sam (+233 50 999 5678)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7'>Initial Dispatch Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newDelivery.status}
                          onChange={(e) =>
                            setNewDelivery({
                              ...newDelivery,
                              status: e.target.value as 'Delivered' | 'On the Way' | 'Packing',
                            })
                          }
                        >
                          <option value='Packing'>Packing</option>
                          <option value='On the Way'>On the Way</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className='card bg-light-primary border-primary border border-dashed p-4 rounded-3 mb-2'>
                    <div className='d-flex flex-row align-items-center justify-content-between'>
                      <div>
                        <div className='fw-bolder text-gray-800 fs-7'>Delivery Summary:</div>
                        <div className='text-gray-700 fw-semibold fs-8'>
                          {newDelivery.numberOfBottles} × {newDelivery.bottleType} (<span className='product-code-tag'>Product Code: {newDelivery.bottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span>) • {newDelivery.planType}
                        </div>
                      </div>
                      <div className='text-end'>
                        <div className='fs-3 fw-bolder text-primary'>
                          {PERIMETER_FEE_MAP[newDelivery.perimeterTier]}
                        </div>
                        <div className='text-muted fs-9'>Delivery Fee</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 pb-6 px-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setIsScheduleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold'>
                    Schedule Delivery
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delivery Details Modal */}
      {selectedDelivery && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
                <div className='d-flex align-items-center gap-3'>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>
                    Delivery {selectedDelivery.trackingCode}
                  </h3>
                  <span
                    className={`badge badge-light-${
                      selectedDelivery.status === 'Delivered'
                        ? 'success'
                        : selectedDelivery.status === 'On the Way'
                        ? 'primary'
                        : 'warning'
                    } fw-bold`}
                  >
                    {selectedDelivery.status}
                  </span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-color-primary'
                  onClick={() => setSelectedDelivery(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveDeliveryDetails}>
                <div className='modal-body pt-4 pb-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  <div className='card bg-light p-4 mb-4 rounded-3 border-0'>
                    <div className='row g-3'>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>RECIPIENT & TYPE</div>
                        <div className='fw-bolder text-gray-900 fs-6'>{selectedDelivery.recipientName}</div>
                        <span className='badge badge-light-primary fw-bold fs-9 mt-1'>{selectedDelivery.recipientType}</span>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>PHONE</div>
                        <div className='fw-bold text-gray-800 fs-7'>{selectedDelivery.phoneNumber}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>PLAN & FREQUENCY</div>
                        <div className='fw-bold text-gray-900 fs-7'>{selectedDelivery.planType}</div>
                        <span className='text-muted fs-8'>{selectedDelivery.frequency}</span>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>BOTTLE & PRODUCT CODE</div>
                        <div className='fw-bold text-primary fs-7'>{selectedDelivery.honeyPackage}</div>
                        <span className='badge badge-light-primary fw-bold fs-8 product-code-badge mt-1'>Product Code: {selectedDelivery.sku}</span>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>REGION</div>
                        <div className='fw-bold text-gray-800 fs-7'>{selectedDelivery.region}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>DELIVERY FEE</div>
                        <div className='fw-bolder text-primary fs-6'>{selectedDelivery.deliveryFeeGHS}</div>
                        <span className='text-muted fs-9'>{selectedDelivery.perimeterTier}</span>
                      </div>
                      <div className='col-12'>
                        <div className='text-muted fs-8 fw-bold'>DELIVERY ADDRESS & LANDMARK</div>
                        <div className='fw-bold text-gray-800 fs-7 d-flex align-items-center mt-1'>
                          <MapPin size={14} className='text-primary me-1.5 flex-shrink-0' />
                          {selectedDelivery.landmark}
                        </div>
                      </div>
                      <div className='col-12'>
                        <div className='text-muted fs-8 fw-bold'>ASSIGNED RIDER CONTACT</div>
                        <div className='fw-bold text-gray-800 fs-7 d-flex align-items-center mt-1'>
                          <Phone size={14} className='text-success me-1.5 flex-shrink-0' />
                          {selectedDelivery.riderName} ({selectedDelivery.riderPhone})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='row g-4'>
                    <div className='col-md-6'>
                      <label className='form-label fw-bold text-gray-800 fs-7'>Update Status</label>
                      <select
                        className='form-select form-select-solid'
                        value={selectedDelivery.status}
                        onChange={(e) =>
                          setSelectedDelivery({
                            ...selectedDelivery,
                            status: e.target.value as 'Delivered' | 'On the Way' | 'Packing',
                          })
                        }
                      >
                        <option value='Packing'>Packing</option>
                        <option value='On the Way'>On the Way</option>
                        <option value='Delivered'>Delivered</option>
                      </select>
                    </div>

                    <div className='col-md-6'>
                      <label className='form-label fw-bold text-gray-800 fs-7'>Adjust Perimeter Tier</label>
                      <select
                        className='form-select form-select-solid'
                        value={selectedDelivery.perimeterTier}
                        onChange={(e) =>
                          setSelectedDelivery({
                            ...selectedDelivery,
                            perimeterTier: e.target.value as 'Tier 1 (0-5 km)' | 'Tier 2 (5-15 km)' | 'Tier 3 (15 km+)',
                            deliveryFeeGHS: PERIMETER_FEE_MAP[e.target.value as keyof typeof PERIMETER_FEE_MAP],
                          })
                        }
                      >
                        <option value='Tier 1 (0-5 km)'>Tier 1 (0-5 km) - GH₵ 20.00</option>
                        <option value='Tier 2 (5-15 km)'>Tier 2 (5-15 km) - GH₵ 40.00</option>
                        <option value='Tier 3 (15 km+)'>Tier 3 (15 km+) - GH₵ 100.00</option>
                      </select>
                    </div>
                  </div>

                  {selectedDelivery.status !== 'Delivered' && (
                    <div className='mt-5 pt-4 border-top d-flex align-items-center justify-content-between'>
                      <div>
                        <div className='fw-bold text-gray-800 fs-7'>Quick Completion</div>
                        <div className='text-muted fs-8'>Mark package as delivered to recipient</div>
                      </div>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-success fw-bold d-flex align-items-center'
                        onClick={() => handleMarkAsDelivered(selectedDelivery.id)}
                      >
                        <CheckCircle size={15} className='me-2' />
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                </div>

                <div className='modal-footer border-0 pt-0 pb-6 px-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setSelectedDelivery(null)}
                  >
                    Close
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold'>
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

export {DeliveryPage}
