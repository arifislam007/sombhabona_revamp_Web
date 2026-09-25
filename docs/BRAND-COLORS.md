# Sombhabona Brand Colors

Single source of truth for the website palette. The values below are implemented as CSS variables in
[`apps/web/app/globals.css`](../apps/web/app/globals.css); components use the Tailwind token classes
(`bg-primary`, `text-foreground`, ...) and should not hard-code hex values.

## 1. Core palette

| Name | Hex | Swatch role | Target share |
|---|---|---|---|
| **Paper Cream** | `#FBF8EF` | Page background | cream + mint ≈ **45%** |
| **Mint Mist** | `#E4F3EA` | Alternate section background, muted surfaces | (with cream) |
| **Shonar Green** | `#0B6E4F` | Primary brand color: buttons, links, eyebrows, icons | ≈ **30%** |
| **Forest Ink** | `#0E2A22` | Text, dark sections (impact, footer) | ≈ **12%** |
| **Sunrise Yellow** | `#FFC727` | Donate call-to-action, stars, highlights | ≈ **8%** |
| **Sprout Lime** | `#8CCB3F` | Numerals on dark, light icon tints, dark-mode primary | ≈ **5%** |

Usage ratio: **cream/mint 45% · green 30% · ink 12% · yellow 8% · lime 5%**. Yellow and lime are accents:
if a screen feels yellow or lime-heavy, remove some.

### Derived values (only these, do not invent new shades)

| Purpose | Hex | Derivation |
|---|---|---|
| Card / popover surface (light) | `#FEFCF6` | Cream nudged toward white |
| Muted text (light) | `#55685F` | Ink at ~70% over cream |
| Green hover | `#095A41` | Green 85% + ink 15% |
| CTA hover | `#E7B726` | Yellow 90% + ink 10% |
| Border (light) | `rgba(14, 42, 34, 0.14)` | Ink at 14% |
| Dark page background | `#0A1F19` | Ink shaded darker |
| Dark muted surface | `#0D382B` | Ink 80% + green 20% |
| Dark muted text | `#B4BAB2` | Cream at ~70% over ink |
| Dark primary hover | `#A3D962` | Lime lightened |
| Dark border | `rgba(228, 243, 234, 0.14)` | Mint at 14% |
| Error (light / dark) | `#B42318` / `#F97066` | Off-palette on purpose: errors need a recognisable red. Errors only. |

## 2. Design tokens (what the code uses)

Defined in `globals.css` as `:root` (light) and `.dark`, exposed to Tailwind through `@theme inline`.

| Token / Tailwind class | Light | Dark |
|---|---|---|
| `background` | `#FBF8EF` | `#0A1F19` |
| `foreground` | `#0E2A22` | `#FBF8EF` |
| `card`, `popover` | `#FEFCF6` | `#0E2A22` |
| `card-foreground`, `popover-foreground` | `#0E2A22` | `#FBF8EF` |
| `primary` | `#0B6E4F` | `#8CCB3F` |
| `primary-hover` | `#095A41` | `#A3D962` |
| `primary-foreground` | `#FBF8EF` | `#0E2A22` |
| `secondary` | `#8CCB3F` | `#0B6E4F` |
| `secondary-foreground` | `#0E2A22` | `#FBF8EF` |
| `muted` | `#E4F3EA` | `#0D382B` |
| `muted-foreground` | `#55685F` | `#B4BAB2` |
| `accent` | `#FFC727` | `#FFC727` |
| `accent-foreground` | `#0E2A22` | `#0E2A22` |
| `cta` (Donate buttons) | `#FFC727` | `#FFC727` |
| `cta-hover` | `#E7B726` | `#E7B726` |
| `destructive` | `#B42318` | `#F97066` |
| `border` | `rgba(14,42,34,.14)` | `rgba(228,243,234,.14)` |
| `input-background` | `#FEFCF6` | `#0D382B` |
| `ring` (focus outline) | `#0B6E4F` | `#8CCB3F` |

Sections that are dark in both modes use ink directly: `bg-[#0E2A22] dark:bg-[#0A1F19]` (impact stats,
footer). The relief section uses `from-[#0B6E4F] to-[#0E2A22]`.

## 3. Roles: which color for what

