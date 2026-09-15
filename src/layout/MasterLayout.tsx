import {useEffect} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {HeaderWrapper} from './header'
import {ScrollTop} from './scroll-top'
import {Content} from './content'
import {FooterWrapper} from './footer'
import {Sidebar} from './sidebar'
import {PageDataProvider} from './core'
import {reInitMenu} from '@/utils'
import {ToolbarWrapper} from './toolbar'
import {ToastContainer} from '@/components/notifications'
import {UserProfileModal} from '@/components/profile'

const MasterLayout = () => {
  const location = useLocation()
  useEffect(() => {
    reInitMenu()
  }, [location.key])

  return (
    <PageDataProvider>
      <div className='d-flex flex-column flex-root app-root' id='kt_app_root'>
        <div className='app-page flex-column flex-column-fluid' id='kt_app_page'>
          <HeaderWrapper />
          <div className='app-wrapper flex-column flex-row-fluid' id='kt_app_wrapper'>
            <Sidebar />
            <div className='app-main flex-column flex-row-fluid' id='kt_app_main'>
              <div className='d-flex flex-column flex-column-fluid'>
                <ToolbarWrapper />
                <Content>
                  <Outlet />
                </Content>
              </div>
              <FooterWrapper />
            </div>
          </div>
        </div>
      </div>

      <ScrollTop />
      <ToastContainer />
      <UserProfileModal />
    </PageDataProvider>
  )
}

export {MasterLayout}
