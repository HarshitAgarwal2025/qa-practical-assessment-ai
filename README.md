# QA Practical Assessment – Toolshop

## Overview

This repository contains my submission for the QA Practical Assessment based on the **Toolshop** e-commerce application.

The assessment demonstrates the use of AI throughout the QA lifecycle, including requirement analysis, test planning, test design, automation, debugging, and documentation.

## Repository Structure

```text
.
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── prism_playwright/
├── FunctionalTestCase.csv
├── project-info.md
└── README.md
```

## Contents

* **project-info.md** – Overview of the project and AI-assisted QA workflow followed during the assessment.
* **ai-prompts/** – Prompt history showing how AI was used throughout different stages of the QA lifecycle.
* **FunctionalTestCase.csv** – Manual functional test cases.
* **prism_playwright/** – Playwright-based UI automation framework and related implementation.
* **API Automation** – Playwright API automation covering Login, Cart and Invoice Generation scenarios.
* **execution-evidence/** – Screenshots showing successful UI and API execution.

## Approach

The assessment is being completed incrementally. AI is used as a collaborative assistant to generate initial drafts, analyse requirements, refine documentation, and support QA activities. All AI-generated outputs are reviewed and refined before being accepted.

As additional assessment activities are completed, the corresponding documentation under `project-info.md` and `ai-prompts/` will be updated accordingly.

## Automation Coverage

### UI Automation

- User Registration
- User Login
- Product Search
- Shopping Cart
- Checkout
- Order Placement

### API Automation

- User Login
- Product Search and Cart Creation
- Invoice Generation
## Execution

### UI Tests

bash
npx playwright test

### API Tests

bash
npx playwright test "tests/API Test"