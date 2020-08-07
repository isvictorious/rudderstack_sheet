class SchemaAggregator {
  constructor(dataplane) {
    const fileManager = new FileManager();
    this.schema = [];
    this.schemaSpreadsheet = fileManager.createNewSpreadsheet(dataplane);
    this.aggregatedSheet = fileManager.createNewSpreadsheet(
      `${dataplane}-aggregated`
    );
  }

  addNewSchema({ eventType, eventIdentifier, eventID, versions }) {
    const sheetName = eventIdentifier !== "" ? eventIdentifier : eventID;
    const schema = new _Schema({
      eventType,
      eventIdentifier,
      eventID,
      versions,
      sheet: this.schemaSpreadsheet.insertSheet(sheetName),
    });
    this.schema.push(schema);
  }

  addSchemaToSheet(schemaObject) {
    const result = {
      success: false,
      methodName: "_addSchemaToSheet",
      errors: [],
      callStack: [],
    };

    const spreadsheet = this.schemaSpreadsheet;
    try {
      // Schema object is bound so 'this' is schemaObject
      schemaObject.versions.forEach(
        function (version) {
          const formattingResult = this.formatDataForSheet(version);
          result.callStack.push(formattingResult);
          const formattedData = formattingResult.returnValue;
          this.spreadsheetData.push(formattedData);
        }.bind(schemaObject)
      );
      const addToSheetResult = schemaObject.addSpreadsheetDataToSheet();
      result.callStack.push(addToSheetResult);

      result.success = true;
    } catch (err) {
      Logger.log(err);
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  deleteExtraSheets(){
    const { schemaSpreadsheet, aggregatedSheet } = this;
    
    if (aggregatedSheet){
      const aggSheet1 = aggregatedSheet.getSheetByName('Sheet1');
      if (aggSheet1) {
        aggregatedSheet.deleteSheet(aggSheet1);
      }
    }
    if (schemaSpreadsheet){
      const schemaSheet1 = aggregatedSheet.getSheetByName('Sheet1');
      if (schemaSheet1) {
        aggregatedSheet.deleteSheet(schemaSheet1);
      }
    }
  }
}

class _Schema {
  constructor({
    eventType,
    eventIdentifier,
    eventID,
    versions,
    sheet,
  }) {
    this.eventType = eventType;
    this.eventIdentifier = eventIdentifier;
    this.eventID = eventID;
    this.versions = versions;
    this.spreadsheetData = [];
    this.sheet = sheet;
    this.aggregatedVersions = {};
  }

  addSpreadsheetDataToSheet() {
    const result = {
      success: false,
      methodName: "addSpreadsheetDataToSheet",
      errors: [],
    };
    try {
      const { sheet, spreadsheetData } = this;
      let col = 1;
      spreadsheetData.forEach((version) => {
        sheet
          .getRange(1, col, version.length, version[0].length)
          .setValues(version);
        col += 2;
      });
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  formatDataForSheet(version) {
    const result = {
      success: false,
      methodName: "formatDataForSheet",
      returnValue: [[]],
      errors: [],
    };
    try {
      const firstSeen = version.FirstSeen ? new Date(version.FirstSeen) : null;
      const data = [
        ["EventID", this.eventID],
        ["FirstSeen", firstSeen],
        ["ID", version.ID],
        ["LastSeen", version.LastSeen],
        ["Metadata", version.Metadata],
        ["versionID", version.versionID],
      ];
      const schema = version.Schema || {};

      Object.entries(schema).forEach(([key, value]) => {
        data.push([key, value]);
      });
      result.returnValue = data;
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }
}
