const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.MOCK_HEALTH_PORT ? Number(process.env.MOCK_HEALTH_PORT) : 7800;
const logDir = path.resolve(process.cwd(), 'logs');
const logFile = path.join(logDir, 'mock-health-server.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(line) {
  const message = `[${new Date().toISOString()}] ${line}`;
  fs.appendFileSync(logFile, message + '\n');
  console.log(message);
}

const serviceStatus = {
  apiA: { status: 'OK', latencyMs: 120 },
  apiB: { status: 'OK', latencyMs: 140 },
  web: { status: 'OK', latencyMs: 95 }
};

app.get('/health/:service', (req, res, next) => {
  try {
    const serviceKey = req.params.service;
    if (!serviceKey) {
      const error = new Error('service parameter is required');
      error.statusCode = 400;
      throw error;
    }

    const desiredStatus = req.query.status;
    if (desiredStatus) {
      const latency = Number(req.query.latencyMs ?? 0);
      serviceStatus[serviceKey] = {
        status: desiredStatus,
        latencyMs: Number.isNaN(latency) ? null : latency
      };
      log(`Status override: ${serviceKey} -> ${desiredStatus} (${latency} ms)`);
    }

    const health = serviceStatus[serviceKey] || { status: 'UNKNOWN', latencyMs: null };
    const response = {
      service: serviceKey,
      status: health.status,
      latencyMs: health.latencyMs,
      timestamp: new Date().toISOString()
    };
    log(`Health check: ${serviceKey} => ${health.status} (${health.latencyMs ?? 'n/a'} ms)`);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const status = err.statusCode ?? 500;
  log(`ERROR ${status} ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(status).json({
    error: err.message,
    status,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  log(`mock-health-server listening on ${port}`);
});