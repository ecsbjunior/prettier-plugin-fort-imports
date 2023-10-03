import { file } from '@babel/types';
import { ParserOptions } from 'prettier';
import generator from '@babel/generator';
import { parse as parser } from '@babel/parser';
import type { ParseResult } from '@babel/parser';
import type { File, ImportDeclaration } from '@babel/types';

export class Preprocessor {
  constructor() {}

  execute(sourceCode: string, options: ParserOptions) {
    const AST = this.#getAST(sourceCode);

    const imports = this.#extractImports(AST);

    this.#sortImports(imports);

    const codeWithoutImports = this.#removeImports(sourceCode, imports);

    const { code } = this.#generateCode(AST, imports);

    const output = `${code}\n\n${codeWithoutImports}`;

    return output;
  }

  #getAST(sourceCode: string) {
    return parser(sourceCode, {
      sourceType: 'module',
      plugins: ['typescript', 'decorators'],
    });
  }

  #extractImports(AST: ParseResult<File>) {
    return AST.program.body.filter((node) => node.type === 'ImportDeclaration') as ImportDeclaration[];
  }

  #sortImports(imports: ImportDeclaration[]) {
    imports.sort((a, b) => {
      const aLength = (a.end ?? 0) - (a.start ?? 0);
      const bLength = (b.end ?? 0) - (b.start ?? 0);

      return aLength - bLength;
    });
  }

  #removeImports(sourceCode: string, nodes: ImportDeclaration[]) {
    let code = sourceCode;

    for (const node of nodes) {
      const start = node.start ?? 0;
      const end = node.end ?? 0;

      const substring = sourceCode.substring(start, end);

      code = code.replaceAll(substring, '');
    }

    return code;
  }

  #generateCode(AST: ParseResult<File>, imports: ImportDeclaration[]) {
    const newAST = file({
      type: 'Program',
      body: imports,
      loc: AST.program.loc,
      end: AST.program.end,
      start: AST.program.start,
      sourceType: AST.program.sourceType,
      sourceFile: AST.program.sourceFile,
      directives: AST.program.directives,
      interpreter: AST.program.interpreter,
      innerComments: AST.program.innerComments,
      leadingComments: AST.program.leadingComments,
      trailingComments: AST.program.trailingComments,
    });

    return generator(newAST);
  }
}
