const state = {
  perfilId: 'perfil-principal',
  route: '#/dashboard',
  dados: {
    tentativas: [],
    editais: [],
    ciclos: [],
    resumos: [],
    revisoes: [],
    simulados: [],
    perfis: []
  }
};

const titleMap = {
  '/dashboard': 'Dashboard',
  '/tentativas': 'Tentativas',
  '/resolver-ia': 'Resolver com IA',
  '/mentor': 'Mentor IA',
  '/revisao': 'Revisão do Dia',
  '/diagnostico': 'Diagnóstico de Erros',
  '/caderno': 'Caderno de Resumos',
  '/ciclo': 'Ciclo de Estudos',
  '/estatisticas/disciplinas': 'Estatísticas por Disciplinas',
  '/estatisticas/assuntos': 'Estatísticas por Assuntos',
  '/estatisticas/bancas': 'Estatísticas por Bancas',
  '/estatisticas/concursos': 'Estatísticas por Concursos',
  '/editais': 'Editais',
  '/simulados': 'Simulados',
  '/perfis': 'Perfis',
  '/configuracoes': 'Configurações',
  '/importar-historico': 'Importar Histórico'
};

function normalizeRoute() {
  const hash = window.location.hash || '#/dashboard';
  return hash.startsWith('#') ? hash.replace('#', '') : hash;
}

function getTentativas() {
  return db.getAll('tentativas');
}

function getStats() {
  const tentativas = getTentativas();
  const total = tentativas.length;
  const acertadas = tentativas.filter((item) => item.resultado === 'certa' || item.acertou === true).length;
  const erradas = total - acertadas;
  const taxa = total ? Math.round((acertadas / total) * 100) : 0;

  return {
    total,
    acertadas,
    erradas,
    taxa,
    disciplinaMaisFrequente: (() => {
      const map = {};
      tentativas.forEach((item) => {
        const key = item.disciplina || 'Sem disciplina';
        map[key] = (map[key] || 0) + 1;
      });
      const entries = Object.entries(map);
      if (!entries.length) return '—';
      return entries.sort((a, b) => b[1] - a[1])[0][0];
    })()
  };
}

