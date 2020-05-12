// Vendor
import { DetectUA } from 'detect-ua';

const device = new DetectUA();

export const { browser, isMobile, isTablet } = device;
