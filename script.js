const gameBoard = (function () {
  const spaces = [];
  for (let i = 0; i < 9; i++) {
    spaces.push("");
  }
  return { spaces };
})();

const Player = function (name, marker) {
  return { name, marker };
};
