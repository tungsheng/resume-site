# Resume Site

A Bun-powered portfolio and resume site for Tony Lee. It serves five public pages, loads resume content from YAML, and can export the public resume to PDF.

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Main Routes

- `/` - portfolio landing page
- `/project/cloud-inference-platform` - flagship project walkthrough
- `/experiments` - checked-in experiment results
- `/about` - profile and contact page
- `/resume/tony-lee` - public resume view with PDF download

## Checks

```bash
bun run check
```

To run integration tests, keep the server running in another terminal and then run:

```bash
bun run test:integration
```

## Notes

- Resume files live in `resumes/` and are loaded at request time.
- PDF export needs a local Chrome or Chromium binary. Set `PUPPETEER_EXECUTABLE_PATH` if Bun cannot find one automatically.
- The app has no admin portal, login flow, or database-backed settings layer.

## More Docs

- [Developer guide](./DEVELOPER.md)
- [Resume data format](./docs/resume-data.md)
- [Deployment notes](./docs/deployment.md)
