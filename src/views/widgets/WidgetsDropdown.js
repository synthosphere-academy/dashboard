import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {
  CRow,
  CCol,
  CWidgetStatsA,
  CSpinner,
} from "@coreui/react";
import swal from "sweetalert";

const WidgetsDropdown = (props) => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAmount: 0,
    currentMonthAmount: 0,
    currentMonth: "",
  });

  // ✅ Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ROOT_URL}/api/admin/dashboard-stats`);
      if (res.data.success) {
        console.log("Dashboard Stats:", res.data.data);
        setStats(res.data.data);
      } else {
        swal("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      swal("Error", "Failed to fetch dashboard stats", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {loading ? (
        <div className="text-center my-5">
          <CSpinner color="primary" />
          <p className="mt-2">Loading dashboard stats...</p>
        </div>
      ) : (
        <>
          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              className="widgetheight"
              color="primary"
              title="Total Students"
              value={<span className="h2">{stats.totalUsers}</span>}
            />
          </CCol>

          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              className="widgetheight"
              color="info"
              title="Total Amount"
              value={<span className="h2">₹{stats.totalAmount}</span>}
            />
          </CCol>

          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              className="widgetheight"
              color="warning"
              title={`Amount (${stats.currentMonth})`}
              value={<span className="h2">₹{stats.currentMonthAmount}</span>}
            />
          </CCol>

          <CCol sm={6} xl={4} xxl={3}>
            <CWidgetStatsA
              className="widgetheight"
              color="danger"
              title="Monthly Growth"
              value={
                <span className="h2">
                  ₹{stats.currentMonthAmount}
                </span>
              }
            />
          </CCol>
        </>
      )}
    </CRow>
  );
};

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
};

export default WidgetsDropdown;
