/**
 * Independent, framework-free teaching patterns. No HTTP or company implementation.
 * Clone inputs must be structuredClone-compatible. Adapt DTO/UI/error contracts before use.
 */
export function toSafeId(value) {
  if (typeof value === 'string' && value.trim()) return value;
  if (typeof value === 'number' && Number.isSafeInteger(value)) return String(value);
  throw new TypeError('ID must be a non-empty string or safe integer; decode raw Long IDs before JSON.parse');
}

export function createReadGate() {
  let revision = 0;
  let key;
  return {
    begin(nextKey) { key = nextKey; return { revision: ++revision, key }; },
    accepts(ticket, currentKey) { return ticket.revision === revision && ticket.key === key && key === currentKey; },
    invalidate() { revision++; key = undefined; }
  };
}

export async function validateSnapshot(readKey, validate, waitForOtherFields) {
  const key = readKey();
  if (!(await validate(key))) return false;
  if (!(await waitForOtherFields())) return false;
  return readKey() === key;
}

export function createSubmissionSession(invalidate = () => {}) {
  let session = 0, busy = false, finished = false;
  return {
    open() { session++; busy = false; finished = false; },
    begin(payload) {
      if (busy || finished) return null;
      const snapshot = structuredClone(payload);
      busy = true;
      return { session, snapshot };
    },
    succeed(ticket) {
      // Call only after the real protocol explicitly confirmed success.
      // Mark current session complete even if a cache callback throws.
      try { invalidate(); } finally { if (ticket.session === session) finished = true; }
      return ticket.session === session;
    },
    release(ticket) { if (ticket.session === session) busy = false; },
    state() { return { session, busy, finished }; }
  };
}

export function createConfirmedStatus() {
  let confirmed = null, editable = false, featureEnabled;
  return {
    apply(read) {
      editable = false;
      if (typeof read.featureEnabled !== 'boolean') throw new TypeError('unknown feature state');
      if (!read.featureEnabled) { featureEnabled = false; editable = false; return; }
      if (!['ONLINE', 'RESTING'].includes(read.workStatus) ||
          !Number.isSafeInteger(read.version) || read.version < 0) {
        throw new TypeError('incomplete status/version');
      }
      featureEnabled = true;
      confirmed = { workStatus: read.workStatus, version: read.version };
      editable = read.canEdit === true && read.accountBound === true && read.accountEnabled === true;
    },
    fail() { editable = false; },
    value() { return { visible: featureEnabled === true && confirmed !== null, editable, confirmed: structuredClone(confirmed) }; }
  };
}

export function serializeTask(task, sortNo, limits) {
  const name = task.taskName?.trim() || '';
  const description = task.description?.trim() || '';
  if (!name || [...name].length > limits.taskNameMax || [...description].length > limits.taskDescriptionMax ||
      (limits.descriptionRequired && !description)) throw new TypeError('task text invalid');
  if (!['ALL', 'CUSTOM'].includes(task.scopeType)) throw new TypeError('scope invalid');
  const users = task.userIds || [], departments = task.deptIds || [], tags = task.employeeTagIds || [];
  if (task.scopeType === 'CUSTOM' && !(users.length + departments.length + tags.length)) throw new TypeError('CUSTOM scope is empty');
  if (task.limitFollowType && (task.requiredFollowTypeId == null || task.requiredFollowTypeId === '')) throw new TypeError('follow type required');
  return {
    ...(task.taskConfigId == null || task.taskConfigId === '' ? {} : { id: toSafeId(task.taskConfigId) }),
    name, description,
    userIds: task.scopeType === 'ALL' ? [] : users.map(toSafeId),
    departmentIds: task.scopeType === 'ALL' ? [] : departments.map(toSafeId),
    employeeTagIdList: task.scopeType === 'ALL' ? [] : tags.map(toSafeId),
    requiredFollowTypeId: task.limitFollowType ? toSafeId(task.requiredFollowTypeId) : null,
    sortNo
  };
}

export function phaseTaskPatch(baseFields, tasks, edited, limits) {
  // baseFields is the caller's approved phase-field allowlist, not an arbitrary API object.
  const result = structuredClone(baseFields);
  delete result.taskConfigList;
  if (edited) result.taskConfigList = tasks.map((task, index) => serializeTask(task, index, limits));
  return result;
}
