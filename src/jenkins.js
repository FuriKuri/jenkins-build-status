var ajax = require('ajax');

var colorToStatus = {
  notbuilt: 'notbuilt',
  blue: 'success',
  green: 'success',
  yellow: 'warning',
  red: 'error'
};

function status(options, path, cb) {
  ajax(
    {
      url: options.url + path,
      type: 'json',
      headers: {
        Authorization: 'Basic ' + options.token,
      }
    },
    function(data, status, request) {
      console.log('Got request ' + status);
      cb(data);
    },
    function(error, status, request) {
      console.log('The ajax request failed: ' + error);
    }
  );
}

function allJobs(options, cb) {
  status(options, '/api/json', function(result) {
    var jobs = [];
    result.jobs.forEach(function(job) {
      jobs.push({
        name: job.name,
        status: colorToStatus[job.color]
      });
    });
    cb(jobs);
  });
}

module.exports = allJobs;