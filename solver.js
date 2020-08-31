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

  answer = solve_with_congestion(width,height,columnHints,rowHints, answer);
  return answer
}

const MATCH = "MATCH";
const NOT_MATCH = "NOT_MATCH";
const UNDECIDED = "UNDECIDED";


function solve_with_congestion(width, height, columnHints, rowHints,currentAnswer, congestionWidth = -1, congestionColumn = -1 , value=null) {
  let answer = currentAnswer;
  if (congestionColumn >= 0 && congestionWidth >=0) {
    console.log('congestion!');
    answer[congestionColumn][congestionWidth] = value;
  }

  let checkEnd = false;

  let count = 10;

  while(checkEnd!==MATCH && count > 0) {
    let prev = JSON.stringify(answer);
    for (let i=0; i< height;i++) {
      const [value, bool] = specifyRow(width, rowHints[i], answer[i]);
      answer[i] = value;
    }

    const columns = transpose(answer);

    for (let i=0; i< width; i++) {
      const [value, bool] = specifyRow(height, columnHints[i], columns[i]);
      for (let j = 0; j<height; j++) {
        answer[j][i] = value[j];
      }
    }

    checkEnd = checkSolution(answer, rowHints, columnHints);
    if (checkEnd === NOT_MATCH) {
      return null
    }
    count--;

    if (prev === JSON.stringify(answer)) {
      console.log('need congestion');
      // answer = solve_with_congestion(width, height, columnHints, rowHints,answer,-1,-1 , true) ||
      //   solve_with_congestion(width, height, columnHints, rowHints,answer, -1,-1 , false)
      break;
    }
  }

  for (let arr of answer) {
    console.log(...arr);
  }

  return answer.flat();

}

function checkSolution(answer, rowHints, columnHints) {
  for (let i = 0; i < answer.length; i++) {
    const goodSolution = checkLine(answer[i], rowHints[i]);
    if (goodSolution === UNDECIDED) {
      return UNDECIDED
    }
    else if (goodSolution === NOT_MATCH) {
      // 값 추측하고 진행하는 부분 추가 시 아래 부분 수정.
      // 시간 있으면 이 부분 congestion 되돌아 가는 코드 추가하기
      return NOT_MATCH
    }
  }

  let transposedArray = transpose(answer);
  for (let i=0; i < transposedArray.length; i++) {
    const goodSolution = checkLine(transposedArray[i], columnHints[i]);
    if (goodSolution === UNDECIDED) {
      return UNDECIDED
    }
    else if (goodSolution === NOT_MATCH) {
      // 값 추측하고 진행하는 부분 추가 시 아래 부분 수정.
      // 시간 있으면 이 부분 congestion 되돌아 가는 코드 추가하기
      return NOT_MATCH
    }
  }
  return MATCH
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

const getPossibleRowWithConstraint = (width, rowHint, currentRow) => {
  if (rowHint.length === 0 ) {
    return [new Array(width).fill(SET_FALSE)];
  }

  const possibleList = [];

  const hintLength = rowHint.reduce((acc,cur) => {
    return acc + cur + 1;
  }, -1)

  const possibleFirstElementPosition = width - hintLength + 1;

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

    let sub_array = getPossibleRowWithConstraint(width - nowPosition, rowHint.slice(1), currentRow.slice(nowPosition));

    sub_array.map((subarr) => {
      possibleList.push([...onePossibleRow,...subarr]);
    })
  }

  return possibleList;
}

const specifyRow = (width, rowHint, currentRow) => {
  if (!currentRow.includes(SET_TRUE) && !currentRow.includes(SET_FALSE)) {
    const hintLength = rowHint.reduce((acc,cur) => {
      return acc + cur + 1;
    }, -1)
    if (hintLength <= width/2) {
      return [currentRow, true];
    }
  }
  let possibleRows = getPossibleRowWithConstraint(width, rowHint, currentRow);
  const new_rows = [];
  for (let row of possibleRows) {
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
  possibleRows = null;

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

const testcase1 = {
  width: 8,
  height: 6,
  columnHints: [
    [ 2 ],    [ 1, 1 ],
[ 1, 1 ], [ 1 ],
  [ 3 ],    [ 1 ],
  [ 1 ],    [ 1, 1 ]
],
  rowHints: [ [ 1, 3 ], [ 1, 1, 1, 2 ], [ 1, 1 ], [ 1 ], [ 1 ], [ 1 ] ]
};

console.time('1');
solve(testcase1.width, testcase1.height, testcase1.columnHints, testcase1.rowHints);
console.timeEnd('1');

const testCase5 = {
  width: 30,
  height: 40,
  columnHints: [
    [2],[8],[12],[16],[19],
    [22],[26],[28],[32],[3,23,8],
    [18,7,7],[17,3,6],[16,5],[7,6,1,2],[6,1,6,1,1],
    [5,2,6,2],[6,1,6,1,1],[7,6,1,4],[16,6],[18,3,7],
    [26,8],[3,23,8],[31],[27],[24],
    [21],[18],[14],[10],[3]
  ],
  rowHints: [
    [3,5,3], [13], [13], [11] ,[11],
    [5,5], [5,4], [4,4], [5,5], [5,3,5],
    [5,1,5], [7,5], [17], [18], [19],
    [19], [20], [6,4,7], [5,6], [6,7],
    [8,8], [9,2,2,8], [9,9], [8,3,8], [9,1,8],
    [9,9], [10,8], [9,8], [9,8], [9,9],
    [9,8],[8,8],[9,9], [12,11], [11,12],
    [12,11], [11,10], [9,9], [6,6], [3,3]
  ],
};

const testCase1 = {
  width: 13,
  height: 5,
  columnHints: [[1], [1], [5], [], [1, 1], [], [1, 1, 1], [1, 1, 1], [5], [],
    [3, 1], [1, 1, 1], [1,3]],
  rowHints: [[3, 3, 3], [1, 1, 1, 1], [1, 3, 3], [1, 1, 1, 1], [1, 3, 3]],
};

// console.time('1');
// solve(testCase1.width,
//   testCase1.height,
//   testCase1.columnHints,
//   testCase1.rowHints);
// console.timeEnd('1');

// console.time('5');
// solve(testCase5.width,
//   testCase5.height, testCase5.columnHints, testCase5.rowHints);
// console.timeEnd('5');
exports.default = solve;
