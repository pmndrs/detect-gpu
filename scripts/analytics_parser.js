#!/usr/bin/env node

// @ts-check

// Native
const fs = require('fs');
const path = require('path');

// Vendor
const csv = require('csvtojson');
const moment = require('moment');

function getRendererData(type, renderers) {
  const data = renderers.filter((renderer) => renderer.field2 === type);

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
        const dateEntry = data.slice(3, 4);
        const dateRange = dateEntry[0].field1.replace('# ', '').split('-');
        const timeSpan = moment.duration(moment(dateRange[1]).diff(moment(dateRange[0]))).asDays();
        const entries = data.slice(6, data.length - (timeSpan + 4));

        const mobileData = getRendererData('mobile', entries);
        const tabletData = getRendererData('tablet', entries);
        const desktopData = getRendererData('desktop', entries);

        resolve({
          mobileData,
          tabletData,
          desktopData,
        });
      })
      // @ts-ignore
      .catch((error) => {
        reject(error);
      });
  });
}

parseAnalytics(path.resolve('./data/analytics.csv')).then((result) => {
  const output = './test/data.ts';
  const data = `
        export const RENDERER_DESKTOP = [
          ${result.desktopData.map((entry) => `\n\'${entry.replace(',', '')}\'`)}
        ];

        export const RENDERER_TABLET = [
          ${result.tabletData.map((entry) => `\n\'${entry.replace(',', '')}\'`)}
        ];

        export const RENDERER_MOBILE = [
          ${result.mobileData.map((entry) => `\n\'${entry.replace(',', '')}\'`)}
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
