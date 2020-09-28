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
    console.warn('CREATED WITH AUTH HEADER', axios.defaults.headers.common.Authorization)
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
  closeCommand(command, id, callback) {
    return axios
      .post(this.getFullHostName() + command + id)
      .then((response) => callback(response))
  }

  // Used to get an object in the API by the ID
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @param [id] The id of the object to target in the API
  // @return [callback] The callback
  //
  getIdCommand(command, id, callback) {
    return axios
      .get(this.getFullHostName() + command + id)
      .then((response) => callback(response))
  }

  // Used to get an object in the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @return [callback] The callback
  //
  getCommand(command, callback) {
    return axios
      .get(this.getFullHostName() + command)
      .then((response) => callback(response))
  }

  getExtraCommand(command, id, extra, callback) {
    return axios
      .get(this.getFullHostName() + command + id + extra)
      .then((response) => callback(response))
  }

  addCommand(command, id, postData, callback) {
    return axios
      .post(this.getFullHostName() + command + id, postData)
      .then((response) => callback(response))
  }

  addExtraCommand(command, id, extra, postData, callback) {
    return axios
      .post(this.getFullHostName() + command + id + extra, postData)
      .then((response) => callback(response))
  }

  sendCommand(projectID, command, json) {
    return axios
      .post(
        `${this.host}/index.php?/api/v2/${command}${projectID}`,
        JSON.stringify(json),
      )
      .then((response) => response)
  }

  // -------- CASES  ----------------------

  // Used to fetch a case from the API
  //
  // @param [caseId] The ID of the case to fetch
  // @return [callback] The callback with the case object
  //
  getCase(caseId, callback) {
    return this.getIdCommand('get_case/', caseId, callback)
  }

  // Used to fetch cases from the API
  //
  // @param [projectId] The ID of the project
  // @param [suiteId] The ID of the suite
  // @param [sectionId] The ID of the section
  // @return [callback] The callback with the case object
  //
  getCases(projectId, suiteId, sectionId, callback) {
    if (sectionId != null) {
      return this.getExtraCommand('get_cases/', projectId, `&suiteId=${suiteId}&sectionId=${sectionId}`, callback)
    }
    return this.getExtraCommand('get_cases/', projectId, `&suiteId=${suiteId}`, callback)
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
  addCase(sectionId, title, typeId, projectId, estimate, milestoneId, refs, callback) {
    const json = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('add_case/', sectionId, JSON.stringify(json), callback)
  }

  updateCase(caseId, title, typeId, projectId, estimate, milestoneId, refs, callback) {
    const json = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('update_case/', caseId, JSON.stringify(json), callback)
  }

  deleteCase(caseId, callback) {
    return this.closeCommand('delete_case/', caseId, callback)
  }

  // -------- CASE FIELDS -----------------

  getCaseFields(callback) {
    return this.getCommand('get_case_fields/', callback)
  }

  // -------- CASE TYPES ------------------

  getCaseTypes(callback) {
    return this.getCommand('get_case_types/', callback)
  }

  // -------- CONFIGURATIONS ------------------

  getConfigs(projectId, callback) {
    return this.getIdCommand('get_configs/', projectId, callback)
  }

  addConfigGroup(projectId, name, callback) {
    const json = {}
    json.name = name
    return this.addCommand('add_config_group/', projectId, JSON.stringify(json), callback)
  }

  addConfig(configGroupId, name, callback) {
    const json = {}
    json.name = name
    return this.addCommand('add_config/', configGroupId, JSON.stringify(json), callback)
  }

  updateConfigGroup(configGroupId, name, callback) {
    const json = {}
    json.name = name
    return this.addCommand('update_config_group/', configGroupId, JSON.stringify(json), callback)
  }

  updateConfig(configId, name, callback) {
    const json = {}
    json.name = name
    return this.addCommand('update_config/', configId, JSON.stringify(json), callback)
  }

  deleteConfigGroup(configGroupId, callback) {
    return this.closeCommand('delete_config_group/', configGroupId, callback)
  }

  deleteConfig(configId, callback) {
    return this.closeCommand('delete_config/', configId, callback)
  }

  // -------- MILESTONES ------------------

  getMilestone(milestoneId, callback) {
    return this.getIdCommand('get_milestone/', milestoneId, callback)
  }

  getMilestones(projectId, callback) {
    return this.getIdCommand('get_milestones/', projectId, callback)
  }

  addMilestone(projectId, name, description, dueOn, parentId, startOn, callback) {
    const json = {
      name,
      description,
      due_on: dueOn,
      parent_id: parentId,
      start_on: startOn,
    }
    return this.addCommand('add_milestone/', projectId, JSON.stringify(json), callback)
  }

  updateMilestone(
    milestoneId, name, description, dueOn, startOn, isCompleted, isStarted, parentId, callback,
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
    return this.addCommand('update_milestone/', milestoneId, JSON.stringify(json), callback)
  }

  deleteMilestone(milestoneId, callback) {
    return this.closeCommand('delete_milestone/', milestoneId, callback)
  }

  // -------- PLANS -----------------------

  getPlan(planId, callback) {
    return this.getIdCommand('get_plan/', planId, callback)
  }

  getPlans(projectId, callback) {
    return this.getIdCommand('get_plans/', projectId, callback)
  }

  addPlan(projectId, name, description, milestoneId, callback) {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_plan/', projectId, JSON.stringify(json), callback)
  }

  // TODO: update to handle extra params
  addPlanEntry(planId, suiteId, name, assignedtoId, includeAll, callback) {
    const json = {
      suite_id: suiteId,
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('add_plan_entry/', planId, JSON.stringify(json), callback)
  }

  updatePlan(planId, name, description, milestoneId, callback) {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('update_plan/', planId, JSON.stringify(json), callback)
  }

  updatePlanEntry(planId, entryId, name, assignedtoId, includeAll, callback) {
    const json = {
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('update_plan_entry/', (`${planId}/${entryId}`), JSON.stringify(json), callback)
  }

  closePlan(planId, callback) {
    return this.closeCommand('close_plan/', planId, callback)
  }

  deletePlan(planId, callback) {
    return this.closeCommand('delete_plan/', planId, callback)
  }

  deletePlanEntry(planId, entryId, callback) {
    return this.closeCommand('delete_plan_entry/', (`${planId}/${entryId}`), callback)
  }

  // -------- PRIORITIES ------------------

  getPriorities(callback) {
    return this.getCommand('get_priorities/', callback)
  }

  // -------- PROJECTS --------------------

  getProject(projectId, callback) {
    return this.getIdCommand('get_project/', projectId, callback)
  }

  getProjects(callback) {
    return this.getCommand('get_projects/', callback)
  }

  addProject(name, announcement, showAnnouncement, callback) {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
    }
    return this.addCommand('add_project/', '', JSON.stringify(json), callback)
  }

  updateProject(projectId, name, announcement, showAnnouncement, isCompleted, callback) {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
      is_completed: isCompleted,
    }
    return this.addCommand('add_project/', projectId, JSON.stringify(json), callback)
  }

  deleteProject(projectId, callback) {
    return this.closeCommand('delete_project/', projectId, callback)
  }

  // -------- RESULTS ---------------------

  getResults(testId, callback, limit) {
    if ((limit == null)) {
      return this.getIdCommand('get_results/', testId, callback)
    }
    const extra = `&limit=${limit}`
    return this.getExtraCommand('get_results/', testId, extra, callback)
  }

  getResultsForCase(runId, caseId, limit, callback) {
    let extra
    if ((limit == null)) {
      extra = `/${caseId}`
      return this.getExtraCommand('get_results_for_case/', runId, extra, callback)
    }
    extra = `/${caseId}&limit=${limit}`
    return this.getExtraCommand('get_results_for_case/', runId, extra, callback)
  }

  addResult(testId, statusId, comment, version, elapsed, defects, assignedtoId, callback) {
    const json = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addCommand('add_result/', testId, JSON.stringify(json), callback)
  }

  addResults(runId, results, callback) {
    return this.addExtraCommand('add_results/', runId, JSON.stringify(results), callback)
  }

  addResultForCase(
    runId, caseId, statusId, comment, version, elapsed, defects, assignedtoId, callback,
  ) {
    const json = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addExtraCommand('add_result_for_case/', runId, (`/${caseId}`), JSON.stringify(json), callback)
  }

  addResultsForCases(runId, results, callback) {
    return this.addExtraCommand('add_results_for_cases/', runId, '', JSON.stringify(results), callback)
  }

  // -------- RESULT FIELDS ---------------------

  getResultFields(callback) {
    return this.getIdCommand('get_result_fields/', '', callback)
  }

  // -------- RUNS ------------------------

  getRun(runId, callback) {
    return this.getIdCommand('get_run/', runId, callback)
  }

  getRuns(runId, callback) {
    return this.getIdCommand('get_runs/', runId, callback)
  }

  // TODO: Include all switch and case id select
  addRun(projectID, suiteId, name, description, milestoneId, callback) {
    const json = {
      suite_id: suiteId,
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_run/', projectID, JSON.stringify(json), callback)
  }

  updateRun(runID, name, description, callback) {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_run/', runID, JSON.stringify(json), callback)
  }

  closeRun(runId, callback) {
    return this.closeCommand('close_run/', runId, callback)
  }

  deleteRun(runId, callback) {
    return this.closeCommand('delete_run/', runId, callback)
  }

  // -------- STATUSES --------------------

  getStatuses(callback) {
    return this.getCommand('get_statuses/', callback)
  }

  // -------- SECTIONS --------------------

  getSection(sectionId, callback) {
    return this.getIdCommand('get_section/', sectionId, callback)
  }

  getSections(projectId, suiteId, callback) {
    return this.getExtraCommand('get_sections/', projectId, `&suiteId=${suiteId}`, callback)
  }

  addSection(projectId, suiteId, parentId, name, callback) {
    const json = {
      suite_id: suiteId,
      parent_id: parentId,
      name,
    }
    return this.addCommand('add_section/', projectId, JSON.stringify(json), callback)
  }

  updateSection(sectionId, name, callback) {
    const json = {
      name,
    }
    return this.addCommand('update_Section/', sectionId, JSON.stringify(json), callback)
  }

  deleteSection(sectionId, callback) {
    return this.closeCommand('delete_section/', sectionId, callback)
  }

  // -------- SUITES -----------

  getSuite(suiteId, callback) {
    return this.getIdCommand('get_suite/', suiteId, callback)
  }

  getSuites(projectId, callback) {
    return this.getIdCommand('get_suites/', projectId, callback)
  }

  addSuite(projectId, name, description, callback) {
    const json = {
      name,
      description,
    }
    return this.addCommand('add_suite/', projectId, JSON.stringify(json), callback)
  }

  updateSuite(suiteId, name, description, callback) {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_suite/', suiteId, JSON.stringify(json), callback)
  }

  deleteSuite(suiteId, callback) {
    return this.closeCommand('delete_suite/', suiteId, callback)
  }

  // -------- TESTS -----------------------

  getTest(testId, callback) {
    return this.getIdCommand('get_test/', testId, callback)
  }

  getTests(runId, callback) {
    return this.getIdCommand('get_tests/', runId, callback)
  }

  // -------- USERS -----------------------

  getUser(userId, callback) {
    return this.getIdCommand('get_user/', userId, callback)
  }

  getUserByEmail(email, callback) {
    return this.getExtraCommand('', '', `get_user_by_email&email=${email}`, callback)
  }

  getUsers(callback) {
    return this.getCommand('get_users/', callback)
  }
}

module.exports = TestRailConnecetor
