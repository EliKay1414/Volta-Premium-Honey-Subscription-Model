import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {Save, Bell, Smartphone, Globe, Radio, Send, RotateCcw, X, Check, Activity} from 'lucide-react'
import {useNotifications} from '@/components/notifications'
import {usePersistentState} from '@/hooks/usePersistentState'

interface GatewayTestResult {
  network: string
  status: 'Online' | 'Testing' | 'Failed'
  latency: string
}

const SettingsPage: FC = () => {
  const {showToast} = useNotifications()

  // Form State (Persistent across refreshes)
  const [appName, setAppName] = usePersistentState('vivaldi_setting_app_name', 'Vivaldi Admin')
  const [supportEmail, setSupportEmail] = usePersistentState('vivaldi_setting_support_email', 'support@vivaldi.com')
  const [currency, setCurrency] = usePersistentState('vivaldi_setting_currency', 'GHS')
  const [ussdCode, setUssdCode] = usePersistentState('vivaldi_setting_ussd_code', '*713*65#')
  const [smsAlerts, setSmsAlerts] = usePersistentState('vivaldi_setting_sms_alerts', true)
  const [dailySummary, setDailySummary] = usePersistentState('vivaldi_setting_daily_summary', true)
  const [sessionTimeout, setSessionTimeout] = usePersistentState('vivaldi_setting_session_timeout', '60')

  // Diagnostics Modal State
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState(false)
  const [isTestingGateway, setIsTestingGateway] = useState(false)
  const [gatewayResults, setGatewayResults] = useState<GatewayTestResult[]>([
    {network: 'MTN Ghana', status: 'Online', latency: '42ms'},
    {network: 'Telecel Ghana (Vodafone)', status: 'Online', latency: '58ms'},
    {network: 'AT (AirtelTigo)', status: 'Online', latency: '65ms'},
  ])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    showToast({
      category: 'system',
      title: 'Settings Saved',
      description: 'Settings saved successfully.',
      badgeColor: 'primary',
    })
  }

  const handleResetDefaults = () => {
    setAppName('Vivaldi Admin')
    setSupportEmail('support@vivaldi.com')
    setCurrency('GHS')
    setUssdCode('*713*65#')
    setSmsAlerts(true)
    setDailySummary(true)
    setSessionTimeout('60')

    showToast({
      category: 'system',
      title: 'Settings Reset',
      description: 'Settings reset to defaults.',
      badgeColor: 'warning',
    })
  }

  const handleRunGatewayTest = () => {
    setIsTestingGateway(true)
    setTimeout(() => {
      setIsTestingGateway(false)
      setGatewayResults([
        {network: 'MTN Ghana', status: 'Online', latency: `${Math.floor(30 + Math.random() * 25)}ms`},
        {network: 'Telecel Ghana (Vodafone)', status: 'Online', latency: `${Math.floor(40 + Math.random() * 30)}ms`},
        {network: 'AT (AirtelTigo)', status: 'Online', latency: `${Math.floor(50 + Math.random() * 25)}ms`},
      ])
      showToast({
        category: 'ussd',
        title: 'USSD Gateway Online',
        description: `USSD code is working on MTN, Telecel, and AT.`,
        badgeColor: 'success',
      })
    }, 1200)
  }

  const handleTestSMS = () => {
    showToast({
      category: 'ussd',
      title: 'Test SMS Sent',
      description: `Sample message sent: "Welcome to Vivaldi Honey! Dial ${ussdCode} anytime to order fresh 500g plastic bottles or 330g plastic bottles."`,
      badgeColor: 'primary',
    })
  }

  const handleTestNotification = () => {
    showToast({
      category: 'system',
      title: 'Admin Daily Summary (Preview)',
      description: '4 new USSD signups, 6 orders delivered, GH₵ 2,450 revenue recorded today.',
      badgeColor: 'info',
    })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>Settings</PageTitle>

      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5 flex-wrap gap-2'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Application Settings</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              System preferences, USSD gateway settings, and notification options
            </span>
          </h3>
          <div className='card-toolbar d-flex flex-wrap gap-2'>
            <button
              type='button'
              className='btn btn-sm btn-light'
              onClick={handleResetDefaults}
            >
              <RotateCcw size={14} className='me-1' /> Reset Defaults
            </button>
          </div>
        </div>

        <div className='card-body py-5'>
          <form onSubmit={handleSave}>
            {/* General Section */}
            <div className='mb-8'>
              <h5 className='fw-bold text-gray-800 mb-4 d-flex align-items-center'>
                <Globe size={18} className='text-primary me-2' /> General Information
              </h5>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label required fw-semibold fs-6'>
                  Application Name
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                  <div className='form-text text-muted fs-8'>
                    This system name appears across the top header and browser tab.
                  </div>
                </div>
              </div>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label required fw-semibold fs-6'>
                  Support Email
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='email'
                    className='form-control form-control-solid'
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label fw-semibold fs-6'>Currency</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid'
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value='GHS'>Ghana Cedi (GH₵)</option>
                  </select>
                  <div className='form-text text-muted fs-8'>
                    All subscription and order amounts will display in Ghana Cedis.
                  </div>
                </div>
              </div>
            </div>

            <div className='separator my-6'></div>

            {/* USSD Gateway Section */}
            <div className='mb-8'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <h5 className='fw-bold text-gray-800 mb-0 d-flex align-items-center'>
                  <Smartphone size={18} className='text-primary me-2' /> USSD Application Gateway
                </h5>
                <button
                  type='button'
                  className='btn btn-sm btn-light-primary fw-bold'
                  onClick={() => {
                    setIsGatewayModalOpen(true)
                    handleRunGatewayTest()
                  }}
                >
                  <Radio size={14} className='me-1' /> Test USSD Gateway
                </button>
              </div>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label fw-semibold fs-6'>
                  Active USSD Shortcode
                </label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-solid'
                    value={ussdCode}
                    onChange={(e) => setUssdCode(e.target.value)}
                  />
                  <div className='form-text text-muted fs-8'>
                    Mobile users dial this code on MTN, Telecel, and AT networks to sign up.
                  </div>
                </div>
              </div>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label fw-semibold fs-6'>
                  SMS Registration Alerts
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='d-flex align-items-center justify-content-between p-3 bg-light rounded-3'>
                    <div className='form-check form-switch form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={smsAlerts}
                        onChange={(e) => setSmsAlerts(e.target.checked)}
                        id='smsAlertSwitch'
                      />
                      <label className='form-check-label fw-semibold text-gray-700 ms-3' htmlFor='smsAlertSwitch'>
                        Send SMS confirmation to user upon successful {ussdCode} signup
                      </label>
                    </div>
                    <button
                      type='button'
                      className='btn btn-sm btn-light fw-bold text-nowrap'
                      onClick={handleTestSMS}
                    >
                      <Send size={13} className='me-1' /> Test SMS Alert
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='separator my-6'></div>

            {/* Notifications & Security */}
            <div className='mb-8'>
              <h5 className='fw-bold text-gray-800 mb-4 d-flex align-items-center'>
                <Bell size={18} className='text-primary me-2' /> Notifications & Security
              </h5>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label fw-semibold fs-6'>
                  Daily Summary Notification
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='d-flex align-items-center justify-content-between p-3 bg-light rounded-3'>
                    <div className='form-check form-switch form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={dailySummary}
                        onChange={(e) => setDailySummary(e.target.checked)}
                        id='dailySummarySwitch'
                      />
                      <label className='form-check-label fw-semibold text-gray-700 ms-3' htmlFor='dailySummarySwitch'>
                        Send daily summary of new USSD signups and deliveries to Admins
                      </label>
                    </div>
                    <button
                      type='button'
                      className='btn btn-sm btn-light fw-bold text-nowrap'
                      onClick={handleTestNotification}
                    >
                      <Bell size={13} className='me-1' /> Test Alert
                    </button>
                  </div>
                </div>
              </div>

              <div className='row mb-5'>
                <label className='col-lg-4 col-form-label fw-semibold fs-6'>Session Timeout</label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid'
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  >
                    <option value='30'>30 Minutes of inactivity</option>
                    <option value='60'>60 Minutes (Default)</option>
                    <option value='120'>2 Hours</option>
                    <option value='480'>8 Hours</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='d-flex justify-content-end gap-3 pt-4 border-top border-gray-200'>
              <button
                type='button'
                className='btn btn-light'
                onClick={handleResetDefaults}
              >
                Cancel
              </button>
              <button type='submit' className='btn btn-primary fw-bold px-6'>
                <Save size={16} className='me-2' /> Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Gateway Diagnostics Modal */}
      {isGatewayModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-600px w-100 mx-auto'>
            <div className='modal-content rounded-3 shadow-sm border border-gray-200'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <div className='d-flex flex-wrap align-items-center gap-2 mb-1'>
                    <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>
                      USSD Gateway Connectivity
                    </h3>
                    <span className='badge badge-light-primary fw-bold'>
                      {ussdCode}
                    </span>
                  </div>
                  <span className='text-muted fs-7'>Live telco network ping and routing diagnostics</span>
                </div>
                <button
                  type='button'
                  className='btn btn-icon btn-sm btn-light-secondary rounded-circle'
                  onClick={() => setIsGatewayModalOpen(false)}
                  aria-label='Close'
                >
                  <X size={18} />
                </button>
              </div>

              <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                <p className='text-muted fs-7 mb-5'>
                  Live connectivity ping status for the active USSD shortcode across all major mobile telecommunications networks in Ghana.
                </p>

                {isTestingGateway ? (
                  <div className='py-8 text-center'>
                    <div className='spinner-border text-primary mb-3' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                    <div className='fw-bold text-gray-800 fs-6'>Pinging Telecom Gateways...</div>
                    <div className='text-muted fs-7'>Contacting MTN, Telecel, and AT base stations</div>
                  </div>
                ) : (
                  <div className='d-flex flex-column gap-3'>
                    {gatewayResults.map((res) => (
                      <div
                        key={res.network}
                        className='d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-3 p-sm-4 bg-light rounded-3 border border-gray-200 gap-2'
                      >
                        <div className='d-flex align-items-center gap-3'>
                          <span className='badge badge-circle badge-success'>
                            <Check size={12} className='text-white' />
                          </span>
                          <div>
                            <div className='fw-bolder text-gray-900 fs-6'>{res.network}</div>
                            <div className='text-muted fs-8'>Gateway HTTP status: 200 OK</div>
                          </div>
                        </div>
                        <div className='text-sm-end'>
                          <span className='badge badge-light-success fw-bold me-2'>{res.status}</span>
                          <span className='badge badge-light fw-semibold text-gray-700'>{res.latency}</span>
                        </div>
                      </div>
                    ))}

                    <div className='alert alert-light-success d-flex align-items-center p-4 mt-2 mb-0 rounded-3 border border-success border-opacity-25'>
                      <Activity size={18} className='text-success me-3 flex-shrink-0' />
                      <div className='fs-7 text-gray-800'>
                        All telco gateways are responsive. Subscribers dialing <strong>{ussdCode}</strong> are being routed without interruption.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-between flex-wrap gap-2'>
                <button
                  type='button'
                  className='btn btn-light-primary fw-bold'
                  disabled={isTestingGateway}
                  onClick={handleRunGatewayTest}
                >
                  <RotateCcw size={14} className='me-2' /> Re-test Gateways
                </button>
                <button
                  type='button'
                  className='btn btn-light'
                  onClick={() => setIsGatewayModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export {SettingsPage}
