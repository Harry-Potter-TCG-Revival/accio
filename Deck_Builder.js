import { cards } from './cards.js';

// Global variables for cards
let allCards = [];
let filteredCards = [];
let pageNumber = 1;
let totalPages = 1;
let container;
let lookingForStarter = 0;
let MainSide = 0;


//*************************************************************************************************************************************//
//********************************************************* Function Definitions ******************************************************//
//*************************************************************************************************************************************//


//*************************************************************************************************************************************//
//********************************************************* Filter Functions ******************************************************//
//*************************************************************************************************************************************//

    //************************ Function to display a page of cards************************//

    function displayPage(pageNumber, filteredCards, container) 
    {
        container.innerHTML = ''; // Clear existing cards
        const startIndex = (pageNumber - 1) * 8;
        const endIndex = startIndex + 8;
        for (let i = startIndex; i < endIndex && i < filteredCards.length; i++) {
            createCardButton(filteredCards[i], container);
        }
    }
    
   //******************** Function to filter cards by selected lesson types****************//
   function filterCardsByLessonType() 
   {
    const selectedLessonTypes = [];
    document.querySelectorAll('.lesson-dropdown .dropdown-item input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            const lessonType = checkbox.nextElementSibling.nextElementSibling.textContent.trim();
            selectedLessonTypes.push(lessonType);
        }
    });

    return selectedLessonTypes;
    }

    //******************** Function to filter cards by selected card types****************//
    function filterCardsByCardType() {
    const selectedCardTypes = [];
    document.querySelectorAll('.card-dropdown .dropdown-item input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            let cardTypeElement = checkbox.nextElementSibling;

            // Check if the next sibling is an image, if so, move to the next sibling (the span)
            if (cardTypeElement && cardTypeElement.tagName === 'IMG') {
                cardTypeElement = cardTypeElement.nextElementSibling;
            }

            const cardType = cardTypeElement.textContent.trim();
            selectedCardTypes.push(cardType);
        }
    });
    return selectedCardTypes;
    }

    //******************** Function to filter cards by both lesson types and card types****************//
    function filterCards() 
    {
        const selectedLessonTypes = filterCardsByLessonType();
        const selectedCardTypes = filterCardsByCardType();

        filteredCards = allCards.filter(card => {
            // Check lesson type filter
            const lessonMatch = selectedLessonTypes.length === 0 || (card.lesson && card.lesson.some(lesson => selectedLessonTypes.includes(lesson)));
            
            // Check card type filter
            const cardTypeMatch = selectedCardTypes.length === 0 || (card.type && card.type.some(type => selectedCardTypes.includes(type)));

            // Return true only if both filters match
            return lessonMatch && cardTypeMatch;
        });

        //*************** Reset to page 1, sort this new card list and display the new filtered cards****************//
        pageNumber = 1;

        // Get the current sort option from the dropdown
        const currentSortOption = document.getElementById('Deck_Builder_Body_Search_Filter_Sort_Option').value;

        // Map the sort option value to the corresponding sort attribute
        let sortAttribute;
        switch (currentSortOption) {
            case 'option1':
                sortAttribute = 'Set';
                break;
            case 'option2':
                sortAttribute = 'Card Type';
                break;
            case 'option3':
                sortAttribute = 'Lesson Type';
                break;
            case 'option4':
                sortAttribute = 'Mana Cost';
                break;
            default:
                sortAttribute = 'Set'; // Default sorting by 'Set'
        }

        // Sort the filtered cards based on the current sort attribute
        sortFilteredCards(sortAttribute);
        displayPage(pageNumber, filteredCards, container);
        updatePageNumber(pageNumber);
    }

    //********************* Function to sort filtered cards by a given attribute ****************//
    function sortFilteredCards(sortAttribute) {
        filteredCards.sort((a, b) => {
            switch (sortAttribute) {
                case 'Set':
                    return (a.setName || '').localeCompare(b.setName || '');
                case 'Card Type':
                    // Map "Card Type" to the actual `type` property in the card
                    const typeA = Array.isArray(a.type) && a.type[0] ? a.type[0] : '';
                    const typeB = Array.isArray(b.type) && b.type[0] ? b.type[0] : '';
                    return typeA.localeCompare(typeB);
                case 'Lesson Type':
                    const manaA = a.lesson && a.lesson[0] ? a.lesson[0] : 'ZZZZ';
                    const manaB = b.lesson && b.lesson[0] ? b.lesson[0] : 'ZZZZ';
                    return manaA.localeCompare(manaB);
                case 'Mana Cost':
                    const costA = a.cost ? parseInt(a.cost, 10) : Number.MAX_VALUE;
                    const costB = b.cost ? parseInt(b.cost, 10) : Number.MAX_VALUE;
                    return costA - costB;
                default:
                    console.log(`Unexpected sortAttribute: ${sortAttribute}`);
                    return 0; // Default case for unexpected attributes
            }
        });

    // After sorting, reset to page 1 and re-display the sorted cards
    pageNumber = 1;
    displayPage(pageNumber, filteredCards, container);
    updatePageNumber(pageNumber);
    }

