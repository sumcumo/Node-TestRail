/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
*/
const axios = require('axios').default

const API_ROUTE = '/index.php?/api/v2/'

function getAsBase64(str) {
  // create a buffer
  const buff = Buffer.from(str, 'utf-8')

  // decode buffer as Base64
  return buff.toString('base64')
}

class TestRailConnecetor {
  constructor(host, user, password) {
    this.host = host
    this.user = user
    this.password = password

    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common.Authorization = `Basic ${getAsBase64(`${this.user}:${this.password}`)}`
  }

  // used to construct the host name for the API request
  // Internal Command
  //
  getFullHostName() {
    return this.host + API_ROUTE
  }

  // Used to perform a close command on the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @param [id] The id of the object to target in the API
  // @return [callback] The callback
  //
  closeCommand(command, id) {
    return axios
      .post(this.getFullHostName() + command + id)
  }

  // Used to get an object in the API by the ID
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @param [id] The id of the object to target in the API
  // @return [callback] The callback
  //
  getIdCommand(command, id) {
    return axios
      .get(this.getFullHostName() + command + id)
  }

  // Used to get an object in the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @return [callback] The callback
  //
  getCommand(command) {
    return axios
      .get(this.getFullHostName() + command)
  }

  getExtraCommand(command, id, extra) {
    return axios
      .get(this.getFullHostName() + command + id + extra)
  }

  addCommand(command, id, postData) {
    return axios
      .post(this.getFullHostName() + command + id, postData)
  }

  addExtraCommand(command, id, extra, postData) {
    return axios
      .post(this.getFullHostName() + command + id + extra, postData)
  }

  sendCommand(projectID, command, json) {
    return axios
      .post(
        `${this.host}/index.php?/api/v2/${command}${projectID}`,
        JSON.stringify(json),
      )
  }

  // -------- CASES  ----------------------

  // Used to fetch a case from the API
  //
  // @param [caseId] The ID of the case to fetch
  // @return [callback] The callback with the case object
  //
  getCase(caseId) {
    return this.getIdCommand('get_case/', caseId)
  }

  // Used to fetch cases from the API
  //
  // @param [projectId] The ID of the project
  // @param [suiteId] The ID of the suite
  // @param [sectionId] The ID of the section
  // @return [callback] The callback with the case object
  //
  getCases(projectId, suiteId, sectionId) {
    if (sectionId != null) {
      return this.getExtraCommand('get_cases/', projectId, `&suiteId=${suiteId}&sectionId=${sectionId}`)
    }
    return this.getExtraCommand('get_cases/', projectId, `&suiteId=${suiteId}`)
  }

  // Used to add cases to the API
  //
  // @param [sectionId] The ID of the section where to add
  // @param [title] The title of the case
  // @param [typeId] The id for the type of case
  // @param [projectId] The ID of the project
  // @param [estimate] The estimate of the case
  // @param [milestoneId] The ID of the milestone to add to
  // @param [refs]
  // @return [callback] The callback with the case object
  //
  addCase(sectionId, title, typeId, projectId, estimate, milestoneId, refs) {
    const json = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('add_case/', sectionId, JSON.stringify(json))
  }

  updateCase(caseId, title, typeId, projectId, estimate, milestoneId, refs) {
    const json = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('update_case/', caseId, JSON.stringify(json))
  }

  deleteCase(caseId) {
    return this.closeCommand('delete_case/', caseId)
  }

  // -------- CASE FIELDS -----------------

  getCaseFields() {
    return this.getCommand('get_case_fields/')
  }

  // -------- CASE TYPES ------------------

  getCaseTypes() {
    return this.getCommand('get_case_types/')
  }

  // -------- CONFIGURATIONS ------------------

  getConfigs(projectId) {
    return this.getIdCommand('get_configs/', projectId)
  }

  addConfigGroup(projectId, name) {
    const json = {}
    json.name = name
    return this.addCommand('add_config_group/', projectId, JSON.stringify(json))
  }

