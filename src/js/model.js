import { async } from "regenerator-runtime";

// App imports
import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // console.log(recipe);
  // following some dirty way😜
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }), // IMP conditional way of inserting property
  };
};

export const loadRecipe = async function (id) {
  try {
    // 1> Loading recipe
    const data = await getJSON(`${API_URL}${id}`);

    // making our recipe object from data for better usage
    state.recipe = createRecipeObject(data);

    // Checking for the bookmarked
    if (state.bookmarks.some((bookmarkItem) => bookmarkItem.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
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
  } finally {
    state.search.page = 1;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ingredient) => {
    ingredient.quantity =
      ingredient.quantity * (newServings / state.recipe.servings);
  });

  state.recipe.servings = newServings;
  console.log(state.recipe.servings);
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark currrent recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  } else {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete the bookmarked
  const index = state.bookmarks.findIndex((ele) => ele.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

const initLocalDB = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
initLocalDB();

// For Developing purpose
const clearAllBookmarks = function () {
  localStorage.clear("bookmarks");
};

// clearAllBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(Object.entries(newRecipe));

    // Object.entries is an opposite of Object.fromEntries();
    const ingredients = Object.entries(newRecipe)
      .filter((ingr) => ingr[0].startsWith("ingredient") && ingr[1] !== "")
      .map((ingr) => {
        console.log(ingr);
        const ingrArr = ingr[1].replaceAll(" ", "").split(",");
        console.log(ingrArr);

        if (ingrArr.length !== 3) {
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        }

        const [quantity, unit, description] = ingrArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
