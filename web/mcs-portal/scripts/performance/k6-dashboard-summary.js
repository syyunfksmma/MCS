import http from "k6/http";
import { Trend } from "k6/metrics";
import { check, sleep } from "k6";

export const options = {
  vus: Number(__ENV.VUS || 25),
  duration: __ENV.DURATION || "2m",
  thresholds: {
    http_req_duration: ["p(95)<800"],
    "dashboard_summary_duration{range:daily}": ["p(95)<800"],
    "dashboard_summary_duration{range:weekly}": ["p(95)<800"],
    "dashboard_summary_duration{range:monthly}": ["p(95)<800"]
  }
};

const API_BASE_URL = __ENV.BASE_URL || "http://localhost:5229";
const INCLUDE_BREAKDOWN = String(__ENV.INCLUDE_BREAKDOWN ?? "true");

const summaryTrend = new Trend("dashboard_summary_duration", true);

const ranges = ["daily", "weekly", "monthly"];

export default function () {
  for (const range of ranges) {
    const response = http.get(
      `${API_BASE_URL}/api/dashboard/summary?range=${range}&includeBreakdown=${INCLUDE_BREAKDOWN}`,
      {
        headers: {
          Accept: "application/json"
        }
      }
    );

    summaryTrend.add(response.timings.duration, { range });

    check(response, {
      [`${range} status 200`]: (res) => res.status === 200,
      [`${range} has body`]: (res) => Boolean(res.body && res.body.length > 0)
    });

    sleep(0.5);
  }
}
