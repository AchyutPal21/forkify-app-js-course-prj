import "core-js/stable";
import "regenerator-runtime/runtime";

// app imports
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

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

    // 1> Loading recipe
    await model.loadRecipe(recipeID); // model loadRecipe is an async function which returns a promise

    // 2> Rendering Recipe
    // rendering in the view
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
  } catch (error) {
    // console.log(error);
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
  // Add as bookmarded
  console.log(model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);
  console.log(model.state.recipe.bookmarked);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
