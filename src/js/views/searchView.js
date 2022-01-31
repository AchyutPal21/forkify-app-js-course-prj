class SearchView {
  _parentElement = document.querySelector(".search");

  _clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this._clearInput();
    return query;
  }

  addHandlerRender(handlerFn) {
    this._parentElement.addEventListener("submit", function (event) {
      event.preventDefault();
      handlerFn();
    });
  }
}

export default new SearchView();
