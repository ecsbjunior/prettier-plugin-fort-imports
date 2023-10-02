import type { ModuleItem } from '@swc/core';

export class Utils {
  static removeNodesFromSourceCode(sourceCode: string, nodes: ModuleItem[]) {
    let code = sourceCode;

    for (const node of nodes) {
      const { start, end } = node.span;

      code = code.replace(sourceCode.substring(start - 1, end), '');
    }

    return code;
  }
}
