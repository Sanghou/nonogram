
//get All permutation. But too slow. => be substitude by 'new_permutation_with_constraint'
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