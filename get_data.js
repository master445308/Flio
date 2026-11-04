const fs = require('fs');

async function run() {
  const r = await fetch('https://benten-sepia.vercel.app/assets/index-CrjgHqQO.js');
  const js = await r.text();
  
  const startIdx = js.indexOf('S=[{id:`prod-1`');
  // find end of array S
  const endIdx = js.indexOf('],K=[', startIdx);
  console.log('startIdx:', startIdx, 'endIdx:', endIdx);
  if (startIdx !== -1) {
    const slice = js.slice(startIdx, startIdx + 20000);
    // Find the closing bracket followed by next variable
    const closeIdx = slice.indexOf('}],');
    console.log('Close found, snippet:', slice.slice(closeIdx - 100, closeIdx + 100));
    fs.writeFileSync('products_raw.txt', slice.slice(0, closeIdx + 2));
  }

  // Also extract orders & promos
  const promoIdx = js.indexOf('ee=[');
  if (promoIdx !== -1) {
    fs.writeFileSync('promos_raw.txt', js.slice(promoIdx, promoIdx + 2000));
  }
  
  const ordersIdx = js.indexOf('K=[');
  if (ordersIdx !== -1) {
    fs.writeFileSync('orders_raw.txt', js.slice(ordersIdx, ordersIdx + 4000));
  }
}
run();
