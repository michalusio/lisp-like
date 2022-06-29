let cwd = '';

export function setCwd(root: string): void {
  cwd = root;
}

export function getCwd(): string {
  return cwd;
}