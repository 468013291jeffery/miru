/* M121 OFF CAMERA state. Story facts, consent and endings. No DOM. */
(function (root) {
  'use strict';
  function clone(v) { return JSON.parse(JSON.stringify(v)); }
  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  function createM121Engine(data) {
    const nodes = data.nodes || [];
    const byId = Object.fromEntries(nodes.map(n => [n.scene_id, n]));
    const heat = Object.fromEntries((data.heatRules || []).map(h => [h.id, h]));
    const endings = Object.fromEntries((data.endings || []).map(e => [e.id, e]));
    function initial() {
      const rel = {};
      for (const [id, row] of Object.entries(data.relations || {})) rel[id] = { attraction: row.attraction || 0, trust: row.trust || 0, respect: row.respect || 0 };
      return { current: null, rel, flags: {}, completed: {}, boundary: {}, consent: null, exclusive: null, ending: null, endPending: false, games: {}, denied: [], cg: {} };
    }
    function sceneOfIntent(id) {
      return nodes.filter(n => id.startsWith(n.scene_id + '_')).sort((a, b) => b.scene_id.length - a.scene_id.length)[0] || null;
    }
    function canEnter(state, id) {
      const rule = heat[id];
      if (!rule) return false;
      if (state.boundary[rule.partner]) return false;
      if (state.exclusive && state.exclusive !== rule.partner) return false;
      if (!state.completed[rule.after]) return false;
      if (rule.needFlags.some(f => !state.flags[f])) return false;
      if (rule.needHeat.some(f => !state.flags[f])) return false;
      return true;
    }
    function applyIntent(state, intentId) {
      const node = sceneOfIntent(intentId);
      if (!node) return false;
      const intent = (node.intents || []).find(h => h.id === intentId);
      if (!intent) return false;
      const kind = intentId.split('_').pop();
      if (node.heat_scene && !canEnter(state, node.scene_id)) {
        state.denied.push(node.scene_id);
        return false;
      }
      const fx = intent.effects || {};
      if (kind !== 'OTHER') {
        const fact = node.persistent_scene_flag || (node.intents.find(h => h.id.endsWith('_CLARIFY')) || {}).effects?.plot_flag;
        if (fact) state.flags[fact] = true;
        if (node.exit_flag) state.flags[node.exit_flag] = true;
        if (!node.heat_scene) state.completed[node.scene_id] = kind;
      }
      if (fx.plot_flag && kind !== 'OTHER') state.flags[fx.plot_flag] = true;
      if (fx.relation) for (const [who, delta] of Object.entries(fx.relation)) {
        const row = state.rel[who] || (state.rel[who] = { attraction: 25, trust: 25, respect: 25 });
        for (const k of ['attraction', 'trust', 'respect']) if (delta[k]) row[k] = clamp(row[k] + delta[k]);
      }
      if (kind === 'BOUNDARY' || fx.consent_for_current_action === false) {
        const who = node.partner_id;
        if (who) state.boundary[who] = true;
        state.consent = { scene: node.scene_id, partner: who || null, action: 'revoked', revoked: true };
        if (node.heat_scene) delete state.cg[node.scene_id];
        if (fx.boundary) state.flags[fx.boundary] = true;
      }
      if (fx.consent_scope && kind !== 'BOUNDARY') {
        state.consent = Object.assign({ revoked: false }, fx.consent_scope);
        if (fx.consent_scope.action === 'heat_full') state.cg[node.scene_id] = true;
        else delete state.cg[node.scene_id];
      }
      return true;
    }
    function chooseEnding(state, id) {
      if (id === 'KEEP') return;
      if (id === 'UNSPEC') { if (!state.ending) { state.ending = null; state.endPending = true; } return; }
      if (state.ending) return;
      const rule = endings[id];
      if (!rule) return;
      const flagOk = !rule.flag || rule.flag === 'epilogue_reached' || !!state.flags[rule.flag];
      const exclusiveOk = !rule.partner || !state.exclusive || state.exclusive === rule.partner;
      if (!flagOk || !exclusiveOk) { state.ending = null; state.endPending = true; state.denied.push('END_' + id); return; }
      state.ending = id;
      state.endPending = false;
      state.exclusive = rule.partner || null;
    }
    function note(state, flag) {
      const f = String(flag || '');
      if (f.startsWith('m121_scene~')) {
        state.current = f.slice('m121_scene~'.length);
        if (state.current === 'C12_S03' || state.current === 'C12_S04') state.flags.epilogue_reached = true;
        return;
      }
      if (f.startsWith('m121_i_')) { applyIntent(state, f.slice('m121_i_'.length)); return; }
      if (f.startsWith('m121_mg_')) { state.games[f] = true; return; }
      if (f.startsWith('m121_pick_END_')) { chooseEnding(state, f.slice('m121_pick_END_'.length)); return; }
      if (f === 'm121_epi_stop') {
        const who = state.ending;
        if (who) { state.consent = { scene: 'EPI_' + who, partner: who, action: 'revoked', revoked: true }; delete state.cg['EPI_' + who]; }
        return;
      }
      if (f === 'm121_epi_yes') {
        const who = state.ending;
        if (who && endings[who] && endings[who].partner) state.cg['EPI_' + who] = true;
      }
    }
    function sync(state) {
      const enter = [];
      for (const id of Object.keys(heat)) if (canEnter(state, id)) enter.push('m121_enter_' + id);
      const out = { enter, pending: state.endPending ? ['m121_end_pending'] : [] };
      if (state.ending) out.pending.push('m121_end_' + state.ending);
      return out;
    }
    function assetUrl(id) { return (data.assets && data.assets[id]) || ''; }
    function placeholder(id) {
      const label = String(id || 'M121').replace(/[<>&"]/g, '');
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><rect width="100%" height="100%" fill="#1b1520"/>' +
        '<text x="540" y="900" fill="#f1ba81" font-size="42" text-anchor="middle" font-family="sans-serif">' + label + '</text>' +
        '<text x="540" y="980" fill="#c7bed4" font-size="28" text-anchor="middle" font-family="sans-serif">OFF CAMERA · not in yet</text></svg>';
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }
    return { initial, note, canEnter, sync, assetUrl, placeholder, byId, clone };
  }
  root.createM121Engine = createM121Engine;
  if (typeof module !== 'undefined' && module.exports) module.exports = { createM121Engine };
})(typeof window !== 'undefined' ? window : globalThis);