//*************************************************************************************************************************************//
//********************************************************* Creation Functions ******************************************************//
//*************************************************************************************************************************************//

    //********************* Update the createCardButton function to include hover ****************//
    function createCardButton(card, container) {
        const button = document.createElement("button");
        button.classList.add("Display_Card_Button");
    
        // Set card properties as data attributes for background storage
        button.setAttribute('data-card-name', card.name);       // Store card name
        button.setAttribute('data-card-type', card.type);       // Store card type
        button.setAttribute('data-mana-cost', card.cost || ''); // Store mana cost (if applicable)
        button.setAttribute('data-mana-type', card.lesson || ''); // Store mana type (if applicable)
        button.setAttribute('data-img-src', card.imgSrc);       // Store image source

        const img = document.createElement("img");
        img.src = `./cardimages/${card.imgSrc.replace(/[_-]/, '')}`; // Set image source
        button.appendChild(img);

         // Create the top-right box with background image
        const topRightBox = document.createElement("div");
        topRightBox.classList.add("top-right-box");

        // Set the background image using CSS
        topRightBox.style.backgroundImage = `url('./Images/Icons/Infobutton.png')`;
        topRightBox.style.backgroundSize = "contain"; // Ensure the image fits within the box
        topRightBox.style.backgroundRepeat = "no-repeat";
        topRightBox.style.backgroundPosition = "center";

        // Add hover behavior to the top-right box
        handleTopRightHover(topRightBox, card.imgSrc, card.horizontal || false);

        button.appendChild(topRightBox);
    
        //Add in the Button
        container.appendChild(button);
    
        // Event listener for adding card to deck
        button.addEventListener('click', function() {
            handleCardClick(card);
        });
    
        // Hover effect for larger image preview
        //handleCardHover(button, card.imgSrc, card.horizontal);
    }
    
    // **************************Function to create a new card type element and insert in deck*******************************//
    function createCardTypeElement(card, deckList) {
        let cardTypeElement = document.createElement('div');
        cardTypeElement.classList.add('deck-card-type');
        cardTypeElement.dataset.type = card.type;
    
        // Create the heading with the count span
        const typeHeading = document.createElement('h3');
    
        // Create the type name text and append it
        const typeNameText = document.createTextNode(`${card.type} `); // Include the space here
        typeHeading.appendChild(typeNameText);
    
        // Add a span to show the count
        const countSpan = document.createElement('span');
        countSpan.classList.add('type-count');
        countSpan.textContent = '(0)'; // Initial count
        typeHeading.appendChild(countSpan);
    
        cardTypeElement.appendChild(typeHeading);
        insertCardTypeElementInOrder(deckList, cardTypeElement, card.type);
    
        return cardTypeElement;
    }
    
    //********************* Helper Function to create a new card element****************//
    function createCardElement(card) {
        let cardElement = document.createElement('div');
        cardElement.classList.add('deck-card');
        cardElement.dataset.name = card.name;
        cardElement.dataset.manaCost = card.cost || '';
        cardElement.dataset.manaType = card.lesson || '';
    
        // Create and append card count
        const cardCountElement = document.createElement('span');
        cardCountElement.classList.add('card-count');
        cardCountElement.textContent = '1';
    
        // Create and append card name
        const cardNameElement = document.createElement('span');
        cardNameElement.classList.add('card-name');
        cardNameElement.textContent = card.name;

        // Append other elements
        cardElement.appendChild(cardCountElement);
        cardElement.appendChild(cardNameElement);
    
        // Append mana cost and lesson type image if present
        if (card.lesson && card.cost) {
            const costElement = document.createElement('span');
            costElement.classList.add('card-cost');
    
            const imageElement = document.createElement('img');
            imageElement.classList.add('lesson-type-icon');
    
            switch (cardElement.dataset.manaType) {
                case "Care of Magical Creatures":
                    costElement.style.color = "rgb(132,97,60)";
                    costElement.textContent = card.cost;
                    imageElement.src = "Images/Icons/care-of-magical-creatures.svg";
                    break;
                case "Charms":
                    costElement.style.color = "rgb(0,108,173)";
                    costElement.textContent = card.cost;
                    imageElement.src = "Images/Icons/charms.svg";
                    break;
                case "Quidditch":
                    costElement.style.color = "rgb(226,172,47)";
                    costElement.textContent = card.cost;
                    imageElement.src = "Images/Icons/quidditch.svg";
                    break;
                case "Potions":
                    costElement.style.color = "rgb(0,167,96)";
                    costElement.textContent = card.cost;
                    imageElement.src = "Images/Icons/potion.svg";
                    break;
                case "Transfiguration":
                    costElement.style.color = "rgb(198,62,80)";
                    costElement.textContent = card.cost;
                    imageElement.src = "Images/Icons/transfiguration.svg";
                    break;
                default:
                    console.log('Unknown lesson type:', cardElement.dataset.manaType);
                    break;
            }
    
            // Append the cost and image if they were set
            if (costElement.textContent) {
                cardElement.appendChild(costElement);
            }
            if (imageElement.src) {
                cardElement.appendChild(imageElement);
            }
        }

        // Add hover functionality with horizontal check
        // const isHorizontal = card.horizontal || false; // Check if the card is horizontal
        // setupCardHover(cardElement, card.imgSrc, isHorizontal);
    
        return cardElement;
    }
    
    // Function to create a new starter card element
    function createStarterElement(card) 
    {
        // Create the main card element
        let starterElement = document.createElement('div');
        starterElement.classList.add('starter-card'); // Differentiate starter with a new class
        starterElement.dataset.name = card.name; // Store card name in a data attribute

        // Create a span for the card's name
        const cardNameElement = document.createElement('span');
        cardNameElement.classList.add('card-name');
        cardNameElement.textContent = card.name;

        // Create an element for the card's power cost (if applicable)
        const cardPowerCostElement = document.createElement('span');
        cardPowerCostElement.classList.add('card-power-cost');
        cardPowerCostElement.textContent = card.powerCost || '';

        // Create an image element for the lesson type
        const cardLessonImageElement = document.createElement('img');
        cardLessonImageElement.classList.add('card-lesson-img');
        cardLessonImageElement.src = card.lessonType && lessonTypeImages[card.lessonType] ? lessonTypeImages[card.lessonType] : '';

        // Create an image element for the set symbol
        const cardSetSymbolElement = document.createElement('img');
        cardSetSymbolElement.classList.add('card-set-symbol');
        cardSetSymbolElement.src = card.set && setImages[card.set] ? setImages[card.set] : '';

        // Append the elements to the starter card element
        starterElement.appendChild(cardNameElement);
        starterElement.appendChild(cardPowerCostElement);
        starterElement.appendChild(cardLessonImageElement);
        starterElement.appendChild(cardSetSymbolElement);

        return starterElement;
    }

