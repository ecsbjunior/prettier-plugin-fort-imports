import type { SupportLanguage } from 'prettier';

export const languages: SupportLanguage[] = [
  {
    extensions: ['.ts'],
    name: 'typescript',
    parsers: ['typescript'],
  },
];
