export const getEntryVersionNumber = (entryString: string): string =>
  entryString.replace(/[\D]/g, ''); // Grab and concat all digits in the string
