// Vendor
import { DetectUA } from 'detect-ua';

const device = new DetectUA();

export const { isMobile, isTablet, isDesktop, isiOS, isAndroid, browser } = device;

export const isChrome = typeof browser === 'object' && browser.name === 'Chrome';
export const isFirefox = typeof browser === 'object' && browser.name === 'Firefox';
export const isSafari = typeof browser === 'object' && browser.name === 'Safari';
export const isEdge = typeof browser === 'object' && browser.name === 'Microsoft Edge';
export const isInternetExplorer =
  typeof browser === 'object' && browser.name === 'Internet Explorer';
export const isOpera = typeof browser === 'object' && browser.name === 'Opera';
export const isSamsungBrowser =
  typeof browser === 'object' && browser.name === 'Samsung Internet for Android';
export const isYandexBrowser = typeof browser === 'object' && browser.name === 'Yandex Browser';
export const isUCBrowser = typeof browser === 'object' && browser.name === 'UC Browser';
export const isChromium = typeof browser === 'object' && browser.name === 'Chromium';

/**
 * Device and browser detection
 */
export default {
  isDesktop,
  isMobile,
  isTablet,

  isAndroid,
  isiOS,

  isChrome,
  isChromium,
  isEdge,
  isFirefox,
  isInternetExplorer,
  isOpera,
  isSafari,
  isSamsungBrowser,
  isUCBrowser,
  isYandexBrowser,

  browserName: (typeof browser === 'object' && browser.name) || '',
  browserVersion: (typeof browser === 'object' && browser.version) || '',
};
