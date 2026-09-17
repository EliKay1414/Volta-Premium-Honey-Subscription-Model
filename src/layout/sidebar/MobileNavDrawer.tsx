import React, {FC, useEffect} from 'react'
import {createPortal} from 'react-dom'
import {Link, useLocation} from 'react-router-dom'
import {
  X,
  LayoutDashboard,
  UserPlus,
  Users,
  ShoppingCart,
  Truck,
  UserCog,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react'
import {useProfile} from '@/components/profile'
import {useThemeMode} from '@/components/theme'
import {useAuth} from '@/pages/auth'
import {toAbsoluteUrl} from '@/utils'

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
  {to: '/prospects', label: 'Prospects', icon: UserPlus},
  {to: '/subscribers', label: 'Subscribers', icon: Users},
  {to: '/orders', label: 'Orders', icon: ShoppingCart},
  {to: '/delivery', label: 'Delivery', icon: Truck},
  {to: '/users', label: 'Users', icon: UserCog},
  {to: '/settings', label: 'Settings', icon: Settings},
]

export const MobileNavDrawer: FC<MobileNavDrawerProps> = ({isOpen, onClose}) => {
  const location = useLocation()
  const {profile, openProfileModal} = useProfile()
  const {mode, updateMode} = useThemeMode()
  const {logout} = useAuth()

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (typeof document === 'undefined') return null

  const fullName = `${profile.firstName || 'Vivaldi'} ${profile.lastName || 'Admin'}`
  const userRole = profile.role || 'Super Administrator'
  const isDark = mode === 'dark'

  const drawerContent = (
    <div
      className={`d-lg-none ${isOpen ? 'visible' : 'invisible'}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        transition: 'visibility 0.25s ease',
      }}
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.25s ease',
          cursor: 'pointer',
        }}
        aria-label='Close menu overlay'
      />

      {/* Slide-out Drawer Panel */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '280px',
          maxWidth: '85vw',
          backgroundColor: '#1e1e2d',
          color: '#ffffff',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.4)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          userSelect: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* HEADER: User / Brand with Shadcn Theme Toggle & Close Button */}
        <div>
          <div
            style={{
              padding: '16px 16px 14px 16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            {/* User Profile Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: 0,
                cursor: 'pointer',
              }}
              onClick={() => {
                onClose()
                openProfileModal()
              }}
              title='View Profile & Settings'
            >
              <div style={{position: 'relative', flexShrink: 0}}>
                <img
                  src={toAbsoluteUrl(profile.avatar || '/media/avatars/300-1.jpg')}
                  alt={fullName}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '1.5px solid #1e1e2d',
                  }}
                  title='Active'
                />
              </div>

              <div style={{minWidth: 0}}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {fullName}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userRole}
                </span>
              </div>
            </div>

            {/* Header Actions: Shadcn Theme Toggle Icon + Close Button */}
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0}}>
              {/* Proper Shadcn UI Theme Toggle Icon Button */}
              <button
                type='button'
                onClick={() => updateMode(isDark ? 'light' : 'dark')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, border-color 0.15s',
                }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label='Toggle theme'
              >
                {isDark ? (
                  <Sun size={16} style={{color: '#f59e0b'}} />
                ) : (
                  <Moon size={16} style={{color: '#38bdf8'}} />
                )}
              </button>

              {/* Close Button */}
              <button
                type='button'
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                title='Close menu'
                aria-label='Close menu'
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <div
            style={{
              padding: '16px 12px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 145px)',
            }}
          >
            <div
              style={{
                padding: '0 10px',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'rgba(255, 255, 255, 0.4)',
                marginBottom: '10px',
              }}
            >
              Navigation
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '3px'}}>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'background-color 0.15s ease, color 0.15s ease',
                      backgroundColor: isActive ? 'rgba(0, 158, 247, 0.14)' : 'transparent',
                      color: isActive ? '#009ef7' : 'rgba(255, 255, 255, 0.75)',
                    }}
                  >
                    <Icon
                      size={18}
                      style={{
                        color: isActive ? '#009ef7' : 'rgba(255, 255, 255, 0.55)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{flex: 1, whiteSpace: 'nowrap'}}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM: Minimalist Sign Out Action */}
        <div
          style={{
            padding: '14px 12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: 'auto',
          }}
        >
          <button
            type='button'
            onClick={() => {
              onClose()
              logout()
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '9px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#f87171',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}
