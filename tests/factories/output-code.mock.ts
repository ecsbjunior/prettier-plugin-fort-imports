export const outputCodeMock = /*ts*/`import { state } from './state';
import { states } from './states';
import { neighbor } from './neighbor';
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