| Element | Use |
|---|---|
| **Donate / main call-to-action** | `bg-cta hover:bg-cta-hover text-accent-foreground border-2 border-accent-foreground` (yellow, ink text, ink border) |
| Secondary buttons, form submit | `bg-primary hover:bg-primary-hover text-primary-foreground` |
| Body text | `text-foreground` (ink) |
| Secondary text | `text-muted-foreground` |
| Headings | `text-foreground` (ink) |
| Links, eyebrows, active filters | `text-primary` (green; lime automatically in dark mode) |
| Page sections | Alternate `bg-background` (cream) and `bg-muted` / `bg-muted/60` (mint) |
| Dark sections | Ink (`#0E2A22` / `#0A1F19`), with cream text and lime or yellow numerals |
| Icon chips | Green icon on `bg-primary/10`, `bg-secondary/25` (lime tint) or `bg-muted`. Rotate them, no rainbow. |
| Star ratings | `text-accent-foreground fill-accent` (yellow fill, ink outline) |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-primary` |
| Errors | `text-destructive`, `border-destructive` |

### Keeping the ratio

- **Yellow (~8%):** Donate buttons, the nav Donate button, star ratings, one accent per dark section.
  Never a large yellow background. Never yellow text on cream.
- **Lime (~5%):** numerals on ink, lime-tint icon chips (`bg-secondary/25`), the dark-mode primary.
  Never lime text on a light background.
- **Ink (~12%):** text plus the impact and footer sections. Do not put ink slabs elsewhere.
- **Green (~30%):** buttons, links, headings accents, the relief section, icon chips.

## 4. Accessible pairings (WCAG contrast)

Ratios were computed, not estimated. Body text needs **4.5:1**, large text and UI elements need **3:1**.

| Text on background | Ratio | OK for |
|---|---|---|
| Ink `#0E2A22` on Cream `#FBF8EF` | 14.4 | all text |
| Ink on Mint `#E4F3EA` | 13.3 | all text |
| Muted `#55685F` on Cream | 5.6 | all text |
| Muted on Mint | 5.2 | all text |
| Green `#0B6E4F` on Cream | 5.9 | all text (links, eyebrows) |
| Green on Mint | 5.5 | all text |
| Cream on Green | 5.9 | all text (primary buttons) |
| White on Green | 6.3 | all text |
| Ink on Yellow `#FFC727` | 9.8 | all text (Donate button) |
| Ink on Lime `#8CCB3F` | 7.8 | all text |
| Yellow on Ink | 9.8 | all text (dark sections) |
| Lime on Ink | 7.8 | all text (numerals) |
| Cream on Ink | 14.4 | all text (footer) |
| Dark mode: Cream on `#0A1F19` | 16.2 | all text |
| Dark mode: `#B4BAB2` on `#0E2A22` | 7.7 | all text |
| Dark mode: Lime on `#0A1F19` | 8.8 | all text |
| Error `#B42318` on Cream | 6.2 | all text |

### Combinations that FAIL (never use)

| Combination | Ratio | Use instead |
|---|---|---|
| White or cream text on **Yellow** | ~1.6 | Ink text |
| White or cream text on **Lime** | ~2 | Ink text |
| Green text on **Lime** | 3.2 | Ink text |
| Green text on **Yellow** | 4.0 | Ink text |
| Yellow text on **Green** | 4.0 | Large text (24px+) or decorative icons only |
| Green text on **Ink** | 2.4 | Lime or cream text |
| Yellow or lime **text** on Cream | ~1.5 | Never. They are fills only, with ink text on top. |

## 5. Rules for future work

1. **Use tokens, not hex.** Write `bg-primary`, not `bg-[#0B6E4F]`. Hard-coded hex breaks dark mode.
   (The only hex in components is the always-dark ink sections listed in section 2.)
2. **On yellow or lime, the text is ink** (`text-accent-foreground` / `text-secondary-foreground` /
   `text-foreground`). Never `text-white` there.
3. **On `bg-primary`, use `text-primary-foreground`**, not `text-white`: primary turns lime in dark mode,
   and white on lime fails.
4. **Yellow on a light background needs an ink border or ink text** to stay visible (yellow on cream is
   only ~1.5:1). That is why Donate buttons have `border-2 border-accent-foreground`.
5. **Don't add new colors.** For a new status or highlight, reuse a tint of an existing brand color
   (`bg-primary/10`, `bg-secondary/25`, `bg-accent/30`). The only allowed outside color is the error red.
6. **Logo:** the green logo needs a light backing on dark photos. Over the hero it sits on a cream chip
   (`bg-[#FBF8EF]`). Do not place it directly on ink or green.
7. **Hover** must not rely on color alone: keep the small lift or shadow on buttons and cards.
8. **Dark mode:** green is a surface, never text. Text and links become lime, and yellow stays as the CTA.
9. After changing any value, re-check the contrast table above and the failing-combinations list.

## 6. Copy-paste snippets

```css
/* Light */
--background: #fbf8ef;  --foreground: #0e2a22;
--primary: #0b6e4f;     --secondary: #8ccb3f;
--muted: #e4f3ea;       --accent: #ffc727;

/* Dark */
--background: #0a1f19;  --foreground: #fbf8ef;
--primary: #8ccb3f;     --secondary: #0b6e4f;
--muted: #0d382b;       --accent: #ffc727;
```

```tsx
{/* Donate button */}
<a className="border-2 border-accent-foreground bg-cta px-6 py-3 font-bold text-accent-foreground hover:bg-cta-hover">Donate</a>

{/* Primary button */}
<button className="bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary-hover">Volunteer</button>

{/* Section eyebrow */}
<span className="text-sm font-semibold uppercase tracking-widest text-primary">Our Story</span>

{/* Icon chip (rotate primary/10, secondary/25, muted) */}
<div className="bg-secondary/25 rounded-2xl p-3"><Icon className="text-primary" /></div>
```

## 7. History

- **Before:** blue `#1E3A8A` primary with orange `#C2410C` call-to-action.
- **Now:** the green and yellow brand palette above, matching the Sombhabona logo (green and yellow).
