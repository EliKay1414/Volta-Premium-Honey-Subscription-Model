import React, {createContext, useContext, useState, FC, ReactNode} from 'react'

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  department: string
  location: string
  avatar: string
}

interface ProfileContextProps {
  profile: UserProfile
  isProfileModalOpen: boolean
  openProfileModal: () => void
  closeProfileModal: () => void
  updateProfile: (updated: Partial<UserProfile>) => void
}

const defaultProfile: UserProfile = {
  firstName: 'Vivaldi',
  lastName: 'Admin',
  email: 'admin@vivaldi.com',
  phone: '+233 24 123 4567',
  role: 'System Administrator',
  department: 'Honey Operations & Subscriptions',
  location: 'Ho, Volta Region, Ghana',
  avatar: '/media/avatars/300-1.jpg',
}

const ProfileContext = createContext<ProfileContextProps>({} as ProfileContextProps)

export const ProfileProvider: FC<{children: ReactNode}> = ({children}) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vivaldi_user_profile')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return defaultProfile
      }
    }
    return defaultProfile
  })

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const openProfileModal = () => setIsProfileModalOpen(true)
  const closeProfileModal = () => setIsProfileModalOpen(false)

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = {...prev, ...updated}
      localStorage.setItem('vivaldi_user_profile', JSON.stringify(next))
      return next
    })
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
