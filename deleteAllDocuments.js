// This script deletes documents from Cloudsearch.
// **Limit is deleting 10000 documents at a time.
var AWS = require('aws-sdk');
var totalDeletes = 0;

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
    size: "10000"
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
      totalDeletes += data.deletes;
      console.log("Deleted " + totalDeletes +  " documents.");
      if(data.deletes === 10000){
        exports.deleteAllDocuments();
      } else {
        process.exit();
      }
    }
  });
};

exports.deleteAllDocuments();
