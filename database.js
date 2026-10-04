const DB_NAME = 'trilhaAprovacao';
const DB_VERSION = 1;

const db = {
  getAll(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  },
  setAll(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  add(key, item) {
    const list = this.getAll(key);
    list.push(item);
    this.setAll(key, list);
    return item;
  },
  update(key, id, changes) {
    const list = this.getAll(key).map((item) => (
      String(item.id) === String(id) ? { ...item, ...changes } : item
    ));
    this.setAll(key, list);
    return list;
  },
  remove(key, id) {
    const list = this.getAll(key).filter((item) => String(item.id) !== String(id));
    this.setAll(key, list);
    return list;
  }
};

window.database = db;

function initDatabase() {
  const defaultData = {
    tentativas: [],
    editais: [],
    ciclos: [],
    cicloMaterias: [],
    cicloSessoes: [],
    resumos: [],
    revisoes: [],
    simulados: [],
    perfis: [{ id: 'perfil-principal', nome: 'Perfil principal' }],
    errosQuestoes: [],
    diagnosticosErro: [],
    learningProfile: { id: 'perfil-principal' }
  };

  Object.entries(defaultData).forEach(([store, value]) => {
    if (!localStorage.getItem(store)) {
      localStorage.setItem(store, JSON.stringify(value));
    }
  });
}

window.addEventListener('DOMContentLoaded', initDatabase);