function renderDashboard() {
  const stats = getStats();

  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Resumo do desempenho</p>
          <h2>Dashboard</h2>
        </div>
        <button class="btn btn-primary" data-open-form>Registrar tentativa</button>
      </div>

      <div class="kpis">
        <div class="kpi">
          <strong>${stats.total}</strong>
          <span>Questões</span>
        </div>
        <div class="kpi">
          <strong>${stats.acertadas}</strong>
          <span>Acertos</span>
        </div>
        <div class="kpi">
          <strong>${stats.erradas}</strong>
          <span>Erros</span>
        </div>
        <div class="kpi">
          <strong>${stats.taxa}%</strong>
          <span>Taxa</span>
        </div>
      </div>

      <div class="resumo-grid">
        <div class="mini-panel">
          <span class="muted">Disciplina mais frequente</span>
          <h3>${stats.disciplinaMaisFrequente}</h3>
        </div>
        <div class="mini-panel">
          <span class="muted">Status</span>
          <h3>${stats.total ? 'Ativo' : 'Sem dados'}</h3>
        </div>
      </div>
    </section>
  `;
}

function renderTentativas() {
  const tentativas = getTentativas();

  const rows = tentativas.length
    ? tentativas
        .slice()
        .reverse()
        .map((item) => `
          <tr>
            <td>${item.disciplina || '—'}</td>
            <td>${item.assunto || '—'}</td>
            <td>${item.banca || '—'}</td>
            <td>${item.concurso || '—'}</td>
            <td><span class="status ${item.resultado === 'certa' || item.acertou ? 'success' : 'danger'}">${item.resultado === 'certa' || item.acertou ? 'Certa' : 'Errada'}</span></td>
            <td>
              <button class="btn btn-small danger" data-delete-id="${item.id}">Excluir</button>
            </td>
          </tr>
        `)
        .join('')
    : `
      <tr>
        <td colspan="6" class="empty-cell">Nenhuma tentativa registrada ainda.</td>
      </tr>
    `;

  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Histórico</p>
          <h2>Tentativas</h2>
        </div>
        <button class="btn btn-primary" data-open-form>Registrar tentativa</button>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Assunto</th>
              <th>Banca</th>
              <th>Concurso</th>
              <th>Resultado</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderFallback(blockTitle) {
  return `
    <section class="panel">
      <p class="eyebrow">Módulo</p>
      <h2>${blockTitle}</h2>
      <p>Essa área foi preparada para receber a funcionalidade completa do projeto. A estrutura principal já está pronta e pronta para evoluir.</p>
    </section>
  `;
}

function renderPage() {
  const view = document.getElementById('view');
  const route = normalizeRoute();
  const pageTitle = document.getElementById('page-title');

  if (pageTitle) pageTitle.textContent = titleMap[route] || 'Dashboard';

  let html = renderDashboard();

  switch (route) {
    case '/dashboard':
      html = renderDashboard();
      break;
    case '/tentativas':
      html = renderTentativas();
      break;
    case '/resolver-ia':
      html = renderFallback('Resolver com IA');
      break;
    case '/mentor':
      html = renderFallback('Mentor IA');
      break;
    case '/revisao':
      html = renderFallback('Revisão do Dia');
      break;
    case '/diagnostico':
      html = renderFallback('Diagnóstico de Erros');
      break;
    case '/caderno':
      html = renderFallback('Caderno de Resumos');
      break;
    case '/ciclo':
      html = renderFallback('Ciclo de Estudos');
      break;
    case '/estatisticas/disciplinas':
      html = renderFallback('Estatísticas por Disciplinas');
      break;
    case '/estatisticas/assuntos':
      html = renderFallback('Estatísticas por Assuntos');
      break;
    case '/estatisticas/bancas':
      html = renderFallback('Estatísticas por Bancas');
      break;
    case '/estatisticas/concursos':
      html = renderFallback('Estatísticas por Concursos');
      break;
    case '/editais':
      html = renderFallback('Editais');
      break;
    case '/simulados':
      html = renderFallback('Simulados');
      break;
    case '/perfis':
      html = renderFallback('Perfis');
      break;
    case '/configuracoes':
      html = renderFallback('Configurações');
      break;
    case '/importar-historico':
      html = renderFallback('Importar Histórico');
      break;
    default:
      html = renderDashboard();
  }

  view.innerHTML = html;

  document.querySelectorAll('[data-open-form]').forEach((button) => {
    button.addEventListener('click', openAttemptModal);
  });

  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-delete-id');
      const list = db.getAll('tentativas').filter((item) => String(item.id) !== String(id));
      db.setAll('tentativas', list);
      renderPage();
      showToast('Tentativa removida.');
    });
  });
}

function showToast(message) {
  const root = document.getElementById('toast-root');
  if (!root) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  root.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function openAttemptModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-close-modal>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 id="modal-title">Registrar tentativa</h3>
          <button class="icon-btn" data-close-modal aria-label="Fechar">✕</button>
        </div>

        <form id="attempt-form" class="attempt-form">
          <div class="form-grid">
            <label>
              Disciplina
              <input type="text" name="disciplina" placeholder="Ex.: Matemática" required>
            </label>
            <label>
              Assunto
              <input type="text" name="assunto" placeholder="Ex.: Geometria" required>
            </label>
            <label>
              Banca
              <input type="text" name="banca" placeholder="Ex.: CESPE" required>
            </label>
            <label>
              Concurso
              <input type="text" name="concurso" placeholder="Ex.: TRT 2025" required>
            </label>
            <label>
              Resultado
              <select name="resultado">
                <option value="certa">Certa</option>
                <option value="errada">Errada</option>
              </select>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn" data-close-modal>Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('attempt-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      id: Date.now(),
      disciplina: String(formData.get('disciplina') || '').trim(),
      assunto: String(formData.get('assunto') || '').trim(),
      banca: String(formData.get('banca') || '').trim(),
      concurso: String(formData.get('concurso') || '').trim(),
      resultado: String(formData.get('resultado') || 'certa'),
      acertou: String(formData.get('resultado') || 'certa') === 'certa',
      criadoEm: new Date().toISOString()
    };

    const list = db.getAll('tentativas');
    list.push(payload);
    db.setAll('tentativas', list);
    modalRoot.innerHTML = '';
    renderPage();
    showToast('Tentativa salva com sucesso.');
  });

  modalRoot.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
  });
}

function setupSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggle = document.getElementById('sidebar-toggle');
  const mobileMenu = document.getElementById('mobile-menu-btn');

  const applySidebar = (open) => {
    if (sidebar) sidebar.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('open', open);
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = sidebar && sidebar.classList.contains('open');
      applySidebar(!isOpen);
    });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', () => applySidebar(true));
  }

  if (overlay) {
    overlay.addEventListener('click', () => applySidebar(false));
  }

  document.querySelectorAll('.nav-group-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.getAttribute('data-group');
      const menu = document.querySelector(`[data-submenu="${group}"]`);
      if (menu) menu.classList.toggle('open');
    });
  });
}

function syncCloudButton() {
  const btn = document.getElementById('conta-btn');
  const label = document.getElementById('conta-btn-label');

  if (!btn) return;

  if (label) {
    label.textContent = 'Sincronizar';
  } else {
    btn.textContent = 'Sincronizar';
  }

  btn.addEventListener('click', () => {
    if (label) {
      label.textContent = 'Sincronizar';
    } else {
      btn.textContent = 'Sincronizar';
    }
    showToast('Sincronização local habilitada.');
  });
}

function setupApp() {
  setupSidebar();
  syncCloudButton();
  renderPage();

  const addQuestaoBtn = document.getElementById('add-questao-btn');
  if (addQuestaoBtn) {
    addQuestaoBtn.addEventListener('click', openAttemptModal);
  }

  window.addEventListener('hashchange', renderPage);
}

window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.location.hash = '#/dashboard';
  }
  state.route = window.location.hash || '#/dashboard';
  setupApp();
});

window.app = { state, renderPage, openAttemptModal };
