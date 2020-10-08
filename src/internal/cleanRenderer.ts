export const cleanRenderer = (renderer: string) =>
  renderer
    .toLowerCase()
    // Strip off ANGLE() - for example:
    // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp'':
    .replace(/angle \((.+)\)*$/, '$1')
    // Strip off [number]gb & strip off direct3d and after - for example:
    // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
    // 'Radeon (TM) RX 470 Series'
    .replace(/\s+([0-9]+gb|direct3d.+$)|\(r\)| \([^\)]+\)$/g, '');
