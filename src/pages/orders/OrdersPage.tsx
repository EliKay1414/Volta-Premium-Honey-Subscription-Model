import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {Download, Search, Package, Phone, Plus, X, CheckCircle, Eye, Barcode, CreditCard} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'

export interface HoneyOrder {
  id: string
  orderNumber: string
  buyerName: string
  phoneNumber: string
  region: string
  bottleType: '500g plastic bottles' | '330g plastic bottles'
  sku: string
  numberOfBottles: number
  planType: 'Monthly Plan' | 'Annual Plan' | 'One-Time Order'
  amountGHS: string
  dateSent: string
  deliveryStatus: 'Delivered' | 'On the Way' | 'Packing'
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery'
  paymentStatus: 'Paid' | 'Pending'
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

const mockOrders: HoneyOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-081',
    buyerName: 'Sarah Johnson',
    phoneNumber: '+233 24 111 2233',
    region: 'Greater Accra',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 4,
    planType: 'Monthly Plan',
    amountGHS: 'GH₵ 400',
    dateSent: 'Sep 09, 2026',
    deliveryStatus: 'On the Way',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Paid',
  },
  {
    id: '2',
    orderNumber: 'ORD-080',
    buyerName: 'Michael Davis',
    phoneNumber: '+233 20 333 4455',
    region: 'Ashanti',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 3,
    planType: 'Monthly Plan',
    amountGHS: 'GH₵ 300',
    dateSent: 'Sep 07, 2026',
    deliveryStatus: 'Delivered',
    paymentMethod: 'Telecel Cash',
    paymentStatus: 'Paid',
  },
  {
    id: '3',
    orderNumber: 'ORD-079',
    buyerName: 'David Wilson',
    phoneNumber: '+233 55 555 6677',
    region: 'Central',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 3,
    planType: 'Annual Plan',
    amountGHS: 'GH₵ 3,240',
    dateSent: 'Sep 04, 2026',
    deliveryStatus: 'Delivered',
    paymentMethod: 'Bank Card / Visa',
    paymentStatus: 'Paid',
  },
  {
    id: '4',
    orderNumber: 'ORD-078',
    buyerName: 'Olivia Martinez',
    phoneNumber: '+233 27 777 8899',
    region: 'Volta',
    bottleType: '330g plastic bottles',
    sku: 'VIV-330-PL',
    numberOfBottles: 2,
    planType: 'Monthly Plan',
    amountGHS: 'GH₵ 170',
    dateSent: 'Sep 01, 2026',
    deliveryStatus: 'Delivered',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Pending',
  },
  {
    id: '5',
    orderNumber: 'ORD-077',
    buyerName: 'James Taylor',
    phoneNumber: '+233 24 999 0011',
    region: 'Greater Accra',
    bottleType: '500g plastic bottles',
    sku: 'VIV-500-PL',
    numberOfBottles: 4,
    planType: 'Annual Plan',
    amountGHS: 'GH₵ 4,320',
    dateSent: 'Aug 28, 2026',
    deliveryStatus: 'Delivered',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Paid',
  },
  {
    id: '6',
    orderNumber: 'ORD-076',
    buyerName: 'Grace Mensah',
    phoneNumber: '+233 50 678 9012',
    region: 'Greater Accra',
    bottleType: '330g plastic bottles',
    sku: 'VIV-330-PL',
    numberOfBottles: 2,
    planType: 'One-Time Order',
    amountGHS: 'GH₵ 170',
    dateSent: 'Aug 25, 2026',
    deliveryStatus: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
  },
]

