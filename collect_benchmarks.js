#!/usr/bin/env node

const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

// Mobile
const BENCHMARK_MOBILE_URL = 'https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&professional=2&showClassDescription=1&deskornote=3&archive=1&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1';

// Desktop
const BENCHMARK_DESKTOP_URL = 'https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&showClassDescription=1&deskornote=4&archive=1&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1';

function collectBenchmarks() {
  fetch(BENCHMARK_MOBILE_URL)
    .then(response => response.text())
    .then((html) => {
      const rawTableRows = html.match(/<tr[\s\S]*?<\/tr>/g);
      rawTableRows.forEach((entry) => {
        const tableRow = parse(entry);
        console.log(tableRow.childNodes);
      });
      //   const tableRows = parse(rawTableRows);

      //   console.log(tableRows);
    })
    .catch(error => new Error(error));
}

collectBenchmarks();
