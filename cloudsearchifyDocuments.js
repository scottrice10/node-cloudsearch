// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var uuid = require('node-uuid');

exports.cloudsearchifyDocuments = function(allHealthPlans) {
  var csAllHealthPlans = [];
  for(var i = 0; i < allHealthPlans.length; i++) {
    var healthPlan = allHealthPlans[i];
    for(var key in healthPlan) {
      if(healthPlan.hasOwnProperty(key) && typeof healthPlan[key] === "object") {
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

  return JSON.stringify(csAllHealthPlans, null, 4);
};
