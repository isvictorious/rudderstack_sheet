# rudderstack_sheet

This sheet contains API details for each dataplane and contains the scripts to pull eventmodels and eventmodel schema from the Rudderstack API.

Add all dataplane names and API keys to the api_keys sheet. In order to select a specific API to query Rudderstack, use the dropdown menu on the Admin sheet to select an option.

Event models

To pull eventmodels from Rudderstack, run the function Scripts -> Get all event models on the toolbar at the top of the screen. This will send a query to Rudderstack for the selected dataplane on the Admin sheet and display the results in the event-models sheet.

Event model schema

To pull event model schema for the data models in the event-models sheet, select the Scripts -> Get schema for selected dataplane on the toolbar. This will loop through all of the event-models on the sheet and call Rudderstack for the particular schema for each event.

The results of these API calls are displayed in a new spreadsheet, with each eventmodel being displayed on a separate sheet. As many eventmodels contain various versions, these will be displayed next to each other, with each version occupying 2 columns.

As this new sheet contains its own scripts, it is copied from a template before being populated with the schema data. This template is the schemaSheet in this repo.

If you would like to change the ids of template file or the location to which the copied sheet is saved to, modify the json file in `globals.js` in this project. To access the script from within the spreadsheet, navigate to Tools -> Script Editor to open the Google Apps Script editor. From here, you can open the `globals.gs` file on the left hand side of the screen. Replace the ids with the ids for your template and destination folder.