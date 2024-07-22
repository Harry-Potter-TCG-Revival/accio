import { cards } from './cards.js';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('Home_Page_Search_Bar');
    const searchString = document.getElementById('search_input');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const StringValue = searchString.value.trim().toLowerCase();
        const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
        window.location.href = url;
    });

    // Function to animate floating cards
    const floatingCards = document.querySelectorAll('.Floating_Card');

    // Select random cards
    const randomCards = selectRandomCards(cards, floatingCards.length);

    // Update floating cards with random images and add click event listeners
    floatingCards.forEach((cardElement, index) => {
        const card = randomCards[index];
        const imagePath = 'cardimages/' + card.imgSrc;
        const cardName = card.name;
        
        // Add 'horizontal' class if the card has the horizontal property set to true
        if (card.horizontal) {
            cardElement.classList.add('horizontal');
        }

        cardElement.querySelector('img').src = imagePath;

        cardElement.addEventListener('click', function() {
            const url = `Card_Display.html?card=${encodeURIComponent(cardName)}`;
            window.location.href = url;
        });
    });

    function animateFloatingCard(card) {
        const duration = Math.random() * 5 + 5; // Random duration between 5s and 10s
        const delay = Math.random() * 2; // Random delay between 0s and 2s

        card.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
    }

    floatingCards.forEach(card => {
        animateFloatingCard(card);
    });
});

function selectRandomCards(cards, numberOfCards) {
    const shuffled = cards.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfCards);
}
