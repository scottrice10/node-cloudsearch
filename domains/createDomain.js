var cloudsearch = require(__dirname + "/../config/endpoints").cloudsearch;

exports.createDomain = function(domainName){
  var params = {
    DomainName: domainName
  };

  cloudsearch.createDomain(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else    {
      console.log(domainName + " was successfully created.");
    }
  });
};

//exports.createDomain();
