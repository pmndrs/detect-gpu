import { IBrowserResult } from 'detect-ua';
import { TVoidable } from '../types';
export declare const isWebGLSupported: ({ browser, }: {
    browser: boolean | IBrowserResult;
}) => TVoidable<WebGLRenderingContext>;
