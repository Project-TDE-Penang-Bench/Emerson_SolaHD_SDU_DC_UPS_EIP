var endianess = (function () {
  return {
    swap16: function (a) {
      return ((a & 255) << 8) | ((a >> 8) & 255);
    },
    swap32: function (a) {
      return (
        ((a & 255) << 24) |
        ((a & 65280) << 8) |
        ((a >> 8) & 65280) |
        ((a >> 24) & 255)
      );
    },
    swap64: function (a) {
      return (
        ((a & 1.8374686479671624e19) >> 56) |
        ((a & 0xff000000000000) >> 40) |
        ((a & 0xff0000000000) >> 24) |
        ((a & 0xff00000000) >> 8) |
        ((a & 4278190080) << 8) |
        ((a & 16711680) << 24) |
        ((a & 65280) << 40) |
        ((a & 255) << 56)
      );
    },
    swaphex: function (a) {
      for (var c = "", b = a.length; 0 < b; b -= 2) c += a.substring(b - 2, b);
      return c;
    },
  };
})();
