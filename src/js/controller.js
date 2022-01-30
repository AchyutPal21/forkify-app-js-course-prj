import "core-js/stable";
import "regenerator-runtime/runtime";

// app imports
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";

const recipeContainer = document.querySelector(".recipe");

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

// controlRecipes();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
