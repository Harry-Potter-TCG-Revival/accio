// Search Steps
//1. Get the search button and add a Listener
//2. Get a string for all the components
//3. 

const searchName = document.getElementById('NameInput');
const searchText = document.getElementById('TextInput');
const searchType = document.getElementById('Card_Type_Dropdown');
const searchKeywords = document.getElementById('KeywordsInput');
const searchCOMC = document.getElementById('COMCCheckBox');
const searchCharms = document.getElementById('CharmsCheckBox');
const searchPotions = document.getElementById('PotionsCheckBox');
const searchQuidditch = document.getElementById('QuidCheckBox');
const searchTransfiguration = document.getElementById('TranCheckBox');
const searchPower = document.getElementById('PPCInput');
const searchStats = document.getElementById('StatsInput');
const searchSet = document.getElementById('Card_Sets_Dropdown');
const searchCommon = document.getElementById('CommonCheckBox');
const searchUncommon = document.getElementById('UncommonCheckBox');
const searchRare = document.getElementById('RareCheckBox');
const searchPremium = document.getElementById('PremiumCheckBox');
const searchFlavour = document.getElementById('FlavourInput');
const searchArtist = document.getElementById('ArtistInput');
const searchNumber = document.getElementById('NumberInput');
var Advanced_Search_Type_Field = document.getElementById('Advanced_Search_Type_Field');

const button = document.getElementById('Advanced_Search_Button');
button.addEventListener('click',function()
{
    event.preventDefault();

        // Initialize an empty string to store the result
        let formDataString = '';

        // Function to add an input's name and value to the result string if value is not empty or checkbox is checked
        function addToFormDataString(inputElement) {
        if (inputElement.type === 'checkbox') 
        {
            if (inputElement.checked) 
            {
                // Add the checkbox name and 'checked' status
                formDataString += `${inputElement.id}: checked\n`;
            }
                // If not checked, do nothing
        } 
        else if (inputElement.tagName.toLowerCase() === 'select') 
        {
            // For select dropdowns, check if an option is selected
            if (inputElement.selectedIndex >= 0) 
            {
                const selectedOption = inputElement.options[inputElement.selectedIndex];
                if (selectedOption.value.trim() !== '') 
                { // Check if selected value is not empty
                    formDataString += `${inputElement.id}: ${selectedOption.text}\n`;
                }
            }
        // If no option selected, do nothing
        } 
        else 
        {
      // For other input types (assuming text inputs here)
      const value = inputElement.value.trim(); // Trim to remove leading and trailing spaces
  
            if (value !== '') 
            {
                formDataString += `${inputElement.id}: ${value}\n`;
            }
        }
  }
        // Add each input's name and value to the formDataString
        addToFormDataString(searchName);
        addToFormDataString(searchText);
        addToFormDataString(searchType);
        addToFormDataString(searchKeywords);
        addToFormDataString(searchCOMC);
        addToFormDataString(searchCharms);
        addToFormDataString(searchPotions);
        addToFormDataString(searchQuidditch);
        addToFormDataString(searchTransfiguration);
        addToFormDataString(searchPower);
        addToFormDataString(searchStats);
        addToFormDataString(searchSet);
        addToFormDataString(searchCommon);
        addToFormDataString(searchUncommon);
        addToFormDataString(searchRare);
        addToFormDataString(searchPremium);
        addToFormDataString(searchFlavour);
        addToFormDataString(searchArtist);
        addToFormDataString(searchNumber);


    StringValue = formDataString;

    localStorage.setItem('SearchString', StringValue)

    console.log('Search String:', localStorage.getItem('SearchString'));


    if (StringValue !== '') 
    {
        const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
        // Redirect to the new URL  
        window.location.href = url;
    }
})


//-----------------------------------------------------------------------------------------
//--------------------------------Code for the type dropdown list--------------------------
//-----------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    var Card_Type_Dropdown = document.getElementById('Card_Type_Dropdown');
    Card_Type_Dropdown.addEventListener('change', function() {
    var selectedOption = Card_Type_Dropdown.options[Card_Type_Dropdown.selectedIndex];
        
        // Check if the selected option is not the blank option
        if (selectedOption.value !== "") 
            {
             // Create a new div element to hold the selected option text
             var selectedOptionText = document.createTextNode(selectedOption.text);
             var selectedOptionDiv = document.createElement('div');
             selectedOptionDiv.className = 'Card_Type_Selected_Div';
             selectedOptionDiv.appendChild(selectedOptionText);

            // Creatue a delete button
             var deleteButton = document.createElement('button');
             deleteButton.textContent = 'x';
             deleteButton.className = 'Card_Type_Selected_Div_Cross'
             deleteButton.addEventListener('click', function() 
                {
                    // Store information about the deleted element (example: text content and value)
                    var deletedOptionText = selectedOptionDiv.textContent;
                    var deletedOptionValue = selectedOptionDiv.getAttribute('data-value'); // Adjust this based on how you set the value

                    // Create a new option element
                    var newOption = document.createElement('option');
                    var cleanText = deletedOptionText.slice(0, -1); // Remove the last character from the text content
                    newOption.textContent = cleanText;    // Set the option text
                    newOption.value = deletedOptionValue; // Assign the value if applicable

                    var Card_Type_Options = Card_Type_Dropdown.options;
                    var insertIndex = 0;
                    for (var i = 0; i < Card_Type_Options.length; i++) {
                        if (deletedOptionText < Card_Type_Options[i].textContent) {
                            insertIndex = i;
                            break;
                        }
                    }
                    // Insert the new option at the determined index
                    Card_Type_Dropdown.insertBefore(newOption, Card_Type_Options[insertIndex]);
                    // Remove the selected option
                    selectedOptionDiv.remove();
                });
             selectedOptionDiv.appendChild(deleteButton);

             // Append the div to below the dropdown menu
             Advanced_Search_Type_Field.appendChild(selectedOptionDiv);

            // Remove the selected option
            Card_Type_Dropdown.removeChild(selectedOption);

            // Create a new blank option
            var blankOption = document.createElement('option');
            blankOption.className = 'Card_Type_Dropdown_Item';
            blankOption.value = '';
            blankOption.disabled = true;
            blankOption.selected = true;
            blankOption.hidden = true;

            // Insert the blank option at the beginning of the dropdown
            Card_Type_Dropdown.insertBefore(blankOption, Card_Type_Dropdown.firstChild);

            // Ensure the blank option is selected
            Card_Type_Dropdown.selectedIndex = 0;
        }
    });
});


//-----------------------------------------------------------------------------------------
//--------------------------------Code for the Header Search Bar---------------------------
//-----------------------------------------------------------------------------------------


const searchInput = document.getElementById('search_input');
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        console.log("in 1 ")
        event.preventDefault();
        const StringValue = searchInput.value;
        
        localStorage.setItem('SearchString', StringValue);
        
        const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
        
        // Redirect to the new URL
        window.location.href = url;
    }
});
