export const tsOutputCodeMock = /*ts*/ `import eva from './eva';
import { state } from './state';
import { states } from './states';
import { neighbor } from './neighbor';
import type { type } from '@types/type';
import { neighborhoods } from './neighborhoods';
import { foo, type bar, type sort } from '@types/all';
import { Prettier1, Prettier2, PrettierOptions } from '@plugins/prettier';

//comment

console.log('program');

console.log('program2');

@DecoratorTeste()
export class Teste {
  constructor(
    @PropertyDecorator()
    private readonly state: State,
  ) {
    console.log('teste');
  }
}
`;
