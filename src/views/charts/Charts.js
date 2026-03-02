import React , {useState , useEffect} from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,

} from '@coreui/react-chartjs'
import axios from 'axios'
import swal from 'sweetalert'

const Charts = () => {
    const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;
  const [stats, setStats] = useState(0);
     const fetchDashboardStats = async () => {
    try {
      
      const res = await axios.get(`${ROOT_URL}/api/admin/dashboard-stats`);
      if (res.data.success) {
        // console.log("Dashboard Stats:", res.data.data);
        setStats(res.data.data);
      } else {
        swal("Error", res.data.message, "error");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      swal("Error", "Failed to fetch dashboard stats", "error");
    } 
    
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const march = stats.currentMonthAmount || 0;
  // const december = 500000;
  return (
    <CRow>
      <CCol xs={6} >
        <CCard className="mb-4">
          <CCardHeader>Bar Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: [ 'November', 'December', 'January', 'February', 'March'],
                datasets: [
                  {
                    label: 'Amount',
                    backgroundColor: '#f87979',
                    data: [ 32804,78470, 56994, 62894, march],
                  },
                ],
              }}
              labels="months"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Charts
