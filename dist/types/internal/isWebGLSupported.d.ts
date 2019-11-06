import { IResult } from 'detect-ua';
import { TVoidable } from '../types';
export declare const isWebGLSupported: ({ browser }: {
    browser: boolean | IResult;
}) => TVoidable<WebGLRenderingContext>;
