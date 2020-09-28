#!/usr/bin/env node

// @ts-check

// Native
const fs = require('fs');

// Vendor
const fetch = require('node-fetch');
const JSSoup = require('jssoup').default;

// Mobile
const BENCHMARK_MOBILE_URL =
  'https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&professional=2&showClassDescription=1&deskornote=3&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1';

// Desktop
const BENCHMARK_DESKTOP_URL =
  'https://www.notebookcheck.net/Mobile-Graphics-Cards-Benchmark-List.844.0.html?type=&sort=&showClassDescription=1&deskornote=4&perfrating=1&or=0&showBars=1&3dmark13_ice_gpu=1&3dmark13_cloud_gpu=1&3dmark13_fire_gpu=1&3dmark11_gpu=1&gpu_fullname=1&architecture=1&pixelshaders=1&vertexshaders=1&corespeed=1&boostspeed=1&memoryspeed=1&memorybus=1&memorytype=1&directx=1';

function collectBenchmark(url) {
  return new Promise((resolve, reject) =>
    // @ts-ignore
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        // @ts-ignore
        const soup = new JSSoup(html.replace('<!DOCTYPE html>', ''));
        const table = soup.find('table');
        const inputs = table.findAll('input');

        const benchmark = inputs
          .map((input) => {
            const score = input.previousElement.text.replace(' ', '').replace('*', '');
            let name = '';

            input.previousElement.contents.forEach((row) => {
              if (row.nextElement.nextElement.text) {
                name = row.nextElement.nextElement.text
                  .replace(' (Desktop)', '')
                  .replace(' (Laptop)', '');
              }
            });

            if (score && name) {
              return `${score} - ${name}`;
            } else {
              return;
            }
          })
          .filter(Boolean);

        resolve(benchmark);
      })
      .catch((error) => {
        reject(new Error(error.message));
      })
  );
}

Promise.all([collectBenchmark(BENCHMARK_DESKTOP_URL), collectBenchmark(BENCHMARK_MOBILE_URL)]).then(
  (result) => {
    const output = './src/__generated__/GPUBenchmark.ts';
    const data = `

// !! AUTO-GENERATED FILE - DO NOT EDIT !!

// Scraped from https://www.notebookcheck.net/
// Mobile GPU benchmark: ${BENCHMARK_MOBILE_URL}
// Desktop GPU benchmark: ${BENCHMARK_DESKTOP_URL}


      export const GPU_BENCHMARK_SCORE_DESKTOP = [
        ${result[0].reverse().map((entry) => `\n\'${entry}\'`)}
      ];

      export const GPU_BENCHMARK_SCORE_MOBILE = [
        ${result[1].reverse().map((entry) => `\n\'${entry}\'`)}
      ];
    `;

    fs.writeFile(output, data, (error) => {
      if (!error) {
        console.log(`Written file to ${output}`);
      } else {
        console.error(error);
      }
    });
  }
);
