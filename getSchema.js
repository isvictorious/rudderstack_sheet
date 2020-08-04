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
  const fileManager = new FileManager();
  const eventModelSheet = new SpreadsheetManager(ss, "event-models");
  const apiKeySheet = new SpreadsheetManager(ss, "api_keys");
  const keys = new ApiKeys(apiKeySheet);
  const rudderstack = new RudderstackCaller(keys);

  const schemaSpreadsheet = fileManager.createNewSpreadsheet(dataplane);

  eventModelSheet.forEachRow((row, i) => {
    if (i > 0 && !result.apiFailed) {
      const eventType = row.col("eventType");
      const eventIdentifier = row.col("eventIdentifier");
      const eventID = row.col("eventID");

      const getSchemaResult = rudderstack.getEventModelSchema(
        dataplane,
        eventID
      );
      if (getSchemaResult.success) {
        const schema = logAndReturnValue(getSchemaResult);
        schema.eventType = eventType;
        schema.eventIdentifier = eventIdentifier;
        schema.eventID = eventID;
        const addSchemaToSheetResult = _addSchemaToSheet(
          schemaSpreadsheet,
          schema,
          eventIdentifier,
          i - 1
        );
        result.callStack.push(i, addSchemaToSheetResult);
      } else {
        result.errors.push("Problem calling API");
        result.apiFailed = true;
      }
    }
  });
  SpreadsheetApp.flush();
  result.success = true;
  Logger.log(result);
}

function _addSchemaToSheet(spreadsheet, jsons = [], name, index) {
  const result = {
    success: false,
    methodName: "_addSchemaToSheet",
    name: name,
    errors: [],
  };
  
  try {
    const pasteContent = [];
    const sheet = spreadsheet.insertSheet(name, index);
    jsons.forEach((json) => {      
      const firstSeen = json.FirstSeen ? new Date(json.FirstSeen) : null;
      const data = [
        ["EventID", json.eventID],
        ["FirstSeen", firstSeen],
        ["ID", json.ID],
        ["LastSeen", json.LastSeen],
        ["Metadata", json.Metadata],
        ["versionID", json.versionID],
      ];
      const schema = json.Schema || {};
      Object.entries(schema).forEach(([key, value]) => data.push([key, value]));
      Logger.log(data);
      pasteContent.push(data);
    });
    let col = 1;
    pasteContent.forEach(version => {
      sheet.getRange(1, col, version.length, version[0].length).setValues(version);
      col += 2;
    })
    
    result.success = true;
    const sheet1 = spreadsheet.getSheetByName("Sheet1");
    spreadsheet.deleteSheet(sheet1);
  } catch (err) {
    Logger.log(err);
    result.errors.push(err);
  } finally {
    return result;
  }
}

