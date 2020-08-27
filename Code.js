function getEventModels() {
  setup();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataplaneRange = ss.getRange('dataplane');
  if (!dataplaneRange) {
    notifyError('NO_DATAPLANE');
    return;
  }
  const dataplane = dataplaneRange.getValue();
  const eventModelSheet = new SpreadsheetManager(ss, 'event-models');
  const apiKeySheet = new SpreadsheetManager(ss, 'api_keys');
  const keys = new ApiKeys(apiKeySheet);
  const rudderstack = new RudderstackCaller(keys);

  const eventModels = _getEventModelsFromApi(rudderstack,dataplane);

  const newRows = eventModels.map((event) => [
    event.ID,
    event.EventID,
    event.WriteKey,
    event.EventType,
    event.EventIdentifier,
    event.CreatedAt ? new Date(event.CreatedAt) : '',
  ]);
  eventModelSheet.clearValues();
  eventModelSheet.addNewRows(newRows);
  eventModelSheet.sheet.activate();
}

function _getEventModelsFromApi(rudderstack, dataplane) {
  
  const getEventModelsResult = rudderstack.getEventModels(dataplane);
  const eventModels = logAndReturnValue(getEventModelsResult);
  return eventModels;
}
