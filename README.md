# Detect GPU

![](http://img.badgesize.io/TimvanScherpenzeel/detect-gpu/master/dist/detect-gpu.min.js.svg?compression=gzip&maxAge=60)
[![npm version](https://badge.fury.io/js/detect-gpu.svg)](https://badge.fury.io/js/detect-gpu)
[![dependencies](https://david-dm.org/timvanscherpenzeel/detect-gpu.svg)](https://david-dm.org/timvanscherpenzeel/detect-gpu)
[![devDependencies](https://david-dm.org/timvanscherpenzeel/detect-gpu/dev-status.svg)](https://david-dm.org/timvanscherpenzeel/detect-gpu#info=devDependencies)

Classify GPU's based on their benchmark score in order to provide an adaptive experience.

## Demo

[Live demo](https://timvanscherpenzeel.github.io/detect-gpu/)

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install detect-gpu
```

## Usage

`detect-gpu` uses benchmarking scores in order to determine what tier should be assigned to the user's GPU. If no `WebGLContext` can be created or the GPU is blacklisted `TIER 0` is assigned. One should provide a HTML fallback page that a user should be redirected to.

By default are all GPU's that have met these preconditions classified as `TIER 1`.

In order to keep up to date with new GPU's coming out `detect-gpu` splits the benchmarking scores in `4 tiers` based on rough estimates of the market share.

By default `detect-gpu` assumes `15%` of the lowest scores to be insufficient to run the experience and is assigned `TIER 0`. `35%` of the GPU's are considered good enough to run the experience and are assigned `TIER 1`. `30%` of the GPU's are considered powerful and are classified as `TIER 2`. The last `20%` of the GPU's are considered to be very powerful and can run the experience with all bells and whistles.

You can tweak these percentages when registering the application as shown below:

```js
DetectGPU.register({
  // [TIER_0, TIER_1, TIER_2, TIER_3]
  BENCHMARK_TIER_PERCENTAGES_MOBILE: [15, 35, 30, 20],
  BENCHMARK_TIER_PERCENTAGES_DESKTOP: [15, 35, 30, 20]
});
```

## Development

```sh
$ npm start

$ npm run serve

$ npm run lint

$ npm run dist

$ npm run deploy

$ npm run update-benchmarks
```

## Licence

My work is released under the [MIT license](https://raw.githubusercontent.com/TimvanScherpenzeel/detect-gpu/master/LICENSE).

`detect-gpu` uses both mobile and desktop benchmarking scores from [https://www.notebookcheck.net/](https://www.notebookcheck.net/).
