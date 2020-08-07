function getSchema() {
  const result = {
    success: false,
    methodName: "getSchema",
    returnValue: {},
    callStack: [],
    errors: [],
    apiFailed: false,
  };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataplaneRange = ss.getRange("dataplane");
  const dataplane = dataplaneRange.getValue();
  
  const eventModelSheet = new SpreadsheetManager(ss, "event-models");
  const apiKeySheet = new SpreadsheetManager(ss, "api_keys");
  const keys = new ApiKeys(apiKeySheet);
  const rudderstack = new RudderstackCaller(keys);
  const aggregator = new SchemaAggregator(dataplane);

  eventModelSheet.forEachRow((row, i) => {
    if (i > 0 && !result.apiFailed) {     
      const eventID = row.col('eventID');
      const getSchemaResult = rudderstack.getEventModelSchema(
        dataplane,
        eventID
      );
      
      if (getSchemaResult.success) {
        const schema = logAndReturnValue(getSchemaResult);
        aggregator.addNewSchema({
          eventType: row.col("eventType"),
          eventIdentifier: row.col("eventIdentifier"),
          eventID: eventID,
          versions: schema,
        });         
      } else {
        result.errors.push("Problem calling API");
        result.apiFailed = true;
      }
    }
  });
  // aggregator bound so this is aggregator
  aggregator.schema.forEach(function(schemaObject){
    const addSchemaToSheetResult = this.addSchemaToSheet(schemaObject);
    result.callStack.push(addSchemaToSheetResult);
  }.bind(aggregator));
  aggregator.deleteExtraSheets();
  eventModelSheet.sheet.copyTo(aggregator.schemaSpreadsheet);
  SpreadsheetApp.flush();
  result.success = true;
  Logger.log(result);
}
