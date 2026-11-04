// deep-design — the Design mode plugin for DeepSeek Harness.
//
// On apply:
//   1. Register the design-principles and design-qa skill packs with the
//      skills registry, so every agent (not just Designer sessions) can load
//      them from the skill catalog.
//   2. Register the `design` agent preset from preset/agent.cordis.yml with
//      the agent-presets registry, so it appears in the preset roster and can
//      be selected by new sessions.

import { createRequire } from 'node:module'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const yaml = require('js-yaml')

// Cordis compositions may use `!!js` expressions in scalar rows (disabled
// flags like `!!js process.platform === 'win32'`). Parse those with a tiny
// type so js-yaml does not reject the whole composition before registration.
const jsExprType = new yaml.Type('tag:yaml.org,2002:js', {
  kind: 'scalar',
  construct: (data) => new Function('process', `return ${data}`)(process),
})
const yamlSchema = yaml.DEFAULT_SCHEMA.extend([jsExprType])

const packageDir = dirname(fileURLToPath(import.meta.url))

export const inject = ['agentPresets', 'skills']

function dshHome() {
  return process.env.DSH_HOME ?? join(homedir(), '.dsh')
}

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

export async function apply(ctx) {
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

  // 2. Register the design preset.
  try {
    const presetPath = join(packageDir, 'preset', 'agent.cordis.yml')
    const raw = readFileSync(presetPath, 'utf8')
    const plugins = yaml.load(raw, { schema: yamlSchema })
    await ctx.agentPresets.register({
      id: 'design',
      name: 'Deep Design',
      description: 'The design loop mode — brief → direction → artifact → critique → deliver — producing prototypes and deliverables.',
      order: 3,
      plugins,
    })
  } catch (error) {
    ctx.logger?.warn?.(`[deep-design] failed to register design preset: ${error}`)
  }

  // Back-compat, for tools still looking under the legacy preset directory.
  try {
    const legacy = join(dshHome(), '.agent-presets', 'design')
    if (!existsSync(legacy)) {
      mkdirSync(legacy, { recursive: true })
      cpSync(join(packageDir, 'preset'), legacy, { recursive: true })
    }
  } catch (error) {
    ctx.logger?.warn?.(`[deep-design] legacy preset copy failed: ${error}`)
  }
}
