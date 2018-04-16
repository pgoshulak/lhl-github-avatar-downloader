var request = require('request');
var fs = require('fs');
var path = require('path');
require('dotenv').config()

var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

// Given repo owner and name, get all contributors
function getRepoContributors(repoOwner, repoName, cb) {
  // GET request options
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  };

  // Send the request
  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      cb(err, body);
    }
  });
}

// Download an image from URL and save to filepath
function downloadImageByURL(url, filePath) {
  var options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  };
  // Check that the write directory exists
  var dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  // Request the file and pipe to stream
  request(options)
    .on('error', function(err) {
      console.log(err);
    })
    .on('response', function(res) {
      console.log(`Received reponse "${res.statusCode}: ${res.statusMessage}" from ${url}`);
    })
    .pipe(fs.createWriteStream(filePath)
      .on('finish', function() {
        console.log(`Finished writing to ${filePath}`);
      }));
}

// Start of main program execution
// Check required arguments
var args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Error: incorrect arguments supplied. Please provide 2 arguments as <user> <repo>, eg:');
  console.log('  $ node download_avatars.js jquery jquery');
} else {
  // Download list of all repo contributors
  getRepoContributors(args[0], args[1], function(err, result) {
    if (err) {
      console.log(err);
    } else {
      resultArr = JSON.parse(result);

      // If user or repo does not exist, resultArr will NOT be an array
      if (!Array.isArray(resultArr)) {
        console.log('Error! Ensure the username and repo are valid')
      } else {
        // Loop through each result obj and download the associated avatar URL
        resultArr.forEach(function(res) {
          downloadImageByURL(res.avatar_url, `avatars/${res.login}.jpg`);
        });
      }
    }
  });
}
