import { isSSR } from './ssr';

export const deviceInfo = (() => {
  if (isSSR) {
    return;
  }

  const { userAgent, platform, maxTouchPoints } = window.navigator;

  const isIOS = /(iphone|ipod|ipad)/i.test(userAgent);

  // Workaround for ipadOS, force detection as tablet
  // SEE: https://github.com/lancedikson/bowser/issues/329
  // SEE: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
  const isIpad =
    platform === 'iPad' ||
    // @ts-expect-error window.MSStream is non standard
    (platform === 'MacIntel' && maxTouchPoints > 0 && !window.MSStream);

  const isAndroid = /android/i.test(userAgent);

  return {
    isIpad,
    isMobile: isAndroid || isIOS || isIpad,
    isSafari12: /Version\/12.+Safari/.test(userAgent),
  };
})();
