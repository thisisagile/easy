import { execFileSync } from 'node:child_process';
import { mkdirSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';

// Rebuild the pre-change baseline without replacing another session's working dist.
export function snapshotHead(root, temp) {
  const snapshot = join(temp, 'head');
  mkdirSync(snapshot);
  const archive = execFileSync('git', ['archive', 'HEAD'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  execFileSync('tar', ['-x', '-C', snapshot], { input: archive });
  symlinkSync(join(root, 'node_modules'), join(snapshot, 'node_modules'), 'dir');
  const cwd = join(snapshot, 'packages/easy');
  execFileSync(join(root, 'node_modules/.bin/tsdown'), ['--config', '../../tsdown.config.mts'], { cwd, stdio: 'inherit' });
  return snapshot;
}
