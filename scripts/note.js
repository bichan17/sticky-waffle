app.note = (function() {

  function Note(fq, key, display) {
    this.sounding = false;
    this.fq = fq;
    this.key = key;
    this.keyDisplay = display;
  }
  return {
    Note : Note
  };
})();