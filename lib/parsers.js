"use strict";
import { parsers as tsParsers } from "prettier/parser-typescript";
import { parse as swcParser, transform as swcTransformer } from "@swc/core";
import { Utils } from "./utils";
async function getAST(sourceCode) {
  return await swcParser(sourceCode, {
    syntax: "typescript"
  });
}
function extractImportsFromAST(AST) {
  return AST.body.filter((node) => node.type === "ImportDeclaration");
}
function sortImports(imports) {
  imports.sort((a, b) => {
    const aLength = a.span.end - a.span.start;
    const bLength = b.span.end - b.span.start;
    return aLength - bLength;
  });
}
function removeImportsFromSourceCode(sourceCode, imports) {
  return Utils.removeNodesFromSourceCode(sourceCode, imports);
}
async function generateASTFromImports(AST, imports) {
  return await swcTransformer({
    type: AST.type,
    body: imports,
    interpreter: AST.interpreter,
    span: AST.span
  });
}
async function preprocessor(sourceCode, options) {
  const AST = await getAST(sourceCode);
  const imports = extractImportsFromAST(AST);
  sortImports(imports);
  const sourceCodeWithoutImports = removeImportsFromSourceCode(sourceCode, imports);
  const newAST = await generateASTFromImports(AST, imports);
  return `${newAST.code}
${sourceCodeWithoutImports.trim()}`;
}
export const parsers = {
  typescript: {
    ...tsParsers.typescript,
    parse: async (code, options) => {
      const processedCode = await preprocessor(code, options);
      const parsedCode = tsParsers.typescript.parse(processedCode, options);
      return parsedCode;
    }
  }
};
