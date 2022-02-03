import "core-js/stable";
import "regenerator-runtime/runtime";

// app imports
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import MODAL_CLOSE_SEC from "./config.js";
import { setTimeout } from "core-js";

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

async function controlRecipes() {
  try {
    // getting the id
    const recipeID = window.location.hash.slice(1);
    // console.log(recipeID);

    // guard clause for no recipeID
    if (!recipeID) return;

    recipeView.renderSpinner();

    // IMP Changing the active from the result
    // 0> Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // 1> Updating the bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2> Loading recipe
    await model.loadRecipe(recipeID); // model loadRecipe is an async function which returns a promise

    // 3> Rendering Recipe
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
    // console.log(query);

    // 2> check for the query
    if (!query) return;
    resultsView.renderSpinner();

    // 3> load the query result
    await model.loadSearchResult(query);

    // 4> render the result
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 5> render the initial pagination button
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error);
  }
}

const controlPagination = function (goToPage) {
  // 1> Render New Result
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2> Render New pagination button/s as per page
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // update the recipe serving (in state)
  model.updateServings(updateTo);

  // only updating the text and the values
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Delete as bookmarked
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the Recipe
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close from window
    // setTimeout(function () {
    //   addRecipeView._toggleWindow();
    // }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error("🔥", error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();
