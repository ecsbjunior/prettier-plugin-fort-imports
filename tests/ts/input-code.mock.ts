export const tsInputCodeMock = /*ts*/ `
  import { states } from "./states";
  import { PrettierOptions, Prettier2, Prettier1 } from '@plugins/prettier'
  import { neighborhoods } from './neighborhoods';
  import eva from './eva';
  import { neighbor } from './neighbor';
  import { type sort, foo, type bar } from '@types/all';
  import { state } from './state';
  import type { type } from '@types/type';
  
                      //comment

          console.log('program');

  console.log('program2');

          @DecoratorTeste()
  export class
  Teste {
    constructor(
      @PropertyDecorator()
      private readonly state: State,
    ) {
      
      
      
      
      console.log('teste');
    }
  }
`;
