const SET_UNKNOWN = 2;
const SET_TRUE = 1;
const SET_FALSE = 0;

function solve(width, height, columnHints, rowHints) {
  const answer = new Array(height).fill(new Array(width).fill(SET_UNKNOWN));
  console.log(answer);

  return answer;
}

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
// prettier-ignore
const testCase2 = {
  width: 8,
  height: 6,
  columnHints: [[4], [2], [2, 2], [6], [3, 2], [1, 2], [2], [1, 2]],
  rowHints: [[3, 1], [1, 4], [1, 2, 1], [1, 1, 2], [7], [5]],
};
// prettier-ignore
const answer2 = [
  0, 0, 1, 1, 1, 0, 0, 1,
  1, 0, 1, 1, 1, 1, 0, 0,
  1, 0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0,
  0, 1, 1, 1, 1, 1, 0, 0
 ]

solve(
  testCase1.width,
  testCase1.height,
  testCase1.columnHints,
  testCase1.rowHints
);

exports.default = solve;
