function notifyError(type) {
  const ui = SpreadsheetApp.getUi();
  switch(type){
    case 'NO_DATAPLANE':
      ui.alert('No dataplane was selected. Please check the dropdown on the dataplane sheet.');
      return;
    case 'API_UNAUTHORIZED':
      ui.alert('The call was not authorized by the api. Consider running the set API credentials script to reset your credentials.');
      return;

    default:
      ui.alert("An unexpected error occurred and the script didn't finish executing");
      return
  }
}