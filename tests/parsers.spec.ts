import prettier from 'prettier';
import { describe, expect, it } from 'bun:test';
import { inputCodeMock } from './factories/input-code.mock';
import { outputCodeMock } from './factories/output-code.mock';

const prettierConfig = require('../.prettierrc.json');

describe('prettier plugin test', () => {
  it('should format code', async () => {
    const response = await prettier.format(inputCodeMock, {
      ...prettierConfig,
      parser: 'typescript',
      plugins: ['src/index.ts'],
    });

    expect(response).toBe(outputCodeMock);
  });
});
