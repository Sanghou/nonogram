const SET_UNKNOWN = 2;
const SET_TRUE = 1;
const SET_FALSE = 0;

function solve(width, height, columnHints, rowHints) {
  let answer = new Array(height);
  for (let i=0; i < height; i++) {
    answer[i] = new Array(width).fill(SET_UNKNOWN)
  }
  for (let rowHint of rowHints) {
    verifyInput(rowHint, width);
  }
  for (let columnHint of columnHints) {
    verifyInput(columnHint, height);
  }

  let count = 50;
  while(count > 0) {
    for (let i=0; i< height;i++) {
      const [value, bool] = specify_row(width, rowHints[i], answer[i]);
      answer[i] = value;
    }

    const columns = transpose(answer);
    for (let i=0; i< width; i++) {
      const [value, bool] = specify_row(height, columnHints[i], columns[i]);
      for (let j = 0; j<height; j++) {
        answer[j][i] = value[j];
      }
    }

    let checkEnd = checkSolution(answer, rowHints, columnHints);
    if (checkEnd) {
      console.log('end');
      console.log(count);
      // console.log(answer);
      break;
    }
    else {
      for (let arr of answer) {
        console.log(...arr);
      }
      count--;
    }
  }

  for (let arr of answer) {
    console.log(...arr);
  }

  return answer.flat();
}

const MATCH = "MATCH";
const NOT_MATCH = "NOT_MATCH";
const UNDECIDED = "UNDECIDED";

function checkSolution(answer, rowHints, columnHints) {
  for (let i = 0; i < answer.length; i++) {
    const goodSolution = checkLine(answer[i], rowHints[i]);
    if (goodSolution === UNDECIDED) {
      return false
    }
    else if (goodSolution === NOT_MATCH) {
      // 값 추측하고 진행하는 부분 추가 시 아래 부분 수정.
      // 시간 있으면 이 부분 congestion 되돌아 가는 코드 추가하기
      throw new Error("wrong congestion");
    }
  }

  let transposedArray = transpose(answer);
  for (let i=0; i < transposedArray.length; i++) {
    const goodSolution = checkLine(transposedArray[i], columnHints[i]);
    if (goodSolution === UNDECIDED) {
      return false
    }
    else if (goodSolution === NOT_MATCH) {
      // 값 추측하고 진행하는 부분 추가 시 아래 부분 수정.
      // 시간 있으면 이 부분 congestion 되돌아 가는 코드 추가하기
      throw new Error("wrong congestion");
    }
  }
  return true
}

function checkLine(line, hint) {

  let consecutive = 0;
  const check = [];
   for (let elem of line) {
    if (elem === SET_UNKNOWN) {
       return UNDECIDED;
    }
    if (elem === SET_TRUE) {
      consecutive += 1;
    }
    if (elem === SET_FALSE) {
      if(consecutive !== 0) {
        check.push(consecutive);
      }
      consecutive = 0
    }
 }

 if (consecutive) {
     check.push(consecutive);
 }

  if(JSON.stringify(check) === JSON.stringify(hint)) {
     return MATCH;
  } else {
     return NOT_MATCH;
  }
}

function transpose(array) {
  let copy = new Array(array[0].length);
  for (let i=0; i < array[0].length; i++) {
    copy[i] = new Array(array.length).fill(SET_UNKNOWN)
  }
  for(let i=0; i < array.length; i++) {
    for (let j=0; j<array[0].length; j++) {
      copy[j][i] = array[i][j];
    }
  }
  return copy;
}