  addConfig(configGroupId, name) {
    const json = {}
    json.name = name
    return this.addCommand('add_config/', configGroupId, JSON.stringify(json))
  }

  updateConfigGroup(configGroupId, name) {
    const json = {}
    json.name = name
    return this.addCommand('update_config_group/', configGroupId, JSON.stringify(json))
  }

  updateConfig(configId, name) {
    const json = {}
    json.name = name
    return this.addCommand('update_config/', configId, JSON.stringify(json))
  }

  deleteConfigGroup(configGroupId) {
    return this.closeCommand('delete_config_group/', configGroupId)
  }

  deleteConfig(configId) {
    return this.closeCommand('delete_config/', configId)
  }

  // -------- MILESTONES ------------------

  getMilestone(milestoneId) {
    return this.getIdCommand('get_milestone/', milestoneId)
  }

  getMilestones(projectId) {
    return this.getIdCommand('get_milestones/', projectId)
  }

  addMilestone(projectId, name, description, dueOn, parentId, startOn) {
    const json = {
      name,
      description,
      due_on: dueOn,
      parent_id: parentId,
      start_on: startOn,
    }
    return this.addCommand('add_milestone/', projectId, JSON.stringify(json))
  }

  updateMilestone(
    milestoneId, name, description, dueOn, startOn, isCompleted, isStarted, parentId,
  ) {
    const json = {
      name,
      description,
      due_on: dueOn,
      parent_id: parentId,
      is_completed: isCompleted,
      start_on: startOn,
      is_started: isStarted,
    }
    return this.addCommand('update_milestone/', milestoneId, JSON.stringify(json))
  }

  deleteMilestone(milestoneId) {
    return this.closeCommand('delete_milestone/', milestoneId)
  }

  // -------- PLANS -----------------------

  getPlan(planId) {
    return this.getIdCommand('get_plan/', planId)
  }

  getPlans(projectId) {
    return this.getIdCommand('get_plans/', projectId)
  }

  addPlan(projectId, name, description, milestoneId) {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_plan/', projectId, JSON.stringify(json))
  }

  // TODO: update to handle extra params
  addPlanEntry(planId, suiteId, name, assignedtoId, includeAll) {
    const json = {
      suite_id: suiteId,
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('add_plan_entry/', planId, JSON.stringify(json))
  }

  updatePlan(planId, name, description, milestoneId) {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('update_plan/', planId, JSON.stringify(json))
  }

  updatePlanEntry(planId, entryId, name, assignedtoId, includeAll) {
    const json = {
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('update_plan_entry/', (`${planId}/${entryId}`), JSON.stringify(json))
  }

  closePlan(planId) {
    return this.closeCommand('close_plan/', planId)
  }

  deletePlan(planId) {
    return this.closeCommand('delete_plan/', planId)
  }

  deletePlanEntry(planId, entryId) {
    return this.closeCommand('delete_plan_entry/', (`${planId}/${entryId}`))
  }

  // -------- PRIORITIES ------------------

  getPriorities() {
    return this.getCommand('get_priorities/')
  }

  // -------- PROJECTS --------------------

  getProject(projectId) {
    return this.getIdCommand('get_project/', projectId)
  }

  getProjects() {
    return this.getCommand('get_projects/')
  }

  addProject(name, announcement, showAnnouncement) {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
    }
    return this.addCommand('add_project/', '', JSON.stringify(json))
  }

  updateProject(projectId, name, announcement, showAnnouncement, isCompleted) {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
      is_completed: isCompleted,
    }
    return this.addCommand('add_project/', projectId, JSON.stringify(json))
  }

  deleteProject(projectId) {
    return this.closeCommand('delete_project/', projectId)
  }

  // -------- RESULTS ---------------------

  getResults(testId, limit) {
    if ((limit == null)) {
      return this.getIdCommand('get_results/', testId)
    }
    const extra = `&limit=${limit}`
    return this.getExtraCommand('get_results/', testId, extra)
  }

