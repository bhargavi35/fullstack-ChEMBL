// import React, { useEffect, useState, useRef } from "react";
// import { fetchCompounds } from "../api"; // ✅ Fetch API data
// import { Bar, Pie, Scatter } from "react-chartjs-2";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   Grid,
// } from "@mui/material";

// const CompoundChart = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Create refs to store chart instances
//   const barChartRef = useRef(null);
//   const pieChartRef = useRef(null);
//   const scatterChartRef = useRef(null);

//   useEffect(() => {
//     fetchCompounds({}).then((res) => {
//       setData(res);
//       setLoading(false);
//     });

//     // Cleanup function to destroy charts before re-rendering
//     return () => {
//       if (barChartRef.current) barChartRef.current.destroy();
//       if (pieChartRef.current) pieChartRef.current.destroy();
//       if (scatterChartRef.current) scatterChartRef.current.destroy();
//     };
//   }, []);

//   if (loading)
//     return (
//       <CircularProgress sx={{ display: "block", margin: "auto", mt: 3 }} />
//     );

//   if (!data || data.length === 0) {
//     return (
//       <Typography sx={{ textAlign: "center", mt: 3 }}>
//         No Data Available...
//       </Typography>
//     );
//   }

//   const mwData = {
//     labels: data.map((c) => c.pref_name),
//     datasets: [
//       {
//         label: "Molecular Weight",
//         data: data.map((c) => c.full_mwt),
//         backgroundColor: "#4CAF50",
//       },
//     ],
//   };

//   const pieData = {
//     labels: ["Small Molecule", "Biologic"],
//     datasets: [
//       {
//         label: "Molecule Type",
//         data: [
//           data.filter((c) => c.molecule_type === "Small molecule").length,
//           data.filter((c) => c.molecule_type === "Biologic").length,
//         ],
//         backgroundColor: ["#2196F3", "#FF9800"],
//       },
//     ],
//   };

//   const scatterData = {
//     datasets: [
//       {
//         label: "MW vs LogP",
//         data: data.map((c) => ({
//           x: c.full_mwt,
//           y: c.alogp,
//         })),
//         backgroundColor: "#E91E63",
//       },
//     ],
//   };

//   return (
//     <Box sx={{ maxWidth: 900, margin: "auto", textAlign: "center", p: 3 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
//         Compound Data Visualization
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Molecular Weight Distribution */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Molecular Weight Distribution
//               </Typography>
//               <Bar ref={barChartRef} data={mwData} />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Molecule Type Distribution */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Molecule Type Distribution
//               </Typography>
//               <Pie ref={pieChartRef} data={pieData} />
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Scatter Plot: MW vs LogP */}
//         <Grid item xs={12}>
//           <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 MW vs LogP Scatter Plot
//               </Typography>
//               <Scatter ref={scatterChartRef} data={scatterData} />
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default CompoundChart;

import React, { useState, useEffect } from "react";
import { Pie, Bar, Scatter } from "react-chartjs-2";
import { io } from "socket.io-client";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";

// ✅ Register Required Chart Elements
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

// ✅ Connect to WebSocket Server
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

const CompoundChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#3f51b5", "#ff5722", "#4caf50", "#ffc107"],
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [histogramData, setHistogramData] = useState(null);
  const [boxPlotData, setBoxPlotData] = useState(null);
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket Server");
    });

    socket.on("chartUpdate", (data) => {
      console.log("📊 Received Data from WebSocket:", data);
      setChartData({
        labels: data.map((c) => c.molecule_type),
        datasets: [
          {
            data: data.map((c) => c.count),
            backgroundColor: ["#3f51b5", "#ff5722", "#4caf50", "#ffc107"],
          },
        ],
      });

      // 🔹 Histogram Data: LogP Distribution
      setHistogramData({
        labels: data.map((c) => c.alogp),
        datasets: [
          {
            label: "LogP Distribution",
            data: data.map((c) => c.count),
            backgroundColor: "#f44336",
          },
        ],
      });

      // 🔹 Box Plot Data: HBD & HBA Variability
      setBoxPlotData({
        labels: ["HBD", "HBA"],
        datasets: [
          {
            label: "Hydrogen Bond Donors",
            data: data.map((c) => c.hbd),
            backgroundColor: "#FF9800",
          },
          {
            label: "Hydrogen Bond Acceptors",
            data: data.map((c) => c.hba),
            backgroundColor: "#3f51b5",
          },
        ],
      });

      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    return () => {
      socket.off("chartUpdate"); // ✅ Cleanup WebSocket on unmount
    };
  }, []);

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        📊 Compound Data Visualization
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {/* 📌 Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  🔬 Molecule Type Distribution
                </Typography>
                <Pie data={chartData} />
              </CardContent>
            </Card>
          </Grid>

          {/* 📌 Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  ⚖️ Molecular Weight Distribution
                </Typography>
                <Bar data={chartData} />
              </CardContent>
            </Card>
          </Grid>

          {/* 📌 Scatter Plot */}
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📈 MW vs LogP Relationship
                </Typography>
                <Scatter data={chartData} />
              </CardContent>
            </Card>
          </Grid>

          {/* 📌 Histogram: LogP Distribution */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📊 LogP Distribution (Histogram)
                </Typography>
                {histogramData ? (
                  <Bar data={histogramData} />
                ) : (
                  <CircularProgress />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 📌 Box Plot: HBD & HBA Variability */}
          <Grid item xs={12} md={8}>
            <Card sx={{ boxShadow: 3, borderRadius: 3, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📦 Hydrogen Bond Donors & Acceptors (Box Plot)
                </Typography>
                {boxPlotData ? (
                  <Bar data={boxPlotData} />
                ) : (
                  <CircularProgress />
                )}
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="body2" sx={{ color: "gray" }}>
        Data updates every 5 seconds via WebSockets.
      </Typography>
    </Box>
  );
};

export default CompoundChart;
