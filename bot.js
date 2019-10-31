const fs = require('fs')
const got = require('got')
const Twitter = require('twitter')

// Twitter configuration
let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// Reads JSON from stats file and parses it
const readStats = () => {
	return JSON.parse(fs.readFileSync('/data/stats.json', 'utf8'))
}

// Write stringified JSON to stats file
const writeStats = data => {
	fs.writeFile('/data/stats.json', JSON.stringify(data), 'utf8', err => {
		if (err) {
	        console.error(err)
	    }
	})
}

// Formats int with commas
const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Retrieves page and returns parsed body
const fetch = async () => {
	try {

		// Fetch page
		let page = await got('https://teamtrees.org/')

		// Parse trees planted
		return parse(page.body)

	} catch (error) {
		console.error('Guess it is not working...')
		return -1
	}
}

// Searches trees counter in body, parses integer and rounds it
const parse = body => {

	// Get trees
	let trees = body.match(/data-count="(\d+)"/i)

	// Parse int
	trees = parseInt(trees[1], 10)

	// Round value
	trees = Math.round(trees / 1000) * 1000

	return trees
}

// Tweets if trees are more than they were in the last check
const tweet = (past, now) => {
	if (past && past > 0 && now > past) {

		// Format number from integer
		let trees = numberWithCommas(now)

		let tweets = [
			"🌲🌲🌲\nDid you know TREESNUM+ trees have been planted?\n\nGo #TeamTrees 🌱\nGo donate: https://teamtrees.org/",
			"Where could you possibly put TREESNUM+ trees?\nThink about that and go donate to #TeamTrees: https://teamtrees.org/",
			"You HAVE to check this out. #TeamTrees planted over TREESNUM trees! THAT'S INSANE!\nWanna help? https://teamtrees.org/",
			"🌲🌲🌲\nTREE ALERT!\n🌲🌲🌲\nOver TREESNUM+ trees were planted by #TeamTrees. Don't you simply wanna help? https://teamtrees.org/",
			"Over TREESNUM+ trees were planted by Treelon, Jack and Susan.\nAre you groot enought to donate? #TeamTrees https://teamtrees.org/",
			"What would you do with TREESNUM+ trees?\nWell, that's how many #TeamTrees already planted.\nCome help! 🌲🌲🌲 https://teamtrees.org/",
			"TREESNUM+ 🌲 planted simply 'cause #TeamTrees makes $1 = 1 🌲\n\nSo, what about donating $1? https://teamtrees.org/"
		]

		// Choose random tweet template
		let status = tweets[Math.floor(Math.random() * tweets.length)]

		// Replace trees number in string
		status = status.replace('TREESNUM', trees)

		let data = {
			status
		}

		// Tweet
		client.post('statuses/update', data, (error, tweet, response) => {
			if (error) {
				console.error(tweet)
			}
		})
	}
}

// Updates bot description on uptime change
const uptime = (past, now) => {

	// Update only if there's a change
	if (past !== now) {

		let data = {
			description: `Made by @squaredhq to keep you updated during the campaign.\n\nGo donate: https://teamtrees.org/\nGo #TeamTrees 🌱 and @MrBeastYT!\n\nSite is ${now} now.`
		}

		client.post('account/update_profile', data, (error, tweet, response) => {
			if (error) {
				console.error(tweet)
			}
		})
	}
}

// Main bot logic
const run = async () => {

	// Populate from last check
	let data = readStats()

	// Fetch new counter
	let trees = await fetch()

	// Check if still up
	if (trees > 0) {

		// Process Twitter
		tweet(data.trees, trees)
		uptime(data.status, 'up')

		// Update stats
		data.trees = trees
		data.status = 'up'

	} else {

		// Update downtme
		uptime(data.status, 'down')

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

run()
poll()
