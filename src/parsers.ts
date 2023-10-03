import { ParserOptions } from 'prettier';
import { Preprocessor } from './preprocessor';
import { parsers as tsParsers } from 'prettier/parser-typescript';

const preprocessor = new Preprocessor();

export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    preprocess: (code: string, options: ParserOptions) => preprocessor.execute(code, options),
  },
};
