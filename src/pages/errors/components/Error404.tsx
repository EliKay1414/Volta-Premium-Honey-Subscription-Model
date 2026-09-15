import {FC} from 'react'
import {Link} from 'react-router-dom'
import {FileQuestion} from 'lucide-react'

const Error404: FC = () => {
  return (
    <>
      {/* begin::Illustration */}
      <div className='mb-6 d-flex justify-content-center'>
        <div className='symbol symbol-100px bg-light-warning d-flex align-items-center justify-content-center p-4 rounded-circle'>
          <FileQuestion size={64} className='text-warning' />
        </div>
      </div>
      {/* end::Illustration */}

      {/* begin::Title */}
      <h1 className='fw-bolder fs-2hx text-gray-900 mb-4'>Page Not Found</h1>
      {/* end::Title */}

      {/* begin::Text */}
      <div className='fw-semibold fs-6 text-gray-500 mb-7'>We couldn't find the page you're looking for.</div>
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

export {Error404}
