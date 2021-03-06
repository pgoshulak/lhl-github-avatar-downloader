var request = require('request');
require('dotenv').config()

var githubRequestModule = {}

// Make github request with optional callback
githubRequestModule.githubRequest = function (url, cb) {
  var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  // Check that API token exists
  if (!GITHUB_TOKEN) {
    console.log('Error! Ensure API token is saved in /.env as GITHUB_TOKEN=<your_token>')
    return;
  }
  // GET request options
  var options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  };

  // Send and return the request object (can be chained, eg: githubRequest.on(...))
  return request(options, function (err, res, body) {
    if (err) {
      console.log(err);
    } else if (cb) {
      cb(err, res, body);
    }
  });
}

githubRequestModule.getRepoContributors = function(repoOwner, repoName, cb) {
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  githubRequestModule.githubRequest(url, cb)
}


module.exports = githubRequestModule;