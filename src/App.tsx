import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from '@/layout/core'
import {MasterInit} from '@/layout/MasterInit'
import {AuthInit} from '@/pages/auth'
import {ThemeModeProvider} from '@/components/theme'
import {NotificationProvider} from '@/components/notifications'
import {ProfileProvider} from '@/components/profile'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <ThemeModeProvider>
          <AuthInit>
            <ProfileProvider>
              <NotificationProvider>
                <Outlet />
                <MasterInit />
              </NotificationProvider>
            </ProfileProvider>
          </AuthInit>
        </ThemeModeProvider>
      </LayoutProvider>
    </Suspense>
  )
}

export {App}
