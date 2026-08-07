# QA Practical Assessment – Toolshop

## Overview
This repository contains my submission for the QA Practical Assessment based on the **Toolshop** e-commerce application.

The assessment demonstrates how I used ChatGPT and Cursor AI during the QA lifecycle for requirement analysis, test planning, manual testing, UI/API automation, debugging and documentation. All AI-generated outputs were reviewed and updated before using them in the project.

## Repository Structure

├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── prism_playwright/
├── execution-evidence/
├── FunctionalTestCase.csv
├── project-info.md
├── tool-workflow.md
├── exploratory-testing-notes.md
└── README.md

## Contents

* **project-info.md** – Overview of the project and AI-assisted QA workflow followed during the assessment.
* **ai-prompts/** – Prompt history showing how AI was used throughout different stages of the QA lifecycle.
* **FunctionalTestCase.csv** – Manual functional test cases.
* **prism_playwright/** – Playwright-based UI automation framework and related implementation.
* **API Automation** – Playwright API automation covering Login, Cart and Invoice Generation scenarios.
* **execution-evidence/** – Screenshots showing successful UI and API execution.

## Approach

This repository contains the completed submission for the QA Practical Assessment. AI is used as a collaborative assistant to generate initial drafts, analyse requirements, refine documentation, and support QA activities. All AI-generated outputs are reviewed and refined before being accepted.

## Automation Coverage

### UI Automation

- User Registration
- User Login
- Product Search
- Shopping Cart
- Checkout
- Order Placement

## Test Execution

### Smoke Suite

npx playwright test --grep "@Smoke"

### Regression Suite
npx playwright test --grep "@Regression"

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

### Complete Test Suite
npx playwright test

### Execution report is generated under:
prism_playwright/playwright-report/

### Execution screenshots are available in:
execution-evidence/

