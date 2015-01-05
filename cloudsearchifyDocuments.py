#!/usr/bin/env python

# script to set up apache development mode on Mac OSX
# all apache files need writeable permissions for this script to run
import json, uuid
documentsFile = '/Users/srice/Desktop/allHealthPlans.json'
destination = '/Users/srice/Desktop/csAllHealthPlans.json'

try:      
  csAllHealthPlans = []
  # with open('/usr/local/bin/projectBranches.json') as jsonFile:    
  with open(documentsFile) as jsonFile:    
     allHealthPlans = json.load(jsonFile) 

     for healthPlan in allHealthPlans:
       for key,value in healthPlan.iteritems():
         if type(value) is dict:
           for key2,value2 in value.iteritems():
             healthPlan[key] = value2

       csHealhPlan = {
         "type": "add",
         "id": str(uuid.uuid4())
       }

       csHealhPlan["fields"] = healthPlan

       csAllHealthPlans.append(csHealhPlan);

  with open(destination, 'w') as outfile:
    json.dump(csAllHealthPlans, outfile)
    print "Writing file to file at /Users/srice/Desktop/csAllHealthPlans.json"

except IOError as (errno,strerror):
    print "I/O error({0}): {1}".format(errno, strerror)
