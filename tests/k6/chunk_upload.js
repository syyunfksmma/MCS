import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";
import { randomBytes, sha256 } from "k6/crypto";

const META_SLA_MS = Number(__ENV.META_SLA_MS || 1000);

export const options = {
  scenarios: {
    chunk_upload: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "10s", target: 5 },
        { duration: "20s", target: 10 },
        { duration: "10s", target: 0 }
      ],
      gracefulStop: "5s"
    }
  },
  thresholds: {
    http_req_duration: ["p(95)<3500"],
    chunk_upload_session_ms: ["p(95)<2000"],
    chunk_upload_chunk_ms: ["p(95)<2000"],
    chunk_upload_complete_ms: ["p(95)<" + META_SLA_MS],
    meta_generation_wait_ms: ["p(95)<" + META_SLA_MS],
    chunk_upload_iteration_ms: ["p(95)<5000"]
  },
  insecureSkipTLSVerify: true
};

const BASE_URL = __ENV.BASE_URL || "https://localhost:7443";
const ROUTING_ID = __ENV.ROUTING_ID || "b00a77af-8584-46db-9da6-5a3845709237";
const CHUNK_SIZE = Number(__ENV.CHUNK_SIZE || 256 * 1024);
const CHUNK_COUNT = Number(__ENV.CHUNK_COUNT || 4);
const FILE_TYPE = __ENV.FILE_TYPE || "nc";
const UPLOADED_BY = __ENV.UPLOADED_BY || "k6-perf-test";
const META_POLL_LIMIT = Number(__ENV.META_POLL_LIMIT || 10);
const META_POLL_INTERVAL = Number(__ENV.META_POLL_INTERVAL || 200) / 1000; // seconds

const sessionTrend = new Trend("chunk_upload_session_ms");
const chunkTrend = new Trend("chunk_upload_chunk_ms");
const completeTrend = new Trend("chunk_upload_complete_ms");
const iterationTrend = new Trend("chunk_upload_iteration_ms");
const metaTrend = new Trend("meta_generation_wait_ms");

function matchesFile(files, targetName) {
  if (!files || !Array.isArray(files)) {
    return false;
  }
  return files.some(file => {
    const name = file.fileName || file.FileName;
    return typeof name === "string" && name === targetName;
  });
}

export default function () {
  const totalBytes = CHUNK_SIZE * CHUNK_COUNT;
  const payload = randomBytes(totalBytes);
  const checksum = sha256(payload, "hex");
  const fileName = `k6-chunk-${Date.now()}-${__VU}-${__ITER}.bin`;

  const iterationStart = Date.now();

  const startBody = JSON.stringify({
    fileName,
    fileType: FILE_TYPE,
    totalSizeBytes: totalBytes,
    chunkSizeBytes: CHUNK_SIZE,
    uploadedBy: UPLOADED_BY
  });

  const startRes = http.post(
    `${BASE_URL}/api/routings/${ROUTING_ID}/files/chunks/start`,
    startBody,
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: "60s"
    }
  );

  sessionTrend.add(startRes.timings.duration);

  check(startRes, {
    "start status 200": r => r.status === 200,
    "start has sessionId": r => r.json("sessionId") !== undefined
  });

  const sessionId = startRes.json("sessionId");

  for (let index = 0; index < CHUNK_COUNT; index += 1) {
    const begin = index * CHUNK_SIZE;
    const end = Math.min(begin + CHUNK_SIZE, payload.byteLength);
    const chunkBuffer = payload.slice(begin, end);

    const chunkRes = http.put(
      `${BASE_URL}/api/routings/${ROUTING_ID}/files/chunks/${sessionId}`,
      chunkBuffer,
      {
        headers: {
          "Content-Type": "application/octet-stream",
          "X-Chunk-Index": String(index)
        },
        timeout: "60s"
      }
    );

    chunkTrend.add(chunkRes.timings.duration);

    check(chunkRes, {
      "chunk status 204": r => r.status === 204
    });
  }

  const completeBody = JSON.stringify({
    checksum,
    isPrimary: false
  });

  const completeStart = Date.now();
  const completeRes = http.post(
    `${BASE_URL}/api/routings/${ROUTING_ID}/files/chunks/${sessionId}/complete`,
    completeBody,
    {
      headers: {
        "Content-Type": "application/json"
      },
      timeout: "60s"
    }
  );

  completeTrend.add(completeRes.timings.duration);

  check(completeRes, {
    "complete status 200": r => r.status === 200,
    "complete returns meta": r => {
      const body = r.json();
      if (!body) {
        return false;
      }
      return body.routingId !== undefined || body.RoutingId !== undefined;
    }
  });

  let metaLatency = null;
  if (completeRes.status === 200) {
    for (let attempt = 0; attempt < META_POLL_LIMIT; attempt += 1) {
      const metaRes = http.get(`${BASE_URL}/api/routings/${ROUTING_ID}/files`, {
        timeout: "30s"
      });

      const ok = metaRes.status === 200;
      if (ok && matchesFile(metaRes.json("files") || metaRes.json("Files"), fileName)) {
        metaLatency = Date.now() - completeStart;
        metaTrend.add(metaLatency);
        break;
      }

      sleep(META_POLL_INTERVAL);
    }
  }

  check({ metaLatency }, {
    "meta write within sla": data => data.metaLatency !== null && data.metaLatency <= META_SLA_MS
  });

  iterationTrend.add(Date.now() - iterationStart);

  if (__VU === 1 && __ITER === 0) {
    console.log(JSON.stringify({
      sessionId,
      fileName,
      completeDuration: completeRes.timings.duration,
      metaLatency
    }));
  }
}
