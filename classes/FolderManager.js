class FolderManager {
  constructor(client, formResponse) {
    const adDesignsFolderResult = this._getAdDesignsFolder(client);
    this.adDesignsFolder = logAndReturnValue(adDesignsFolderResult);

    const createCreativeOutputFolderResult = this._createSubFolder(
      this.adDesignsFolder,
      formResponse.newCreativeId + " - " + formResponse.values.creativeName
    );
    this.creativeOutputFolder = logAndReturnValue(createCreativeOutputFolderResult);

    const parentFolder = this.creativeOutputFolder;
    const fileAssetsFolderResult = this._createSubFolder(
      parentFolder,
      "File Assets"
    );
    this.fileAssetsFolder = logAndReturnValue(fileAssetsFolderResult);

    const thumbnailFolderResult = this._createSubFolder(
      parentFolder,
      "Thumbnails"
    );
    this.thumbnailFolder = logAndReturnValue(thumbnailFolderResult);

    const previousVersionsFolderResult = this._createSubFolder(
      parentFolder,
      "Previous Versions"
    );
    this.previousVersionsFolder = logAndReturnValue(
      previousVersionsFolderResult
    );
  }

  createCreativeSpecsDoc(formResponse) {
    const result = {
      success: false,
      methodName: "createCreativeSpecsDoc",
      returnValue: {},
      errors: [],
    };

    try {
      const creativeSpecsDoc = DocumentApp.create(
        formResponse.newCreativeId +
          " - " +
          formResponse.values.creativeName +
          " (Creative Specifications)"
      );
      Logger.log(creativeSpecsDoc);
      this.moveFiles(creativeSpecsDoc.getId, this.creativeOutputFolder);
      result.returnValue = creativeSpecsDoc;
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  _createSubFolder(parentFolder, folderName) {
    const result = {
      success: false,
      methodName: "_createSubFolder",
      returnValue: {},
      errors: [],
    };

    try {
      const subFolder = parentFolder.createFolder(folderName);
      result.returnValue = subFolder;
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }
  _getAdDesignsFolder(client) {
    const result = {
      success: false,
      methodName: "_getAdDesignsFolder",
      returnValue: {},
      errors: [],
      client: client,
    };
    const adDesignsFolderId = client
      ? client.record.adDesignsFolderId
      : globals.folder_ids.ad_designs_folder;
    Logger.log(adDesignsFolderId);
    const adDesignsFolder = DriveApp.getFolderById(adDesignsFolderId);

    if (adDesignsFolder) {
      result.returnValue = adDesignsFolder;
      result.success = true;
      return result;
    }
    return result;
  }

  moveFiles(sourceFileId, targetFolder) {
    var file = DriveApp.getFileById(sourceFileId);
    file.getParents().next().removeFile(file);
    targetFolder.addFile(file);
  }
}
