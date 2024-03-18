const randomRecipeGrid = document.getElementById('randomRecipeGrid'); // يشير إلى العنصر الذي يحتوي على شبكة الوصفات العشوائية
const recipeDetails = document.getElementById('recipeDetails'); // يشير إلى عنصر يحتوي على تفاصيل الوصفة

// Function to fetch random recipes from API
function fetchRandomRecipes() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const recipes = data.meals;
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe');
                recipeCard.innerHTML = `
                    <h2>${recipe.strMeal}</h2>
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                    <button class="view-recipe-btn" data-id="${recipe.idMeal}"> View Recipe</button>
                    <button class="add-to-cart-btn" data-id="${recipe.idMeal}" data-name="${recipe.strMeal}" data-image="${recipe.strMealThumb}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                `;
                randomRecipeGrid.appendChild(recipeCard);

                const viewRecipeBtn = recipeCard.querySelector('.view-recipe-btn');
                viewRecipeBtn.addEventListener('click', function () {
                    displayRecipeDetails(recipe.idMeal);
                });

                const addToCartBtn = recipeCard.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', function () {
                    addToCart(recipe.idMeal, recipe.strMeal, recipe.strMealThumb);
                });
            }
        })
        .catch(error => console.log('Error fetching random recipes: ', error));
}


// يستدعي الدالة لعرض 8 وصفات عشوائية عند تحميل الصفحة
for (let i = 0; i < 8; i++) {
    fetchRandomRecipes();
}

// مستمع الحدث لزر البحث لجلب الوصفات بناءً على المكونات التي يدخلها المستخدم
document.getElementById('searchRecipeBtn').addEventListener('click', function () {
    const recipeInput = document.getElementById('recipeInput').value; // يحصل على قيمة المدخلات
    if (recipeInput !== '') { // التحقق مما إذا كانت المدخلات غير فارغة
        fetchRecipeByName(recipeInput); // يستدعي الدالة لجلب الوصفات باستخدام المكونات المحددة
    } else {
        alert('Please enter an ingredient!'); // يعرض تنبيهًا إذا كانت المدخلات فارغة
    }
});

// هذه الدالة تقوم بجلب الوصفات باستخدام اسم المكون المحدد
function fetchRecipeByName(ingredientName) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`) // يجلب بيانات الوصفات باستخدام اسم المكون من API
        .then(response => response.json()) // يحول الاستجابة إلى كائن JSON
        .then(data => { // يقوم بمعالجة البيانات المستردة
            const recipes = data.meals; // يستخرج قائمة الوصفات من البيانات
            randomRecipeGrid.innerHTML = ''; // يمسح النتائج السابقة
            for (let i = 0; i < recipes.length; i++) { // يقوم بعرض كل وصفة في الواجهة
                const recipe = recipes[i];
                const recipeCard = document.createElement("div"); // ينشئ عنصر div لعرض الوصفة
                recipeCard.classList.add("recipe"); // يضيف فئة CSS إلى العنصر لتنسيقه
                recipeCard.innerHTML = `
                <h2>${recipe.strMeal}</h2>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <button class="view-recipe-btn" data-id="${recipe.idMeal}">View recipe</button>
                <button class="add-to-cart-btn" data-id="${recipe.idMeal}" data-name="${recipe.strMeal}" data-image="${recipe.strMealThumb}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                `; // يضيف HTML لعنصر الوصفة
                randomRecipeGrid.appendChild(recipeCard); // يضيف العنصر إلى شبكة الوصفات العشوائية

                // يضيف مستمع حدث لزر "عرض الوصفة" لعرض تفاصيل الوصفة عند النقر
                const viewRecipeBtn = recipeCard.querySelector('.view-recipe-btn');
                viewRecipeBtn.addEventListener('click', function () {
                    displayRecipeDetails(recipe.idMeal);
                });
                const addToCartBtn = recipeCard.querySelector('.add-to-cart-btn');
                addToCartBtn.addEventListener('click', function () {
                    addToCart(recipe.idMeal, recipe.strMeal, recipe.strMealThumb);
                });
            }
        })
        .catch(error => console.log('Error fetching recipes by ingredient: ', error)); // يعالج أي أخطاء قد تحدث أثناء الاستدعاء من الواجهة البرمجية
}

