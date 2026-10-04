window.perfis = {
  listar() {
    return JSON.parse(localStorage.getItem('perfis') || '[{"id":"perfil-principal","nome":"Perfil principal"}]');
  },
  criar(nome) {
    const lista = this.listar();
    const item = { id: 'perfil-' + Date.now(), nome };
    lista.push(item);
    localStorage.setItem('perfis', JSON.stringify(lista));
    return item;
  }
};
