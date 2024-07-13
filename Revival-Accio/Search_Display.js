document.querySelector('.Search_Display_Body_Filters_Create_Card').addEventListener('click', function() {
    // Create a new image element
    var img = document.createElement('img');
    // Set the source of the image (change this to the desired image URL)
    img.src = "Images/41-HOS-MandrakeDraught.png"; // Placeholder image URL
    img.alt = 'Clickable Image'; // Alternative text for the image
    img.dataset.cardnumber = 31;
    img.dataset.setnumber = 11;

    // Step 3: Add a click event listener to the image
    img.addEventListener('click', function() {
    // You can access the custom data attributes like this
    console.log('Card Number:', img.dataset.cardnumber);
    console.log('SetNumber:', img.dataset.setnumber);
    

    var number = img.dataset.setnumber;

    // Navigate to the "Card Display" page with the URL query parameter
    window.location.href = `Card_Display.html?search=${encodeURIComponent(number)}`;
    
    // ?number=' + encodeURIComponent(number);
    });

  
    // Get the container element
    var container = document.querySelector('.Search_Display_Body_Card_Display_Grid');
  
    // Append the new image to the container
    container.appendChild(img);
  });


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


// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'search' parameter
const searchString = urlParams.get('search');

// Log the search string to the console (optional)
console.log('Search String:', searchString);




//*****************************************************************************************************************
//********************************************** Random Card Generator ********************************************
//*****************************************************************************************************************



// Array of names to choose from
const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack', 'Kara', 'Liam', 'Mona', 'Nina', 'Oscar', 'Paul', 'Quincy', 'Rose', 'Steve', 'Tina'];

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random list
function generateRandomList() {
    const listLength = getRandomInt(1, 20); // Random length between 1 and 20
    const randomList = [];

    for (let i = 0; i < listLength; i++) {
        const randomNumber = getRandomInt(1, 200); // Random number between 1 and 200
        const randomName = names[getRandomInt(0, names.length - 1)]; // Random name from the array
        randomList.push({ number: randomNumber, name: randomName });
    }

    return randomList;
}

// Generate the random list and log it to the console
const randomList = generateRandomList();
console.log(randomList);


//*****************************************************************************************************************
//********************************************** Display the Card list ********************************************
//*****************************************************************************************************************

// Function to create and display images
function displayImages(list) {
    var container = document.querySelector('.Search_Display_Body_Card_Display_Grid');
    
    list.forEach(item => {
        // Create a container div for each item
        var img = document.createElement('img');
        
        // Create an image element
        img.src = "Images/41-HOS-MandrakeDraught.png"; // Placeholder image URL
        img.alt = 'Clickable Image'; // Alternative text for the image
        img.dataset.cardnumber = item.number;
        img.dataset.cardname = item.name;
        
        // Add a click event listener to the image
        img.addEventListener('click', function() {
            console.log('Number:', img.dataset.cardnumber);
            console.log('Name:', img.dataset.cardname);
            
            // Navigate to the "Card Display" page with the URL query parameter
            window.location.href = `Card_Display.html?search=${encodeURIComponent(img.dataset.cardnumber)}`;
        });
              
        // Append the new image to the container
        container.appendChild(img);
    });
}


// Call the function to display images
displayImages(randomList);