const OrdersPage: FC = () => {
  const {showToast} = useNotifications()
  const [orders, setOrders] = usePersistentState<HoneyOrder[]>('vivaldi_orders', mockOrders)
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | number | null>('vivaldi_orders_highlight_row', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_orders_highlight_col', null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All')
  const [planFilter, setPlanFilter] = useState('All')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<HoneyOrder | null>(null)

  // Create form state
  const [newOrder, setNewOrder] = useState({
    buyerName: '',
    phoneNumber: '',
    region: 'Greater Accra',
    bottleType: '500g plastic bottles' as '500g plastic bottles' | '330g plastic bottles',
    numberOfBottles: 3,
    planType: 'Monthly Plan' as 'Monthly Plan' | 'Annual Plan' | 'One-Time Order',
    deliveryStatus: 'Packing' as 'Delivered' | 'On the Way' | 'Packing',
    paymentMethod: 'MTN Mobile Money' as 'MTN Mobile Money' | 'Telecel Cash' | 'Bank Card / Visa' | 'Cash on Delivery',
    paymentStatus: 'Paid' as 'Paid' | 'Pending',
  })

  const handleDownloadCSV = () => {
    const headers = 'Order #,Buyer Name,Phone Number,Region,SKU,Bottle Type,Plan,Quantity,Amount,Date,Delivery Status,Payment Status,Payment Method\n'
    const rows = orders
      .map(
        (o) =>
          `"${o.orderNumber}","${o.buyerName}","${o.phoneNumber}","${o.region}","${o.sku}","${o.bottleType}","${o.planType}","${o.numberOfBottles}","${o.amountGHS}","${o.dateSent}","${o.deliveryStatus}","${o.paymentStatus}","${o.paymentMethod}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'vivaldi_honey_orders.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast({
      category: 'purchase',
      title: 'Orders CSV Downloaded',
      description: `Exported ${orders.length} order records to vivaldi_honey_orders.csv`,
      badgeColor: 'success',
    })
  }

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrder.buyerName || !newOrder.phoneNumber) return

    const price = newOrder.bottleType === '500g plastic bottles' ? 100 : 85
    let total = Number(newOrder.numberOfBottles) * price
    if (newOrder.planType === 'Annual Plan') {
      total = Math.round(total * 12 * 0.9)
    }

    const skuCode = newOrder.bottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'

    const created: HoneyOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      buyerName: newOrder.buyerName,
      phoneNumber: newOrder.phoneNumber,
      region: newOrder.region,
      bottleType: newOrder.bottleType,
      sku: skuCode,
      numberOfBottles: Number(newOrder.numberOfBottles),
      planType: newOrder.planType,
      amountGHS: `GH₵ ${total.toLocaleString()}`,
      dateSent: 'Just now',
      deliveryStatus: newOrder.deliveryStatus,
      paymentMethod: newOrder.paymentMethod,
      paymentStatus: newOrder.paymentStatus,
    }

    setOrders([created, ...orders])
    setHighlightedRowId(created.id)
    setHighlightedColId('orderNumber')
    setIsCreateModalOpen(false)
    setNewOrder({
      buyerName: '',
      phoneNumber: '',
      region: 'Greater Accra',
      bottleType: '500g plastic bottles',
      numberOfBottles: 3,
      planType: 'Monthly Plan',
      deliveryStatus: 'Packing',
      paymentMethod: 'MTN Mobile Money',
      paymentStatus: 'Paid',
    })

    showToast({
      category: 'purchase',
      title: `Order ${created.orderNumber} Created`,
      description: `${created.buyerName} ordered ${created.numberOfBottles}x ${created.bottleType} (${created.amountGHS} • ${created.planType})`,
      badgeColor: 'primary',
    })
  }

  const handleSaveOrderDetails = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrder.id ? selectedOrder : o))
    )
    setHighlightedRowId(selectedOrder.id)
    setHighlightedColId('deliveryStatus')

    showToast({
      category: 'purchase',
      title: `Order ${selectedOrder.orderNumber} Updated`,
      description: `Status: ${selectedOrder.deliveryStatus} • Payment: ${selectedOrder.paymentStatus}`,
      badgeColor: 'primary',
    })

    setSelectedOrder(null)
  }

  const handleMarkPaidAndDelivered = (orderId: string) => {
    setHighlightedRowId(orderId)
    setHighlightedColId('deliveryStatus')
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated: HoneyOrder = {...o, deliveryStatus: 'Delivered', paymentStatus: 'Paid'}
          setSelectedOrder(updated)
          showToast({
            category: 'purchase',
            title: `Order ${o.orderNumber} Completed`,
            description: 'Marked as Paid & Delivered successfully!',
            badgeColor: 'success',
          })
          return updated
        }
        return o
      })
    )
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phoneNumber.includes(searchTerm) ||
      o.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === 'All' || o.region === selectedRegion
    const matchesDelivery = deliveryFilter === 'All' || o.deliveryStatus === deliveryFilter
    const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter
    const matchesPlan = planFilter === 'All' || o.planType === planFilter
    return matchesSearch && matchesRegion && matchesDelivery && matchesPayment && matchesPlan
  })

  // Shadcn UI Table Columns
  // Primary Order: Order #, Buyer Name, Tel, Package & SKU, Quantity & Plan, Total Amount, Payment Follows, Delivery Status, Date, Region (before Action), Action
  const columns: ShadcnColumn<HoneyOrder>[] = [
    {
      id: 'orderNumber',
      header: 'Order #',
      accessor: 'orderNumber',
      render: (item) => (
        <span className='text-gray-900 fw-bold fs-6 text-nowrap'>
          {item.orderNumber}
        </span>
      ),
    },
    {
      id: 'buyerName',
      header: 'Buyer Name',
      accessor: 'buyerName',
      render: (item) => (
        <span className='text-gray-900 fw-bold fs-6 text-nowrap'>
          {item.buyerName}
        </span>
      ),
    },
    {
      id: 'phoneNumber',
      header: 'Tel',
      accessor: 'phoneNumber',
      render: (item) => (
        <span className='text-gray-800 fs-7 d-flex align-items-center text-nowrap'>
          <Phone size={12} className='text-gray-400 me-1.5 flex-shrink-0' />
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
            <Barcode size={11} className='me-1 text-gray-500' />
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
          <span className='text-gray-900 fw-bold fs-7 d-flex align-items-center'>
            <Package size={12} className='me-1 text-primary' />
            {item.numberOfBottles} Bottles
          </span>
          <span className='text-muted fs-8'>{item.planType}</span>
        </div>
      ),
    },
    {
      id: 'amountGHS',
      header: 'Total Bill',
      accessor: 'amountGHS',
      render: (item) => (
        <span className='fw-bolder text-gray-900 fs-6 text-nowrap'>
          {item.amountGHS}
        </span>
      ),
    },
    {
      id: 'paymentStatus',
      header: 'Payment Follows',
      accessor: 'paymentStatus',
      render: (item) => {
        const isPaid = item.paymentStatus === 'Paid'
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
      id: 'deliveryStatus',
      header: 'Delivery Status',
      accessor: 'deliveryStatus',
      render: (item) => {
        const isDelivered = item.deliveryStatus === 'Delivered'
        const isOnWay = item.deliveryStatus === 'On the Way'
        const badgeColor = isDelivered ? 'badge-light-success' : isOnWay ? 'badge-light-primary' : 'badge-light-warning'

        return (
          <span className={`badge ${badgeColor} fw-bold text-nowrap`}>
            {item.deliveryStatus}
          </span>
        )
      },
    },
    {
      id: 'dateSent',
      header: 'Date',
      accessor: 'dateSent',
      render: (item) => (
        <span className='text-muted fs-7 text-nowrap'>
          {item.dateSent}
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
      header: 'Action',
      sortable: false,
      headerClassName: 'text-end',
      className: 'text-end',
      render: (item) => (
        <button
          type='button'
          className='btn btn-xs btn-light btn-active-light-primary text-nowrap fw-bold'
          onClick={() => {
            setSelectedOrder(item)
            setHighlightedRowId(item.id)
            setHighlightedColId('bottleType')
          }}
          title='View order receipt & payment management'
        >
          <Eye size={13} className='me-1' /> View
        </button>
      ),
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>Orders</PageTitle>

      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Honey Orders</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              Record of bottle orders placed by subscribers with SKU, Plan, and Payment details
            </span>
          </h3>
          <div className='card-toolbar d-flex gap-2'>
            <button
              type='button'
              onClick={() => setIsCreateModalOpen(true)}
              className='btn btn-sm btn-primary fw-bold d-flex align-items-center'
            >
              <Plus size={16} className='me-1' /> Create Order
            </button>
            <button
              type='button'
              onClick={handleDownloadCSV}
              className='btn btn-sm btn-light-primary fw-bold d-flex align-items-center'
              title='Export orders to CSV file'
            >
              <Download size={16} className='me-1' /> Download List
            </button>
          </div>
        </div>

        <div className='card-body py-4'>
          {/* Filters Bar in Clean Symmetry */}
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5'>
            <div className='d-flex flex-wrap align-items-center gap-3 w-100 w-lg-auto'>
              {/* Search */}
              <div className='position-relative w-100 w-md-250px'>
                <input
                  type='text'
                  className='form-control form-control-solid ps-10'
                  placeholder='Search order #, buyer, SKU...'
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
                      {r === 'All' ? 'All 16 Regions' : r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Filter Dropdown */}
              <div className='w-100 w-md-160px'>
                <select
                  className='form-select form-select-solid'
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                >
                  <option value='All'>All Plans</option>
                  <option value='Monthly Plan'>Monthly Plan</option>
                  <option value='Annual Plan'>Annual Plan</option>
                  <option value='One-Time Order'>One-Time Order</option>
                </select>
              </div>

              {/* Payment Status Dropdown (Consolidated to eliminate duplicate 'All' button) */}
              <div className='w-100 w-md-150px'>
                <select
                  className='form-select form-select-solid'
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value='All'>All Payments</option>
                  <option value='Paid'>Paid</option>
                  <option value='Pending'>Pending</option>
                </select>
              </div>
            </div>

            {/* Delivery Status Filter Tabs (Single button group, no duplicate 'All') */}
            <div className='btn-group'>
              {['All', 'Delivered', 'On the Way', 'Packing'].map((st) => (
                <button
                  key={st}
                  type='button'
                  className={`btn btn-sm ${
                    deliveryFilter === st ? 'btn-primary' : 'btn-light'
                  } fw-semibold fs-8`}
                  onClick={() => setDeliveryFilter(st)}
                >
                  {st === 'All' ? 'All Orders' : st}
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
            emptyMessage='No orders found matching your search'
            keyExtractor={(order) => order.id}
            highlightedRowId={highlightedRowId}
            highlightedColId={highlightedColId}
            onRowClick={(order) => setHighlightedRowId(order.id)}
          />
        </div>
      </div>

      {/* MODAL 1: Create Order Modal */}
      {isCreateModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Create New Honey Order</h3>
                  <span className='text-muted fs-7'>Set Plan, SKU, Quantity, and Payment options</span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-color-primary'
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder}>
                <div className='modal-body py-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  {/* Section 1: Buyer & Plan Details */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Buyer & Plan Details
                      </span>
                    </div>
                    <div className='row g-4 mb-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Buyer Name</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Kwame Mensah'
                          required
                          value={newOrder.buyerName}
                          onChange={(e) => setNewOrder({...newOrder, buyerName: e.target.value})}
                        />
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Phone Number</label>
                        <input
                          type='tel'
                          className='form-control form-control-solid'
                          placeholder='+233 24 000 0000'
                          required
                          value={newOrder.phoneNumber}
                          onChange={(e) => setNewOrder({...newOrder, phoneNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Region</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.region}
                          onChange={(e) => setNewOrder({...newOrder, region: e.target.value})}
                        >
                          {GHANA_REGIONS.filter((r) => r !== 'All').map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Plan Type</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.planType}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              planType: e.target.value as 'Monthly Plan' | 'Annual Plan' | 'One-Time Order',
                            })
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan (Billed monthly)</option>
                          <option value='Annual Plan'>Annual Plan (10% Saver Discount)</option>
                          <option value='One-Time Order'>One-Time Order (Direct)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Bottle Product & Quantity */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Bottle Selection & Quantity
                      </span>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Bottle Size</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.bottleType}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              bottleType: e.target.value as '500g plastic bottles' | '330g plastic bottles',
                            })
                          }
                        >
                          <option value='500g plastic bottles'>500g plastic bottles (Large • Product Code: VIV-500-PL • GH₵ 100 each)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (Regular • Product Code: VIV-330-PL • GH₵ 85 each)</option>
                        </select>
                      </div>

                      <div className='col-md-6'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Quantity (Bottles)</label>
                        <div className='d-flex align-items-center gap-2 mb-2'>
                          <div className='input-group input-group-solid' style={{maxWidth: '140px'}}>
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setNewOrder({...newOrder, numberOfBottles: Math.max(1, newOrder.numberOfBottles - 1)})}
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min={1}
                              max={200}
                              className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                              required
                              value={newOrder.numberOfBottles}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10)
                                setNewOrder({...newOrder, numberOfBottles: isNaN(val) || val < 1 ? 1 : val})
                              }}
                            />
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setNewOrder({...newOrder, numberOfBottles: newOrder.numberOfBottles + 1})}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Payment & Delivery Status */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Payment & Delivery Status
                      </span>
                    </div>
                    <div className='row g-4'>
                      <div className='col-md-4'>
                        <label className='form-label fw-bold text-gray-800 fs-7 required'>Payment Method</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.paymentMethod}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              paymentMethod: e.target.value as any,
                            })
                          }
                        >
                          <option value='MTN Mobile Money'>MTN Mobile Money (MoMo)</option>
                          <option value='Telecel Cash'>Telecel Cash</option>
                          <option value='Bank Card / Visa'>Bank Card / Visa</option>
                          <option value='Cash on Delivery'>Cash on Delivery</option>
                        </select>
                      </div>

                      <div className='col-md-4'>
                        <label className='form-label fw-bold text-gray-800 fs-7'>Payment Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.paymentStatus}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              paymentStatus: e.target.value as 'Paid' | 'Pending',
                            })
                          }
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Pending'>Pending Payment</option>
                        </select>
                      </div>

                      <div className='col-md-4'>
                        <label className='form-label fw-bold text-gray-800 fs-7'>Delivery Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newOrder.deliveryStatus}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              deliveryStatus: e.target.value as 'Packing' | 'On the Way' | 'Delivered',
                            })
                          }
                        >
                          <option value='Packing'>Packing</option>
                          <option value='On the Way'>On the Way</option>
                          <option value='Delivered'>Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Order Summary Card */}
                  <div className='card bg-light-primary border-primary border border-dashed p-4 rounded-3 mb-2'>
                    <div className='d-flex flex-row align-items-center justify-content-between'>
                      <div>
                        <div className='fw-bolder text-gray-800 fs-7'>Order Total Calculation:</div>
                        <div className='text-gray-700 fw-semibold fs-8'>
                          {newOrder.numberOfBottles} × {newOrder.bottleType} (<span className='product-code-tag'>Product Code: {newOrder.bottleType === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span>) • {newOrder.planType}
                        </div>
                      </div>
                      <div className='fs-3 fw-bolder text-primary'>
                        GH₵ {(
                          newOrder.planType === 'Annual Plan'
                            ? Math.round(newOrder.numberOfBottles * (newOrder.bottleType === '500g plastic bottles' ? 100 : 85) * 12 * 0.9)
                            : newOrder.numberOfBottles * (newOrder.bottleType === '500g plastic bottles' ? 100 : 85)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 pb-6 px-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold'>
                    Create Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Order Details & Management Modal */}
      {selectedOrder && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
                <div className='d-flex align-items-center gap-3'>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`badge badge-light-${
                      selectedOrder.deliveryStatus === 'Delivered'
                        ? 'success'
                        : selectedOrder.deliveryStatus === 'On the Way'
                        ? 'primary'
                        : 'warning'
                    } fw-bold`}
                  >
                    {selectedOrder.deliveryStatus}
                  </span>
                  <span
                    className={`badge badge-light-${
                      selectedOrder.paymentStatus === 'Paid' ? 'success' : 'danger'
                    } fw-bold`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-color-primary'
                  onClick={() => setSelectedOrder(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveOrderDetails}>
                <div className='modal-body pt-4 pb-6 px-8' style={{maxHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
                  <div className='card bg-light p-4 mb-5 rounded-3 border-0'>
                    <div className='row g-3'>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>BUYER NAME</div>
                        <div className='fw-bolder text-gray-900 fs-6'>{selectedOrder.buyerName}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>PHONE NUMBER</div>
                        <div className='fw-bold text-gray-800 fs-7'>{selectedOrder.phoneNumber}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>PLAN TYPE</div>
                        <div className='fw-bold text-gray-900 fs-7'>{selectedOrder.planType}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>BOTTLE & PRODUCT CODE</div>
                        <div className='fw-bold text-primary fs-7'>
                          {selectedOrder.numberOfBottles}x {selectedOrder.bottleType}
                        </div>
                        <span className='badge badge-light-primary fw-bold fs-8 product-code-badge mt-1'>Product Code: {selectedOrder.sku}</span>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>PAYMENT METHOD</div>
                        <div className='fw-bold text-gray-800 fs-7'>{selectedOrder.paymentMethod}</div>
                      </div>
                      <div className='col-6'>
                        <div className='text-muted fs-8 fw-bold'>TOTAL BILL</div>
                        <div className='fw-bolder text-success fs-5'>{selectedOrder.amountGHS}</div>
                      </div>
                    </div>
                  </div>

                  <div className='row g-4'>
                    <div className='col-md-6'>
                      <label className='form-label fw-bold text-gray-800 fs-7'>Update Delivery Status</label>
                      <select
                        className='form-select form-select-solid'
                        value={selectedOrder.deliveryStatus}
                        onChange={(e) =>
                          setSelectedOrder({
                            ...selectedOrder,
                            deliveryStatus: e.target.value as 'Delivered' | 'On the Way' | 'Packing',
                          })
                        }
                      >
                        <option value='Packing'>Packing</option>
                        <option value='On the Way'>On the Way</option>
                        <option value='Delivered'>Delivered</option>
                      </select>
                    </div>

                    <div className='col-md-6'>
                      <label className='form-label fw-bold text-gray-800 fs-7'>Update Payment Status</label>
                      <select
                        className='form-select form-select-solid'
                        value={selectedOrder.paymentStatus}
                        onChange={(e) =>
                          setSelectedOrder({
                            ...selectedOrder,
                            paymentStatus: e.target.value as 'Paid' | 'Pending',
                          })
                        }
                      >
                        <option value='Paid'>Paid</option>
                        <option value='Pending'>Pending Payment</option>
                      </select>
                    </div>
                  </div>

                  {selectedOrder.deliveryStatus !== 'Delivered' && (
                    <div className='mt-5 pt-4 border-top d-flex align-items-center justify-content-between'>
                      <div>
                        <div className='fw-bold text-gray-800 fs-7'>Quick Action</div>
                        <div className='text-muted fs-8'>Mark this order as fulfilled and paid right away</div>
                      </div>
                      <button
                        type='button'
                        className='btn btn-sm btn-light-success fw-bold d-flex align-items-center'
                        onClick={() => handleMarkPaidAndDelivered(selectedOrder.id)}
                      >
                        <CheckCircle size={15} className='me-2' />
                        Mark as Paid & Delivered
                      </button>
                    </div>
                  )}
                </div>

                <div className='modal-footer border-0 pt-0 pb-6 px-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setSelectedOrder(null)}
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

export {OrdersPage}