  getResultsForCase(runId, caseId, limit) {
    let extra
    if ((limit == null)) {
      extra = `/${caseId}`
      return this.getExtraCommand('get_results_for_case/', runId, extra)
    }
    extra = `/${caseId}&limit=${limit}`
    return this.getExtraCommand('get_results_for_case/', runId, extra)
  }

  addResult(testId, statusId, comment, version, elapsed, defects, assignedtoId) {
    const json = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addCommand('add_result/', testId, JSON.stringify(json))
  }

  addResults(runId, results) {
    return this.addExtraCommand('add_results/', runId, JSON.stringify(results))
  }

  addResultForCase(
    runId, caseId, statusId, comment, version, elapsed, defects, assignedtoId,
  ) {
    const json = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addExtraCommand('add_result_for_case/', runId, (`/${caseId}`), JSON.stringify(json))
  }

  addResultsForCases(runId, results) {
    return this.addExtraCommand('add_results_for_cases/', runId, '', JSON.stringify(results))
  }

  // -------- RESULT FIELDS ---------------------

  getResultFields() {
    return this.getIdCommand('get_result_fields/', '')
  }

  // -------- RUNS ------------------------

  getRun(runId) {
    return this.getIdCommand('get_run/', runId)
  }

  getRuns(runId) {
    return this.getIdCommand('get_runs/', runId)
  }

  // TODO: Include all switch and case id select
  addRun(projectID, suiteId, name, description, milestoneId) {
    const json = {
      suite_id: suiteId,
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_run/', projectID, JSON.stringify(json))
  }

  updateRun(runID, name, description) {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_run/', runID, JSON.stringify(json))
  }

  closeRun(runId) {
    return this.closeCommand('close_run/', runId)
  }

  deleteRun(runId) {
    return this.closeCommand('delete_run/', runId)
  }

  // -------- STATUSES --------------------

  getStatuses() {
    return this.getCommand('get_statuses/')
  }

  // -------- SECTIONS --------------------

  getSection(sectionId) {
    return this.getIdCommand('get_section/', sectionId)
  }

  getSections(projectId, suiteId) {
    return this.getExtraCommand('get_sections/', projectId, `&suiteId=${suiteId}`)
  }

  addSection(projectId, suiteId, parentId, name) {
    const json = {
      suite_id: suiteId,
      parent_id: parentId,
      name,
    }
    return this.addCommand('add_section/', projectId, JSON.stringify(json))
  }

  updateSection(sectionId, name) {
    const json = {
      name,
    }
    return this.addCommand('update_Section/', sectionId, JSON.stringify(json))
  }

  deleteSection(sectionId) {
    return this.closeCommand('delete_section/', sectionId)
  }

  // -------- SUITES -----------

  getSuite(suiteId) {
    return this.getIdCommand('get_suite/', suiteId)
  }

  getSuites(projectId) {
    return this.getIdCommand('get_suites/', projectId)
  }

  addSuite(projectId, name, description) {
    const json = {
      name,
      description,
    }
    return this.addCommand('add_suite/', projectId, JSON.stringify(json))
  }

  updateSuite(suiteId, name, description) {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_suite/', suiteId, JSON.stringify(json))
  }

  deleteSuite(suiteId) {
    return this.closeCommand('delete_suite/', suiteId)
  }

  // -------- TESTS -----------------------

  getTest(testId) {
    return this.getIdCommand('get_test/', testId)
  }

  getTests(runId) {
    return this.getIdCommand('get_tests/', runId)
  }

  // -------- USERS -----------------------

  getUser(userId) {
    return this.getIdCommand('get_user/', userId)
  }

  getUserByEmail(email) {
    return this.getExtraCommand('', '', `get_user_by_email&email=${email}`)
  }

  getUsers() {
    return this.getCommand('get_users/')
  }
}

module.exports = TestRailConnecetor
