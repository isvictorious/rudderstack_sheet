function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Scripts')
      .addItem('Get all event models', 'getEventModels')
      .addItem('Get schema for selected dataplane', 'getSchema')
      .addToUi();
}