import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AttendancePage from "./pages/Attendance/AttendancePage";
import ActiveWorkersPage from "./pages/ActiveWorkers/ActiveWorkersPage";
import AttendanceHistoryPage from "./pages/AttendanceHistory/AttendanceHistoryPage";
import OvertimeSummaryPage from "./pages/OvertimeSummary/OvertimeSummaryPage";
import SettlementPage from "./pages/Settlement/SettlementPage";

import "./App.css";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/active-workers" element={<ActiveWorkersPage />} />
        <Route path="/attendance-history" element={<AttendanceHistoryPage />} />
        <Route path="/overtime" element={<OvertimeSummaryPage />} />
        <Route path="/settlement" element={<SettlementPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
