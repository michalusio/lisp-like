import { RunType } from "./runtype";

export type Scope = Record<string, RunType>;

export class ScopeStack {

  private readonly scopes: Scope[] = [];

  public push(scope: Scope): void {
    this.scopes.push(scope);
  }

  public pushNew() {
    this.scopes.push({});
  }

  public pop(): Scope | undefined {
    return this.scopes.pop();
  }

  public getLevel(): number {
    return this.scopes.length - 1;
  }

  public has(key: string): boolean {
    for (let index = this.scopes.length - 1; index >= 0; index--) {
      const scope = this.scopes[index];
      if (key in scope) {
        return true;
      }
    }
    return false;
  }

  public get(key: string): RunType {
    for (let index = this.scopes.length - 1; index >= 0; index--) {
      const scope = this.scopes[index];
      if (scope[key] !== undefined) {
        return scope[key];
      }
    }
    return undefined;
  }

  public set(key: string, value: RunType): void {
    this.scopes[this.scopes.length - 1][key] = value;
  }

  public setTo(key: string, value: RunType, levels: number): void {
    this.scopes[levels][key] = value;
  }

}