function displayRecipeDetails(recipeId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`) // يجلب تفاصيل الوصفة باستخدام معرف الوصفة
        .then(response => response.json()) // يحول الاستجابة إلى كائن JSON
        .then(data => { // يقوم بمعالجة البيانات المستردة
            const recipe = data.meals[0]; // يحصل على تفاصيل الوصفة الواحدة
            // يعرض تفاصيل الوصفة في الصندوق
            document.getElementById('recipeTitle').textContent = recipe.strMeal;
            document.getElementById('recipeImage').src = recipe.strMealThumb;
            document.getElementById('recipeInstructions').textContent = recipe.strInstructions;
            document.getElementById('youtube').href = recipe.strYoutube;
            const zutaten = document.getElementById('zutaten');
            for (let i = 1; i <= 20; i++) {
                const zutatenList = recipe[`strIngredient${i}`];
                if (zutatenList) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        ${zutatenList} 
                        <button class="addToListBtn" onclick="submitZutaten('${zutatenList}')">Add to List</button>
                    `;
                    zutaten.appendChild(listItem);
                }
            }
            // يعرض الصندوق
            document.getElementById('recipeBox').style.display = 'block';
        })
        .catch(error => console.log('Error fetching recipe details: ', error)); // يعالج أي أخطاء قد تحدث أثناء الاستدعاء من الواجهة البرمجية
}

let listZutaten = [];

function submitZutaten(ingredient) {
    listZutaten.push(ingredient);
    console.log(listZutaten);
    const lista = document.getElementById("ListItems");
    lista.innerHTML ="";
    const ul = document.createElement('ul'); 
    for (let i = 0; i < listZutaten.length; i++) { 
        const li = document.createElement('li');
        li.textContent = listZutaten[i];
        ul.appendChild(li);
    }
    lista.appendChild(ul);
}


    
    // الخطوة 4: تصميم النافذة التي تظهر عند النقر على زر السلة وعرض العناصر فيها
    document.getElementById('cartBtn').addEventListener('click', function() {
        // showCartItems();
        document.getElementById('recipeBox1').style.display = 'block';
    });
    document.getElementById('listBtn').addEventListener('click', function() {
        // showCartItems();
        document.getElementById('recipeBox2').style.display = 'block';
    });
// هذه الدالة تقوم بإخفاء الصندوق عند النقر على زر الإغلاق
function closeRecipeBox1() {
    document.getElementById('recipeBox').style.display = 'none';
}
function closeRecipeBox2() {
    document.getElementById('recipeBox1').style.display = 'none';
}
function closeRecipeBox3() {
    document.getElementById('recipeBox2').style.display = 'none';
}

// Function to add items to cart
function addToCart(id, name, image) {
    const cartItems = document.getElementById('cartItems');
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
    <li class="coloredBtn">
        <img src="${image}" alt="${name}" width="80px">
        <h3>${name}</h3>
        <button class="delete-item-btn" data-id="${id}"><i class="fas fa-trash-alt"></i></button>
    </li>
        `;
    cartItems.appendChild(cartItem);

    const deleteItemBtn = cartItem.querySelector('.delete-item-btn');
    deleteItemBtn.addEventListener('click', function () {
        cartItems.removeChild(cartItem);
    });

    // Show the cart items container
    cartItemsContainer.style.display = 'block';
}

// Function to close the cart items container
closeCartItemsBtn.addEventListener('click', function () {
    cartItemsContainer.style.display = 'none';
});


// Current Date
const currentDate = new Date().toLocaleDateString('en-US');
document.getElementById('currentDate').textContent = currentDate;