function setup(){
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const destinationFolder = ss.getRange('dest_folder_id').getValue();
  const templateId = ss.getRange('template_id').getValue();

  if (!destinationFolder){
    ui.alert('Please add a folder id to the control panel.');
  }
  if (!templateId){
    ui.alert('Please add a template id to the control panel.');
  }

  globals.sheets.template.id = templateId;
  globals.folder_ids.dataplane_schema = destinationFolder;
}