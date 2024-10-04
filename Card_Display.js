import { cards } from './cards.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search_input');
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const StringValue = searchInput.value.trim().toLowerCase();
            const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
            window.location.href = url;
        }
    });

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
});
