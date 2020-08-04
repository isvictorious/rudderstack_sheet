class RudderstackCaller {
  constructor(apiKeys) {

    this.apiCredentials = apiKeys.credentials;

    this.baseUrl = (dataplane) =>
      `https://${dataplane}-dataplane.rudderstack.com/protocols`;

  }

  getEventModelSchema(dataplane, eventModelId) {
    const result = {
      success: false,
      methodName: "getEventModelSchema",
      returnValue: [],
      errors: [],
    };

    try {
      const { baseUrl } = this;
      const url = baseUrl(dataplane) + `/event-versions?eventID=${eventModelId}`;
      const key = this.apiCredentials[dataplane];
      if (!key) {
        result.errors.push("no api key for", dataplane);
        return result;
      }
      const generateAuthResult = this._generateAuth(dataplane, key);
      const auth = logAndReturnValue(generateAuthResult);
      const options = {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      };

      const callRudderstackResult = this._callRudderstack(url, options);
      result.returnValue = logAndReturnValue(callRudderstackResult);
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  getEventModels(dataplane) {
    const result = {
      success: false,
      methodName: "getEventModels",
      returnValue: [],
      errors: [],
      args: arguments,
      this: this,
    };

    try {
      const { baseUrl } = this;
      const url = baseUrl(dataplane) + "/event-models";
      const key = this.apiCredentials[dataplane];
      if (!key) {
        result.errors.push("no api key for", dataplane);
        return result;
      }
      const generateAuthResult = this._generateAuth(dataplane, key);
      const auth = logAndReturnValue(generateAuthResult);
      const options = {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      };

      const callRudderstackResult = this._callRudderstack(url, options);
      result.returnValue = logAndReturnValue(callRudderstackResult);
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  _callRudderstack(url, options) {
    const result = {
      success: false,
      methodName: "_callRudderstack",
      args: [url, options],
      returnValue: {},
    };
    options["muteHttpExceptions"] = true;

    try {
      const response = UrlFetchApp.fetch(url, options);
      result.response = response;
      const json = JSON.parse(response);
      result.returnValue = json;
      result.success = true;
      return result;
    } catch (err) {
      notifyError("API_UNAUTHORIZED");
      result.error = err;
      return result;
    }
  }

  _generateAuth(user, password) {
    const result = {
      success: false,
      methodName: "_generateAuth",
      returnValue: "",
      errors: [],
    };

    try {
      result.returnValue =
        "Basic " + Utilities.base64Encode(`${user}:${password}`);
      result.success = true;
    } catch (err) {
      result.errors.push(err);
    } finally {
      return result;
    }
  }

  _getProperties() {
    const result = {
      success: false,
      methodName: "_getProperties",
      returnValue: {},
      errors: [],
    };
    const scriptProperties = PropertiesService.getScriptProperties();
    const props = scriptProperties.getProperties();
    if (!props.CREDENTIALS) {
      const setApiKeyResult = setApiKey();
      debugLogger(setApiKeyResult);
    }
    result.success = true;
    return result;
  }
}
