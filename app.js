const state = {
  perfilId: 'perfil-principal',
  route: '#/dashboard',
  theme: localStorage.getItem('theme') || 'dark'
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

function getRecords(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function setRecords(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTentativas() {
  return getRecords('tentativas', []);
}

function safeText(value, fallback = '—') {
  return value && String(value).trim() ? String(value).trim() : fallback;
}

function getStats() {
  const tentativas = getTentativas();
  const total = tentativas.length;
  const acertadas = tentativas.filter((item) => item.resultado === 'certa' || item.acertou === true).length;
  const erradas = Math.max(total - acertadas, 0);
  const taxa = total ? Math.round((acertadas / total) * 100) : 0;

  const countByDisciplina = {};
  tentativas.forEach((item) => {
    const disciplina = safeText(item.disciplina, 'Sem disciplina');
    countByDisciplina[disciplina] = (countByDisciplina[disciplina] || 0) + 1;
  });

  const disciplinaMaisFrequente = Object.keys(countByDisciplina).length
    ? Object.entries(countByDisciplina).sort((a, b) => b[1] - a[1])[0][0]
    : '—';

  return { total, acertadas, erradas, taxa, disciplinaMaisFrequente };
}

function renderDashboard() {
  const stats = getStats();
  const recent = getTentativas().slice(-3).reverse();

  const latestRows = recent.length ? recent.map((item) => `
    <div class="mini-activity">
      <div>
        <strong>${safeText(item.disciplina)}</strong>
        <small>${safeText(item.assunto)} • ${safeText(item.banca)}</small>
      </div>
      <span class="tag ${item.resultado === 'certa' || item.acertou ? 'success' : 'danger'}">${item.resultado === 'certa' || item.acertou ? 'Certa' : 'Errada'}</span>
    </div>
  `).join('') : '<div class="empty-cell-box">Nenhuma atividade recente.</div>';

  return `
    <section class="panel dashboard-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Resumo do desempenho</p>
          <h2>Dashboard</h2>
        </div>
        <button class="btn btn-primary" data-open-form>Registrar tentativa</button>
      </div>

      <div class="kpis">
        <div class="kpi accent">
          <span>Questões</span>
          <strong>${stats.total}</strong>
        </div>
        <div class="kpi green">
          <span>Acertos</span>
          <strong>${stats.acertadas}</strong>
        </div>
        <div class="kpi danger">
          <span>Erros</span>
          <strong>${stats.erradas}</strong>
        </div>
        <div class="kpi gold">
          <span>Taxa</span>
          <strong>${stats.taxa}%</strong>
        </div>
      </div>

      <div class="resumo-grid">
        <div class="mini-panel">
          <span class="muted">Disciplina mais frequente</span>
          <h3>${stats.disciplinaMaisFrequente}</h3>
        </div>
        <div class="mini-panel">
          <span class="muted">Status</span>
          <h3>${stats.total ? 'Em evolução' : 'Sem dados'}</h3>
        </div>
        <div class="mini-panel">
          <span class="muted">Próximo foco</span>
          <h3>${stats.total ? 'Revisão ativa' : 'Sem foco'}</h3>
        </div>
      </div>

      <div class="two-column-grid">
        <div class="sub-panel">
          <div class="sub-panel-head">
            <h3>Atividades recentes</h3>
          </div>
          <div class="stack-list">${latestRows}</div>
        </div>

        <div class="sub-panel">
          <div class="sub-panel-head">
            <h3>Meta do dia</h3>
          </div>
          <ul class="checklist">
            <li>Resolver 10 questões de revisão</li>
            <li>Estudar 1 assunto prioritário</li>
            <li>Atualizar caderno de resumos</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderTentativas() {
  const tentativas = getTentativas();
  const rows = tentativas.length
    ? tentativas.slice().reverse().map((item) => `
      <tr>
        <td>${safeText(item.disciplina)}</td>
        <td>${safeText(item.assunto)}</td>
        <td>${safeText(item.banca)}</td>
        <td>${safeText(item.concurso)}</td>
        <td><span class="tag ${item.resultado === 'certa' || item.acertou ? 'success' : 'danger'}">${item.resultado === 'certa' || item.acertou ? 'Certa' : 'Errada'}</span></td>
        <td><button class="btn btn-small danger" data-delete-id="${item.id}">Excluir</button></td>
      </tr>
    `).join('')
    : `<tr><td colspan="6" class="empty-cell">Nenhuma tentativa registrada ainda.</td></tr>`;

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
          <thead><tr><th>Disciplina</th><th>Assunto</th><th>Banca</th><th>Concurso</th><th>Resultado</th><th>Ação</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderEditais() {
  const editais = getRecords('editais', []);
  const cards = editais.length
    ? editais.map((item) => `
      <div class="list-card">
        <div>
          <strong>${safeText(item.nome)}</strong>
          <p>${safeText(item.disciplina)} • ${safeText(item.area)}</p>
        </div>
        <span class="pill">${safeText(item.data)}</span>
      </div>
    `).join('')
    : '<div class="empty-cell-box">Nenhum edital cadastrado.</div>';

  return `
    <section class="panel">
      <div class="panel-head"><div><p class="eyebrow">Planejamento</p><h2>Editais</h2></div><button class="btn btn-primary" data-add-edital>Adicionar edital</button></div>
      <div class="list-stack">${cards}</div>
    </section>
  `;
}

function renderCaderno() {
  const resumos = getRecords('resumos', []);
  const cards = resumos.length
    ? resumos.map((item) => `
      <div class="list-card note-card">
        <div>
          <strong>${safeText(item.titulo)}</strong>
          <p>${safeText(item.disciplina)}</p>
        </div>
        <small>${safeText(item.texto)}</small>
      </div>
    `).join('')
    : '<div class="empty-cell-box">Nenhum resumo salvo.</div>';

  return `
    <section class="panel">
      <div class="panel-head"><div><p class="eyebrow">Estudo</p><h2>Caderno de Resumos</h2></div><button class="btn btn-primary" data-add-resumo>Novo resumo</button></div>
      <div class="list-stack">${cards}</div>
    </section>
  `;
}

function renderSimulados() {
  const simulados = getRecords('simulados', []);
  const cards = simulados.length
    ? simulados.map((item) => `
      <div class="list-card">
        <div><strong>${safeText(item.nome)}</strong><p>${safeText(item.disciplina)} • ${item.nota || 0} pontos</p></div>
        <span class="pill ${Number(item.nota || 0) >= 70 ? 'positive' : 'warning'}">${Number(item.nota || 0) >= 70 ? 'Bom' : 'Precisa revisar'}</span>
      </div>
    `).join('')
    : '<div class="empty-cell-box">Nenhum simulado registrado.</div>';

  return `
    <section class="panel">
      <div class="panel-head"><div><p class="eyebrow">Métricas</p><h2>Simulados</h2></div><button class="btn btn-primary" data-add-simulado>Adicionar simulado</button></div>
      <div class="list-stack">${cards}</div>
    </section>
  `;
}

function renderPerfis() {
  const perfis = getRecords('perfis', [{ id: 'perfil-principal', nome: 'Perfil principal' }]);
  const cards = perfis.map((perfil) => `
    <div class="list-card">
      <div><strong>${safeText(perfil.nome)}</strong><p>${perfil.id === 'perfil-principal' ? 'Perfil principal' : 'Perfil adicional'}</p></div>
      <button class="btn btn-small" data-select-perfil="${perfil.id}">Ativar</button>
    </div>
  `).join('');

  return `
    <section class="panel">
      <div class="panel-head"><div><p class="eyebrow">Usuário</p><h2>Perfis</h2></div><button class="btn btn-primary" data-add-perfil>Novo perfil</button></div>
      <div class="list-stack">${cards}</div>
    </section>
  `;
}

function renderConfigPage() {
  return `
    <section class="panel">
      <p class="eyebrow">Ajustes</p>
      <h2>Configurações</h2>
      <div class="config-list">
        <div class="list-card"><div><strong>Tema</strong><p>Modo claro/escuro do app</p></div><button class="btn btn-small" data-toggle-theme>Alternar</button></div>
      </div>
    </section>
  `;
}

function renderStatsPage(type) {
  const tentativas = getTentativas();
  const map = {};

  tentativas.forEach((item) => {
    const key = type === 'disciplinas' ? (safeText(item.disciplina, 'Sem disciplina')) :
      type === 'assuntos' ? (safeText(item.assunto, 'Sem assunto')) :
      type === 'bancas' ? (safeText(item.banca, 'Sem banca')) :
      (safeText(item.concurso, 'Sem concurso'));
    map[key] = (map[key] || 0) + 1;
  });

  const labelMap = {
    disciplinas: 'Disciplinas',
    assuntos: 'Assuntos',
    bancas: 'Bancas',
    concursos: 'Concursos'
  };

  const rows = Object.entries(map).length
    ? Object.entries(map).map(([nome, valor]) => `<div class="stat-row"><span>${nome}</span><strong>${valor}</strong></div>`).join('')
    : '<div class="empty-cell-box">Sem dados para exibir.</div>';

  return `
    <section class="panel">
      <p class="eyebrow">Estatísticas</p>
      <h2>${labelMap[type]}</h2>
      <div class="stat-list">${rows}</div>
    </section>
  `;
}

function renderFallback(title) {
  return `<section class="panel"><p class="eyebrow">Módulo</p><h2>${title}</h2><p>Essa área foi preparada para receber a funcionalidade completa do projeto.</p></section>`;
}

function renderPage() {
  const view = document.getElementById('view');
  const route = normalizeRoute();
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = titleMap[route] || 'Dashboard';

  setActiveNav(route);

  let html = renderDashboard();
  switch (route) {
    case '/dashboard': html = renderDashboard(); break;
    case '/tentativas': html = renderTentativas(); break;
    case '/editais': html = renderEditais(); break;
    case '/caderno': html = renderCaderno(); break;
    case '/simulados': html = renderSimulados(); break;
    case '/perfis': html = renderPerfis(); break;
    case '/configuracoes': html = renderConfigPage(); break;
    case '/estatisticas/disciplinas': html = renderStatsPage('disciplinas'); break;
    case '/estatisticas/assuntos': html = renderStatsPage('assuntos'); break;
    case '/estatisticas/bancas': html = renderStatsPage('bancas'); break;
    case '/estatisticas/concursos': html = renderStatsPage('concursos'); break;
    case '/resolver-ia': html = renderFallback('Resolver com IA'); break;
    case '/mentor': html = renderFallback('Mentor IA'); break;
    case '/revisao': html = renderFallback('Revisão do Dia'); break;
    case '/diagnostico': html = renderFallback('Diagnóstico de Erros'); break;
    case '/ciclo': html = renderFallback('Ciclo de Estudos'); break;
    case '/importar-historico': html = renderFallback('Importar Histórico'); break;
    default: html = renderDashboard();
  }

  view.innerHTML = html;
  bindAfterRender();
}

function setActiveNav(route) {
  document.querySelectorAll('.nav-item[data-route]').forEach((link) => {
    const itemRoute = link.getAttribute('data-route');
    link.classList.toggle('active', route === `/${itemRoute}` || route === itemRoute);
  });
}

function bindAfterRender() {
  document.querySelectorAll('[data-open-form]').forEach((button) => {
    button.addEventListener('click', openAttemptModal);
  });

  document.querySelectorAll('[data-delete-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-delete-id');
      const list = getTentativas().filter((item) => String(item.id) !== String(id));
      setRecords('tentativas', list);
      renderPage();
      showToast('Tentativa removida.');
    });
  });

  document.querySelectorAll('[data-add-edital]').forEach((button) => button.addEventListener('click', () => openGenericModal({
    title: 'Adicionar edital', fields: [
      { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex.: TRT 2025' },
      { name: 'disciplina', label: 'Disciplina', type: 'text', placeholder: 'Ex.: Direito' },
      { name: 'area', label: 'Área', type: 'text', placeholder: 'Ex.: Judiciária' },
      { name: 'data', label: 'Data', type: 'date' }
    ], onSubmit: (formData) => {
      const current = getRecords('editais', []);
      current.push({ id: Date.now(), nome: formData.get('nome') || 'Edital sem nome', disciplina: formData.get('disciplina') || 'Sem disciplina', area: formData.get('area') || 'Sem área', data: formData.get('data') || 'Sem data' });
      setRecords('editais', current);
      renderPage();
      showToast('Edital salvo.');
    }})));

  document.querySelectorAll('[data-add-resumo]').forEach((button) => button.addEventListener('click', () => openGenericModal({
    title: 'Novo resumo', fields: [
      { name: 'titulo', label: 'Título', type: 'text', placeholder: 'Ex.: Teorema de Pitágoras' },
      { name: 'disciplina', label: 'Disciplina', type: 'text', placeholder: 'Ex.: Matemática' },
      { name: 'texto', label: 'Resumo', type: 'textarea', placeholder: 'Escreva o conteúdo do resumo...' }
    ], onSubmit: (formData) => {
      const current = getRecords('resumos', []);
      current.push({ id: Date.now(), titulo: formData.get('titulo') || 'Resumo sem título', disciplina: formData.get('disciplina') || 'Sem disciplina', texto: formData.get('texto') || 'Sem conteúdo' });
      setRecords('resumos', current);
      renderPage();
      showToast('Resumo salvo.');
    }})));

  document.querySelectorAll('[data-add-simulado]').forEach((button) => button.addEventListener('click', () => openGenericModal({
    title: 'Adicionar simulado', fields: [
      { name: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex.: Simulado 1' },
      { name: 'disciplina', label: 'Disciplina', type: 'text', placeholder: 'Ex.: Português' },
      { name: 'nota', label: 'Nota', type: 'number', placeholder: 'Ex.: 78' }
    ], onSubmit: (formData) => {
      const current = getRecords('simulados', []);
      current.push({ id: Date.now(), nome: formData.get('nome') || 'Simulado', disciplina: formData.get('disciplina') || 'Sem disciplina', nota: Number(formData.get('nota') || 0) });
      setRecords('simulados', current);
      renderPage();
      showToast('Simulado salvo.');
    }})));

  document.querySelectorAll('[data-add-perfil]').forEach((button) => button.addEventListener('click', () => openGenericModal({
    title: 'Novo perfil', fields: [
      { name: 'nome', label: 'Nome do perfil', type: 'text', placeholder: 'Ex.: Perfil de Letras' }
    ], onSubmit: (formData) => {
      const current = getRecords('perfis', [{ id: 'perfil-principal', nome: 'Perfil principal' }]);
      const perfil = { id: `perfil-${Date.now()}`, nome: formData.get('nome') || 'Novo perfil' };
      current.push(perfil);
      setRecords('perfis', current);
      renderPage();
      showToast('Perfil adicionado.');
    }})));

  document.querySelectorAll('[data-select-perfil]').forEach((button) => button.addEventListener('click', () => {
    const perfilId = button.getAttribute('data-select-perfil');
    state.perfilId = perfilId;
    localStorage.setItem('configuracoes', JSON.stringify({ perfilAtivo: perfilId }));
    showToast('Perfil ativado.');
  }));

  document.querySelectorAll('[data-toggle-theme]').forEach((button) => button.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('theme-light', state.theme === 'light');
    localStorage.setItem('theme', state.theme);
    showToast('Tema alternado.');
  }));
}

function showToast(message) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  root.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
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
        <div class="modal-header"><h3 id="modal-title">Registrar tentativa</h3><button class="icon-btn" data-close-modal aria-label="Fechar">✕</button></div>
        <form id="attempt-form" class="attempt-form">
          <div class="form-grid">
            <label>Disciplina<input type="text" name="disciplina" placeholder="Ex.: Matemática" required></label>
            <label>Assunto<input type="text" name="assunto" placeholder="Ex.: Geometria" required></label>
            <label>Banca<input type="text" name="banca" placeholder="Ex.: CESPE" required></label>
            <label>Concurso<input type="text" name="concurso" placeholder="Ex.: TRT 2025" required></label>
            <label>Resultado<select name="resultado"><option value="certa">Certa</option><option value="errada">Errada</option></select></label>
          </div>
          <div class="modal-actions"><button type="button" class="btn" data-close-modal>Cancelar</button><button type="submit" class="btn btn-primary">Salvar</button></div>
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

    const list = getTentativas();
    list.push(payload);
    setRecords('tentativas', list);
    modalRoot.innerHTML = '';
    renderPage();
    showToast('Tentativa salva com sucesso.');
  });

  modalRoot.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { modalRoot.innerHTML = ''; }));
}

function openGenericModal({ title, fields, onSubmit }) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const inputs = fields.map((field) => {
    if (field.type === 'textarea') return `<label>${field.label}<textarea name="${field.name}" placeholder="${field.placeholder || ''}" rows="5"></textarea></label>`;
    return `<label>${field.label}<input type="${field.type || 'text'}" name="${field.name}" placeholder="${field.placeholder || ''}"></label>`;
  }).join('');

  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-close-modal>
      <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header"><h3 id="modal-title">${title}</h3><button class="icon-btn" data-close-modal aria-label="Fechar">✕</button></div>
        <form id="generic-form" class="attempt-form">
          <div class="form-grid single-column">${inputs}</div>
          <div class="modal-actions"><button type="button" class="btn" data-close-modal>Cancelar</button><button type="submit" class="btn btn-primary">Salvar</button></div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('generic-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    onSubmit(formData);
    modalRoot.innerHTML = '';
  });

  modalRoot.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => { modalRoot.innerHTML = ''; }));
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

  if (toggle) toggle.addEventListener('click', () => applySidebar(!sidebar.classList.contains('open')));
  if (mobileMenu) mobileMenu.addEventListener('click', () => applySidebar(true));
  if (overlay) overlay.addEventListener('click', () => applySidebar(false));

  document.querySelectorAll('.nav-group-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.getAttribute('data-group');
      const menu = document.querySelector(`[data-submenu="${group}"]`);
      if (menu) menu.classList.toggle('open');
    });
  });

  document.querySelectorAll('.nav-item[data-route]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        applySidebar(false);
      }
    });
  });
}

function setupApp() {
  document.body.classList.toggle('theme-light', state.theme === 'light');
  setupSidebar();
  renderPage();
  const addQuestaoBtn = document.getElementById('add-questao-btn');
  if (addQuestaoBtn) addQuestaoBtn.addEventListener('click', openAttemptModal);
  window.addEventListener('hashchange', renderPage);
}

window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) window.location.hash = '#/dashboard';
  state.route = window.location.hash || '#/dashboard';
  setupApp();
});

window.app = { state, renderPage, openAttemptModal };
