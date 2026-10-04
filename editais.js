window.editais = {
  listar() {
    return JSON.parse(localStorage.getItem('editais') || '[]');
  },
  salvar(dados) {
    const atual = this.listar();
    atual.push(dados);
    localStorage.setItem('editais', JSON.stringify(atual));
  }
};
