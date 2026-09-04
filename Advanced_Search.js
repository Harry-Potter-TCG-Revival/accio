document.addEventListener('DOMContentLoaded', function() {
    const types = ["Adventure", "Character", "Creature", "Event", "Item", "Lesson", "Location", "Match", "Spell"];
    const keywords = ["Abraxan", "Beauxbaton", "Beetle", "Crab", "Dustbin", "Durmstrang", "Game", "Ingredient", "Plimpy", "Tebo","Wizard", "Unique", "Slytherin", "Dog", "Money", "Seeker", "Gryffindor", "Witch", "Healing", "Ghost", "Dragon", "Cauldron", "Squid", "Gargoyle", "Bat", "Candy", "Chimaera", "Broom", "Hufflepuff", "Ravenclaw", "Unicorn", "Owl", "Troll", "Cat", "Wand", "Kelpie", "Toad", "Snake", "Bird", "Spider", "Rat", "Deer", "Wolf", "Chaser", "Capybara", "Phoenix", "Plant", "Manticore", "Porcupine", "Password", "Ghoul", "Gnome", "Lion", "Book", "Badger", "Eagle", "Ferret", "Goblin", "Beetle Eyes", "Eel Eyes", "Quintaped", "Boar", "Dark", "Marauder", "Beater", "Werewolf", "Keeper", "Animagus", "Patronus", "Ministry", "Divination", "Revelation", "Centaur", "Dementor", "Newt", "Hinkypunk", "Hippogriff", "Advanced", "Headmaster", "House-elf", "Pixie", "Clothes", "Rooster", "Armour", "Cockatrice", "Boggart", "Red Cap", "Fairy", "Fox", "Snail", "Hogsmeade", "Merperson", "Sphinx", "Task"];
    const sets = ["Classic", "Revival", "Base", "Quidditch Cup", "Diagon Alley", "Adventures at Hogwarts", "Chamber of Secrets", "Heir of Slytherin", "Prisoner of Azkaban", "Streets of HogsMeade", "Echoes of the Past", "Promotional", "Hogwarts a History", "Goblet of Fire", "Quidditch World Finals", "Triwizard Tournament"];

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

    setupMultiSelect('KeywordsInput', keywords, 'Keywords_MultiSelect', 'Selected_Options_Keywords');

    function setupChecklist(containerId, options, name, idPrefix) {
        const container = document.getElementById(containerId);
        options.forEach((value, index) => {
            const checkboxId = `${idPrefix}-${index}`;
            const option = document.createElement('label');
            option.classList.add('set-checkbox-option');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = checkboxId;
            checkbox.name = name;
            checkbox.value = value;

            option.appendChild(checkbox);
            option.appendChild(document.createTextNode(value));
            container.appendChild(option);
        });
    }

    setupChecklist('Types_Checkboxes', types, 'types', 'TypeCheckBox');
    setupChecklist('Sets_Checkboxes', sets, 'sets', 'SetCheckBox');

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
        const selectedTypes = Array.from(document.querySelectorAll('#Types_Checkboxes input[name="types"]:checked'))
            .map(checkbox => checkbox.value);
        const selectedKeywords = Array.from(document.querySelectorAll('#Selected_Options_Keywords .selected-option'))
            .map(el => el.dataset.value);
        const selectedSets = Array.from(document.querySelectorAll('#Sets_Checkboxes input[name="sets"]:checked'))
            .map(checkbox => checkbox.value);
        const comcCheckbox = document.getElementById('COMCCheckBox').checked;
        const charmsCheckbox = document.getElementById('CharmsCheckBox').checked;
        const potionsCheckbox = document.getElementById('PotionsCheckBox').checked;
        const quidCheckbox = document.getElementById('QuidCheckBox').checked;
        const tranCheckbox = document.getElementById('TranCheckBox').checked;
        const ppcInput = document.getElementById('PPCInput').value.trim();
        const statsInput = document.getElementById('StatsInput').value.trim();
        const lessonCheckbox = document.getElementById('LessonCheckBox').checked;
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

        function buildSearchTerm(prefix, value, inverseCheckboxId) {
            const inversePrefix = document.getElementById(inverseCheckboxId).checked ? '!' : '';
            return `${inversePrefix}${prefix}:${quoteIfNeeded(value)}`;
        }

        function buildGroupedSearchTerms(prefix, values, inverseCheckboxId) {
            const isInverse = document.getElementById(inverseCheckboxId).checked;
            const separator = isInverse ? ' ' : ' | ';
            return values.map(item => buildSearchTerm(prefix, item, inverseCheckboxId)).join(separator);
        }

        let searchQuery = [];

        if (nameInput) searchQuery.push(buildSearchTerm('name', nameInput, 'NameInverse'));
        if (textInput) searchQuery.push(buildSearchTerm('effect', textInput, 'TextInverse'));
        if (selectedTypes.length > 0) searchQuery.push(buildGroupedSearchTerms('type', selectedTypes, 'TypeInverse'));
        if (selectedKeywords.length > 0) searchQuery.push(buildGroupedSearchTerms('keyword', selectedKeywords, 'KeywordsInverse'));

        let lessonValues = [];
        if (comcCheckbox) lessonValues.push('Care of Magical Creatures');
        if (charmsCheckbox) lessonValues.push('Charms');
        if (potionsCheckbox) lessonValues.push('Potions');
        if (quidCheckbox) lessonValues.push('Quidditch');
        if (tranCheckbox) lessonValues.push('Transfiguration');
        if (lessonValues.length > 0) searchQuery.push(buildGroupedSearchTerms('lesson', lessonValues, 'LessonInverse'));

        if (ppcInput) searchQuery.push(buildSearchTerm('cost', ppcInput, 'PPCInverse'));
        if (statsInput) searchQuery.push(buildSearchTerm('stats', statsInput, 'StatsInverse'));
        if (selectedSets.length > 0) searchQuery.push(buildGroupedSearchTerms('set', selectedSets, 'SetsInverse'));

        let rarityValues = [];
        if (lessonCheckbox) rarityValues.push('Lesson');
        if (commonCheckbox) rarityValues.push('Common');
        if (uncommonCheckbox) rarityValues.push('Uncommon');
        if (rareCheckbox) rarityValues.push('Rare');
        if (premiumCheckbox) rarityValues.push('Premium');
        if (rarityValues.length > 0) searchQuery.push(buildGroupedSearchTerms('rarity', rarityValues, 'RarityInverse'));

        if (flavorInput) searchQuery.push(buildSearchTerm('flavorText', flavorInput, 'FlavorInverse'));
        if (artistInput) searchQuery.push(buildSearchTerm('artist', artistInput, 'ArtistInverse'));
        if (numberInput) searchQuery.push(buildSearchTerm('number', numberInput, 'NumberInverse'));

        const searchString = searchQuery.join(' ');

        console.log('Search Query:', searchString);

        // Store the search string in local storage
        localStorage.setItem('SearchString', searchString);

        // Redirect to the search results page
        const url = `Search_Display.html?search=${encodeURIComponent(searchString)}`;
        window.location.href = url;
    });
});
