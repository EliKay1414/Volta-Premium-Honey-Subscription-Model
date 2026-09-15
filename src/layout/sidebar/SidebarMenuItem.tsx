import {FC, ReactNode} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, WithChildren} from '@/utils'
import {KTIcon} from '@/components/icon'
import {useLayout} from '../core'

type Props = {
  to: string
  title: string
  icon?: string
  customIcon?: ReactNode
  fontIcon?: string
  hasBullet?: boolean
}

const SidebarMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  customIcon,
  fontIcon,
  hasBullet = false,
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {app} = config

  return (
    <div className='menu-item my-3'>
      <Link className={clsx('menu-link without-sub py-3 px-4', {active: isActive})} to={to}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {customIcon && (
          <span className='menu-icon d-flex align-items-center justify-content-center'>
            {customIcon}
          </span>
        )}
        {!customIcon && icon && app?.sidebar?.default?.menu?.iconType === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}
        {!customIcon && fontIcon && app?.sidebar?.default?.menu?.iconType === 'font' && (
          <i className={clsx('bi fs-3', fontIcon)}></i>
        )}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {SidebarMenuItem}
