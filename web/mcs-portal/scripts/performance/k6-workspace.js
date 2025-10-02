import http from "k6/http";
import { check, sleep } from "k6";

const profile = (__ENV.K6_PROFILE || "").toLowerCase();
const baseUrl = __ENV.K6_BASE_URL || __ENV.BASE_URL || "http://localhost:3000";
const summaryPath = __ENV.K6_SUMMARY_PATH || "artifacts/perf/k6-smoke-latest.json";

function resolveVus(defaultValue) {
  const candidate = Number(__ENV.K6_VUS || __ENV.VUS);
  return Number.isFinite(candidate) && candidate > 0 ? candidate : defaultValue;
}

function resolveDuration(defaultValue) {
  const candidate = __ENV.K6_DURATION || __ENV.DURATION;
  return candidate && typeof candidate === "string" ? candidate : defaultValue;
}

function resolveScenario() {
  if (profile === "smoke") {
    return {
      executor: "constant-vus",
      vus: resolveVus(5),
      duration: resolveDuration("5m"),
      gracefulStop: "5s"
    };
  }

  return {
    executor: "constant-vus",
    vus: resolveVus(20),
    duration: resolveDuration("4m"),
    gracefulStop: "10s"
  };
}

export const options = {
  scenarios: {
    workspace_browse: resolveScenario()
  },
  thresholds: {
    http_req_duration: ["p(95)<1200"],
    checks: ["rate>0.95"]
  },
  tags: {
    profile: profile || "default"
  }
};

const ADMIN_PATH = "/admin";
const LANDING_PATH = "/";

export default function workspaceSmoke() {
  const adminResponse = http.get(`${baseUrl}${ADMIN_PATH}`);
  check(adminResponse, {
    "admin responds 200": (res) => res.status === 200
  });

  const landingResponse = http.get(`${baseUrl}${LANDING_PATH}`);
  check(landingResponse, {
    "landing responds 200": (res) => res.status === 200
  });

  sleep(1);
}

export function handleSummary(data) {
  if (profile !== "smoke") {
    return {};
  }

  return {
    [summaryPath]: JSON.stringify(data, null, 2)
  };
}
