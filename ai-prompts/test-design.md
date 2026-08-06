*** Manual Test Design ***

*** Objective ***

Use AI to assist in designing manual test cases for the Toolshop application through an iterative refinement process.

Prompt 1

Generate a set of manual test cases for the Toolshop application covering the application's major business workflows. Present the output in a structured table with Test Case ID, Module, Test Scenario, Preconditions, Test Steps, Test Data, and Expected Result. Create only 10–12 test cases covering the application's critical end-to-end user journeys.

 Outcome

- AI generated an initial set of manual test cases.
- Most scenarios focused on positive functional workflows.
- Missing negative, validation, edge case and non-functional coverage.
- Priority and Test Type were also missing.

Review

The generated test cases provided a good starting point but required refinement.

Identified improvements:

- Include negative scenarios.
- Include validation scenarios.
- Include edge/boundary scenarios.
- Add representative non-functional scenarios.
- Add Priority and Test Type.
- Improve end-to-end business workflow coverage.
- Avoid duplicate scenarios.

*** Prompt 2 ***

The generated test cases provide a good starting point. Please refine the test suite by improving its overall coverage. Include negative, validation, edge/boundary, and applicable basic non-functional scenarios while keeping the total number of test cases between 10 and 12. Replace less valuable happy-path test cases with higher-value scenarios where appropriate instead of simply increasing the count. Also add Priority and Test Type columns, avoid duplicate scenarios, and ensure the final test suite provides balanced coverage of the application's critical end-to-end business workflows.

** Outcome **

The refined output included:

- Functional scenarios
- Negative scenarios
- Validation scenarios
- Edge/boundary scenarios
- Basic non-functional scenario
- Business priority
- Test Type
- Better end-to-end coverage

The final test cases were reviewed manually before being added to the assessment deliverables.
