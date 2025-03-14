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