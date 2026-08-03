import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Addproduct = React.lazy(() => import('./views/Addproduct'))
const Addsection = React.lazy(() => import('./views/Addsection'))
const Addchapter = React.lazy(() => import('./views/Addchapter'))
const Pendingkyc = React.lazy(() => import('./components/Blogs/Pendingkyc'))
const Approvedkyc = React.lazy(() => import('./components/Blogs/Approvedkyc'))
const Rejectedkyc = React.lazy(() => import('./components/Blogs/Removedkyc'))
const Editblog = React.lazy(() => import('./components/Blogs/Editblog'))
const Userlist = React.lazy(() => import('./components/Userlist'))
const Viewuserlist = React.lazy(() => import('./components/Viewuserlist'))
const Alluserlist = React.lazy(() => import('./components/Teacher/Alluser'))
const Viewcourse = React.lazy(() => import('./components/Editcourse'))
const Order = React.lazy(() => import('./components/Order/Orders'))
const OnlineOrder = React.lazy(() => import('./components/Order/Onlineorder'))
const Invoice = React.lazy(() => import('./components/Order/Invoice'))
const Invoicelist = React.lazy(() => import('./components/Order/Invoicelist'))
const Adduser = React.lazy(() => import('./components/Adduser'))
const Offlineuser = React.lazy(() => import('./components/Offlineusers'))
const Addteacher = React.lazy(() => import('./components/Teacher/Addteacher'));
const Viewreview = React.lazy(() => import('./components/Reviews/Viewreview'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const Contactus = React.lazy(() => import('./views/Contactus'))

const Widgets = React.lazy(() => import('./views/widgets/WidgetsDropdown'))
const Allreview = React.lazy(() => import('./components/Reviews/Allreview'))
const Allcourses = React.lazy(() => import('./components/Courses/Allcourses'))
const payout = React.lazy(() => import('./components/Payout/payout'))
const Pendinguser = React.lazy(() => import('./components/User/Pendinguser'))
const Edituser = React.lazy(() => import('./components/User/Edituser'))
const Rankusers = React.lazy(()=> import("./components/Rankusers"))
const Scholarship = React.lazy(() => import('./components/Scholarship/Scholarship'))
const MonthlySubscriptionUsers = React.lazy(() => import('./components/User/MonthlySubscriptionUsers'))
const Classictraders = React.lazy(() => import('./components/User/Classictraders'))
// const Depositrequestlist = React.lazy(() => import('./components/P2P/Depositrequestlist'))
// const Alldeposit = React.lazy(() => import('./components/P2P/Alldeposit'))
// const P2pmatching = React.lazy(() => import('./components/P2P/P2pmatching'))
// const Allpaymentverify = React.lazy(() => import('./components/P2P/Allpaymentverify'))
// const Allpaymentdone = React.lazy(() => import('./components/P2P/Allpaymentdone'))
const Supporchat = React.lazy(() => import('./components/Supporchat'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/addproduct', name: 'Add Course', element: Addproduct },
  { path: '/addsection', name: 'Addsection', element: Addsection },
  { path: '/addchapter', name: 'Addchapter', element: Addchapter },
  { path: '/addteacher', name: 'Addteacher', element: Addteacher },
  { path: '/teacher/alluser', name: 'Alluser', element: Alluserlist },
  {path:'/rankusers', name:"AllRankusers" , element:Rankusers},
  { path: '/allreview', name: 'Allreview', element: Allreview},
   {path: '/allcourses', name:'Allcourses' , element: Allcourses},
  { path: '/viewreview/:id', name: 'Viewreview', element: Viewreview},
  { path: '/pendingkyc', name: 'Pendingkyc', element: Pendingkyc },
  { path: '/approvedkyc', name: 'Approvedkyc', element: Approvedkyc },
  { path: '/rejectedkyc', name: 'Rejectedkyc', element: Rejectedkyc},
  {path:'/payout', name:'Payout', element: payout},
  { path: '/editblog/:id', name: 'Editblog', element: Editblog },
  { path: '/userlist', name: 'Userlist', element: Userlist },
  { path: '/editcourse/:id', name: 'Editcourse', element: Viewcourse },
  { path: '/viewuserlist', name: 'Viewuserlist', element: Viewuserlist },
  { path: '/onlineorder', name: 'onlineorder', element: OnlineOrder },
  { path: '/order', name: 'order', element: Order },
  { path: '/invoice', name: 'invoice', element: Invoice },
  { path: '/scholarship', name: 'Scholarship', element: Scholarship },
  { path: '/invoicelist/:id', name: 'invoicelist', element: Invoicelist },
  { path: '/adduser', name: 'All User',element: Adduser },
  { path: '/Offlineuser', name: 'Offlineuser', element: Offlineuser },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/contactus', name: 'Theme', element: Contactus},
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  {path: '/pendinguser', name: 'Pendinguser', element: Pendinguser},
  { path: '/user/edituser/:userId', name: 'Edituser', element: Edituser },
  { path: '/monthly-subscription-users', name: 'Monthly Subscription Users', element: MonthlySubscriptionUsers },
  { path: '/classic-traders', name: 'Classic Traders', element: Classictraders },
 
  { path: '/widgets', name: 'Widgets', element: Widgets },
  // { path: '/depositrequests', name: 'Deposit Requests', element: Depositrequestlist },
  // { path: '/alldeposits', name: 'All Deposits', element: Alldeposit },
  // { path: '/P2pmatching', name: 'P2pmatching', element: P2pmatching },
  // { path: '/allpaymentverify', name: 'All Payment Verify', element: Allpaymentverify },
  // { path: '/allpaymentdone', name: 'All Verified Payments', element: Allpaymentdone },
  { path: '/supportchat', name: 'Support Chat', element: Supporchat }
]
export default routes

