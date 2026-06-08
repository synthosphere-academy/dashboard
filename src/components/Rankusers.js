/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const tableData = [
  { no: 1, name: "Class 1", minTeam: 0, minDirect: 3, minPoint: 1, maxPoint: 5000 },
  { no: 2, name: "Class 2", minTeam: 50, minDirect: 10, minPoint: 5001, maxPoint: 15000 },
  { no: 3, name: "Class 3", minTeam: 100, minDirect: 15, minPoint: 15001, maxPoint: 50000 },
  { no: 4, name: "Class 4", minTeam: 200, minDirect: 20, minPoint: 50001, maxPoint: 100000 },
  { no: 5, name: "Class 5", minTeam: 500, minDirect: 25, minPoint: 100001, maxPoint: 300000 },
  { no: 6, name: "Class 6", minTeam: 1000, minDirect: 30, minPoint: 300001, maxPoint: 600000 },
  { no: 7, name: "Class 7", minTeam: 2000, minDirect: 35, minPoint: 600001, maxPoint: 1200000 },
  { no: 8, name: "Class 8", minTeam: 5000, minDirect: 40, minPoint: 1200001, maxPoint: 2500000 },
  { no: 9, name: "Class 9", minTeam: 10000, minDirect: 45, minPoint: 2500001, maxPoint: 5000000 },
  { no: 10, name: "Class 10", minTeam: 20000, minDirect: 50, minPoint: 5000001, maxPoint: 10000000 },
  { no: 11, name: "H.S.", minTeam: 40000, minDirect: 60, minPoint: 10000001, maxPoint: 25000000 },
  { no: 12, name: "Graduate", minTeam: 80000, minDirect: 80, minPoint: 25000001, maxPoint: 50000000 },
  { no: 13, name: "Post Graduate", minTeam: 100000, minDirect: 100, minPoint: 50000001, maxPoint: 100000000 },
  { no: 14, name: "PhD", minTeam: 150000, minDirect: 150, minPoint: 100000001, maxPoint: 250000000 },
];

const getUserRank = (totalTeam, directTeam, points) => {
  let achievedRank = "No Rank";

  for (let i = 0; i < tableData.length; i++) {
    const rank = tableData[i];

    if (points >= rank.minPoint) {
      if (totalTeam >= rank.minTeam && directTeam >= rank.minDirect) {
        achievedRank = rank.name;
      } else break;
    } else break;
  }

  return achievedRank;
};

