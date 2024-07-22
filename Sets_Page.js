// Existing search functionality
const searchInput = document.getElementById('search_input');
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const StringValue = searchInput.value;
        
        localStorage.setItem('SearchString', StringValue);
        
        const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
        
        // Redirect to the new URL
        window.location.href = url;
    }
});

// New functionality for clickable set rows
const setRows = document.querySelectorAll('.set-row');

setRows.forEach(row => {
    row.addEventListener('click', function() {
        const setName = row.getAttribute('data-set-name');
        const searchQuery = `set:"${setName}"`;
        
        localStorage.setItem('SearchString', searchQuery);
        
        const url = `Search_Display.html?search=${encodeURIComponent(searchQuery)}`;
        
        // Redirect to the new URL
        window.location.href = url;
    });
});
