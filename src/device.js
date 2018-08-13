export default class Device {
  constructor(userAgent = null) {
    this.setUserAgent(userAgent);
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

  get windowsPhone() {
    return this.windows && this.match('phone');
  }

  get windowsTablet() {
    return this.windows && (this.match('touch') && !this.windowsPhone);
  }

  get firefoxOS() {
    return (this.match('(mobile;') || this.match('(tablet;')) && this.match('; rv:');
  }

  get firefoxOSPhone() {
    return this.firefoxOS && this.match('mobile');
  }

  get firefoxOSTablet() {
    return this.firefoxOS && this.match('tablet');
  }

  get mobile() {
    return (
      this.androidPhone
      || this.iphone
      || this.ipod
      || this.windowsPhone
      || this.blackberryPhone
      || this.firefoxOSPhone
    );
  }

  get tablet() {
    return (
      this.ipad
      || this.androidTablet
      || this.blackberryTablet
      || this.windowsTablet
      || this.firefoxOSTablet
    );
  }
}
