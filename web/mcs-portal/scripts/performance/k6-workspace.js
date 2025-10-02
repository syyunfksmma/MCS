import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    workspace_browse: {
      executor: "constant-vus",
      vus: Number(__ENV.VUS || 20),
      duration: __ENV.DURATION || "4m",
      gracefulStop: "10s"
    }
  },
  thresholds: {
    http_req_duration: ["p(95)<1200"],
    checks: ["rate>0.95"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const ADMIN_PATH = "/admin";
const LANDING_PATH = "/";

export default function workspaceSmoke() {
  const adminResponse = http.get(BASE_URL + ADMIN_PATH);
  check(adminResponse, {
    "admin responds 200": (res) => res.status === 200
  });

  const landingResponse = http.get(BASE_URL + LANDING_PATH);
  check(landingResponse, {
    "landing responds 200": (res) => res.status === 200
  });

  sleep(1);
}
