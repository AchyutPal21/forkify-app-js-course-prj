import icons from "url:../../img/icons.svg"; // for parcel 2

import View from "./View.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _successMessage = "Recipe was successfully uploaded ✨";

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this._toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this._toggleWindow.bind(this));
    this._overlay.addEventListener("click", this._toggleWindow.bind(this));
  }

  _addHandlerUpload(handlerFn) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      const dataArr = [...new FormData(this)]; // returns an kind of object we converted into array of entries
      const data = Object.fromEntries(dataArr); // this conver an entries into an object

      handlerFn(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
