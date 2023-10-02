import type { ParserOptions } from 'prettier';
import { parsers as tsParsers } from 'prettier/parser-typescript';
import { type Module, parseSync as swcParserSync, transformSync as swcTransformerSync, ModuleItem } from '@swc/core';

import { Utils } from './utils';

function getAST(sourceCode: string) {
  return swcParserSync(sourceCode, {
    syntax: 'typescript',
    decorators: true,
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

function generateASTFromImports(AST: Module, imports: ModuleItem[]) {
  return swcTransformerSync({
    type: AST.type,
    body: imports,
    interpreter: AST.interpreter,
    span: AST.span,
  });
}

function preprocessor(sourceCode: string, options: ParserOptions) {
  const AST = getAST(sourceCode);
  const imports = extractImportsFromAST(AST);

  sortImports(imports);

  const sourceCodeWithoutImports = removeImportsFromSourceCode(sourceCode, imports);
  
  const newAST = generateASTFromImports(AST, imports);

  return `${newAST.code}${sourceCodeWithoutImports}`;
}

export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    preprocess: (code: string, options: ParserOptions) => preprocessor(code, options),
  },
}
