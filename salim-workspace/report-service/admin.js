(() => {
  const tokenInput = document.querySelector('#token');
  const authForm = document.querySelector('#auth');
  const queue = document.querySelector('#queue');
  const cards = document.querySelector('#cards');
  const notice = document.querySelector('#notice');
  const statusSelect = document.querySelector('#status');
  let token = '';
  const resolutions = {
    ADD_CAMERA: [['PUBLISH_NEW_CAMERA', 'Publish approved new camera']],
    VERIFY_PRESENT: [['CONFIRM_PRESENT', 'Confirm camera present']],
    FLAG_LOCATION: [['APPLY_LOCATION', 'Apply corrected location'], ['NO_CHANGE', 'No change']],
    FLAG_REMOVED: [['MARK_REMOVED', 'Mark camera removed'], ['NO_CHANGE', 'No change']],
    FLAG_TYPE: [['CORRECT_TYPE', 'Correct camera type'], ['NO_CHANGE', 'No change']]
  };
  const setNotice = (text, bad = false) => { notice.textContent = text; notice.style.color = bad ? '#ff938b' : ''; };
  const element = (tag, text, className) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
  async function api(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  }
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault(); token = tokenInput.value.trim();
    try { await loadQueue(); queue.classList.remove('hidden'); sessionStorage.setItem('salim-moderator-token', token); setNotice('Connected. Token is held in this browser session only.'); }
    catch (error) { queue.classList.add('hidden'); setNotice(error.message, true); }
  });
  document.querySelector('#forget').addEventListener('click', () => { token = ''; tokenInput.value = ''; sessionStorage.removeItem('salim-moderator-token'); queue.classList.add('hidden'); setNotice('Moderator token cleared.'); });
  document.querySelector('#refresh').addEventListener('click', () => loadQueue().catch(error => setNotice(error.message, true)));
  statusSelect.addEventListener('change', () => loadQueue().catch(error => setNotice(error.message, true)));
  async function loadQueue() {
    const state = statusSelect.value;
    const data = await api(`/v1/admin/reports?status=${encodeURIComponent(state)}`);
    cards.replaceChildren();
    document.querySelector('#queueTitle').textContent = `${state.replace('_', ' ')} reports · ${data.reports.length}`;
    if (!data.reports.length) cards.append(element('div', 'No reports in this queue.', 'empty'));
    data.reports.forEach(report => cards.append(renderReport(report)));
  }
  function renderReport(report) {
    const card = element('article', undefined, 'card');
    const title = report.report_type.replaceAll('_', ' ');
    card.append(element('h2', title));
    const badgeRow = element('div');
    [report.status, report.country, report.kind || 'type not supplied'].forEach(v => badgeRow.append(element('span', v, 'badge')));
    card.append(badgeRow);
    card.append(element('p', `Camera: ${report.camera_id || 'new proposed camera'} · Report: ${report.id}`, 'meta'));
    if (Number.isFinite(report.lat) && Number.isFinite(report.lon)) card.append(element('p', `Proposed point: ${Number(report.lat).toFixed(6)}, ${Number(report.lon).toFixed(6)} · claimed accuracy ${report.accuracy_m ?? 'not supplied'} m`, 'meta'));
    if (report.road) card.append(element('p', `Road: ${report.road}`));
    card.append(element('p', `${report.confirmations || 0} independent confirmations · ${report.disputes || 0} disputes · submitted ${new Date(report.created_at * 1000).toLocaleString()}`, 'muted'));
    const detail = element('details');
    const summary = element('summary', 'Review history');
    const history = element('pre', 'Loading…'); detail.append(summary, history); card.append(detail);
    detail.addEventListener('toggle', async () => { if (detail.open && history.textContent === 'Loading…') { try { const result = await api(`/v1/admin/reports/${encodeURIComponent(report.id)}/history`); history.textContent = JSON.stringify(result.history, null, 2) || 'No review events'; } catch (error) { history.textContent = error.message; } } });
    if (['PENDING', 'NEEDS_REVIEW'].includes(report.status)) {
      const actions = element('div', undefined, 'actions');
      const resolution = document.createElement('select'); resolution.setAttribute('aria-label', 'Approval outcome');
      (resolutions[report.report_type] || [['NO_CHANGE', 'No change']]).forEach(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; resolution.append(option); });
      actions.append(resolution);
      [['APPROVE', 'Approve', ''], ['NEEDS_REVIEW', 'Needs review', 'secondary'], ['REJECT', 'Reject', 'danger']].forEach(([decision, label, style]) => {
        const button = element('button', label, style); button.type = 'button'; button.addEventListener('click', async () => {
          button.disabled = true;
          try { await api(`/v1/admin/reports/${encodeURIComponent(report.id)}/decision`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision, resolution: decision === 'APPROVE' ? resolution.value : 'NO_CHANGE' }) }); setNotice(`${decision.replace('_', ' ')} recorded for ${report.id}.`); await loadQueue(); }
          catch (error) { setNotice(error.message, true); button.disabled = false; }
        }); actions.append(button);
      });
      card.append(actions);
    }
    return card;
  }
  const existing = sessionStorage.getItem('salim-moderator-token');
  if (existing) { tokenInput.value = existing; token = existing; loadQueue().then(() => { queue.classList.remove('hidden'); setNotice('Reconnected for this browser session.'); }).catch(() => { sessionStorage.removeItem('salim-moderator-token'); token = ''; }); }
})();
