const fs = require('fs')
const got = require('got')
const Twitter = require('twitter')

let client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

const readStats = () => {
	return JSON.parse(fs.readFileSync('/data/stats.json', 'utf8'))
}

const writeStats = data => {
	fs.writeFile('/data/stats.json', JSON.stringify(data), 'utf8', err => {
		if (err) {
	        console.error(err)
	    }
	})
}

const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

const parse = body => {

	// Get trees
	let trees = body.match(/data-count="(\d+)"/i)

	// Parse int
	trees = parseInt(trees[1], 10)

	// Round value
	trees = Math.round(trees / 1000) * 1000

	return trees
}

const tweet = (past, now) => {
	if (past && past > 0 && now > past) {
		let trees = numberWithCommas(now)

		let tweets = [
			"Did you know TREESNUM+ trees have been planted?\n\nGo #TeamTrees 🌱\nGo donate: https://teamtrees.org/",
			"Where could you possibly put TREESNUM+ trees?\nThink about that and go donate to #TeamTrees: https://teamtrees.org/",
			"You HAVE to check this out. #TeamTrees planted over TREESNUM trees! THAT'S INSANE!\nWanna help? https://teamtrees.org/",
			"🌲🌲🌲\nTREE ALERT!\n🌲🌲🌲\nOver TREESNUM+ trees were planted by #TeamTrees. Don't you simply wanna help? https://teamtrees.org/",
			"Over TREESNUM+ trees were planted by Treelon, Jack and Susan.\nAre you groot enought to donate? #TeamTrees https://teamtrees.org/",
			"TREESNUM+ 🌲 planted simply 'cause #TeamTrees makes $1 = 1 🌲\n\nSo, what about donating $1? https://teamtrees.org/"
		]

		let status = tweets[Math.floor(Math.random() * tweets.length)]

		status = status.replace('TREESNUM', trees)

		let data = {
			status
		}

		client.post('statuses/update', data, (error, tweet, response) => {
			if (error) {
				console.error(tweet)
			}
		})
	}
}

const uptime = (past, now) => {
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

const run = async () => {

	let data = readStats()

	let trees = await fetch()

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

const poll = () => {
	setInterval(run, 60 * 1000)
}

run()
poll()
