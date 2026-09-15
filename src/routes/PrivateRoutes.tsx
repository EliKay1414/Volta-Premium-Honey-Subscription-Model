import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '@/layout/MasterLayout'
import {DashboardWrapper} from '@/pages/dashboard/DashboardWrapper'
import {ProspectsPage} from '@/pages/prospects/ProspectsPage'
import {SubscribersPage} from '@/pages/subscribers/SubscribersPage'
import {OrdersPage} from '@/pages/orders/OrdersPage'
import {DeliveryPage} from '@/pages/delivery/DeliveryPage'
import {UsersPage} from '@/pages/users/UsersPage'
import {SettingsPage} from '@/pages/settings/SettingsPage'

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registration */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='prospects' element={<ProspectsPage />} />
        <Route path='subscribers' element={<SubscribersPage />} />
        <Route path='orders' element={<OrdersPage />} />
        <Route path='delivery' element={<DeliveryPage />} />
        <Route path='users' element={<UsersPage />} />
        <Route path='settings' element={<SettingsPage />} />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {PrivateRoutes}
