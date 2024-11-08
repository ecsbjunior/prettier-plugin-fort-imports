// import util from 'node:util';
import { ParserOptions } from 'prettier';
import generator from '@babel/generator';
import { ParseResult } from '@babel/parser';
import { parse as parser } from '@babel/parser';
import { File, ImportDeclaration } from '@babel/types';
import { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, file } from '@babel/types';

export class Preprocessor {
  constructor() {}

  execute(sourceCode: string, options: ParserOptions) {
    const AST = this.#getAST(sourceCode);

    const imports = this.#extractImports(AST);

    this.#sortImports(imports);

    let codeWithoutImports = '';

    codeWithoutImports = this.#removeImports(sourceCode, imports);
    codeWithoutImports = this.#removeUseClient(codeWithoutImports);
    codeWithoutImports = this.#removeUseServer(codeWithoutImports);

    const { code } = this.#generateCode(AST, imports);

    const output = `${code}\n\n${codeWithoutImports}`;

    return output;
  }

  #getAST(sourceCode: string) {
    return parser(sourceCode, {
      sourceType: 'module',
      plugins: ['typescript', 'decorators-legacy', 'jsx'],
    });
  }

  #extractImports(AST: ParseResult<File>) {
    const imports = AST.program.body.filter((node) => node.type === 'ImportDeclaration') as ImportDeclaration[];

    imports.forEach((x) => delete x.trailingComments);

    return imports;
  }

  #sortImports(imports: ImportDeclaration[]) {
    imports.sort((a, b) => {
      const aLength = (a.end ?? 0) - (a.start ?? 0);
      const bLength = (b.end ?? 0) - (b.start ?? 0);
      return aLength - bLength;
    });

    imports.forEach((x) => this.#sortImportSpecifiers(x.specifiers));
  }

  #sortImportSpecifiers(specifiers: (ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier)[]) {
    specifiers.sort((a, b) => {
      const aLength = (a.end ?? 0) - (a.start ?? 0);
      const bLength = (b.end ?? 0) - (b.start ?? 0);

      let diff = aLength - bLength;

      if (diff === 0) {
        diff = a.local.name.localeCompare(b.local.name);
      }

      return diff;
    });
  }

  #removeUseClient(codeWithoutImports: string) {
    const codeWithoutUseClient = codeWithoutImports.replace(/('use client';*)/, '');
    return codeWithoutUseClient;
  }

  #removeUseServer(codeWithoutImports: string) {
    const codeWithoutUseServer = codeWithoutImports.replace(/('use server';*)/, '');
    return codeWithoutUseServer;
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
      directives: AST.program.directives,
      interpreter: AST.program.interpreter,
      innerComments: AST.program.innerComments,
      leadingComments: AST.program.leadingComments,
      trailingComments: AST.program.trailingComments,
    });

    return generator(newAST);
  }
}
