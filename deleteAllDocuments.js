// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var AWS = require('aws-sdk');

//AWS configuration
AWS.config.loadFromPath('./config.json');
var cloudsearchdomain = new AWS.CloudSearchDomain({
  endpoint: 'http://doc-imorgo-o7j3rjbk2ekyfkupbetbyfjoym.us-west-2.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

exports.deleteAllDocuments = function() {
  var params = {
    query: '(matchall)', /* required */
    queryParser: 'structured',
    return: '_no_fields',
    size: "5000"
  };

  cloudsearchdomain.search(params, function(err, data) {
    if(err) {
      console.log(err, err.stack);
    }
    else {
      exports.deleteDocuments(data.hits.hit);
    }
  });
};

exports.deleteDocuments = function(docs){
  for(var i=0;i<docs.length;i++){
    docs[i]["type"] = "delete";
  }

  var params = {
    contentType: 'application/json',
    documents: JSON.stringify(docs)
  };

  cloudsearchdomain.uploadDocuments(params, function(err, data) {
    if(err) {
      console.log(err, err.stack);
    }
    else {
      console.log("Deleted all documents.", data);
    }
  });
};

exports.deleteAllDocuments();
