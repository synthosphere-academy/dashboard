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

const Pendingkyc = () => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  // Fetch all KYC users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${ROOT_URL}/api/bankdetails/all`)
      if (res.data.success) {
        // Filter only pending users
        const pendingUsers = res.data.data.filter((user) => user.status === 'pending')
        console.log(pendingUsers)
        setUsers(pendingUsers)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching KYC users:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle Approve / Reject
  const handleUpdateStatus = async (userId, status) => {
    try {
      const res = await axios.put(`${ROOT_URL}/api/bankdetails/status/${userId}`, { status })
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
      user.nameAsPerDocument?.toLowerCase().includes(query.toLowerCase())
  )

  if (loading) return <p className="text-center mt-5">Loading KYC users...</p>

  return (
    <>
      <CCardHeader>
        <div className="d-flex justify-content-end">
          <CFormInput
            className="ms-3 w-25"
            placeholder="Search user..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <h5 className="text-center mb-2">Pending KYC Users</h5>
      </CCardHeader>

      {filteredUsers.length > 0 ? (
        <CTable responsive="sm" color="dark" className="mt-2">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S/N</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Bank name & Account type</CTableHeaderCell>
              <CTableHeaderCell>Bank Account & ifscCode</CTableHeaderCell>
               <CTableHeaderCell>Passbook photo</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{user.userId}</CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                 <CTableDataCell>{user.bankName} & {user.accountType}</CTableDataCell>
                 <CTableDataCell>{user.accountNo} & {user.ifscCode}
                 </CTableDataCell>
                 <CTableDataCell>
        {user.passbookPhoto ? (
          <a href={user.passbookPhoto} target='_blank'>
          <img 
            src={user.passbookPhoto}
            alt="Passbook"
            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
          /></a>
        ) : (
          'Np Photo'
        )}
      </CTableDataCell>
               
                
                <CTableDataCell className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <CButton
                      className="btn btn-success text-white"
                      onClick={() => handleUpdateStatus(user.userId, 'verified')}
                    >
                      Approve
                    </CButton>
                    <CButton
                      className="btn btn-danger text-white"
                      onClick={() => handleUpdateStatus(user.userId, 'rejected')}
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
        <p className="text-center mt-3">No pending KYC users found.</p>
      )}
    </>
  )
}

export default Pendingkyc
