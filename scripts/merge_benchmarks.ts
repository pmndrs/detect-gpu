/* eslint-disable @typescript-eslint/no-explicit-any */

// Vendor
import fs from 'fs';

// Data
import desktopAdreno from '../benchmarks/d-adreno.json';
import desktopAmd from '../benchmarks/d-amd.json';
import desktopApple from '../benchmarks/d-apple.json';
import desktopGeforce from '../benchmarks/d-geforce.json';
import desktopIntel from '../benchmarks/d-intel.json';
import desktopNvidia from '../benchmarks/d-nvidia.json';
import desktopRadeon from '../benchmarks/d-radeon.json';
import mobileAdreno from '../benchmarks/m-adreno.json';
import mobileApple from '../benchmarks/m-apple.json';
import mobileIntel from '../benchmarks/m-intel.json';
import mobileMalit from '../benchmarks/m-mali-t.json';
import mobileMali from '../benchmarks/m-mali.json';
import mobilePowerVR from '../benchmarks/m-powervr.json';

const benchmarks = {
  'd-adreno.json': desktopAdreno,
  'd-amd.json': desktopAmd,
  'd-apple.json': desktopApple,
  'd-geforce.json': desktopGeforce,
  'd-intel.json': desktopIntel,
  'd-nvidia.json': desktopNvidia,
  'd-radeon.json': desktopRadeon,
  'm-adreno.json': mobileAdreno,
  'm-apple.json': mobileApple,
  'm-intel.json': mobileIntel,
  'm-mali-t.json': mobileMalit,
  'm-mali.json': mobileMali,
  'm-powervr.json': mobilePowerVR,
};

const outputFile = async (name: string, content: any) => {
  const file = `./benchmarks/${name}`;
  const data = JSON.stringify(content);
  await fs.promises.writeFile(file, data);
  console.log(`Exported ${file}`);
};

(async () => {
  return outputFile('all.json', benchmarks);
})().catch((err) => {
  throw err;
});
