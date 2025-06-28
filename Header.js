document.addEventListener('DOMContentLoaded', function () {
    const interval = setInterval(() => {
        const searchInput = document.getElementById('search_input');
        if (searchInput) {
            clearInterval(interval); // 🧹 Stop checking once found

            searchInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    console.log("Search triggered.");
                    event.preventDefault();
                    const StringValue = searchInput.value;
                    localStorage.setItem('SearchString', StringValue);
                    window.location.href = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;
                }
            });
        }
    }, 50); // Check every 50ms until header is injected
});
