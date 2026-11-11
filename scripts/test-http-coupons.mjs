const tests = [
  { name: 'SURAJ300 uppercase', code: 'SURAJ300', subtotal: 2000, expectedStatus: 200, expectedDiscount: 1000 },
  { name: 'suraj300 lowercase', code: 'suraj300', subtotal: 2000, expectedStatus: 200, expectedDiscount: 1000 },
  { name: 'suraj300 with spaces', code: '  SURAJ300  ', subtotal: 2000, expectedStatus: 200, expectedDiscount: 1000 },
  { name: 'BUILD10 valid', code: 'BUILD10', subtotal: 1500, expectedStatus: 200, expectedDiscount: 150 },
  { name: 'BUILD10 below min order', code: 'BUILD10', subtotal: 500, expectedStatus: 400 },
  { name: 'GENZ15 valid', code: 'GENZ15', subtotal: 2500, expectedStatus: 200, expectedDiscount: 375 },
  { name: 'FREESHIP valid', code: 'FREESHIP', subtotal: 1000, expectedStatus: 200, expectedDiscount: 100 },
  { name: 'INVALIDCODE', code: 'INVALIDCODE', subtotal: 2000, expectedStatus: 404 }
];

async function run() {
  console.log('\n--- TESTING LIVE HTTP /api/checkout/validate-coupon ---');
  let passed = 0;
  for (const t of tests) {
    try {
      const res = await fetch('http://localhost:3000/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: t.code, subtotal: t.subtotal })
      });
      const data = await res.json();
      if (res.status === t.expectedStatus) {
        if (t.expectedDiscount !== undefined) {
          if (data.discount === t.expectedDiscount) {
            console.log(`✓ [PASS] ${t.name}: discount=₹${data.discount} (${data.message})`);
            passed++;
          } else {
            console.log(`✗ [FAIL] ${t.name}: expected discount ${t.expectedDiscount}, got ${data.discount}`);
          }
        } else {
          console.log(`✓ [PASS] ${t.name}: correctly returned ${res.status} (${data.error})`);
          passed++;
        }
      } else {
        console.log(`✗ [FAIL] ${t.name}: expected HTTP ${t.expectedStatus}, got ${res.status} (${data.error || data.message})`);
      }
    } catch (e) {
      console.log(`✗ [ERROR] ${t.name}:`, e.message);
    }
  }
  console.log(`\nTOTAL HTTP API TESTS: ${tests.length} | PASSED: ${passed}`);
  console.log('------------------------------------------------------\n');
}

run();

