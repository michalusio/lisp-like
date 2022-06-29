export * from './log';

export class IOMonad {



  toString() {
    return `IO Monad`;
  }
  toJSON() {
    return this.toString();
  }
}