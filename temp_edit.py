from pathlib import Path
path = Path("tests/k6/chunk_upload.js")
text = path.read_text()
text = text.replace('import { Trend } from "k6/metrics";', 'import { Trend, Rate } from "k6/metrics";', 1)
needle = 'const metaTrend = new Trend("meta_generation_wait_ms");'
meta_insert = '\r\n'.join([
    'const metaTrend = new Trend("meta_generation_wait_ms");',
    'const metaPollElapsedTrend = new Trend("meta_poll_elapsed_ms");',
    'const metaPollRequestTrend = new Trend("meta_poll_request_ms");',
    'const metaPollStatusTrend = new Trend("meta_poll_status_code");',
    'const metaPollMatchRate = new Rate("meta_poll_match_rate");',
    'const metaPollSuccessRate = new Rate("meta_poll_success_rate");'
])
text = text.replace(needle, meta_insert, 1)
start = text.index('  let metaLatency = null;')
end = text.index('  check({ metaLatency }', start)
old_block = text[start:end]
new_block = '\r\n'.join([
    '  let metaLatency = null;',
    '  if (completeRes.status === 200) {',
    '    for (let attempt = 0; attempt < META_POLL_LIMIT; attempt += 1) {',
    '      const metaRes = http.get(`${BASE_URL}/api/routings/${ROUTING_ID}/files`, {',
    '        timeout: "30s"',
    '      });',
    '',
    '      metaPollSuccessRate.add(metaRes.status === 200);',
    '      metaPollRequestTrend.add(metaRes.timings.duration);',
    '      metaPollStatusTrend.add(metaRes.status);',
    '      metaPollElapsedTrend.add(Date.now() - completeStart);',
    '',
    '      const ok = metaRes.status === 200;',
    '      if (ok && matchesFile(metaRes.json("files") || metaRes.json("Files"), fileName)) {',
    '        metaLatency = Date.now() - completeStart;',
    '        metaTrend.add(metaLatency);',
    '        metaPollMatchRate.add(1);',
    '        break;',
    '      }',
    '',
    '      metaPollMatchRate.add(0);',
    '      sleep(META_POLL_INTERVAL);',
    '    }',
    '  }'
])
text = text.replace(old_block, new_block, 1)
text = text.replace('\\r\\n', '\r\n')
path.write_text(text)
