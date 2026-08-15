---
name: deep-design-qa
description: Mandatory visual quality-assurance loop for design work: render the artifact headlessly, run the critic pass (a subagent forbidden from writing code that produces a structured visual diagnosis), fix findings, re-render, compare. Use this Skill for every HTML/CSS/SVG design artifact before delivering.
---

# Design QA loop

Every design artifact MUST pass through this loop before delivery. A design nobody looked at is not done. The loop has three stages: **render → critic → fix-and-compare**.

## 1. Render

Locate Edge or Chrome, then render headless with a fresh temp profile (Chrome's crash reporter and IPC fail inside sandboxes without these flags):

```powershell
$browsers = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe")
$browser = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1
$tmp = "<artifact-dir>\.chrome-tmp"
& $browser --headless=new --disable-gpu --no-first-run --disable-crash-reporter --user-data-dir="$tmp" --hide-scrollbars --window-size=1440,<tall-enough> --screenshot="<artifact-dir>\full.png" "file:///<artifact-dir>/index.html" 2>$null
```

If the render fails with mojo/crashpad access errors, retry once with a wider sandbox permission (danger-full-access) — justified for local visual QA — or render with `--virtual-time-budget=4000 --dump-dom` and inspect the DOM instead.

Render at least two viewports: desktop (1440 wide) and mobile (390 wide). Check the mobile shot for overflow and broken stacking.

## 2. Critic pass

The critique is the critic's job, not yours. **The main agent never attempts to view the screenshot itself** — reading images is reserved for the critic subagent, which reports back a structured diagnosis. Spawn a **subagent** that is forbidden from writing code, with:

**persona:**

> You are a ruthless design critic reviewing a rendered web page. You never write or edit code — you diagnose. Judge what you see as a principal designer would.

**prompt:**

> Read the artifact file `<path>/index.html` and its rendered screenshots `<path>/full.png` (desktop) and `<path>/mobile.png` (mobile). Ground your diagnosis in what you can actually observe: if you can view images, critique them visually; if reading an image fails because you have no image input, do not retry it — fall back to pixel sampling the PNG programmatically plus a DOM dump to verify layout. Produce a structured diagnosis with exactly these sections:
>
> 1. Hierarchy — does the eye know where to go first?
> 2. Composition — does the layout feel intentional from its silhouette?
> 3. Typography — does type establish hierarchy and personality?
> 4. Spacing — is the rhythm systematic (one scale, no near-equal gaps)?
> 5. Alignment — do elements belong to one visual system?
> 6. Responsiveness — does mobile feel designed, not compressed?
> 7. Interaction — are states (hover/focus/active/loading/error) believable and complete?
> 8. Motion — does movement add value and stay controlled? Is reduced-motion honored?
> 9. Genericness — name the three most generic aspects and the AI-slop patterns present, if any
> 10. Verdict per dimension: a 1–10 score for hierarchy, composition, typography, spacing, alignment, consistency, distinctiveness, usability, responsiveness, motion, color, polish
>
> End with a Top-5 fixes list: the five concrete changes with the biggest quality gain, most specific first. Report only — do not modify files.

If no subagent provider is available, perform the critic pass yourself in one structured block following the same template BEFORE writing any fix — and in that case too, never attempt to read the image yourself; pixel-sample instead. The rule is the same either way: **diagnosis first, code after.**

## 3. Pixel sampling (for a critic without vision)

```powershell
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("<artifact-dir>\full.png")
$samples = @(@{x=720;y=90;n="nav"}, @{x=400;y=480;n="hero-mid"}, @{x=90;y=760;n="cta"})
foreach ($s in $samples) {
  $p = $bmp.GetPixel($s.x, $s.y)
  "$($s.n): rgb($($p.R),$($p.G),$($p.B))"
}
```

Verify: background bands sit where sections should be, accent pixels appear at the accent elements, no giant blank bands. Also dump the DOM (`--dump-dom`) and confirm scripted behavior executed. A vision model on the Design session is always preferable — if the model reports no image input, say so in the delivery notes rather than claiming a visual review happened.

## 4. Fix and compare

Apply the Top-5 fixes (and any additional rubric findings), then re-render BOTH viewports and compare against the first screenshots. Confirm each fix landed and nothing regressed. Repeat the critic pass if the changes were structural. A fix that cannot be verified in the render is not a fix.

## 5. Design memory

At the end of the session, append to `.design/memory.md` (create it if absent): the tokens used (palette, type pairs, spacing scale, radii), what the critic caught and how it was fixed, and one lesson for next time. The next session starts by reading this file — designs should compound, not restart from zero.

## 6. Delivery notes

Deliver with: what was rendered and at which viewports, whether the critique was visual or pixel-sampled, the critic's top findings and which were fixed (with before/after evidence), and the final rubric scores. A "clean pass" still lists what was verified and how.
