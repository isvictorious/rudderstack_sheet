function logAndReturnValue(obj) {
  if(globals.debug_logger){
    Logger.log('=-----------');
    Logger.log('method name:', obj.methodName || obj.functionName);
    Logger.log('success:', obj.success);
    if (obj.args) {
      Logger.log('arguments',obj.args);
    };
    if (obj.errors && obj.errors.length) {
      Logger.log('errors:', obj.errors);
    };
    Logger.log(obj);
    if (obj.returnValue) {
      Logger.log('returned:', obj.returnValue);
    };
  }
  return obj.returnValue;
}