**_ Project Information _**

## 1.  Project Overview

This assessment focuses on testing the **Toolshop** e-commerce application. The objective is to demonstrate a practical QA approach using AI to assist with requirement analysis, test planning, test design, automation, and other QA activities throughout the testing lifecycle.

The application under test is an e-commerce platform that provides features such as user authentication, product browsing, shopping cart management, checkout, and order management through both a web interface and REST APIs.

## 2.  Primary AI Tool(s) Used

The primary AI tools used for this assessment were ChatGPT and Cursor AI.

ChatGPT was mainly used for requirement analysis, test planning, documentation, test design and reviewing outputs.

Cursor AI was mainly used for automation development, debugging, code generation and code refinement.

All AI-generated outputs were reviewed and validated before being included in the final solution.

AI is being used as a collaborative assistant to support planning, documentation, analysis, and refinement of QA artefacts. All AI-generated content is reviewed and validated before being included in the final deliverables.

## 3.  Providing Project and System-under-Test Context

To obtain more relevant responses, the following project context was provided to the AI before requesting QA artefacts:

- Application Name: Toolshop
- Application Type: E-commerce Web Application
- Assessment objective and expected deliverables
- Required testing scope (UI Testing, API Testing, Smoke Testing, and Regression Testing)
- Known application features and available project information
- Any assumptions required due to limited project documentation

Providing sufficient project context helped generate responses tailored to the Toolshop application instead of generic QA recommendations.

## 4.  Using AI for Requirement Analysis

AI was used to assist with understanding the assessment requirements and planning the overall QA approach.

The process included:

- Understanding the assessment objectives.
- Identifying the required QA deliverables.
- Breaking down the required testing activities.
- Determining what should be included in the Test Planning & Strategy document.
- Reviewing AI responses and refining prompts where additional detail or project-specific guidance was required.

The AI responses were treated as an initial draft and reviewed before being used.

## 5.  Using AI for Test Planning & Strategy

AI was used through an iterative approach to prepare the Test Planning & Strategy document.

The process followed was:

1. Identify the sections required in the Test Planning & Strategy document.
2. Generate the initial draft based on the identified structure.
3. Review the generated document from a Senior QA perspective.
4. Refine the document by expanding project-specific sections such as Test Strategy, UI Testing Strategy, API Testing Strategy, Smoke Testing, and Regression Testing.

This iterative process helped produce a more practical and assessment-focused Test Planning & Strategy instead of accepting the initial AI-generated draft without review.

## 6. How AI was used for Manual Test Case Design

AI was used to help prepare the first draft of the manual test cases.

The process followed was:

- Generate initial test cases.
- Review the generated test cases.
- Add missing negative and validation scenarios.
- Remove unnecessary test cases.
- Review the final test cases before adding them to the project.

The final manual test cases were reviewed manually before using them.

## 7. Using AI for Automation Design
Before starting automation, I used AI to understand the existing Prism Playwright framework.

The process followed was:

1. Understand the existing framework.
2. Identify reusable page objects and utilities.
3. Add only the required Toolshop files.
4. Review the generated code.
5. Execute the tests and fix issues if required.

For API automation, I reused the existing API framework and added only the required login, cart and invoice test scripts.

Separate JSON files were used for login, cart and invoice test data.

## 8. Using AI for Test Data Generation, Environment Assumptions and API Payloads

AI was used to generate both UI and API test data.

For UI automation, AI helped prepare reusable JSON test data for registration, login, shopping cart, checkout and order placement.

For API automation, AI helped prepare login data, cart request data and invoice request payloads.

During execution, the invoice payload was refined to use valid billing details based on the application behaviour instead of relying on hardcoded values.

Separate JSON files were maintained to keep the test data reusable and easy to update.

## 9. Using AI for Debugging Failing Tests

AI helped identify possible reasons for test failures.

After every suggested fix, I reviewed the code, executed the test again and kept only the changes that worked correctly.

Some issues resolved during this assessment were:

- Login account lock issue during API testing.
- Invoice API validation failure due to billing details.
- Updating API assertions based on the actual response.
- UI automation failures during checkout and order placement.

Each issue was fixed through prompt refinement, code updates and execution validation.

## 10. Information Not Shared with AI

Only the information required for the assessment was shared with the AI tool.

Sensitive information such as personal credentials, confidential project information, production data, customer information and internal company details were not shared.

Placeholder or demo test data was used wherever possible.

11. Reusing this QA Workflow in a Real Project

The same workflow can be reused in future QA projects.

AI can help with requirement analysis, test planning, manual test design, automation design, test data preparation, debugging and documentation.

The generated output should always be reviewed, refined and validated before being used in the project.

This approach saves time while keeping the final decisions and validation under manual review.
