import icons from "url:../../img/icons.svg"; // for parcel 2

import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage =
    "No recipe found for your query 😕, Search for another one! 🤗";
  _successMessage = "Let's start cooking 😊";

  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
