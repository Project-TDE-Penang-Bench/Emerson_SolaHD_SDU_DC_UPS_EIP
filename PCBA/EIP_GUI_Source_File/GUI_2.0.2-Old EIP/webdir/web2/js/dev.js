var dev = (function () {
  return {
    jsonURL: function (a) {
      return "string" == typeof JSONHOST
        ? "http://" + JSONHOST + a + "?callback=?"
        : a;
    },
  };
})();
