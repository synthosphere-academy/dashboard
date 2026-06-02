import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CSpinner,
} from '@coreui/react'
import swal from 'sweetalert'

function Payout() {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL

  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [updating, setUpdating] = useState(null)
  // bulk status update state (if needed in future)
  const [selectedPayouts, setSelectedPayouts] = useState([])
  // 🔹 Filters
  const [amountFilter, setAmountFilter] = useState('200') // all | 200 (default 200)
  const [selectedDate, setSelectedDate] = useState('')
  const [searchName, setSearchName] = useState('')

  // ================= FETCH PAYOUTS =================
  const fetchPayouts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${ROOT_URL}/api/payout/all-payouts`)

      if (res.data.success) {
        const formatted = res.data.data.flatMap((user) =>
          user.payouts
            .filter((p) => p.amount > 0)
            .map((p) => ({
              name: user.name,
              userId: user.userId,
              payoutId: p._id,
              amount: p.amount,
              date: p.date, // assumed YYYY-MM-DD or ISO
              status: p.status,
            })),
        )

        setPayouts(formatted)
      }
    } catch (error) {
      console.error(error)
      swal('Error', 'Failed to fetch payouts', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayouts()
  }, [])

  // ================= UNIQUE PAYOUT DATES =================
  //
  // const payoutDates = [...new Set(payouts.map((p) => p.date))]
  const payoutDates = [...new Set(payouts.map((p) => p.date.split(',')[0].trim()))]

  // ================= FILTERED PAYOUTS =================
  const filteredPayouts = payouts.filter((p) => {
    const netAmount = p.amount - p.amount * 0.05

    // ✅ Amount filter
    if (amountFilter === '200' && netAmount < 200) return false

    // ✅ Date filter (only if selected)
    const onlyDate = p.date.split(',')[0].trim()

    if (selectedDate && onlyDate !== selectedDate) return false
    // if (selectedDate && p.date !== selectedDate) return false
    if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) return false
    return true
  })

  // ================= TOTAL PAYOUT =================
  const totalPayoutAmount = filteredPayouts.reduce(
    (sum, p) => sum + (p.amount - p.amount * 0.05),
    0,
  )
  // checkbox handler
  const handleSelectPayout = (payout) => {
    setSelectedPayouts((prev) =>
      prev.find((x) => x.payoutId === payout.payoutId)
        ? prev.filter((x) => x.payoutId !== payout.payoutId)
        : [...prev, payout],
    )
  }
  // ================= GENERATE PAYOUT =================
  const handleGeneratePayout = async () => {
    try {
      setGenerating(true)
      const res = await axios.post(`${ROOT_URL}/api/payout/run`)

      if (res.data.success) {
        swal('Success', res.data.message, 'success')
        fetchPayouts()
      } else {
        swal('Error', res.data.message, 'error')
      }
    } catch (error) {
      console.error(error)
      swal('Error', 'Failed to generate payout', 'error')
    } finally {
      setGenerating(false)
    }
  }

  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async (userId, payoutId, newStatus) => {
    try {
      setUpdating(payoutId)
      const res = await axios.put(`${ROOT_URL}/api/payout/status/${userId}/${payoutId}/status`, {
        status: newStatus,
      })

      if (res.data.success) {
        swal('Success', res.data.message, 'success')
        fetchPayouts()
      } else {
        swal('Error', res.data.message, 'error')
      }
    } catch (error) {
      console.error(error)
      swal('Error', error.response?.data?.message || 'Update failed', 'error')
    } finally {
      setUpdating(null)
    }
  }

  const handleBulkComplete = async () => {
  if (selectedPayouts.length === 0) {
    return swal(
      'Warning',
      'Please select at least one payout',
      'warning'
    )
  }

  try {
    await Promise.all(
      selectedPayouts.map((p) =>
        axios.put(
          `${ROOT_URL}/api/payout/status/${p.userId}/${p.payoutId}/status`,
          {
            status: 'completed',
          }
        )
      )
    )

    swal(
      'Success',
      `${selectedPayouts.length} payouts completed`,
      'success'
    )

    setSelectedPayouts([])
    fetchPayouts()
  } catch (error) {
    console.error(error)
    swal('Error', 'Bulk update failed', 'error')
  }
}

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold">All User Payouts</h5>
        <CButton
  color="primary"
  className="ms-2"
  onClick={handleBulkComplete}
  disabled={selectedPayouts.length === 0}
>
  Complete Selected ({selectedPayouts.length})
</CButton>
        <CButton
          color="success"
          className="text-white"
          onClick={handleGeneratePayout}
          disabled={generating}
        >
          {generating ? (
            <>
              <CSpinner size="sm" className="me-2" /> Generating...
            </>
          ) : (
            'Generate Payout'
          )}
        </CButton>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="row mb-3">
        {/* Amount Filter */}
        <div className="col-md-3">
          <label className="fw-bold">Amount Filter</label>
          <select
            className="form-select"
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value)}
          >
            <option value="200">₹200 & Above (After TDS)</option>
            <option value="all">All Payouts</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="col-md-3">
          <label className="fw-bold">Payout Date</label>
          <select
            className="form-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">All Dates</option>
            {payoutDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        {/* Username Search */}
        <div className="col-md-3">
          <label className="fw-bold">Search Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        {/* Total */}
        <div className="col-md-3 d-flex align-items-end">
          <div className="alert alert-success w-100 mb-0 text-center fw-bold">
            Total Payout: ₹{totalPayoutAmount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <div className="text-center my-5">
          <CSpinner color="primary" />
          <p className="mt-2">Loading payouts...</p>
        </div>
      ) : (
        <CTable responsive bordered hover align="middle">
          <CTableHead color="dark">
            <CTableRow className="text-center">
              <CTableHeaderCell>Select</CTableHeaderCell>
              <CTableHeaderCell>#</CTableHeaderCell>
              <CTableHeaderCell>User Name</CTableHeaderCell>
              <CTableHeaderCell>User ID</CTableHeaderCell>
              <CTableHeaderCell>Payout Amount (₹)</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Net Amount (After TDS)</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody className="text-center">
            {filteredPayouts.length > 0 ? (
              filteredPayouts.map((p, index) => (
                <CTableRow key={p.payoutId}>
                  <CTableDataCell>
                    <input
                      type="checkbox"
                      checked={selectedPayouts.some((item) => item.payoutId === p.payoutId)}
                      disabled={p.status !== 'pending'}
                      onChange={() => handleSelectPayout(p)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{p.name}</CTableDataCell>
                  <CTableDataCell>{p.userId}</CTableDataCell>
                  <CTableDataCell>₹{p.amount}</CTableDataCell>
                  <CTableDataCell>{p.date}</CTableDataCell>
                  <CTableDataCell>₹{(p.amount - p.amount * 0.05).toFixed(2)}</CTableDataCell>
                  <CTableDataCell>
                    <span
                      className={`badge px-3 py-2 ${
                        p.status === 'completed'
                          ? 'bg-success'
                          : p.status === 'pending'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                      }`}
                    >
                      {p.status === 'failed' ? 'Cancelled' : p.status}
                    </span>
                  </CTableDataCell>

                  <CTableDataCell>
                    {p.status === 'completed' ? (
                      <CButton size="sm" disabled>
                        Completed
                      </CButton>
                    ) : p.status === 'failed' ? (
                      <CButton color="danger" size="sm" disabled>
                        Cancelled
                      </CButton>
                    ) : (
                      <>
                      <div className="d-flex justify-content-center">
                        <CButton
                          color="primary"
                          size="sm"
                          disabled={updating === p.payoutId}
                          onClick={() => handleStatusUpdate(p.userId, p.payoutId, 'completed')}
                        >
                          {updating === p.payoutId ? (
                            <>
                              <CSpinner size="sm" /> Updating...
                            </>
                          ) : (
                            'Completed'
                          )}
                        </CButton>

                        <CButton
                          color="danger"
                          size="sm"
                          className="ms-2"
                          disabled={updating === p.payoutId}
                          onClick={() => handleStatusUpdate(p.userId, p.payoutId, 'failed')}
                        >
                          Cancel
                        </CButton>
                        </div>
                      </>
                    )}
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-muted">
                  No payouts found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      )}
    </>
  )
}

export default Payout
