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
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [query, setQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL

  useEffect(() => {
    fetchClassicTraders()
  }, [])

  const fetchClassicTraders = async () => {
    try {
      setLoading(true)

      const res = await axios.get(`${ROOT_URL}/api/users/all`)

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
              purchaseCount: classicPackages.map(
                (item) => item.packageName,
              ),
              purchaseDates: classicPackages.map(
                (item) => item.date,
              ),
            }
          })
          .filter(Boolean)

        setUsers(classicUsers)
        setFilteredUsers(classicUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const search = query.toLowerCase()

    const filtered = users.filter((user) => {
      // Month Filter
      const monthMatched =
        selectedMonth === ''
          ? true
          : user.purchaseDates.some((date) => {
              if (!date) return false

              const [datePart] = date.split(',')
              const [day, month, year] = datePart.trim().split('/')

              const dateObj = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
              )

              const monthName = dateObj.toLocaleString('default', {
                month: 'long',
              })

              return (
                monthName.toLowerCase() ===
                selectedMonth.toLowerCase()
              )
            })

      // Date Filter
      const dateMatched =
        selectedDate === ''
          ? true
          : user.purchaseDates.some((date) => {
              if (!date) return false

              const [datePart] = date.split(',')
              const [day, month, year] = datePart.trim().split('/')

              const formattedDate = `${year}-${String(month).padStart(
                2,
                '0',
              )}-${String(day).padStart(2, '0')}`

              return formattedDate === selectedDate
            })

      // Search Filter
      const purchaseMatched =
        user.purchaseCount.some((item) =>
          item?.toLowerCase().includes(search),
        ) ||
        user.purchaseDates.some((item) =>
          item?.toLowerCase().includes(search),
        )

      return (
        monthMatched &&
        dateMatched &&
        (user.name?.toLowerCase().includes(search) ||
          user.userId?.toLowerCase().includes(search) ||
          user.phoneNo?.toLowerCase().includes(search) ||
          purchaseMatched)
      )
    })

    setFilteredUsers(filtered)
  }, [users, query, selectedMonth, selectedDate])

  return (
    <>
      <CCardHeader className="mb-3">
        <h5>Classic Traders Users</h5>

        <div className="d-flex flex-wrap gap-3">
          {/* Search */}
          <input
            type="text"
            className="form-control mt-3 w-25"
            placeholder="Search by Name, User ID, Phone, Date"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Month Filter */}
          <select
            className="form-select mt-3 w-25"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>

            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            className="form-control mt-3 w-25"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </CCardHeader>

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
              <CTableHeaderCell>Package Name</CTableHeaderCell>
              <CTableHeaderCell>Purchase Date</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {filteredUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>

                <CTableDataCell>{user.name}</CTableDataCell>

                <CTableDataCell>{user.userId}</CTableDataCell>

                <CTableDataCell>{user.phoneNo}</CTableDataCell>

                <CTableDataCell>
                  {user.purchaseCount.map((item, idx) => (
                    <div key={idx}>{item}</div>
                  ))}
                </CTableDataCell>

                <CTableDataCell>
                  {user.purchaseDates.map((item, idx) => (
                    <div key={idx}>{item}</div>
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