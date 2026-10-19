
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CAlert,
  CBadge,
  CRow,
  CCol,
} from '@coreui/react'


const Couponcode = () => {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
   const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL
  // Fetch all users who have received coupons
 const fetchCoupons = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const response = await axios.get(
      `${ROOT_URL}/api/referral/admin/coupons`
    );

    if (response.data.success) {
      setCoupons(response.data.coupons || []);
    } else {
      setError(response.data.message || "Failed to load coupons.");
    }
  } catch (err) {
    console.error("Fetch coupons error:", err);
    setError(err.response?.data?.message || "Failed to load coupons.");
  } finally {
    setLoading(false);
  }
}, [ROOT_URL]);

  useEffect(() => {
    fetchCoupons()
  }, [fetchCoupons])

  // Run the bulk coupon API
  const handleGenerateCoupons = async () => {
    const confirmed = window.confirm(
      'Do you want to generate coupons for all eligible referrals?',
    )

    if (!confirmed) return

    setGenerating(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        `${ROOT_URL}/api/referral/admin/bulk-generate-coupons`,
        {},
        // { withCredentials: true },
      )

      if (response.data.success) {
        const count = response.data.summary?.couponsGenerated ?? 0

        setSuccess(
          `Bulk processing completed. Newly generated coupons: ${count}.`,
        )

        // Refresh the complete saved coupon list
        await fetchCoupons()
      } else {
        setError(response.data.message || 'Coupon generation failed.')
      }
    } catch (err) {
      console.error('Generate coupons error:', err)
      setError(
        err.response?.data?.message || 'Coupon generation failed.',
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container-fluid">
      <CRow className="mb-4 align-items-center">
        <CCol>
          <h3 className="mb-1">Coupon Management</h3>
          <p className="text-body-secondary mb-0">
            Generate referral coupons and view all coupon recipients.
          </p>
        </CCol>

        <CCol xs="auto">
          <CButton
            color="primary"
            onClick={handleGenerateCoupons}
            disabled={generating}
          >
            {generating ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              'Generate Coupons'
            )}
          </CButton>
        </CCol>
      </CRow>

      {success && (
        <CAlert
          color="success"
          dismissible
          onClose={() => setSuccess('')}
        >
          {success}
        </CAlert>
      )}

      {error && (
        <CAlert
          color="danger"
          dismissible
          onClose={() => setError('')}
        >
          {error}
        </CAlert>
      )}

      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Users Who Received Coupons</strong>

          <CBadge color="success">
            Total: {coupons.length}
          </CBadge>
        </CCardHeader>

        <CCardBody>
          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
              <p className="mt-2 mb-0">Loading coupon list...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center text-body-secondary py-4">
              No coupon recipients found.
            </div>
          ) : (
            <div className="table-responsive">
              <CTable hover bordered striped align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>#</CTableHeaderCell>
                    <CTableHeaderCell>Referrer User ID</CTableHeaderCell>
                    <CTableHeaderCell>Referrer User Name</CTableHeaderCell>
                    <CTableHeaderCell>Coupon Code</CTableHeaderCell>
                    <CTableHeaderCell>
                      Qualifying Referral User ID
                    </CTableHeaderCell>
                    
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {coupons.map((coupon, index) => (
                    <CTableRow key={coupon.userId || index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>

                      <CTableDataCell>
                        {coupon.userId || '—'}
                      </CTableDataCell>
                       <CTableDataCell>
                        {coupon.name || '—'}
                      </CTableDataCell>


                      <CTableDataCell>
                        <CBadge color="success" className="fs-6">
                          {coupon.couponCode || '—'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell>
                        {coupon.referredUserId || '—'}
                      </CTableDataCell>

                     
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={fetchCoupons}
              disabled={loading}
            >
              Refresh List
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Couponcode
