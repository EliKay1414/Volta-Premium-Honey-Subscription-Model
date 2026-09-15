/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {Link} from 'react-router-dom'
import {User, Settings, Users, Truck, LogOut, MapPin} from 'lucide-react'
import {useAuth} from '@/pages/auth'
import {useProfile} from '@/components/profile'
import {toAbsoluteUrl} from '@/utils'

const HeaderUserMenu: FC = () => {
  const {logout} = useAuth()
  const {profile, openProfileModal} = useProfile()

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-300px shadow-lg'
      data-kt-menu='true'
    >
      {/* User Info Header Card */}
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3 py-2'>
          <div className='symbol symbol-50px me-4 position-relative'>
            <img
              alt='Profile Avatar'
              src={toAbsoluteUrl(profile.avatar)}
              className='rounded-3 shadow-sm'
              style={{objectFit: 'cover'}}
            />
            <div
              className='position-absolute translate-middle bottom-0 start-100 mb-1 bg-success rounded-circle border border-2 border-body h-10px w-10px'
              title='Online'
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-6 text-gray-900'>
              {profile.firstName} {profile.lastName}
              <span className='badge badge-light-primary fw-bolder fs-9 px-2 py-1 ms-2'>
                Admin
              </span>
            </div>
            <span className='fw-semibold text-muted fs-8'>{profile.email}</span>
            <span className='text-gray-500 fs-9 d-flex align-items-center mt-1'>
              <MapPin size={10} className='me-1 text-primary' /> {profile.location}
            </span>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      {/* Profile Trigger Button */}
      <div className='menu-item px-4 my-1'>
        <button
          onClick={openProfileModal}
          className='btn btn-sm btn-light-primary w-100 d-flex align-items-center justify-content-center fw-bold py-2'
        >
          <User size={15} className='me-2' /> My Profile & Photo
        </button>
      </div>

      <div className='separator my-2'></div>

      {/* Navigation Links */}
      <div className='menu-item px-5'>
        <Link to='/users' className='menu-link px-5 d-flex align-items-center'>
          <Users size={16} className='me-3 text-muted' /> Team & Users
        </Link>
      </div>

      <div className='menu-item px-5'>
        <Link to='/delivery' className='menu-link px-5 d-flex align-items-center'>
          <Truck size={16} className='me-3 text-muted' /> Deliveries
        </Link>
      </div>

      <div className='menu-item px-5'>
        <Link to='/settings' className='menu-link px-5 d-flex align-items-center'>
          <Settings size={16} className='me-3 text-muted' /> Settings & USSD
        </Link>
      </div>

      <div className='separator my-2'></div>

      {/* Sign Out */}
      <div className='menu-item px-5'>
        <a
          onClick={logout}
          className='menu-link px-5 text-danger d-flex align-items-center cursor-pointer'
        >
          <LogOut size={16} className='me-3 text-danger' /> Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
