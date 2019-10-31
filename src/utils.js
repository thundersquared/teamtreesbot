const got = require('got')

// Formats int with commas
const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Retrieves page and returns parsed body
const fetch = async url => {
	try {

		// Fetch page
		let page = await got(url)

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

module.exports = {
	fetch,
	numberWithCommas,
	parse
}
