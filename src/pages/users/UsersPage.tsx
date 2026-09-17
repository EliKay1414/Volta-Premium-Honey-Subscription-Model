import React, {FC, useState} from 'react'
import {PageTitle} from '@/layout/core'
import {Plus, ShieldCheck, Headphones, X, Check, Search, UserPlus, Edit3} from 'lucide-react'
import {toAbsoluteUrl} from '@/utils'
import {usePersistentState} from '@/hooks/usePersistentState'
import {useNotifications} from '@/components/notifications'
import {ShadcnTable, ShadcnColumn} from '@/components/table/ShadcnTable'

export interface AppUser {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Customer Support'
  department: string
  status: 'Active' | 'Inactive'
  lastLogin: string
  avatarColor: string
  avatar?: string
}

const mockUsers: AppUser[] = [
  {
    id: '1',
    name: 'Vivaldi Admin',
    email: 'admin@vivaldi.com',
    role: 'Admin',
    department: 'Management',
    status: 'Active',
    lastLogin: 'Just now',
    avatarColor: 'primary',
    avatar: '/media/avatars/300-1.jpg',
  },
  {
    id: '2',
    name: 'Kwame Osei',
    email: 'k.osei@vivaldi.com',
    role: 'Admin',
    department: 'Operations',
    status: 'Active',
    lastLogin: 'Today, 8:45 AM',
    avatarColor: 'success',
    avatar: '/media/avatars/300-2.jpg',
  },
  {
    id: '3',
    name: 'Akua Mensah',
    email: 'support@vivaldi.com',
    role: 'Customer Support',
    department: 'Subscriber Support Desk',
    status: 'Active',
    lastLogin: 'Today, 9:15 AM',
    avatarColor: 'info',
    avatar: '/media/avatars/300-6.jpg',
  },
  {
    id: '4',
    name: 'Daniel Arthur',
    email: 'd.arthur@vivaldi.com',
    role: 'Customer Support',
    department: 'USSD Registration Helpdesk',
    status: 'Active',
    lastLogin: 'Yesterday',
    avatarColor: 'primary',
    avatar: '/media/avatars/300-11.jpg',
  },
]

const AVAILABLE_AVATARS = [
  '/media/avatars/300-1.jpg',
  '/media/avatars/300-2.jpg',
  '/media/avatars/300-3.jpg',
  '/media/avatars/300-5.jpg',
  '/media/avatars/300-6.jpg',
  '/media/avatars/300-7.jpg',
  '/media/avatars/300-9.jpg',
  '/media/avatars/300-11.jpg',
  '/media/avatars/300-12.jpg',
  '/media/avatars/300-14.jpg',
]

const DEPARTMENTS = [
  'Management',
  'Operations',
  'Subscriber Support Desk',
  'USSD Registration Helpdesk',
  'Bottling & Inventory',
  'Delivery & Dispatch',
]

