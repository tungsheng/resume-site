# Resume PDF fonts

Static instances of **Inter 4.001** (`Version 4.001;git-9221beed3`, OFL — see
`LICENSE.txt`). `../pdf-fonts.ts` embeds them as data URLs in the HTML that
headless Chrome prints to `resume.pdf`; the website never loads them.

| File                          | opsz | wght | Used by                                              |
| ----------------------------- | ---- | ---- | ---------------------------------------------------- |
| `Inter-Regular.woff2`         | 14   | 400  | body text, contacts, dates                           |
| `Inter-Medium.woff2`          | 14   | 500  | header tagline                                       |
| `Inter-SemiBold.woff2`        | 14   | 600  | titles, companies, schools, skill categories         |
| `Inter-Italic.woff2`          | 14   | 400  | the labs note (italic)                               |
| `InterDisplay-SemiBold.woff2` | 32   | 600  | the name only (family `ResumePDFDisplay`)            |

**Why static, not the variable font.** Chrome's PDF backend (Skia) cannot embed
a variable font as a font program, so it drew every glyph as a Type 3 picture,
and text extraction (what an ATS parser does) lost the word spaces in the name
and the SemiBold titles: `TonyLee`, `StaffSoftwareEngineer`. Static instances
embed as TrueType (CID) subsets with normal spacing.

**Why these five.** Chrome sets the `opsz` axis from the CSS pixel size
(`font-optical-sizing: auto`). Every run of body text is under 14px, so it
clamps to the axis minimum, 14; only the 24pt (32px) name reaches the Display
end. The variable-font PDF named that subset
`InterVariable_opsz200000_wght2580000`, which is CoreText writing opsz 32 and
wght 600 as hex 16.16 fixed-point. Add an instance here before using a new
weight or style in `document-css.ts`, or Chrome will synthesize one.

## Regenerate

The sources are Inter's two variable fonts, removed from the tree once these
instances replaced them and read back from git history (unchanged since
`7f5e897`; sha256 `693b77d4…a8e3` roman, `e564f652…262a` italic). Run from this
directory with a Python that has fontTools 4.64.0 and brotli 1.2.0; other
versions can produce different (but equivalent) bytes.

Provenance: the committed files were first generated on 2026-10-08 with a
brotli shim (Bun's `node:zlib`) while the machine's Python 3.13 was broken; the
same day, this block run verbatim with real fontTools 4.64.0 + brotli 1.2.0 on
Python 3.13.12 reproduced all five files byte-for-byte (`cmp`).

```sh
src=$(mktemp -d)
trap 'rm -rf "$src"' EXIT
git show 7f5e897:./InterVariable.woff2        > "$src/InterVariable.woff2"
git show 7f5e897:./InterVariable-Italic.woff2 > "$src/InterVariable-Italic.woff2"
inst() { python -m fontTools.varLib.instancer --no-recalc-timestamp -q "$@"; }
inst "$src/InterVariable.woff2"        opsz=14 wght=400 -o Inter-Regular.woff2
inst "$src/InterVariable.woff2"        opsz=14 wght=500 -o Inter-Medium.woff2
inst "$src/InterVariable.woff2"        opsz=14 wght=600 -o Inter-SemiBold.woff2
inst "$src/InterVariable-Italic.woff2" opsz=14 wght=400 -o Inter-Italic.woff2
inst "$src/InterVariable.woff2"        opsz=32 wght=600 -o InterDisplay-SemiBold.woff2
# The instancer names every instance "InterVariable". Give each its own
# PostScript name: it becomes the PDF's /BaseFont, and CoreText keys fonts by it.
python - <<'EOF'
from fontTools.ttLib import TTFont
for ps in ("Inter-Regular", "Inter-Medium", "Inter-SemiBold", "Inter-Italic", "InterDisplay-SemiBold"):
    font = TTFont(f"{ps}.woff2", recalcTimestamp=False)
    family, style = ps.replace("InterDisplay", "Inter Display").split("-")
    ribbi = style in ("Regular", "Italic")
    names = font["name"]
    unique_id = names.getDebugName(3).rsplit(";", 1)[0] + ";" + ps
    for name_id in (1, 2, 3, 4, 6, 16, 17, 25):
        names.removeNames(nameID=name_id)
    for name_id, value in (
        (1, family if ribbi else f"{family} {style}"),
        (2, style if ribbi else "Regular"),
        (3, unique_id),
        (4, f"{family} {style}"),
        (6, ps),
    ):
        names.setName(value, name_id, 3, 1, 0x409)
    font.save(f"{ps}.woff2")
EOF
```
