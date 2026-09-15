/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState} from 'react'
import {Link} from 'react-router-dom'
import {
  ShoppingBag,
  Smartphone,
  UserPlus,
  Truck,
  CheckCheck,
  Bell,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import {useNotifications} from '@/components/notifications'

type TabType = 'all' | 'purchase' | 'subscriber' | 'delivery'

const categoryIcons: Record<string, any> = {
  purchase: ShoppingBag,
  subscriber: Smartphone,
  user: UserPlus,
  delivery: Truck,
  system: Bell,
  ussd: Smartphone,
}

const HeaderNotificationsMenu: FC = () => {
  const {notifications, unreadCount, markAsRead, markAllAsRead, triggerSampleToast} =
    useNotifications()
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true
    if (activeTab === 'purchase') return item.category === 'purchase'
    if (activeTab === 'subscriber') return item.category === 'subscriber'
    if (activeTab === 'delivery') return item.category === 'delivery' || item.category === 'user'
    return true
  })

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-400px shadow-lg rounded-3'
      data-kt-menu='true'
    >
      {/* Menu Header with default primary blue gradient */}
      <div
        className='d-flex flex-column rounded-top p-6'
        style={{
          background: 'linear-gradient(135deg, #009ef7 0%, #0077c5 100%)',
        }}
      >
        <div className='d-flex align-items-center justify-content-between mb-4'>
          <div className='d-flex align-items-center'>
            <Bell size={20} className='text-white me-2' />
            <h3 className='text-white fw-bold m-0 fs-4'>Notifications</h3>
            {unreadCount > 0 && (
              <span className='badge badge-white text-primary fw-bolder fs-8 ms-3 px-2 py-1'>
                {unreadCount} new
              </span>
            )}
          </div>

          <div className='d-flex align-items-center gap-1'>
            <button
              onClick={() => triggerSampleToast()}
              className='btn btn-xs btn-white btn-color-primary btn-active-light fw-bold py-1 px-2 fs-8'
              title='Simulate a new honey notification'
            >
              <Sparkles size={12} className='me-1' /> Test Alert
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className='btn btn-xs btn-white btn-color-primary btn-active-light fw-bold py-1 px-2 fs-8'
                title='Mark all as read'
              >
                <CheckCheck size={13} className='me-1' /> Read All
              </button>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className='nav nav-line-tabs nav-line-tabs-2x border-0 fw-bold fs-7'>
          <button
            onClick={() => setActiveTab('all')}
            className={`nav-link text-white py-2 px-3 border-0 rounded-pill ${
              activeTab === 'all' ? 'bg-white bg-opacity-20 text-white' : 'opacity-75'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`nav-link text-white py-2 px-3 border-0 rounded-pill ${
              activeTab === 'purchase' ? 'bg-white bg-opacity-20 text-white' : 'opacity-75'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('subscriber')}
            className={`nav-link text-white py-2 px-3 border-0 rounded-pill ${
              activeTab === 'subscriber' ? 'bg-white bg-opacity-20 text-white' : 'opacity-75'
            }`}
          >
            USSD
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`nav-link text-white py-2 px-3 border-0 rounded-pill ${
              activeTab === 'delivery' ? 'bg-white bg-opacity-20 text-white' : 'opacity-75'
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Notification Items List */}
      <div className='scroll-y mh-350px my-2 px-4'>
        {filteredNotifications.length === 0 ? (
          <div className='text-center py-8 text-muted'>
            <Bell size={32} className='text-gray-400 mb-2 opacity-50' />
            <p className='fs-7 mb-0'>No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const Icon = categoryIcons[item.category] || ShoppingBag
            return (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`d-flex align-items-center justify-content-between p-3 my-1 rounded-2 cursor-pointer transition-all ${
                  item.read ? 'bg-hover-light' : 'bg-light-primary bg-opacity-50'
                }`}
              >
                <div className='d-flex align-items-center flex-grow-1 me-2'>
                  <div
                    className={`symbol symbol-40px me-3 flex-shrink-0 bg-light-${item.badgeColor} text-${item.badgeColor} d-flex align-items-center justify-content-center rounded-circle`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className='d-flex flex-column'>
                    <div className='d-flex align-items-center'>
                      <span className='fs-6 text-gray-900 fw-bold me-2'>{item.title}</span>
                      {!item.read && (
                        <span className='bullet bullet-dot bg-primary h-6px w-6px' />
                      )}
                    </div>
                    <span className='text-muted fs-7 lh-sm mt-1'>{item.description}</span>
                    <div className='d-flex align-items-center mt-2'>
                      <span className='badge badge-light fs-9 me-3'>{item.time}</span>
                      <Link
                        to={item.link}
                        className={`text-${item.badgeColor} text-hover-primary fs-8 fw-bold d-inline-flex align-items-center`}
                      >
                        Open <ArrowRight size={11} className='ms-1' />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer link to Orders */}
      <div className='py-3 px-6 text-center border-top bg-light'>
        <Link
          to='/orders'
          className='btn btn-sm btn-color-gray-600 btn-active-color-primary fw-bold fs-7 d-inline-flex align-items-center'
        >
          View All Honey Orders & Activity <ArrowRight size={14} className='ms-1' />
        </Link>
      </div>
    </div>
  )
}

export {HeaderNotificationsMenu}
