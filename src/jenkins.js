var ajax = require('ajax');

var colorToStatus = {
  notbuilt: 'notbuilt',
  blue: 'success',
  green: 'success',
  yellow: 'warning',
  red: 'error'
};

function status(options, cb) {
  ajax(
    {
      url: options.url + options.path,
      method: options.method,
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
      console.log('The ajax request failed: ' + error + ' status ' + status);
    }
  );
}

function allJobs(options, cb) {
  options.method = 'GET';
  options.path = '/api/json';
  status(options, function(result) {
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

function start(options, job, cb) {
  options.method = 'POST';
  options.path = '/job/' + job.replace(' ', '%20') + '/build';
  status(options, function(result) {
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

module.exports.all = allJobs;
module.exports.start = start;