window.revisao = {
  listar() {
    return JSON.parse(localStorage.getItem('revisoes') || '[]');
  }
};
