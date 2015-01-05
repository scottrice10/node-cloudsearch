// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var uuid = require('node-uuid');
var fs = require('fs');
var root = '/Users/srice/Desktop/';
var documentsFile = root + 'allHealthPlans.json';
var destination = root + 'csAllHealthPlans.json';

try {
  fs.readFile(documentsFile, function(err, data) {
    var csAllHealthPlans = [];
    if(err) {
      console.log(err);
    } else {
      var allHealthPlans = JSON.parse(data);
      for(var i = 0; i < allHealthPlans.length; i++) {
        var healthPlan = allHealthPlans[i];
        for(var key in healthPlan) {
          if(healthPlan.hasOwnProperty(key) && typeof healthPlan[key] === "Object") {
            for(var key2 in healthPlan[key]) {
              if(healthPlan[key].hasOwnProperty(key2)) {
                healthPlan[key] = healthPlan[key][key2];
              }
            }
          }
        }

        var csHealhPlan = {
          "type": "add",
          "id": uuid.v4()
        };

        csHealhPlan["fields"] = healthPlan;
        csAllHealthPlans.push(csHealhPlan);
      }
    }

    writeFile(csAllHealthPlans);
  });

  var writeFile = function(csAllHealthPlans) {
    fs.writeFile(destination, JSON.stringify(csAllHealthPlans, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + destination);
      }
    });
  }
} catch(err) {
  console.log("Error" + err);
}
