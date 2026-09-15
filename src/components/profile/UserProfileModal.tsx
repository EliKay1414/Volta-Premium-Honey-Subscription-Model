import React, {FC, useState, useEffect} from 'react'
import {X, Check, Camera, User, Mail, Phone, MapPin, ShieldCheck} from 'lucide-react'
import {toAbsoluteUrl} from '@/utils'
import {useProfile} from './ProfileContext'
import {useNotifications} from '../notifications'

const availableAvatars = [
  '/media/avatars/300-1.jpg',
  '/media/avatars/300-2.jpg',
  '/media/avatars/300-3.jpg',
  '/media/avatars/300-5.jpg',
  '/media/avatars/300-6.jpg',
  '/media/avatars/300-7.jpg',
  '/media/avatars/300-11.jpg',
  '/media/avatars/300-12.jpg',
  '/media/avatars/300-13.jpg',
  '/media/avatars/300-25.jpg',
]

export const UserProfileModal: FC = () => {
  const {profile, isProfileModalOpen, closeProfileModal, updateProfile} = useProfile()
  const {showToast} = useNotifications()

  const [formData, setFormData] = useState(profile)
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar)

  useEffect(() => {
    if (isProfileModalOpen) {
      setFormData(profile)
      setSelectedAvatar(profile.avatar)
    }
  }, [isProfileModalOpen, profile])

  if (!isProfileModalOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      ...formData,
      avatar: selectedAvatar,
    })

    showToast({
      category: 'user',
      title: 'Profile Updated Successfully',
      description: `${formData.firstName} ${formData.lastName}'s profile and photo have been updated.`,
      badgeColor: 'success',
      link: '/users',
      linkLabel: 'View Team',
    })

    closeProfileModal()
  }

  return (
    <div
      className='modal fade show d-block'
      tabIndex={-1}
      style={{backgroundColor: 'rgba(0, 0, 0, 0.55)', zIndex: 1055}}
    >
      <div className='modal-dialog modal-dialog-centered mw-650px'>
        <div className='modal-content border-0 shadow-lg rounded-3'>
          {/* Modal Header */}
          <div className='modal-header pb-0 border-0 justify-content-between pt-6 px-8'>
            <div>
              <h2 className='fw-bolder text-gray-900 fs-3 mb-1'>User Profile</h2>
              <span className='text-muted fs-7'>
                Manage your account credentials, avatar picture, and operational role
              </span>
            </div>
            <button
              onClick={closeProfileModal}
              className='btn btn-icon btn-sm btn-active-light-primary rounded-circle'
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className='modal-body py-6 px-8'>
              {/* Avatar Selection Card */}
              <div className='d-flex flex-column align-items-center mb-7'>
                <div className='position-relative mb-3'>
                  <div className='symbol symbol-100px symbol-circle shadow-sm border border-3 border-primary overflow-hidden'>
                    <img
                      src={toAbsoluteUrl(selectedAvatar)}
                      alt='Selected Avatar'
                      style={{objectFit: 'cover', width: '100%', height: '100%'}}
                    />
                  </div>
                  <span
                    className='position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 shadow-sm'
                    title='Current Photo'
                  >
                    <Camera size={14} />
                  </span>
                </div>
                <div className='fw-bold text-gray-800 fs-6 mb-1'>
                  {formData.firstName} {formData.lastName}
                </div>
                <div className='badge badge-light-primary fw-bold fs-8 mb-4'>
                  <ShieldCheck size={12} className='me-1' /> {formData.role}
                </div>

                {/* Avatar Gallery Picker */}
                <div className='w-100 bg-light rounded-3 p-4'>
                  <div className='d-flex align-items-center justify-content-between mb-2'>
                    <span className='fw-bold text-gray-700 fs-7'>Choose Profile Photo:</span>
                    <span className='text-muted fs-8'>Click an image to set</span>
                  </div>
                  <div className='d-flex flex-wrap gap-2 justify-content-center'>
                    {availableAvatars.map((avatarPath, index) => {
                      const isSelected = selectedAvatar === avatarPath
                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedAvatar(avatarPath)}
                          className={`cursor-pointer symbol symbol-45px symbol-circle position-relative transition-all ${
                            isSelected
                              ? 'border border-3 border-primary shadow-sm scale-105'
                              : 'opacity-75 opacity-hover-100 border border-2 border-transparent'
                          }`}
                        >
                          <img
                            src={toAbsoluteUrl(avatarPath)}
                            alt={`Avatar option ${index + 1}`}
                            style={{objectFit: 'cover'}}
                          />
                          {isSelected && (
                            <span
                              className='position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center'
                              style={{width: '16px', height: '16px', transform: 'translate(25%, -25%)'}}
                            >
                              <Check size={10} />
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className='row g-4'>
                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>First Name</label>
                  <div className='input-group input-group-solid'>
                    <span className='input-group-text bg-light'>
                      <User size={15} className='text-muted' />
                    </span>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>Last Name</label>
                  <div className='input-group input-group-solid'>
                    <span className='input-group-text bg-light'>
                      <User size={15} className='text-muted' />
                    </span>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>Email Address</label>
                  <div className='input-group input-group-solid'>
                    <span className='input-group-text bg-light'>
                      <Mail size={15} className='text-muted' />
                    </span>
                    <input
                      type='email'
                      className='form-control form-control-solid'
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>Phone Number</label>
                  <div className='input-group input-group-solid'>
                    <span className='input-group-text bg-light'>
                      <Phone size={15} className='text-muted' />
                    </span>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder='+233 24 000 0000'
                    />
                  </div>
                </div>

                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>Role Title</label>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                </div>

                <div className='col-md-6'>
                  <label className='form-label fw-bold fs-7 text-gray-700 mb-1'>Base Location</label>
                  <div className='input-group input-group-solid'>
                    <span className='input-group-text bg-light'>
                      <MapPin size={15} className='text-muted' />
                    </span>
                    <input
                      type='text'
                      className='form-control form-control-solid'
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className='modal-footer border-0 pt-0 px-8 pb-6'>
              <button
                type='button'
                onClick={closeProfileModal}
                className='btn btn-sm btn-light'
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-sm btn-primary'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
