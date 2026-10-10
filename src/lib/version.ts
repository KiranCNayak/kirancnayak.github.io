import { execFileSync } from 'node:child_process';

// Build version shaped like `2026.10.11-3e566f5`: the build date in IST plus
// the short commit hash. CI builds on every push, so build time is deploy time.
const builtAt = new Date();

function part(type: Intl.DateTimeFormatPartTypes, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', ...options })
    .formatToParts(builtAt)
    .find((p) => p.type === type)!.value;
}

function readSha() {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const date = `${part('year', { year: 'numeric' })}.${part('month', { month: '2-digit' })}.${part('day', { day: '2-digit' })}`;
const time = `${part('hour', { hour: '2-digit', hourCycle: 'h23' })}:${part('minute', { minute: '2-digit' })}`;
const sha = readSha();

export const version = {
  label: sha ? `${date}-${sha}` : `${date}-dev`,
  sha,
  deployedAt: `${date.replaceAll('.', '-')} ${time} IST`,
};
