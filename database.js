function seedSampleData() {
  const initial = {
    tentativas: [
      { id: 1, disciplina: 'Matemática', assunto: 'Álgebra', banca: 'CESPE', concurso: 'TRT 2025', resultado: 'certa', acertou: true },
      { id: 2, disciplina: 'Português', assunto: 'Interpretação de texto', banca: 'FGV', concurso: 'TST 2025', resultado: 'errada', acertou: false },
      { id: 3, disciplina: 'Direito', assunto: 'Constituição', banca: 'CESPE', concurso: 'TJ-DF 2025', resultado: 'certa', acertou: true },
      { id: 4, disciplina: 'Matemática', assunto: 'Probabilidade', banca: 'IBFC', concurso: 'Banco do Brasil', resultado: 'errada', acertou: false },
      { id: 5, disciplina: 'Informática', assunto: 'Excel', banca: 'CESGRANRIO', concurso: 'Petrobras', resultado: 'certa', acertou: true }
    ],
    editais: [
      { id: 1, nome: 'TRT 2025', disciplina: 'Direito', area: 'Judiciária', data: '2025-08-10' },
      { id: 2, nome: 'Banco do Brasil', disciplina: 'Matemática', area: 'Financeira', data: '2025-09-15' }
    ],
    resumos: [
      { id: 1, titulo: 'Funções e gráficos', disciplina: 'Matemática', texto: 'Estudar domínio, imagem e comportamento das funções.' },
      { id: 2, titulo: 'Constituição e direitos fundamentais', disciplina: 'Direito', texto: 'Revisar os princípios e direitos previstos na CF/88.' }
    ],
    simulados: [
      { id: 1, nome: 'Simulado 1', disciplina: 'Matemática', nota: 78 },
      { id: 2, nome: 'Simulado 2', disciplina: 'Português', nota: 64 }
    ],
    perfis: [{ id: 'perfil-principal', nome: 'Perfil principal' }],
    configuracoes: { tema: 'dark', perfilAtivo: 'perfil-principal' }
  };

  Object.entries(initial).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

window.addEventListener('DOMContentLoaded', seedSampleData);
