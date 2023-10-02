import type { RequiredOptions } from 'prettier';
import { parsers as tsParsers } from 'prettier/parser-typescript';
import { type Module, parse as swcParser, transform as swcTransformer, ModuleItem } from '@swc/core';

import { Utils } from './utils';

type PluginConfig = {
  notBreakImportLines: boolean;
};

type PrettierOptions = Required<PluginConfig> & RequiredOptions & {};

async function getAST(sourceCode: string) {
  return await swcParser(sourceCode, {
    syntax: 'typescript',
  });
}

function extractImportsFromAST(AST: Module) {
  return AST.body.filter((node) => node.type === 'ImportDeclaration')
}

function sortImports(imports: ModuleItem[]) {
  imports.sort((a, b) => {
    const aLength = a.span.end - a.span.start;
    const bLength = b.span.end - b.span.start;

    return aLength - bLength;
  });
}

function removeImportsFromSourceCode(sourceCode: string, imports: ModuleItem[]) {
  return Utils.removeNodesFromSourceCode(sourceCode, imports);
}

async function generateASTFromImports(AST: Module, imports: ModuleItem[]) {
  return await swcTransformer({
    type: AST.type,
    body: imports,
    interpreter: AST.interpreter,
    span: AST.span,
  });
}

async function preprocessor(sourceCode: string, options: PrettierOptions) {
  // const { notBreakImportLines } = options;

  const AST = await getAST(sourceCode);
  const imports = extractImportsFromAST(AST);

  sortImports(imports);

  const sourceCodeWithoutImports = removeImportsFromSourceCode(sourceCode, imports);
  
  const newAST = await generateASTFromImports(AST, imports);

  return `${newAST.code}\n${sourceCodeWithoutImports.trim()}`;
}

export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    parse: async (code: string, options: PrettierOptions) => {
      const processedCode = await preprocessor(code, options);

      const parsedCode = tsParsers.typescript.parse(processedCode, options as any);

      return parsedCode;
    },
  },
}
