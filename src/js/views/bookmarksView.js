import icons from "url:../../img/icons.svg"; // for parcel 2

import View from "./View.js";
import previewView from "./previewView.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet 😊. Find a nice recipe and bookmark it 😍.";
  _successMessage = "Let's start cooking 😊";

  addHandlerRender(handlerFn) {
    window.addEventListener("load", handlerFn);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => previewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarksView();
