const debug = false ? console.log : undefined;

export function cleanRenderer(renderer: string) {
  debug?.('cleanRenderer', { renderer });

  renderer = renderer
    .toLowerCase()
    // Strip off ANGLE() - for example:
    // 'ANGLE (NVIDIA TITAN Xp)' becomes 'NVIDIA TITAN Xp',
    // 'Samsung Electronics Co., Ltd. ANGLE (Samsung Xclipse 920) on Vulkan 1.1.179' becomes 'Samsung Xclipse 920':
    .replace(/.*angle ?\((.+)\)(?: on vulkan [0-9.]+)?$/i, '$1')
    // Strip off [number]gb & strip off direct3d and after - for example:
    // 'Radeon (TM) RX 470 Series Direct3D11 vs_5_0 ps_5_0' becomes
    // 'Radeon (TM) RX 470 Series'
    .replace(/\s(\d{1,2}gb|direct3d.+$)|\(r\)| \([^)]+\)$/g, '')
    // Strip out graphics API. The one Vulkan example we've seen includes
    // the GPU in parens after the Vulkan version so this also keeps that
    // eg. 'vulkan 1.2.175 (nvidia nvidia geforce gtx 970 (0x000013c2))'
    // becomes 'nvidia nvidia geforce gtx 970 (0x000013c2)'
    // `OpenGL 4.5.0` gets removed all together
    .replace(/(?:vulkan|opengl) \d+\.\d+(?:\.\d+)?(?: \((.*)\))?/, '$1')

  debug?.('cleanRenderer - renderer cleaned to', { renderer });

  return renderer;
};
