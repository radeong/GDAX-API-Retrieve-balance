function getBalance() {

  var data = SpreadsheetApp.getActiveSpreadsheet();
  var key = 'API key';
  var secret = 'API secret';
  var passphrase = 'API passphrase';
  var baseUrl = 'https://api.gdax.com';
  var nonce = Math.floor(new Date().getTime()/1000).toString();
 
  var requestPath = "/accounts";
  var method = 'GET';
  var body = '';
  
  var base64secret = Utilities.base64Decode(secret);
  
  var signaturePlaintext = nonce + method + requestPath + body;
  var signatureByteHash = Utilities.computeHmacSha256Signature(signaturePlaintext, base64secret); 
  var signatureHexHash = signatureByteHash.reduce(function(str,chr){ 
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return str + (chr.length==1?'0':'') + chr;
},'');
  
  var requestUrl = baseUrl + requestPath;
  var params = {
    'method': method,
    'headers': {
      'CB-ACCESS-KEY': key, 
      'CB-ACCESS-SIGN': signatureHexHash, 
      'CB-ACCESS-TIMESTAMP': nonce, 
      'CB-ACCESS-PASSPHRASE': passphrase 
    }
  };
  
  var response = UrlFetchApp.fetch(requestUrl, params);
 
  var json = JSON.parse(response.getContentText());
  
  return parseFloat(json.data.amount);
  
}
