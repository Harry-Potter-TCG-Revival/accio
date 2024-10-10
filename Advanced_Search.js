document.addEventListener('DOMContentLoaded', function() {
    const types = ["Adventure", "Character", "Creature", "Event", "Item", "Lesson", "Location", "Match", "Spell"];
    const keywords = ["Abraxan", "Beauxbaton", "Beetle", "Crab", "Dustbin", "Durmstrang", "Game", "Ingredient", "Plimpy", "Tebo","Wizard", "Unique", "Slytherin", "Dog", "Money", "Seeker", "Gryffindor", "Witch", "Healing", "Ghost", "Dragon", "Cauldron", "Squid", "Gargoyle", "Bat", "Candy", "Chimaera", "Broom", "Hufflepuff", "Ravenclaw", "Unicorn", "Owl", "Troll", "Cat", "Wand", "Kelpie", "Toad", "Snake", "Bird", "Spider", "Rat", "Deer", "Wolf", "Chaser", "Capybara", "Phoenix", "Plant", "Manticore", "Porcupine", "Password", "Ghoul", "Gnome", "Lion", "Book", "Badger", "Eagle", "Ferret", "Goblin", "Beetle Eyes", "Eel Eyes", "Quintaped", "Boar", "Dark", "Marauder", "Beater", "Character Creature", "Werewolf", "Keeper", "Animagus", "Patronus", "Ministry", "Divination", "Revelation", "Centaur", "Dementor", "Newt", "Hinkypunk", "Hippogriff", "Advanced", "Headmaster", "House-elf", "Pixie", "Clothes", "Rooster", "Armour", "Cockatrice", "Boggart", "Red Cap", "Fairy", "Fox", "Snail", "Hogsmeade"];
    const sets = ["Base", "Quidditch Cup", "Diagon Alley", "Adventures at Hogwarts", "Chamber of Secrets", "Heir of Slytherin", "Prisoner of Azkaban", "Streets of HogsMeade", "Echoes of the Past", "Promotional", "Hogwarts a History", "Goblet of Fire"];

    function setupMultiSelect(inputId, options, multiSelectId, selectedContainerId) {
        const input = document.getElementById(inputId);
        const multiSelect = document.getElementById(multiSelectId);
        const selectedContainer = document.getElementById(selectedContainerId);

        input.addEventListener('input', function() {
            const value = input.value.toLowerCase();
            multiSelect.innerHTML = '';
            options.forEach(option => {
                if (option.toLowerCase().includes(value)) {
                    const item = document.createElement('div');
                    item.classList.add('dropdown-item');
                    item.dataset.value = option;
                    item.textContent = option;
                    multiSelect.appendChild(item);
                }
            });
        });

        multiSelect.addEventListener('click', function(event) {
            const target = event.target;
            if (target.classList.contains('dropdown-item')) {
                const value = target.dataset.value;
                const selectedOption = document.createElement('div');
                selectedOption.classList.add('selected-option');
                selectedOption.dataset.value = value;
                selectedOption.textContent = value;
                const removeButton = document.createElement('button');
                removeButton.textContent = 'x';
                removeButton.addEventListener('click', function() {
                    selectedContainer.removeChild(selectedOption);
                });
                selectedOption.appendChild(removeButton);
                selectedContainer.appendChild(selectedOption);
                input.value = '';
                multiSelect.innerHTML = '';
            }
        });
    }

    setupMultiSelect('TypeInput', types, 'Card_Type_MultiSelect', 'Selected_Options_Type');
    setupMultiSelect('KeywordsInput', keywords, 'Keywords_MultiSelect', 'Selected_Options_Keywords');
    setupMultiSelect('SetsInput', sets, 'Card_Sets_MultiSelect', 'Selected_Options_Sets');

    const searchInput = document.getElementById('search_input');
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const StringValue = searchInput.value.trim().toLowerCase();
            const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
            window.location.href = url;
        }
    });

    const searchButton = document.getElementById('Advanced_Search_Button');
    searchButton.addEventListener('click', function() {
        const nameInput = document.getElementById('NameInput').value.trim();
        const textInput = document.getElementById('TextInput').value.trim();
        const selectedTypes = Array.from(document.querySelectorAll('#Selected_Options_Type .selected-option'))
            .map(el => el.dataset.value);
        const selectedKeywords = Array.from(document.querySelectorAll('#Selected_Options_Keywords .selected-option'))
            .map(el => el.dataset.value);
        const selectedSets = Array.from(document.querySelectorAll('#Selected_Options_Sets .selected-option'))
            .map(el => el.dataset.value);
        const comcCheckbox = document.getElementById('COMCCheckBox').checked;
        const charmsCheckbox = document.getElementById('CharmsCheckBox').checked;
        const potionsCheckbox = document.getElementById('PotionsCheckBox').checked;
        const quidCheckbox = document.getElementById('QuidCheckBox').checked;
        const tranCheckbox = document.getElementById('TranCheckBox').checked;
        const ppcInput = document.getElementById('PPCInput').value.trim();
        const statsInput = document.getElementById('StatsInput').value.trim();
        const commonCheckbox = document.getElementById('CommonCheckBox').checked;
        const uncommonCheckbox = document.getElementById('UncommonCheckBox').checked;
        const rareCheckbox = document.getElementById('RareCheckBox').checked;
        const premiumCheckbox = document.getElementById('PremiumCheckBox').checked;
        const flavorInput = document.getElementById('FlavorInput').value.trim();
        const artistInput = document.getElementById('ArtistInput').value.trim();
        const numberInput = document.getElementById('NumberInput').value.trim();

        function quoteIfNeeded(value) {
            return value.includes(' ') ? `"${value}"` : value;
        }

        let searchQuery = [];

        if (nameInput) searchQuery.push(`name:${quoteIfNeeded(nameInput)}`);
        if (textInput) searchQuery.push(`effect:${quoteIfNeeded(textInput)}`);
        if (selectedTypes.length > 0) searchQuery.push(`type:${selectedTypes.map(quoteIfNeeded).join('|')}`);
        if (selectedKeywords.length > 0) searchQuery.push(`keyword:${selectedKeywords.map(quoteIfNeeded).join('|')}`);
        
        let lessonValues = [];
        if (comcCheckbox) lessonValues.push('Care of Magical Creatures');
        if (charmsCheckbox) lessonValues.push('Charms');
        if (potionsCheckbox) lessonValues.push('Potions');
        if (quidCheckbox) lessonValues.push('Quidditch');
        if (tranCheckbox) lessonValues.push('Transfiguration');
        if (lessonValues.length > 0) searchQuery.push(`l:${lessonValues.map(quoteIfNeeded).join('|')}`);
        
        if (ppcInput) searchQuery.push(`cost:${quoteIfNeeded(ppcInput)}`);
        if (statsInput) searchQuery.push(`stats:${quoteIfNeeded(statsInput)}`);
        if (selectedSets.length > 0) searchQuery.push(`set:${selectedSets.map(quoteIfNeeded).join('|')}`);

        let rarityValues = [];
        if (commonCheckbox) rarityValues.push('Common');
        if (uncommonCheckbox) rarityValues.push('Uncommon');
        if (rareCheckbox) rarityValues.push('Rare');
        if (premiumCheckbox) rarityValues.push('Premium');
        if (rarityValues.length > 0) searchQuery.push(`rarity:${rarityValues.map(quoteIfNeeded).join('|')}`);
        
        if (flavorInput) searchQuery.push(`flavorText:${quoteIfNeeded(flavorInput)}`);
        if (artistInput) searchQuery.push(`artist:${quoteIfNeeded(artistInput)}`);
        if (numberInput) searchQuery.push(`number:${quoteIfNeeded(numberInput)}`);

        const searchString = searchQuery.join(' ');

        console.log('Search Query:', searchString);

        // Store the search string in local storage
        localStorage.setItem('SearchString', searchString);

        // Redirect to the search results page
        const url = `Search_Display.html?search=${encodeURIComponent(searchString)}`;
        window.location.href = url;
    });
});
