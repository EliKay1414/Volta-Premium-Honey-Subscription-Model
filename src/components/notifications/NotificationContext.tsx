import React, {createContext, useContext, useState, useEffect, FC, ReactNode} from 'react'
import {usePersistentState} from '@/hooks/usePersistentState'

export type NotificationCategory =
  | 'purchase'
  | 'subscriber'
  | 'user'
  | 'delivery'
  | 'system'
  | 'ussd'

export interface NotificationItem {
  id: string
  category: NotificationCategory
  title: string
  description: string
  time: string
  read: boolean
  badgeColor: 'primary' | 'success' | 'info' | 'warning'
  link: string
}

export interface ToastItem {
  id: string
  category: NotificationCategory
  title: string
  description: string
  time: string
  badgeColor: 'primary' | 'success' | 'info' | 'warning'
  link?: string
  linkLabel?: string
}

interface NotificationContextProps {
  notifications: NotificationItem[]
  unreadCount: number
  toasts: ToastItem[]
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  showToast: (toast: Omit<ToastItem, 'id' | 'time'>) => void
  dismissToast: (id: string) => void
  triggerSampleToast: (type?: NotificationCategory) => void
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'purchase',
    title: 'New Honey Order',
    description: 'Kwame Mensah ordered 4x 500g plastic bottles (GH₵ 400) via Mobile Money',
    time: '2m ago',
    read: false,
    badgeColor: 'primary',
    link: '/orders',
  },
  {
    id: 'notif-2',
    category: 'subscriber',
    title: 'New USSD Lead (*713*65#)',
    description: 'Ama Serwaa requested 2x 330g plastic bottles from Kumasi, Ashanti Region',
    time: '15m ago',
    read: false,
    badgeColor: 'info',
    link: '/prospects',
  },
  {
    id: 'notif-3',
    category: 'user',
    title: 'New Team Member Added',
    description: 'Abena Osei was added as Customer Support for USSD Desk',
    time: '45m ago',
    read: false,
    badgeColor: 'success',
    link: '/users',
  },
  {
    id: 'notif-4',
    category: 'delivery',
    title: 'Delivery on the Way',
    description: 'Order #ORD-7740 (3x 500g plastic bottles) dispatched to East Legon, Accra',
    time: '2h ago',
    read: false,
    badgeColor: 'warning',
    link: '/delivery',
  },
  {
    id: 'notif-5',
    category: 'subscriber',
    title: 'Monthly Subscription Refill',
    description: 'Kofi Boateng scheduled monthly delivery for 2x 500g plastic bottles (GH₵ 200)',
    time: '5h ago',
    read: true,
    badgeColor: 'primary',
    link: '/subscribers',
  },
]

const samplePool = [
  {
    category: 'purchase' as const,
    title: 'New Honey Order Placed',
    description: 'Yaw Acheampong bought 3x 500g plastic bottles (GH₵ 300) via MTN MoMo',
    badgeColor: 'primary' as const,
    link: '/orders',
    linkLabel: 'View in Orders',
  },
  {
    category: 'subscriber' as const,
    title: 'New USSD Inquiry (*713*65#)',
    description: 'Esi Darko dialed USSD *713*65# from Cape Coast requesting 330g plastic bottles',
    badgeColor: 'info' as const,
    link: '/prospects',
    linkLabel: 'View Prospects',
  },
  {
    category: 'user' as const,
    title: 'Team Member Activity',
    description: 'Daniel Arthur updated delivery status for 4 orders to "On the Way"',
    badgeColor: 'success' as const,
    link: '/users',
    linkLabel: 'View Team',
  },
  {
    category: 'delivery' as const,
    title: 'Bottles Delivered Successfully',
    description: 'Order #ORD-9102 (6x 330g plastic bottles) delivered to Ho, Volta Region',
    badgeColor: 'warning' as const,
    link: '/delivery',
    linkLabel: 'View Delivery',
  },
]

const NotificationContext = createContext<NotificationContextProps>({} as NotificationContextProps)

export const NotificationProvider: FC<{children: ReactNode}> = ({children}) => {
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>('vivaldi_notifications', initialNotifications)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const unreadCount = notifications.filter((n: NotificationItem) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev: NotificationItem[]) =>
      prev.map((item: NotificationItem) => (item.id === id ? {...item, read: true} : item))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev: NotificationItem[]) => prev.map((item: NotificationItem) => ({...item, read: true})))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev: NotificationItem[]) => prev.filter((item: NotificationItem) => item.id !== id))
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const showToast = (toast: Omit<ToastItem, 'id' | 'time'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastItem = {
      ...toast,
      id,
      time: 'Just now',
    }
    setToasts((prev) => [newToast, ...prev.slice(0, 3)]) // keep max 4 toasts
  }

  const triggerSampleToast = (type?: NotificationCategory) => {
    let pool = samplePool
    if (type) {
      pool = samplePool.filter((p) => p.category === type)
    }
    const sample = pool[Math.floor(Math.random() * pool.length)] || samplePool[0]

    showToast({
      category: sample.category,
      title: sample.title,
      description: sample.description,
      badgeColor: sample.badgeColor,
      link: sample.link,
      linkLabel: sample.linkLabel,
    })

    // Also add to notifications list
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      category: sample.category,
      title: sample.title,
      description: sample.description,
      time: 'Just now',
      read: false,
      badgeColor: sample.badgeColor,
      link: sample.link,
    }
    setNotifications((prev: NotificationItem[]) => [newNotif, ...prev])
  }

  // Fire a catchy welcome toast on initial load after a brief 2.5s delay
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast({
        category: 'purchase',
        title: 'New Honey Order Placed',
        description: 'Yaw Acheampong bought 3x 500g plastic bottles (GH₵ 300) via MTN MoMo',
        badgeColor: 'primary',
        link: '/orders',
        linkLabel: 'View in Orders',
      })
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        markAsRead,
        markAllAsRead,
        removeNotification,
        showToast,
        dismissToast,
        triggerSampleToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
