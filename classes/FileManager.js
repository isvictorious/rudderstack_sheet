class FileManager {
  constructor(name) {
    this.destinationFolder = DriveApp.getFolderById(globals.folder_ids.dataplane_schema);
    this.templateSheet = SpreadsheetApp.openById(globals.sheets.template.id);
  }

  createNewSpreadsheet(name){
    const file = this.templateSheet.copy(name);
    this._moveFiles(file.getId());
    return file;
  }

  _moveFiles(sourceFileId) {
    var file = DriveApp.getFileById(sourceFileId);
    file.getParents().next().removeFile(file);
    this.destinationFolder.addFile(file);
  }
}

