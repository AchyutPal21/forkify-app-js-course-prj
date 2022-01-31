import { async } from "regenerator-runtime";

// App imports
import { API_URL, RES_PER_PAGE } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
};

export const loadRecipe = async function (id) {
  try {
    // 1> Loading recipe
    const data = await getJSON(`${API_URL}${id}`);
    // console.log(data);

    // making our recipe object from data for better usage
    const { recipe } = data.data;
    // console.log(recipe);
    // following some dirty way😜
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log("our recipe", state.recipe);
  } catch (error) {
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = getJSON(`${API_URL}?search=${query}`);
    const queryRecipes = await data;

    if (!queryRecipes.results) throw new Error(`${query}`);

    // console.log(queryRecipes);

    state.search.results = queryRecipes.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });

    // console.log(state.search.results);
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  console.log(state.search.results);

  return state.search.results.slice(start, end);
};
