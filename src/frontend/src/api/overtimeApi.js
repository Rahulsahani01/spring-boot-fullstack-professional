import apiClient from "./apiClient";

export const overtimeApi = {
  // Backend: GET /api/v1/overtime/summary?workerId=&siteId=&from=&to=
  getOvertimeSummary: ({ workerId, siteId, from, to }) =>
    apiClient.get("/v1/overtime/summary", {
      params: { workerId, siteId, from, to },
    }),

  // Backend: POST /api/v1/overtime/settle?from=&to=
  settleOvertime: ({ from, to }) =>
    apiClient.post("/v1/overtime/settle", null, {
      params: { from, to },
    }),
};
