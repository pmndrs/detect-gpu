/* eslint-disable */

// https://github.com/TimvanScherpenzeel/detect-gpu/blob/master/scripts/analytics_embed.js

(function() {
  if (typeof window !== 'undefined' && window && typeof document !== 'undefined' && document) {
    // Configuration
    var trackingCode = 'UA-112999355-3';

    // Create Google Analytics object (registers under the global: "$$__analytics")
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

    // Utilities
    function sortArray(arr) {
      arr.sort(function(a, b) {
        var nameA = a.toLowerCase();
        var nameB = b.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
      });

      return arr;
    }

    document.addEventListener('DOMContentLoaded', function() {
      // WebGL support: boolean
      // Return if WebGL is supported
      var webglCanvas = document.createElement('canvas');
      var webgl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
      var isWebGLSupported = !!webgl;

      $$__analytics('send', 'event', 'isWebGLSupported', 'load', isWebGLSupported, {
        nonInteraction: true,
      });

      if (webgl) {
        // WebGL unmasked renderer: string
        // Return unmasked renderer string (GPU driver name)
        var glExtensionDebugRendererInfo = webgl.getExtension('WEBGL_debug_renderer_info');
        var renderer =
          glExtensionDebugRendererInfo &&
          webgl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);

        $$__analytics('send', 'event', 'webGLRenderer', 'load', renderer.toString(), {
          nonInteraction: true,
        });

        // Supported WebGL extensions: [string, string, ...]
        var extensions = webgl.getSupportedExtensions();

        $$__analytics(
          'send',
          'event',
          'webglSupportedExtensions',
          'load',
          JSON.stringify(sortArray(extensions)),
          {
            nonInteraction: true,
          },
        );
      }

      // WebGL2 support: boolean
      // Return if WebGL2 is supported
      var webgl2Canvas = document.createElement('canvas');
      var webgl2 =
        webgl2Canvas.getContext('webgl2') || webgl2Canvas.getContext('experimental-webgl2');
      var isWebGL2Supported = !!webgl2;

      $$__analytics('send', 'event', 'isWebGL2Supported', 'load', isWebGL2Supported, {
        nonInteraction: true,
      });

      if (webgl2) {
        // Supported WebGL extensions: [string, string, ...]
        var extensions = webgl2.getSupportedExtensions();

        $$__analytics(
          'send',
          'event',
          'webgl2SupportedExtensions',
          'load',
          JSON.stringify(sortArray(extensions)),
          {
            nonInteraction: true,
          },
        );
      }

      // Device pixel ratio: number
      // Ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device.
      // This value could also be interpreted as the ratio of pixel sizes: the size of one CSS pixel to the size of one physical pixel.
      // In simpler terms, this tells the browser how many of the screen's actual pixels should be used to draw a single CSS pixel.
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
      // The WebVR API is being replaced by the WebXR Device API, but may still be available in some browsers while that API is finalized.
      // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getVRDisplays
      var isWebVRSupported = !!navigator.getVRDisplays || false;

      $$__analytics('send', 'event', 'isWebVRSupported', 'load', isWebVRSupported, {
        nonInteraction: true,
      });

      // WebXR support: boolean
      // WebXR is an API for accessing VR, AR, MR on the web
      // https://immersive-web.github.io/webxr/
      var isWebXRSupported = !!navigator.xr || false;

      $$__analytics('send', 'event', 'isWebXRSupported', 'load', isWebXRSupported, {
        nonInteraction: true,
      });

      // Cleanup created WebGL canvas and WebGL2 canvas including contexts
      webglCanvas = null;
      webgl2Canvas = null;
      webgl = null;
      webgl2 = null;
    });
  }
})();
