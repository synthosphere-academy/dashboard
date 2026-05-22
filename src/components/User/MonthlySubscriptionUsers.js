/* eslint-disable prettier/prettier */

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

const MonthlySubscriptionUsers = () => {

  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL

  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // ================= SEARCH =================

  const [query, setQuery] = useState('')

  // ================= MONTH FILTER =================

  const [selectedMonth, setSelectedMonth] = useState('')

  // ================= DATE FILTER =================

  const [selectedDate, setSelectedDate] = useState('')

  // ================= FETCH USERS =================

  const fetchUsers = async () => {

    try {

      setLoading(true)

      const res = await axios.get(
        `${ROOT_URL}/api/users/all`
      )

      if (res.data.success) {

        const monthlyUsers = res.data.data

          .map((user) => {

            const monthlyPackages =
              user.courseDetails?.purchaseHistory?.filter(
                (item) =>

                  item.packageName ===
                    'Monthly Subscription'

                  ||

                  item.packageName ===
                    'Premium Monthly Subscription'

                  ||

                  item.packageName ===
                    'Super Premium Monthly Subscription'

              ) || []

            return {
              ...user,
              monthlyPackages,
            }
          })

          .filter(
            (user) =>
              user.monthlyPackages.length > 0
          )

          // ================= SORT LATEST FIRST =================

          .sort((a, b) => {

            const aLastDate =
              a.monthlyPackages[
                a.monthlyPackages.length - 1
              ]?.date

            const bLastDate =
              b.monthlyPackages[
                b.monthlyPackages.length - 1
              ]?.date

            const convertDate = (dateString) => {

              if (!dateString) return 0

              const [datePart] =
                dateString.split(',')

              const [day, month, year] =
                datePart.trim().split('/')

              return new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
              ).getTime()
            }

            return (
              convertDate(bLastDate) -
              convertDate(aLastDate)
            )
          })

        setUsers(monthlyUsers)
        setFilteredUsers(monthlyUsers)
      }

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ================= FILTER USERS =================

  useEffect(() => {

    const search = query.toLowerCase()

    const filtered = users.filter((user) => {

      // ================= MONTH FILTER =================

      const monthMatched =
        selectedMonth === ''
          ? true
          : user.monthlyPackages.some((item) => {

              if (!item.date) return false

              const [datePart] =
                item.date.split(',')

              const [day, month, year] =
                datePart.trim().split('/')

              const dateObj = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
              )

              const monthName =
                dateObj.toLocaleString(
                  'default',
                  {
                    month: 'long',
                  }
                )

              return (
                monthName.toLowerCase() ===
                selectedMonth.toLowerCase()
              )
            })

      // ================= DATE FILTER =================

      const dateMatched =
        selectedDate === ''
          ? true
          : user.monthlyPackages.some((item) => {

              if (!item.date) return false

              const [datePart] =
                item.date.split(',')

              const [day, month, year] =
                datePart.trim().split('/')

              const formattedDate =
                `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

              return (
                formattedDate === selectedDate
              )
            })

      // ================= SEARCH FILTER =================

      const subscriptionMatched =
        user.monthlyPackages.some((item) => {

          return (

            item.packageName
              ?.toLowerCase()
              .includes(search)

            ||

            item.date
              ?.toLowerCase()
              .includes(search)

          )
        })

      return (

        monthMatched &&
        dateMatched &&

        (

          user.name
            ?.toLowerCase()
            .includes(search)

          ||

          user.userId
            ?.toLowerCase()
            .includes(search)

          ||

          user.phone
            ?.toLowerCase()
            .includes(search)

          ||

          subscriptionMatched
        )
      )
    })

    setFilteredUsers(filtered)

  }, [
    query,
    users,
    selectedMonth,
    selectedDate,
  ])

  // ================= LOADING =================

  if (loading) {

    return (

      <div className="text-center mt-5">
        <CSpinner />
      </div>

    )
  }

  return (
    <>

      <CCardHeader className="mb-3">

        <h5>
          Monthly Subscription Users
        </h5>

        {/* ================= SEARCH INPUT ================= */}
    <div className="d-flex flex-wrap gap-3">
        <input
          type="text"
          className="form-control mt-3 w-25"
          placeholder="
Search by Name, User ID, Phone,
Subscription Name, Date
"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        {/* ================= MONTH FILTER ================= */}

        <select
          className="form-select mt-3 w-25"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
        >

          <option value="">
            All Months
          </option>

          <option value="January">
            January
          </option>

          <option value="February">
            February
          </option>

          <option value="March">
            March
          </option>

          <option value="April">
            April
          </option>

          <option value="May">
            May
          </option>

          <option value="June">
            June
          </option>

          <option value="July">
            July
          </option>

          <option value="August">
            August
          </option>

          <option value="September">
            September
          </option>

          <option value="October">
            October
          </option>

          <option value="November">
            November
          </option>

          <option value="December">
            December
          </option>

        </select>

        {/* ================= DATE FILTER ================= */}

        <input
          type="date"
          className="form-control mt-3 w-25"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />
        </div>

      </CCardHeader>
      

      <div className="table-responsive">

        <CTable bordered hover>

          <CTableHead color="dark">

            <CTableRow>

              <CTableHeaderCell>
                S/N
              </CTableHeaderCell>

              <CTableHeaderCell>
                User ID
              </CTableHeaderCell>

              <CTableHeaderCell>
                Name
              </CTableHeaderCell>

              <CTableHeaderCell>
                Phone No
              </CTableHeaderCell>

              <CTableHeaderCell>
                Subscription Name
              </CTableHeaderCell>

              <CTableHeaderCell>
                Subscription Dates
              </CTableHeaderCell>

            </CTableRow>

          </CTableHead>

          <CTableBody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user, index) => (

                <CTableRow key={user._id}>

                  <CTableDataCell>
                    {index + 1}
                  </CTableDataCell>

                  <CTableDataCell>
                    {user.userId}
                  </CTableDataCell>

                  <CTableDataCell>
                    {user.name}
                  </CTableDataCell>

                  <CTableDataCell>
                    {user.phone}
                  </CTableDataCell>

                  {/* ================= SUBSCRIPTION NAMES ================= */}

                  <CTableDataCell>

                    {user.monthlyPackages.map(
                      (item, i) => (

                        <div
                          key={i}
                          className="mb-1"
                        >
                          {item.packageName}
                        </div>

                      )
                    )}

                  </CTableDataCell>

                  {/* ================= SUBSCRIPTION DATES ================= */}

                  <CTableDataCell>

                    {user.monthlyPackages.map(
                      (item, i) => (

                        <div
                          key={i}
                          className="mb-1"
                        >
                          {item.date}
                        </div>

                      )
                    )}

                  </CTableDataCell>

                </CTableRow>

              ))

            ) : (

              <CTableRow>

                <CTableDataCell
                  colSpan="6"
                  className="text-center"
                >

                  No Subscription Users Found

                </CTableDataCell>

              </CTableRow>

            )}

          </CTableBody>

        </CTable>

      </div>

    </>
  )
}

export default MonthlySubscriptionUsers