/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
} from '@coreui/react'

const Approvedkyc = () => {
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
        // Filter only verified users
        const verifiedUsers = res.data.data.filter((user) => user.status === 'verified')
        setUsers(verifiedUsers)
        console.log('Verified KYC users:', verifiedUsers)
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
        <h5 className="text-center mb-2">Verified KYC Users</h5>
      </CCardHeader>

      {filteredUsers.length > 0 ? (
        <CTable responsive="sm" color="dark" className="mt-2">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S/N</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Bank Name</CTableHeaderCell>
              <CTableHeaderCell>Branch Name</CTableHeaderCell>
               <CTableHeaderCell>Account No</CTableHeaderCell>
                <CTableHeaderCell>Ifsc Code</CTableHeaderCell>
                 <CTableHeaderCell>Account type</CTableHeaderCell>
              <CTableHeaderCell>KYC Status</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{user.userId}</CTableDataCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.bankName}</CTableDataCell>
                 <CTableDataCell>{user.branchName}</CTableDataCell>
                <CTableDataCell>{user.accountNo}</CTableDataCell>
                <CTableDataCell>{user.ifscCode}</CTableDataCell>
                <CTableDataCell>{user.accountType? user.accountType : "-"}</CTableDataCell>
                <CTableDataCell>
                  <span
                    style={{
                      color: '#fff',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      backgroundColor: '#3fc83f', // green for verified
                    }}
                  >
                    {user.status}
                  </span>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      ) : (
        <p className="text-center mt-3">No verified KYC users found.</p>
      )}
    </>
  )
}

export default Approvedkyc
