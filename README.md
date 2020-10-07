Node-TestRail
=========


!["npm badge"](https://nodei.co/npm/@sum.cumo/node-testrail.png)

Node-TestRail is an api wrapper for TestRail. It contains an easy way to interact with all of the API commands for version 2 of the testrail API.

    https://www.gurock.com/testrail/docs/api

Installation
---
Yarn
```bash
yarn add -D @sum.cumo/node-testrail
```

NPM
```bash
npm install @sum.cumo/node-testrail --save-dev
```

How to use (Examples)
----
```javascript
var TestRail = require("@sum.cumo/node-testrail");

var testrail = new TestRail("https://example.testrail.com/", "email@example.com", "password");

testrail.addResult(TEST_ID, STATUS_ID, COMMENT, VERSION, ELAPSED_TIME, DEFECTS, ASSIGNEDTO_ID, function(body) {
    console.log(body);
});

testrail.getUserByEmail(EMAIL, function(user) {
    console.log(user);
});

testrail.getTest(TEST_ID, function(test) {
    console.log(test);
});
```

All the helper functions can be found under src within index.js

Available Commands
----

##### CASES


	getCase(case_id)

	getCases(project_id, suite_id, section_id)

	addCase(section_id, title, type_id, project_id, estimate, milestone_id, refs)

	updateCase(case_id, title, type_id, project_id, estimate, milestone_id,refs)

	deleteCase(case_id)

##### Case FIELDS

	getCaseFields()

##### Case TYPES

	getCaseTypes()

##### Configurations

	getConfigs(project_id)

##### Milestones

	getMilestone(milestone_id)

	getMilestones(project_id)

	addMilestone(project_id, name, description, due_on)

	updateMilestone(milestone_id, name, description, due_on, is_completed)

	deleteMilestone(milestone_id)

##### PLANS

	getPlan(plan_id)

	getPlans(project_id)

	addPlan(project_id, name, description, milestone_id)

	addPlanEntry(plan_id, suite_id, name, assignedto_id, include_all)

	updatePlan(plan_id, name, description, milestone_id)

	updatePlanEntry(plan_id, entry_id, name, assignedto_id, include_all)

	closePlan(plan_id)

	deletePlan(plan_id)

	deletePlanEntry(plan_id, entry_id)


##### PRIORITIES

	getPriorities()

##### PROJECTS

	getProject(project_id)

	getProjects()

	addProject(name, announcement, show_announcement)

	updateProject(project_id, name, announcement, show_announcement, is_completed)

	deleteProject(project_id)

##### RESULTS

	getResults(test_id, limit)

	getResultsForCase(run_id, case_id, limit)

	addResult(test_id, status_id, comment, version, elapsed, defects, assignedto_id)

	addResults(run_id, results)

	addResultForCase(run_id, case_id, status_id, comment, version, elapsed, defects, assignedto_id)

	addResultsForCases(run_id, results)

##### RESULT FIELDS

	getResultFields()

##### RUNS

	getRun(run_id)

	getRuns(run_id)

	addRun(projectID, suite_id, name, description, milestone_id, includeAll, caseIds, refs)

	updateRun(runID, name, description, milestone_id, includeAll, caseIds, refs)

	closeRun(run_id)

	deleteRun(run_id)

##### STATUSES

	getStatuses()

##### SECTIONS

	getSection(section_id)

	getSections(project_id, suite_id)

	addSection(project_id, suite_id, parent_id, name)

	updateSection(section_id, name)

	deleteSection(section_id)


##### SUITES

	getSuite(suite_id)

	getSuites(project_id)

	addSuite(project_id,name, description)

	updateSuite(suite_id,name, description)

	deleteSuite(suite_id)

##### TESTS

	getTest(test_id)

	getTests(run_id)

##### USERS

	getUser(user_id)

	getUserByEmail(email)



Thank you for using this module and feel free to contribute.

License
----

MIT
