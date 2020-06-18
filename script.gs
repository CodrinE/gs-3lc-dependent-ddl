let mainWsName = "pieseauto";
let optionsWsName = "pieseauto-categorii";
let firstLevelColumn = 1;
let secondLevelColumn = 2;
let thirdLevelColumn = 3;

let ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mainWsName);
let wsOptions = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(optionsWsName);
let options = wsOptions.getRange(2, 1, wsOptions.getLastRow()-1, 3).getValues();


function onOpen(){
mainWsName = "pieseauto";
optionsWsName = "pieseauto-categorii";
}

function onEdit(e) {
  let activeCell = e.range;
  let val = activeCell.getValue();
  let r = activeCell.getRow();
  let c = activeCell.getColumn();
  let wsName = activeCell.getSheet().getName();
  if(wsName === mainWsName && c === firstLevelColumn && r > 1){
    applyFirstLevelValidation(val, r);
  } 
  else if(wsName === mainWsName && c === secondLevelColumn && r > 1){
    applySecondLevelValidation(val, r);
  }
  
}

function applyFirstLevelValidation(val, r){
  ws.getRange(r, secondLevelColumn).clearContent();
  ws.getRange(r, thirdLevelColumn).clearContent();
  if(val === ""){
    ws.getRange(r, secondLevelColumn).clearDataValidations();
    ws.getRange(r, thirdLevelColumn).clearDataValidations();
  } else{
    let filteredOptions = options.filter(function(o){return o[0] === val});
    let listToApply = filteredOptions.map(function(o){return o[1]});
    console.log(listToApply);
    let cell = ws.getRange(r, secondLevelColumn);
    applyValidationToCell(listToApply, cell);
  }
}

function applySecondLevelValidation(val, r){
  ws.getRange(r, thirdLevelColumn).clearContent();
  if(val === ""){
    ws.getRange(r, thirdLevelColumn).clearDataValidations();
  } else{
    let firstLevelColValue = ws.getRange(r, firstLevelColumn).getValue();
    let filteredOptions = options.filter(function(o){return o[0] === firstLevelColValue && o[1] === val});
    let listToApply = filteredOptions.map(function(o){return o[2]});
    let cell = ws.getRange(r, thirdLevelColumn);
    applyValidationToCell(listToApply, cell);
  }
}


function applyValidationToCell(list, cell){
  var rule = SpreadsheetApp
  .newDataValidation()
  .requireValueInList(list)
  .setAllowInvalid(false)
  .build();
  
  cell.setDataValidation(rule);
}