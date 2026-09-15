import {FC} from 'react'
import {Link} from 'react-router-dom'
import {AlertCircle} from 'lucide-react'

const Error500: FC = () => {
  return (
    <>
      {/* begin::Illustration */}
      <div className='mb-6 d-flex justify-content-center'>
        <div className='symbol symbol-100px bg-light-danger d-flex align-items-center justify-content-center p-4 rounded-circle'>
          <AlertCircle size={64} className='text-danger' />
        </div>
      </div>
      {/* end::Illustration */}

      {/* begin::Title */}
      <h1 className='fw-bolder fs-2qx text-gray-900 mb-4'>System Error</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className='fw-semibold fs-6 text-gray-500 mb-7'>
        Something went wrong! Please try again later.
      </div>
      {/* end::Text */}

      {/* begin::Link */}
      <div className='mb-0'>
        <Link to='/dashboard' className='btn btn-sm btn-primary'>
          Return Home
        </Link>
      </div>
      {/* end::Link */}
    </>
  )
}

export {Error500}
