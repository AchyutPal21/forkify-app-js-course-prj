export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    // 1> Loading recipe
    // fetching from the api
    const response = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );

    // converting response promise into json
    const data = await response.json();

    // catching for the 400+ errors
    if (!response.ok) throw new Error(`(${response.status}) ${data.message}`);

    console.log(response, data);

    // making our recipe object from data for better usage
    const { recipe } = data.data;
    console.log(recipe);
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
    console.log("our recipe", state.recipe);
  } catch (error) {
    console.log("from controller.js");
    alert(error);
  }
};
