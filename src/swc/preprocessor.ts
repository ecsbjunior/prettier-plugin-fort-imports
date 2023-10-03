import { ParserOptions } from 'prettier';
import type { Module, ModuleItem } from '@swc/core';
import { parse as parser, transform as transformer } from '@swc/core';

export class Preprocessor {
  constructor() {}

  async execute(sourceCode: string, options: ParserOptions) {
    const AST = await this.#getAST(sourceCode);

    const imports = this.#extractImports(AST);

    this.#sortImports(imports);

    const codeWithoutImports = this.#removeImports(sourceCode, imports);

    const { code } = await this.#generateCode(AST, imports);

    const output = `${code}\n\n${codeWithoutImports}`;

    return output;
  }

  async #getAST(sourceCode: string) {
    return await parser(sourceCode, {
      syntax: 'typescript',
      decorators: true,
    });
  }

  #extractImports(AST: Module) {
    return AST.body.filter((node) => node.type === 'ImportDeclaration');
  }

  #sortImports(imports: ModuleItem[]) {
    imports.sort((a, b) => {
      const aLength = a.span.end - a.span.start;
      const bLength = b.span.end - b.span.start;

      return aLength - bLength;
    });
  }

  #removeImports(sourceCode: string, nodes: ModuleItem[]) {
    let code = sourceCode;

    for (const node of nodes) {
      const { start, end } = node.span;

      const substring = sourceCode.substring(start, end);

      code = code.replaceAll(substring, '');
    }

    return code;
  }

  async #generateCode(AST: Module, imports: ModuleItem[]) {
    return await transformer({
      body: imports,
      type: AST.type,
      span: AST.span,
      interpreter: AST.interpreter,
    });
  }
}
