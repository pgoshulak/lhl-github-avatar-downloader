var request = require('request');
var GITHUB_TOKEN = require('./secrets').GITHUB_TOKEN

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    if (err) {
      console.log(err)
    } else {
      cb(err, body);
    }
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) {
    console.log(err)
  } else {
    resultObj = JSON.parse(result)
    resultObj.forEach(function(res) {
      console.log(`Avatar url :: ${res.avatar_url}`)
    })
  }
});