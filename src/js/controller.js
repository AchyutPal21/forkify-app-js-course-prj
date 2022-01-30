import "core-js/stable";
import "regenerator-runtime/runtime";

// app imports
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    // getting the id
    const recipeID = window.location.hash.slice(1);
    console.log(recipeID);

    // guard clause for no recipeID
    if (!recipeID) return;

    recipeView.renderSpinner();

    // 1> Loading recipe
    await model.loadRecipe(recipeID); // model loadRecipe is an async function which returns a promise

    // 2> Rendering Recipe
    // rendering in the view
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    // 1> Get the recipe query
    const query = searchView.getQuery();
    console.log(query);

    // 2> check for the query
    if (!query) return;

    // 3> load the query result
    await model.loadSearchResult(query);

    // 4> render the result
    console.log(model.state.search.results);
  } catch (error) {
    recipeView.renderError(error);
  }
}

// controlSearchResults();
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerRender(controlSearchResults);
};

init();