const Rankusers = () => {
  const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;
  const [filter, setFilter] = useState("pending"); 

  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const [allRanks, setAllRanks] = useState([]);
  const [search, setSearch] = useState("");
const [rankFilter, setRankFilter] = useState("");

  // 🚀 Fetch all saved ranks
  const fetchAllRanks = async () => {
    try {
      const res = await axios.get(`${ROOT_URL}/api/rank/all`);
      if (res.data.success) {
        setAllRanks(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching ranks:", error);
    }
  };

  // 🚀 Approve Rank API
  const handlePaid = async (userId, rankName) => {
    try {
      const res = await axios.put(`${ROOT_URL}/api/rank/approve-rank`, {
        userId,
        rankName,
      });

      if (res.data.success) {
        swal("Success!", `Approved: ${rankName}`, "success");
        fetchAllRanks(); // refresh table
      } else {
        swal("Error!", res.data.message, "error");
      }
    } catch (error) {
      swal("Error!", "API Error", "error");
      console.error(error);
    }
  };

  // 🚀 Process ranks on page load
  const processRanksForAllUsers = async () => {
    setProcessing(true);
    setStatus("Fetching all users...");

    try {
      const res = await axios.get(`${ROOT_URL}/api/referral/team-summary/all`);
      if (!res.data.success) return;

      const users = res.data.data;
      setStatus(`Processing ${users.length} users...`);

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const achievedRank = getUserRank(
          user.totalDownlineCount,
          user.directReferrals,
          user.totalPoints
        );

        if (achievedRank === "No Rank") continue;

        await axios.post(`${ROOT_URL}/api/rank/save-rank`, {
          userId: user.userId,
          name: user.name,
          rankName: achievedRank,
          totalTeam: user.totalDownlineCount,
          directTeam: user.directReferrals,
          points: user.totalPoints,
        });
      }

      setStatus("Completed");
      await fetchAllRanks();
    } catch (err) {
      console.error(err);
      swal("Error!", "Failed to process ranks", "error");
      setStatus("Error occurred");
    }

    setProcessing(false);
  };

  useEffect(() => {
    processRanksForAllUsers();
  }, []);

  return (
    <div className="p-2">
   
<div className="d-flex gap-5 mb-3 flex-wrap">

  {/* Status Filter */}
 
    <div>
       <label>Status</label>
  <select
    className="form-select"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    
  >
   
    <option value="pending" >Pending</option>
    <option value="approved">Approved</option>
   
  </select>
  </div>
  {/* Search */}
  <div>
    <label>Search</label>
    <input
      type="text"
      className="form-control"
      placeholder="Search User ID / Name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {/* Rank Filter */}
  <div>
    <label>Rank</label>
    <select
      className="form-select"
      value={rankFilter}
      onChange={(e) => setRankFilter(e.target.value)}
    >
      <option value="">All Ranks</option>

      {tableData.map((item) => (
        <option key={item.no} value={item.name}>
          {item.name}
        </option>
      ))}
    </select>
  </div>

</div>

      <h4 className="mt-4">All Ranks</h4>
      
      <div className="table-responsive">
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-light text-center">
          <tr>
            <th>S/N</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Total Team</th>
            <th>Direct Team</th>
            <th>Points</th>
            <th> Rank</th>
            <th >{filter === "pending" ? "Action" : "Status"} </th>
          </tr>
        </thead>

        <tbody className="text-center">
  {/* {allRanks.length > 0 ? (
    allRanks
      .filter(rank => rank.rewards.some(r => r.status === "pending")) // ONLY pending rows
      .map((rank, index) => {
        const pendingRewards = rank.rewards.filter(r => r.status === "pending");
        const pendingRankNames = pendingRewards.map(r => r.rankName); */}
        
  {allRanks.length > 0 ? (
    allRanks
  .filter((rank) => {
    // Status Filter
    const statusMatch =
      filter === "pending"
        ? rank.rewards.some((r) => r.status === "pending")
        : rank.rewards.some((r) => r.status === "approved");

    // Search Filter
    const searchMatch =
      rank.name?.toLowerCase().includes(search.toLowerCase()) ||
      rank.userId?.toLowerCase().includes(search.toLowerCase());

    // Rank Filter
    const rankMatch =
      rankFilter === ""
        ? true
        : rank.rewards.some((r) => r.rankName === rankFilter);

    return statusMatch && searchMatch && rankMatch;
  })
      .map((rank, index) => {
        const visibleRewards =
          filter === "pending"
            ? rank.rewards.filter((r) => r.status === "pending")
            : filter === "approved"
            ? rank.rewards.filter((r) => r.status === "approved")
            : rank.rewards;

        const rewardNames = visibleRewards.map((r) => r.rankName);
                  return (
          <tr key={rank._id}>
            <td>{index + 1}</td>
            <td>{rank.userId}</td>
            <td>{rank.name}</td>
            <td>{rank.totalTeam}</td>
            <td>{rank.directTeam}</td>
            <td>{rank.points}</td>

            <td className="fw-bold">
              {rewardNames.length ? rewardNames.join(", ") : "None"}
            </td>

            <td>
              {filter === "pending" ? (
                <button
                  className="btn btn-success"
                  disabled={rewardNames.length === 0}
                  onClick={() =>
                    handlePaid(rank.userId, rewardNames[0])
                  }
                >
                  Paid
                </button>
              ) : (
                <span className=" fw-bold">Approved</span>
              )}
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="8">No records found.</td>
    </tr>
  )}
</tbody>


        {/* return (
          <tr key={rank._id}>
            <td>{index + 1}</td>
            <td>{rank.userId}</td>
            <td>{rank.name}</td>

            <td>{rank.totalTeam}</td>
            <td>{rank.directTeam}</td>
            <td>{rank.points}</td>

            <td className="fw-bold">
              {pendingRankNames.join(", ")}
            </td>

            <td>
              <button
                className="btn btn-success"
                disabled={pendingRankNames.length === 0}
                onClick={() => handlePaid(rank.userId, pendingRankNames[0])}
              >
                Paid
              </button>
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="8">No pending rank records found.</td>
    </tr>
  )}
</tbody> */}

      </table>
      </div>
    </div>
  );
};

export default Rankusers;