//*************************************************************************************************************************************//
//********************************************************* Clicking Functions ******************************************************//
//*************************************************************************************************************************************//

    //********************* Display Card Clicking Funtion****************//
   // Function to handle normal card click or starter card click
   function handleCardClick(card) {
        // Step 1: Check if we are selecting a starter
        if (lookingForStarter === 1) {
            const starterElementHolder = document.getElementById('Starter_Element_Holder');

            // Prevent adding more than one starter
            if (starterElementHolder.querySelector('.starter-card')) {
                console.log("A starter has already been selected.");
                return;
            }

            // Add the starter to the deck
            addStarterToDeck(card);
            return;
        }

        // Step 2: Determine the current deck
        const isMainboard = MainSide === 0;

        // Step 3: Check if the deck is full
        const starterSelected = document.querySelector('#Starter_Element_Holder .starter-card') !== null;
        if (isMainboard && isMainboardFull(starterSelected)) {
            console.log("Cannot add more cards to the main deck. Limit reached.");
            return;
        }
        if (!isMainboard && isSideboardFull()) {
            console.log("Cannot add more cards to the sideboard. Limit reached.");
            return;
        }

        // Step 4(a): Check if the card is a basic lesson
        if (!isBasicLesson(card)) {
            // Step 4(b): Check if the card has 4 or more copies combined in both decks
            const totalCopies = countCardCopies(card.name);
            if (totalCopies >= 4) {
                console.log(`Cannot add more than 4 copies of ${card.name}.`);
                return;
            }
        }

        // Step 5: Add the card to the appropriate deck
        addCardToDeck(card);
    }

    // Function to get the appropriate container based on MainSide (0 = Main Deck, 1 = Sideboard)
    function getDeckContainer() {
        return MainSide === 0 
            ? document.getElementById("Deck_Builder_Deck_List_Frame_Body_Cards")
            : document.getElementById("Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards");
    }

    // Function to add a card to the deck or sideboard container
    function addCardToDeck(card, container = null) {
        const targetContainer = container || getDeckContainer();
    
        // Ensure there is a container for the card type, or create one
        let cardTypeElement = targetContainer.querySelector(`.deck-card-type[data-type="${card.type}"]`);
        if (!cardTypeElement) {
            cardTypeElement = createCardTypeElement(card, targetContainer);
        }
    
        // Check if the card already exists in this container
        let cardElement = cardTypeElement.querySelector(`.deck-card[data-name="${card.name}"]`);
        let cardCount = cardElement ? parseInt(cardElement.querySelector('.card-count').textContent) : 0;
    
        // Handle lesson and non-lesson cards: only limit non-lesson cards to 4
        if (card.type && (card.type.includes('Lesson') || cardCount < 4)) {
            if (!cardElement) {
                // Create a new card element and append it
                cardElement = createCardElement(card);
                cardTypeElement.appendChild(cardElement);
            } else {
                // Increment count if the card already exists
                incrementCardCount(cardElement);
            }
    
            // Update the type count
            updateTypeCount(cardTypeElement);
    
            // Only add an event listener once
            if (!cardElement.getAttribute('data-listener-added')) {
                cardElement.addEventListener('click', function () {
                    handleCardRemove(cardElement, cardTypeElement);
                });
                cardElement.setAttribute('data-listener-added', 'true');
            }
    
            // Update the deck card count
            const deckCardCountElement = MainSide === 0
                ? document.getElementById('Deck_Card_Count')
                : document.getElementById('Side_Deck_Card_Count');
    
            let [currentCount, maxCount] = deckCardCountElement.textContent.split('/').map(Number);
            if (currentCount < maxCount) {
                currentCount += 1;
                deckCardCountElement.textContent = `${currentCount}/${maxCount}`;
            }
        } else {
            console.log(`Cannot add more than 4 copies of ${card.name}`);
        }
    }
    
    
    // Function to add the selected card to the Starter section
    function addStarterToDeck(card) {
        // Get the Starter div
        const starterDiv = document.getElementById('Starter_Element_Holder');
    
        // Add the selected card to the Starter div as a card element
        starterDiv.appendChild(createStarterElement(card)); // Assuming createStarterElement builds the card HTML
    
        // Reset the lookingForStarter variable
        lookingForStarter = 0;
    
        // Reset the filter back to the original state (or last used filter)
        filterCards(); // Assuming this resets to the last filtered state
    }

