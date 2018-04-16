var fs = require('fs');
var path = require('path');
var githubRequest = require('./github-request.js')

console.log('Welcome to the GitHub Avatar Downloader!');

// Given repo owner and name, get all contributors
function getRepoContributors(repoOwner, repoName, cb) {
  var url = "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  githubRequest(url, cb)
}

// Download an image from URL and save to filepath
function downloadImageByURL(url, filePath) {
  // Check that the write directory exists
  var dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  // Request the file and pipe to stream
  githubRequest(url).pipe(fs.createWriteStream(filePath)
  .on('finish', function () {
    console.log(`Finished writing to ${filePath}`);
  }))
}

// Start of main program execution
// Check required arguments
var args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Error: incorrect arguments supplied. Please provide 2 arguments as <user> <repo>, eg:');
  console.log('  $ node download_avatars.js jquery jquery');
} else {
  // Download list of all repo contributors
  getRepoContributors(args[0], args[1], function (err, res, body) {
    if (err) {
      console.log(err);
    } else {
      resultArr = JSON.parse(body);

      // If user or repo does not exist, resultArr will NOT be an array
      if (!Array.isArray(resultArr)) {
        switch (resultArr.message) {
          case 'Bad credentials':
            console.log('Error! Bad credentials. Ensure your API key is correct');
            break;

          case 'Not Found':
            console.log('Error! Ensure the username and repo are valid')
            break;
        }
      } else {
        // Loop through each result obj and download the associated avatar URL
        resultArr.forEach(function (res) {
          downloadImageByURL(res.avatar_url, `avatars/${res.login}.jpg`);
        });
      }
    }
  });
}

module.exports = {
  getRepoContributors: getRepoContributors
}