import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Scholarship() {
  const [scholarshipUsers, setScholarshipUsers] = useState([]);
  const [filter, setFilter] = useState("All");

  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;

  useEffect(() => {
    fetchUsers();
  }, []);


const fetchUsers = async () => {
  try {
    const response = await axios.get(`${ROOT_URL}/api/users/all`);

    const allUsers = response.data.data;

    // Create map
    const userMap = {};
    allUsers.forEach(u => {
      userMap[u.userId] = u;
    });

    // ✅ Same cutoff
    const cutoffDate = new Date("2026-04-30T23:59:59.999Z");

    // ✅ Safe parser
    const parseCustomDate = (dateStr) => {
      if (!dateStr) return null;

      try {
        const [datePart, timePart] = dateStr.split(",");
        const [day, month, year] = datePart.trim().split("/");

        const [hour = 0, minute = 0, second = 0] = (timePart || "")
          .replace(/(am|pm)/i, "")
          .trim()
          .split(":")
          .map(Number);

        return new Date(year, month - 1, day, hour, minute, second);
      } catch {
        return null;
      }
    };

    const result = allUsers.map(user => {

      const referredUsers = user.referredIds
        ?.map(id => userMap[id])
        .filter(Boolean) || [];

      const activeCount = referredUsers.filter(u => {
        const courseDetails = u.courseDetails;

        if (!courseDetails) return false;

        const packageName = courseDetails.packageName?.toLowerCase() || "";

        // ✅ Master / Teacher
        const isMasterOrTeacher =
          packageName.includes("master") ||
          packageName.includes("teacher");

        // ✅ Monthly Subscription (same logic)
        const purchaseHistory = courseDetails.purchaseHistory || [];
        const firstPurchase = purchaseHistory[0];
        const subscriptionPurchase = purchaseHistory
          .slice(1)
          .find((p) => p.packageName === "Monthly Subscription");

        let isValidSubscription = false;

        if (
          firstPurchase &&
          subscriptionPurchase &&
          firstPurchase.packageName === "Learner Course"
        ) {
          const firstDate = parseCustomDate(firstPurchase.date);

          if (firstDate && firstDate <= cutoffDate) {
            isValidSubscription = true;
          }
        }

        return isMasterOrTeacher || isValidSubscription;
      }).length;

      let scholarship = "None";

      if (activeCount >= 50) scholarship = "Diamond";
      else if (activeCount >= 40) scholarship = "Platinum";
      else if (activeCount >= 30) scholarship = "Gold";
      else if (activeCount >= 20) scholarship = "Silver";
      else if (activeCount >= 10) scholarship = "Bronze";

      return {
        name: user.name,
        userId: user.userId,
        scholarship,
        activeCount
      };
    });

    setScholarshipUsers(result.filter(u => u.scholarship !== "None"));

  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(`${ROOT_URL}/api/users/all`);

  //     const allUsers = response.data.data;

  //     // Create map
  //     const userMap = {};
  //     allUsers.forEach(u => {
  //       userMap[u.userId] = u;
  //     });

  //     const result = allUsers.map(user => {

  //       const referredUsers = user.referredIds
  //         ?.map(id => userMap[id])
  //         .filter(Boolean) || [];

  //       const activeCount = referredUsers.filter(u => {
  //         const name = u.courseDetails?.packageName?.toLowerCase() || "";
  //         return name.includes("master") || name.includes("teacher");
  //       }).length;

  //       let scholarship = "None";

  //       if (activeCount >= 5) scholarship = "Diamond";
  //       else if (activeCount >= 4) scholarship = "Platinum";
  //       else if (activeCount >= 3) scholarship = "Gold";
  //       else if (activeCount >= 2) scholarship = "Silver";
  //       else if (activeCount >= 1) scholarship = "Bronze";

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

  // ✅ Filter Logic
  const filteredUsers =
    filter === "All"
      ? scholarshipUsers
      : scholarshipUsers.filter(user => user.scholarship === filter);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Scholarship Users</h3>

      {/* ✅ Filter Dropdown */}
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
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.userId}</td>
                  <td>{user.activeCount}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.scholarship === "Diamond"
                          ? "bg-primary"
                          : user.scholarship === "Platinum"
                          ? "bg-info"
                          : user.scholarship === "Gold"
                          ? "bg-warning text-dark"
                          : user.scholarship === "Silver"
                          ? "bg-danger"
                          : user.scholarship === "Bronze"
                          ? "bg-success"
                          : "bg-light text-dark"
                      }`}
                      style={{ fontSize: "15px" }}
                    >
                      {user.scholarship}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
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