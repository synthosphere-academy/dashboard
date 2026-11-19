// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function Scholarship() {
//   const [scholarshipUsers, setScholarshipUsers] = useState([]);
//   const [filter, setFilter] = useState("All");

//   const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;

//   useEffect(() => {
//     fetchUsers();
//   }, []);


// const fetchUsers = async () => {
//   try {
//     const response = await axios.get(`${ROOT_URL}/api/users/all`);
//     console.log("Fetched users:", response.data.data);
//     const allUsers = response.data.data;

//     // Create map
//     const userMap = {};
//     allUsers.forEach(u => {
//       userMap[u.userId] = u;
//     });

//     // ✅ Same cutoff
//     const cutoffDate = new Date("2026-04-30T23:59:59.999Z");

//     // ✅ Safe parser
//     const parseCustomDate = (dateStr) => {
//       if (!dateStr) return null;

//       try {
//         const [datePart, timePart] = dateStr.split(",");
//         const [day, month, year] = datePart.trim().split("/");

//         const [hour = 0, minute = 0, second = 0] = (timePart || "")
//           .replace(/(am|pm)/i, "")
//           .trim()
//           .split(":")
//           .map(Number);

//         return new Date(year, month - 1, day, hour, minute, second);
//       } catch {
//         return null;
//       }
//     };

//     const result = allUsers.map(user => {

//       const referredUsers = user.referredIds
//         ?.map(id => userMap[id])
//         .filter(Boolean) || [];

//       const activeCount = referredUsers.filter(u => {
//         const courseDetails = u.courseDetails;

//         if (!courseDetails) return false;

//         const packageName = courseDetails.packageName?.toLowerCase() || "";

//         // ✅ Master / Teacher
//         const isMasterOrTeacher =
//           packageName.includes("master") ||
//           packageName.includes("teacher");

//         // ✅ Monthly Subscription (same logic)
//         const purchaseHistory = courseDetails.purchaseHistory || [];
//         const firstPurchase = purchaseHistory[0];
//         const subscriptionPurchase = purchaseHistory
//           .slice(1)
//           .find((p) => p.packageName === "Monthly Subscription");

//         let isValidSubscription = false;

//         if (
//           firstPurchase &&
//           subscriptionPurchase &&
//           firstPurchase.packageName === "Learner Course"
//         ) {
//           const firstDate = parseCustomDate(firstPurchase.date);

//           if (firstDate && firstDate <= cutoffDate) {
//             isValidSubscription = true;
//           }
//         }

//         return isMasterOrTeacher || isValidSubscription;
//       }).length;

//       let scholarship = "None";

//       if (activeCount >= 50) scholarship = "Diamond";
//       else if (activeCount >= 40) scholarship = "Platinum";
//       else if (activeCount >= 30) scholarship = "Gold";
//       else if (activeCount >= 20) scholarship = "Silver";
//       else if (activeCount >= 10) scholarship = "Bronze";

//       return {
//         name: user.name,
//         userId: user.userId,
//         scholarship,
//         activeCount
//       };
//     });

//     setScholarshipUsers(result.filter(u => u.scholarship !== "None"));

//   } catch (error) {
//     console.error("Error fetching users:", error);
//   }
// };

//   // const fetchUsers = async () => {
//   //   try {
//   //     const response = await axios.get(`${ROOT_URL}/api/users/all`);

//   //     const allUsers = response.data.data;

//   //     // Create map
//   //     const userMap = {};
//   //     allUsers.forEach(u => {
//   //       userMap[u.userId] = u;
//   //     });

//   //     const result = allUsers.map(user => {

//   //       const referredUsers = user.referredIds
//   //         ?.map(id => userMap[id])
//   //         .filter(Boolean) || [];

//   //       const activeCount = referredUsers.filter(u => {
//   //         const name = u.courseDetails?.packageName?.toLowerCase() || "";
//   //         return name.includes("master") || name.includes("teacher");
//   //       }).length;