const UsersPage: FC = () => {
  const {showToast} = useNotifications()
  const [users, setUsers] = usePersistentState<AppUser[]>('vivaldi_users', mockUsers)
  const [highlightedRowId, setHighlightedRowId] = usePersistentState<string | number | null>('vivaldi_users_highlight_row', null)
  const [highlightedColId, setHighlightedColId] = usePersistentState<string | null>('vivaldi_users_highlight_col', null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'All' | 'Admin' | 'Customer Support'>('All')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null)

  // Add User form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Customer Support' as 'Admin' | 'Customer Support',
    department: 'Subscriber Support Desk',
    status: 'Active' as 'Active' | 'Inactive',
    avatar: '/media/avatars/300-3.jpg',
  })

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) return

    const created: AppUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: newUser.status,
      lastLogin: 'Never logged in',
      avatarColor: newUser.role === 'Admin' ? 'primary' : 'info',
      avatar: newUser.avatar,
    }

    setUsers([created, ...users])
    setHighlightedRowId(created.id)
    setHighlightedColId('name')
    setIsAddModalOpen(false)
    setNewUser({
      name: '',
      email: '',
      role: 'Customer Support',
      department: 'Subscriber Support Desk',
      status: 'Active',
      avatar: '/media/avatars/300-3.jpg',
    })

    showToast({
      category: 'user',
      title: 'User Added Successfully',
      description: `${created.name} was added as ${created.role} in ${created.department}`,
      badgeColor: 'primary',
    })
  }

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    )
    setHighlightedRowId(editingUser.id)
    setHighlightedColId('role')

    showToast({
      category: 'user',
      title: 'User Updated',
      description: `${editingUser.name}'s account was saved`,
      badgeColor: 'primary',
    })

    setEditingUser(null)
  }

  const handleToggleStatus = (userId: string) => {
    setHighlightedRowId(userId)
    setHighlightedColId('status')
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus: 'Active' | 'Inactive' = u.status === 'Active' ? 'Inactive' : 'Active'
          const updated: AppUser = {...u, status: newStatus}
          if (editingUser && editingUser.id === userId) {
            setEditingUser(updated)
          }
          showToast({
            category: 'user',
            title: `User ${newStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
            description: `${u.name} is now ${newStatus.toLowerCase()}`,
            badgeColor: newStatus === 'Active' ? 'success' : 'warning',
          })
          return updated
        }
        return u
      })
    )
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'All' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  // ShadcnTable Columns for Users
  const columns: ShadcnColumn<AppUser>[] = [
    {
      id: 'name',
      header: 'User Name & Email',
      accessor: 'name',
      render: (item) => (
        <div className='d-flex align-items-center'>
          <div className='symbol symbol-40px me-3'>
            {item.avatar ? (
              <img
                src={toAbsoluteUrl(item.avatar)}
                alt={item.name}
                className='rounded-circle shadow-sm'
                style={{objectFit: 'cover'}}
              />
            ) : (
              <span className={`symbol-label bg-light-${item.avatarColor} text-${item.avatarColor} fw-bold`}>
                {item.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            )}
          </div>
          <div className='d-flex justify-content-start flex-column'>
            <span className='text-gray-900 fw-bold fs-6 text-nowrap'>{item.name}</span>
            <span className='text-muted fs-7 text-nowrap'>{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      render: (item) => (
        <span
          className={`badge badge-light-${
            item.role === 'Admin' ? 'primary' : 'info'
          } fw-bold fs-8 text-nowrap d-inline-flex align-items-center gap-1`}
        >
          {item.role === 'Admin' ? (
            <ShieldCheck size={12} className='text-primary' />
          ) : (
            <Headphones size={12} className='text-info' />
          )}
          {item.role}
        </span>
      ),
    },
    {
      id: 'department',
      header: 'Team / Department',
      accessor: 'department',
      render: (item) => (
        <span className='text-gray-800 fw-semibold fs-7 text-nowrap'>
          {item.department}
        </span>
      ),
    },
    {
      id: 'lastLogin',
      header: 'Last Login',
      accessor: 'lastLogin',
      render: (item) => (
        <span className='text-muted fs-7 text-nowrap'>
          {item.lastLogin}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span
          className={`badge badge-light-${
            item.status === 'Active' ? 'success' : 'secondary'
          } fw-bold text-nowrap`}
        >
          {item.status}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      sortable: false,
      headerClassName: 'text-end',
      className: 'text-end',
      render: (item) => (
        <button
          type='button'
          className='btn btn-xs btn-light btn-active-light-primary text-nowrap fw-bold'
          onClick={() => {
            setEditingUser(item)
            setHighlightedRowId(item.id)
            setHighlightedColId('name')
          }}
        >
          <Edit3 size={12} className='me-1' /> Edit
        </button>
      ),
    },
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>Users</PageTitle>

      <div className='card mb-5 mb-xl-8'>
        <div className='card-header border-0 pt-5 flex-wrap gap-2'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>System Users & Permissions</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>
              Manage Admin and Customer Support desk team members and access credentials
            </span>
          </h3>
          <div className='card-toolbar d-flex flex-wrap gap-2'>
            <button
              type='button'
              className='btn btn-sm btn-primary fw-bold'
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={16} className='me-1' /> Add New User
            </button>
          </div>
        </div>

        <div className='card-body py-4'>
          {/* Search & Filter Toolbar */}
          <div className='d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5'>
            <div className='position-relative w-100 w-md-300px'>
              <Search
                size={16}
                className='text-gray-500 position-absolute top-50 translate-middle-y ms-3'
              />
              <input
                type='text'
                className='form-control form-control-solid ps-10'
                placeholder='Search users by name, email, role...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='d-flex align-items-center gap-2 flex-wrap'>
              {(['All', 'Admin', 'Customer Support'] as const).map((r) => (
                <button
                  key={r}
                  type='button'
                  className={`btn btn-sm ${
                    roleFilter === r ? 'btn-primary' : 'btn-light'
                  } fw-semibold fs-8`}
                  onClick={() => setRoleFilter(r)}
                >
                  {r === 'All' ? 'All Roles' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Shadcn UI Table */}
          <ShadcnTable
            data={filtered}
            columns={columns}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20]}
            emptyMessage='No team members found'
            keyExtractor={(u) => u.id}
            highlightedRowId={highlightedRowId}
            highlightedColId={highlightedColId}
            onRowClick={(u) => setHighlightedRowId(u.id)}
          />
        </div>
      </div>

      {/* MODAL 1: Add New User Modal */}
      {isAddModalOpen && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-600px w-100 mx-auto'>
            <div className='modal-content rounded-3 shadow-sm border border-gray-200'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <h3 className='fw-bolder text-gray-900 fs-4 mb-1'>Add New Team Member</h3>
                  <span className='text-muted fs-7'>Create an account for Admin or Customer Support</span>
                </div>
                <button
                  type='button'
                  className='btn btn-icon btn-sm btn-light-secondary rounded-circle'
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label='Close'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  <div className='row g-4'>
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Full Name</label>
                      <input
                        type='text'
                        className='form-control form-control-solid'
                        placeholder='e.g. Ama Boateng'
                        required
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      />
                    </div>

                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Email Address</label>
                      <input
                        type='email'
                        className='form-control form-control-solid'
                        placeholder='e.g. a.boateng@vivaldi.com'
                        required
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>

                    <div className='col-6'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Role</label>
                      <select
                        className='form-select form-select-solid'
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            role: e.target.value as 'Admin' | 'Customer Support',
                          })
                        }
                      >
                        <option value='Admin'>Admin</option>
                        <option value='Customer Support'>Customer Support</option>
                      </select>
                    </div>

                    <div className='col-6'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Department</label>
                      <select
                        className='form-select form-select-solid'
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Avatar Selection */}
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 mb-2'>Choose Profile Photo</label>
                      <div className='d-flex flex-wrap gap-3 p-3 bg-light rounded-3 align-items-center border border-gray-200'>
                        {AVAILABLE_AVATARS.map((avatarPath) => {
                          const isSelected = newUser.avatar === avatarPath
                          return (
                            <div
                              key={avatarPath}
                              onClick={() => setNewUser({...newUser, avatar: avatarPath})}
                              className={`cursor-pointer rounded-circle p-1 transition-all ${
                                isSelected ? 'border border-2 border-primary shadow' : 'border border-transparent'
                              }`}
                              style={{position: 'relative'}}
                            >
                              <img
                                src={toAbsoluteUrl(avatarPath)}
                                alt='Avatar'
                                className='rounded-circle'
                                style={{width: '42px', height: '42px', objectFit: 'cover'}}
                              />
                              {isSelected && (
                                <span
                                  className='position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center'
                                  style={{width: '16px', height: '16px', fontSize: '10px'}}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7'>Status</label>
                      <select
                        className='form-select form-select-solid'
                        value={newUser.status}
                        onChange={(e) =>
                          setNewUser({
                            ...newUser,
                            status: e.target.value as 'Active' | 'Inactive',
                          })
                        }
                      >
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit User Modal */}
      {editingUser && (
        <div className='modal fade show d-block' tabIndex={-1} style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050}}>
          <div className='modal-dialog modal-dialog-centered mw-600px w-100 mx-auto'>
            <div className='modal-content rounded-3 shadow-sm border border-gray-200'>
              <div className='modal-header pb-3 border-0 justify-content-between pt-5 pt-md-6 px-5 px-md-8'>
                <div>
                  <div className='d-flex flex-wrap align-items-center gap-2 mb-1'>
                    <h3 className='fw-bolder text-gray-900 fs-4 mb-0'>Edit User Profile</h3>
                    <span
                      className={`badge badge-light-${
                        editingUser.status === 'Active' ? 'success' : 'secondary'
                      } fw-bold`}
                    >
                      {editingUser.status}
                    </span>
                  </div>
                  <span className='text-muted fs-7'>Update credentials, department, and role permissions</span>
                </div>
                <button
                  type='button'
                  className='btn btn-icon btn-sm btn-light-secondary rounded-circle'
                  onClick={() => setEditingUser(null)}
                  aria-label='Close'
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEditUser}>
                <div className='modal-body py-4 py-md-6 px-5 px-md-8' style={{maxHeight: 'calc(100vh - 160px)', overflowY: 'auto'}}>
                  <div className='row g-4'>
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Full Name</label>
                      <input
                        type='text'
                        className='form-control form-control-solid'
                        required
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      />
                    </div>

                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Email Address</label>
                      <input
                        type='email'
                        className='form-control form-control-solid'
                        required
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      />
                    </div>

                    <div className='col-6'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Role</label>
                      <select
                        className='form-select form-select-solid'
                        value={editingUser.role}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            role: e.target.value as 'Admin' | 'Customer Support',
                          })
                        }
                      >
                        <option value='Admin'>Admin</option>
                        <option value='Customer Support'>Customer Support</option>
                      </select>
                    </div>

                    <div className='col-6'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 required'>Department</label>
                      <select
                        className='form-select form-select-solid'
                        value={editingUser.department}
                        onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Avatar Selection */}
                    <div className='col-12'>
                      <label className='form-label fw-semibold text-gray-800 fs-7 mb-2'>Profile Photo</label>
                      <div className='d-flex flex-wrap gap-3 p-3 bg-light rounded-3 align-items-center border border-gray-200'>
                        {AVAILABLE_AVATARS.map((avatarPath) => {
                          const isSelected = editingUser.avatar === avatarPath
                          return (
                            <div
                              key={avatarPath}
                              onClick={() => setEditingUser({...editingUser, avatar: avatarPath})}
                              className={`cursor-pointer rounded-circle p-1 transition-all ${
                                isSelected ? 'border border-2 border-primary shadow' : 'border border-transparent'
                              }`}
                              style={{position: 'relative'}}
                            >
                              <img
                                src={toAbsoluteUrl(avatarPath)}
                                alt='Avatar'
                                className='rounded-circle'
                                style={{width: '42px', height: '42px', objectFit: 'cover'}}
                              />
                              {isSelected && (
                                <span
                                  className='position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center'
                                  style={{width: '16px', height: '16px', fontSize: '10px'}}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className='col-12'>
                      <div className='card bg-light p-4 rounded-3 border border-gray-200 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3'>
                        <div>
                          <div className='fw-bold text-gray-800 fs-7'>User Account Status</div>
                          <div className='text-muted fs-8'>
                            Current status: <strong className='text-gray-900'>{editingUser.status}</strong>
                          </div>
                        </div>
                        <button
                          type='button'
                          className={`btn btn-sm ${
                            editingUser.status === 'Active' ? 'btn-light-danger' : 'btn-light-success'
                          } fw-bold`}
                          onClick={() => handleToggleStatus(editingUser.id)}
                        >
                          {editingUser.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal-footer border-0 pt-0 px-5 px-md-8 pb-5 pb-md-6 justify-content-end gap-2'>
                  <button
                    type='button'
                    className='btn btn-light'
                    onClick={() => setEditingUser(null)}
                  >
                    Close
                  </button>
                  <button type='submit' className='btn btn-primary fw-bold px-6'>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export {UsersPage}
