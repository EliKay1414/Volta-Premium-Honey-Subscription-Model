/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {
  Package,
  Users,
  Award,
  Plus,
  Search,
  ShoppingCart,
  Calendar,
  X,
  Truck,
  PauseCircle,
  PlayCircle,
  Phone,
  Eye,
  Barcode,
  CreditCard,
} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'
import {DeliveryCalendarPicker} from '@/components/calendar/DeliveryCalendarPicker'

interface HoneySubscriber {
  id: string
  name: string
  phoneNumber: string
  gender: 'Male' | 'Female'
  dob: string
  region: string
  planType: 'Monthly Plan' | 'Annual Plan' | 'Free Trial'
  bottleChoice: '500g plastic bottles' | '330g plastic bottles'
  sku: string
  quantity: number
  frequency: string
  bottlesCount: string
  paymentMethod: string
  paymentStatus: 'Paid' | 'Pending Payment' | 'Annual Pre-paid'
  status: 'Active' | 'Trial' | 'Paused'
  monthlyAmountGHS: string
  nextDelivery: string
  avatarColor: string
}

const GHANA_REGIONS = [
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

const ORDERED_FREQUENCIES = [
  {value: 'Weekly', label: 'Weekly (Every 7 days)'},
  {value: 'Bi-Weekly', label: 'Bi-weekly (Every 2 weeks)'},
  {value: 'Monthly', label: 'Monthly (Once a month)'},
  {value: 'Quarterly', label: 'Quarterly (Every 3 months)'},
  {value: 'Semi-annually', label: 'Semi-annually (Every 6 months)'},
  {value: 'Annually', label: 'Annually (Once a year)'},
] as const

const mockHoneySubscribers: HoneySubscriber[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phoneNumber: '+233 24 111 2233',
    gender: 'Female',
    dob: '12/04/1990',
    region: 'Greater Accra',
    planType: 'Monthly Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 4,
    frequency: 'Monthly',
    bottlesCount: '4 Bottles / Month',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Paid',
    status: 'Active',
    monthlyAmountGHS: 'GH₵ 400',
    nextDelivery: 'Sep 15, 2026',
    avatarColor: 'primary',
  },
  {
    id: '2',
    name: 'Michael Davis',
    phoneNumber: '+233 20 333 4455',
    gender: 'Male',
    dob: '28/09/1986',
    region: 'Ashanti',
    planType: 'Monthly Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 3,
    frequency: 'Monthly',
    bottlesCount: '3 Bottles / Month',
    paymentMethod: 'Telecel Cash',
    paymentStatus: 'Paid',
    status: 'Active',
    monthlyAmountGHS: 'GH₵ 300',
    nextDelivery: 'Sep 18, 2026',
    avatarColor: 'success',
  },
  {
    id: '3',
    name: 'Emma Watson',
    phoneNumber: '+233 55 444 3322',
    gender: 'Female',
    dob: '15/04/1992',
    region: 'Central',
    planType: 'Free Trial',
    bottleChoice: '330g plastic bottles',
    sku: 'VIV-330-PL',
    quantity: 1,
    frequency: 'One-Time Sample',
    bottlesCount: '1 Bottle (Sample)',
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Paid',
    status: 'Trial',
    monthlyAmountGHS: 'Free Trial',
    nextDelivery: 'Sep 22, 2026',
    avatarColor: 'info',
  },
  {
    id: '4',
    name: 'David Wilson',
    phoneNumber: '+233 55 555 6677',
    gender: 'Male',
    dob: '17/02/1993',
    region: 'Central',
    planType: 'Annual Plan',
    bottleChoice: '500g plastic bottles',
    sku: 'VIV-500-PL',
    quantity: 3,
    frequency: 'Monthly',
    bottlesCount: '3 Bottles / Month',
    paymentMethod: 'Bank Card / Visa',
    paymentStatus: 'Annual Pre-paid',
    status: 'Active',
    monthlyAmountGHS: 'GH₵ 3,240 / yr',
    nextDelivery: 'Sep 25, 2026',
    avatarColor: 'primary',
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    phoneNumber: '+233 27 777 8899',
    gender: 'Female',
    dob: '03/11/1995',
    region: 'Volta',
    planType: 'Monthly Plan',
    bottleChoice: '330g plastic bottles',
    sku: 'VIV-330-PL',
    quantity: 2,
    frequency: 'Bi-Weekly',
    bottlesCount: '2 Bottles / Month',
    paymentMethod: 'MTN Mobile Money',
    paymentStatus: 'Pending Payment',
    status: 'Paused',
    monthlyAmountGHS: 'GH₵ 170',
    nextDelivery: 'Paused',
    avatarColor: 'secondary',
  },
]