//*************************************************************************************************************************************//
//******************************************************* Helper Functions ************************************************************//
//*************************************************************************************************************************************//

    function countCardCopies(cardName) {
        const mainDeckCards = document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Cards .deck-card');
        const sideBoardCards = document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards .deck-card');

        // Count copies in main and sideboard
        const totalCopies = [...mainDeckCards, ...sideBoardCards].reduce((sum, cardElement) => {
            const name = cardElement.dataset.name;
            const count = parseInt(cardElement.querySelector('.card-count').textContent, 10);
            return name === cardName ? sum + count : sum;
        }, 0);

        return totalCopies;
    }

    function isBasicLesson(card) {
        const basicLessonNames = ['Care of Magical Creatures', 'Charms', 'Quidditch', 'Potions', 'Transfiguration'];
        return card.type.includes('Lesson') && basicLessonNames.includes(card.name);
    }
    
    function isMainboardFull() {
        const deckCardCountElement = document.getElementById('Deck_Card_Count');
        const [currentCount] = deckCardCountElement.textContent.split('/').map(Number);
        return currentCount >= 60; // Limit is now 60
    }
    
    function isSideboardFull() {
        const deckCardCountElement = document.getElementById('Side_Deck_Card_Count');
        const [currentCount] = deckCardCountElement.textContent.split('/').map(Number);
        return currentCount >= 15;
    }

    function sortCardElementsByManaCost(cardTypeElement) {
        const cards = Array.from(cardTypeElement.querySelectorAll('.deck-card'));
    
        // Sort by mana cost (lowest to highest)
        cards.sort((a, b) => {
            const costA = parseInt(a.dataset.manaCost, 10) || 0;
            const costB = parseInt(b.dataset.manaCost, 10) || 0;
            return costA - costB; // Ascending order
        });
    
        // Append the cards in sorted order
        cards.forEach(card => cardTypeElement.appendChild(card));
    }

    function setupPageNumberInput() {
        const pageNumberInput = document.getElementById('Page_Number_Input');
    
        pageNumberInput.addEventListener('change', () => {
            const enteredPage = parseInt(pageNumberInput.value, 10);
    
            // Validate the entered page number
            if (!isNaN(enteredPage) && enteredPage >= 1 && enteredPage <= totalPages) {
                pageNumber = enteredPage; // Update global pageNumber
                displayPage(pageNumber, filteredCards, container); // Display the selected page
            } else {
                // Reset input value to the current page if invalid
                pageNumberInput.value = pageNumber;
                alert(`Please enter a valid page number (1 - ${totalPages}).`);
            }
        });
    }

    
    // ************************************Function to increment card count*********************************//
    function incrementCardCount(cardElement) {
        const cardCountElement = cardElement.querySelector('.card-count');
        cardCountElement.textContent = parseInt(cardCountElement.textContent) + 1;
    }

    // Function to decrement card count
    function decrementCardCount(cardElement) 
    {
    const cardCountElement = cardElement.querySelector('.card-count');
    const currentCount = parseInt(cardCountElement.textContent);

    // Decrement the card count if it's greater than 0
    if (currentCount > 0) {
        cardCountElement.textContent = currentCount - 1;
    }
    }

    // ***************Function to insert card type in alphabetical order****************//
    function insertCardTypeElementInOrder(deckList, cardTypeElement, cardType) 
    {
        let inserted = false;
        const existingTypes = Array.from(deckList.querySelectorAll('.deck-card-type'));

        for (let i = 0; i < existingTypes.length; i++) {
            if (existingTypes[i].dataset.type.localeCompare(cardType) > 0) {
                deckList.insertBefore(cardTypeElement, existingTypes[i]);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            deckList.appendChild(cardTypeElement);
        }
    }

    // ***************Function to update card type count****************//
    function updateTypeCount(cardTypeElement) {
        const typeHeading = cardTypeElement.querySelector('h3');
        const countSpan = cardTypeElement.querySelector('.type-count');
        if (typeHeading && countSpan) {
            // Remove all child nodes of `typeHeading` first
            typeHeading.textContent = ''; // Clear existing content
    
            // Add the type name with a space and re-append the count
            const typeNameText = document.createTextNode(`${cardTypeElement.dataset.type} `);
            typeHeading.appendChild(typeNameText);
            const totalCount = Array.from(cardTypeElement.querySelectorAll('.deck-card .card-count'))
                .reduce((sum, countElement) => sum + parseInt(countElement.textContent), 0);
            countSpan.textContent = `(${totalCount})`;
            typeHeading.appendChild(countSpan);
        }
    }
    
    //********************* Function to update the page number display****************//
    function updatePageNumber(pageNumber) {
        const pageNumberInput = document.getElementById('Page_Number_Input');
        const totalPagesDisplay = document.getElementById('Total_Pages');
        totalPages = Math.ceil(filteredCards.length / 8); // Calculate total pages dynamically
    
        // Update the input field and total pages
        pageNumberInput.value = pageNumber;
        totalPagesDisplay.textContent = totalPages;
    
        // Optional: Add a tooltip for the editable input
        pageNumberInput.title = `Enter a page number (1 - ${totalPages})`;
    }
    


    // ********************* Function to handle card hover for showing large image in the center of the page, with rotation for sideways cards ****************//
    function handleTopRightHover(cardElement, cardImageSrc, isHorizontal) {
        const largeCardPreview = document.getElementById('largeCardPreview');
        const previewImage = largeCardPreview.querySelector('img');
    
        // On mouse enter, show the large card preview
        cardElement.addEventListener('mouseenter', function () {
            previewImage.src = `./cardimages/${cardImageSrc}`; // Set the large image source
            largeCardPreview.style.display = 'block'; // Show the preview
    
            // Rotate the image if the card is horizontal (sideways)
            if (isHorizontal) {
                previewImage.style.transform = 'rotate(90deg)'; // Rotate the image by 90 degrees
            } else {
                previewImage.style.transform = ''; // Reset rotation if the card is not sideways
            }
    
            // Position the preview relative to the card
            const cardRect = cardElement.getBoundingClientRect();
            largeCardPreview.style.left = `${cardRect.right + 10}px`; // Position to the right of the card
            largeCardPreview.style.top = `${cardRect.top}px`; // Align with the top of the card
        });
    
        // On mouse leave, hide the large card preview
        cardElement.addEventListener('mouseleave', function () {
            largeCardPreview.style.display = 'none'; // Hide the preview
            previewImage.style.transform = ''; // Reset the transform (no rotation)
        });
    }
    
    function handleCardRemove(cardElement, cardTypeElement) {
        const cardCountElement = cardElement.querySelector('.card-count');
        let cardCount = parseInt(cardCountElement.textContent);
    
        // If there is more than one card, decrement the count
        if (cardCount > 1) {
            decrementCardCount(cardElement);
        } else {
            // If there is only one card, remove the card element
            cardTypeElement.removeChild(cardElement);
    
            // If the card type container is empty after removing the card, remove the type container
            if (cardTypeElement.querySelectorAll('.deck-card').length === 0) {
                cardTypeElement.parentNode.removeChild(cardTypeElement);
            }
        }
    
        // Determine which counter to update based on MainSide
        const deckCardCountElement = MainSide === 0
            ? document.getElementById('Deck_Card_Count')      // Main deck count element
            : document.getElementById('Side_Deck_Card_Count'); // Sideboard count element
    
        // Parse current and maximum counts
        let [currentCount, maxCount] = deckCardCountElement.textContent.split('/').map(Number);
    
        // Decrease the total deck count for the appropriate deck
        if (currentCount > 0) {
            currentCount -= 1;
            deckCardCountElement.textContent = `${currentCount}/${maxCount}`;
        }
    
        // If no more cards are left in the deck, hide the hover preview
        if (currentCount === 0) {
            const hoverPreview = document.getElementById('deck-hover-preview');
            hoverPreview.style.display = 'none'; // Hide the hover image
        }
    }
    
    // Function to filter cards by "Witch" or "Wizard" subTypes and set lookingForStarter to 1
    function filterForStarter() 
    {
        lookingForStarter = 1; // Set global variable to indicate we are looking for a starter card

        // Filter the cards that have "Witch" or "Wizard" in subTypes
        filteredCards = allCards.filter(card => card.subTypes && (card.subTypes.includes('Witch') || card.subTypes.includes('Wizard')));

        // Display the filtered cards
        pageNumber = 1; // Reset to page 1
        displayPage(pageNumber, filteredCards, container);
        updatePageNumber(pageNumber);
    }

    // Function to toggle visibility based on the value of MainSide
    function toggleDeckTitle() {
        const mainDeckTitle = document.getElementById('Maindeck_Title');
        const sideDeckTitle = document.getElementById('Sidedeck_Title');

        if (MainSide === 0) {
            mainDeckTitle.style.display = 'block'; // Show Maindeck Title
            sideDeckTitle.style.display = 'none';  // Hide Sidedeck Title
        } else {
            mainDeckTitle.style.display = 'none';  // Hide Maindeck Title
            sideDeckTitle.style.display = 'block'; // Show Sidedeck Title
        }
    }
    // Function to toggle deck from Mainboad to Sideboard
    function switchDeck() {
        MainSide = MainSide === 0 ? 1 : 0;
        toggleDeckTitle(); // Update visibility based on new MainSide value
    }

    // Function to validate deck before exporting
    function validateDeck() {
        const errors = [];

        // Check if a deck name is provided
        const deckName = document.getElementById('Deck_Name_Input').value.trim();
        if (!deckName) {
            errors.push("Please enter a deck name.");
        }

        // Check if a starter character has been selected
        const starterCard = document.querySelector('#Starter_Element_Holder .starter-card');
        if (!starterCard) {
            errors.push("Each deck must have a starting character.");
        }

        // Check if the main deck has exactly 60 cards
        const deckCardCountElement = document.getElementById('Deck_Card_Count');
        const [currentCount] = deckCardCountElement.textContent.split('/').map(Number);

        if (currentCount !== 60) {
            errors.push("Each deck must have exactly 60 cards.");
        }

        // Display errors if any requirements are not met
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }

        return true; // Return true if all validations pass
    }

    // Function to export the deck list to a .txt file
    function exportDeck() {
        // Validate deck before exporting
        if (!validateDeck()) return; // Exit if validation fails
    
        const deckName = document.getElementById('Deck_Name_Input').value.trim();
    
        // Get the deck list and starter character from the deck list container
        const deckCards = Array.from(document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Cards .deck-card')).map(card => {
            const cardName = card.querySelector('.card-name').textContent;
            const cardCount = parseInt(card.querySelector('.card-count').textContent);
            return { name: cardName, count: cardCount };
        });
    
        const sideBoardCards = Array.from(document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards .deck-card')).map(card => {
            const cardName = card.querySelector('.card-name').textContent;
            const cardCount = parseInt(card.querySelector('.card-count').textContent);
            return { name: cardName, count: cardCount };
        });
    
        const starterCard = document.querySelector('#Starter_Element_Holder .starter-card');
        let starterName = null;
    
        if (starterCard) {
            starterName = starterCard.querySelector('.card-name')?.textContent || null;
    
        }
    
        // Prepare the content for the .txt file
        let fileContent = `//deck-1\n`;
    
        // Add the main deck cards to the file content
        deckCards.forEach(card => {
            fileContent += `${card.count} ${card.name}\n`;
        });
    
        // Add the sideboard section
        if (sideBoardCards.length > 0) {
            fileContent += `\n//sideboard-1\n`;
            sideBoardCards.forEach(card => {
                fileContent += `${card.count} ${card.name}\n`;
            });
        }
    
        // Add the starter character to the file content
        if (starterName) {
            fileContent += `\n//play-1\n1 ${starterName}\n`;
        } else {
            console.warn("No starter card found.");
        }
    
        // Create a .txt file and download it
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${deckName}.txt`;
        link.click();
    }

    function setupCardHover(cardElement, cardImageSrc, isHorizontal) {
        const hoverPreview = document.getElementById('deck-hover-preview');
        const hoverImage = hoverPreview.querySelector('img');
    
        cardElement.addEventListener('mouseenter', () => {
            if (cardImageSrc) {
                hoverImage.src = `./cardimages/${cardImageSrc}`;
                hoverPreview.style.display = 'block';
    
                // Handle scaling and rotation
                if (isHorizontal) {
                    hoverImage.style.transform = 'rotate(90deg) scale(1.5)';
                } else {
                    hoverImage.style.transform = 'scale(1.5)';
                }
            }
        });
    
        cardElement.addEventListener('mouseleave', () => {
            hoverPreview.style.display = 'none'; // Hide the preview on mouse leave
            hoverImage.src = ''; // Clear the image source
            hoverImage.style.transform = ''; // Reset scaling and rotation
        });
    }
    
//*************************************************************************************************************************************//
//*********************************************************** Event Listener Setup ****************************************************//
//*************************************************************************************************************************************//

    //****************************** */ Function to set up event listeners for page navigation****************//
    function setupPageNavigation() {
        document.getElementById('Next_Page_Button').addEventListener('click', function() {
            totalPages = Math.ceil(filteredCards.length / 8);
            if (pageNumber < totalPages) {
                pageNumber++;
                displayPage(pageNumber, filteredCards, container);
                updatePageNumber(pageNumber);
            } else {
                console.log("You are at the last page");
            }
        });

        document.getElementById('Previous_Page_Button').addEventListener('click', function() {
            if (pageNumber > 1) {
                pageNumber--;
                displayPage(pageNumber, filteredCards, container);
                updatePageNumber(pageNumber);
            } else {
                console.log("You are at the first page");
            }
        });
    }

   //*************************** Function to set up event listeners for both dropdown checkboxes****************//
   function setupCheckboxListeners() {
    document.querySelectorAll('.dropdown-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // If lookingForStarter is 1, prevent the checkbox interaction and filterCards call
            if (lookingForStarter === 1) {
                checkbox.checked = !checkbox.checked; // Prevent the checkbox from being checked/unchecked
                return; // Exit the function to ensure filterCards is not called
            }
            // Otherwise, allow normal behavior and call filterCards
            filterCards();
        });
    });
    }

    //************************* Event listener for sort option selection in Deck_Builder_Body_Search_Filter_Sort_Option *************************//
    document.getElementById('Deck_Builder_Body_Search_Filter_Sort_Option').addEventListener('change', function() {
        const selectedValue = this.value;

        // Map the selected dropdown option value to the actual attribute
        let sortAttribute;
        switch (selectedValue) {
            case 'option1':
                sortAttribute = 'Set';
                break;
            case 'option2':
                sortAttribute = 'Card Type';
                break;
            case 'option3':
                sortAttribute = 'Lesson Type';
                break;
            case 'option4': // Make sure the fourth option's value is 'option4'
                sortAttribute = 'Mana Cost';
                break;
            default:
                sortAttribute = 'Set'; // Default sorting by 'Set'
        }

        // Call the sort function with the selected attribute
        sortFilteredCards(sortAttribute);
    });

   // Event listener to handle starter selection
    document.getElementById('Deck_Builder_Deck_List_Frame_Body_Starter').addEventListener('click', function() {
    const starterElementHolder = document.getElementById('Starter_Element_Holder');

    // Check if there is already a starter in place
    if (starterElementHolder.firstChild) {
        // If a starter exists, decrement the deck count
        const deckCardCountElement = document.getElementById('Deck_Card_Count');
        let [currentCount, maxCount] = deckCardCountElement.textContent.split('/').map(Number);

        // Remove any objects inside the Starter_Element_Holder
        while (starterElementHolder.firstChild) {
            starterElementHolder.removeChild(starterElementHolder.firstChild); // Clear the starter element holder
        }
    }

    // Set lookingForStarter to 1 and call filterForStarter
    lookingForStarter = 1;
    filterForStarter();
    });

    // Event listener to export the deck list
    document.getElementById('Save_Deck_Button').addEventListener('click', exportDeck);

    document.getElementById('Deck_Builder_Body_Display_Deck_Cards_Button').addEventListener('click', function () {
        // Get the deck cards and starter character
        const mainDeckCards = Array.from(document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Cards .deck-card')).map(card => {
            const cardName = card.querySelector('.card-name').textContent;
            const cardCount = parseInt(card.querySelector('.card-count').textContent);
            return { name: cardName, count: cardCount };
        });
    
        const sideBoardCards = Array.from(document.querySelectorAll('#Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards .deck-card')).map(card => {
            const cardName = card.querySelector('.card-name').textContent;
            const cardCount = parseInt(card.querySelector('.card-count').textContent);
            return { name: cardName, count: cardCount };
        });
    
        // Update selector to target the correct starter card
        const starterCard = document.querySelector('#Starter_Element_Holder .starter-card');
        const starterName = starterCard ? starterCard.querySelector('.card-name').textContent : null;
        console.log("Starter name being passed:", starterName);
    
        // Get the base URL (in this case, the URL of the current page)
        const baseURL = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/';
    
        // Create a new tab
        const newTab = window.open();
    
        // Prepare minimal HTML content with the base tag
        const tabContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Deck Display</title>
                <base href="${baseURL}">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    .section {
                        border: 1px solid #ddd;
                        background-color: #f9f9f9;
                        border-radius: 8px;
                    }
                    .section h2 {
                        margin: 1px;
                        border-bottom: 1px solid #ddd;
                    }
                    .deck-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 10px;
                    }
                    .deck-card img {
                        width: 100%;
                        height: auto;
                    }
                    .starter-card {
                        max-width: 250px;
                        margin: 0;
                        transform: rotate(90deg);
                        transform-origin: center;
                        display: block;
                    }
                    .starter-card img {
                        width: 100%;
                        height: auto;
                    }
                    .starter-row {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 270px;
                    }
                </style>
            </head>
            <body>
                <div id="starter-section" class="section">
                    <h2>Starter</h2>
                    <div class="starter-row"></div>
                </div>
                <div id="main-deck-section" class="section">
                    <h2>Main Deck</h2>
                    <div class="deck-grid" id="main-deck-grid"></div>
                </div>
                <div id="sideboard-section" class="section">
                    <h2>Sideboard</h2>
                    <div class="deck-grid" id="sideboard-grid"></div>
                </div>
                <script type="module">
                    import { cards } from './cards.js';
    
                    const starterName = ${JSON.stringify(starterName)};
                    const mainDeckCards = ${JSON.stringify(mainDeckCards)};
                    const sideBoardCards = ${JSON.stringify(sideBoardCards)};
    
                    function createCardElement(cardName, imgSrc, isStarter = false) {
                        const cardElement = document.createElement('div');
                        cardElement.classList.add(isStarter ? 'starter-card' : 'deck-card'); // Add correct class
                        const img = document.createElement('img');
                        img.src = './cardimages/' + imgSrc;
                        img.alt = cardName;
                        cardElement.appendChild(img);
                        return cardElement;
                    }
    
                    // Display starter card if available
                    if (starterName) {
                        const starterCard = cards.find(c => c.name === starterName);
                        if (starterCard) {
                            const starterRow = document.querySelector('.starter-row');
                            const starterCardElement = createCardElement(starterName, starterCard.imgSrc, true);
                            starterRow.appendChild(starterCardElement);
                        }
                    }
    
                    // Display main deck cards
                    const mainDeckGrid = document.getElementById('main-deck-grid');
                    mainDeckCards.forEach(deckCard => {
                        const cardData = cards.find(c => c.name === deckCard.name);
                        if (cardData) {
                            for (let i = 0; i < deckCard.count; i++) {
                                const cardElement = createCardElement(deckCard.name, cardData.imgSrc);
                                mainDeckGrid.appendChild(cardElement);
                            }
                        }
                    });
    
                    // Display sideboard cards
                    const sideboardGrid = document.getElementById('sideboard-grid');
                    sideBoardCards.forEach(deckCard => {
                        const cardData = cards.find(c => c.name === deckCard.name);
                        if (cardData) {
                            for (let i = 0; i < deckCard.count; i++) {
                                const cardElement = createCardElement(deckCard.name, cardData.imgSrc);
                                sideboardGrid.appendChild(cardElement);
                            }
                        }
                    });
                </script>
            </body>
            </html>
        `;
    
        // Write the content to the new tab
        newTab.document.write(tabContent);
        newTab.document.close();
    });
    
    
    // Event listener to import the deck list and its other functions
    document.getElementById('Import_Deck_Button').addEventListener('click', function () {
        // Create a file input dynamically
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
    
        // Listen for file selection
        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
    
                // Read the file content
                reader.onload = function (event) {
                    const fileContent = event.target.result;
    
                    // Parse and populate the deck
                    parseDeckFile(fileContent);
                };
    
                reader.readAsText(file);
            }
        });
    
        // Trigger the file input
        fileInput.click();
    });
    
    function parseDeckFile(fileContent) {
        // Split the file content into sections
        const sections = fileContent.split('\n\n');
        const mainDeckSection = sections.find(section => section.startsWith('//deck-1'));
        const sideboardSection = sections.find(section => section.startsWith('//sideboard-1'));
        const playSection = sections.find(section => section.startsWith('//play-1'));
    
        // Clear existing deck
        clearDeck();
    
        // Process each section
        if (mainDeckSection) {
            populateDeckSection(mainDeckSection, '#Deck_Builder_Deck_List_Frame_Body_Cards');
        }
    
        if (sideboardSection) {
            // Temporarily switch to the sideboard view in the background
            const originalMainSide = MainSide; // Backup the current MainSide
            MainSide = 1; // Switch to the sideboard
            populateDeckSection(sideboardSection, '#Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards');
            MainSide = originalMainSide; // Restore the original MainSide
        }
    
        if (playSection) {
            populateStarterSection(playSection);
        }
    }
    
    function clearDeck() {
        document.querySelector('#Deck_Builder_Deck_List_Frame_Body_Cards').innerHTML = '';
        document.querySelector('#Deck_Builder_Deck_List_Frame_Body_Sideboard_Cards').innerHTML = '';
        document.querySelector('#Starter_Element_Holder').innerHTML = '';
        document.getElementById('Deck_Card_Count').textContent = '0/60';
        document.getElementById('Side_Deck_Card_Count').textContent = '0/15';
    }
    
    function populateDeckSection(section, containerSelector) {
        const lines = section.split('\n').slice(1); // Skip the section header
        const container = document.querySelector(containerSelector);
    
        lines.forEach(line => {
            const [count, ...nameParts] = line.trim().split(' ');
            const name = nameParts.join(' ');
    
            const card = findCardByName(name);
            if (card) {
                for (let i = 0; i < parseInt(count, 10); i++) {
                    addCardToDeck(card, container);
                }
            }
        });
    }
    
    function populateStarterSection(section) {
        const line = section.split('\n')[1]; // Skip the section header
        const [count, ...nameParts] = line.trim().split(' ');
        const name = nameParts.join(' ');
    
        const card = findCardByName(name);
        if (card) {
            addStarterToDeck(card);
        }
    }
    
    function findCardByName(name) {
        // Match the card by name from the cards list
        return cards.find(card => card.name === name);
    }
    // Add a listener to the search bar for live search functionality
    function setupSearchBarListener() {
        const searchBar = document.getElementById('TextSearchBar');

        searchBar.addEventListener('input', function () {
            const searchText = searchBar.value.trim().toLowerCase(); // Get the search text and make it lowercase

            if (searchText === '') {
                // If the search bar is empty, rerun the filterCards function
                if (lookingForStarter === 1) {
                    filterForStarter(); // Reapply starter-specific filtering
                } else {
                    filterCards(); // Reapply normal filtering
                }
            } else {
                // Filter cards based on the search text
                if (lookingForStarter === 1) {
                    // Only search for "Witch" or "Wizard" subtypes when looking for a starter
                    filteredCards = allCards.filter(card =>
                        (card.subTypes && (card.subTypes.includes('Witch') || card.subTypes.includes('Wizard'))) &&
                        card.name.toLowerCase().includes(searchText) // Check if the card name includes the search text
                    );
                } else {
                    // Regular search across all cards
                    filteredCards = allCards.filter(card =>
                        card.name.toLowerCase().includes(searchText) // Check if the card name includes the search text
                    );
                }

                // Reset to the first page and display the filtered cards
                pageNumber = 1;
                displayPage(pageNumber, filteredCards, container);
                updatePageNumber(pageNumber);
            }
        });
    }


