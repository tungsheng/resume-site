# Resume Data Format

Resume files live in `resumes/` and are loaded by slug.

- `resumes/tony-lee.yaml` is the current v2-style example
- `resumes/tony-lee-1.yaml` is a legacy-format fixture kept for compatibility tests

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

## Normalization Rules

The loader intentionally accepts a few equivalent field names.

Supported aliases include:

- `profile` or `header`
- `headline` or `badges`
- `role`, `title`, `position`, or `jobTitle`
- `projects.items` or `projects.entries`
- `certifications` or `certificates`
- `skills` as category arrays or as an object map of comma-separated strings

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

## Slug Rules

The public route is `/resume/:name`, and the loader sanitizes the requested slug.

- Use letters, numbers, `_`, and `-`
- Avoid spaces and punctuation in filenames
- `your-name.yaml` is served at `/resume/your-name`

## Presentation Overrides

Resume-specific presentation settings are not stored in YAML. They live in `src/resume-presentation.ts`.

Use that file when a resume needs:

- a custom theme color
- a non-default layout template
