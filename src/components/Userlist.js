/* eslint-disable prettier/prettier */
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
import { Link } from 'react-router-dom'
const Userlist = () => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [batchFilter, setBatchFilter] = useState('')
  const usersPerPage = 50

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${ROOT_URL}/api/users/all`)
      if (res.data.success) {
        console.log(res.data.data)
        setUsers(res.data.data) // ✅ show all users
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])
  const batches = {
    6: {
      label: 'Batch 6',
      start: '26/4/2026',
      end: '19/5/2026',
    },

    7: {
      label: 'Batch 7',
      start: '20/5/2026',
      end: '31/5/2026',
    },
    8: {
      label: 'Batch 8',
      start: '1/6/2026',
      end: '15/6/2026',
    },
    9: {
      label: 'Batch 9',
      start: '16/6/2026',
      end: '30/6/2026',
    },
     10: {
      label: 'Batch 10',
      start: '1/7/2026',
      end: '15/7/2026',
    },
     11: {
      label: 'Batch 11',
      start: '16/7/2026',
      end: '31/7/2026',
    },
    12:{
      label: 'Batch 12',
      start: '1/8/2026',
      end: '15/8/2026',
    },
    13:{
      label: 'Batch 13',
      start: '16/8/2026',
      end: '31/8/2026',
    },
    14:{
      label: 'Batch 14',
      start: '1/9/2026',
      end: '15/9/2026',
    },
    15:{
      label: 'Batch 15',
      start: '16/9/2026',
      end: '30/9/2026', 
    },
    16:{
      label: 'Batch 16',
      start: '1/10/2026',
      end: '15/10/2026',
    },
    17:{
      label: 'Batch 17',
      start: '16/10/2026',
      end: '31/10/2026',
    },
    18:{
      label: 'Batch 18',
      start: '1/11/2026',
      end: '15/11/2026',  
    },
    19:{
      label: 'Batch 19',
      start: '16/11/2026',
      end: '30/11/2026',  
    },
    20:{
      label: 'Batch 20',
      start: '1/12/2026',
      end: '15/12/2026',
    },
    21:{
      label: 'Batch 21',
      start: '16/12/2026',
      end: '31/12/2026',  
    },
    
  }
  // Filter users by search
  const filteredUsers = users
    // latest first
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((user) => {
      const queryLower = query.toLowerCase()

      const hasCourse = !!user.courseDetails

      const courseName = user.courseDetails?.courseName?.toLowerCase() || ''

      const packageName = user.courseDetails?.packageName?.toLowerCase() || ''

      const noCourseText = !hasCourse ? 'no enrolled course' : ''

      const noPackageText = !hasCourse ? 'no enrolled package' : ''

      // ================= SEARCH FILTER =================

      const searchMatched =
        user.userId?.toLowerCase().includes(queryLower) ||
        user.name?.toLowerCase().includes(queryLower) ||
        user.email?.toLowerCase().includes(queryLower) ||
        user.phone?.toLowerCase().includes(queryLower) ||
        courseName.includes(queryLower) ||
        packageName.includes(queryLower) ||
        noCourseText.includes(queryLower) ||
        noPackageText.includes(queryLower)

      // ================= BATCH FILTER =================

      let batchMatched = true

      if (batchFilter) {
        const selectedBatch = batches[batchFilter]

        if (selectedBatch) {
          const purchaseDateString = user.courseDetails?.purchaseHistory?.[0]?.date

          if (!purchaseDateString) {
            batchMatched = false
          } else {
            // ================= USER PURCHASE DATE =================

            // example:
            // 19/5/2026, 2:17:24 pm

            const onlyDate = purchaseDateString.split(',')[0].trim()

            const [day, month, year] = onlyDate.split('/')

            const purchaseDate = new Date(Number(year), Number(month) - 1, Number(day))

            // ================= BATCH START DATE =================

            const [startDay, startMonth, startYear] = selectedBatch.start.split('/')

            const startDate = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay))

            // ================= BATCH END DATE =================

            const [endDay, endMonth, endYear] = selectedBatch.end.split('/')

            const endDate = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay))

            // ================= MATCH =================

            batchMatched = purchaseDate >= startDate && purchaseDate <= endDate
          }
        }
      }

      return searchMatched && batchMatched
    })
  // const queryLower = query.toLowerCase()

  // const hasCourse = !!user.courseDetails
  // const courseName = user.courseDetails?.courseName?.toLowerCase() || ''
  // const packageName = user.courseDetails?.packageName?.toLowerCase() || ''

  // // 👇 virtual searchable labels
  // const noCourseText = !hasCourse ? 'no enrolled course' : ''
  // const noPackageText = !hasCourse ? 'no enrolled package' : ''

  // return (
  //   user.userId?.toLowerCase().includes(queryLower) ||
  //   user.name?.toLowerCase().includes(queryLower) ||
  //   user.email?.toLowerCase().includes(queryLower) ||
  //   user.phone?.toLowerCase().includes(queryLower) ||
  //   courseName.includes(queryLower) ||
  //   packageName.includes(queryLower) ||
  //   noCourseText.includes(queryLower) ||
  //   noPackageText.includes(queryLower)
  // )

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const downloadUsersPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("User List (Name & Phone)", 14, 15);

    const tableColumn = ["S/N", "Name", "Phone","Package Name"];
    const tableRows = [];

    filteredUsers.forEach((user, index) => {
      tableRows.push([
        index + 1,
        user.name || "N/A",
        user.phone || "N/A",
         user.courseDetails?.packageName ||
                     "No Enrolled Package"

      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("users-name-phone.pdf");
  };
 

  if (loading) return <p className="text-center mt-5">Loading users...</p>

  return (
    <>
      <CCardHeader className="d-flex justify-content-between align-items-center mb-3">
        <h5>All Users</h5>
        <select
          className="form-select w-25"
          value={batchFilter}
          onChange={(e) => {
            setBatchFilter(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="">All Batches</option>

          {Object.entries(batches).map(([key, batch]) => (
            <option key={key} value={key}>
              {batch.label}
            </option>
          ))}
        </select>
        <CFormInput
          className="w-25"
          placeholder="Search user..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <button className="btn btn-success ms-2" onClick={downloadUsersPDF}>
          Download PDF
        </button>
      </CCardHeader>

      {filteredUsers.length > 0 ? (
        <div className="table-responsive">
          <CTable className="mt-2 table-bordered align-middle">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>S/N</CTableHeaderCell>
                <CTableHeaderCell>User ID</CTableHeaderCell>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Address</CTableHeaderCell>
                <CTableHeaderCell>Phone No</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Course name</CTableHeaderCell>
                <CTableHeaderCell>Purchase date</CTableHeaderCell>
                <CTableHeaderCell>Package name</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentUsers.map((user, index) => (
                <CTableRow key={user._id}>
                  <CTableDataCell>{indexOfFirstUser + index + 1}</CTableDataCell>
                  <CTableDataCell>{user.userId}</CTableDataCell>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell
                    style={{
                      whiteSpace: 'normal',
                      maxWidth: '300px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {user.address}
                  </CTableDataCell>
                  <CTableDataCell>{user.phone}</CTableDataCell>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>
                    {user.courseDetails?.courseName || (
                      <span className="text-muted">No Enrolled Course</span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {user.courseDetails?.purchaseHistory?.[0]?.date || 'N/A'}
                  </CTableDataCell>
                  <CTableDataCell>
                    {user.courseDetails?.packageName || (
                      <span className="text-muted">No Enrolled Package</span>
                    )}
                    <br />{' '}
                    {{
                      'Learner Course': 1770,
                      'Master Course': 3540,
                      'Pro Master Course': 7080,
                      'Teacher Course': 11800,
                      'Pro Teacher Course': 59000,
                      'Monthly Subscription': 944,
                    }[user.courseDetails?.packageName] || '0000'}
                  </CTableDataCell>
                  <CTableHeaderCell>{user.status}</CTableHeaderCell>
                  <CTableHeaderCell HeaderCell className="text-center">
                    <Link to={`/user/edituser/${user.userId}`} className="mt-1">
                      <i className="fa fa-edit ms-2 mt-1"></i>
                    </Link>
                  </CTableHeaderCell>{' '}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      ) : (
        <p className="text-center mt-3">No users found.</p>
      )}
      <div className="d-flex justify-content-center mt-3 mb-3 gap-2 flex-wrap flex">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Userlist
