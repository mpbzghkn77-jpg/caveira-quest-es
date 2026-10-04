const state = {
  perfilId: 'perfil-principal',
  route: '#/dashboard',
  dados: {
    tentativas: [],
    editais: [],
    ciclos: [],
    resumos: [],
    simulados: [],
    perfis: []
  }
};

function reloadState() {
  state.route = window.location.hash || '#/dashboard';
  renderRoute();
}

function renderRoute() {
  const view = document.getElementById('view');
  const route = state.route.replace('#', '');
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

  const pageTitle = document.getElementById('page-title');
  pageTitle.textContent = titleMap[route] || 'Dashboard';

  const cards = `
    <section class="panel">
      <h2>${titleMap[route] || 'Dashboard'}</h2>
      <p>Estrutura do app copiada e pronta para personalização. Os dados ficam em localStorage e o projeto foi montado com a mesma arquitetura do app de referência.</p>
      <div class="kpis">
        <div class="kpi"><strong>0</strong><span>Questões</span></div>
        <div class="kpi"><strong>0</strong><span>Acertos</span></div>
        <div class="kpi"><strong>0</strong><span>Erros</span></div>
        <div class="kpi"><strong>0%</strong><span>Taxa</span></div>
      </div>
    </section>
  `;

  view.innerHTML = cards;
}

window.addEventListener('hashchange', () => {
  state.route = window.location.hash || '#/dashboard';
  renderRoute();
});

window.addEventListener('DOMContentLoaded', () => {
  if (!window.location.hash) {
    window.location.hash = '#/dashboard';
  }
  reloadState();
});

window.app = { state, reloadState, renderRoute };
