@AGENTS.md

# DeCourcy.com — Design & Style Guide

This site hosts business-related quick builds: example workflows, conceptual process diagrams, and demo pages. All pages must follow these rules.

## Typography

- Use modern, tech-forward fonts (the homepage uses Libre Baskerville for the title treatment; inner pages should use clean sans-serif fonts like Inter, DM Sans, or similar)
- Prefer glyphs, icons, and symbols over decorative elements
- No photo images anywhere on the site

## Color Palette

- **Background**: `#071a0e` (dark forest green — used on the homepage, use on all pages)
- **Primary elements**: darker shades of green (`#0d2b18`, `#1a4a2e`, `#143d24`, `#0f3320`)
- **Text**: white or white with reduced opacity for secondary text
- **Contrast/accent lines**: light blue (`#5b9bd5` or similar well-matching light blue) — use for elements that need to stand out against the green palette (connecting lines, highlights, active states, borders that need differentiation)

## Process Flow Diagrams

Most content will be workflow and process visualizations. Follow these rules:

- **Flow direction**: always top to bottom
- **Process boxes**: rectangles with very slight corner rounding (`rounded` or `rounded-sm` in Tailwind, ~4px border-radius)
- **Connectors**: arrows between boxes — use one-way arrows for sequential flow, two-way arrows where the process is bidirectional
- **Arrow color**: light blue accent (`#5b9bd5`) for contrast against green boxes
- **Box fill**: darker green shades from the palette above
- **Box borders**: subtle lighter green or light blue depending on emphasis
- **Labels**: white text inside boxes, keep concise, all caps and bold
- **Step numbering**: each step gets a circled number icon positioned to the left of its box (blue border circle, blue number, dark background fill)
- **Simultaneous steps**: wrap parallel branches in a dashed-border group box with lighter shading (`#0a2314`, border `#5b9bd5/20`), sharing a single step number
- **Decision branches**: Yes/No labels on branch arrows, uppercase bold

## Page Typography

- **Headlines**: all caps (`uppercase`), bold (`font-bold`)
- **Subheadings**: all caps (`uppercase`), smaller font size, bold (`font-bold`), wider tracking
- **No navigation links between pages** — every page stands alone with no back links or cross-page nav

## Animations

- **Scroll fade-in**: all flow elements use Intersection Observer to fade in (opacity 0→1, translateY 16px→0, 0.6s ease-out) as they enter the viewport at 10% threshold
- **Above the fold**: elements visible in the initial viewport trigger immediately on load — no delayed appearance
- Use the `FadeIn` wrapper component for all flow page content

## General Rules

- No photo images — use icons, glyphs, SVG symbols, or CSS-drawn elements only
- Keep layouts clean and minimal
- Pages should feel technical and modern, not decorative
- Consistent spacing and alignment across all workflow elements
- Automatically update this style guide when new patterns are established during iteration
