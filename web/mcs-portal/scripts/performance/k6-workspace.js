import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 25 },
    { duration: '1m', target: 0 }
  ]
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const admin = http.get(`${BASE_URL}/admin`);
  check(admin, {
    'admin responds 200': res => res.status === 200
  });

  const explorer = http.get(`${BASE_URL}/`);
  check(explorer, {
    'landing responds 200': res => res.status === 200
  });

  sleep(1);
}

