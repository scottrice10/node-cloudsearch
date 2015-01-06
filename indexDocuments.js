// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var csd = require('./cloudsearchifyDocuments.js');
var AWS = require('aws-sdk');
var request = require('request');
var url = "https://data.healthcare.gov/resource/b8in-sz6k.json?$limit=1000";

//AWS configuration
AWS.config.loadFromPath('./config.json');
var cloudsearchdomain = new AWS.CloudSearchDomain({
  endpoint: 'http://doc-imorgo-o7j3rjbk2ekyfkupbetbyfjoym.us-west-2.cloudsearch.amazonaws.com',
  apiVersion: '2013-01-01'
});

exports.indexDocuments = function(data) {
  var params = {
    contentType: 'application/json',
    documents: csd.cloudsearchifyDocuments(data)
  };

  cloudsearchdomain.uploadDocuments(params, function(err, data) {
    if(err) {
      console.log(err, err.stack);
    }
    else {
      return data;
    }
  });
};

var count = 0;
var recurse = function(i){
  var options = {
    "url": url + "&$offset=" + (1000 * i),
    "json": true
  };

  request(options, function(error, message, response){
    count += response.length;
    if(!error){
      var data = exports.indexDocuments(response);
      console.log(count + " documents indexed!", data);
    }

    if(response.length === 1000){
      recurse(i + 1)
    } else {
      return;
    }
  });
};

recurse(1);