//*************************************************************************************************************************************//
//****************************************************Load Content*********************************************************************//
//*************************************************************************************************************************************//

    document.addEventListener('DOMContentLoaded', function() 
    {
        allCards = [...cards]; // Copying all cards directly
        filteredCards = [...cards]; // Initially, all cards are displayed
        pageNumber = 1;
        container = document.getElementById("Deck_Builder_Body_Card_Library_Display");

        //********************************* Initial Setup ********************************//

        // Load the first page of cards initially
        displayPage(pageNumber, filteredCards, container);

        // Update the page number display (XX/YYY)
        updatePageNumber(pageNumber);
        
        setupPageNavigation();
        setupCheckboxListeners();
        setupSearchBarListener(); // Add this to set up the search bar listener

        setupPageNumberInput();


        // Function to toggle visibility based on the value of MainSide
        function toggleDeckTitle() {
            const mainDeckTitle = document.getElementById('Maindeck_Title');
            const sideDeckTitle = document.getElementById('Sidedeck_Title');
            const mainDeckContainer = document.getElementById('Deck_Builder_Deck_List_Frame_Body_Maindeck');
            const sideBoardContainer = document.getElementById('Deck_Builder_Deck_List_Frame_Body_Sideboard');
        
            if (MainSide === 0) {
                mainDeckTitle.style.display = 'block';
                sideDeckTitle.style.display = 'none';
                
                mainDeckContainer.style.display = 'block'; // Show main deck container
                mainDeckContainer.style.width = '100%';    // Full width when visible
                
                sideBoardContainer.style.display = 'none'; // Hide sideboard container
                sideBoardContainer.style.width = '0';      // Zero width when hidden
            } else {
                mainDeckTitle.style.display = 'none';
                sideDeckTitle.style.display = 'block';
                
                mainDeckContainer.style.display = 'none';  // Hide main deck container
                mainDeckContainer.style.width = '0';       // Zero width when hidden
                
                sideBoardContainer.style.display = 'block'; // Show sideboard container
                sideBoardContainer.style.width = '100%';    // Full width when visible
            }
        }
        

        // Call toggleDeckTitle initially to set the correct visibility
        toggleDeckTitle();

        // Function to change MainSide and update visibility
        function switchDeck() {
            MainSide = MainSide === 0 ? 1 : 0;
            toggleDeckTitle(); // Update visibility based on new MainSide value
        }

        // Event listeners to switch between decks
        document.getElementById('Maindeck_Button').addEventListener('click', switchDeck);
        document.getElementById('SideDeck_Button').addEventListener('click', switchDeck);

        
    });

