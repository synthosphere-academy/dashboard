/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'

import {
    CTable,
    CTableBody, 
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
  import axios from 'axios';
  const Offlineusers = () => {
    const [student , setStudent] = useState([]);
    const [payment,setpayment] = useState([]);
    useEffect(() =>{
        axios.get('http://localhost:3000/api/auth/getofflineuser')
        .then(student => setStudent(student.data.data))
        .catch(err => console.log(err))
       
    }, []);
  //   useEffect(() =>{
  //     axios.get('http://localhost:3000/api/auth/getpayment')
  //     .then(payment => setpayment(payment.data.data))
  //     .catch(err => console.log(err))
     
  // }, []);
    return (
        <>
        <div className='fw-bold'>
        <h3>All Offline Students:-</h3></div> 
        <CTable responsive="sm" color="dark">
        <CTableHead align="middle">
          <CTableRow  >
          <CTableHeaderCell scope="col" className='col-2'>order_id</CTableHeaderCell>
            <CTableHeaderCell scope="col" className='col-2' >Student name</CTableHeaderCell>
            <CTableHeaderCell scope="col" className='col-2'>Course name </CTableHeaderCell>
            <CTableHeaderCell scope="col" className='col-2'>Student phno</CTableHeaderCell>
            <CTableHeaderCell scope="col" className='col-1'>Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col" className='col-2'>Payment_id</CTableHeaderCell>
            
          
            <CTableHeaderCell scope="col" className='col-1'>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody align="middle">
        {
              student.map((user,index) => {
                return  <CTableRow active key={index}>
                <CTableHeaderCell scope="col" className='col-2'>order_id</CTableHeaderCell>
        
                <CTableDataCell className='col-2'>{user.fullname}</CTableDataCell>
                <CTableDataCell className='col-2'>{user.course}</CTableDataCell>
                <CTableDataCell className='col-2'>{user.phoneno}</CTableDataCell>
                        <CTableDataCell className='col-1'>{user.amount}</CTableDataCell>
                        <CTableHeaderCell scope="col" className='col-2'>Payment_id</CTableHeaderCell>
                        <CTableDataCell>
                          <a><i className="fa fa-edit ms-2 editicon"></i></a> 
                         </CTableDataCell>
                        </CTableRow>
              })
            }
        </CTableBody>
      </CTable>
        </>
    )

  }
  export default Offlineusers