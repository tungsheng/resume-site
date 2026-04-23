# Resume Data Format

The site currently serves one checked-in public resume from `resumes/tony-lee.yaml`.

## Recommended Format

```yaml
meta:
  version: 2
  slug: "your-name"
  updatedAt: "2026-04-18"

profile:
  name: "Your Name"
  headline:
    - "Staff Software Engineer"
    - "Cloud Platform"
  contacts:
    email: "you@example.com"
    linkedin: "your-linkedin-handle"
  summary: |
    Short summary paragraph.

skills:
  - category: "Languages"
    items:
      - "TypeScript"
      - "Go"

projects:
  title: "Selected Projects"
  items:
    - title: "Cloud Inference Platform"
      highlights:
        - "Built queue-aware autoscaling on Kubernetes."

experience:
  - role: "Staff Software Engineer"
    company: "Example Corp"
    period:
      start: "2024"
      end: "Present"
    highlights:
      - "Led platform work across product and infrastructure."

education:
  - school: "University Name"
    degree: "B.S. Computer Science"
    period:
      start: "2015"
      end: "2019"

certifications:
  - name: "AWS Certified Developer"
    issuer: "Amazon"
    date: "2024"
```

The normalizer turns that source into the internal `ResumeData` shape used by the public resume page, print preview, and PDF renderer.

## Normalization Rules

The loader intentionally accepts a few equivalent field names.

Those legacy aliases are covered by unit tests, so the public `resumes/` directory only needs the active checked-in resume files.

Supported aliases include:

- `profile` or `header`
- `headline` or `badges`
- `role`, `title`, `position`, or `jobTitle`
- `company`, `organization`, `employer`, or `client`
- `projects.items` or `projects.entries`
- `education` or `studies`
- `certifications` or `certificates`
- `skills` as category arrays or as an object map of comma-separated strings
- `highlights`, `achievements`, or `bullets`
- `name`, `title`, `project`, or `heading` for project titles
- `issuer`, `authority`, or `provider` for certificate issuers

Date ranges can be expressed either as direct fields:

```yaml
startDate: "2024"
endDate: "Present"
```

or as a nested period:

```yaml
period:
  start: "2024"
  end: "Present"
```

The normalizer also accepts `period.from` / `period.to` and `period.startDate` / `period.endDate`.

The public route is `/resume`, and the server always loads `resumes/tony-lee.yaml`.

## Presentation Overrides

Resume presentation settings are not stored in YAML. The checked-in public theme and layout live in `src/features/resume/presentation.ts`.

## Current Resume-Site Notes

- The checked-in public resume currently uses the `minimal-timeline` layout template.
- The public resume page defaults to a browser-friendly web view, but print preview and PDF export still use the same canonical print document.
