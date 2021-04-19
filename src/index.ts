/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
*/
import fs from 'fs'
import axios, { AxiosResponse } from 'axios'
// eslint-disable-next-line
import FormData from 'form-data'
import AdmZip from 'adm-zip'
import { TestRailResult } from './types'

const API_ROUTE = '/index.php?/api/v2/'

function convertToBase64(str: string): string {
  // create a buffer
  const buff = Buffer.from(str, 'utf-8')

  // decode buffer as Base64
  return buff.toString('base64')
}

const DEFAULT_HEADERS: {[id: string]: string} = {
  'Content-Type': 'application/json',
}

function createArchiveFor(attachments: string[], assetsArchiveName: string) {
  const archive = new AdmZip()

  attachments.forEach((attachment) => {
    const [source, target] = attachment.split(':')
    if (fs.existsSync(source)) {
      archive.addLocalFolder(source, target || '')
    }
  })

  // Another way to write the zip file: `writeZip()`
  archive.writeZip(`${assetsArchiveName}.zip`)

  return `${assetsArchiveName}.zip`
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
  // @return Promise<AxiosRequest>
  //
  closeCommand(command: string, id: string): Promise<AxiosResponse> {
    return axios
      .post(this.getFullHostName() + command + id, null, {
        headers: {
          ...DEFAULT_HEADERS,
        },
      })
  }

  // Used to get an object in the API by the ID
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @param [id] The id of the object to target in the API
  // @return Promise<AxiosRequest>
  //
  getIdCommand(command: string, id: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command + id)
  }

  // Used to get an object in the API
  // Internal Command
  //
  // @param [command] The command to send to the API
  // @return Promise<AxiosRequest>
  //
  getCommand(command: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command)
  }

  getExtraCommand(command: string, id: string, extra: string): Promise<AxiosResponse> {
    return axios
      .get(this.getFullHostName() + command + id + extra)
  }

  addCommand(command: string, id: string, data): Promise<AxiosResponse> {
    return axios
      .post(this.getFullHostName() + command + id, JSON.stringify(data), {
        headers: {
          ...DEFAULT_HEADERS,
        },
      })
  }

  addExtraCommand(
    command: string, id: string, extra: string, data,
  ) : Promise<AxiosResponse> {
    return axios
      .post(this.getFullHostName() + command + id + extra,
        JSON.stringify(data),
        {
          headers: {
            ...DEFAULT_HEADERS,
          },
        })
  }

  sendCommand(projectID: string, command: string, data): Promise<AxiosResponse> {
    return axios
      .post(
        this.getFullHostName() + command + projectID,
        JSON.stringify(data),
        {
          headers: {
            ...DEFAULT_HEADERS,
          },
        },
      )
  }

  postForm(command: string, id: string, attachment: string): any {
    const data = new FormData()
    data.append('attachment', fs.createReadStream(attachment))

    return axios({
      method: 'post',
      url: this.getFullHostName() + command + id,
      headers: {
        ...data.getHeaders(),
      },
      data,
      maxBodyLength: Infinity,
    })
  }

  // -------- ATTACHMENTS  ----------------------

  /**
   * Adds an attachment to a test case. The maximum allowable upload size is set to 256mb.
   * Requires TestRail 6.5.2 or later
   * @param caseId The ID of the test case the attachment should be added to
   * @param attachment Attachments file path
   */
  addAttachmentToCase(caseId: string, attachment: string): Promise<AxiosResponse> {
    return this.postForm('add_attachment_to_case/', caseId, attachment)
  }

  /**
   * Adds an attachment to a test plan. The maximum allowable upload size is set to 256mb.
   * Requires TestRail 6.3 or later
   * @param planId The ID of the test plan the attachment should be added to
   * @param attachment Attachments file path
   */
  addAttachmentToPlan(planId: string, attachment: string): Promise<AxiosResponse> {
    return this.postForm('add_attachment_to_plan/', planId, attachment)
  }

  /**
   * Adds an attachment to a test plan entry. The maximum allowable upload size is set to 256mb.
   * Requires TestRail 6.3 or later
   * @param planId The ID of the test plan containing the entry
   * @param entryId The ID of the test plan entry the attachment should be added to
   * @param attachment Attachments file path
   */
  addAttachmentToPlanEntry(
    planId: string,
    entryId: string,
    attachment: string,
  ): Promise<AxiosResponse> {
    return this.postForm('add_attachment_to_plan_entry/', `${planId}/${entryId}`, attachment)
  }

  /**
   * Adds attachment to a result based on the result ID.
   * The maximum allowable upload size is set to 256mb.
   * Requires TestRail 5.7 or later
   * @param resultId The ID of the test result the attachment should be added to
   * @param attachment Attachments file path
   */
  addAttachmentToResult(resultId: string, attachment: string): Promise<AxiosResponse> {
    return this.postForm('add_attachment_to_result/', resultId, attachment)
  }

  /**
   * Adds attachment to test run. The maximum allowable upload size is set to 256mb.
   * Requires TestRail 6.3 or later
   * @param runId The ID of the test run the attachment should be added to
   * @param attachment Attachments file path
   */
  addAttachmentToRun(runId: string, attachment: string): Promise<AxiosResponse> {
    return this.postForm('add_attachment_to_run/', runId, attachment)
  }

  /**
   * Adds attachments to test run. The maximum allowable upload size is set to 256mb.
   * Requires TestRail 6.3 or later
   * @param runId The ID of the test run the attachment should be added to
   * @param attachments List of Attachments file path
   * @param assetsArchiveName optional archive name
   */
  async addAttachmentsToRun(
    runId: string,
    attachments: string[],
    assetsArchiveName: null | string = null,
  ): Promise<AxiosResponse | null> {
    // No Archive Name specified? -> Attach each file
    if (!assetsArchiveName) {
      attachments.forEach((attachment) => this.addAttachmentToRun(runId, attachment))
      return null
    }

    // Create archive for assets and upload it
    const archive = createArchiveFor(attachments, assetsArchiveName)
    const response: AxiosResponse = await this.postForm('add_attachment_to_run/', runId, archive)
    fs.unlinkSync(archive)
    return response
  }

  /**
   * Deletes the specified attachment identified by :attachment_id.
   * Requires TestRail 5.7 or later
   * @param attachmentId The ID of the attachment to to delete
   */
  deleteAttachment(attachmentId: string): Promise<AxiosResponse> {
    return this.closeCommand('delete_attachment/', attachmentId)
  }

  // -------- CASES  ----------------------

  // Used to fetch a case from the API
  //
  // @param [caseId] The ID of the case to fetch
  // @return Promise<AxiosRequest>
  //
  getCase(caseId: string): Promise<AxiosResponse> {
    return this.getIdCommand('get_case/', caseId)
  }

  // Used to fetch cases from the API
  //
  // @param [projectId] The ID of the project
  // @param [suiteId] The ID of the suite
  // @param [sectionId] The ID of the section
  // @return Promise<AxiosRequest>
  //
  getCases(projectId: string, suiteId: string, sectionId: string): Promise<AxiosResponse> {
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
  // @return Promise<AxiosRequest>
  //
  addCase(
    sectionId, title, typeId, projectId, estimate, milestoneId, refs,
  ): Promise<AxiosResponse> {
    const data = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('add_case/', sectionId, data)
  }

  updateCase(
    caseId, title, typeId, projectId, estimate, milestoneId, refs,
  ): Promise<AxiosResponse> {
    const data = {
      title,
      type_id: typeId,
      project_id: projectId,
      estimate,
      milestone_id: milestoneId,
      refs,
    }
    return this.addCommand('update_case/', caseId, data)
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
    const data = {
      name,
    }
    return this.addCommand('add_config_group/', projectId, data)
  }

  addConfig(configGroupId, name): Promise<AxiosResponse> {
    const data = {
      name,
    }
    return this.addCommand('add_config/', configGroupId, data)
  }

  updateConfigGroup(configGroupId, name): Promise<AxiosResponse> {
    const data = {
      name,
    }
    return this.addCommand('update_config_group/', configGroupId, data)
  }

  updateConfig(configId, name): Promise<AxiosResponse> {
    const data = {
      name,
    }
    return this.addCommand('update_config/', configId, data)
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
    const data = {
      name,
      description,
      due_on: dueOn,
      parent_id: parentId,
      start_on: startOn,
    }
    return this.addCommand('add_milestone/', projectId, data)
  }

  updateMilestone(
    milestoneId, name, description, dueOn, startOn, isCompleted, isStarted, parentId,
  ): Promise<AxiosResponse> {
    const data = {
      name,
      description,
      due_on: dueOn,
      parent_id: parentId,
      is_completed: isCompleted,
      start_on: startOn,
      is_started: isStarted,
    }
    return this.addCommand('update_milestone/', milestoneId, data)
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
    const data = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('add_plan/', projectId, data)
  }

  // TODO: update to handle extra params
  addPlanEntry(planId, suiteId, name, assignedtoId, includeAll): Promise<AxiosResponse> {
    const data = {
      suite_id: suiteId,
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('add_plan_entry/', planId, data)
  }

  updatePlan(planId, name, description, milestoneId): Promise<AxiosResponse> {
    const data = {
      name,
      description,
      milestone_id: milestoneId,
    }
    return this.addCommand('update_plan/', planId, data)
  }

  updatePlanEntry(planId, entryId, name, assignedtoId, includeAll): Promise<AxiosResponse> {
    const data = {
      name,
      assignedto_id: assignedtoId,
      include_all: includeAll,
    }
    return this.addCommand('update_plan_entry/', (`${planId}/${entryId}`), data)
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
    const data = {
      name,
      announcement,
      show_announcement: showAnnouncement,
    }
    return this.addCommand('add_project/', '', data)
  }

  updateProject(
    projectId, name, announcement, showAnnouncement, isCompleted,
  ): Promise<AxiosResponse> {
    const data = {
      name,
      announcement,
      show_announcement: showAnnouncement,
      is_completed: isCompleted,
    }
    return this.addCommand('add_project/', projectId, data)
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
    const data = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addCommand('add_result/', testId, data)
  }

  addResults(runId, results): Promise<AxiosResponse> {
    return this.addExtraCommand('add_results/', runId, '', results)
  }

  addResultForCase(
    runId, caseId, statusId, comment, version, elapsed, defects, assignedtoId,
  ): Promise<AxiosResponse> {
    const data = {
      status_id: statusId,
      comment,
      version,
      elapsed,
      defects,
      assignedto_id: assignedtoId,
    }
    return this.addExtraCommand('add_result_for_case/', runId, (`/${caseId}`), data)
  }

  addResultsForCases(runId, results: TestRailResult[]): Promise<AxiosResponse> {
    return this.addExtraCommand('add_results_for_cases/', runId, '', results)
  }

  // -------- RESULT FIELDS ---------------------

  getResultFields(): Promise<AxiosResponse> {
    return this.getIdCommand('get_result_fields/', '')
  }

  // -------- RUNS ------------------------

  getRun(runId: string): Promise<AxiosResponse> {
    return this.getIdCommand('get_run/', runId)
  }

  getRuns(projectId: string): Promise<AxiosResponse> {
    return this.getIdCommand('get_runs/', projectId)
  }

  /**
   * Creates a new test run.
   * @param projectID
   * @param suiteId [number] The ID of the test suite for the test run
   * @param name [string] The name of the test run
   * @param description [string] The description of the test run
   * @param milestoneId [number] The ID of the milestone to link to the test run
   * @param includeAll [boolean] include all test cases or custom case selection
   * @param caseIds [string[]] An array of case IDs for the custom case selection
   * @param refs [string] A comma-separated list of references/requirements
   */
  addRun(
    projectID,
    suiteId,
    name,
    description,
    milestoneId,
    includeAll: boolean,
    caseIds: string[] | null,
    refs: string | null,
  ): Promise<AxiosResponse> {
    const data = {
      suite_id: suiteId,
      name,
      description,
      milestone_id: milestoneId,
      include_all: includeAll,
      case_ids: caseIds,
      refs,
    }
    return this.addCommand('add_run/', projectID, data)
  }

  updateRun(
    runID,
    name,
    description,
    milestoneId,
    includeAll: boolean,
    caseIds: string[] | null,
    refs: string | null,
  ): Promise<AxiosResponse> {
    const data = {
      name,
      description,
      milestone_id: milestoneId,
      include_all: includeAll,
      case_ids: caseIds,
      refs,
    }
    return this.addCommand('update_run/', runID, data)
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
    const data = {
      suite_id: suiteId,
      parent_id: parentId,
      name,
    }
    return this.addCommand('add_section/', projectId, data)
  }

  updateSection(sectionId, name): Promise<AxiosResponse> {
    const data = {
      name,
    }
    return this.addCommand('update_Section/', sectionId, data)
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
    const data = {
      name,
      description,
    }
    return this.addCommand('add_suite/', projectId, data)
  }

  updateSuite(suiteId, name, description): Promise<AxiosResponse> {
    const data = {
      name,
      description,
    }
    return this.addCommand('update_suite/', suiteId, data)
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
