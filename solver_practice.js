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

  let count = 20;
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
      console.log(answer);
      return answer;
    }
    else {
      count--;
    }
  }
  // console.log(answer);
  return answer;
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

const getPossibleRow = (width, rowHint) => {
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

const specify_row = (width, rowHint, currentRow) => {
  const possible_row = getPossibleRow(width, rowHint);
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


solve(
  testCase1.width,
  testCase1.height,
  testCase1.columnHints,
  testCase1.rowHints
);

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
