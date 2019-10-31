const { numberWithCommas } = require('./utils')

// Tweets if trees are more than they were in the last check
const tweet = (client, past, now) => {
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

module.exports = {
	tweet
}
