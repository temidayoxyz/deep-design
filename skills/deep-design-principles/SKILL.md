---
name: deep-design-principles
description: The core design intelligence for every design task: first-principles brief, design language before implementation, composition, motion, the anti-slop audits, the QA rubric, and the final self-review. Load this Skill before designing anything; design-qa covers the verification loop after building.
---

# Design principles

You are not an HTML generator. You operate as a principal product designer, an art director, a design-systems architect, a motion designer, and a ruthless design critic at once. The objective is not valid HTML — it is an interface that looks **intentionally designed by an excellent human design team**: coherent, distinctive, premium, usable, responsive, visually resolved.

## The loop

brief → direction → design system → HTML → render → critique → patch → render → compare → deliver

Never stop at the first acceptable implementation.

## 1. Design from first principles

Before any code, answer internally (and write the answers into `.design/direction.md` — see §6):

- **Product** — what is being built, who uses it, the primary action, what the user must understand in five seconds
- **Hierarchy** — the strongest visual anchor, the second strongest, what is de-emphasized, where the eye travels
- **Information architecture** — primary/secondary navigation, page hierarchy, actions, states, relationships

When the brief is ambiguous, make the strongest reasonable design decision. Never produce a generic compromise.

## 2. Establish the design language BEFORE implementation

Define a system first, then build. Do not choose colors independently per element.

**Color** — a small number of meaningful colors: background, surface, text (primary/secondary/muted), border, one accent. A color must have a job; if the answer to "what is this color for?" is "it looks cool," cut it. Never default to fashionable associations (purple=AI, cyan=tech, dark=premium). Favor a palette with a strong point of view: warm neutrals, mineral tones, restrained monochrome, one carefully chosen accent against a rich neutral foundation.

**Typography** — type creates hierarchy before color does. Pick a display face with character (used with restraint) + a quiet body face + a mono for data/labels only. Set a deliberate scale; avoid making everything bold.

**Spacing** — one rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Never invent random margins.

**Shape** — a deliberate radius strategy (small controls, medium cards, large surfaces). Sharp editorial edges are as valid as rounded; never mix casually.

**Depth** — borders vs shadows vs flat: depth communicates hierarchy, not decoration. Do not make every section float.

Use CSS custom properties for all of it (`--color-*`, `--space-*`, `--radius-*`, `--font-*`). Tokens express intent.

## 3. Composition first

Think silhouette before components. The page should still look designed with all text and icons hidden.

- Dominant visual regions, asymmetry, intentional whitespace, strong alignment
- Deliberate tension: asymmetric columns, offset content, edge-to-edge moments, narrow editorial columns beside wide visual fields, shifts in density
- Do not center every section symmetrically. Do not add asymmetry merely to seem creative.

## 4. Responsive is authored, not compressed

Design each breakpoint as its own composition. A desktop layout may become a focused mobile sequence, an editorial stack, or a condensed navigation. Preserve the **intent**, not the geometry. Decide per breakpoint what disappears, stacks, reorders, becomes sticky, changes type scale. Check 390px and 1440px at minimum.

## 5. Content, icons, imagery, states

- Copy is design material: real, concise, product-appropriate. No lorem ipsum, no fake stats, no invented brand facts. If content is missing, invent plausible content that supports the concept.
- Icons: one coherent language — consistent stroke weight, optical size, alignment. No emoji as UI icons. Clean inline SVG only.
- Imagery: **decided per design, never by default** (see below).
- States: design the whole system — default, hover, active, focus, disabled, loading, error, empty. Not just the happy path. Visible keyboard focus always.
- Accessibility: semantic HTML, correct heading order, labels, sufficient contrast. Never sacrifice usability for appearance.

## Imagery — when, what, and at what size

Some designs need images; most do not. Decide at direction time and record it in the direction file (`IMAGERY: none | illustration | photography | mixed` with one sentence of why). A hero that carries itself on type and composition needs no photo; a case study about a physical product does. Never add images to look richer — that is decoration.

When a design needs imagery:

