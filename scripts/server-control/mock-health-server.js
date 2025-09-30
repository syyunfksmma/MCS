const express = require('express');
const app = express();
const port = 7800;

const serviceStatus = {
  apiA: { status: 'OK', latencyMs: 120 },
  apiB: { status: 'OK', latencyMs: 140 },
  web: { status: 'OK', latencyMs: 95 }
};

app.get('/health/:service', (req, res) => {
  const serviceKey = req.params.service;
  const desiredStatus = req.query.status;
  if (desiredStatus) {
    serviceStatus[serviceKey] = {
      status: desiredStatus,
      latencyMs: Number(req.query.latencyMs ?? 0)
    };
  }
  const health = serviceStatus[serviceKey] || { status: 'UNKNOWN', latencyMs: null };
  res.json({
    service: serviceKey,
    status: health.status,
    latencyMs: health.latencyMs,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] mock-health-server listening on ${port}`);
});