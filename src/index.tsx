import {createRoot} from 'react-dom/client'
// Axios
import axios from 'axios'
import {Chart, registerables} from 'chart.js'
import {QueryClient, QueryClientProvider} from 'react-query'
// Apps
import './assets/fonticon/fonticon.css'
import './assets/keenicons/duotone/style.css'
import './assets/keenicons/outline/style.css'
import './assets/keenicons/solid/style.css'
import './assets/sass/style.scss'
import './assets/sass/plugins.scss'
import './assets/sass/style.react.scss'
import {AppRoutes} from './routes/AppRoutes'
import {AuthProvider, setupAxios} from './pages/auth'

// Set up Axios default headers and authentication token interceptor
setupAxios(axios)
Chart.register(...registerables)

const queryClient = new QueryClient()
const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}
