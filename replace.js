const fs = require('fs');
const file = 'd:/Mern files/N-Pay Clients/Kavithaecom/npay-backend/src/infrastructure/repositories/chit/productRepository.js';
let content = fs.readFileSync(file, 'utf8');
let lines = content.split('\n');

// Find the start and end of getBestSeller
const startIdx = lines.findIndex(line => line.includes('async getBestSeller(limit, customerId = null, cursor = null) {'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('throw new Error("Database error retrieving best seller products");')) {
    endIdx = i + 2; // include } and }
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = fs.readFileSync('d:/Mern files/N-Pay Clients/Kavithaecom/npay-backend/replacement.txt', 'utf8');
  lines.splice(startIdx, endIdx - startIdx + 1, replacement);
  fs.writeFileSync(file, lines.join('\n'));
  console.log('Successfully replaced getBestSeller');
} else {
  console.log('Could not find bounds: startIdx = ' + startIdx + ', endIdx = ' + endIdx);
}
