// Enhancements for individual recipe pages: Save to Collection with plan gating
(function() {
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Ensure api.js is available
      if (typeof api === 'undefined') return;

      // Grab recipe title from the page
      const titleEl = document.querySelector('h1');
      if (!titleEl) return;
      const recipeTitle = titleEl.textContent.trim();

      // Determine user plan (treat as free if not logged in)
      let userPlan = 'free';
      try {
        const me = await api.getCurrentUser();
        userPlan = me.user.subscription || 'free';
      } catch (e) {
        userPlan = 'free';
      }

      // Find the recipe ID by searching backend using the title
      let recipeId = null;
      try {
        const res = await api.searchRecipes(recipeTitle, { limit: 5 });
        if (res && res.recipes && res.recipes.length > 0) {
          // Find exact match by title
          const exactMatch = res.recipes.find(r => 
            r.title.toLowerCase().trim() === recipeTitle.toLowerCase().trim()
          );
          if (exactMatch) {
            recipeId = exactMatch._id || exactMatch.id;
          } else {
            // Fallback to first result if no exact match
            recipeId = res.recipes[0]._id || res.recipes[0].id;
          }
        }
      } catch (e) {
        console.log('Recipe search failed:', e);
      }

      // Build Save button UI next to existing action buttons
      const actionsRow = document.querySelector('.mt-8.flex.justify-between.items-center');
      if (!actionsRow) return;

      const saveBtn = document.createElement('button');
      saveBtn.id = 'saveToCollectionBtn';
      saveBtn.className = 'ml-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded';
      saveBtn.textContent = 'Save to Collection';

      // Tooltip for free users
      const tooltip = document.createElement('div');
      tooltip.className = 'hidden absolute transform translate-y-10 bg-gray-800 text-white text-xs rounded px-2 py-1';
      tooltip.textContent = 'Upgrade to Standard/Premium to save collections';

      const wrapper = document.createElement('div');
      wrapper.className = 'relative flex items-center';
      wrapper.appendChild(saveBtn);
      wrapper.appendChild(tooltip);

      // Insert next to existing right-aligned button
      actionsRow.appendChild(wrapper);

      // Hover gating for free users
      if (userPlan === 'free') {
        saveBtn.addEventListener('mouseenter', () => {
          tooltip.classList.remove('hidden');
        });
        saveBtn.addEventListener('mouseleave', () => {
          tooltip.classList.add('hidden');
        });
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          alert('This feature requires Standard or Premium plan. Apply a coupon on the Subscriptions page.');
        });
        return;
      }

      // For Standard/Premium users, enable save behavior
      if (!recipeId) {
        // If no id resolved, try to get from URL or use a fallback
        const urlPath = window.location.pathname;
        const recipeSlug = urlPath.split('/').pop().replace('.html', '');
        
        // Try to search with slug as well
        try {
          const slugRes = await api.searchRecipes(recipeSlug.replace('-', ' '), { limit: 1 });
          if (slugRes && slugRes.recipes && slugRes.recipes.length > 0) {
            recipeId = slugRes.recipes[0]._id || slugRes.recipes[0].id;
          }
        } catch (e) {}
        
        if (!recipeId) {
          // If still no id, disable the button gracefully
          saveBtn.disabled = true;
          saveBtn.classList.add('opacity-60', 'cursor-not-allowed');
          saveBtn.title = 'Recipe ID not found - try refreshing the page';
          return;
        }
      }

      saveBtn.addEventListener('click', async function() {
        try {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
          await api.addToFavorites(recipeId);
          saveBtn.textContent = 'Saved';
          saveBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
          saveBtn.classList.add('bg-green-800');
        } catch (err) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save to Collection';
          alert(err.message || 'Failed to save.');
        }
      });
    } catch (e) {
      // No-op on errors to avoid breaking page
    }
  });
})();


