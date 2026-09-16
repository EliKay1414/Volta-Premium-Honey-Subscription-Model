import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '@/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {getCSSVariableValue} from '@/assets/ts/_utils'
import {WithChildren} from '@/utils'

const DashboardWrapper = lazy(() =>
  import('@/pages/dashboard/DashboardWrapper').then((m) => ({default: m.DashboardWrapper}))
)
const ProspectsPage = lazy(() =>
  import('@/pages/prospects/ProspectsPage').then((m) => ({default: m.ProspectsPage}))
)
const SubscribersPage = lazy(() =>
  import('@/pages/subscribers/SubscribersPage').then((m) => ({default: m.SubscribersPage}))
)
const OrdersPage = lazy(() =>
  import('@/pages/orders/OrdersPage').then((m) => ({default: m.OrdersPage}))
)
const DeliveryPage = lazy(() =>
  import('@/pages/delivery/DeliveryPage').then((m) => ({default: m.DeliveryPage}))
)
const UsersPage = lazy(() =>
  import('@/pages/users/UsersPage').then((m) => ({default: m.UsersPage}))
)
const SettingsPage = lazy(() =>
  import('@/pages/settings/SettingsPage').then((m) => ({default: m.SettingsPage}))
)

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary') || '#009ef7'
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 2,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registration */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route
          path='dashboard'
          element={
            <SuspensedView>
              <DashboardWrapper />
            </SuspensedView>
          }
        />
        <Route
          path='prospects'
          element={
            <SuspensedView>
              <ProspectsPage />
            </SuspensedView>
          }
        />
        <Route
          path='subscribers'
          element={
            <SuspensedView>
              <SubscribersPage />
            </SuspensedView>
          }
        />
        <Route
          path='orders'
          element={
            <SuspensedView>
              <OrdersPage />
            </SuspensedView>
          }
        />
        <Route
          path='delivery'
          element={
            <SuspensedView>
              <DeliveryPage />
            </SuspensedView>
          }
        />
        <Route
          path='users'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        <Route
          path='settings'
          element={
            <SuspensedView>
              <SettingsPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

export {PrivateRoutes}
