// Updates bot description on uptime change
const uptime = (client, past, now) => {

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

module.exports = {
	uptime
}
