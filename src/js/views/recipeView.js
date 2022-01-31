import icons from "url:../../img/icons.svg"; // for parcel 2
import { Fraction } from "fractional";

// App Imports
import View from "./View.js";

// console.log(Fraction);

class RecipeView extends View {
  _parentElement = document.querySelector(".recipe");
  _errorMessage =
    "Couldn't find your recipe 😕. Please try for another one! 🤗";
  _successMessage = "Let's start cooking 😊";

  addHandlerRender(handlerFn) {
    // a good way of dry code
    // window.addEventListener("hashchange", handlerFn);
    // window.addEventListener("load", handlerFn);
    ["hashchange", "load"].forEach((evnt) =>
      window.addEventListener(evnt, handlerFn)
    );
  }

  addHandlerServings(handlerFn) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--update-servings");
      if (!btn) return;

      const { updateTo } = btn.dataset;
      if (+updateTo >= 1) {
        handlerFn(+updateTo);
      }
    });
  }

  _generateMarkup() {
    return `
      <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            
          </div>

          <button class="btn--round">
            <svg class="">
              <use href="${icons}.svg#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkupIngredient)
            .join("")}            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }

  _generateMarkupIngredient(ingr) {
    let quantity = ingr.quantity ? new Fraction(ingr.quantity).toString() : "";
    return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}.svg#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${quantity}</div>
                <div class="recipe__description">
                    <span class="recipe__unit">${ingr.unit ?? ""}</span>
                    ${ingr.description ?? ""}
                </div>
            </li>`;
  }
}

export default new RecipeView();
