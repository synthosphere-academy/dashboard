import React, { useEffect, useState } from 'react'
import axios from 'axios'

import {
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
} from '@coreui/react'

function Classictraders() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL

  useEffect(() => {
    fetchClassicTraders()
  }, [])

  const fetchClassicTraders = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${ROOT_URL}/api/users/all`)
      console.log(res.data.data)
  if (res.data.success) {
  const classicUsers = res.data.data
    .map((user) => {
      const classicPackages =
        user.courseDetails?.purchaseHistory?.filter(
          (item) => item.packageName === 'Classic Traders',
        ) || []

      if (classicPackages.length === 0) return null

      return {
        _id: user._id,
        name: user.name,
        userId: user.userId,
        phoneNo: user.phone,
        purchaseCount: classicPackages.map((item) => item.packageName),// field name অনুযায়ী change করবে
        purchaseDates: classicPackages.map(
          (item) => item.date, // field name অনুযায়ী change করবে
        ),
      }
    })
    .filter(Boolean)

  setUsers(classicUsers)
}
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
     

      {loading ? (
        <div className="text-center p-4">
          <CSpinner />
        </div>
      ) : (
        <CTable bordered hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>SL</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Phone No</CTableHeaderCell>
              <CTableHeaderCell>Package name</CTableHeaderCell>
              <CTableHeaderCell>Purchase date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

         <CTableBody>
  {users.map((user, index) => (
    <CTableRow key={user._id}>
      <CTableDataCell>{index + 1}</CTableDataCell>
      <CTableDataCell>{user.name}</CTableDataCell>
      <CTableDataCell>{user.userId}</CTableDataCell>
      <CTableDataCell>{user.phoneNo}</CTableDataCell>

      <CTableDataCell>
  {user.purchaseCount.map((item, idx) => (
    <div key={idx}>
      {item}
    </div>
  ))}
</CTableDataCell>

      <CTableDataCell>
        {user.purchaseDates.map((item, idx) => (
          <div key={idx}>
            {item}
          </div>
        ))}
       
      </CTableDataCell>
    </CTableRow>
  ))}
</CTableBody>
        </CTable>
      )}
    </>
  )
}

export default Classictraders