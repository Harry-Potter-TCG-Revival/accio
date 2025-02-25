import { cards } from './cards.js';

document.addEventListener('DOMContentLoaded', function() {

    // Dynamic Header and Footer Loading
    function loadAndExecute(url, targetId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const targetElement = document.getElementById(targetId);
                if (!targetElement) {
                    console.error(`Error: Element with ID '${targetId}' not found.`);
                    return; // Stop execution if the target does not exist
                }
                targetElement.innerHTML = data;
    
                // Extract and execute <script> tags
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const scripts = tempDiv.querySelectorAll('script');
    
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.type = 'module';
    
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
    
                    document.body.appendChild(newScript);
                });
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    }
    
    // Load Header and Footer
    loadAndExecute('Header.html', 'header');
    const headerStylesheet = document.createElement('link');
    headerStylesheet.rel = 'stylesheet';
    headerStylesheet.href = 'Header.css';
    document.head.appendChild(headerStylesheet);

    loadAndExecute('Footer.html', 'footer');
    const footerStylesheet = document.createElement('link');
    footerStylesheet.rel = 'stylesheet';
    footerStylesheet.href = 'Footer.css';
    document.head.appendChild(footerStylesheet);

    const urlParams = new URLSearchParams(window.location.search);
    const cardName = urlParams.get('card');

    if (cardName && cardName.toLowerCase().startsWith('random')) {
        // Extract the number following 'random'
        const randomIndex = parseInt(cardName.replace('random', '').trim(), 10);

        // Check if randomIndex is a valid number and within bounds of the cards array
        if (!isNaN(randomIndex) && randomIndex >= 0 && randomIndex < cards.length) {
            const card = cards[randomIndex];
            // Load and display the card
            displayCard(card);
        } else {
            // Redirect to the error page if the index is invalid
            window.location.href = 'Error_Page.html';
        }
    } else if (cardName) {
        // Find and display the card by name
        const card = cards.find(c => c.name.toLowerCase() === cardName.toLowerCase());
        if (card) {
            displayCard(card);
        }
    }

    function displayCard(card) {
        const cardImage = document.getElementById('card-image');
        cardImage.src = 'cardimages/' + card.imgSrc || 'images/card-back@3x.png';

        if (card.horizontal) {
            cardImage.classList.add('horizontal');
        }

        setTextContent('card-name', card.name);
        setTextContent('card-cost', card.cost || 'N/A');
        setTextContent('card-lesson', card.lesson ? card.lesson.join(', ') : 'N/A');
        setTextContent('card-type', card.type.join(', '));
        setTextContent('card-subtypes', card.subTypes ? card.subTypes.join(', ') : 'N/A');
        setTextContent('card-effect', card.effect ? card.effect.join(' ') : 'N/A');

        const dmgHealthText = (card.dmgEachTurn ? `Damage Each Turn: ${card.dmgEachTurn}` : '') +
            (card.health ? ` Health: ${card.health}` : '');
        setTextContent('card-dmg-health', dmgHealthText || 'N/A');

        const providesText = card.provides ? card.provides.map(p => `Lesson: ${p.lesson}, Amount: ${p.amount}`).join(', ') : 'N/A';
        setTextContent('card-provides', providesText);

        const toSolveRewardText = (card.toSolve ? `To Solve: ${card.toSolve}` : '') +
            (card.reward ? ` Reward: ${card.reward}` : '');
        setTextContent('card-to-solve', toSolveRewardText || 'N/A');

        const toWinPrizeText = (card.toWin ? `To Win: ${card.toWin}` : '') +
            (card.prize ? ` Prize: ${card.prize}` : '');
        setTextContent('card-to-win', toWinPrizeText || 'N/A');

        setTextContent('card-flavor', card.flavorText || 'N/A');
        setTextContent('card-artist', card.artist || 'N/A');
        setTextContent('card-set', card.setName || 'N/A');
        setTextContent('card-number', card.number || 'N/A');
        setTextContent('card-rarity', card.rarity || 'N/A');
        
        //Load in the Card Rules
        loadCardRules(card.name);
    }

    function setTextContent(id, text) {
        const element = document.getElementById(id);
        const span = element.querySelector('span');
        if (text === 'N/A') {
            element.style.display = 'none';
        } else {
            span.textContent = text;
            element.style.display = 'block';
        }
    }

    // Function to load rulings from rulings.json
    function loadCardRules(cardName) {
        fetch('rules.json')
            .then(response => response.arrayBuffer()) // Get raw binary data
            .then(buffer => {
                const decoder = new TextDecoder("utf-8"); // Force UTF-8 decoding
                const jsonString = decoder.decode(buffer);
                return JSON.parse(jsonString); // Convert to JSON
            })
            .then(rulings => {
                const cardRulesContainer = document.getElementById('card-rules');
                cardRulesContainer.innerHTML = ''; // Clear container
    
                const matchingRulings = rulings.filter(ruling => ruling.cards.includes(cardName));
    
                if (matchingRulings.length > 0) {
                    matchingRulings.forEach(ruling => {
                        const rulingDiv = document.createElement('div');
                        rulingDiv.classList.add('card-rule-entry');
                        rulingDiv.innerHTML = `<strong>${ruling.date} - ${ruling.source}</strong>: ${sanitizeText(ruling.ruling)}`;
                        cardRulesContainer.appendChild(rulingDiv);
                    });
                } else {
                    cardRulesContainer.innerHTML = `<div class="card-rule-entry">No rulings available.</div>`;
                }
            })
            .catch(error => {
                console.error('Error loading rulings:', error);
                document.getElementById('card-rules').innerHTML = `<div class="card-rule-entry">Error loading rulings.</div>`;
            });
    }
    // Function to sanitize text and remove bad characters
    function sanitizeText(text) {
        return text.replace(/\uFFFD/g, "'"); // Replace '�' with a normal apostrophe
    }
});
