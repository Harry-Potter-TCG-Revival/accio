const form = document.getElementById('Home_Page_Search_Bar');
const searchString = document.getElementById('search_input');
form.addEventListener('submit',function(){
    event.preventDefault();

    const StringValue = searchString.value;

    localStorage.setItem('SearchString',StringValue)

    const url = `Search_Display.html?search=${encodeURIComponent(StringValue)}`;

    // Redirect to the new URL
    window.location.href = url;

})
