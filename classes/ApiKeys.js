class ApiKeys {
  constructor(ssm){

    this.ssm = ssm;
    const credentialsResult = this.getCredentialsFromSheet();
    this.credentials = logAndReturnValue(credentialsResult);
  }

  getCredentialsFromSheet(){
    const result = {
      success: false,
      methodName: 'getCredentialsFromSheet',
      returnValue:{},
      errors: [],
    };
    
    const { ssm } = this;
    ssm.forEachRow((row,i) => {
      try {
        if (i > 0){
          const dataplane = row.col('dataplane');
          const key = row.col('api_key');
          result.returnValue[dataplane] = key;
        }
      } catch (err) {
        result.errors.push(err);
      }
      
    });

    result.success = true;
    return result
  }
}