# Figura

A browser canvas for diagrams of every kind: automata (LTS, NFA, NBA), category diagrams,
circuits, geometric constructions, ZX-calculus. It exports clean **TikZ** you can paste straight
into a LaTeX document, and reads that TikZ back in.

No install, no account, no build step. Everything runs in your browser and is saved there.

Sibling project of [ZX Draw](https://github.com/zhoujasper/ZX-Draw).

## Features

- **Shapes**: circles, boxes, diamonds, triangles, dots, text and pictures. Fill, border (width,
  dashes, double), rounded corners, rotation. Shapes grow with their text.
- **Math everywhere**: `$…$`, `\(…\)`, `$$…$$` and `\begin{align}…` in shapes and labels,
  typeset with KaTeX on the canvas.
- **Lines**: arcs, Bézier curves, S-curves and elbows; plain, double, wavy or zigzag; arrow heads
  of many kinds at either end, rays, self-loops, labels you can drag along the line or to either side.
- **Ports**: line ends stay on the side of a shape where you put them and spread out neatly; the
  shape grows when a side gets crowded.
- **Fast wiring**: connect many shapes to one in a single click, hold S to wire from the selection,
  hold P for parallel lines, drag a stroke through shapes to chain them.
- **Constructions**: midpoint, perpendicular, bisector, parallel, intersection, reflection, centre
  and compass circles that follow the points they are built on.
- **Pages**, layers, alignment, grid snapping, minimap, per-page lock, laser pointer.
- **Your own toolbar**: layouts for general use, ZX-calculus and category theory, or build one
  with your own buttons and share it as a `.figtool` file.
- **Rebindable shortcuts** and a built-in guide with animated demos (press `?`).
- **Works on desktop and phone.**

## Export

| Format | Notes |
|---|---|
| **TikZ** (default) | Needs only `\usepackage{tikz}` and the libraries named in its first line. |
| **figura.sty** | Shorter code for documents that load [`figura.sty`](figura.sty). |
| **PNG / SVG** | Math typeset with the TeX fonts. |
| **.figura** | Every page, for opening again later. |

TikZ and `.tex` files can be imported back, including pasted code.

### Using it in LaTeX

```latex
\documentclass{article}
\usepackage{tikz}
\usetikzlibrary{arrows.meta, shapes.geometric}

\begin{document}
% paste the exported tikzpicture here
\end{document}
```

Or put `figura.sty` next to your `.tex` file and add `\usepackage{figura}` for the shorter form.

## Running locally

It is a static site. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8767
```

Then visit http://localhost:8767.

## Files

| File | |
|---|---|
| `index.html` | Page shell |
| `app.js` | The whole editor |
| `style.css` | Styling |
| `figura.sty` | LaTeX style file |

## License

[MIT](LICENSE)
