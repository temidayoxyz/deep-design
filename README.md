# deep-design

**Design mode for DeepSeek Harness** — the design-loop agent preset, packaged as an installable plugin bundle with two skill packs:

- **`design-principles`** — the design intelligence: first-principles brief, design language before implementation, composition, motion, the anti-slop audits, the QA rubric, and the final self-review.
- **`design-qa`** — the visual feedback loop: headless render → critic pass (a subagent forbidden from writing code that produces a structured visual diagnosis) → fix → re-render → compare. With a pixel-sampling fallback for models without image input.

One install gives you:

1. **Designer** in the agent-preset roster — a full design agent (shell, files, web research, skills, plans, subagents, workflows) whose persona runs the loop *brief → direction → artifact → critique → deliver*.
2. **The skill packs** registered globally, so any mode can load them from the skill catalog.

## Install

```sh
dsh plugin add ./deep-design      # from a checkout, or
dsh plugin add dsh-deep-design    # from the npm registry once published
```

Then start the Web UI, open the new-session screen, and pick **Designer** from the agent-preset chip.

The plugin installs the preset into `$DSH_HOME/.agent-presets/design/` — the standard user-preset location every deployment scans. The install never overwrites an existing directory: edit your copy freely, it is yours.

## The design loop

```
brief → direction (.design/direction.md) → design system → HTML
     → render (headless Chrome, desktop + mobile)
     → critic pass (structured visual diagnosis, no code)
     → fix → re-render → compare → deliver
```

Design memory compounds across sessions: the loop reads `.design/` in the workspace at session start and appends lessons at session end.

## Notes

- Best with a vision-capable model for the Design sessions (the critic sees better with eyes); the pixel-sampling fallback keeps the loop honest without one.
- Web research is enabled on the preset (`fetch: true`) — configure the web provider in the harness for reference grounding.

## License

MIT.
