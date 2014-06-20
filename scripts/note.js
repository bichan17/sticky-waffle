app.note = (function() {

  function Note(fq, key) {
    this.sounding = false;
    this.fq = fq;
    this.key = key;
  }
  return {
    Note : Note
  };
})();