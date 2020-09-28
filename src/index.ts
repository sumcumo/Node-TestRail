/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
*/
import axios, { AxiosResponse } from 'axios'

const API_ROUTE = '/index.php?/api/v2/'

function convertToBase64(str: string): string {
  // create a buffer
  const buff = Buffer.from(str, 'utf-8')

  // decode buffer as Base64
  return buff.toString('base64')
}

class TestRailConnector {
  private readonly host: string

  private readonly user: string

  private readonly password: string

  constructor(host, user, password) {
    this.host = host
    this.user = user
    this.password = password

    axios.defaults.headers.common['Content-Type'] = 'application/json'
    axios.defaults.headers.common.Authorization = `Basic ${convertToBase64(`${this.user}:${this.password}`)}`
  }

  // used to construct the host name for the API request
  // Internal Command
  //
  getFullHostName(): string {
    return this.host + API_ROUTE
  }

  // Used to perform a close command on the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @param [id] The id of the object to target in the API
  // @return [callback] The callback
  //
  closeCommand(command: string, id: string): Promise<AxiosResponse> {
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
  getIdCommand(command: string, id: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command + id)
  }

  // Used to get an object in the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @return [callback] The callback
  //
  getCommand(command: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command)
  }

  getExtraCommand(command: string, id: string, extra: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command + id + extra)
  }

  addCommand(command: string, id: string, postData: string): Promise<AxiosResponse> {
    return axios
      .post(this.getFullHostName() + command + id, postData)
  }

  addExtraCommand(
    command: string, id: string, extra: string, postData: string,
  ) : Promise<AxiosResponse> {
    return axios
      .post(this.getFullHostName() + command + id + extra, postData)
  }

  sendCommand(projectID: string, command: string, json): Promise<AxiosResponse> {
    return axios
      .post(
        this.getFullHostName() + command + projectID,
        JSON.stringify(json),
      )
  }

  // -------- CASES  ----------------------

  // Used to fetch a case from the API
  //
  // @param [caseId] The ID of the case to fetch
  // @return [callback] The callback with the case object
  //
  getCase(caseId: string): Promise<AxiosResponse> {
    return this.getIdCommand('get_case/', caseId)
  }

  // Used to fetch cases from the API
  //
  // @param [projectId] The ID of the project
  // @param [suiteId] The ID of the suite
  // @param [sectionId] The ID of the section
  // @return [callback] The callback with the case object
  //
  getCases(projectId, suiteId, sectionId): Promise<AxiosResponse> {
    let extra = `&suiteId=${suiteId}`
    if (sectionId != null) {
      extra += `&sectionId=${sectionId}`
    }
    return this.getExtraCommand('get_cases/', projectId, extra)
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
  addCase(
    sectionId, title, typeId, projectId, estimate, milestoneId, refs,
  ): Promise<AxiosResponse> {
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

  updateCase(
    caseId, title, typeId, projectId, estimate, milestoneId, refs,
  ): Promise<AxiosResponse> {
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

  deleteCase(caseId): Promise<AxiosResponse> {
    return this.closeCommand('delete_case/', caseId)
  }

  // -------- CASE FIELDS -----------------

  getCaseFields(): Promise<AxiosResponse> {
    return this.getCommand('get_case_fields/')
  }

  // -------- CASE TYPES ------------------

  getCaseTypes(): Promise<AxiosResponse> {
    return this.getCommand('get_case_types/')
  }

  // -------- CONFIGURATIONS ------------------

  getConfigs(projectId): Promise<AxiosResponse> {
    return this.getIdCommand('get_configs/', projectId)
  }

  addConfigGroup(projectId, name): Promise<AxiosResponse> {
    const json = {
      name,
    }
    return this.addCommand('add_config_group/', projectId, JSON.stringify(json))
  }

  addConfig(configGroupId, name): Promise<AxiosResponse> {
    const json = {
      name,
    }
    return this.addCommand('add_config/', configGroupId, JSON.stringify(json))
  }

  updateConfigGroup(configGroupId, name): Promise<AxiosResponse> {
    const json = {
      name,
    }
    return this.addCommand('update_config_group/', configGroupId, JSON.stringify(json))
  }

  updateConfig(configId, name): Promise<AxiosResponse> {
    const json = {
      name,
    }
    return this.addCommand('update_config/', configId, JSON.stringify(json))
  }

  deleteConfigGroup(configGroupId): Promise<AxiosResponse> {
    return this.closeCommand('delete_config_group/', configGroupId)
  }

  deleteConfig(configId): Promise<AxiosResponse> {
    return this.closeCommand('delete_config/', configId)
  }

  // -------- MILESTONES ------------------

  getMilestone(milestoneId): Promise<AxiosResponse> {
    return this.getIdCommand('get_milestone/', milestoneId)
  }

  getMilestones(projectId): Promise<AxiosResponse> {
    return this.getIdCommand('get_milestones/', projectId)
  }

  addMilestone(projectId, name, description, dueOn, parentId, startOn): Promise<AxiosResponse> {
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
  ): Promise<AxiosResponse> {
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

  deleteMilestone(milestoneId): Promise<AxiosResponse> {
    return this.closeCommand('delete_milestone/', milestoneId)
  }

  // -------- PLANS -----------------------

  getPlan(planId): Promise<AxiosResponse> {
    return this.getIdCommand('get_plan/', planId)
  }

  getPlans(projectId): Promise<AxiosResponse> {
    return this.getIdCommand('get_plans/', projectId)
  }

  addPlan(projectId, name, description, milestoneId): Promise<AxiosResponse> {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_plan/', projectId, JSON.stringify(json))
  }

  // TODO: update to handle extra params
  addPlanEntry(planId, suiteId, name, assignedtoId, includeAll): Promise<AxiosResponse> {
    const json = {
      suite_id: suiteId,
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('add_plan_entry/', planId, JSON.stringify(json))
  }

  updatePlan(planId, name, description, milestoneId): Promise<AxiosResponse> {
    const json = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('update_plan/', planId, JSON.stringify(json))
  }

  updatePlanEntry(planId, entryId, name, assignedtoId, includeAll): Promise<AxiosResponse> {
    const json = {
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('update_plan_entry/', (`${planId}/${entryId}`), JSON.stringify(json))
  }

  closePlan(planId): Promise<AxiosResponse> {
    return this.closeCommand('close_plan/', planId)
  }

  deletePlan(planId): Promise<AxiosResponse> {
    return this.closeCommand('delete_plan/', planId)
  }

  deletePlanEntry(planId, entryId): Promise<AxiosResponse> {
    return this.closeCommand('delete_plan_entry/', (`${planId}/${entryId}`))
  }

  // -------- PRIORITIES ------------------

  getPriorities(): Promise<AxiosResponse> {
    return this.getCommand('get_priorities/')
  }

  // -------- PROJECTS --------------------

  getProject(projectId): Promise<AxiosResponse> {
    return this.getIdCommand('get_project/', projectId)
  }

  getProjects(): Promise<AxiosResponse> {
    return this.getCommand('get_projects/')
  }

  addProject(name, announcement, showAnnouncement): Promise<AxiosResponse> {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
    }
    return this.addCommand('add_project/', '', JSON.stringify(json))
  }

  updateProject(
    projectId, name, announcement, showAnnouncement, isCompleted,
  ): Promise<AxiosResponse> {
    const json = {
      name,
      announcement,
      show_announcement: showAnnouncement,
      is_completed: isCompleted,
    }
    return this.addCommand('add_project/', projectId, JSON.stringify(json))
  }

  deleteProject(projectId): Promise<AxiosResponse> {
    return this.closeCommand('delete_project/', projectId)
  }

  // -------- RESULTS ---------------------

  getResults(testId, limit): Promise<AxiosResponse> {
    if ((limit == null)) {
      return this.getIdCommand('get_results/', testId)
    }
    const extra = `&limit=${limit}`
    return this.getExtraCommand('get_results/', testId, extra)
  }

  getResultsForCase(runId, caseId, limit): Promise<AxiosResponse> {
    let extra = `/${caseId}`

    if (limit != null) {
      extra = `/${caseId}&limit=${limit}`
    }

    return this.getExtraCommand('get_results_for_case/', runId, extra)
  }

  addResult(
    testId, statusId, comment, version, elapsed, defects, assignedtoId,
  ): Promise<AxiosResponse> {
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

  addResults(runId, results): Promise<AxiosResponse> {
    return this.addExtraCommand('add_results/', runId, '', JSON.stringify(results))
  }

  addResultForCase(
    runId, caseId, statusId, comment, version, elapsed, defects, assignedtoId,
  ): Promise<AxiosResponse> {
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

  addResultsForCases(runId, results): Promise<AxiosResponse> {
    return this.addExtraCommand('add_results_for_cases/', runId, '', JSON.stringify(results))
  }

  // -------- RESULT FIELDS ---------------------

  getResultFields(): Promise<AxiosResponse> {
    return this.getIdCommand('get_result_fields/', '')
  }

  // -------- RUNS ------------------------

  getRun(runId): Promise<AxiosResponse> {
    return this.getIdCommand('get_run/', runId)
  }

  getRuns(runId): Promise<AxiosResponse> {
    return this.getIdCommand('get_runs/', runId)
  }

  // TODO: Include all switch and case id select
  addRun(projectID, suiteId, name, description, milestoneId): Promise<AxiosResponse> {
    const json = {
      suite_id: suiteId,
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_run/', projectID, JSON.stringify(json))
  }

  updateRun(runID, name, description): Promise<AxiosResponse> {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_run/', runID, JSON.stringify(json))
  }

  closeRun(runId): Promise<AxiosResponse> {
    return this.closeCommand('close_run/', runId)
  }

  deleteRun(runId): Promise<AxiosResponse> {
    return this.closeCommand('delete_run/', runId)
  }

  // -------- STATUSES --------------------

  getStatuses(): Promise<AxiosResponse> {
    return this.getCommand('get_statuses/')
  }

  // -------- SECTIONS --------------------

  getSection(sectionId): Promise<AxiosResponse> {
    return this.getIdCommand('get_section/', sectionId)
  }

  getSections(projectId, suiteId): Promise<AxiosResponse> {
    return this.getExtraCommand('get_sections/', projectId, `&suiteId=${suiteId}`)
  }

  addSection(projectId, suiteId, parentId, name): Promise<AxiosResponse> {
    const json = {
      suite_id: suiteId,
      parent_id: parentId,
      name,
    }
    return this.addCommand('add_section/', projectId, JSON.stringify(json))
  }

  updateSection(sectionId, name): Promise<AxiosResponse> {
    const json = {
      name,
    }
    return this.addCommand('update_Section/', sectionId, JSON.stringify(json))
  }

  deleteSection(sectionId): Promise<AxiosResponse> {
    return this.closeCommand('delete_section/', sectionId)
  }

  // -------- SUITES -----------

  getSuite(suiteId): Promise<AxiosResponse> {
    return this.getIdCommand('get_suite/', suiteId)
  }

  getSuites(projectId): Promise<AxiosResponse> {
    return this.getIdCommand('get_suites/', projectId)
  }

  addSuite(projectId, name, description): Promise<AxiosResponse> {
    const json = {
      name,
      description,
    }
    return this.addCommand('add_suite/', projectId, JSON.stringify(json))
  }

  updateSuite(suiteId, name, description): Promise<AxiosResponse> {
    const json = {
      name,
      description,
    }
    return this.addCommand('update_suite/', suiteId, JSON.stringify(json))
  }

  deleteSuite(suiteId): Promise<AxiosResponse> {
    return this.closeCommand('delete_suite/', suiteId)
  }

  // -------- TESTS -----------------------

  getTest(testId): Promise<AxiosResponse> {
    return this.getIdCommand('get_test/', testId)
  }

  getTests(runId): Promise<AxiosResponse> {
    return this.getIdCommand('get_tests/', runId)
  }

  // -------- USERS -----------------------

  getUser(userId): Promise<AxiosResponse> {
    return this.getIdCommand('get_user/', userId)
  }

  getUserByEmail(email): Promise<AxiosResponse> {
    return this.getExtraCommand('', '', `get_user_by_email&email=${email}`)
  }

  getUsers(): Promise<AxiosResponse> {
    return this.getCommand('get_users/')
  }
}

module.exports = TestRailConnector
