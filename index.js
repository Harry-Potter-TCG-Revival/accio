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


document.addEventListener('DOMContentLoaded', function () {
    const snowContainer = document.querySelector('.snow-container');
    const maxSnowflakes = 250; // Maximum number of snowflakes allowed
    const snowflakes = []; // Array to track active snowflakes

    // Function to create a snowflake
    function createSnowflake() {
        if (snowflakes.length >= maxSnowflakes) {
            return; // Stop creating new snowflakes if the cap is reached
        }

        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Start at the top of the screen
        snowflake.style.left = `${Math.random() * 100}vw`; // Random horizontal position
        snowflake.style.top = `-10px`; // Always start just above the screen
        
        // Randomize animation properties
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Random fall speed
        snowflake.style.animationDelay = `${Math.random() * 2}s`; // Staggered animation start
        snowflake.style.opacity = `${Math.random() * 0.5 + 0.5}`; // Random opacity
        snowflake.style.width = snowflake.style.height = `${Math.random() * 5 + 5}px`; // Random size

        snowContainer.appendChild(snowflake);
        snowflakes.push(snowflake); // Add snowflake to the tracking array

        // Remove snowflake after animation and update the array
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
            const index = snowflakes.indexOf(snowflake);
            if (index > -1) {
                snowflakes.splice(index, 1); // Remove snowflake from the tracking array
            }
        });
    }

    // Initial snowflake creation
    for (let i = 0; i < maxSnowflakes; i++) {
        createSnowflake();
    }

    // Continuously check and create snowflakes to maintain the cap
    setInterval(() => {
        createSnowflake();
    }, 100); // Adjust interval for smooth updates
});




document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('background-audio');
    audio.volume = 0.1; // Set the volume very low

    // Function to play audio and remove all event listeners
    function playAudio() {
        console.log("User interaction detected");
        audio.play()
            .then(() => {
                console.log("Audio playback started");
                // Remove event listeners after audio starts playing
                document.removeEventListener('click', playAudio);
                document.removeEventListener('scroll', playAudio);
                document.removeEventListener('mousemove', playAudio);
                document.removeEventListener('mouseover', playAudio);
            })
            .catch(error => {
                console.error("Audio playback failed:", error);
            });
    }

    // Attach listeners for multiple interactions
    document.addEventListener('click', playAudio, { once: true });
    document.addEventListener('scroll', playAudio, { once: true });
    document.addEventListener('mousemove', playAudio, { once: true });
    document.addEventListener('mouseover', playAudio, { once: true });
});

