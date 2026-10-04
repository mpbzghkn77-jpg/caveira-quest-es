window.simulados = {
  listar() {
    return JSON.parse(localStorage.getItem('simulados') || '[]');
  }
};
