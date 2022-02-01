import icons from "url:../../img/icons.svg"; // for parcel 2

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length)) {
      return this.renderError();
    }

    this._data = data;
    // console.log(this._data);
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  //IMP DOM changing (DOM CHANGING ***)
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach(function (newNodeEle, index) {
      const currEle = curElements[index];

      // Update the TEXT
      if (
        !newNodeEle.isEqualNode(currEle) &&
        newNodeEle.firstChild?.nodeValue.trim() !== ""
      ) {
        currEle.textContent = newNodeEle.textContent;
      }

      // Update the ATTRIBUTES
      if (!newNodeEle.isEqualNode(currEle)) {
        Array.from(newNodeEle.attributes).forEach((attr) =>
          currEle.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderError(errorMsg = this._errorMessage) {
    const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${this._errorMessage}</p>
            </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(msg = this._successMessage) {
    const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
