// .github/scripts/updateCardsJson.js

import fs from 'fs'
import { cards } from '../../cards.js'

// Convert the cards data to JSON
const jsonData = JSON.stringify(cards, null, 2)

// Write the JSON data to cards.json
fs.writeFileSync('cards.json', jsonData, 'utf8')

console.log('cards.json has been updated.')
