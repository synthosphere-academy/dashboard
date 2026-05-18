/* eslint-disable prettier/prettiesweetalertr */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import swal from 'sweetalert'

import {
  CCardFooter,
  CCardBody,
  CCardHeader,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import Charts from '../charts/Charts'

const Dashboard = () => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL
  const [courseCount, setCourseCount] = useState({})
  useEffect(() => {
    const fetchUserPurchases = async () => {
      try {
        const res = await axios.get(`${ROOT_URL}/api/users/all`)

        const users = res.data.data // API returns array directly
        console.log(users)
        const countMap = {}

        // users.forEach((user) => {
        //   const packageName = user?.courseDetails?.packageName;

        //   if (packageName) {
        //     countMap[packageName] = (countMap[packageName] || 0) + 1;
        //   }
        // });

        users.forEach((user) => {
          const purchases = user?.courseDetails?.purchaseHistory

          if (purchases && purchases.length > 0) {
            purchases.forEach((purchase) => {
              const pkg = purchase.packageName

              if (pkg) {
                countMap[pkg] = (countMap[pkg] || 0) + 1
              }
            })
          }
        })

        setCourseCount(countMap)

        setCourseCount(countMap)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUserPurchases()
  }, [])

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <Charts />
      <CCardHeader>
        <h5 className="text-center mb-2">All Packages</h5>
      </CCardHeader>
      <CCardBody>
        <CTable responsive="sm" color="dark">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" className="text-center">
                Course name
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                GST
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Actual Price
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Course price
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" className="text-center">
                Purchased Users
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow active>
              <CTableDataCell className="text-center">Learner Course</CTableDataCell>

              <CTableDataCell className="text-center">270/-</CTableDataCell>
              <CTableDataCell className="text-center">1500/-</CTableDataCell>

              <CTableDataCell className="text-center">1770/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Learner Course'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Master Course</CTableDataCell>
              <CTableDataCell className="text-center">540/-</CTableDataCell>
              <CTableDataCell className="text-center">3000/-</CTableDataCell>
              <CTableDataCell className="text-center">3540/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Master Course'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Pro Master Course</CTableDataCell>
              <CTableDataCell className="text-center">1080/-</CTableDataCell>
              <CTableDataCell className="text-center">6000/-</CTableDataCell>
              <CTableDataCell className="text-center">7080/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Pro Master Course'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Teacher Course</CTableDataCell>
              <CTableDataCell className="text-center">1800/-</CTableDataCell>
              <CTableDataCell className="text-center">10000/-</CTableDataCell>

              <CTableDataCell className="text-center">11800/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Teacher Course'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Pro Teacher Course</CTableDataCell>
              <CTableDataCell className="text-center">9000/-</CTableDataCell>
              <CTableDataCell className="text-center">50000/-</CTableDataCell>
              <CTableDataCell className="text-center">59000/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Pro Teacher Course'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Monthly Subscription</CTableDataCell>
              <CTableDataCell className="text-center">144/-</CTableDataCell>
              <CTableDataCell className="text-center">800/-</CTableDataCell>
              <CTableDataCell className="text-center">944/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Monthly Subscription'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Premium Monthly Subscription</CTableDataCell>
              <CTableDataCell className="text-center">288/-</CTableDataCell>
              <CTableDataCell className="text-center">1600/-</CTableDataCell>
              <CTableDataCell className="text-center">1888/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Premium Monthly Subscription'] || 0}
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">Super Premium Monthly Subscription</CTableDataCell>
              <CTableDataCell className="text-center">450/-</CTableDataCell>
              <CTableDataCell className="text-center">2500/-</CTableDataCell>
              <CTableDataCell className="text-center">2950/-</CTableDataCell>
              <CTableDataCell className="text-center">
                {courseCount['Super Premium Monthly Subscription'] || 0}
              </CTableDataCell>
            </CTableRow>
            {/* {
              productdata.map((product) => {
                return <CTableRow active key={product._id} >
                  <CTableDataCell id='courseid'>{product._id}</CTableDataCell>
                    <CTableDataCell>{product.course_name}</CTableDataCell>
                    
                    <CTableDataCell>{product.total_video}</CTableDataCell>
                    <CTableDataCell>{product.teacher_name}</CTableDataCell>
                    
               
                    <CTableDataCell>{product.course_price}</CTableDataCell>
                    <CTableDataCell><img width={100} height={100} src={product.image}/></CTableDataCell>
                    <CTableDataCell className='col-1'>
                            <div className='d-flex'>
                            <Link to={`/editcourse/${product._id}`} className='mt-1'><i className="fa fa-edit ms-2 mt-1 editicon"></i></Link>
                            <button className="btn" onClick={()=>confirmDelete(product._id)}><i className="fa fa-trash-o editicon"></i></button>
                         
                            </div>
                            
                        </CTableDataCell>

                </CTableRow>
              })
             } */}
          </CTableBody>
        </CTable>
      </CCardBody>

      <CCardFooter></CCardFooter>
    </>
  )
}

export default Dashboard
