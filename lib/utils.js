"use strict";
export class Utils {
  static removeNodesFromSourceCode(sourceCode, nodes) {
    let code = sourceCode;
    for (const node of nodes) {
      const { start, end } = node.span;
      code = code.replace(sourceCode.substring(start - 1, end), "");
    }
    return code;
  }
}
