/* eslint-disable */

// https://github.com/TimvanScherpenzeel/detect-gpu/blob/master/scripts/analytics_embed.js

(function() {
  if (typeof window !== 'undefined' && window && typeof document !== 'undefined' && document) {
    var trackingCode = 'UA-112999355-3';

    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', '$$__analytics');

    $$__analytics('create', trackingCode, 'auto');
    $$__analytics('send', 'pageview');

    document.addEventListener('DOMContentLoaded', function() {
      // WebGL supported: boolean
      // Check if WebGL is supported
      var webglCanvas = document.createElement('canvas');
      var webgl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');

      $$__analytics('send', 'event', 'isWebGLSupported', 'load', !!webgl, {
        nonInteraction: true,
      });

      // WebGL unmasked renderer: string
      // Return unmasked renderer string (GPU driver name)
      if (webgl) {
        var glExtensionDebugRendererInfo = webgl.getExtension('WEBGL_debug_renderer_info');
        var renderer =
          glExtensionDebugRendererInfo &&
          webgl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);

        $$__analytics('send', 'event', 'webGLRenderer', 'load', renderer.toString(), {
          nonInteraction: true,
        });
      }

      // WebGL2 support: boolean
      // Check if WebGL2 is supported
      var webgl2Canvas = document.createElement('canvas');
      var webgl2 =
        webgl2Canvas.getContext('webgl2') || webgl2Canvas.getContext('experimental-webgl2');

      $$__analytics('send', 'event', 'isWebGL2Supported', 'load', !!webgl2, {
        nonInteraction: true,
      });

      // Device pixel ratio: number
      // Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
      var devicePixelRatio = window.devicePixelRatio || 1;

      $$__analytics('send', 'event', 'devicePixelRatio', 'load', devicePixelRatio, {
        nonInteraction: true,
      });

      // Hardware concurrency: number
      // Number of logical processors available to run threads on the user's computer
      var hardwareConcurrency = navigator.hardwareConcurrency || 0;

      $$__analytics('send', 'event', 'hardwareConcurrency', 'load', hardwareConcurrency, {
        nonInteraction: true,
      });

      // WebVR support: boolean
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getVRDisplays
      var isWebVRSupported = !!navigator.getVRDisplays || false;

      $$__analytics('send', 'event', 'isWebVRSupported', 'load', isWebVRSupported, {
        nonInteraction: true,
      });

      // WebXR support: boolean
      // https://immersive-web.github.io/webxr/
      var isWebXRSupported = !!navigator.xr || false;

      $$__analytics('send', 'event', 'isWebXRSupported', 'load', isWebXRSupported, {
        nonInteraction: true,
      });

      // Cleanup
      webglCanvas = null;
      webgl2Canvas = null;
      webgl = null;
      webgl2 = null;
    });
  }
})();
