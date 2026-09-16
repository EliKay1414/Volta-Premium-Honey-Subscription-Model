import React, {FC, useEffect, useState} from 'react'
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
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
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
  const {notifications, unreadCount, markAsRead, markAllAsRead} = useNotifications()
  const {profile, openProfileModal} = useProfile()
  const {mode, updateMode} = useThemeMode()
  const {logout} = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

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
        transition: 'visibility 0.3s ease',
      }}
    >
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
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
          width: '300px',
          maxWidth: '88vw',
          backgroundColor: '#171923',
          backgroundImage: 'linear-gradient(180deg, #1b1e2e 0%, #151722 100%)',
          color: '#ffffff',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.5)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          userSelect: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* TOP SECTION: User Profile Card & Close Button */}
        <div>
          <div
            style={{
              padding: '16px 18px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: 0,
                cursor: 'pointer',
              }}
              onClick={() => {
                onClose()
                openProfileModal()
              }}
            >
              {/* User Avatar with Online Dot */}
              <div style={{position: 'relative', flexShrink: 0}}>
                <img
                  src={toAbsoluteUrl(profile.avatar || '/media/avatars/300-1.jpg')}
                  alt={fullName}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    border: '2px solid #171923',
                  }}
                  title='Active'
                />
              </div>

              {/* User Name & Role */}
              <div style={{minWidth: 0}}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
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
                    color: 'rgba(255, 255, 255, 0.6)',
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
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              title='Close menu'
            >
              <X size={18} />
            </button>
          </div>

          {/* SCROLLABLE MENU & SYSTEM SECTIONS */}
          <div
            style={{
              padding: '14px 12px',
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 175px)',
            }}
          >
            {/* SECTION 1: MENU */}
            <div style={{marginBottom: '20px'}}>
              <p
                style={{
                  padding: '0 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginBottom: '8px',
                }}
              >
                Menu
              </p>

              <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
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
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: isActive ? 700 : 500,
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        backgroundColor: isActive
                          ? 'rgba(0, 158, 247, 0.18)'
                          : 'transparent',
                        color: isActive ? '#009ef7' : 'rgba(255, 255, 255, 0.85)',
                        borderLeft: isActive
                          ? '3px solid #009ef7'
                          : '3px solid transparent',
                      }}
                    >
                      <Icon
                        size={18}
                        style={{
                          color: isActive ? '#009ef7' : 'rgba(255, 255, 255, 0.65)',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{flex: 1, whiteSpace: 'nowrap'}}>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* SECTION 2: SYSTEM & QUICK ACTIONS */}
            <div
              style={{
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <p
                style={{
                  padding: '0 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  marginBottom: '8px',
                }}
              >
                Quick Actions
              </p>

              <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                {/* Notifications Item */}
                <div>
                  <div
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'rgba(255, 255, 255, 0.9)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <Bell size={18} style={{color: '#38bdf8'}} />
                      <span>Notifications</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      {unreadCount > 0 ? (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                          }}
                        >
                          {unreadCount} new
                        </span>
                      ) : (
                        <span style={{fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)'}}>
                          All read
                        </span>
                      )}
                      {showNotifications ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* Expandable notifications preview */}
                  {showNotifications && (
                    <div
                      style={{
                        marginTop: '4px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        maxHeight: '160px',
                        overflowY: 'auto',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.5)',
                          }}
                        >
                          Recent
                        </span>
                        {unreadCount > 0 && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              markAllAsRead()
                            }}
                            style={{
                              fontSize: '10px',
                              color: '#38bdf8',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Mark all read
                          </span>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.5)',
                            textAlign: 'center',
                            padding: '8px 0',
                          }}
                        >
                          No notifications
                        </p>
                      ) : (
                        notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAsRead(n.id)}
                            style={{
                              padding: '6px 4px',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                              fontSize: '12px',
                              color: n.read ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{fontWeight: n.read ? 400 : 600}}>{n.title}</div>
                            <div style={{fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)'}}>
                              {n.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Theme Mode Toggle with Main Interactive Toggle Switch */}
                <div
                  onClick={() => updateMode(isDark ? 'light' : 'dark')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    {isDark ? (
                      <Moon size={18} style={{color: '#f59e0b'}} />
                    ) : (
                      <Sun size={18} style={{color: '#f59e0b'}} />
                    )}
                    <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  </div>

                  {/* Main Interactive Toggle Switch */}
                  <div
                    style={{
                      width: '46px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: isDark ? '#009ef7' : '#374151',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'background-color 0.25s ease',
                      flexShrink: 0,
                    }}
                    role='switch'
                    aria-checked={isDark}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                        transform: isDark ? 'translateX(22px)' : 'translateX(0px)',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isDark ? (
                        <Moon size={11} style={{color: '#009ef7'}} />
                      ) : (
                        <Sun size={11} style={{color: '#f59e0b'}} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit Profile Item */}
                <button
                  type='button'
                  onClick={() => {
                    onClose()
                    openProfileModal()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <User size={18} style={{color: 'rgba(255, 255, 255, 0.65)'}} />
                  <span>My Profile & Settings</span>
                </button>

                {/* Sign Out Item */}
                <button
                  type='button'
                  onClick={() => {
                    onClose()
                    logout()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#f87171',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LogOut size={18} style={{color: '#f87171'}} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BRAND FOOTER (Matching Pave360 template branding pill) */}
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '12px',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.02em',
                }}
              >
                Vivaldi Honey Admin
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '9px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.4)',
              }}
            >
              ALL RIGHTS RESERVED © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}
