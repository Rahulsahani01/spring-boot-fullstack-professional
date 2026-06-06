import apiClient from "./apiClient";

export const attendanceApi = {
  clockIn: (data) => apiClient.post("/v1/attendance/clock-in", data),
  clockOut: (data) => apiClient.post("/v1/attendance/clock-out", data),
  getActiveWorkers: () => apiClient.get("/v1/attendance/active-workers"),
  getHistory: () => apiClient.get("/v1/attendance/history"),
};

export const workerApi = {
  addWorker: (data) => apiClient.post("/v1/workers", data),
  getAllWorkers: () => apiClient.get("/v1/workers"),
};

export const siteApi = {
  addSite: (data) => apiClient.post("/v1/sites", data),
  getAllSites: () => apiClient.get("/v1/sites"),
};
