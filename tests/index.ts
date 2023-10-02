import prettier from 'prettier';

const code = /*ts*/`
  import { neighborhoods } from './neighborhoods';
  import { state } from './state';
  import { neighbor } from './neighbor';
  import { states } from './states';

  console.log('program');

  console.log('program2');
`;

const result = await prettier.format(code, {
  parser: 'typescript',
  plugins: ['.'],
});

console.log(result);
