import React, { useState } from "react";
import "./App.css";

const API_URL = "https://api.spoonacular.com/recipes/complexSearch";
const RECIPE_INFO_URL = "https://api.spoonacular.com/recipes";
const API_KEY = "0107a2f64b704c30b3455114d353a636"; // Replace with your actual API key

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const searchRecipes = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?query=${query}&apiKey=${API_KEY}`);
      const data = await response.json();
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  const fetchRecipeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${RECIPE_INFO_URL}/${id}/information?apiKey=${API_KEY}`);
      const data = await response.json();
      setSelectedRecipe(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>Recipe Finder</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchRecipes} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {selectedRecipe ? (
        <div className="recipe-details">
          <button onClick={() => setSelectedRecipe(null)}>Go Back</button>
          <h2>{selectedRecipe.title}</h2>
          <img src={selectedRecipe.image} alt={selectedRecipe.title} />
          <h3>Ingredients:</h3>
          <ul>
            {selectedRecipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <h3>Instructions:</h3>
          <p dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}></p>
        </div>
      ) : (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card"
              onClick={() => fetchRecipeDetails(recipe.id)}
            >
              <img src={recipe.image} alt={recipe.title} />
              <h3>{recipe.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
