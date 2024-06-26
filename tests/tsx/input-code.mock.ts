export const tsxInputCodeMock = /*ts*/ `
  import { states } from "./states";
  import { PrettierOptions, Prettier } from '@plugins/prettier'
  import { neighborhoods } from './neighborhoods';
  import eva from './eva';
  import { neighbor } from './neighbor';
  import { type sort, foo, type bar } from '@types/all';
  import { state } from './state';
  import type { type } from '@types/type';
  
                      //comment

  export const Page =
  () => {
    return (
      <>
        <h1>teste</h1>
                      <div>page</div>
      </>
    )}
`;
