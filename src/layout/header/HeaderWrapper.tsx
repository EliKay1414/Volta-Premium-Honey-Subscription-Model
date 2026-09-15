/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {KTIcon} from '@/components/icon'
import {toAbsoluteUrl} from '@/utils'
import {useLayout} from '../core'
import {Header} from './Header'
import {Navbar} from './Navbar'

export function HeaderWrapper() {
  const {config, classes} = useLayout()
  if (!config.app?.header?.display) {
    return null
  }

  return (
    <div id='kt_app_header' className='app-header'>
      <div
        id='kt_app_header_container'
        className={clsx(
          'app-container flex-lg-grow-1',
          classes.headerContainer.join(' '),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            <div
              className='d-flex align-items-center d-lg-none ms-n2 me-auto'
              title='Show sidebar menu'
            >
              <div
                className='btn btn-icon btn-active-color-primary w-35px h-35px me-2'
                id='kt_app_sidebar_mobile_toggle'
              >
                <KTIcon iconName='abstract-14' className=' fs-1' />
              </div>
              <div className='d-flex align-items-center flex-shrink-0'>
                <Link to='/dashboard' className='d-lg-none d-flex align-items-center text-decoration-none'>
                  <span className='fs-4 fw-bolder text-gray-900 text-nowrap'>
                    Vivaldi <span className='text-primary ms-1'>Admin</span>
                  </span>
                </Link>
              </div>
            </div>
          </>
        )}

        {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15'>
            <Link to='/dashboard' className='text-decoration-none'>
              <span className='fs-3 fw-bolder text-gray-900'>
                Vivaldi <span className='text-primary'>Admin</span>
              </span>
            </Link>
          </div>
        )}

        <div
          id='kt_app_header_wrapper'
          className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'
        >
          {config.app.header.default?.content === 'menu' &&
            config.app.header.default.menu?.display && (
              <div
                className='app-header-menu app-header-mobile-drawer align-items-stretch'
                data-kt-drawer='true'
                data-kt-drawer-name='app-header-menu'
                data-kt-drawer-activate='{default: true, lg: false}'
                data-kt-drawer-overlay='true'
                data-kt-drawer-width='225px'
                data-kt-drawer-direction='end'
                data-kt-drawer-toggle='#kt_app_header_menu_toggle'
                data-kt-swapper='true'
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar />
        </div>
      </div>
    </div>
  )
}
