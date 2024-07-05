document.querySelector('.Search_Display_Body_Filters_Create_Card').addEventListener('click', function() {
    // Create a new image element
    var img = document.createElement('img');
    // Set the source of the image (change this to the desired image URL)
    img.src = "Images/41-HOS-MandrakeDraught.png"; // Placeholder image URL
    img.alt = 'New Image'; // Alternative text for the image
  
    // Get the container element
    var container = document.querySelector('.Search_Display_Body_Card_Display_Grid');
  
    // Append the new image to the container
    container.appendChild(img);
  });