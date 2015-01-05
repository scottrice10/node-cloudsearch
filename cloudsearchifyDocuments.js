// This script expects an array of json objects.
// It 1) adds id and type fields to each object, since Cloudsearch expects all JSON objects to have these fields, and
// 2) converts any value fields that are of type "object" to type string, since Cloudsearch cannot index json objects as field values.
var uuid = require('node-uuid');
var root = '/Users/srice/Desktop/';
var documentsFile = root + 'allHealthPlans.json';
var destination = root + 'csAllHealthPlans.json';

try {
  var csAllHealthPlans = [];
  with open(documentsFile) as
  jsonFile:
    allHealthPlans = json.load(jsonFile)

  for(var healthPlan in allHealthPlans) {
    for(var key, value in healthPlan.iteritems()) {
      if(typeof value === "Object") {
        for(var key2, value2 in value.iteritems()) {
          healthPlan[key] = value2;
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

  with open(destination, 'w') as
  outfile:
    json.dump(csAllHealthPlans, outfile)
  print
  "Writing file to file at /Users/srice/Desktop/csAllHealthPlans.json"
} catch(IOError
as(errno, strerror)
)
{
  print
  "I/O error({0}): {1}".format(errno, strerror)
}
