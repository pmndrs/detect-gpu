import { describe, expect, test } from 'vitest';

import { parseIOSVersion } from '../src/internal/deviceInfo';
import fixtures from './fixtures/ios-user-agents.json';

// The contract we test: for any UA in the corpus, our parser must either
// return the same major version OR return undefined when the UA carries no
// token we attempt to parse (in-app browsers, etc.). Returning a *wrong*
// major is the failure mode we care about.

const ALL = fixtures;
const OS_TOKEN = /(?:iPhone|CPU) OS \d+_/;
const VERSION_TOKEN = /Version\/\d+/;

describe('parseIOSVersion (uap-core corpus)', () => {
  test('never returns a wrong major version', () => {
    const wrong = ALL.filter((entry) => {
      const result = parseIOSVersion(entry.ua, true);
      return result !== undefined && result !== entry.iOSMajor;
    });
    expect(wrong).toEqual([]);
  });

  test('extracts a value for the majority of standard browser UAs', () => {
    // "Standard" = UA contains either the "iPhone OS"/"CPU OS" token or
    // "Version/" — i.e. the patterns we explicitly handle. We expect 100%
    // recognition on these; in-app browsers without those tokens are out
    // of scope and verified separately.
    const standard = ALL.filter(
      (entry) => OS_TOKEN.test(entry.ua) || VERSION_TOKEN.test(entry.ua)
    );
    const recognized = standard.filter(
      (entry) => parseIOSVersion(entry.ua, true) === entry.iOSMajor
    );
    expect(recognized.length).toBe(standard.length);
  });

  test('returns undefined for non-iOS context regardless of UA content', () => {
    for (const entry of ALL) {
      expect(parseIOSVersion(entry.ua, false)).toBeUndefined();
    }
  });
});

describe('parseIOSVersion (pre-iOS-7 Safari/iOS mismatch)', () => {
  // iOS 3.2 shipped Safari 4.0.4; iOS 4 shipped Safari 5.0.2. Apple only
  // aligned the Safari marketed version with the iOS major at iOS 7. So
  // "Version/" can't be trusted on pre-iOS-7 UAs — the OS token wins.
  test('trusts "OS 3_2" over "Version/4"', () => {
    const ua =
      'Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B367 Safari/531.21.10';
    expect(parseIOSVersion(ua, true)).toBe(3);
  });
  test('trusts "iPhone OS 4_3_2" over "Version/5"', () => {
    const ua =
      'Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5';
    expect(parseIOSVersion(ua, true)).toBe(4);
  });
});

describe('parseIOSVersion (OS token separator variants)', () => {
  // Canonical form is "iPhone OS 17_2" with underscores between digits, but
  // older and in-app UAs use "." or follow the major with ";" / " " / ")".
  // All of these are real corpus shapes.
  test('accepts "iPhone OS 7.0;" (dot separator, in-app browser)', () => {
    const ua = 'iTube 2.15 (iPhone; iPhone OS 7.0; en_US)';
    expect(parseIOSVersion(ua, true)).toBe(7);
  });
  test('accepts the canonical "iPhone OS 17_2" underscore form', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X)';
    expect(parseIOSVersion(ua, true)).toBe(17);
  });
});

describe('parseIOSVersion (iOS 26 UA freeze)', () => {
  // In iOS 26 Apple froze the legacy "iPhone OS 18_6" token to reduce
  // fingerprinting; the true OS major is exposed only via "Version/N".
  // SEE: https://webkit.org/blog/ (UA reduction work) and ua-parser-js
  // commit history for the iOS 26 fixture that first surfaced this.
  test('ignores the frozen "iPhone OS 18_6" token and reads Version/26', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
    expect(parseIOSVersion(ua, true)).toBe(26);
  });
});
