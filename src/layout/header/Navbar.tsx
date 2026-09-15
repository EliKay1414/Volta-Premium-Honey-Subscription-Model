import clsx from 'clsx'
import {Bell} from 'lucide-react'
import {toAbsoluteUrl} from '@/utils'
import {HeaderNotificationsMenu} from './HeaderNotificationsMenu'
import {HeaderUserMenu} from './HeaderUserMenu'
import {ThemeModeSwitcher} from '@/components/theme'
import {useNotifications} from '@/components/notifications'
import {useProfile} from '@/components/profile'
const itemClass = 'ms-1 ms-md-4'
const btnClass =
  'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'
const userAvatarClass = 'symbol-35px'

const Navbar = () => {
  const {unreadCount} = useNotifications()
  const {profile} = useProfile()

  return (
    <div className='app-navbar flex-shrink-0'>
      {/* Notifications Button with Bell Icon & Unread Badge */}
      <div className={clsx('app-navbar-item position-relative', itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          className={clsx(btnClass, 'position-relative')}
          title='Notifications'
        >
          <Bell size={20} className='text-gray-700' />
          {unreadCount > 0 && (
            <span
              className='position-absolute top-0 start-100 translate-middle badge badge-circle badge-primary w-18px h-18px fs-9 fw-bolder shadow-sm'
              style={{marginTop: '4px', marginLeft: '-4px'}}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <HeaderNotificationsMenu />
      </div>

      {/* Theme Mode Switcher */}
      <div className={clsx('app-navbar-item', itemClass)}>
        <ThemeModeSwitcher toggleBtnClass={clsx('btn-active-light-primary btn-custom')} />
      </div>

      {/* User Profile Avatar with Online Status */}
      <div className={clsx('app-navbar-item', itemClass)}>
        <div
          className={clsx('cursor-pointer symbol position-relative', userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          title='User Profile'
        >
          <img
            src={toAbsoluteUrl(profile.avatar)}
            alt='Admin Profile'
            className='rounded-3'
          />
          <div
            className='position-absolute translate-middle bottom-0 start-100 mb-1 bg-success rounded-circle border border-2 border-body h-10px w-10px'
            title='Online'
          />
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  )
}

export {Navbar}
