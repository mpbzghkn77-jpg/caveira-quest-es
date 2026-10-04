const STORAGE_KEYS = {
  tentativas: 'tentativas',
  editais: 'editais',
  ciclos: 'ciclos',
  resumos: 'resumos',
  revisoes: 'revisoes',
  simulados: 'simulados',
  perfis: 'perfis',
  configs: 'configuracoes',
  erroQuestoes: 'errosQuestoes'
};

function storageRead(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function storageWrite(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const db = {
  getAll(key) {
    return storageRead(key, []);
  },
  setAll(key, value) {
    storageWrite(key, value);
  },
  add(key, item) {
    const list = this.getAll(key);
    const next = [...list, item];
    this.setAll(key, next);
    return next;
  },
  update(key, id, patch) {
    const list = this.getAll(key).map((item) => {
      if (String(item.id) === String(id)) {
        return { ...item, ...patch };
      }
      return item;
    });
    this.setAll(key, list);
    return list;
  },
  remove(key, id) {
    const list = this.getAll(key).filter((item) => String(item.id) !== String(id));
    this.setAll(key, list);
    return list;
  },
  upsert(key, value) {
    const list = this.getAll(key);
    const existingIndex = list.findIndex((item) => String(item.id) === String(value.id));
    if (existingIndex >= 0) {
      list[existingIndex] = value;
    } else {
      list.push(value);
    }
    this.setAll(key, list);
    return list;
  }
};

window.db = db;

function seedAppData() {
  const defaults = {
    [STORAGE_KEYS.tentativas]: [],
    [STORAGE_KEYS.editais]: [],
    [STORAGE_KEYS.ciclos]: [],
    [STORAGE_KEYS.resumos]: [],
    [STORAGE_KEYS.revisoes]: [],
    [STORAGE_KEYS.simulados]: [],
    [STORAGE_KEYS.perfis]: [{ id: 'perfil-principal', nome: 'Perfil principal' }],
    [STORAGE_KEYS.configs]: {
      tema: 'dark',
      perfilAtivo: 'perfil-principal'
    },
    [STORAGE_KEYS.erroQuestoes]: []
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      if (Array.isArray(value)) {
        storageWrite(key, value);
      } else {
        storageWrite(key, value);
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', seedAppData);
