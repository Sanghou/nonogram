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
  return answer.flat();
}

const MATCH = "MATCH";
const NOT_MATCH = "NOT_MATCH";
const UNDECIDED = "UNDECIDED";


function solve_with_congestion(width, height, columnHints, rowHints,currentAnswer, congestionWidth = -1, congestionColumn = -1 , value=null) {
  let answer = currentAnswer;
  if (congestionColumn >= 0 && congestionWidth >=0) {
    answer[congestionWidth][congestionColumn] = value;
  }

  let checkEnd = false;

  let count = 10;

  while(checkEnd!==MATCH && count > 0) {
    let prev = JSON.stringify(answer);
    for (let i=0; i< height;i++) {
      const [value, bool] = specifyRow(width, rowHints[i], answer[i]);
      if (value.length === 0) {
        return null;
      }
      answer[i] = value;
    }

    const columns = transpose(answer);

    for (let i=0; i< width; i++) {
      const [value, bool] = specifyRow(height, columnHints[i], columns[i]);
      for (let j = 0; j<height; j++) {
        if (value.length === 0) {
          return null;
        }
        answer[j][i] = value[j];
      }
    }

    checkEnd = checkSolution(answer, rowHints, columnHints);
    if (checkEnd === NOT_MATCH) {
      return null
    }
    count--;

    if (prev === JSON.stringify(answer)) {
      let congestCol = -1;
      let congestWidth = -1;
      let flag = false;
      for (let i = 0; i < height; i++) {
        for (let j=0; j < width; j++) {
          if (answer[i][j] === SET_UNKNOWN) {
            congestionWidth = i;
            congestionColumn = j;
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }

      answer = solve_with_congestion(width, height, columnHints, rowHints,JSON.parse(JSON.stringify(answer)),congestionWidth, congestionColumn , SET_TRUE) ||
        solve_with_congestion(width, height, columnHints, rowHints,JSON.parse(JSON.stringify(answer)), congestionWidth, congestionColumn , SET_FALSE);
      break;
    }
  }
  return answer

}

function checkSolution(answer, rowHints, columnHints) {
  for (let i = 0; i < answer.length; i++) {
    const goodSolution = checkLine(answer[i], rowHints[i]);
    if (goodSolution === UNDECIDED) {
      return UNDECIDED
    }
    else if (goodSolution === NOT_MATCH) {
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
    if (hintLength === -1) {
      return [new Array(width).fill(SET_FALSE), true]
    }
    else if (hintLength <= width/2) {
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
    //NO answer -> wrong congestion
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

exports.default = solve;