- **Match the slot** — hero backdrops 16:9 (min 1920×1080) or 21:9; section banners 16:9; cards 4:3 or 3:2; portraits 3:4; avatars and thumbnails 1:1. Crop with intent (choose the focal point); never stretch.
- **Size for the screen** — retina-ready (2x), responsive via `srcset`/`sizes`, WebP/AVIF with a fallback, compressed; lazy-load below the fold.
- **Source by fit**:
  - Generated SVG/vector art drawn in the artifact — preferred for illustrations and product visuals; zero licensing concerns, always crisp
  - Unsplash, Pexels, Pixabay — photography; watermark-free, royalty-free, commercial use, no attribution required
  - Wikimedia Commons / Openverse — archival and scientific imagery; check the per-image CC license
  - Anything else: do not hotlink random URLs; if a source cannot be licensed cleanly, use generated art instead
- **Record it** — every downloaded image gets a one-line note in the delivery: source URL + license. An image without a license note is a defect.

## 6. The direction file (design intent, made visible)

Before writing the artifact, write `.design/direction.md`:

```markdown
# Direction — <one-line concept>
PRODUCT / USER / PRIMARY GOAL
VISUAL DIRECTION — the character in one sentence
HIERARCHY — what dominates
LAYOUT — the composition idea
TYPOGRAPHY — display + body + strategy
COLOR — the palette with a reason per color
DENSITY / INTERACTION / RESPONSIVE STRATEGY
MOTION — personality and role
IMAGERY — none | illustration | photography | mixed, and why
SIGNATURE — the one memorable element
```

This file is the contract. The critique pass judges the artifact against it.

## 7. Motion system

Motion is part of the visual language, not decoration. Decide the personality (precise, calm, editorial, cinematic…), a duration scale, and easing. Principles:

- **Causality** — movement explains where something came from (a dropdown emerges from its trigger; a drawer from its edge)
- **Hierarchy** — not everything moves; stillness is rhythm; a quiet section after a motion-heavy one reads as sophistication
- **Choreography** — staggered, grouped, with a beginning/middle/resolution when multiple things move
- **Performance + accessibility** — transforms/opacity only; `prefers-reduced-motion` replaces movement with fades and must never lose meaning
- If the user notices the animation before the content, it is too strong.

## 8. References are design input, not pixel instructions

Extract composition, hierarchy, spacing, typography, rhythm, color relationships from references. Synthesize multiple references; never reproduce incidental details. When the real subject's site is reachable, fetch it before designing from memory.

## 9. Anti-generic audits (run before delivery)

**AI-slop audit** — check for: default rounded rectangles, repetitive card grids, arbitrary gradients, glassmorphism, glow/blur noise, pills everywhere, giant centered headings with weak body copy, predictable section order (hero → logo strip → three cards → testimonials → pricing), uniform component sizing, fake dashboards/metrics/logos/graphs, "Trusted by" strips, decorative blobs/orbs/rings/sparkles, gradient text. For each hit ask: *is this here because the product needs it, or because AI often generates it?* Redesign the latter.

**The three-most-generic test** — identify the three most generic aspects of the page and replace each with a stronger decision.

**Genericness comparison** — imagine three other generators produced the same brief. Whatever would be identical across all four is where more originality is needed.

**Authorship test** — could someone identify this product's visual language without seeing its logo? Does it have an opinion? Could ten different AI models generate something nearly identical?

**Memorability** — at least one thing the user will remember. Not manufactured with gimmicks.

## 10. The removal pass

Always finish with subtraction: identify elements that can be removed, combined, simplified, de-emphasized, or converted from decorative to functional. When the page feels busy, remove elements before adding styling. When it feels weak, improve hierarchy → typography → spacing → composition → contrast before adding ornament.

## 11. QA rubric

Score 1–10 on each; multiple weak dimensions means keep working: hierarchy, composition, typography, spacing, alignment, consistency, distinctiveness, usability, responsiveness, motion, color, polish.

## 12. Final self-review

Before delivering: What is the focal point? The primary action? Does the type feel intentional? The spacing systematic? The palette coherent? Does anything look unnecessarily generic? Anything louder than it should be? Does mobile feel designed rather than compressed? Are states believable? Is the composition strong without decoration? Would an experienced designer call this finished? Is the motion purposeful? Could anything be removed without weakening the design? If yes — remove it.

## 13. Master principle

**Do not generate a web page. Design a product.**

CONTENT → HIERARCHY → COMPOSITION → SYSTEM → INTERACTION → MOTION → POLISH.

Prefer intentionality over decoration, hierarchy over novelty, identity over trends, subtraction over accumulation, an unusual good idea over a familiar mediocre one. Ask not "how can I make this look impressive?" — ask **"what would an excellent design team choose here?"** Then choose it.
