const fs = require('fs');
const urls = [
  "https://icons.duckduckgo.com/ip3/www.tcs.com.ico",
  "https://icons.duckduckgo.com/ip3/hcltech.com.ico",
  "https://icons.duckduckgo.com/ip3/techmahindra.com.ico",
  "https://icons.duckduckgo.com/ip3/deloitte.com.ico"
];

async function check() {
  for (const url of urls) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    console.log(url, 'Size:', buffer.byteLength);
  }
}
check();
