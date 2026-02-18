# Tony Lee Resume Project Improvement Plan

## Goals
- Keep `resumes/tony-lee.yaml` easy to maintain as the source of truth.
- Support schema evolution without breaking old resume files.
- Improve output quality and reduce manual edits for each update cycle.

## Current Gaps
- Strict parser assumptions make small YAML format changes fail hard.
- Date and section structures are inconsistent across resume files.
- No explicit schema versioning or migration strategy.
- Limited test coverage for multiple YAML schema variants.

## Phase 1: Stabilize Data Contract (Done)
- Add normalization in the loader so both legacy and v2-style YAML are accepted.
- Normalize equivalent field names (for example: `header`/`profile`, `title`/`role`, `certificates`/`certifications`).
- Support skills as either object maps or category arrays.
- Make optional sections render only when data exists.

## Phase 2: Schema Governance
- Add a formal JSON Schema (or Zod schema) for the normalized contract.
- Add CI validation for all files under `resumes/`.
- Add a migration helper that rewrites legacy files into v2 format.
- Pin a schema version policy (`meta.version`) and document deprecation windows.

## Phase 3: Content Quality and Reuse
- Add reusable phrase libraries for role impact statements.
- Introduce optional `projects` and `impactMetrics` sections in the schema.
- Add linting rules for weak bullets (passive voice, missing outcomes, repeated phrasing).
- Add a changelog field (`meta.changeLog`) for periodic update notes.

## Phase 4: Delivery and UX
- Add per-resume layout config (single-column fallback, section ordering).
- Add contact link flexibility (full LinkedIn URL, website, GitHub).
- Add print/layout smoke tests for PDF and browser preview.

## Success Metrics
- Resume load failures from schema mismatch: 0.
- Time to update monthly resume content: under 20 minutes.
- Test coverage includes both legacy and v2 resume fixtures.
- No empty sections in rendered output.