const DashboardPage: FC = () => {
  const {showToast} = useNotifications()
  const [subscribers, setSubscribers] = usePersistentState<HoneySubscriber[]>('vivaldi_subscribers', mockHoneySubscribers)
  const [deliveries] = usePersistentState<any[]>('vivaldi_deliveries', [])
  const [orders] = usePersistentState<any[]>('vivaldi_orders', [])
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | null>('vivaldi_highlighted_row_dashboard', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_highlighted_col_dashboard', null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals state
  const [isAddSubscriberModalOpen, setIsAddSubscriberModalOpen] = useState(false)
  const [isBottlingModalOpen, setIsBottlingModalOpen] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState<HoneySubscriber | null>(null)

  // Bottling Schedule State (Persistent)
  const [bottlingSchedule, setBottlingSchedule] = usePersistentState('vivaldi_bottling_schedule', {
    date: 'Sep 15, 2026',
    batchBottles: '3,200',
    note: 'Bottling honey for Accra and Volta deliveries.',
  })

  // Dynamic metrics derived from live persistent state
  const totalSubscribersCount = subscribers.length
  const activeSubscribersCount = subscribers.filter((s) => s.status === 'Active').length
  const activePercent = totalSubscribersCount > 0 ? Math.round((activeSubscribersCount / totalSubscribersCount) * 100) : 100

  // Bottles Delivered: dynamic sum of delivered orders + subscriber fulfilled bottles
  const totalBottlesDelivered =
    deliveries.filter((d) => d.status === 'Delivered').reduce((sum, d) => sum + (Number(d.numberOfBottles) || 0), 0) +
    orders.filter((o) => o.deliveryStatus === 'Delivered').reduce((sum, o) => sum + (Number(o.numberOfBottles) || 0), 0) +
    subscribers.reduce((sum, s) => sum + (Number((s as any).totalBottlesBought) || Number(s.quantity) * 2 || 0), 0)

  // Monthly Honey Sales in Ghana Cedis
  const monthlySales = subscribers
    .filter((s) => s.status === 'Active')
    .reduce((sum, s) => {
      const price = s.bottleChoice === '500g plastic bottles' ? 100 : 85
      const qty = Number(s.quantity) || 1
      const base = qty * price
      return sum + (s.planType === 'Annual Plan' ? Math.round(base * 12 * 0.9) : base)
    }, 0)

  // Repeat Buyer Rate
  const repeatBuyersCount = subscribers.filter(
    (s) => (s as any).customerType === 'Active Customer / Buyer' || (s.quantity && s.quantity >= 3)
  ).length
  const repeatRate = totalSubscribersCount > 0 ? Math.round((repeatBuyersCount / totalSubscribersCount) * 100) : 98

  // Bottle Sizes preference breakdown
  const count500g = subscribers.filter((s) => s.bottleChoice === '500g plastic bottles').length
  const count330g = subscribers.filter((s) => s.bottleChoice === '330g plastic bottles').length
  const totalPref = count500g + count330g || 1
  const percent500g = Math.round((count500g / totalPref) * 100)
  const percent330g = 100 - percent500g

  // Add Subscriber Form State
  const [newSub, setNewSub] = useState({
    name: '',
    phoneNumber: '',
    gender: 'Male' as 'Male' | 'Female',
    dob: '15/06/1993',
    region: 'Greater Accra',
    planType: 'Monthly Plan' as 'Monthly Plan' | 'Annual Plan' | 'Free Trial',
    bottleChoice: '500g plastic bottles' as '500g plastic bottles' | '330g plastic bottles',
    monthlyCount: 3,
    frequency: 'Monthly',
    paymentMethod: 'MTN Mobile Money' as string,
    paymentStatus: 'Paid' as 'Paid' | 'Pending Payment' | 'Annual Pre-paid',
    landmark: '',
    nextDelivery: 'Sep 28, 2026',
    status: 'Active' as 'Active' | 'Trial',
  })

  const handleQuickOrder = () => {
    showToast({
      category: 'purchase',
      title: 'Order Recorded',
      description: 'Quick walk-in sale of 2x 500g plastic bottles (GH₵ 200) recorded successfully.',
      badgeColor: 'primary',
      link: '/orders',
      linkLabel: 'View Orders',
    })
  }

  const handleAddSubscriberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSub.name || !newSub.phoneNumber) return

    const pricePerBottle = newSub.bottleChoice === '500g plastic bottles' ? 100 : 85
    let totalGHS = newSub.monthlyCount * pricePerBottle
    if (newSub.planType === 'Annual Plan') {
      totalGHS = Math.round(totalGHS * 12 * 0.9)
    }

    const skuCode = newSub.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'
    const billFormatted =
      newSub.status === 'Trial'
        ? 'Free Trial'
        : newSub.planType === 'Annual Plan'
        ? `GH₵ ${totalGHS.toLocaleString()} / yr`
        : `GH₵ ${totalGHS.toLocaleString()}`

    const created: HoneySubscriber = {
      id: `sub-${Date.now()}`,
      name: newSub.name,
      phoneNumber: newSub.phoneNumber,
      gender: newSub.gender,
      dob: newSub.dob || '01/01/1990',
      region: newSub.region,
      planType: newSub.planType,
      bottleChoice: newSub.bottleChoice,
      sku: skuCode,
      quantity: Number(newSub.monthlyCount),
      frequency: newSub.frequency,
      bottlesCount: `${newSub.monthlyCount} Bottles / Month`,
      paymentMethod: newSub.paymentMethod,
      paymentStatus: newSub.paymentStatus,
      status: newSub.status,
      monthlyAmountGHS: billFormatted,
      nextDelivery: newSub.nextDelivery,
      avatarColor: 'primary',
      // Compatibility with SubscribersPage Subscriber
      ...({
        nextDeliveryDate: newSub.nextDelivery,
        billAmountGHS: billFormatted,
        landmark: newSub.landmark || 'Ghana Address',
        totalBottlesBought: Number(newSub.monthlyCount),
        totalSpentGHS: `GH₵ ${totalGHS.toLocaleString()}`,
        supportAgent: 'Abena Osei',
        customerType: 'Active Customer / Buyer',
      } as any),
    }

    setSubscribers([created, ...subscribers])
    setHighlightedRowId(created.id)
    setHighlightedColId('name')
    setIsAddSubscriberModalOpen(false)
    setNewSub({
      name: '',
      phoneNumber: '',
      gender: 'Male',
      dob: '15/06/1993',
      region: 'Greater Accra',
      planType: 'Monthly Plan',
      bottleChoice: '500g plastic bottles',
      monthlyCount: 3,
      frequency: 'Monthly',
      paymentMethod: 'MTN Mobile Money',
      paymentStatus: 'Paid',
      landmark: '',
      nextDelivery: 'Sep 28, 2026',
      status: 'Active',
    })

    showToast({
      category: 'subscriber',
      title: 'New Subscriber Added',
      description: `${created.name} was added with ${created.bottlesCount} (${created.bottleChoice} • Product Code: ${created.sku} • ${created.planType})`,
      badgeColor: 'success',
      link: '/subscribers',
      linkLabel: 'View Subscribers',
    })
  }

  const handleToggleSubscriberStatus = (subId: string) => {
    setHighlightedRowId(subId)
    setHighlightedColId('status')
    setSubscribers((prev) =>
      prev.map((s) => {
        if (s.id === subId) {
          const nextStatus: 'Active' | 'Paused' = s.status === 'Active' ? 'Paused' : 'Active'
          const updated: HoneySubscriber = {
            ...s,
            status: nextStatus,
            nextDelivery: nextStatus === 'Active' ? 'Next Monday' : 'Paused',
          }
          setSelectedSubscriber(updated)
          showToast({
            category: 'subscriber',
            title: `Subscription ${nextStatus}`,
            description: `${s.name}'s plan is now ${nextStatus}`,
            badgeColor: nextStatus === 'Active' ? 'success' : 'warning',
            link: '/subscribers',
          })
          return updated
        }
        return s
      })
    )
  }

  const handleDispatchDelivery = (sub: HoneySubscriber) => {
    setHighlightedRowId(sub.id)
    setHighlightedColId('status')
    showToast({
      category: 'delivery',
      title: 'Delivery Dispatched',
      description: `Dispatched ${sub.bottlesCount} to ${sub.name} (${sub.phoneNumber})`,
      badgeColor: 'primary',
      link: '/delivery',
      linkLabel: 'Track in Delivery',
    })
  }

  const handleUpdateSubscriberDelivery = (newDate: string) => {
    if (!selectedSubscriber) return
    const updated: HoneySubscriber = {
      ...selectedSubscriber,
      nextDelivery: newDate,
      ...({
        nextDeliveryDate: newDate,
      } as any),
    }
    setSelectedSubscriber(updated)
    setSubscribers((prev) => prev.map((s) => (s.id === selectedSubscriber.id ? updated : s)))
    showToast({
      category: 'delivery',
      title: 'Delivery Schedule Updated',
      description: `Next delivery schedule for ${selectedSubscriber.name} set to ${newDate}`,
      badgeColor: 'primary',
    })
  }

  const handleSaveBottlingSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBottlingModalOpen(false)
    showToast({
      category: 'system',
      title: 'Bottling Schedule Updated',
      description: `Next batch scheduled for ${bottlingSchedule.date} (${bottlingSchedule.batchBottles} bottles target)`,
      badgeColor: 'primary',
    })
  }

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.phoneNumber.includes(searchTerm) ||
      sub.bottleChoice.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // ShadcnTable Columns: Primary Order: Name, Tel, Gender, Dob, Chosen Plan, Bottle & SKU, Quantity & Frequency, Payment Follows, Status, Region (before Action), Action
  const columns: ShadcnColumn<HoneySubscriber>[] = [
    {
      id: 'name',
      header: 'Subscriber Name',
      accessor: 'name',
      render: (item) => (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-35px me-3'>
            <span
              className={`symbol-label bg-light-${item.avatarColor} text-${item.avatarColor} fw-bold fs-6`}
            >
              {item.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <span className='text-gray-900 fw-bold fs-7 text-nowrap'>{item.name}</span>
        </div>
      ),
    },
    {
      id: 'phoneNumber',
      header: 'Tel',
      accessor: 'phoneNumber',
      render: (item) => (
        <span className='text-gray-800 fs-7 text-nowrap'>{item.phoneNumber}</span>
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
      id: 'planType',
      header: 'Chosen Plan',
      accessor: 'planType',
      render: (item) => {
        const isAnnual = item.planType === 'Annual Plan'
        const isTrial = item.planType === 'Free Trial'
        return (
          <span
            className={`badge ${
              isAnnual
                ? 'badge-light-success text-success'
                : isTrial
                ? 'badge-light-primary text-primary'
                : 'badge-light-info text-info'
            } fw-bold fs-8 text-nowrap`}
          >
            {item.planType}
          </span>
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
            <Barcode size={11} className='me-1 text-gray-500' />
            Product Code: {item.sku}
          </span>
        </div>
      ),
    },
    {
      id: 'bottlesCount',
      header: 'Quantity & Frequency',
      accessor: 'quantity',
      render: (item) => (
        <div className='d-flex flex-column text-nowrap'>
          <span className='text-gray-900 fw-bold fs-7 d-flex align-items-center'>
            <Package size={12} className='me-1 text-primary' />
            {item.quantity} Bottles
          </span>
          <span className='text-muted fs-8 mt-0.5'>{item.frequency}</span>
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
            <span
              className={`badge ${
                isPaid ? 'badge-light-success text-success' : 'badge-light-warning text-warning'
              } fw-bold fs-8 w-fit d-inline-flex align-items-center gap-1`}
            >
              <CreditCard size={11} />
              {item.paymentStatus} • {item.monthlyAmountGHS}
            </span>
            <span className='text-muted fs-8 mt-0.5'>{item.paymentMethod}</span>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span
          className={`badge badge-light-${
            item.status === 'Active'
              ? 'success'
              : item.status === 'Trial'
              ? 'primary'
              : 'secondary'
          } fs-8 fw-bold text-nowrap`}
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
        <button
          type='button'
          className='btn btn-xs btn-light btn-active-light-primary fw-bold text-nowrap'
          onClick={() => {
            setSelectedSubscriber(item)
            setHighlightedRowId(item.id)
            setHighlightedColId('bottleChoice')
          }}
        >
          <Eye size={12} className='me-1' /> View
        </button>
      ),
    },
  ]

  return (
    <>
      {/* Welcome Banner */}
      <div className='card card-flush mb-6 bg-light-primary border border-primary border-dashed'>
        <div className='card-body p-5 p-md-6'>
          <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-4'>
            <div>
              <h2 className='text-gray-900 fw-bolder fs-2 fs-md-1 mb-1'>Honey Subscriptions Overview</h2>
              <p className='text-muted fs-7 fs-md-6 mb-0'>
                Track your honey subscribers, deliveries, and sales performance in one place.
              </p>
            </div>
            <div className='d-flex flex-wrap flex-sm-nowrap gap-2 gap-sm-3 w-100 w-sm-auto'>
              <button
                type='button'
                className='btn btn-sm btn-light-primary fw-bold flex-fill flex-sm-grow-0'
                onClick={handleQuickOrder}
              >
                <ShoppingCart size={16} className='me-1' /> Record Sale
              </button>
              <button
                type='button'
                className='btn btn-sm btn-primary fw-bold flex-fill flex-sm-grow-0'
                onClick={() => setIsAddSubscriberModalOpen(true)}
              >
                <Plus size={16} className='me-1' /> Add Subscriber
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards - Clean 2x2 grid on mobile, 4 columns on desktop */}
      <div className='row g-3 g-md-6 mb-6'>
        {/* Active Subscribers */}
        <div className='col-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body p-4 p-md-6 d-flex flex-column justify-content-between'>
              <div className='d-flex align-items-start justify-content-between mb-2 mb-md-3'>
                <div>
                  <span className='text-gray-500 fs-8 fs-md-7 fw-bold d-block mb-1'>Active Subscribers</span>
                  <span className='fs-2 fs-md-2hx fw-bolder text-gray-900 lh-1 text-nowrap'>{activeSubscribersCount.toLocaleString()}</span>
                </div>
                <div className='symbol symbol-35px symbol-md-45px bg-light-primary flex-shrink-0 ms-2'>
                  <span className='symbol-label'>
                    <Users size={18} className='text-primary' />
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center flex-wrap gap-1 gap-md-2 pt-1 pt-md-2'>
                <span className='badge badge-light-success fs-9 fs-md-8 fw-bold'>{activePercent}% active</span>
                <span className='text-muted fs-9 fs-md-7 d-none d-sm-inline'>of {totalSubscribersCount.toLocaleString()} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottles Delivered */}
        <div className='col-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body p-4 p-md-6 d-flex flex-column justify-content-between'>
              <div className='d-flex align-items-start justify-content-between mb-2 mb-md-3'>
                <div>
                  <span className='text-gray-500 fs-8 fs-md-7 fw-bold d-block mb-1'>Bottles Delivered</span>
                  <span className='fs-2 fs-md-2hx fw-bolder text-gray-900 lh-1 text-nowrap'>{totalBottlesDelivered.toLocaleString()}</span>
                </div>
                <div className='symbol symbol-35px symbol-md-45px bg-light-success flex-shrink-0 ms-2'>
                  <span className='symbol-label'>
                    <Package size={18} className='text-success' />
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center flex-wrap gap-1 gap-md-2 pt-1 pt-md-2'>
                <span className='badge badge-light-success fs-9 fs-md-8 fw-bold'>Live</span>
                <span className='text-muted fs-9 fs-md-7 d-none d-sm-inline'>fulfilled bottles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Honey Sales */}
        <div className='col-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body p-4 p-md-6 d-flex flex-column justify-content-between'>
              <div className='d-flex align-items-start justify-content-between mb-2 mb-md-3'>
                <div>
                  <span className='text-gray-500 fs-8 fs-md-7 fw-bold d-block mb-1'>Monthly Sales</span>
                  <span className='fs-2 fs-md-2hx fw-bolder text-gray-900 lh-1 text-nowrap'>GH₵ {monthlySales.toLocaleString()}</span>
                </div>
              </div>
              <div className='d-flex align-items-center flex-wrap gap-1 gap-md-2 pt-1 pt-md-2'>
                <span className='badge badge-light-success fs-9 fs-md-8 fw-bold'>Active</span>
                <span className='text-muted fs-9 fs-md-7 d-none d-sm-inline'>monthly recurring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Repeat Buyer Rate */}
        <div className='col-6 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-body p-4 p-md-6 d-flex flex-column justify-content-between'>
              <div className='d-flex align-items-start justify-content-between mb-2 mb-md-3'>
                <div>
                  <span className='text-gray-500 fs-8 fs-md-7 fw-bold d-block mb-1'>Repeat Rate</span>
                  <span className='fs-2 fs-md-2hx fw-bolder text-gray-900 lh-1 text-nowrap'>{repeatRate}%</span>
                </div>
                <div className='symbol symbol-35px symbol-md-45px bg-light-info flex-shrink-0 ms-2'>
                  <span className='symbol-label'>
                    <Award size={18} className='text-info' />
                  </span>
                </div>
              </div>
              <div className='d-flex align-items-center flex-wrap gap-1 gap-md-2 pt-1 pt-md-2'>
                <span className='badge badge-light-info fs-9 fs-md-8 fw-bold'>{repeatBuyersCount} repeat</span>
                <span className='text-muted fs-9 fs-md-7 d-none d-sm-inline'>loyal base</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Breakdown & Main Subscribers Table */}
      <div className='row g-5 g-xl-8 mb-6'>
        {/* Bottle Sizes Distribution */}
        <div className='col-12 col-xl-3'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-header pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder text-gray-900'>Bottle Sizes</span>
                <span className='text-muted mt-1 fw-bold fs-7'>Buyer preference breakdown</span>
              </h3>
            </div>
            <div className='card-body pt-4'>
              <div className='d-flex flex-column gap-5'>
                <div>
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='fw-bold text-gray-700'>500g plastic bottles</span>
                    <span className='fw-bolder text-gray-900'>{count500g.toLocaleString()} ({percent500g}%)</span>
                  </div>
                  <div className='progress h-8px bg-light'>
                    <div className='progress-bar bg-primary' style={{width: `${percent500g}%`}}></div>
                  </div>
                </div>

                <div>
                  <div className='d-flex justify-content-between mb-1'>
                    <span className='fw-bold text-gray-700'>330g plastic bottles</span>
                    <span className='fw-bolder text-gray-900'>{count330g.toLocaleString()} ({percent330g}%)</span>
                  </div>
                  <div className='progress h-8px bg-light'>
                    <div className='progress-bar bg-info' style={{width: `${percent330g}%`}}></div>
                  </div>
                </div>
              </div>

              <div className='separator my-6'></div>

              <div className='bg-light-primary rounded p-4'>
                <div className='d-flex align-items-center justify-content-between flex-wrap gap-2'>
                  <div className='d-flex align-items-center'>
                    <Award size={20} className='text-primary me-3 flex-shrink-0' />
                    <div>
                      <span className='text-gray-900 fw-bold d-block fs-7'>Next Bottling Schedule</span>
                      <span className='text-muted fs-8'>Target: {bottlingSchedule.batchBottles} bottles on {bottlingSchedule.date}</span>
                    </div>
                  </div>
                  <button
                    type='button'
                    className='btn btn-sm btn-primary fw-bold text-nowrap d-flex align-items-center gap-1 shadow-sm px-3'
                    onClick={() => setIsBottlingModalOpen(true)}
                    title='Update bottling schedule date and targets'
                  >
                    <Calendar size={14} /> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Subscribers List */}
        <div className='col-12 col-xl-9'>
          <div className='card card-flush h-100 shadow-sm'>
            <div className='card-header pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder text-gray-900'>Recent Honey Subscribers</span>
                <span className='text-muted mt-1 fw-bold fs-7'>
                  Overview of recent subscribers with their chosen plans, bottle sizes, and payment status
                </span>
              </h3>
            </div>

            <div className='card-body pt-2'>
              {/* Search & Status Filter */}
              <div className='d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center justify-content-between gap-3 mb-5'>
                <div className='position-relative w-100 w-sm-250px'>
                  <input
                    type='text'
                    className='form-control form-control-solid ps-10 form-control-sm'
                    placeholder='Search subscribers...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className='position-absolute top-50 start-0 translate-middle-y ms-3 text-gray-500'>
                    <Search size={14} />
                  </span>
                </div>

                <div className='d-flex flex-wrap gap-1 gap-sm-2'>
                  {['All', 'Active', 'Trial', 'Paused'].map((status) => (
                    <button
                      key={status}
                      type='button'
                      className={`btn btn-sm py-1.5 px-3 fs-7 fw-semibold ${
                        statusFilter === status ? 'btn-primary text-white shadow-xs' : 'btn-light text-gray-700'
                      }`}
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shadcn UI Table */}
              <ShadcnTable
                data={filteredSubscribers}
                columns={columns}
                defaultPageSize={5}
                pageSizeOptions={[5, 10, 20]}
                emptyMessage='No subscribers found'
                keyExtractor={(sub) => sub.id}
                highlightedRowId={highlightedRowId}
                highlightedColId={highlightedColId}
                onRowClick={(sub) => setHighlightedRowId(sub.id)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Add Subscriber Modal */}
      {isAddSubscriberModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-2 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Add New Honey Subscriber</h3>
                  <span className='text-muted fs-7'>Register subscriber details, bottle preference, and plan</span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-light-primary rounded-circle'
                  onClick={() => setIsAddSubscriberModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubscriberSubmit}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  {/* Section 1: Personal Details */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        1. Personal Details
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Full Name</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Kwame Mensah'
                          required
                          value={newSub.name}
                          onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                        />
                      </div>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Phone Number</label>
                        <input
                          type='tel'
                          className='form-control form-control-solid'
                          placeholder='+233 24 000 0000'
                          required
                          value={newSub.phoneNumber}
                          onChange={(e) => setNewSub({...newSub, phoneNumber: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Gender</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.gender}
                          onChange={(e) => setNewSub({...newSub, gender: e.target.value as 'Male' | 'Female'})}
                        >
                          <option value='Male'>Male</option>
                          <option value='Female'>Female</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Date of Birth (Dob)</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='DD/MM/YYYY'
                          value={newSub.dob}
                          onChange={(e) => setNewSub({...newSub, dob: e.target.value})}
                          required
                        />
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Region</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.region}
                          onChange={(e) => setNewSub({...newSub, region: e.target.value})}
                        >
                          {GHANA_REGIONS.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Plan & Subscription */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        2. Plan & Subscription
                      </span>
                    </div>
                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Chosen Plan</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.planType}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              planType: e.target.value as 'Monthly Plan' | 'Annual Plan' | 'Free Trial',
                            })
                          }
                        >
                          <option value='Monthly Plan'>Monthly Plan (Billed monthly)</option>
                          <option value='Annual Plan'>Annual Plan (Full year with 10% discount)</option>
                          <option value='Free Trial'>Free Trial Sample</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7'>Subscription Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.status}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              status: e.target.value as 'Active' | 'Trial',
                            })
                          }
                        >
                          <option value='Active'>Active Subscription</option>
                          <option value='Trial'>Free Trial Sample</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Bottle Choice & Delivery Preferences */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        3. Bottle & Delivery Options
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Bottle Size</label>
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
                          <option value='500g plastic bottles'>500g plastic bottles (GH₵ 100 • Large)</option>
                          <option value='330g plastic bottles'>330g plastic bottles (GH₵ 85 • Regular)</option>
                        </select>
                        <div className='form-text fs-8 text-muted mt-1'>
                          Product Code: {newSub.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}
                        </div>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Delivery Frequency</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.frequency}
                          onChange={(e) => setNewSub({...newSub, frequency: e.target.value})}
                        >
                          {ORDERED_FREQUENCIES.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className='row g-4'>
                      <div className='col-12'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Quantity (Bottles per delivery)</label>
                        <div className='d-flex align-items-center gap-2 mb-2'>
                          <div className='input-group input-group-solid' style={{maxWidth: '140px'}}>
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setNewSub({...newSub, monthlyCount: Math.max(1, newSub.monthlyCount - 1)})}
                            >
                              −
                            </button>
                            <input
                              type='number'
                              min={1}
                              max={200}
                              className='form-control form-control-solid text-center fw-bolder fs-6 px-1'
                              required
                              value={newSub.monthlyCount}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10)
                                setNewSub({...newSub, monthlyCount: isNaN(val) || val < 1 ? 1 : val})
                              }}
                            />
                            <button
                              type='button'
                              className='btn btn-light-primary px-3 py-2 fw-bold'
                              onClick={() => setNewSub({...newSub, monthlyCount: newSub.monthlyCount + 1})}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Payment Details */}
                  <div className='mb-6'>
                    <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                      <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                        4. Payment & Delivery Address
                      </span>
                    </div>
                    <div className='row g-3 g-md-4 mb-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Payment Method</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.paymentMethod}
                          onChange={(e) => setNewSub({...newSub, paymentMethod: e.target.value})}
                        >
                          <option value='MTN Mobile Money'>MTN Mobile Money (MoMo)</option>
                          <option value='Telecel Cash'>Telecel Cash (Vodafone Cash)</option>
                          <option value='Bank Card / Visa'>Bank Card / Visa / MasterCard</option>
                          <option value='Cash on Delivery'>Cash on Delivery</option>
                        </select>
                      </div>

                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7 required'>Payment Status</label>
                        <select
                          className='form-select form-select-solid'
                          value={newSub.paymentStatus}
                          onChange={(e) =>
                            setNewSub({
                              ...newSub,
                              paymentStatus: e.target.value as 'Paid' | 'Pending Payment' | 'Annual Pre-paid',
                            })
                          }
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Pending Payment'>Pending Payment</option>
                          <option value='Annual Pre-paid'>Annual Pre-paid</option>
                        </select>
                      </div>
                    </div>

                    <div className='row g-3 g-md-4'>
                      <div className='col-6'>
                        <label className='form-label fw-semibold text-gray-800 fs-7'>Delivery Landmark / Exact Address</label>
                        <input
                          type='text'
                          className='form-control form-control-solid'
                          placeholder='e.g. Near Mawuli Estate, Ho'
                          value={newSub.landmark}
                          onChange={(e) => setNewSub({...newSub, landmark: e.target.value})}
                        />
                      </div>
                      <div className='col-6'>
                        <DeliveryCalendarPicker
                          value={newSub.nextDelivery}
                          onChange={(date) => setNewSub({...newSub, nextDelivery: date})}
                          label='Next Delivery Schedule'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculated Bill Summary Card */}
                  <div className='card bg-light-primary border-primary border border-dashed p-4 rounded-3 mb-2'>
                    <div className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3'>
                      <div>
                        <div className='fw-bolder text-gray-800 fs-7'>
                          {newSub.planType === 'Annual Plan' ? 'Estimated Annual Bill (10% Saver):' : 'Estimated Monthly Fee:'}
                        </div>
                        <div className='text-gray-700 fw-semibold fs-8 mt-0.5'>
                          {newSub.monthlyCount} × {newSub.bottleChoice} (<span className='product-code-tag'>Product Code: {newSub.bottleChoice === '500g plastic bottles' ? 'VIV-500-PL' : 'VIV-330-PL'}</span>) • {newSub.planType} • {newSub.frequency}
                        </div>
                      </div>
                      <div className='fs-3 fw-bolder text-primary text-nowrap'>
                        {newSub.status === 'Trial' || newSub.planType === 'Free Trial'
                          ? 'Free Trial'
                          : `GH₵ ${(
                              newSub.planType === 'Annual Plan'
                                ? Math.round(
                                    newSub.monthlyCount *
                                      (newSub.bottleChoice === '500g plastic bottles' ? 100 : 85) *
                                      12 *
                                      0.9
                                  )
                                : newSub.monthlyCount *
                                  (newSub.bottleChoice === '500g plastic bottles' ? 100 : 85)
                            ).toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 pb-5 pb-md-6 px-5 px-md-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setIsAddSubscriberModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Add Subscriber
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Bottling Schedule Modal */}
      {isBottlingModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-600px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              <div className='modal-header pb-2 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Update Bottling Schedule</h3>
                  <span className='text-muted fs-7'>Set bottling dates and targets for honey packing</span>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-light-primary rounded-circle'
                  onClick={() => setIsBottlingModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveBottlingSchedule}>
                <div className='modal-body py-4 py-md-5 px-5 px-md-8'>
                  <div className='row g-3 g-md-4'>
                    <div className='col-6'>
                      <DeliveryCalendarPicker
                        value={bottlingSchedule.date}
                        onChange={(date) => setBottlingSchedule({...bottlingSchedule, date})}
                        label='Bottling Start Date'
                        required
                      />
                    </div>

                    <div className='col-6'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Batch Target (Bottles)</label>
                      <input
                        type='text'
                        className='form-control form-control-solid'
                        required
                        value={bottlingSchedule.batchBottles}
                        onChange={(e) => setBottlingSchedule({...bottlingSchedule, batchBottles: e.target.value})}
                      />
                    </div>

                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7'>Bottling Supervisor Notes</label>
                      <textarea
                        rows={3}
                        className='form-control form-control-solid'
                        value={bottlingSchedule.note}
                        onChange={(e) => setBottlingSchedule({...bottlingSchedule, note: e.target.value})}
                        placeholder='Add any operational notes or instructions...'
                      />
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 pb-5 pb-md-6 px-5 px-md-8 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setIsBottlingModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Save Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: View & Manage Subscriber Modal */}
      {selectedSubscriber && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            <div className='modal-content rounded-3 shadow-lg border-0'>
              {/* Header */}
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div className='d-flex align-items-center gap-3'>
                  <div className='symbol symbol-45px'>
                    <span className={`symbol-label bg-light-${selectedSubscriber.avatarColor} text-${selectedSubscriber.avatarColor} fw-bolder fs-5`}>
                      {selectedSubscriber.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className='d-flex align-items-center gap-2 flex-wrap'>
                      <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>{selectedSubscriber.name}</h3>
                      <span className={`badge badge-light-${selectedSubscriber.status === 'Active' ? 'success' : selectedSubscriber.status === 'Trial' ? 'primary' : 'secondary'} fw-bold fs-8`}>
                        {selectedSubscriber.status}
                      </span>
                    </div>
                    <span className='text-muted fs-7'>
                      {selectedSubscriber.phoneNumber} • {selectedSubscriber.gender} • {selectedSubscriber.region}
                    </span>
                  </div>
                </div>
                <button
                  type='button'
                  className='btn btn-sm btn-icon btn-active-light-primary rounded-circle'
                  onClick={() => setSelectedSubscriber(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className='modal-body py-4 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                {/* Details Section */}
                <div className='bg-light rounded-3 p-4 p-md-5 mb-5 border border-gray-200'>
                  <div className='row g-3 g-md-4'>
                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Subscription Plan</div>
                      <div className='fw-bold text-gray-900 fs-6'>{selectedSubscriber.planType}</div>
                      <span className='text-success fw-bolder fs-7'>{selectedSubscriber.monthlyAmountGHS}</span>
                    </div>

                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Bottle & SKU</div>
                      <div className='fw-bold text-primary fs-6'>{selectedSubscriber.bottleChoice}</div>
                      <span className='product-code-badge mt-1'>Product Code: {selectedSubscriber.sku}</span>
                    </div>

                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Quantity & Frequency</div>
                      <div className='fw-bold text-gray-800 fs-6 d-flex align-items-center'>
                        <Package size={14} className='text-primary me-1.5' />
                        {selectedSubscriber.quantity} Bottles • {selectedSubscriber.frequency}
                      </div>
                    </div>

                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Payment Follows</div>
                      <div className='fw-bold text-gray-800 fs-6'>{selectedSubscriber.paymentStatus}</div>
                      <span className='text-muted fs-8'>{selectedSubscriber.paymentMethod}</span>
                    </div>

                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Next Scheduled Delivery</div>
                      <div className='fw-bold text-gray-900 fs-6 d-flex align-items-center'>
                        <Calendar size={14} className='text-primary me-1.5' />
                        {selectedSubscriber.nextDelivery || (selectedSubscriber as any).nextDeliveryDate || 'Not Scheduled'}
                      </div>
                    </div>

                    <div className='col-6'>
                      <div className='text-gray-500 fs-8 fw-semibold text-uppercase mb-1'>Delivery Landmark</div>
                      <div className='fw-bold text-gray-800 fs-6'>
                        {(selectedSubscriber as any).landmark || selectedSubscriber.region + ' Address'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Controls & Schedule */}
                <div className='mb-2'>
                  <div className='d-flex align-items-center mb-3 pb-1 border-bottom border-gray-200'>
                    <span className='fs-8 fw-bolder text-uppercase text-gray-500 tracking-wider'>
                      Subscription Actions & Schedule
                    </span>
                  </div>

                  <div className='d-flex flex-column gap-3'>
                    {/* Reschedule Picker */}
                    <div className='p-3 bg-body border border-gray-200 rounded-3'>
                      <div className='row g-2 align-items-center'>
                        <div className='col-12 col-sm-5'>
                          <div className='fw-semibold text-gray-800 fs-7'>Reschedule Delivery</div>
                          <div className='text-muted fs-8'>Update upcoming delivery slot</div>
                        </div>
                        <div className='col-12 col-sm-7'>
                          <DeliveryCalendarPicker
                            value={selectedSubscriber.nextDelivery || (selectedSubscriber as any).nextDeliveryDate || ''}
                            onChange={handleUpdateSubscriberDelivery}
                            placeholder='Choose new delivery date'
                          />
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className='d-flex flex-wrap gap-2 pt-1'>
                      <button
                        type='button'
                        className={`btn btn-sm ${
                          selectedSubscriber.status === 'Active' ? 'btn-light-warning' : 'btn-light-success'
                        } fw-bold d-flex align-items-center flex-fill justify-content-center py-2.5`}
                        onClick={() => handleToggleSubscriberStatus(selectedSubscriber.id)}
                      >
                        {selectedSubscriber.status === 'Active' ? (
                          <>
                            <PauseCircle size={15} className='me-1.5' /> Pause Subscription
                          </>
                        ) : (
                          <>
                            <PlayCircle size={15} className='me-1.5' /> Resume Subscription
                          </>
                        )}
                      </button>

                      <button
                        type='button'
                        className='btn btn-sm btn-light-primary fw-bold d-flex align-items-center flex-fill justify-content-center py-2.5'
                        onClick={() => handleDispatchDelivery(selectedSubscriber)}
                      >
                        <Truck size={15} className='me-1.5' /> Instant Dispatch Delivery
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='modal-footer border-0 pt-0 pb-5 pb-md-6 px-5 px-md-8 justify-content-end'>
                <button
                  type='button'
                  className='btn btn-light'
                  onClick={() => setSelectedSubscriber(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const DashboardWrapper: FC = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Dashboard</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
