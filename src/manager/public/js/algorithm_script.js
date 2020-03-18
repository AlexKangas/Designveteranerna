function randomMatch() {
    console.log("HI");
    let unmatchedPeople = [];
    let myUnMatchTable = document.getElementById("unMatchTable");
    for (let i = 1, row; row = myUnMatchTable.rows[i]; i++) {
        unmatchedPeople.push(row.cells[0]);
    }
    let unmatchedMales = [];
    let unmatchedFemales = [];
    for (let i = 0; i < unmatchedPeople.length; i++) {
        if (unmatchedPeople[i].className === "Male") {
            unmatchedMales.push(unmatchedPeople[i]);
        } else if (unmatchedPeople[i].className === "Female") {
            unmatchedFemales.push(unmatchedPeople[i]);
        }
    }

    // The code works when using these 2 lines
    // randomMatchOnce(unmatchedMales, unmatchedFemales, 1);
    // randomMatchOnce(unmatchedMales, unmatchedFemales, 2);
    // -----------------------------------------

    // Bit not when using these lines
    for (let rowNumber = 1; unmatchedMales.length > 0 && unmatchedFemales.length > 0; rowNumber++) {
        randomMatchOnce(unmatchedMales, unmatchedFemales, rowNumber);
    }
    // -------------------------------
}

// Matches 2 random people from unmatchedMales and unmatchedFemales
function randomMatchOnce(unmatchedMales, unmatchedFemales, rowNumber) {
    console.log("unmatchedMales before (in randomMatchOnce())", unmatchedMales);
    let maleIndex = Math.floor(Math.random() * unmatchedMales.length);
    console.log("maleIndex", maleIndex);
    let femaleIndex = Math.floor(Math.random() * unmatchedFemales.length);
    console.log("femaleIndex", maleIndex);
    copyToRow(unmatchedMales[maleIndex], rowNumber, true);
    copyToRow(unmatchedFemales[femaleIndex], rowNumber, false);
    let myUnMatchTable = document.getElementById("unMatchTable");
    for (let j = 1; j <= 2; j++) {
        for (let i = 1, row; row = myUnMatchTable.rows[i]; i++) {
            if (row.cells[0] === unmatchedMales[maleIndex]) {
                myUnMatchTable.deleteRow(i);
                unmatchedMales.splice(maleIndex, 1); //remove index maleIndex
                break; //goto next iteration of outer loop
            }
            else if (row.cells[0] === unmatchedFemales[femaleIndex]) {
                myUnMatchTable.deleteRow(i);
                unmatchedFemales.splice(femaleIndex, 1); //remove index femaleIndex
                break; //goto next iteration of outer loop
            }
        }
    }
}

// Copies myCell to row rowNumber in matchTable
function copyToRow(myCell, rowNumber, isMale) {
    let cellIndex = -1;
    if (isMale === true) {
        cellIndex = 0;
    }
    else if (isMale === false) {
        cellIndex = 1;
    }
    console.log("myCell = ", myCell.id);
    let matchTableCell = document.getElementById("matchTable").rows[rowNumber].cells[cellIndex];
    // document.getElementById("matchTable").rows[rowNumber].cells[cellIndex] = myCell;
    matchTableCell.className = myCell.className;
    matchTableCell.id = myCell.id;
    matchTableCell.innerHTML = myCell.id;
}
