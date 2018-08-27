#!/usr/bin/env node

// Native
const fs = require('fs');
const path = require('path');

// Vendor
const csv = require('csvtojson');

function getRendererData(type, renderers) {
  const data = renderers.filter(renderer => renderer.field2 === type);

  return data.map((renderer) => {
    const name = renderer.field1;
    const amount = renderer.field4;

    return `${amount} - ${name}`;
  });
}

function parseAnalytics(file) {
  return new Promise((resolve, reject) => {
    csv({ noheader: true })
      .fromFile(file)
      .then((data) => {
        // Remove static header and footer information
        const renderers = data.slice(6, data.length - 5);

        const mobileData = getRendererData('mobile', renderers);
        const tabletData = getRendererData('tablet', renderers);
        const desktopData = getRendererData('desktop', renderers);

        resolve({
          mobileData,
          tabletData,
          desktopData,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

parseAnalytics(path.resolve('./data/analytics.csv')).then((result) => {
  const output = './test/renderers.js';
  const data = `

  // Collected using https://unpkg.com/detect-gpu/scripts/analytics_embed.js


        export const RENDERER_DESKTOP = [
          ${result.desktopData.map(entry => `\n\'${entry.replace(',', '')}\'`)}
        ];

        export const RENDERER_TABLET = [
          ${result.tabletData.map(entry => `\n\'${entry.replace(',', '')}\'`)}
        ];

        export const RENDERER_MOBILE = [
          ${result.mobileData.map(entry => `\n\'${entry.replace(',', '')}\'`)}
        ];
      `;

  fs.writeFile(path.resolve(output), data, (error) => {
    if (!error) {
      console.log(`Written file to ${output}`);
    } else {
      console.error(error);
    }
  });
});
