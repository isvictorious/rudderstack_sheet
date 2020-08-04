// function setApiKey() {
//   const result = {
//     success: false,
//     functionName: 'setApiKey',
//   };
//   const scriptProps = PropertiesService.getScriptProperties();
//   const props = scriptProps.getProperties();
//   const ui = SpreadsheetApp.getUi();
//   try {
//     const apiKey = ui.prompt("Enter your Rudderstack username");
//     const apiSecret = ui.prompt("Enter your Rudderstack password");
    
//     const credentialsJson = {
//       USERNAME: apiKey.getResponseText(),
//       PASSWORD: apiSecret.getResponseText(),
//     };
//     const credentialsString = JSON.stringify(credentialsJson);
//     scriptProps.setProperties();
//     result.success = true;
//     result.props = scriptProps.getProperties();
//     ui.alert('API details set successfully');
//   } catch(err) {
//     result.error = err;
//   }
//   return result;
// }
