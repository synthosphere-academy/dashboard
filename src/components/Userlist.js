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

  // Filter users by search
  const filteredUsers = users
    // latest first
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((user) => {
      const queryLower = query.toLowerCase()

      const hasCourse = !!user.courseDetails
      const courseName = user.courseDetails?.courseName?.toLowerCase() || ''
      const packageName = user.courseDetails?.packageName?.toLowerCase() || ''

      // 👇 virtual searchable labels
      const noCourseText = !hasCourse ? 'no enrolled course' : ''
      const noPackageText = !hasCourse ? 'no enrolled package' : ''

      return (
        user.userId?.toLowerCase().includes(queryLower) ||
        user.name?.toLowerCase().includes(queryLower) ||
        user.email?.toLowerCase().includes(queryLower) ||
        user.phone?.toLowerCase().includes(queryLower) ||
        courseName.includes(queryLower) ||
        packageName.includes(queryLower) ||
        noCourseText.includes(queryLower) ||
        noPackageText.includes(queryLower)
      )
    })
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // const downloadUsersPDF = () => {
  //   const doc = new jsPDF();

  //   doc.setFontSize(16);
  //   doc.text("User List (Name & Phone)", 14, 15);

  //   const tableColumn = ["S/N", "Name", "Phone","Package Name"];
  //   const tableRows = [];

  //   filteredUsers.forEach((user, index) => {
  //     tableRows.push([
  //       index + 1,
  //       user.name || "N/A",
  //       user.phone || "N/A",
  //        user.courseDetails?.packageName ||
  //                    "No Enrolled Package"

  //     ]);
  //   });

  //   autoTable(doc, {
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 25,
  //   });

  //   doc.save("users-name-phone.pdf");
  // };
  // const downloadUsersPDF = () => {
  //   const doc = new jsPDF()

  //   doc.setFontSize(16)
  //   doc.text('Users Without Package', 14, 15)

  //   const tableColumn = ['S/N', 'Name', 'Phone']
  //   const tableRows = []

  //   // Filter users who did NOT purchase any package
  //   const usersWithoutPackage = filteredUsers.filter((user) => !user.courseDetails?.packageName)

  //   usersWithoutPackage.forEach((user, index) => {
  //     tableRows.push([index + 1, user.name || 'N/A', user.phone || 'N/A'])
  //   })

  //   autoTable(doc, {
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 25,
  //   })

  //   doc.save('users-without-package.pdf')
  // }

  if (loading) return <p className="text-center mt-5">Loading users...</p>

  return (
    <>
      <CCardHeader className="d-flex justify-content-between align-items-center mb-3">
        <h5>All Users</h5>
        <CFormInput
          className="w-25"
          placeholder="Search user..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        {/* <button className="btn btn-success ms-2" onClick={downloadUsersPDF}>
          Download PDF
        </button> */}
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
                  <CTableDataCell>{user.courseDetails?.purchaseHistory[0].date}</CTableDataCell>
                  <CTableDataCell>
                    {user.courseDetails?.packageName || (
                      <span className="text-muted">No Enrolled Package</span>
                    )}
                    <br />  {user.courseDetails?.purchaseHistory?.length > 0
    ? user.courseDetails.purchaseHistory[
        user.courseDetails.purchaseHistory.length - 1
      ].amount
    : "0000"}
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
