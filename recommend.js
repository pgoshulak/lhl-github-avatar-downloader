var getRepoContributors = require('./github-request.js').getRepoContributors;
var githubRequest = require('./github-request.js').githubRequest;
require('padleft');

// Check that the correct args are given
var args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Error: incorrect arguments supplied. Please provide 2 arguments as <user> <repo>, eg:');
  console.log('  $ node download_avatars.js jquery jquery');
  return;
}

// Log the top 5 repos to console
var logTopRepos = function(repos) {
  // Sort the repos by star count
  var sortedRepos = Object.keys(repos).sort(function(a, b) {
    return repos[b].stars - repos[a].stars
  })
  
  // Log the top repos
  for (var i = 0; i < 5 && i < sortedRepos.length; i++) {
    var repoId = sortedRepos[i];
    var repo = repos[repoId];
    console.log(`[ ${String(repo.stars).padLeft(3, ' ')} stars ] ${repoId}`);
  }
}

// Get the repo's contributors and find their top-starred repos
getRepoContributors(args[0], args[1], function (err, res, body) {
  var contributors = JSON.parse(body);
  console.log(`Retrieved ${contributors.length} contributors`)
  var starredUrls = [];
  contributors.forEach(function (contributor) {
    // Store the starred urls
    starredUrls.push(contributor.starred_url)
  });

  // Number of repos still waiting for results
  var reposAwaitingResults = contributors.length;

  // Master list of repos counted so far
  var repoStarCount = {}

  // Process each contributor's starred URLs
  starredUrls.forEach(function (url) {
    cleanUrl = url.split('{')[0];
    // Fetch the repos at the url
    githubRequest(cleanUrl, function (err, res, body) {
      repos = JSON.parse(body);
      repos.forEach(function (repo) {

        // Add the repo to a counter
        var repoId = `${repo.owner.login} / ${repo.name}`
        if (repoStarCount[repoId]) {
          repoStarCount[repoId].stars += 1;
        } else {
          repoStarCount[repoId] = {
            owner: repo.owner.login,
            name: repo.name,
            stars: 1
          };
        }
      });
      // Register that this repo is finished being processed
      reposAwaitingResults -= 1;
    });

  });

  // Check to see if all repos are done downloading (not using async/await yet!)
  awaitAllRepos = setInterval(function () {
    console.log(`Waiting for ${reposAwaitingResults} results`)
    // Exit this loop when all repos are done processing
    if (reposAwaitingResults === 0) {
      clearInterval(awaitAllRepos)
      console.log(`Finished!`)
      logTopRepos(repoStarCount);
    }
  }, 200);
})