const getPossibleRow = (width, rowHint,currentRow = []) => {
  if (rowHint.length === 0 ) {
    return [new Array(width).fill(SET_FALSE)];
  }

  const possibleList = [];

  const hintLength = rowHint.reduce((acc,cur) => {
    return acc + cur + 1;
  }, -1)

  const possibleFirstElementPosition = width - hintLength + 1;
  // ex) length 7, [2,1,1] => hintLength = 6, possibleFirstPosition => 0 or 1.
  // 7 - 6 + 1 = 2
  // 5, [2,1] => hintLength = 4, [11001], [11010], [01101] startPosition = possibleFirstElementPosition => 0 or 1
  // 5 - 4 + 2 = 3

  for(let startPosition = 0; startPosition < possibleFirstElementPosition; startPosition++) {
    const onePossibleRow = [];
    for (let i=0; i< startPosition; i++) {
      onePossibleRow.push(SET_FALSE);
    }
    for (let i=0; i< rowHint[0]; i++) {
      onePossibleRow.push(SET_TRUE);
    }

    let nowPosition = onePossibleRow.length;
    if (nowPosition < width) {
      onePossibleRow.push(SET_FALSE);
      nowPosition++;
    }

    if (nowPosition === width) {
      possibleList.push(onePossibleRow);
      continue;
    }

    let sub_array = getPossibleRow(width - nowPosition, rowHint.slice(1));
    sub_array.map((subarr) => {
      possibleList.push([...onePossibleRow,...subarr]);
    })
  }

  return possibleList;
}

const new_permutation_with_constraint = (width, rowHint, currentRow) => {
  if (rowHint.length === 0 ) {
    return [new Array(width).fill(SET_FALSE)];
  }

  const possibleList = [];

  const hintLength = rowHint.reduce((acc,cur) => {
    return acc + cur + 1;
  }, -1)

  // ex) length 7, [2,1,1] => hintLength = 6, possibleFirstPosition => 0 or 1.
  // 7 - 6 + 1 = 2
  // 5, [2,1] => hintLength = 4, [11001], [11010], [01101] startPosition = possibleFirstElementPosition => 0 or 1
  // 5 - 4 + 2 = 3
  const possibleFirstElementPosition = width - hintLength + 1;

  for(let startPosition = 0; startPosition < possibleFirstElementPosition; startPosition++) {
    const onePossibleRow = [];
    for (let i=0; i< startPosition; i++) {
      onePossibleRow.push(SET_FALSE);
    }
    for (let i=0; i< rowHint[0]; i++) {
      onePossibleRow.push(SET_TRUE);
    }
    // 계속해서 subArray 완성시키기
    let nowPosition = onePossibleRow.length;
    if (nowPosition < width) {
      onePossibleRow.push(SET_FALSE);
      nowPosition++;
    }

    if (nowPosition === width) {
      possibleList.push(onePossibleRow);
      continue;
    }

    let wrongMatchFlag = false;
    for (let i=0; i<nowPosition; i++) {
      if (currentRow[i] !== SET_UNKNOWN && currentRow[i] !== onePossibleRow[i]) {
        wrongMatchFlag = true;
        break;
      }
    }
    if (wrongMatchFlag) {
      continue;
    }

    let sub_array = new_permutation_with_constraint(width - nowPosition, rowHint.slice(1), currentRow.slice(nowPosition));

    sub_array.map((subarr) => {
      possibleList.push([...onePossibleRow,...subarr]);
    })
  }

  return possibleList;
}

const specify_row = (width, rowHint, currentRow) => {
  if (!currentRow.includes(SET_TRUE) && !currentRow.includes(SET_FALSE)) {
    const hintLength = rowHint.reduce((acc,cur) => {
      return acc + cur + 1;
    }, -1)
    if (hintLength <= width/2) {
      return [currentRow, true];
    }
  }


  let possible_row = new_permutation_with_constraint(width, rowHint, currentRow);
  const new_rows = [];
  for (let row of possible_row) {
    let flag = true;
    for(let i=0; i < row.length; i++) {
      if (currentRow[i] !== SET_UNKNOWN && currentRow[i] !== row[i]) {
        flag = false;
        break;
      }
    }

    if (flag) {
      new_rows.push(row);
    }
  }
  possible_row = null;

  if (new_rows.length === 0) {
    //NO answer
    return [[], false]
  }

  let res = new_rows[0];
  for(let row of new_rows) {
    for (let i=0; i< res.length; i++) {
      if (res[i] !== SET_UNKNOWN && row[i] !== res[i]) {
        res[i] = SET_UNKNOWN
      }
    }
  }
  return [res, true];
}

