window.caderno = {
  listar() {
    return JSON.parse(localStorage.getItem('resumos') || '[]');
  },
  salvar(item) {
    const lista = this.listar();
    lista.push(item);
    localStorage.setItem('resumos', JSON.stringify(lista));
  }
};
