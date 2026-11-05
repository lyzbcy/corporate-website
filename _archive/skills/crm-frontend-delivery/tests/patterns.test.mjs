import test from 'node:test';
import assert from 'node:assert/strict';
import { toSafeId, createReadGate, validateSnapshot, createSubmissionSession, createConfirmedStatus, phaseTaskPatch } from '../examples/patterns.mjs';

const limits = { taskNameMax: 15, taskDescriptionMax: 50, descriptionRequired: false };
const task = () => ({ taskName: '示例回访', description: '', scopeType: 'CUSTOM', userIds: [], deptIds: [], employeeTagIds: ['tag-example-1'] });

test('long string identity and version-like zero remain exact; damaged numbers are rejected', () => {
  assert.equal(toSafeId('9007199254740993'), '9007199254740993');
  assert.equal(toSafeId(0), '0');
  assert.throws(() => toSafeId(Number.MAX_SAFE_INTEGER + 1));
});
test('late A response cannot replace B or a closed page', () => {
  const gate = createReadGate(), a = gate.begin('A'), b = gate.begin('B');
  assert.equal(gate.accepts(a, 'B'), false);
  assert.equal(gate.accepts(b, 'B'), true);
  gate.invalidate();
  assert.equal(gate.accepts(b, 'B'), false);
});
test('input changes while other fields await validation: old pass cannot submit new name', async () => {
  let name = 'A', resume;
  const waiting = new Promise(resolve => { resume = resolve; });
  const checking = validateSnapshot(() => name, async () => true, () => waiting);
  await Promise.resolve(); name = 'B'; resume(true);
  assert.equal(await checking, false);
});
test('failed name validation stops later work', async () => {
  let otherCalls = 0;
  assert.equal(await validateSnapshot(() => 'A', async () => false, async () => { otherCalls++; return true; }), false);
  assert.equal(otherCalls, 0);
});
test('success terminates the same entry even when UI input changed; cannot create twice', () => {
  const entry = createSubmissionSession(); entry.open();
  const input = { name: 'A' }, first = entry.begin(input);
  input.name = 'B';
  assert.equal(first.snapshot.name, 'A');
  assert.equal(entry.begin(input), null);
  entry.succeed(first); entry.release(first);
  assert.equal(entry.begin(input), null);
});
test('late old success/finally invalidates cache but does not finish or unlock new session', () => {
  let invalidations = 0;
  const entry = createSubmissionSession(() => invalidations++); entry.open();
  const old = entry.begin({ name: 'old' }); entry.open();
  const current = entry.begin({ name: 'new' });
  assert.equal(entry.succeed(old), false); entry.release(old);
  assert.deepEqual(entry.state(), { session: 2, busy: true, finished: false });
  assert.equal(invalidations, 1);
  entry.release(current);
});
test('failed save releases the lock and permits retry without marking success', () => {
  const entry = createSubmissionSession(); entry.open();
  const attempt = entry.begin({}); entry.release(attempt);
  assert.ok(entry.begin({}));
});
test('cache callback failure cannot reopen a confirmed write', () => {
  const entry = createSubmissionSession(() => { throw new Error('cache'); }); entry.open();
  const ticket = entry.begin({}); assert.throws(() => entry.succeed(ticket)); entry.release(ticket);
  assert.equal(entry.begin({}), null);
});
test('first query failure does not fabricate online; confirmed state survives double failure disabled', () => {
  const state = createConfirmedStatus(); state.fail(); assert.equal(state.value().visible, false);
  state.apply({ featureEnabled: true, workStatus: 'ONLINE', version: 0, canEdit: true, accountBound: true, accountEnabled: true });
  state.fail();
  assert.deepEqual(state.value(), { visible: true, editable: false, confirmed: { workStatus: 'ONLINE', version: 0 } });
});
test('explicit feature disable hides but unknown/incomplete read is not accepted as success', () => {
  const state = createConfirmedStatus();
  assert.throws(() => state.apply({ featureEnabled: true, workStatus: 'ONLINE' }));
  state.apply({ featureEnabled: false }); assert.equal(state.value().visible, false);
  assert.throws(() => state.apply({}));
});
test('incomplete refresh preserves confirmed value but disables further writes', () => {
  const state = createConfirmedStatus();
  state.apply({ featureEnabled: true, workStatus: 'RESTING', version: 2, canEdit: true, accountBound: true, accountEnabled: true });
  assert.throws(() => state.apply({ featureEnabled: true }));
  assert.deepEqual(state.value(), { visible: true, editable: false, confirmed: { workStatus: 'RESTING', version: 2 } });
});
test('unmodified tasks are omitted; explicit deletion is empty, with original untouched', () => {
  const phase = { id: 'phase-example-1', taskConfigList: [{ name: 'existing' }] };
  assert.equal('taskConfigList' in phaseTaskPatch(phase, [], false, limits), false);
  assert.deepEqual(phaseTaskPatch(phase, [], true, limits).taskConfigList, []);
  assert.equal(phase.taskConfigList.length, 1);
});
test('tag scope stays dynamic, display-only fields do not leak into request', () => {
  const draft = { ...task(), scopeNodes: [{ name: '示例标签' }], userTagList: [{ tagName: '示例标签' }] };
  const dto = phaseTaskPatch({ id: 'phase-example-1' }, [draft], true, limits).taskConfigList[0];
  assert.deepEqual(dto.employeeTagIdList, ['tag-example-1']);
  assert.deepEqual(dto.userIds, []); assert.equal('scopeNodes' in dto, false); assert.equal('userTagList' in dto, false);
});
test('removing last custom node is invalid, not silently converted to ALL', () => {
  assert.throws(() => phaseTaskPatch({}, [{ ...task(), employeeTagIds: [] }], true, limits));
});
test('target text rules, optional description and follow type zero apply explicitly', () => {
  assert.doesNotThrow(() => phaseTaskPatch({}, [{ ...task(), limitFollowType: true, requiredFollowTypeId: 0 }], true, limits));
  assert.throws(() => phaseTaskPatch({}, [{ ...task(), taskName: 'abc' }], true, { ...limits, taskNameMax: 2 }));
  assert.throws(() => phaseTaskPatch({}, [task()], true, { ...limits, descriptionRequired: true }));
});
