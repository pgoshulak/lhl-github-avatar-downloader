var request = require('request');
require('dotenv').config()


var githubRequest = function(url, cb) {
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

  // Send the request
  request(options, function (err, res, body) {
    if (err) {
      console.log(err);
    } else {
      cb(err, body);
    }
  });
}

module.exports = githubRequest;