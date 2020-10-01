(function() {
  if (typeof window !== 'undefined' && window && typeof document !== 'undefined' && document) {
    // Configuration
    var trackingCode = 'UA-INSERT_TRACKING_CODE';

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
      // Report wether WebGL is supported: boolean
      var webglCanvas = document.createElement('canvas');
      var webgl = webglCanvas.getContext('webgl') || webglCanvas.getContext('experimental-webgl');
      var isWebGLSupported = !!webgl;

      $$__analytics('send', 'event', 'isWebGLSupported', 'load', isWebGLSupported, {
        nonInteraction: true,
      });

      if (webgl) {
        // Report WebGL unmasked renderer string: string
        var glExtensionDebugRendererInfo = webgl.getExtension('WEBGL_debug_renderer_info');
        var renderer =
          glExtensionDebugRendererInfo &&
          webgl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);

        $$__analytics('send', 'event', 'webGLRenderer', 'load', renderer.toString(), {
          nonInteraction: true,
        });

        // Report supported WebGL extensions: [string, string, ...]
        var extensions = webgl.getSupportedExtensions();

        $$__analytics(
          'send',
          'event',
          'webglSupportedExtensions',
          'load',
          JSON.stringify(sortArray(extensions)),
          {
            nonInteraction: true,
          }
        );
      }

      // Report wether WebGL2 is supported: boolean
      var webgl2Canvas = document.createElement('canvas');
      var webgl2 =
        webgl2Canvas.getContext('webgl2') || webgl2Canvas.getContext('experimental-webgl2');
      var isWebGL2Supported = !!webgl2;

      $$__analytics('send', 'event', 'isWebGL2Supported', 'load', isWebGL2Supported, {
        nonInteraction: true,
      });

      if (webgl2) {
        // Report supported WebGL extensions: [string, string, ...]
        var extensions = webgl2.getSupportedExtensions();

        $$__analytics(
          'send',
          'event',
          'webgl2SupportedExtensions',
          'load',
          JSON.stringify(sortArray(extensions)),
          {
            nonInteraction: true,
          }
        );
      }

      webglCanvas = null;
      webgl2Canvas = null;
      webgl = null;
      webgl2 = null;
    });
  }
})();
