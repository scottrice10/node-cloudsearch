var cloudsearch = require(__dirname + "/../config/endpoints").cloudsearch;
var describeIndexFields = require(__dirname + "/describeIndexFields");

exports.defineIndexField = function(params){
  cloudsearch.defineIndexField(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
};

describeIndexFields.describeIndexFields().then(function(data){
  var indexFields = data.IndexFields;
  indexFields.forEach(function(obj){
    var params = {
      DomainName: "copy",
      IndexFieldName: {
        IndexFieldType: obj.Options.IndexFieldType,
        IndexFieldName: obj.Options.IndexFieldName
      }
    };

    exports.defineIndexField(params);
  });
}).catch(function(err){
  console.log(err);
});
