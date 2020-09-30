import puppeteer from 'puppeteer';
import fs from 'fs';

import { getEntryVersionNumber } from '../src/internal/getEntryVersionNumber';

const URL = `https://gfxbench.com/result.jsp?benchmark=gfx50&test=680&text-filter=&order=median&ff-lmobile=true&ff-smobile=true&os-Android_gl=true&os-Android_vulkan=true&os-iOS_gl=true&os-iOS_metal=true&os-Linux_gl=true&os-OS_X_gl=true&os-OS_X_metal=true&os-Windows_dx=true&os-Windows_dx12=true&os-Windows_gl=true&os-Windows_vulkan=true&pu-dGPU=true&pu-iGPU=true&pu-GPU=true&arch-ARM=true&arch-unknown=true&arch-x86=true&base=device`;

const types = [
  'adreno',
  'apple',
  'mali-t',
  'mali',
  'nvidia',
  'powervr',
  'intel',
  'amd',
  'radeon',
  'nvidia',
  'geforce',
];

const groupBy = (xs: any[], key: number | string) =>
  xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

const getTypes = ([renderer]: [string, number, boolean]) =>
  types.filter((type) => renderer.includes(type));
const hasType = (model: [string, number, boolean]) =>
  getTypes(model).length > 0;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  await Promise.all([true, false].map(exportBenchmarks));
  await browser.close();

  async function exportBenchmarks(mobile: boolean) {
    const getOutputFilename = (type: string) =>
      `${mobile ? 'm' : 'd'}-${type}.json`;
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });
    let models: [string, number, boolean][] = await page.evaluate(() =>
      // @ts-ignore
      window.gpuName
        // @ts-ignore
        .map((index) => window.gpuNameLookup[index])
        // @ts-ignore
        .map((name, index) => [
          name.toLowerCase().replace(/™ |nvidia corporation |apple inc\. |advanced micro devices, inc\. | (series|graphics|edition)$|\s*\([^\)]+(\)|$)/g, ''),
          // @ts-ignore
          Math.round(Number(window.fpses[index].replace(/[^0-9.]+/g, ''))),
          // @ts-ignore
          window.formFactorLookup[formFactor[index]].includes('mobile'),
        ])
    );
    models = Object.values(
      groupBy(models, 0) as { [k: string]: [string, number, boolean][] }
    )
      .map((val) => val[0])
      .filter(([, , mobileModel]) => mobileModel === mobile)
      .filter(hasType);
    return Promise.all([
      ...types.map((type) => {
        const typeModels = models
          .filter((model) => getTypes(model).includes(type))
          .map(([model, fps]): [string, string, number, 1 | 0] => [
            model,
            getEntryVersionNumber(model),
            Math.round((fps / models[0][1]) * 100),
            blacklistedModels.find((blacklistedModel) =>
              model.includes(blacklistedModel)
            )
              ? 1
              : 0,
          ]);
        if (typeModels.length === 0) return;
        return outputFile(getOutputFilename(type), typeModels);
      }),
      outputFile(getOutputFilename('all'), models),
    ]);
  }
})().catch((err) => {
  throw err;
});

const outputFile = async (name: string, content: any) => {
  const file = `./src/data/${name}`;
  const data = JSON.stringify(content, null, 2);
  await fs.promises.writeFile(file, data);
  console.log(`Exported ${file}`);
};

// GPU BLACKLIST
// https://wiki.mozilla.org/Blocklisting/Blocked_Graphics_Drivers
// https://www.khronos.org/webgl/wiki/BlacklistsAndWhitelists
// https://chromium.googlesource.com/chromium/src/+/master/gpu/config/software_rendering_list.json
// https://chromium.googlesource.com/chromium/src/+/master/gpu/config/gpu_driver_bug_list.json
const blacklistedModels = [
  'radeon hd 6970m',
  'radeon hd 6770m',
  'radeon hd 6490m',
  'radeon hd 6630m',
  'radeon hd 6750m',
  'radeon hd 5750',
  'radeon hd 5670',
  'radeon hd 4850',
  'radeon hd 4870',
  'radeon hd 4670',
  'geforce 9400m',
  'geforce 320m',
  'geforce 330m',
  'geforce gt 130',
  'geforce gt 120',
  'geforce gtx 285',
  'geforce 8600',
  'geforce 9600m',
  'geforce 9400m',
  'geforce 8800 gs',
  'geforce 8800 gt',
  'quadro fx 5',
  'quadro fx 4',
  'radeon hd 2600',
  'radeon hd 2400',
  'radeon r9 200',
  'mali-4',
  'mali-3',
  'mali-2',
  'google swiftshader',
  'sgx543',
  'legacy',
  'sgx 543',
];
