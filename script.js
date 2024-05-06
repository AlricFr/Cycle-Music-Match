const importBtn = document.querySelector(".button-main"),
    playlists = document.querySelectorAll(".item");


importBtn.addEventListener("click", ()=> {importBtn.classList.toggle("import")});    

    // Select all list items
const listItems = document.querySelectorAll('.item');

// Function to handle list item click
function handleItemClick(event) {
    // Get the clicked list item
    const clickedItem = event.currentTarget;
    // Toggle the 'active' class on the clicked list item
    clickedItem.classList.toggle('active');
}

// Add a click event listener to each list item
listItems.forEach(item => {
    item.addEventListener('click', handleItemClick);
});


// Fetch Spotify Data


// Populate List of Playlists
function populateList(data) {
    const listContainer = document.querySelector('.list-items');
    
    data.items.forEach(item => {
        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add('item');
        
        // Create checkbox and item text elements
        const checkbox = document.createElement('span');
        checkbox.classList.add('checkbox');
        const checkmark = document.createElement('i');
        checkmark.classList.add('fa-solid', 'fa-check');
        checkbox.appendChild(checkmark);
        
        const itemText = document.createElement('span');
        itemText.classList.add('item-text');
        itemText.textContent = item.name; // Set text based on item data
        
        // Append elements to the list item
        listItem.appendChild(checkbox);
        listItem.appendChild(itemText);
        
        // Append list item to the list container
        listContainer.appendChild(listItem);
    });
}
