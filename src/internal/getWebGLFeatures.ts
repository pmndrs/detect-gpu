// Vendor
import {
  GL_ALIASED_LINE_WIDTH_RANGE,
  GL_ALIASED_POINT_SIZE_RANGE,
  GL_ALPHA_BITS,
  GL_BLUE_BITS,
  GL_DEPTH_BITS,
  GL_FRAGMENT_SHADER,
  GL_GREEN_BITS,
  GL_HIGH_FLOAT,
  GL_LOW_FLOAT,
  GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS,
  GL_MAX_CUBE_MAP_TEXTURE_SIZE,
  GL_MAX_FRAGMENT_UNIFORM_VECTORS,
  GL_MAX_RENDERBUFFER_SIZE,
  GL_MAX_TEXTURE_IMAGE_UNITS,
  GL_MAX_TEXTURE_SIZE,
  GL_MAX_VARYING_VECTORS,
  GL_MAX_VERTEX_ATTRIBS,
  GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS,
  GL_MAX_VERTEX_UNIFORM_VECTORS,
  GL_MAX_VIEWPORT_DIMS,
  GL_MEDIUM_FLOAT,
  GL_RED_BITS,
  GL_SHADING_LANGUAGE_VERSION,
  GL_STENCIL_BITS,
  GL_STENCIL_TEST,
  GL_SUBPIXEL_BITS,
  GL_VERTEX_SHADER,
} from 'webgl-constants';

export const getWebGLFeatures = (gl: WebGLRenderingContext) => {
  // Enable features
  gl.enable(GL_STENCIL_TEST);

  // Enable extensions
  const glAnisotropicExtension =
    gl.getExtension('EXT_texture_filter_anisotropic') ||
    gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
    gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
  const glDrawBufferExtension = gl.getExtension('WEBGL_draw_buffers');
  const debugShaderExtension = gl.getExtension('WEBGL_debug_shaders');

  const debugShader = gl.createShader(gl.VERTEX_SHADER);
  let debugShaderSource = '';

  if (debugShader) {
    gl.shaderSource(
      debugShader,
      `#version ${gl instanceof WebGLRenderingContext ? '100' : '300 es'}
          void main() {
            gl_Position = vec4(__VERSION__, 1.0, 1.0, 1.0);
          }
        `
    );

    gl.compileShader(debugShader);

    if (!gl.getShaderParameter(debugShader, gl.COMPILE_STATUS)) {
      return console.error('invalid shader', gl.getShaderInfoLog(debugShader));
    }

    debugShaderSource =
      debugShaderExtension?.getTranslatedShaderSource(debugShader) || '';
  }

  const features = {
    base: {
      debugShaderSource,
      shaderVersion: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
    },
    extensions: {
      // Compressed texture extensions
      compressedTextureASTCExtension: gl.getExtension(
        'WEBGL_compressed_texture_astc'
      ),
      compressedTextureATCExtension: gl.getExtension(
        'WEBGL_compressed_texture_atc'
      ),
      compressedTextureETC1Extension: gl.getExtension(
        'WEBGL_compressed_texture_etc1'
      ),
      compressedTextureETCExtension: gl.getExtension(
        'WEBGL_compressed_texture_etc'
      ),
      compressedTexturePVRTCExtension:
        gl.getExtension('WEBGL_compressed_texture_pvrtc') ||
        gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc'),
      compressedTextureS3TCExtension: gl.getExtension(
        'WEBGL_compressed_texture_s3tc'
      ),
      compressedTextureS3TCSRGBExtension: gl.getExtension(
        'WEBGL_compressed_texture_s3tc_srgb'
      ),
      maxAnisotropy: glAnisotropicExtension
        ? gl.getParameter(glAnisotropicExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
        : 0,
      maxDrawBuffers: glDrawBufferExtension
        ? gl.getParameter(glDrawBufferExtension.MAX_DRAW_BUFFERS_WEBGL)
        : 0,
      supportedExtensions: gl.getSupportedExtensions(),
    },

    general: {
      aliasedLineWidthRange: gl
        .getParameter(GL_ALIASED_LINE_WIDTH_RANGE)
        .toString(),
      aliasedPointSizeRange: gl
        .getParameter(GL_ALIASED_POINT_SIZE_RANGE)
        .toString(),
      alphaBits: gl.getParameter(GL_ALPHA_BITS),
      antialias: Boolean(gl.getContextAttributes()?.antialias),
      blueBits: gl.getParameter(GL_BLUE_BITS),
      depthBits: gl.getParameter(GL_DEPTH_BITS),
      greenBits: gl.getParameter(GL_GREEN_BITS),
      maxCombinedTextureImageUnits: gl.getParameter(
        GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS
      ),
      maxCubeMapTextureSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
      maxFragmentUniformVectors: gl.getParameter(
        GL_MAX_FRAGMENT_UNIFORM_VECTORS
      ),
      maxRenderBufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
      maxTextureImageUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
      maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
      maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
      maxVertexAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
      maxVertexTextureImageUnits: gl.getParameter(
        GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS
      ),
      maxVertexUniformVectors: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
      maxViewportDimensions: gl.getParameter(GL_MAX_VIEWPORT_DIMS).toString(),
      precision: {
        fragmentShaderHighPrecision: [
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_HIGH_FLOAT)
            ?.rangeMin,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_HIGH_FLOAT)
            ?.rangeMax,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_HIGH_FLOAT)
            ?.precision,
        ].toString(),

        fragmentShaderLowPrecision: [
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_LOW_FLOAT)
            ?.rangeMin,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_LOW_FLOAT)
            ?.rangeMax,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_LOW_FLOAT)
            ?.precision,
        ].toString(),

        fragmentShaderMediumPrecision: [
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_MEDIUM_FLOAT)
            ?.rangeMin,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_MEDIUM_FLOAT)
            ?.rangeMax,
          gl.getShaderPrecisionFormat(GL_FRAGMENT_SHADER, GL_MEDIUM_FLOAT)
            ?.precision,
        ].toString(),

        vertexShaderHighPrecision: [
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_HIGH_FLOAT)
            ?.rangeMin,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_HIGH_FLOAT)
            ?.rangeMax,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_HIGH_FLOAT)
            ?.precision,
        ].toString(),

        vertexShaderLowPrecision: [
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_LOW_FLOAT)?.rangeMin,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_LOW_FLOAT)?.rangeMax,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_LOW_FLOAT)
            ?.precision,
        ].toString(),

        vertexShaderMediumPrecision: [
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_MEDIUM_FLOAT)
            ?.rangeMin,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_MEDIUM_FLOAT)
            ?.rangeMax,
          gl.getShaderPrecisionFormat(GL_VERTEX_SHADER, GL_MEDIUM_FLOAT)
            ?.precision,
        ].toString(),
      },
      redBits: gl.getParameter(GL_RED_BITS),
      stencilBits: gl.getParameter(GL_STENCIL_BITS),
      subPixelBits: gl.getParameter(GL_SUBPIXEL_BITS),
    },
  };

  return features;
};
