export const cleanRendererString = (rendererString: string): string => {
  let cleaned = rendererString.toLowerCase();

  // Strip off ANGLE() - for example:
  // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
  cleaned = cleaned.replace(/angle \((.+)\)*$/, '$1');

  // Strip off [number]gb & strip off direct3d and after - for example:
  // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
  // 'Radeon (TM) RX 470 Series'
  cleaned = cleaned.replace(/\s+([0-9]+gb|direct3d.+$)/g, '');
  return cleaned;
};
