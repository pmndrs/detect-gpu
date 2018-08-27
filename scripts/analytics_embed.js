/* eslint-disable */

// https://github.com/TimvanScherpenzeel/detect-gpu/blob/master/scripts/analytics_embed.js

(function() {
  if (typeof window !== 'undefined' && window && typeof document !== 'undefined' && document) {
    var trackingCode = 'UA-112999355-2';

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
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (gl) {
        var glExtensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
        var renderer =
          glExtensionDebugRendererInfo &&
          gl.getParameter(glExtensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL);

        $$__analytics('send', 'event', 'WebGL renderer string', 'load', renderer.toString(), {
          nonInteraction: true,
        });
      }
    });
  }
})();
