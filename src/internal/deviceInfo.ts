import { isSSR } from './ssr';

// iOS 26+ freezes the legacy "iPhone OS 18_6" token as a fingerprinting
// countermeasure, so we prefer the Safari "Version/" token whenever it
// disagrees upward — except on pre-iOS-7 UAs where Version/ tracked Safari
// (then 4 or 5), not iOS. Returns undefined for in-app browsers that expose
// the version only in proprietary tokens (FBSV, etc.).
//
// `isAppleMobile` must be true only for iPhone/iPod/iPad UAs (including the
// iPadOS-as-MacIntel masquerade). On those UAs Safari's Version/ tracks the
// iOS/iPadOS major; on real macOS it tracks the macOS major and would yield
// a wrong number — the gate is the only thing keeping that out.
export function parseIOSVersion(
  userAgent: string,
  isAppleMobile: boolean
): number | undefined {
  if (!isAppleMobile) return undefined;
  const osMatch = /(?:iPhone|CPU) OS (\d+)[._ ;)]/.exec(userAgent);
  const versionMatch = /Version\/(\d+)/.exec(userAgent);
  const os = osMatch ? parseInt(osMatch[1], 10) : undefined;
  const version = versionMatch ? parseInt(versionMatch[1], 10) : undefined;
  if (os !== undefined && version !== undefined) {
    return os >= 7 && version > os ? version : os;
  }
  return os ?? version;
}

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

  const iOSVersion = parseIOSVersion(userAgent, isIOS || isIpad);

  return {
    isIpad,
    isMobile: isAndroid || isIOS || isIpad,
    isSafari12: /Version\/12.+Safari/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    iOSVersion,
  };
})();
