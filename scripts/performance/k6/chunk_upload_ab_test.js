import http from "k6/http";
import { check, Trend } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5229";
const ROUTING_ID = __ENV.ROUTING_ID || "routing_gt310001";
const CHUNK_SIZES = (__ENV.CHUNK_SIZES || "262144,524288,1048576")
  .split(',')
  .map((value) => Number(value.trim()))
  .filter(Boolean);

const uploadTrend = new Trend("chunk_upload_complete_ms");

export const options = {
  scenarios: {
    sequential: {
      executor: "per-vu-iterations",
      vus: CHUNK_SIZES.length,
      iterations: 1,
      maxDuration: "10m"
    }
  }
};

export function setup() {
  return CHUNK_SIZES;
}

export default function (chunkSizes) {
  const index = __ITER;
  const chunkSize = chunkSizes[index];
  const start = Date.now();
  const res = http.post(`${BASE_URL}/api/chunk-upload`, {
    routingId: ROUTING_ID,
    chunkSize
  });
  const elapsed = Date.now() - start;
  uploadTrend.add(elapsed, { chunkSize });

  check(res, {
    'status is 200 or 202': (r) => r.status === 200 || r.status === 202
  });
}
