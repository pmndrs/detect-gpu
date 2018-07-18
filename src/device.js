export default class Device {
  constructor(userAgent = null) {
    this.setUserAgent(userAgent);
  }

  _isIE(v) {
    return RegExp(`msie${!isNaN(v) ? `\\s${v}` : ''}`, 'i').test(navigator.userAgent);
  }

  match(needle) {
    if (!this.matchCache[needle]) {
      this.matchCache[needle] = this.userAgent.indexOf(needle) > -1;
    }

    return this.matchCache[needle];
  }

  getUserAgent() {
    return typeof document !== 'undefined' ? window.navigator.userAgent : '';
  }

  setUserAgent(userAgent = null) {
    this.userAgent = userAgent || this.userAgent || this.getUserAgent();

    if (this.userAgent) {
      this.matchCache = {};
      this.userAgent = this.userAgent.toLowerCase();
    }
  }

  get touchDevice() {
    if (!this.matchCache.touchDevice) {
      if (typeof document !== 'undefined') {
        this.matchCache.touchDevice = !!(navigator && navigator.userAgent)
          && navigator.userAgent.match(
            /(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/,
          );
      }
    }

    return this.matchCache.touchDevice || false;
  }

  get touch() {
    if (!this.matchCache.touch) {
      if (typeof document !== 'undefined') {
        this.matchCache.touch = 'ontouchstart' in window
          || (window.DocumentTouch && document instanceof DocumentTouch)
          || (navigator && navigator.msMaxTouchPoints > 0)
          || (navigator && navigator.maxTouchPoints);
      }
    }

    return this.matchCache.touch || false;
  }

  get ios() {
    return this.iphone || this.ipod || this.ipad;
  }

  get iphone() {
    return !this.windows && this.match('iphone');
  }

  get ipod() {
    return this.match('ipod');
  }

  get ipad() {
    return this.match('ipad');
  }

  get android() {
    return !this.windows && this.match('android');
  }

  get androidPhone() {
    return this.android && this.match('mobile');
  }

  get androidTablet() {
    return this.android && !this.match('mobile');
  }

  get blackberry() {
    return this.match('blackberry') || this.match('bb10') || this.match('rim');
  }

  get blackberryPhone() {
    return this.blackberry && !this.match('tablet');
  }

  get blackberryTablet() {
    return this.blackberry && this.match('tablet');
  }

  get windows() {
    return this.match('windows');
  }

  get ie9() {
    if (!this.matchCache.ie9) {
      if (typeof document !== 'undefined') {
        this.matchCache.ie9 = this.windows && this._isIE(10);
      }
    }

    return this.matchCache.ie9 || false;
  }

  get ie10() {
    if (!this.matchCache.ie10) {
      if (typeof document !== 'undefined') {
        this.matchCache.ie10 = this.windows && this._isIE(10);
      }
    }

    return this.matchCache.ie10 || false;
  }

  get windowsPhone() {
    return this.windows && this.match('phone');
  }

  get windowsTablet() {
    return this.windows && (this.match('touch') && !this.windowsPhone);
  }

  get fxos() {
    return (this.match('(mobile;') || this.match('(tablet;')) && this.match('; rv:');
  }

  get fxosPhone() {
    return this.fxos && this.match('mobile');
  }

  get fxosTablet() {
    return this.fxos && this.match('tablet');
  }

  get meego() {
    return this.match('meego');
  }

  get cordova() {
    return window.cordova && location.protocol === 'file:';
  }

  get nodeWebkit() {
    return typeof window.process === 'object';
  }

  get mobile() {
    return (
      this.androidPhone
      || this.iphone
      || this.ipod
      || this.windowsPhone
      || this.blackberryPhone
      || this.fxosPhone
      || this.meego
    );
  }

  get tablet() {
    return (
      this.ipad
      || this.androidTablet
      || this.blackberryTablet
      || this.windowsTablet
      || this.fxosTablet
    );
  }

  get desktop() {
    return !this.tablet && !this.mobile;
  }
}
