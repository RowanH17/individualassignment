// JavaScript Image Slider
const images = [
    { src: "slide1.jpg", caption: "Take care of your body. It's the only place you have to live." },
    { src: "slide2.jpg", caption: "Health is not just about what you're eating. It's also about what you're thinking and saying." },
    { src: "slide3.jpg", caption: "A healthy lifestyle is something you nurture daily, not a destination." }
];

let currentIndex = 0;
const sliderImage = document.getElementById("slider-image");
const captionText = document.getElementById("caption");

function updateSlider() {
    sliderImage.src = images[currentIndex].src;
    captionText.textContent = images[currentIndex].caption;
    currentIndex = (currentIndex + 1) % images.length;
}

// Set interval for slider update every 5 seconds
setInterval(updateSlider, 5000);

// Initial slider setup
updateSlider();

// Accordion Functionality
document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling;
        content.style.display = content.style.display === "block" ? "none" : "block";
    });
});

// Function to fetch recipes from TheMealDB API
async function fetchRecipes() {
    const query = document.getElementById("search-query").value.trim(); // Get search query
    const suggestionBox = document.getElementById("suggestions");

    // Hide suggestions if the search bar is empty
    if (!query) {
        suggestionBox.style.display = 'none';
        document.getElementById("recipe-container").innerHTML = "<p>Please enter a search query.</p>";
        return;
    }

    try {
        // Fetch recipes from TheMealDB API based on the user's query
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        // Handle suggestions and display them dynamically
        if (data.meals && data.meals.length > 0) {
            suggestionBox.innerHTML = `
          <ul>
            ${data.meals.slice(0, 5).map(meal => `<li>${meal.strMeal}</li>`).join('')}
          </ul>
        `;
            suggestionBox.classList.add("show"); // Show suggestions
        } else {
            suggestionBox.classList.remove("show"); // Hide if no results
        }

        // Handle displaying recipes once the search query is valid
        displayRecipes(data.meals);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        suggestionBox.classList.remove("show"); // Hide suggestions if error occurs
        document.getElementById("recipe-container").innerHTML = "<p>Sorry, there was an error fetching the recipes. Please try again later.</p>";
    }
}

// Function to display recipes after search is performed
function displayRecipes(meals) {
    const recipeContainer = document.getElementById("recipe-container");

    if (meals && meals.length > 0) {
        recipeContainer.innerHTML = meals.map(meal => {
            const recipeUrl = meal.strSource || "#"; // Use strSource for link to recipe, fallback to "#"
            return `
          <div class="recipe-card">
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; border-radius:5px;">
            <p>${meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : 'No instructions available'}</p>
            <a href="${recipeUrl}" target="_blank">${recipeUrl === "#" ? "No full recipe available" : "View Full Recipe"}</a>
          </div>
        `;
        }).join('');
    } else {
        recipeContainer.innerHTML = "<p>No recipes found. Try searching for a different term.</p>";
    }
}