//   //       let scholarship = "None";

//   //       if (activeCount >= 5) scholarship = "Diamond";
//   //       else if (activeCount >= 4) scholarship = "Platinum";
//   //       else if (activeCount >= 3) scholarship = "Gold";
//   //       else if (activeCount >= 2) scholarship = "Silver";
//   //       else if (activeCount >= 1) scholarship = "Bronze";

//   //       return {
//   //         name: user.name,
//   //         userId: user.userId,
//   //         scholarship,
//   //         activeCount
//   //       };
//   //     });

//   //     setScholarshipUsers(result.filter(u => u.scholarship !== "None"));

//   //   } catch (error) {
//   //     console.error("Error fetching users:", error);
//   //   }
//   // };

//   // ✅ Filter Logic
//   const filteredUsers =
//     filter === "All"
//       ? scholarshipUsers
//       : scholarshipUsers.filter(user => user.scholarship === filter);

//   return (
//     <div className="container mt-5">
//       <h3 className="mb-4">Scholarship Users</h3>

//       {/* ✅ Filter Dropdown */}
//       <div className="mb-3">
//         <select
//           className="form-select w-auto"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="All">All scholarship types</option>
//           <option value="Bronze">Bronze</option>
//           <option value="Silver">Silver</option>
//           <option value="Gold">Gold</option>
//           <option value="Platinum">Platinum</option>
//           <option value="Diamond">Diamond</option>
//         </select>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>S/No</th>
//               <th>Name</th>
//               <th>User ID</th>
//               <th>Active Referrals</th>
//               <th>Scholarship</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{user.name}</td>
//                   <td>{user.userId}</td>
//                   <td>{user.activeCount}</td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         user.scholarship === "Diamond"
//                           ? "bg-primary"
//                           : user.scholarship === "Platinum"
//                           ? "bg-info"
//                           : user.scholarship === "Gold"
//                           ? "bg-warning text-dark"
//                           : user.scholarship === "Silver"
//                           ? "bg-danger"
//                           : user.scholarship === "Bronze"
//                           ? "bg-success"
//                           : "bg-light text-dark"
//                       }`}
//                       style={{ fontSize: "15px" }}
//                     >
//                       {user.scholarship}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center">
//                   No Scholarship Users Found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Scholarship;

import React, { useEffect, useState } from "react";
import axios from "axios";

