# Playwright POM Framework

A Playwright + TypeScript Page Object Model (POM) test framework for UI and API tests. This repository contains end-to-end UI tests (POM-style), API tests using a small API client wrapper, fixtures, test data, and utilities such as OCR helpers.

---

## Badges

- Build / CI: (configure in workflow)
- Playwright HTML report: generated under `test-results`

---

## Table of contents
- [About](#about)
- [Quick start](#quick-start)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Configuration (environments)](#configuration-environments)
- [Run tests](#run-tests)
- [Test artifacts & reporting](#test-artifacts--reporting)
- [Project structure](#project-structure)
- [Writing tests](#writing-tests)
- [OCR tests](#ocr-tests)
- [CI example (GitHub Actions)](#ci-example-github-actions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)


## About

This repository implements a Playwright-based test framework using TypeScript and the Page Object Model (POM) pattern. It includes:

- UI tests using POM classes under `src/test/pages`
- API tests using a small APIClient wrapper built on Playwright's `APIRequestContext`
- Utilities for loading environment-specific JSON test data
- An OCR example that takes screenshots and extracts text using `tesseract.js`


## Quick start

1. Clone the repo:

   git clone https://github.com/iqasim/PlaywrightPOMFramework.git
   cd PlaywrightPOMFramework

2. Install dependencies:

   npm ci

3. Install Playwright browsers:

   npx playwright install

4. Run the tests:

   npx playwright test


## Prerequisites
- Node.js 16+ (recommended)
- npm or yarn
- Git
- For UI tests: Playwright browsers (install with `npx playwright install`)


## Install

npm ci

npx playwright install


## Configuration (environments)

The project uses `playwright.config.ts` and supports environment-specific settings via the `TEST_ENV` environment variable. Supported values (present in config): `dev`, `sit`, `uat`. If not set, `dev` is used by default.

Important config properties merged per environment:
- `authURL` — API auth endpoint used by API tests
- `baseURL` — base URL for UI/API operations
- `testDatadir` — folder that contains JSON payloads / UI configs for the environment (e.g., `src/test/resources/dev`)

The helper `loadJsonFile(filename)` resolves files relative to `config.testDatadir`.

Set environment example (Linux/macOS):

TEST_ENV=sit npx playwright test

Windows (PowerShell):

$env:TEST_ENV = "sit"; npx playwright test


## Run tests

Run all tests:

npx playwright test

Run UI tests only:

npx playwright test src/test/tests/uiTests

Run API tests only:

npx playwright test src/test/tests/apiTests

Run a single spec:

npx playwright test src/test/tests/uiTests/loginPage.test.ts

Run a test by name:

npx playwright test -g "Verify user can log in with valid credentials"


## Test artifacts & reporting

- Screenshots are saved by tests (e.g., `screenshots/login-success.png`, `screenshots/receipt.jpg`).
- Playwright trace is enabled `on-first-retry` (configured in `playwright.config.ts`) and traces can be produced by tests.
- HTML report is configured via the reporter; default output directory is `test-results`.


## Project structure (key paths)

- `playwright.config.ts` — main Playwright configuration
- `src/test/tests` — test suites
  - `uiTests` — UI tests
  - `apiTests` — API tests
- `src/test/pages` — Page Object Model classes (LoginPage, HomePage, OCR page, etc.)
- `src/test/fixtures` — fixtures for dependency injection
- `src/test/utils` — utilities (`api-client.ts`, `loadJsonFile.ts`)
- `src/test/resources` — environment-specific test data (dev/sit/uat)
- `src/test/constants` — request constants that load JSON payloads


## Writing tests

- Create or extend Page Objects in `src/test/pages`.
- Add tests under `src/test/tests/uiTests` or `src/test/tests/apiTests`.
- Use `loadJsonFile` to keep payloads in `src/test/resources/<env>`.
- Use fixtures to inject page objects or API clients into tests.


## OCR tests

The OCR example uses `tesseract.js` to extract text from a screenshot taken by a page locator. The test:
- navigates to a sample OCR page,
- ensures the image is visible,
- takes a screenshot of the receipt image to `screenshots/receipt.jpg`,
- runs `tesseract.js` worker to extract text and validates expected strings.

Retry logic is used in the test to account for OCR flakiness.


## CI example (GitHub Actions)

Below is a minimal workflow you can adapt — create `.github/workflows/ci.yml`.

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test --reporter=dot
      - name: Upload test-results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-test-results
          path: test-results
```

Notes:
- OCR tests may require network access to the sample image. Consider marking OCR tests as optional in CI or run behind a stable endpoint.
- For UI tests requiring headed browsers, add `pwsh` steps or set up xvfb if needed.


## Troubleshooting
- Missing browsers: run `npx playwright install`.
- JSON resources not found: ensure `TEST_ENV` is set or that `playwright.config.ts` points to the correct `testDatadir`.
- OCR flaky: increase retries or tune `tesseract.js` params and screenshot region.


## Contributing
- Fork the repo, create a branch, and open a PR.
- Add tests following the POM pattern and include fixtures updates if required.


## License
No license specified. Add a LICENSE file if you want to open-source this project.
