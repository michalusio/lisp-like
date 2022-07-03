import { RunType } from "../runtype";

export const arithmetics = {
  '+': (args: any[]) => args.reduce((acc, cur) => acc + cur, typeof args[0] === 'string' ? '' : 0),
  '-': (args: any[]) => args.reduce((acc, cur) => acc - cur, typeof args[0] === 'string' ? '' : 0),
  '*': (args: any[]) => args.reduce((acc, cur) => acc * cur, 1),
  '/': (args: any[]) => args.reduce((acc, cur) => acc / cur, 1),
  '=': (args: any[]) => args.every((arg, index) => index === 0 || arg === args[0]),
  '<': (args: any[]) => args.every((arg, index) => index === 0 || args[index - 1] < arg),
  '>': (args: any[]) => args.every((arg, index) => index === 0 || args[index - 1] > arg),
  '<=': (args: any[]) => !arithmetics['>'](args),
  '>=': (args: any[]) => !arithmetics['<'](args),
  'and': (args: RunType[]) => args.reduce((acc, arg) => acc && arg, true),
  'or': (args: RunType[]) => args.reduce((acc, arg) => acc || arg, false),
  'not': (args: RunType[]) => !args[0],
};