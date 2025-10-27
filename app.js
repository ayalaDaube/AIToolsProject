// App: pages + localStorage + SpeechSynthesis
(() => {
    const LS_USERS = 'rv_users_v4';
    const LS_RECIPES = 'rv_recipes_v5';
    const LS_CURRENT = 'rv_currentUser_v3';
  
    const $ = id => document.getElementById(id);
    const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const load = (k, fb) => {
      const s = localStorage.getItem(k);
      return s ? JSON.parse(s) : fb;
    };
    const uid = () => 'id_' + Math.random().toString(36).slice(2, 9);
  
    // Initial demo users + recipes
    function seed() {
      if (!localStorage.getItem(LS_USERS)) {
        const users = [
          {
            username: 'alice',
            password: 'pass123',
            phone: '',
            email: 'alice@example.com',
            settings: { delay: 800, theme: 'light', voiceURI: null, rate: 1 }
          },
          {
            username: 'bob',
            password: 'pass456',
            phone: '',
            email: 'bob@example.com',
            settings: { delay: 600, theme: 'dark', voiceURI: null, rate: 1 }
          }
        ];
        save(LS_USERS, users);
      }
  
      if (!localStorage.getItem(LS_RECIPES)) {
        const recipes = [
          {
            id: uid(),
            title: 'Pasta Aglio e Olio',
            image:
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InBhc3RhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZkNzAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZhNTAwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXN0YSkiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjgwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMDAiIHI9IjYwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn42dIFBhc3RhPC90ZXh0Pjwvc3ZnPg==',
            servings: '2',
            prepTime: '10 mins',
            cookTime: '10 mins',
            ingredients: [
              '200g spaghetti',
              '2 cloves garlic (sliced)',
              '3 tbsp olive oil',
              '1 tsp chili flakes',
              'Parsley, chopped',
              'Salt'
            ],
            directions: [
              'Boil pasta in salted water until al dente.',
              'Warm olive oil and fry garlic until golden.',
              'Add chili flakes briefly, then toss pasta with oil and garlic.',
              'Finish with parsley and serve immediately.'
            ]
          },
          {
            id: uid(),
            title: 'Fluffy Pancakes',
            image:
              'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
            servings: '3',
            prepTime: '5 mins',
            cookTime: '15 mins',
            ingredients: [
              '1 cup flour',
              '1 tbsp sugar',
              '1 tsp baking powder',
              'Pinch of salt',
              '1 egg',
              '1 cup milk',
              'Butter for cooking'
            ],
            directions: [
              'Mix dry ingredients in a bowl.',
              'Whisk egg and milk, combine with dry mix until smooth.',
              'Cook on a buttered skillet until bubbles form, flip, cook until golden.'
            ]
          },
          {
            id: uid(),
            title: 'Classic Caesar Salad',
            image:
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9InNhbGFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGFkNjZkIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNjhkMzkxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzYWxhZCkiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjQiLz48Y2lyY2xlIGN4PSI2NTAiIGN5PSI0NTAiIHI9IjMwIiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjI1IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIzMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5WLIENhZXNhciBTYWxhZDwvdGV4dD48L3N2Zz4=',
            servings: '4',
            prepTime: '15 mins',
            cookTime: '0 mins',
            ingredients: [
              '1 large romaine lettuce head',
              '1/2 cup parmesan cheese, grated',
              '1/4 cup olive oil',
              '2 tbsp lemon juice',
              '2 garlic cloves, minced',
              '1 tsp worcestershire sauce',
              '1/2 cup croutons',
              'Salt and pepper to taste'
            ],
            directions: [
              'Wash and chop romaine lettuce into bite-sized pieces.',
              'In a bowl, whisk together olive oil, lemon juice, garlic, and worcestershire sauce.',
              'Toss lettuce with dressing until well coated.',
              'Add parmesan cheese and croutons, toss gently.',
              'Season with salt and pepper, serve immediately.'
            ]
          },
          {
            id: uid(),
            title: 'Chocolate Chip Cookies',
            image:
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImNvb2tpZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2Q2OTM0YSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2I4NzMzMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY29va2llKSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjIwMCIgcj0iMTUiIGZpbGw9IiM4YjQ1MTMiLz48Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMDAiIHI9IjEyIiBmaWxsPSIjOGI0NTEzIi8+PGNpcmNsZSBjeD0iNDAwIiBjeT0iNDAwIiByPSIxOCIgZmlsbD0iIzhiNDUxMyIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMTAiIGZpbGw9IiM4YjQ1MTMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn42qIENob2NvbGF0ZSBDb29raWVzPC90ZXh0Pjwvc3ZnPg==',
            servings: '24',
            prepTime: '15 mins',
            cookTime: '12 mins',
            ingredients: [
              '2 1/4 cups all-purpose flour',
              '1 tsp baking soda',
              '1 tsp salt',
              '1 cup butter, softened',
              '3/4 cup granulated sugar',
              '3/4 cup brown sugar',
              '2 large eggs',
              '2 tsp vanilla extract',
              '2 cups chocolate chips'
            ],
            directions: [
              'Preheat oven to 375°F. Mix flour, baking soda, and salt in a bowl.',
              'In another bowl, cream butter and both sugars until fluffy.',
              'Beat in eggs and vanilla extract.',
              'Gradually mix in flour mixture, then fold in chocolate chips.',
              'Drop rounded tablespoons onto ungreased baking sheets.',
              'Bake 9-11 minutes until golden brown. Cool on wire rack.'
            ]
          },
          {
            id: uid(),
            title: 'Grilled Chicken Breast',
            image:
              'https://cdn.pixabay.com/photo/2018/03/31/19/29/schnitzel-3279045_1280.jpg',
            servings: '4',
            prepTime: '10 mins',
            cookTime: '20 mins',
            ingredients: [
              '4 boneless chicken breasts',
              '2 tbsp olive oil',
              '1 tsp garlic powder',
              '1 tsp paprika',
              '1 tsp dried oregano',
              '1/2 tsp salt',
              '1/4 tsp black pepper',
              '1 lemon, sliced'
            ],
            directions: [
              'Preheat grill to medium-high heat.',
              'Brush chicken breasts with olive oil.',
              'Mix all spices in a bowl and rub evenly on chicken.',
              'Grill chicken 6-8 minutes per side until internal temperature reaches 165°F.',
              'Let rest for 5 minutes before slicing.',
              'Serve with lemon slices and your favorite sides.'
            ]
          },
          {
            id: uid(),
            title: 'Beef Tacos',
            image:
              'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=800',
            servings: '4',
            prepTime: '15 mins',
            cookTime: '10 mins',
            ingredients: [
              '1 lb ground beef',
              '8 taco shells',
              '1 packet taco seasoning',
              '1 cup shredded lettuce',
              '1 cup diced tomatoes',
              '1 cup shredded cheese',
              '1/2 cup sour cream',
              '1/4 cup diced onions'
            ],
            directions: [
              'Cook ground beef in a large skillet over medium heat until browned.',
              'Drain fat and add taco seasoning with 2/3 cup water.',
              'Simmer for 5 minutes until thickened.',
              'Warm taco shells according to package directions.',
              'Fill shells with beef mixture and desired toppings.',
              'Serve immediately with lime wedges.'
            ]
          },
          {
            id: uid(),
            title: 'Vegetable Stir Fry',
            image:
              'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
            servings: '4',
            prepTime: '20 mins',
            cookTime: '8 mins',
            ingredients: [
              '2 tbsp vegetable oil',
              '1 bell pepper, sliced',
              '1 cup broccoli florets',
              '1 carrot, julienned',
              '1 zucchini, sliced',
              '2 cloves garlic, minced',
              '2 tbsp soy sauce',
              '1 tbsp sesame oil',
              'Cooked rice for serving'
            ],
            directions: [
              'Heat vegetable oil in a large wok or skillet over high heat.',
              'Add garlic and stir-fry for 30 seconds until fragrant.',
              'Add harder vegetables first (carrots, broccoli) and cook 2 minutes.',
              'Add remaining vegetables and stir-fry 3-4 minutes until crisp-tender.',
              'Add soy sauce and sesame oil, toss to combine.',
              'Serve immediately over steamed rice.'
            ]
          },
          {
            id: uid(),
            title: 'Margherita Pizza',
            image:
              'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
            servings: '4',
            prepTime: '20 mins',
            cookTime: '15 mins',
            ingredients: [
              '1 pizza dough ball',
              '1/2 cup pizza sauce',
              '8 oz fresh mozzarella, sliced',
              '2 large tomatoes, sliced',
              '1/4 cup fresh basil leaves',
              '2 tbsp olive oil',
              'Salt and pepper to taste',
              'Flour for dusting'
            ],
            directions: [
              'Preheat oven to 475°F. Roll out pizza dough on floured surface.',
              'Transfer to pizza stone or baking sheet.',
              'Spread pizza sauce evenly, leaving 1-inch border for crust.',
              'Add mozzarella slices and tomato slices.',
              'Drizzle with olive oil and season with salt and pepper.',
              'Bake 12-15 minutes until crust is golden. Top with fresh basil.'
            ]
          }
        ];
        save(LS_RECIPES, recipes);
      }
    }
  
    window.initPage = function (page) {
      seed();
      if (page === 'login') initLogin();
      if (page === 'signin') initSignin();
      if (page === 'settings') initSettings();
      if (page === 'recipes') initRecipes();
      if (page === 'recipe') initRecipeView();
    };
  
    // LOGIN
    function initLogin() {
      const form = $('loginForm');
      const toSign = $('toSign');
      if (toSign) toSign.addEventListener('click', () => (location.href = 'signin.html'));
  
      const params = new URLSearchParams(location.search);
      const pre = params.get('prefill');
      if (pre && $('loginUser')) $('loginUser').value = pre;
  
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const u = $('loginUser').value.trim();
        const p = $('loginPass').value;
        const users = load(LS_USERS, []);
        const found = users.find(x => x.username === u);
        if (!found) {
          alert('User not found — redirecting to Sign Up.');
          location.href = `signin.html?prefill=${encodeURIComponent(u)}`;
          return;
        }
        if (found.password !== p) {
          alert('Invalid password');
          return;
        }
        localStorage.setItem(LS_CURRENT, u);
        location.href = 'settings.html';
      });
    }
  
    // SIGN IN
    function initSignin() {
      const form = $('signForm');
      const toLogin = $('toLogin');
      if (toLogin) toLogin.addEventListener('click', () => (location.href = 'index.html'));
  
      const params = new URLSearchParams(location.search);
      const pre = params.get('prefill');
      if (pre && $('signUser')) $('signUser').value = pre;
  
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const username = $('signUser').value.trim();
        const password = $('signPass').value;
        const phone = $('signPhone').value.trim();
        const email = $('signEmail').value.trim();
        if (!username || !password) return alert('Please fill required fields');
        const users = load(LS_USERS, []);
        if (users.find(u => u.username === username)) return alert('Username exists');
        const newUser = {
          username,
          password,
          phone,
          email,
          settings: { delay: 700, theme: 'light', voiceURI: null, rate: 1 }
        };
        users.push(newUser);
        save(LS_USERS, users);
        localStorage.setItem(LS_CURRENT, username);
        location.href = 'settings.html';
      });
    }
  
    // SETTINGS
    function initSettings() {
      const curr = getCurrentUser();
      if (!curr) return goLogin();
      const users = load(LS_USERS, []);
      const user = users.find(u => u.username === curr);
      if (!user) return goLogin();
  
      const delayInput = $('settingDelay');
      const themeSelect = $('settingTheme');
      const voiceSelect = $('settingVoice');
      const rateInput = $('settingRate');
      const rateDisplay = $('rateDisplay');
      if (delayInput) delayInput.value = user.settings.delay || 700;
      if (themeSelect) themeSelect.value = user.settings.theme || 'light';
      if (rateInput) {
        rateInput.value = user.settings.rate || 1;
        if (rateDisplay) rateDisplay.textContent = (user.settings.rate || 1) + 'x';
        rateInput.addEventListener('input', () => {
          if (rateDisplay) rateDisplay.textContent = rateInput.value + 'x';
        });
      }
      applyTheme(user.settings.theme || 'light');
  
      function populateVoices() {
        const voices = speechSynthesis.getVoices() || [];
        if (!voiceSelect) return;
        voiceSelect.innerHTML = '';
        const def = document.createElement('option');
        def.value = '';
        def.textContent = 'Default browser voice';
        voiceSelect.appendChild(def);
        voices.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.voiceURI || v.name;
          opt.textContent = `${v.name} — ${v.lang}`;
          voiceSelect.appendChild(opt);
        });
        if (user.settings.voiceURI) voiceSelect.value = user.settings.voiceURI;
      }
      populateVoices();
      speechSynthesis.onvoiceschanged = populateVoices;
  
      if (themeSelect)
        themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
  
      const form = $('settingsForm');
      if (!form) return;
      form.addEventListener('submit', e => {
        e.preventDefault();
        const delay = Number(delayInput.value) || 700;
        const theme = themeSelect.value;
        const voiceURI = voiceSelect.value || null;
        const rate = Number(rateInput?.value) || 1;
        const idx = users.findIndex(u => u.username === user.username);
        if (idx > -1) {
          users[idx].settings = { delay, theme, voiceURI, rate };
          save(LS_USERS, users);
        }
        applyTheme(theme);
        location.href = 'recipes.html';
      });
    }
  
    // RECIPES
    function initRecipes() {
      const curr = getCurrentUser();
      if (!curr) return goLogin();
      const users = load(LS_USERS, []);
      const user = users.find(u => u.username === curr);
      if (user?.settings?.theme) applyTheme(user.settings.theme);
  
      const listEl = $('recipeList');
      const searchBox = $('searchBox');
      const addBtn = $('addRecipeBtn');
      const logout = $('logoutBtn');
      const editor = $('editorSection');
      const listSection = $('listSection');
      const form = $('recipeForm');
      const title = $('recipeTitle');
      const ingredients = $('recipeIngredients');
      const directions = $('recipeDirections');
      const cancel = $('cancelEdit');
  
      if (logout)
        logout.addEventListener('click', () => {
          localStorage.removeItem(LS_CURRENT);
          location.href = 'index.html';
        });
  
      if (addBtn)
        addBtn.addEventListener('click', () => {
          editor.classList.remove('hidden');
          listSection.classList.add('hidden');
          title.value = '';
          ingredients.value = '';
          directions.value = '';
          delete form.dataset.editId;
        });
  
      if (cancel)
        cancel.addEventListener('click', () => {
          editor.classList.add('hidden');
          listSection.classList.remove('hidden');
          delete form.dataset.editId;
        });
  
      function renderList(filter = '') {
        const recipes = load(LS_RECIPES, []).filter(r =>
          r.title.toLowerCase().includes(filter.toLowerCase())
        );
        if (!listEl) return;
        listEl.innerHTML = '';
        recipes.forEach(r => {
          const li = document.createElement('li');
          const left = document.createElement('div');
          left.innerHTML = `<strong>${escapeHtml(
            r.title
          )}</strong><div class="muted">${r.ingredients.length} ingredients • ${
            r.servings || ''
          }</div>`;
          const right = document.createElement('div');
          right.className = 'row';
          const btnView = document.createElement('button');
          btnView.className = 'btn';
          btnView.textContent = 'View';
          btnView.addEventListener('click', () => (location.href = `recipe.html?id=${r.id}`));
          const btnEdit = document.createElement('button');
          btnEdit.className = 'btn outline';
          btnEdit.textContent = 'Edit';
          btnEdit.addEventListener('click', () => {
            editor.classList.remove('hidden');
            listSection.classList.add('hidden');
            title.value = r.title;
            ingredients.value = r.ingredients.join('\n');
            directions.value = r.directions.join('\n');
            form.dataset.editId = r.id;
          });
          const btnDel = document.createElement('button');
          btnDel.className = 'btn';
          btnDel.textContent = 'Delete';
          btnDel.addEventListener('click', () => {
            if (confirm('Delete recipe?')) {
              let arr = load(LS_RECIPES, []);
              arr = arr.filter(x => x.id !== r.id);
              save(LS_RECIPES, arr);
              renderList(searchBox.value);
            }
          });
          right.append(btnView, btnEdit, btnDel);
          const thumb = document.createElement('img');
          thumb.src = r.image || '';
          thumb.alt = r.title;
          thumb.style.width = '84px';
          thumb.style.height = '64px';
          thumb.style.objectFit = 'cover';
          thumb.style.borderRadius = '8px';
          thumb.style.marginRight = '12px';
          const container = document.createElement('div');
          container.style.display = 'flex';
          container.style.alignItems = 'center';
          container.append(thumb, left);
          li.append(container, right);
          listEl.appendChild(li);
        });
      }
      if (searchBox) searchBox.addEventListener('input', () => renderList(searchBox.value));
  
      if (form)
        form.addEventListener('submit', e => {
          e.preventDefault();
          const arr = load(LS_RECIPES, []);
          const rid = form.dataset.editId;
          const newR = {
            id: rid || uid(),
            title: title.value.trim(),
            image: '',
            servings: '',
            prepTime: '',
            cookTime: '',
            ingredients: ingredients.value
              .split(/\r?\n/)
              .map(s => s.trim())
              .filter(Boolean),
            directions: directions.value
              .split(/\r?\n/)
              .map(s => s.trim())
              .filter(Boolean)
          };
          if (rid) {
            const idx = arr.findIndex(x => x.id === rid);
            if (idx > -1) arr[idx] = newR;
            delete form.dataset.editId;
          } else {
            arr.unshift(newR);
          }
          save(LS_RECIPES, arr);
          editor.classList.add('hidden');
          listSection.classList.remove('hidden');
          renderList(searchBox.value);
        });
  
      renderList();
    }
  
    // RECIPE VIEW
    function initRecipeView() {
      const curr = getCurrentUser();
      if (!curr) return goLogin();
      const users = load(LS_USERS, []);
      const user = users.find(u => u.username === curr);
      if (user?.settings?.theme) applyTheme(user.settings.theme);
  
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      const recipes = load(LS_RECIPES, []);
      const r = recipes.find(x => x.id === id);
      if (!r) return alert('Recipe not found') && (location.href = 'recipes.html');
  
      $('viewTitle').textContent = r.title;
      const main = document.querySelector('main.card.content');
      if (r.image && main) {
        const img = document.createElement('img');
        img.src = r.image;
        img.alt = r.title;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '12px';
        img.style.marginBottom = '12px';
        main.insertBefore(img, main.firstChild);
      }
  
      const ingEl = $('viewIngredients');
      ingEl.innerHTML = '';
      r.ingredients.forEach(i => {
        const li = document.createElement('li');
        li.textContent = i;
        ingEl.appendChild(li);
      });
      const dirEl = $('viewDirections');
      dirEl.innerHTML = '';
      r.directions.forEach((p, idx) => {
        const pEl = document.createElement('p');
        pEl.textContent = p;
        pEl.dataset.index = idx;
        dirEl.appendChild(pEl);
      });
  
      if ($('backBtn')) $('backBtn').addEventListener('click', () => (location.href = 'recipes.html'));
  
      // Voice controls
      const play = $('playBtn');
      const pauseB = $('pauseBtn');
      const stopB = $('stopBtn');
  
      let queue = [];
      let index = 0;
      let isPaused = false;
      let isStopped = true;
  
      function getVoice() {
        const voices = speechSynthesis.getVoices() || [];
        if (user?.settings?.voiceURI) {
          return voices.find(v => (v.voiceURI || v.name) === user.settings.voiceURI) || null;
        }
        return null;
      }
      function getDelay() {
        return user?.settings?.delay || 700;
      }
  
      function stopAll() {
        speechSynthesis.cancel();
        isStopped = true;
        isPaused = false;
        index = 0;
      }
      function pauseAll() {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel(); // stop immediately but keep index
          isPaused = true;
          isStopped = false;
        }
      }
  
      // ✅ Modified playSequence for immediate correct voice
      function playSequence(fromStart = false) {
        // Load or reload voices before speaking
        const voicesReady = speechSynthesis.getVoices();
        const voice = getVoice();
        const delay = Number(getDelay()) || 700;
  
        if (isPaused && !fromStart) {
          isPaused = false;
          isStopped = false;
          speakNext();
          return;
        }
  
        if (fromStart || queue.length === 0) {
          queue = ['Ingredients:'].concat(r.ingredients, ['Directions:']).concat(r.directions);
          index = 0;
        }
        
        isStopped = false;
        isPaused = false;
  
        function speakNext() {
          if (index >= queue.length || isStopped) return;
          const text = queue[index];
          const u = new SpeechSynthesisUtterance(text);
          const currentVoice = getVoice();
          if (currentVoice) u.voice = currentVoice;
          u.rate = user?.settings?.rate || 1;
          u.onend = () => {
            if (!isPaused && !isStopped) {
              index++;
              const currentDelay = user?.settings?.delay || 700;
              setTimeout(() => speakNext(), currentDelay);
            }
          };
          speechSynthesis.speak(u);
        }
  
        speakNext();
      }
  
      play.addEventListener('click', () => {
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.onvoiceschanged = () => {
            if (isPaused) {
              playSequence(false);
            } else {
              playSequence(true);
            }
          };
          speechSynthesis.getVoices();
        } else {
          if (isPaused) {
            playSequence(false);
          } else {
            playSequence(true);
          }
        }
      });
  
      pauseB.addEventListener('click', () => pauseAll());
      stopB.addEventListener('click', () => stopAll());
    }
  
    // Helpers
    function getCurrentUser() {
      return localStorage.getItem(LS_CURRENT);
    }
    function goLogin() {
      location.href = 'index.html';
    }
    function applyTheme(t) {
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
    function escapeHtml(s) {
      return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  })();
  