// deep-design — the Design mode plugin for DeepSeek Harness.
//
// Two jobs on apply:
//   1. Register the design-principles and design-qa skill packs with the
//      skills registry, so every agent (not just Designer sessions) can
//      load them from the skill catalog.
//   2. Install the `design` agent preset into the harness-home user preset
//      directory ($DSH_HOME/.agent-presets/design), which every deployment
//      scans by default — the Designer mode appears in the preset roster
//      without touching the host configuration.
//
// The preset install is idempotent and never overwrites an existing
// directory: once a user edits their copy, it is theirs.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const inject = ['skills']

const packageDir = dirname(fileURLToPath(import.meta.url))

/** $DSH_HOME or the default harness home (~/.dsh). */
function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), '.dsh')
}

/** Parse a SKILL.md into its registry fields. */
function readSkill(dir) {
  const raw = readFileSync(join(dir, 'SKILL.md'), 'utf8')
  const meta = {}
  let content = raw
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(raw)
  if (match !== null) {
    content = raw.slice(match[0].length)
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  return {
    name: meta.name,
    description: meta.description,
    content,
  }
}

export function apply(ctx) {
  // 1. Register the skill packs.
  const skillsDir = join(packageDir, 'skills')
  for (const entry of readdirSync(skillsDir)) {
    const dir = join(skillsDir, entry)
    if (!existsSync(join(dir, 'SKILL.md'))) continue
    try {
      const skill = readSkill(dir)
      ctx.skills.register({
        name: skill.name,
        description: skill.description,
        content: skill.content,
        source: 'runtime',
      })
    } catch (error) {
      ctx.logger?.warn?.(`[deep-design] failed to register skill ${entry}: ${error}`)
    }
  }

  // 2. Install the preset (idempotent; never overwrites a user's copy).
  const presetSrc = join(packageDir, 'preset')
  const presetDst = join(dshHome(), '.agent-presets', 'design')
  if (!existsSync(presetDst)) {
    mkdirSync(presetDst, { recursive: true })
    cpSync(presetSrc, presetDst, { recursive: true })
  }
}
