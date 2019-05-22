export const cleanEntryString = (entryString: string): string =>
  entryString
    .toLowerCase() // Lowercase all for easier matching
    .split('- ')[1] // Remove prelude score (`3 - `)
    .split(' /')[0]; // Reduce 'apple a9x / powervr series 7xt' to 'apple a9x'
