const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function showRecipe() {
  try {
    // fetching from the api
    const response = await fetch(
      "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcc72"
    );

    // converting response promise into json
    const data = await response.json();

    // catching for the 400+ errors
    if (!response.ok) throw new Error(`(${response.status}) ${data.message}`);

    console.log(response, data);

    // making our recipe object from data for better usage
    let { recipe } = data.data;
    console.log(recipe);
    // following some dirty way😜
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log("our recipe", recipe);
  } catch (error) {
    alert(error);
  }
}

showRecipe();
