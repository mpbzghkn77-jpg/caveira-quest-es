window.ttsModulo = {
  falar(texto) {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(texto);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
    }
  }
};
