const SET_UNKNOWN = 2;
const SET_TRUE = 1;
const SET_FALSE = 0;

function solve(width, height, columnHints, rowHints) {
  const answer = new Array(height).fill(new Array(width).fill(SET_UNKNOWN));
  for (rowHint of rowHints) {
    verifyInput(rowHint, width);
  }
  for (columnHint of columnHints) {
    verifyInput(columnHints, height);
  }

  return answer;
}

/*
Verify hints are correct length.
ex) hints = [1,1,1], width = 5 => no error.
ex) hints = [1,1,1], width = 4 => error occur. 
*/
const verifyInput = (hints, length) => {
  const sum = hints.reduce((acc, cur) => {
    return acc + cur;
  }, 0);

  if (length < sum + hints.length - 1) {
    throw new Error("wrong input. Please check input size");
  }
};

// import { answer1, answer2, testCase1, testCase2 } from "./testcase";
// prettier-ignore
const testCase1 = {
  width: 13,
  height: 5,
  columnHints: [[1], [1], [5], [], [1, 1], [], [1, 1, 1], [1, 1, 1], [5], [],
[3, 1], [1, 1, 1], [1,3]],
  rowHints: [[3, 3, 3], [1, 1, 1, 1], [1, 3, 3], [1, 1, 1, 1], [1, 3, 3]],
};
// prettier-ignore
const answer1 = [
  1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
   0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0,
   0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
   0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
   0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1
  ]

solve(
  testCase1.width,
  testCase1.height,
  testCase1.columnHints,
  testCase1.rowHints
);

exports.default = solve;
