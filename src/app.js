var UI = require('ui');
var jenkins = require('jenkins');
var options = {};

var fruitMenu = new UI.Menu({
  sections: [{
    title: 'Jobs',
    items: []
  }]
});

function refresh() {
  console.log("Refresh");
  jenkins.all({
    url: options.url,
    token: options.auth
  }, function(jobs) {
    fruitMenu.items(0, []);
    for ( var x = 0; x < jobs.length; x++ ) {
      fruitMenu.item(0, x, {
        title: jobs[x].name,
        subtitle: jobs[x].status});
    }
    fruitMenu.show();
  });
}


fruitMenu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
  
  jenkins.start({
    url: options.url,
    token: options.auth
  }, e.item.title, function(data) {
    console.log('Job started ' + data);
  });
});

console.log("Load");
load();

function load() {
  console.log("ready called!");
  options.url = localStorage.getItem('url');
  options.auth = localStorage.getItem('auth');
  console.log("Load config");
  if (options.url && options.auth) {
    console.log("URL is set " + options.url);
    console.log("Auth is set " + options.auth);
    refresh();
  } else {
    console.log("Please set config");
    var detailCard = new UI.Card({
      title: 'Setup Jenkins',
      body: 'Please set URL, user and token in configuration.'
    });
    detailCard.show();
  }
}

Pebble.addEventListener("ready", function() {
  console.log("Ready");
  load();
});

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('http://46.101.144.60:9999/config');
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    options = JSON.parse(decodeURIComponent(e.response));
    console.log("Options = " + JSON.stringify(options));
    localStorage.setItem('url', options.url);
    localStorage.setItem('auth', options.auth);
    console.log("Config stored");
    refresh();
  } else {
    console.log("Cancelled");
  }
});