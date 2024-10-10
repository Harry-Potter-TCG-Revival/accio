import { cards } from './cards.js';

let currentPage = 1;
const cardsPerPage = 20;

const setAbbreviations = {
    "HAH": "Hogwarts a History",
    "GOF": "Goblet of Fire",
    "QC": "Quidditch Cup",
    "B": "Base",
    "DA": "Diagon Alley",
    "AAH": "Adventures at Hogwarts",
    "COS": "Chamber of Secrets",
    "HOS": "Heir of Slytherin",
    "POA": "Prisoner of Azkaban",
    "SOH": "Streets of HogsMeade",
    "EOTP": "Echoes of the Past",
    "PRO": "Promotional"
};


document.addEventListener('DOMContentLoaded', function() {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get('search') || '';

    // Log the search string to the console
    console.log('Search String:', searchString);

    // Parse the search string and filter cards
    const filteredCards = filterCardsBySearchString(cards, searchString);

    // Log the filtered cards to the console
    console.log('Filtered Cards:', filteredCards);

    // Display the filtered cards
    displayFilteredCards(filteredCards, currentPage);

    // Update the result count
    updateResultCount(filteredCards.length);

    // Add event listeners for filter and sort options
    document.getElementById('Search_Display_Body_Filters_SortBy_Dropdown').addEventListener('change', function() {
        applyFiltersAndSort();
    });

    document.getElementById('Search_Display_Body_Filters_Ascending_Dropdown').addEventListener('change', function() {
        applyFiltersAndSort();
    });
});

