var getRepoContributors = require('./github-request.js').getRepoContributors

var args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Error: incorrect arguments supplied. Please provide 2 arguments as <user> <repo>, eg:');
  console.log('  $ node download_avatars.js jquery jquery');
  return
}

getRepoContributors(args[0], args[1], function(err, res, body) {
  var contributors = JSON.parse(body);
  var starredUrls = [];
  contributors.forEach(function(contributor) {
    // Store the starred urls
    starredUrls.push(contributor.starred_url)
  });
  console.log(starredUrls)
})