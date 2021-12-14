const getReturnAmount = function (amount, stake) {
  return amount * stake;
};

const totalAmtToBePaid = function (amount) {
  return amount;
};

const randomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

module.exports = { getReturnAmount, totalAmtToBePaid, randomNumber };
