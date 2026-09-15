import React from 'react'
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ShoppingCart,
  UserCog,
  Truck,
  Settings,
} from 'lucide-react'
import {SidebarMenuItem} from './SidebarMenuItem'

const SidebarMenuMain = () => {
  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        title='Dashboard'
        customIcon={<LayoutDashboard size={20} />}
      />
      <SidebarMenuItem
        to='/prospects'
        title='Prospects'
        customIcon={<UserPlus size={20} />}
      />
      <SidebarMenuItem
        to='/subscribers'
        title='Subscribers'
        customIcon={<Users size={20} />}
      />
      <SidebarMenuItem
        to='/orders'
        title='Orders'
        customIcon={<ShoppingCart size={20} />}
      />
      <SidebarMenuItem
        to='/delivery'
        title='Delivery'
        customIcon={<Truck size={20} />}
      />
      <SidebarMenuItem
        to='/users'
        title='Users'
        customIcon={<UserCog size={20} />}
      />
      <SidebarMenuItem
        to='/settings'
        title='Settings'
        customIcon={<Settings size={20} />}
      />
    </>
  )
}

export {SidebarMenuMain}
