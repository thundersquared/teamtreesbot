const Twitter = require('twitter')
const { readStats, writeStats } = require('./stats')
const { uptime } = require('./uptime')
const { tweet } = require('./tweet')
const { fetch } = require('./utils')

// Twitter configuration
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// Main bot logic
const run = async () => {

	// Populate from last check
	let data = readStats()

	// Fetch new counter
	let trees = await fetch('https://teamtrees.org/')

	// Check if still up
	if (trees > 0) {

		// Process Twitter
		tweet(client, data.trees, trees)
		uptime(client, data.status, 'up')

		// Update stats
		data.trees = trees
		data.status = 'up'

	} else {

		// Update downtme
		uptime(client, data.status, 'down')

		// Update stats
		data.status = 'down'

	}

	// Write to file
	writeStats(data)

}

// Main thread launching login function every minute
const poll = () => {
	setInterval(run, 60 * 1000)
}

module.exports = {
	run,
	poll
}