function filterCardsBySearchString(cards, searchString) {
    // Split the search string into terms, handling quotes
    const terms = searchString.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g).map(term => term.replace(/"/g, '')).filter(term => term.trim() !== '');
    console.log(terms)

    return cards.filter(card => {
        return terms.every(term => {
            if (term.includes(':')) {
                // Handle prefixed terms
                const [prefix, ...queryParts] = term.split(':');
                const query = queryParts.join(':').toLowerCase().trim();

                if (query.includes('*')) {
                    const andConditions = query.split('*').map(cond => cond.trim());
                    switch (prefix.toLowerCase()) {
                        case 'n':
                        case 'name':
                        case 'nm':
                            return andConditions.every(cond => card.name && card.name.toLowerCase().includes(cond));
                        case 'num':
                        case 'number':
                            return andConditions.every(cond => card.number && card.number.toLowerCase().includes(cond));
                        case 'fl':
                        case 'flavor':
                        case 'flavortext':
                            return andConditions.every(cond => card.flavorText && card.flavorText.toLowerCase().includes(cond));
                        case 't':
                        case 'type':
                            return andConditions.every(cond => card.type && card.type.some(type => type.toLowerCase().includes(cond)));
                        case 'k':
                        case 'keyword':
                            return andConditions.every(cond => card.subTypes && card.subTypes.some(subType => subType.toLowerCase().includes(cond)));
                        case 'r':
                        case 'rarity':
                            return andConditions.every(cond => card.rarity && card.rarity.toLowerCase().includes(cond));
                        case 'a':
                        case 'artist':
                            return andConditions.every(cond => card.artist && (
                                Array.isArray(card.artist)
                                ? card.artist.join(', ').toLowerCase().includes(cond) // Join array of artists into a string
                                : card.artist.toLowerCase().includes(cond) // Handle single string artist
                            ));                                
                        case 'e':
                        case 'effect':
                            return andConditions.every(cond => card.effect && card.effect.some(effect => effect.toLowerCase().includes(cond)));
                        case 's':
                        case 'set':
                        case 'setname':
                            return andConditions.every(cond => {
                                const setName = card.setName && card.setName.toLowerCase();
                                const abbreviation = Object.keys(setAbbreviations).find(abbr => setAbbreviations[abbr].toLowerCase() === setName);
                                return (setName && setName.includes(cond)) || (abbreviation && abbreviation.toLowerCase().includes(cond));
                            });                                
                        case 'd':
                        case 'date':
                        case 'releasedate':
                            return andConditions.every(cond => card.releaseDate && card.releaseDate.toLowerCase().includes(cond));
                        case 'ts':
                        case 'solve':
                        case 'tosolve':
                            return andConditions.every(cond => card.toSolve && card.toSolve.toLowerCase().includes(cond));
                        case 're':
                        case 'reward':
                            return andConditions.every(cond => card.reward && card.reward.toLowerCase().includes(cond));
                        case 'l':
                        case 'lesson':
                            return andConditions.every(cond => card.lesson && card.lesson.some(lesson => lesson.toLowerCase().includes(cond)));
                        case 'c':
                        case 'cost':
                        case 'power':
                        case 'pow':
                            return andConditions.every(cond => card.cost && card.cost.toString().toLowerCase() === query);
                        case 'dmg':
                        case 'damage':
                        case 'dmgeachturn':
                            return andConditions.every(cond => card.dmgEachTurn && card.dmgEachTurn.toString().toLowerCase().includes(cond));
                        case 'h':
                        case 'health':
                            return andConditions.every(cond => card.health && card.health.toString().toLowerCase().includes(cond));
                        case 'note':
                            return andConditions.every(cond => card.note && card.note.toLowerCase().includes(cond));
                        case 'pl':
                        case 'provideslesson':
                        case 'provides.lesson':
                            return andConditions.every(cond => card.provides && card.provides.some((item) => {
                                return item.lesson && item.lesson.toLowerCase().includes(cond);
                            }));
                        case 'pa':
                        case 'providesamount':
                        case 'provides.amount':
                            return andConditions.every(cond => card.provides && card.provides.some((item) => {
                                return item.amount && item.amount.toString().toLowerCase().includes(cond);
                            }));
                        case 'tw':
                        case 'towin':
                            return andConditions.every(cond => card.toWin && card.toWin.toLowerCase().includes(cond));
                        case 'p':
                        case 'prize':
                            return andConditions.every(cond => card.prize && card.prize.toLowerCase().includes(cond));
                        default:
                            return false;
                    }
                } else if (query.includes('|')) {
                    const orConditions = query.split('|').map(cond => cond.trim());
                    switch (prefix.toLowerCase()) {
                        case 'n':
                        case 'name':
                        case 'nm':
                            return orConditions.some(cond => card.name && card.name.toLowerCase().includes(cond));
                        case 'num':
                        case 'number':
                            return orConditions.some(cond => card.number && card.number.toLowerCase().includes(cond));
                        case 'fl':
                        case 'flavor':
                        case 'flavortext':
                            return orConditions.some(cond => card.flavorText && card.flavorText.toLowerCase().includes(cond));
                        case 't':
                        case 'type':
                            return orConditions.some(cond => card.type && card.type.some(type => type.toLowerCase().includes(cond)));
                        case 'k':
                        case 'keyword':
                            return orConditions.some(cond => card.subTypes && card.subTypes.some(subType => subType.toLowerCase().includes(cond)));
                        case 'r':
                        case 'rarity':
                            return orConditions.some(cond => card.rarity && card.rarity.toLowerCase().includes(cond));
                        case 'a':
                        case 'artist':
                            return orConditions.some(cond => card.artist && (
                                Array.isArray(card.artist)
                                ? card.artist.join(', ').toLowerCase().includes(cond) // Join array of artists into a string
                                : card.artist.toLowerCase().includes(cond) // Handle single string artist
                            ));                                
                        case 'e':
                        case 'effect':
                            return orConditions.some(cond => card.effect && card.effect.some(effect => effect.toLowerCase().includes(cond)));
                        case 's':
                        case 'set':
                        case 'setname':
                            return orConditions.some(cond => {
                                const setName = card.setName && card.setName.toLowerCase();
                                const abbreviation = Object.keys(setAbbreviations).find(abbr => setAbbreviations[abbr].toLowerCase() === setName);
                                return (setName && setName.includes(cond)) || (abbreviation && abbreviation.toLowerCase().includes(cond));
                            });                                
                        case 'd':
                        case 'date':
                        case 'releasedate':
                            return orConditions.some(cond => card.releaseDate && card.releaseDate.toLowerCase().includes(cond));
                        case 'ts':
                        case 'solve':
                        case 'tosolve':
                            return orConditions.some(cond => card.toSolve && card.toSolve.toLowerCase().includes(cond));
                        case 're':
                        case 'reward':
                            return orConditions.some(cond => card.reward && card.reward.toLowerCase().includes(cond));
                        case 'l':
                        case 'lesson':
                            return orConditions.some(cond => card.lesson && card.lesson.some(lesson => lesson.toLowerCase().includes(cond)));
                        case 'c':
                        case 'cost':
                        case 'power':
                        case 'pow':
                            return orConditions.some(cond => card.cost && card.cost.toString().toLowerCase() === query);
                        case 'dmg':
                        case 'damage':
                        case 'dmgeachturn':
                            return orConditions.some(cond => card.dmgEachTurn && card.dmgEachTurn.toString().toLowerCase().includes(cond));
                        case 'h':
                        case 'health':
                            return orConditions.some(cond => card.health && card.health.toString().toLowerCase().includes(cond));
                        case 'note':
                            return orConditions.some(cond => card.note && card.note.toLowerCase().includes(cond));
                        case 'pl':
                        case 'provideslesson':
                        case 'provides.lesson':
                            return orConditions.some(cond => card.provides && card.provides.some((item) => {
                                return item.lesson && item.lesson.toLowerCase().includes(cond);
                            }));
                        case 'pa':
                        case 'providesamount':
                        case 'provides.amount':
                            return orConditions.some(cond => card.provides && card.provides.some((item) => {
                                return item.amount && item.amount.toString().toLowerCase().includes(cond);
                            }));
                        case 'tw':
                        case 'towin':
                            return orConditions.some(cond => card.toWin && card.toWin.toLowerCase().includes(cond));
                        case 'p':
                        case 'prize':
                            return orConditions.some(cond => card.prize && card.prize.toLowerCase().includes(cond));
                        default:
                            return false;
                    }
                } else {
                    switch (prefix.toLowerCase()) {
                        case 'n':
                        case 'name':
                        case 'nm':
                            return card.name && card.name.toLowerCase() === query;
                        case 'num':
                        case 'number':
                            return card.number && card.number.toLowerCase() === query;
                        case 'fl':
                        case 'flavor':
                        case 'flavortext':
                            return card.flavorText && card.flavorText.toLowerCase().includes(query);
                        case 't':
                        case 'type':
                            return card.type && card.type.some(type => type.toLowerCase().includes(query));
                        case 'k':
                        case 'keyword':
                            return card.subTypes && card.subTypes.some(subType => subType.toLowerCase().includes(query));
                        case 'r':
                        case 'rarity':
                            return card.rarity && card.rarity.toLowerCase().includes(query);
                        case 'a':
                        case 'artist':
                            return card.artist && (
                                Array.isArray(card.artist)
                                ? card.artist.join(', ').toLowerCase().includes(query) // Join array of artists into a string
                                : card.artist.toLowerCase().includes(query) // Handle single string artist
                            );
                        case 'e':
                        case 'effect':
                            return card.effect && card.effect.some(effect => effect.toLowerCase().includes(query));
                        case 's':
                        case 'set':
                        case 'setname':
                            return card.setName && (
                                card.setName.toLowerCase().includes(query) || 
                                Object.keys(setAbbreviations).some(abbr => abbr.toLowerCase().includes(query) && setAbbreviations[abbr].toLowerCase() === card.setName.toLowerCase())
                            );                                
                        case 'd':
                        case 'date':
                        case 'releasedate':
                            return card.releaseDate && card.releaseDate.toLowerCase().includes(query);
                        case 'ts':
                        case 'solve':
                        case 'tosolve':
                            return card.toSolve && card.toSolve.toLowerCase().includes(query);
                        case 're':
                        case 'reward':
                            return card.reward && card.reward.toLowerCase().includes(query);
                        case 'l':
                        case 'lesson':
                            return card.lesson && card.lesson.some(lesson => lesson.toLowerCase().includes(query));
                        case 'c':
                        case 'cost':
                        case 'power':
                        case 'pow':
                            return card.cost && card.cost.toString().toLowerCase() === query;
                        case 'dmg':
                        case 'damage':
                        case 'dmgeachturn':
                            return card.dmgEachTurn && card.dmgEachTurn.toString().toLowerCase().includes(query);
                        case 'h':
                        case 'health':
                            return card.health && card.health.toString().toLowerCase().includes(query);
                        case 'note':
                            return card.note && card.note.toLowerCase().includes(query);
                        case 'pl':
                        case 'provideslesson':
                        case 'provides.lesson':
                            return card.provides && card.provides.some((item) => {
                                return item.lesson && item.lesson.toLowerCase().includes(query);
                            });
                        case 'pa':
                        case 'providesamount':
                        case 'provides.amount':
                            return card.provides && card.provides.some((item) => {
                                return item.amount && item.amount.toString().toLowerCase().includes(query);
                            });
                        case 'tw':
                        case 'towin':
                            return card.toWin && card.toWin.toLowerCase().includes(query);
                        case 'p':
                        case 'prize':
                            return card.prize && card.prize.toLowerCase().includes(query);
                        default:
                            return false;
                    }
                }
            } else {
                // Default to name search
                return card.name.toLowerCase().includes(term.toLowerCase());
            }
        });
    });
}

function displayFilteredCards(cards, page) {
    const resultsContainer = document.getElementById('results_container');
    const paginationControls = document.getElementById('pagination_controls');
    resultsContainer.innerHTML = ''; // Clear any existing content
    paginationControls.innerHTML = ''; // Clear any existing pagination controls

    if (cards.length === 0) {
        resultsContainer.innerHTML = '<p>No cards found.</p>';
    } else {
        const startIndex = (page - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const paginatedCards = cards.slice(startIndex, endIndex);

        paginatedCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            if (card.horizontal) {
                cardElement.classList.add('horizontal-card');
            }

            const imgElement = document.createElement('img');
            imgElement.src = 'cardimages/' + card.imgSrc;
            imgElement.alt = card.name;
            cardElement.appendChild(imgElement);

            cardElement.addEventListener('click', function() {
                const url = `Card_Display.html?card=${encodeURIComponent(card.name)}`;
                window.location.href = url;
            });

            resultsContainer.appendChild(cardElement);
        });

        const totalPages = Math.ceil(cards.length / cardsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === page ? 'active' : '';
            pageButton.addEventListener('click', function() {
                currentPage = i;
                displayFilteredCards(cards, currentPage);
            });
            paginationControls.appendChild(pageButton);
        }
    }
}

