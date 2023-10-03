export const outputCodeMock = /*ts*/ `import { state } from './state';
import { states } from './states';
import { type } from '@types/type';
import { neighbor } from './neighbor';
import { sort, foo, bar } from '@types/all';
import { neighborhoods } from './neighborhoods';

console.log('program');

console.log('program2');

@DecoratorTeste()
export class Teste {
  constructor(private readonly state: State) {
    console.log('teste');
  }
}
`;