function Scholarship() {
  const [scholarshipUsers, setScholarshipUsers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${ROOT_URL}/api/users/all`);
      const allUsers = response.data.data || [];

      const userMap = {};
      allUsers.forEach((u) => {
        userMap[u.userId] = u;
      });

      const cutoffDate = new Date("2026-04-30T23:59:59.999Z");

      // Parse date: 9/11/2025, 8:55:24 pm
      const parseCustomDate = (dateStr) => {
        if (!dateStr) return null;

        try {
          const [datePart, timePart = ""] = dateStr.split(",");
          const [day, month, year] = datePart.trim().split("/");

          if (!day || !month || !year) return null;

          let [hour = 0, minute = 0, second = 0] = timePart
            .trim()
            .split(":")
            .map((v) => parseInt(v, 10));

          const isPM = /pm/i.test(timePart);
          const isAM = /am/i.test(timePart);

          if (isPM && hour < 12) hour += 12;
          if (isAM && hour === 12) hour = 0;

          const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            hour || 0,
            minute || 0,
            second || 0
          );

          return Number.isNaN(date.getTime()) ? null : date;
        } catch {
          return null;
        }
      };

      // Get qualifying purchase date
      const getEligibleDate = (referredUser) => {
        const courseDetails = referredUser.courseDetails;

        if (!courseDetails) return null;

        const purchaseHistory = courseDetails.purchaseHistory || [];

        // Only completed purchases
        const completedPurchases = purchaseHistory
          .filter((p) => p.status === "completed")
          .map((p) => ({
            ...p,
            parsedDate: parseCustomDate(p.date),
          }))
          .filter((p) => p.parsedDate)
          .sort((a, b) => a.parsedDate - b.parsedDate);

        // Master / Teacher purchase
        const masterTeacherPurchase = completedPurchases.find((p) => {
          const packageName = (p.packageName || "").toLowerCase();

          return (
            packageName.includes("master") ||
            packageName.includes("teacher")
          );
        });

        // Monthly Subscription eligibility
        const firstPurchase = purchaseHistory[0];

        const subscriptionPurchase = completedPurchases.find(
          (p) => p.packageName === "Monthly Subscription"
        );

        let subscriptionDate = null;

        if (
          firstPurchase &&
          firstPurchase.packageName === "Learner Course" &&
          subscriptionPurchase
        ) {
          const firstDate = parseCustomDate(firstPurchase.date);

          if (firstDate && firstDate <= cutoffDate) {
            subscriptionDate = firstDate;
          }
        }

        // Use earliest date on which user became eligible
        const eligibleDates = [
          masterTeacherPurchase?.parsedDate,
          subscriptionDate,
        ].filter(Boolean);

        if (!eligibleDates.length) return null;

        return new Date(
          Math.min(...eligibleDates.map((d) => d.getTime()))
        );
      };

      const result = allUsers.map((user) => {
        const referredUsers =
          user.referredIds
            ?.map((id) => userMap[id])
            .filter(Boolean) || [];

        // Collect eligible direct referrals with dates
        const eligibleReferrals = referredUsers
          .map((referredUser) => ({
            userId: referredUser.userId,
            date: getEligibleDate(referredUser),
          }))
          .filter((ref) => ref.date)
          .sort((a, b) => a.date - b.date);

        const activeCount = eligibleReferrals.length;

        let scholarship = "None";
        let requiredCount = 0;

        if (activeCount >= 50) {
          scholarship = "Diamond";
          requiredCount = 50;
        } else if (activeCount >= 40) {
          scholarship = "Platinum";
          requiredCount = 40;
        } else if (activeCount >= 30) {
          scholarship = "Gold";
          requiredCount = 30;
        } else if (activeCount >= 20) {
          scholarship = "Silver";
          requiredCount = 20;
        } else if (activeCount >= 10) {
          scholarship = "Bronze";
          requiredCount = 10;
        }

        // Date of the referral who completed the current level
        const achievedDate =
          requiredCount > 0
            ? eligibleReferrals[requiredCount - 1].date
            : null;

        return {
          name: user.name,
          userId: user.userId,
          scholarship,
          activeCount,
          achievedDate,
        };
      });

      setScholarshipUsers(
        result.filter((u) => u.scholarship !== "None")
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers =
    filter === "All"
      ? scholarshipUsers
      : scholarshipUsers.filter(
          (user) => user.scholarship === filter
        );

  const formatDate = (date) => {
    if (!date) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getBadgeClass = (scholarship) => {
    switch (scholarship) {
      case "Diamond":
        return "bg-primary";
      case "Platinum":
        return "bg-info";
      case "Gold":
        return "bg-warning text-dark";
      case "Silver":
        return "bg-danger";
      case "Bronze":
        return "bg-success";
      default:
        return "bg-light text-dark";
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Scholarship Users</h3>

      <div className="mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All scholarship types</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Diamond">Diamond</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>S/No</th>
              <th>Name</th>
              <th>User ID</th>
              <th>Active Referrals</th>
              <th>Scholarship</th>
              <th>Achieved Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.userId}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.userId}</td>
                  <td>{user.activeCount}</td>
                  <td>
                    <span
                      className={`badge ${getBadgeClass(
                        user.scholarship
                      )}`}
                      style={{ fontSize: "15px" }}
                    >
                      {user.scholarship}
                    </span>
                  </td>
                  <td>{formatDate(user.achievedDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Scholarship Users Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Scholarship;
