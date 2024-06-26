import prettier from 'prettier';
import { describe, expect, it } from 'bun:test';
import { tsInputCodeMock } from './ts/input-code.mock';
import { tsOutputCodeMock } from './ts/output-code.mock';
import { tsxInputCodeMock } from './tsx/input-code.mock';
import { tsxOutputCodeMock } from './tsx/output-code.mock';

const prettierConfig = require('../.prettierrc.json');

describe('prettier plugin test', () => {
  it('should format ts code', async () => {
    const response = await prettier.format(tsInputCodeMock, {
      ...prettierConfig,
      parser: 'typescript',
      plugins: ['src/index.ts'],
    });

    expect(response).toBe(tsOutputCodeMock);
  });

  it('should format tsx code', async () => {
    const response = await prettier.format(tsxInputCodeMock, {
      ...prettierConfig,
      parser: 'typescript',
      plugins: ['src/index.ts'],
    });

    expect(response).toBe(tsxOutputCodeMock);
  });
});
