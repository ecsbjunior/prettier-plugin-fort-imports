import { Utils } from './utils';
import { ParserOptions } from 'prettier';
import type { Module, ModuleItem } from '@swc/core';
import { parseSync as swcParserSync, transformSync as swcTransformerSync } from '@swc/core';

export class Preprocessor {
  constructor() {}
  
  execute(sourceCode: string, options: ParserOptions) {
    const AST = this.#getAST(sourceCode);

    const imports = this.#extractImports(AST);
  
    this.#sortImports(imports);
  
    const sourceCodeWithoutImports = this.#removeImports(sourceCode, imports);
  
    const { code } = this.#generateCode(AST, imports);
  
    const output = `${code}\n\n${sourceCodeWithoutImports}`;
  
    return output;
  }

  #getAST(sourceCode: string) {
    return swcParserSync(sourceCode, {
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
  
  #removeImports(sourceCode: string, imports: ModuleItem[]) {
    return Utils.removeNodesFromSourceCode(sourceCode, imports);
  }
  
  #generateCode(AST: Module, imports: ModuleItem[]) {
    return swcTransformerSync({
      type: AST.type,
      body: imports,
      interpreter: AST.interpreter,
      span: AST.span,
    });
  }
}
