# Zero-JS becomes the default, not an absolute: progressive enhancement per feature

Status: accepted (amends ADR-0003 decision 7)

ADR-0003 committed the site to zero JavaScript with no islands. That absolutism blocks two planned Blog features that are impossible without client JS: search with type-as-you-filter UX, and any reader-interaction write path (e.g. likes). We amend the rule rather than repeal it: **every page must remain static-first and fully functional with JS disabled; an individual feature may ship JS as a progressively-enhanced island only when the feature is impossible without it.** "Nice with JS" is not sufficient — "impossible without it" is the bar. The KaTeX build-time pipeline (ADR-0006), CSS-only nav, and static rendering of all content are unaffected and remain the default posture for future work.
