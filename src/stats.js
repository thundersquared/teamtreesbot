const fs = require('fs')

// Reads JSON from stats file and parses it
const readStats = () => {
	return JSON.parse(fs.readFileSync('data/stats.json', 'utf8'))
}

// Write stringified JSON to stats file
const writeStats = data => {
	fs.writeFile('data/stats.json', JSON.stringify(data), 'utf8', err => {
		if (err) {
	        console.error(err)
	    }
	})
}

module.exports = {
	readStats,
	writeStats
}