function updateResultCount(count) {
    document.getElementById('result_count').textContent = count;
}

function applyFiltersAndSort() {
    const sortBy = document.getElementById('Search_Display_Body_Filters_SortBy_Dropdown').value;
    const sortOrder = document.getElementById('Search_Display_Body_Filters_Ascending_Dropdown').value;

    let filteredCards = filterCardsBySearchString(cards, localStorage.getItem('SearchString') || '');

    if (sortBy) {
        filteredCards.sort((a, b) => {
            let valueA, valueB;

            switch (sortBy) {
                case 'Set': // Set/Number
                    valueA = a.setName + a.number;
                    valueB = b.setName + b.number;
                    break;
                case 'Name': // Name
                    valueA = a.name;
                    valueB = b.name;
                    break;
                case 'Cost': // Cost
                    valueA = a.cost;
                    valueB = b.cost;
                    break;
                case 'Type':
                    valueA = a.type.join(', ');
                    valueB = b.type.join(', ');
                    break;
                case 'Rarity':
                    valueA = a.rarity;
                    valueB = b.rarity;
                    break;
                case 'Artist':
                    valueA = a.artist;
                    valueB = b.artist;
                    break;
                case 'Lesson':
                    valueA = a.lesson.join(', ');
                    valueB = b.lesson.join(', ');
                    break;
                default:
                    return 0;
            }

            if (valueA < valueB) {
                return -1;
            }
            if (valueA > valueB) {
                return 1;
            }
            return 0;
        });

        if (sortOrder === 'Desc') {
            filteredCards.reverse();
        }
    }

    // Display the filtered and sorted cards
    displayFilteredCards(filteredCards, currentPage);

    // Update the result count
    updateResultCount(filteredCards.length);
}

// Include the ability to search from this page
const searchInput = document.getElementById('search_input');
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const StringValue = searchInput.value;

        localStorage.setItem('SearchString', StringValue);

        const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;

        // Redirect to the new URL
        window.location.href = url;
    }
});
