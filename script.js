document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------
    // 1. Button Click Alert Logic (e.g., Subscriptions page)
    // ------------------------------------------
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // This is the original logic to confirm a click action
            alert(`You clicked: ${btn.innerText}`);
        });
    });

    // ------------------------------------------
    // 2. Search Suggestion and Direct Navigation Logic
    // ------------------------------------------

    const searchInput = document.getElementById('search-input');
    if (!searchInput) return; // Stop if we're not on a page with the search bar

    const searchForm = searchInput.closest('form');
    let suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg hidden';
    suggestionsContainer.id = 'suggestions-container';
    
    // Append to body and manage its position dynamically for best results
    document.body.appendChild(suggestionsContainer);

    // Simulated Recipe Data and their corresponding static HTML pages
    // In a real application, this data would come from an API/database.
    const recipeMap = {
        // Indian Recipes
        "Butter Chicken": "recipes-indian.html", 
        "Masala Dosa": "recipes-indian.html",
        "Rogan Josh": "recipes-indian.html",
        // Italian Recipes
        "Spaghetti Carbonara": "recipes-italian.html",
        "Margherita Pizza": "recipes-italian.html",
        "Lasagna": "recipes-italian.html",
        // Healthy Recipes
        "Green Salad": "recipes-healthy.html",
        "Fruit Smoothie": "recipes-healthy.html",
        "Grilled Salmon": "recipes-healthy.html",
        // Dessert/Fast Food
        "Cheesecake": "recipes-desserts.html",
        "Ice Cream": "recipes-desserts.html",
        "Cheeseburger": "recipes-fastfood.html"
    };

    const recipes = Object.keys(recipeMap);

    searchInput.addEventListener('input', async function() {
        const query = this.value.toLowerCase().trim();
        suggestionsContainer.innerHTML = ''; // Clear previous suggestions

        if (query.length === 0) {
            suggestionsContainer.classList.add('hidden');
            return;
        }

        // Show loading state
        suggestionsContainer.innerHTML = '<div class="p-3 text-gray-500">Searching...</div>';
        suggestionsContainer.classList.remove('hidden');

        // --- Positioning Logic ---
        const rect = searchForm.getBoundingClientRect();
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.top = `${rect.bottom + window.scrollY + 5}px`; 
        suggestionsContainer.style.left = `${rect.left + window.scrollX}px`;
        suggestionsContainer.style.width = `${rect.width}px`;
        // --- End Positioning Logic ---

        try {
            // Search recipes using the API
            const response = await api.searchRecipes(query, { limit: 5 });
            const searchResults = response.recipes;

            suggestionsContainer.innerHTML = ''; // Clear loading

            if (searchResults.length > 0) {
                searchResults.forEach(recipe => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.className = 'p-3 cursor-pointer hover:bg-green-50 text-gray-700 font-medium border-b border-gray-100';
                    suggestionItem.innerHTML = `
                        <div class="font-semibold">${recipe.title}</div>
                        <div class="text-sm text-gray-500">${recipe.category} • ${recipe.difficulty}</div>
                    `;
                    
                    suggestionItem.addEventListener('click', () => {
                        searchInput.value = recipe.title;
                        suggestionsContainer.classList.add('hidden');
                        // Navigate to search results page with the query
                        window.location.href = `search.html?query=${encodeURIComponent(recipe.title)}`;
                    });

                    suggestionsContainer.appendChild(suggestionItem);
                });
                
                suggestionsContainer.classList.remove('hidden');
            } else {
                suggestionsContainer.innerHTML = '<div class="p-3 text-gray-500">No recipes found</div>';
                suggestionsContainer.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Search error:', error);
            suggestionsContainer.innerHTML = '<div class="p-3 text-red-500">Search failed. Please try again.</div>';
            suggestionsContainer.classList.remove('hidden');
        }
    });

    // Hide suggestions when clicking outside the form or the suggestions box
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
        }
    });
});