import apiClient from "./apiClient";

export const attendanceApi = {
  clockIn: (data) => apiClient.post("/v1/attendance/clock-in", data),
  clockOut: (data) => apiClient.post("/v1/attendance/clock-out", data),
  getActiveWorkers: () => apiClient.get("/v1/attendance/active-workers"),
};
