import React, {FC, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {ShoppingBag, Smartphone, UserPlus, Truck, Settings, X, ArrowRight} from 'lucide-react'
import {useNotifications, ToastItem} from './NotificationContext'

const categoryMeta = {
  purchase: {
    label: 'HONEY PURCHASE',
    icon: ShoppingBag,
    color: 'primary',
  },
  subscriber: {
    label: 'SUBSCRIBER',
    icon: Smartphone,
    color: 'info',
  },
  user: {
    label: 'TEAM UPDATE',
    icon: UserPlus,
    color: 'success',
  },
  delivery: {
    label: 'DELIVERY DISPATCH',
    icon: Truck,
    color: 'warning',
  },
  system: {
    label: 'SYSTEM CONFIG',
    icon: Settings,
    color: 'primary',
  },
  ussd: {
    label: 'USSD *713*65#',
    icon: Smartphone,
    color: 'info',
  },
}

const ToastCard: FC<{toast: ToastItem; onDismiss: (id: string) => void}> = ({
  toast,
  onDismiss,
}) => {
  const meta = categoryMeta[toast.category] || categoryMeta.purchase
  const Icon = meta.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 5500)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`card shadow-lg border border-opacity-25 rounded-3 mb-3 bg-white overflow-hidden animate__animated animate__fadeInRight`}
      style={{
        width: '360px',
        maxWidth: '90vw',
        borderLeft: `5px solid var(--bs-${meta.color})`,
      }}
    >
      <div className='card-body p-4'>
        <div className='d-flex align-items-center justify-content-between mb-2'>
          <span
            className={`badge badge-light-${meta.color} fw-bold text-uppercase fs-9 py-1 px-2`}
          >
            {meta.label}
          </span>
          <div className='d-flex align-items-center'>
            <span className='text-muted fs-8 me-2'>{toast.time}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className='btn btn-icon btn-xs btn-active-light text-muted'
              title='Close'
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className='d-flex align-items-start'>
          <div
            className={`symbol symbol-40px me-3 flex-shrink-0 bg-light-${meta.color} text-${meta.color} d-flex align-items-center justify-content-center rounded-circle`}
          >
            <Icon size={20} />
          </div>

          <div className='flex-grow-1'>
            <div className='fw-bolder text-gray-900 fs-6 mb-1'>{toast.title}</div>
            <div className='text-muted fs-7 lh-sm'>{toast.description}</div>

            {toast.link && (
              <div className='mt-2'>
                <Link
                  to={toast.link}
                  onClick={() => onDismiss(toast.id)}
                  className={`btn btn-sm btn-light-${meta.color} py-1 px-3 fs-8 fw-bold d-inline-flex align-items-center`}
                >
                  {toast.linkLabel || 'View Details'}
                  <ArrowRight size={13} className='ms-1' />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-dismiss countdown bar */}
      <div
        style={{
          height: '3px',
          backgroundColor: `var(--bs-${meta.color})`,
          width: '100%',
          animation: 'toastCountdown 5.5s linear forwards',
        }}
      />
    </div>
  )
}

export const ToastContainer: FC = () => {
  const {toasts, dismissToast} = useNotifications()

  if (!toasts.length) return null

  return (
    <>
      <style>{`
        @keyframes toastCountdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div
        className='position-fixed top-0 end-0 p-4'
        style={{zIndex: 99999, pointerEvents: 'none'}}
      >
        <div style={{pointerEvents: 'auto'}}>
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      </div>
    </>
  )
}
