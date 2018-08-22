# Detect GPU

![](http://img.badgesize.io/TimvanScherpenzeel/detect-gpu/master/dist/detect-gpu.min.js.svg?compression=gzip&maxAge=60)
[![npm version](https://badge.fury.io/js/detect-gpu.svg)](https://badge.fury.io/js/detect-gpu)
[![dependencies](https://david-dm.org/timvanscherpenzeel/detect-gpu.svg)](https://david-dm.org/timvanscherpenzeel/detect-gpu)
[![devDependencies](https://david-dm.org/timvanscherpenzeel/detect-gpu/dev-status.svg)](https://david-dm.org/timvanscherpenzeel/detect-gpu#info=devDependencies)

Classify GPU's based on their benchmark score in order to provide an adaptive experience.

## Stability and reporting issues

In the current state `detect-gpu` should be considered to be experimental and should not yet be used in production. There are many edge cases and I've only been able to test it on a small range of devices. It is very likely that some GPU's are not reported correctly. This is most likely due to entries in the benchmark test that are very similar to each other, use strange versioning schemes or the reported GPU does not expose its name and version correctly.

If you are interested in helping out and improving the stability of the library feel encouraged to [open an issue](https://github.com/TimvanScherpenzeel/detect-gpu/issues/new) with the following content:

- The reported GPU tier as reported by [detect-gpu](https://timvanscherpenzeel.github.io/detect-gpu/)
- A copy of the full output of [detect-features](https://timvanscherpenzeel.github.io/detect-features/), this will include enough information for me to determine what could be wrong.

I'm hoping that through community effort we can create a more stable version of the library. Without your input (e.g. sharing ideas, PR's and making issues) it will be very difficult to improve the library. I simply only have access to a small range of devices and GPU's myself.

## Demo

[Live demo](https://timvanscherpenzeel.github.io/detect-gpu/)

## Installation

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
 $ npm install detect-gpu
```

## Usage

`detect-gpu` uses benchmarking scores in order to determine what tier should be assigned to the user's GPU. If no `WebGLContext` can be created or the GPU is blacklisted `TIER_0` is assigned. One should provide a HTML fallback page that a user should be redirected to.

By default are all GPU's that have met these preconditions classified as `TIER_1`. Using user agent detection a distinction is made between mobile (mobile and tablet) prefixed using `GPU_MOBILE_` and desktop devices prefixed with `GPU_DESKTOP_`. Both are then followed by `TIER_N` where `N` is the tier number.

In order to keep up to date with new GPU's coming out `detect-gpu` splits the benchmarking scores in `4 tiers` based on rough estimates of the market share.

By default `detect-gpu` assumes `15%` of the lowest scores to be insufficient to run the experience and is assigned `TIER_0`. `35%` of the GPU's are considered good enough to run the experience and are assigned `TIER_1`. `30%` of the GPU's are considered powerful and are classified as `TIER_2`. The last `20%` of the GPU's are considered to be very powerful, are assigned `TIER_3`, and can run the experience with all bells and whistles.

You can tweak these percentages when registering the application as shown below:

```js
const GPUTier = DetectGPU.register({
  verbose: true, // enable logging to the console
  benchmarkTierPercentagesMobile: [15, 35, 30, 20], // [TIER_0, TIER_1, TIER_2, TIER_3]
  benchmarkTierPercentagesDesktop: [15, 35, 30, 20] // [TIER_0, TIER_1, TIER_2, TIER_3]
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
