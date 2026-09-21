import * as si from 'react-icons/si';

const keys = Object.keys(si).map(k => k.toLowerCase());
const names = ['tcs', 'infosys', 'wipro', 'hcl', 'techmahindra', 'cognizant', 'accenture', 'ibm', 'microsoft', 'google', 'amazon', 'deloitte'];

names.forEach(name => {
  const found = keys.find(k => k.includes(name));
  if (found) {
    console.log(`${name} -> ${found}`);
  } else {
    console.log(`${name} -> NOT FOUND`);
  }
});
