export const cleanRendererString = (rendererString: string): string => {
  let cleanedRendererString = rendererString.toLowerCase();

  // Strip off ANGLE and Direct3D version
  if (cleanedRendererString.includes('angle (') && cleanedRendererString.includes('direct3d')) {
    cleanedRendererString = cleanedRendererString.replace('angle (', '').split(' direct3d')[0];
  }

  // Strip off the GB amount (1060 6gb was being concatenated to 10606 and because of it using the fallback)
  if (cleanedRendererString.includes('nvidia') && cleanedRendererString.includes('gb')) {
    cleanedRendererString = cleanedRendererString.split(/\dgb/)[0];
  }

  return cleanedRendererString;
};
