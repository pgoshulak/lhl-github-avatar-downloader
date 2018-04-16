var request = require('request');
var fs = require('fs');
var path = require('path');
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

function downloadImageByURL(url, filePath) {
  var options = {
    url: url,
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + GITHUB_TOKEN
    }
  }
  // Check that the write directory exists
  var dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname)
  }

  // Request the file and pipe to stream
  request(options)
    .on('error', function(err) {
      console.log(err)
    })
    .on('response', function(res) {
      console.log(`Received reponse "${res.statusCode}: ${res.statusMessage}" from ${url}`)
    })
    .pipe(fs.createWriteStream(filePath)
      .on('finish', function() {
        console.log(`Finished writing to ${filePath}`)
      }))
}

// Check required arguments
var args = process.argv.slice(2)

if (args.length !== 2) {
  console.log('Error: incorrect arguments supplied. Please provide 2 arguments as <user> <repo>, eg:')
  console.log('  $ node download_avatars.js jquery jquery')
} else {
  getRepoContributors(args[0], args[1], function(err, result) {
    if (err) {
      console.log(err)
    } else {
      resultObj = JSON.parse(result)
      resultObj.forEach(function(res) {
        downloadImageByURL(res.avatar_url, `avatars/${res.login}.jpg`)
      })
    }
  });
}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "./avatars/kvirani.jpg")