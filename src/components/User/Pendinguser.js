/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import {
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
} from '@coreui/react'

import './pendinguser.css'

const Pendinguser = () => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [approvingAll, setApprovingAll] = useState(false)

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${ROOT_URL}/api/users/all`)
      if (res.data.success) {
        // Filter only pending users
        const pendingUsers = res.data.data.filter((user) => user.status === 'pending')
        console.log('Pending Users:', pendingUsers)
        setUsers(pendingUsers)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    )
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.userId))
    } else {
      setSelectedUsers([])
    }
  }
  const handleApproveAll = async () => {
    if (selectedUsers.length === 0) {
      swal('Warning', 'Please select at least one user', 'warning')
      return
    }

    const confirm = await swal({
      title: 'Approve Selected Users?',
      text: `You are going to approve ${selectedUsers.length} users.`,
      icon: 'warning',
      buttons: true,
    })

    if (!confirm) return

    try {
      setApprovingAll(true)

      await Promise.all(
        selectedUsers.map((userId) =>
          axios.put(`${ROOT_URL}/api/users/status/${userId}`, {
            status: 'active',
          }),
        ),
      )

      setSelectedUsers([])

      swal('Success', 'Selected users approved successfully!', 'success')

      await fetchUsers()
    } catch (error) {
      console.error('Approve selected users error:', error)

      swal('Error', error.response?.data?.message || 'Failed to approve selected users', 'error')

      await fetchUsers()
    } finally {
      setApprovingAll(false)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle Approve / Reject
  const handleUpdateStatus = async (userId, status) => {
    try {
      const res = await axios.put(`${ROOT_URL}/api/users/status/${userId}`, { status })
      if (res.data.success) {
        swal('Success', res.data.message, 'success')
        fetchUsers() // refresh table
      }
    } catch (error) {
      console.error('Error updating status:', error)
      swal('Error', error.response?.data?.message || 'Failed to update status', 'error')
    }
  }

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.userId.toLowerCase().includes(query.toLowerCase()) ||
      user.name?.toLowerCase().includes(query.toLowerCase()),
  )

  if (loading) return <p className="text-center mt-5">Loading users...</p>

  return (
    <>
      <CCardHeader>
        <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
          <CButton
            color="success"
            className="text-white"
            disabled={selectedUsers.length === 0 || approvingAll}
            onClick={handleApproveAll}
          >
            {approvingAll ? 'Approving...' : `Approve All (${selectedUsers.length})`}
          </CButton>

          <CFormInput
            className="w-25"
            placeholder="Search user..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <h5 className="text-center mb-2 mt-2">Pending Users Verification</h5>
      </CCardHeader>

      {filteredUsers.length > 0 ? (
        <CTable responsive="sm" color="dark" className="mt-2">
          <CTableHead>
            <CTableRow>
              {/* <CTableHeaderCell>
                <input
                  type="checkbox"
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </CTableHeaderCell> */}
              <CTableHeaderCell rowSpan={2}>
               <CButton
  color="primary"
  size="sm"
  className="text-white"
  style={{
    fontWeight: '600',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    minWidth: '100px',
  }}
  onClick={() =>
    handleSelectAll(
      !(users.length > 0 && selectedUsers.length === users.length),
    )
  }
>
  {users.length > 0 && selectedUsers.length === users.length
    ? 'Deselect All'
    : 'Select All'}
</CButton>
              </CTableHeaderCell>

              <CTableHeaderCell>S/N</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Address</CTableHeaderCell>
              <CTableHeaderCell>Aadhaar Photo(front)</CTableHeaderCell>
              <CTableHeaderCell>Aadhaar Photo(back)</CTableHeaderCell>
              <CTableHeaderCell>Pan Photo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableDataCell>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.userId)}
                    onChange={() => handleSelectUser(user.userId)}
                  />
                </CTableDataCell>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{user.userId}</CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.address}</CTableDataCell>

                <CTableDataCell>
                  <a href={user.aadharPhotoFront} target="_blank">
                    <img
                      src={user.aadharPhotoFront}
                      alt="Aadhaar"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                      }}
                    />
                  </a>
                </CTableDataCell>
                <CTableDataCell>
                  <a href={user.aadharPhotoBack} target="_blank">
                    <img
                      src={user.aadharPhotoBack}
                      alt="Aadhaar"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                      }}
                    />
                  </a>
                </CTableDataCell>
                <CTableDataCell>
                  <a href={user.panPhoto} target="_blank">
                    {' '}
                    <img
                      src={user.panPhoto}
                      alt="Aadhaar"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'contain',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                      }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.style.display = 'none'
                      }}
                    />
                  </a>
                </CTableDataCell>

                <CTableDataCell className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <CButton
                      color="success"
                      className="text-white"
                      onClick={() => handleUpdateStatus(user.userId, 'active')}
                    >
                      Approve
                    </CButton>
                    <CButton
                      color="danger"
                      className="text-white"
                      onClick={() => handleUpdateStatus(user.userId, 'inactive')}
                    >
                      Reject
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p className="text-center mt-3">No pending users found.</p>
      )}
    </>
  )
}

export default Pendinguser
