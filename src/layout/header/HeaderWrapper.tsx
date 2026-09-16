/* eslint-disable react-hooks/exhaustive-deps */
import {useState} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {Menu} from 'lucide-react'
import {useLayout} from '../core'
import {Header} from './Header'
import {Navbar} from './Navbar'
import {MobileNavDrawer} from '../sidebar/MobileNavDrawer'

export function HeaderWrapper() {
  const {config, classes} = useLayout()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  if (!config.app?.header?.display) {
    return null
  }

  return (
    <>
      <div id='kt_app_header' className='app-header'>
        <div
          id='kt_app_header_container'
          className={clsx(
            'app-container flex-lg-grow-1 d-flex align-items-center justify-content-between',
            classes.headerContainer.join(' '),
            config.app?.header?.default?.containerClass
          )}
        >
          {/* MOBILE VIEW (< 992px): Clean & consolidated header bar with Hamburger + Logo */}
          <div className='d-flex d-lg-none align-items-center w-100 py-2'>
            <div className='d-flex align-items-center gap-2'>
              <button
                type='button'
                onClick={() => setMobileDrawerOpen(true)}
                id='vivaldi_mobile_nav_toggle'
                className='btn btn-icon btn-sm btn-light-primary w-38px h-38px rounded-3 shadow-xs d-flex align-items-center justify-content-center'
                title='Open navigation menu'
              >
                <Menu size={20} className='text-primary' />
              </button>

              <Link
                to='/dashboard'
                className='d-flex align-items-center text-decoration-none ms-1'
              >
                <span className='fs-4 fw-bolder text-gray-900 text-nowrap'>
                  Vivaldi <span className='text-primary ms-1'>Admin</span>
                </span>
              </Link>
            </div>
          </div>

          {/* DESKTOP VIEW (>= 992px) */}
          <div className='d-none d-lg-flex align-items-stretch justify-content-between flex-lg-grow-1 w-100'>
            {!(config.layoutType === 'dark-sidebar' || config.layoutType === 'light-sidebar') && (
              <div className='d-flex align-items-center me-lg-15'>
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
                  <div className='app-header-menu align-items-stretch'>
                    <Header />
                  </div>
                )}
              <Navbar />
            </div>
          </div>
        </div>
      </div>

      {/* Consolidated Pave360-style Slide-out Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  )
}