/*
Verify hints are correct length.
ex) hints = [1,1,1], width = 5 => no error.
ex) hints = [1,1,1], width = 4 => error occur. 
*/
const verifyInput = (hints, length) => {
  try {
    const sum = hints.reduce((acc, cur) => {
      return acc + cur;
    }, 0);

    if (length < sum + hints.length - 1) {
      throw new Error("wrong input. Please check input size");
    }
  } catch(err) {
    console.log(err);
    throw new Error("wrong input. Please check input");
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
  ];

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

const testCase3 = {
  width: 30,
  height: 30,
  columnHints: [[],[7],[6,5],[4,7],[11,7],[15,7],[1,12,7],[5,9,7],[1,1,9,6],[5,8,6]
  ,[1,12,6],[15,2,3],[3,3,3,2],[3,2,1,3,4],[2,2,4,1,1,2,1,1],[2,3,2,1,2,2,1],[2,1,1,2,3,3,2],[2,3,3,2,4],[3,3,2,2,6],[4,1,5,7]
    ,[5,13], [5,3,14],[2,2,1,14],[2,4,12,1], [3,14], [4,3,1,3,3,2],[12,1,1,1,4],[5,3,3,1,1],[4,3,3],[3]
  ],
  rowHints: [[6,3], [1,1,1,1,4], [1,1,1,1,6], [7,10], [3,7,5], [3,4,3], [3,3,3], [8,4,2],[8,2,2,5], [8,5,4]
    ,[8,2,4],[8,1,3,3], [8,2,2,1,1,2], [10,1,3,3,2], [10,2,3,2],[4,2,1,3,6], [2,1,9,1], [1,14], [1,6,1],[2,10],
    [2,7,1],[1,3,9],[1,5,1,2,6,1], [14,1,10],[12,12],[10,2,1,12],[10,2,8,1,1],[12,7,5],[14,9],[]],
}

const testCase4 = {
  width: 50,
  height: 80,
  columnHints: [
    [11,10,57],[10,23,2,27],[9,14,3,22],[8,13,4,1,8,20],[7,7,6,6,1,3,18],[7,5,1,4,8,3,2,16],[10,1,1,4,3,4,4,2,14],[9,1,4,3,1,3,4,2,12], [8,4,3,5,3,13], [8,2,9,2,2,4,11], [8,1,6,1,1,5,11,9],[7,4,10,14,8], [7,1,2,1,7,4,3,6,7], [7,2,3,6,3,4,5,5], [1,1,12,2,4,4,5], [1,1,9,2,2,2,4], [4,2,2,2,1,2,2,3], [1,3,1,5,2,3], [4,3,1,1,3,1,1,1,2,2,3], [4,5,1,3,5,3,1],[3,1,7,1,2,4,2,1],[5,4,1,3,3,2],[3,1,1,1,3,1,3,5,2],[2,2,3,1,3,6,2],[3,2,3,4,12,3],[2,3,6,6,3,3],[3,2,1,2,4,7,4], [3,2,4,5,5,5],[3,3,4,4,1,3,5],[3,3,9,1,1,6], [1,2,10,7], [1,2,2,6,8], [3,2,10,8], [2,2,8,9], [3,1,2,7,10], [5,9,11],[5,1,4,12],[4,1,2,13],[6,14], [6,4,1,15], [5,3,16], [6,1,2,1,1,1,16],[1,7,2,12,18],[1,8,14,19],[1,8,3,2,20],[2,6,2,1,3,3,4,21],[2,9,1,1,1,4,9,23],[3,9,42],[5,8,42],[3,1,6,1,11,27]
  ],
  rowHints: [
    [16,14,4,8],[14,12,9,5],[14,7,1,4,1,6,3], [14,4,1,9,1],[14,2,3,13,2],[17,1,10], [14,11],[4,5,8], [3,3,8], [2,3,7], [1,3,1,2,4],[6,6],[6,5],[5,1,3],[6,2,2],[5,2],[4],[5,1,1],[10,5],[11,10],[9,1,7],[9],[4],[3],[3],[2,3,2,6,1],[2,5,3,8,2],[2,6,2,4,3,2],[2,3,4,3,13,2,1],[2,2,9,5,7],[2,2,5,3,1,9],[2,3,8,12],[2,6,2,1,12],[10,3,14],[4,3,4,2,1,1,3,1],[1,2,2,3,2,3,2,2],[2,2,1,3,2,2,1,2],[2,3,3,1,2],[1,3,2,3],[1,2,4,1,3],[1,1,4,1,4],[1,2,4,7],[1,2,1,2,2,5],[1,4,1,2,5],[1,5,3,1,2,4],[1,9,3,1,1,7],[1,1,6,2,5],[1,2,5],[1,1,2,4], [1,1,2,2],[1,1,2,2],[1,1,2,2,2], [2,1,3,2,3],[2,1,6,2,1,2,1,2,3],[2,1,20,1,2,3],[2,2,22,1,3], [2,1,6,3,7,1,4],[3,1,2,1,5,1,4],[3,1,2,1,1,1,4,1,5],[4,1,2,1,4,6],[4,1,2,1,2,1,7],[5,1,2,1,1,4,8],[5,2,1,4,8],[6,1,2,1,4,10],[6,1,2,2,3,11],[7,2,1,1,1,12],[7,1,2,1,2,2,13],[9,3,1,1,14],[10,2,2,15],[10,3,2,16],[11,2,1,17],[12,7,19],[13,5,20],[14,21],[15,23],[16,24],[19,26],[50],[13,5,29]
  ],
}
//
// solve(
//   testCase1.width,
//   testCase1.height,
//   testCase1.columnHints,
//   testCase1.rowHints
// );
//
// solve(
//   testCase2.width,
//   testCase2.height,
//   testCase2.columnHints,
//   testCase2.rowHints
// )

// console.time('3');
// solve(
//   testCase3.width,
//   testCase3.height,
//   testCase3.columnHints,
//   testCase3.rowHints
// )
// console.timeEnd('3');

solve(
  testCase4.width,
  testCase4.height,
  testCase4.columnHints,
  testCase4.rowHints
)

// console.log(new_permutation_with_constraint(5, [1,1], [SET_UNKNOWN, SET_TRUE, SET_UNKNOWN, SET_UNKNOWN, SET_UNKNOWN]));

// //console.log(getPossibleRow(7, [1,2,1]));
// console.log('check');
// specify_row(7, [1,2,1], [1,2,2,2,2,2,2]);
// specify_row(10, [1,2,1], [1,2,2,2,2,2,2,1,2,2]);
// console.log(checkLine([1,2,2,2,2,2,2,1,2,2],[1,2,1])); // Un
// console.log(checkLine([1,2,2,2,2,2,1,1,2,1],[1,2,1])); //Un
// console.log(checkLine([1,0,0,0,0,0,1,1,0,1],[1,2,1])); //match
// console.log(checkLine([1,0,0,0,0,1,1,1,0,1],[1,2,1])); //unmatch
// console.log(checkLine([1,0,0,0,1,0,1,1,0,1],[1,2,1])); // not
// console.log(checkLine([1,0,0,1,1,0,1,0,0,1],[1,2,1])); //not
// console.log(checkLine([1,0,0,1,1,0,0,0,0,1],[1,2,1])); // match
// console.log(checkLine([1,0,1,1,0,0,1,1,2,1],[1,2,1])); //Un
// transpose([[1,2,3],[4,5,6],[7,8,9]]);
//console.log(getPossibleRow(10, [1,2,1]));

exports.default = solve;
