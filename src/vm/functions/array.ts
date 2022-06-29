import { ScopeStack } from "../scope";

export const array = {
  head: (args: unknown[], _: ScopeStack) => {
    if (args.length !== 1) {
      throw new Error(`head expects 1 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`head expects an array, got ${arr}`);
    }
    return arr[0];
  },
  tail: (args: unknown[], _: ScopeStack) => {
    if (args.length !== 1) {
      throw new Error(`tail expects 1 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`tail expects an array, got ${arr}`);
    }
    return arr.slice(1);
  },
  'len': (args: unknown[], _: ScopeStack) => {
    if (args.length !== 1) {
      throw new Error(`len expects 1 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`len expects an array, got ${arr}`);
    }
    return arr.length;
  },
  'nth': (args: unknown[], _: ScopeStack) => {
    if (args.length !== 2) {
      throw new Error(`nth expects 2 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`nth expects an array argument, got ${arr}`);
    }
    const index = args[1];
    if (typeof index !== 'number') {
      throw new Error(`nth expects a number argument, got ${index}`);
    }
    return arr[index];
  },
  'with-nth': (args: unknown[], _: ScopeStack) => {
    if (args.length !== 3) {
      throw new Error(`with-nth expects 3 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`with-nth expects an array argument, got ${arr}`);
    }
    const index = args[1];
    if (typeof index !== 'number') {
      throw new Error(`with-nth expects a number argument, got ${index}`);
    }
    const value = args[2];
    const newArray = [...arr];
    newArray[index] = value;
    return newArray;
  },
  'array?': (args: unknown[], _: ScopeStack) => {
    if (args.length !== 1) {
      throw new Error(`array? expects 1 argument, got ${args.length}`);
    }
    const arr = args[0];
    return Array.isArray(arr);
  },
  'empty?': (args: unknown[], _: ScopeStack) => {
    if (args.length !== 1) {
      throw new Error(`empty? expects 1 argument, got ${args.length}`);
    }
    const arr = args[0];
    if (!Array.isArray(arr)) {
      throw new Error(`empty? expects an array, got ${arr}`);
    }
    return arr.length === 0;
  }
};