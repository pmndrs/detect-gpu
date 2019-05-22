// Vendor
import { DetectUA } from 'detect-ua';

const device = new DetectUA();

export const { isMobile, isTablet, isDesktop } = device;
