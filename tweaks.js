/* =====================================================================
   Azur Note — Tweaks panel
   ---------------------------------------------------------------------
   Adds a floating Tweaks panel to whichever page includes this script.
   Provides 4 alternatives to the mono-uppercase treatment used pervasively
   across Project Table and Project Information pages.

   Design lives in CSS variables so a single mode switch restyles every
   eyebrow / pill / key / role label / breadcrumb / date / count etc.
   ===================================================================== */
(function(){
  'use strict';

  /* ------------------------------------------------------------------
     1.  Define modes
     ------------------------------------------------------------------ */
  const MODES = {
    'mono-caps': {
      label: 'Mono caps',
      hint: 'Default — JetBrains Mono, full uppercase, wide tracking',
      vars: {
        '--mc-font'      : '"JetBrains Mono", ui-monospace, monospace',
        '--mc-transform' : 'uppercase',
        '--mc-tracking'  : '0.12em',
        '--mc-weight'    : '400',
        '--mc-style'     : 'normal',
        '--mc-feature'   : 'normal',
        '--mc-size-mult' : '1',
      },
    },
    'small-caps': {
      label: 'Sans small-caps',
      hint: 'Inter Tight small-caps — refined, less shouty',
      vars: {
        '--mc-font'      : '"Inter Tight", system-ui, sans-serif',
        '--mc-transform' : 'lowercase',
        '--mc-tracking'  : '0.06em',
        '--mc-weight'    : '600',
        '--mc-style'     : 'normal',
        '--mc-feature'   : '"smcp" 1, "c2sc" 1',
        '--mc-size-mult' : '1.05',
      },
    },
    'serif-italic': {
      label: 'Serif italic',
      hint: 'Newsreader italic, lowercase — editorial tone',
      vars: {
        '--mc-font'      : '"Newsreader", Georgia, serif',
        '--mc-transform' : 'none',
        '--mc-tracking'  : '0',
        '--mc-weight'    : '400',
        '--mc-style'     : 'italic',
        '--mc-feature'   : 'normal',
        '--mc-size-mult' : '1.18',
      },
    },
    'sentence': {
      label: 'Sentence sans',
      hint: 'Inter Tight, sentence case — modern minimal',
      vars: {
        '--mc-font'      : '"Inter Tight", system-ui, sans-serif',
        '--mc-transform' : 'none',
        '--mc-tracking'  : '0.01em',
        '--mc-weight'    : '500',
        '--mc-style'     : 'normal',
        '--mc-feature'   : 'normal',
        '--mc-size-mult' : '1.08',
      },
    },
  };

  // The selectors below cover every place where mono+caps is used in
  // index.html and Project Information.html.
  const TARGET_SELECTOR = [
    /* shared chrome */
    '.user .who .role',
    '.welcome',
    /* table view */
    'thead th',
    '.client-cell .id',
    '.project-cell .code',
    '.step .pill',
    '.pill',
    '.date',
    '.summary',
    '.leaf-mark .t small',
    '.tl-head-left',
    '.tl-head-left .scroll-hint',
    '.tl-years span',
    '.tl-months span',
    '.tl-row-left .id',
    '.tl-bar .bar-dates',
    '.tl-period .r',
    '.tl-legend',
    '.tl-today .tlab',
    /* sidebar */
    '.sidebar-nav .group-label',
    '.nav-item .badge',
    '.profile-menu .p-head .mail',
    /* filters */
    '.filters-panel .f-row .k',
    /* dialogs */
    '.pd-eyebrow',
    '.pd-code',
    '.pd-step .label .sub',
    '.pd-step .timing',
    '.pd-foot .hint',
    /* datepicker */
    '.dp-dow span',
    /* project info — breadcrumbs / hero */
    '.crumbs',
    '.proj-head .code',
    '.proj-head .head-stats .stat .k',
    '.proj-head .head-stats .stat .v',
    /* tabs */
    '.tab .tab-count',
    '.tab-empty .e-sub',
    /* planning */
    '.plan-summary .ps-k',
    '.plan-summary .ps-bar-head .ps-days',
    '.phase-title .sub',
    '.phase-dates',
    '.phase-progress .pp-days',
    '.subtask .st-dates',
    '.subtask .st-days',
    /* storage */
    '.storage-bar .provider',
    '.storage-bar .crumb-path',
    '.tree-pane .tree-label',
    '.tree-node .tcount',
    '.files-head',
    '.file-row .fname .meta',
    '.file-row .fsize',
    '.file-row .fmod',
    '.file-row .fowner',
    '.storage-foot',
    /* fields & cards */
    '.field-row .k',
    '.field-row .v.mono',
    '.yn',
    '.role-tag',
    '.member-row .person .body .email',
    '.member-status',
    '.card-head .h-meta',
    /* status block */
    '.status-block .row .k',
    '.status-block .progress-labels',
    '.status-block .next',
    /* foot */
    '.foot',
    /* preview */
    '.preview .paper .ph-sub',
    '.preview .meta',
    /* person */
    '.person .r',
    /* chips */
    '.chip',
  ].join(',\n');

  /* ------------------------------------------------------------------
     2.  Inject CSS — variables + the override block
     ------------------------------------------------------------------ */
  const styleEl = document.createElement('style');
  styleEl.id = 'azur-tweaks-style';
  styleEl.textContent = `
    :root {
      --mc-font: "JetBrains Mono", ui-monospace, monospace;
      --mc-transform: uppercase;
      --mc-tracking: 0.12em;
      --mc-weight: 400;
      --mc-style: normal;
      --mc-feature: normal;
      --mc-size-mult: 1;
    }

    /* ============================================================
       Targeted override — applies to every mono+caps element.
       Uses CSS vars so a single mode swap restyles everything.
       The :where() keeps specificity at 0 so our values cascade
       without us having to !important everything.
       ============================================================ */
    :where(${TARGET_SELECTOR}) {
      font-family: var(--mc-font) !important;
      text-transform: var(--mc-transform) !important;
      letter-spacing: var(--mc-tracking) !important;
      font-weight: var(--mc-weight) !important;
      font-style: var(--mc-style) !important;
      font-feature-settings: var(--mc-feature) !important;
    }

    /* Apply size multiplier inside the elements. We can't multiply
       font-size with vars directly, so use calc on common base sizes
       through a class that we add to <html>. */
    html.mc-size-mult :where(${TARGET_SELECTOR}) {
      font-size: calc(var(--mc-base-size, 11px) * var(--mc-size-mult));
    }

    /* Keep some elements that should stay weighty/bold-ish */
    :where(.pill, .role-tag, .yn) {
      font-weight: max(500, var(--mc-weight)) !important;
    }

    /* When tweaks are off (panel hidden), still keep the look stable */

    /* ============================================================
       Tweaks panel chrome
       ============================================================ */
    #azur-tweaks {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 320px;
      background: #FBFAF7;
      border: 1px solid rgba(35, 87, 112, 0.22);
      border-radius: 14px;
      box-shadow: 0 18px 48px rgba(35, 87, 112, 0.18),
                  0 4px 14px rgba(35, 87, 112, 0.08);
      z-index: 200;
      font-family: "Inter Tight", system-ui, sans-serif;
      color: #235770;
      overflow: hidden;
      display: none;
    }
    #azur-tweaks.open { display: block; }
    #azur-tweaks .tw-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 12px;
      border-bottom: 1px solid rgba(35, 87, 112, 0.12);
      background: #F3E9E1;
    }
    #azur-tweaks .tw-title {
      font-family: "Outfit", system-ui, sans-serif;
      font-size: 17px;
      letter-spacing: -0.01em;
      font-weight: 500;
    }
    #azur-tweaks .tw-title em {
      font-style: normal;
      font-family: "Outfit", system-ui, sans-serif;
      font-weight: 300;
      color: #418EA0;
    }
    #azur-tweaks .tw-close {
      width: 26px; height: 26px;
      border-radius: 6px;
      border: 1px solid rgba(35, 87, 112, 0.22);
      background: transparent;
      color: #235770;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    #azur-tweaks .tw-close:hover { background: rgba(35,87,112,0.06); }

    #azur-tweaks .tw-body { padding: 14px 16px 16px; }
    #azur-tweaks .tw-section-label {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(35, 87, 112, 0.58);
      margin-bottom: 10px;
    }
    #azur-tweaks .tw-help {
      font-size: 12px;
      color: rgba(35, 87, 112, 0.62);
      line-height: 1.5;
      margin-bottom: 14px;
      text-wrap: pretty;
    }

    #azur-tweaks .tw-options {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    #azur-tweaks .tw-opt {
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 10px;
      padding: 11px 12px;
      border: 1px solid rgba(35, 87, 112, 0.16);
      border-radius: 8px;
      background: transparent;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      color: #235770;
      transition: background .12s, border-color .12s;
    }
    #azur-tweaks .tw-opt:hover {
      background: rgba(35,87,112,0.04);
      border-color: rgba(35, 87, 112, 0.28);
    }
    #azur-tweaks .tw-opt.on {
      border-color: #235770;
      background: rgba(35,87,112,0.06);
    }
    #azur-tweaks .tw-radio {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid rgba(35, 87, 112, 0.32);
      margin-top: 4px;
      position: relative;
      transition: border-color .12s;
    }
    #azur-tweaks .tw-opt.on .tw-radio {
      border-color: #235770;
    }
    #azur-tweaks .tw-opt.on .tw-radio::after {
      content: "";
      position: absolute;
      inset: 2px;
      border-radius: 50%;
      background: #235770;
    }
    #azur-tweaks .tw-opt-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }
    #azur-tweaks .tw-opt-label {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.2;
    }
    #azur-tweaks .tw-opt-sample {
      font-size: 12px;
      color: rgba(35, 87, 112, 0.78);
      line-height: 1.3;
    }

    /* Per-option sample preview reflects the actual mode */
    #azur-tweaks .tw-opt[data-mode="mono-caps"] .tw-opt-sample {
      font-family: "JetBrains Mono", ui-monospace, monospace;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-size: 10px;
    }
    #azur-tweaks .tw-opt[data-mode="small-caps"] .tw-opt-sample {
      font-family: "Inter Tight", system-ui, sans-serif;
      font-feature-settings: "smcp" 1, "c2sc" 1;
      letter-spacing: 0.06em;
      font-weight: 600;
      font-size: 11px;
      text-transform: lowercase;
    }
    #azur-tweaks .tw-opt[data-mode="serif-italic"] .tw-opt-sample {
      font-family: "Newsreader", Georgia, serif;
      font-style: italic;
      font-size: 13px;
      letter-spacing: 0;
    }
    #azur-tweaks .tw-opt[data-mode="sentence"] .tw-opt-sample {
      font-family: "Inter Tight", system-ui, sans-serif;
      letter-spacing: 0.01em;
      font-size: 12px;
      font-weight: 500;
    }

    #azur-tweaks .tw-foot {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(35, 87, 112, 0.12);
      font-family: "JetBrains Mono", ui-monospace, monospace;
      font-size: 9px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(35, 87, 112, 0.58);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #azur-tweaks .tw-foot .scope { color: #418EA0; }
  `;
  document.head.appendChild(styleEl);

  /* ------------------------------------------------------------------
     3.  Build the panel
     ------------------------------------------------------------------ */
  function applyMode(modeKey){
    const mode = MODES[modeKey] || MODES['mono-caps'];
    const root = document.documentElement;
    Object.entries(mode.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    try { localStorage.setItem('azur-tweak-mode', modeKey); } catch (e) {}
    // Update selected states
    document.querySelectorAll('#azur-tweaks .tw-opt').forEach(b => {
      b.classList.toggle('on', b.dataset.mode === modeKey);
    });
  }

  function getInitialMode(){
    try {
      const saved = localStorage.getItem('azur-tweak-mode');
      if (saved && MODES[saved]) return saved;
    } catch (e) {}
    return 'mono-caps';
  }

  function buildPanel(){
    const panel = document.createElement('div');
    panel.id = 'azur-tweaks';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Tweaks');

    const opts = Object.entries(MODES).map(([key, m]) => `
      <button class="tw-opt" data-mode="${key}" type="button">
        <span class="tw-radio"></span>
        <span class="tw-opt-body">
          <span class="tw-opt-label">${m.label}</span>
          <span class="tw-opt-sample">In review · 142 pages · 26 Apr 26</span>
        </span>
      </button>
    `).join('');

    panel.innerHTML = `
      <div class="tw-head">
        <div class="tw-title">Tweaks</div>
        <button class="tw-close" aria-label="Close tweaks">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>
        </button>
      </div>
      <div class="tw-body">
        <div class="tw-section-label">Eyebrow / label typography</div>
        <div class="tw-help">Cycle the treatment used for pills, dates, breadcrumbs, role tags, field keys, counts and other label-style text across both pages.</div>
        <div class="tw-options">${opts}</div>
        <div class="tw-foot">
          <span>Mono caps · 4 modes</span>
          <span class="scope">Both pages</span>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    panel.querySelector('.tw-close').addEventListener('click', () => {
      panel.classList.remove('open');
      try {
        window.parent.postMessage({type: '__edit_mode_dismissed'}, '*');
      } catch (e) {}
    });

    panel.querySelectorAll('.tw-opt').forEach(btn => {
      btn.addEventListener('click', () => applyMode(btn.dataset.mode));
    });

    return panel;
  }

  /* ------------------------------------------------------------------
     4.  Boot
     ------------------------------------------------------------------ */
  function init(){
    const panel = buildPanel();
    applyMode(getInitialMode());

    // Wire host edit-mode protocol BEFORE announcing availability.
    window.addEventListener('message', (e) => {
      const d = e.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === '__activate_edit_mode')   panel.classList.add('open');
      if (d.type === '__deactivate_edit_mode') panel.classList.remove('open');
    });
    try {
      window.parent.postMessage({type: '__edit_mode_available'}, '*');
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
