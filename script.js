"use strict";

const playerFactory = function (sign) {
  let object = Object.create(playerFactory.proto);
  this.sign = sign;
  this.score = 0;
  return object;
};

playerFactory.proto = {
  getScore: function () {
    return score;
  },
  setScore: function (score) {
    this.score = score;
  },
};
