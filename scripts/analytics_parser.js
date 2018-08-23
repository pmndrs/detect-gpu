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
    const amount = renderer.field3;

    return `${amount} - ${name}`;
  });
}

function parseAnalytics(file) {
  return new Promise((resolve, reject) => {
    csv({ noheader: true })
      .fromFile(file)
      .then((data) => {
        const renderers = data.slice(6, data.length - 5); // Remove header information

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

parseAnalytics(path.resolve('./data/analytics.csv')).then((data) => {
  const output = './data/analytics.json';
  const result = JSON.stringify(data, null, 2);

  fs.writeFile(path.resolve(output), result, (error) => {
    if (!error) {
      console.log(`Written file to ${output}`);
    } else {
      console.error(error);
    }
  });
});
