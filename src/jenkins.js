var ajax = require('ajax');

var colorToStatus = {
  notbuilt: 'notbuilt',
  blue: 'success',
  green: 'success',
  yellow: 'warning',
  red: 'error'
};

function status(options, cb) {
  try {
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
        cb(null, data);
      },
      function(error, status, request) {
        cb(error, null);
      }
    );
  } catch(e) {
    cb(e, null);
  }
}

function allJobs(options, cb) {
  options.method = 'GET';
  options.path = '/api/json';
  status(options, function(err, result) {
    if (err) {
      cb(err, null);
    } else {
      var jobs = [];
      result.jobs.forEach(function(job) {
        jobs.push({
          name: job.name,
          status: colorToStatus[job.color]
        });
      });
      cb(null, jobs); 
    }
  });
}

function start(options, job, cb) {
  options.method = 'POST';
  options.path = '/job/' + job.replace(' ', '%20') + '/build';
  status(options, function(err, result) {
    if (err) {
      cb(err, null);
    } else {
      cb(null, 'success'); 
    }
  });
}

module.exports.all = allJobs;
module.exports.start = start;