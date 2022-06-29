import { ScopeStack } from "../scope";

export const arithmetics = {
  '+': (args: any[], _: ScopeStack) => args.reduce((acc, cur) => acc + cur, typeof args[0] === 'string' ? '' : 0),
  '-': (args: any[], _: ScopeStack) => args.reduce((acc, cur) => acc - cur, typeof args[0] === 'string' ? '' : 0),
  '*': (args: any[], _: ScopeStack) => args.reduce((acc, cur) => acc * cur, 1),
  '/': (args: any[], _: ScopeStack) => args.reduce((acc, cur) => acc / cur, 1),
  '=': (args: any[], _: ScopeStack) => args.every((arg, index) => index === 0 || arg === args[0]),
  '<': (args: any[], _: ScopeStack) => args.every((arg, index) => index === 0 || args[index - 1] < arg),
  '<=': (args: any[], _: ScopeStack) => args.every((arg, index) => index === 0 || args[index - 1] <= arg),
  '>': (args: any[], _: ScopeStack) => args.every((arg, index) => index === 0 || args[index - 1] > arg),
  '>=': (args: any[], _: ScopeStack) => args.every((arg, index) => index === 0 || args[index - 1] >= arg),
  'and': (args: any[], _: ScopeStack) => args.reduce((acc, arg) => acc && arg, true),
  'or': (args: any[], _: ScopeStack) => args.reduce((acc, arg) => acc || arg, false),
};