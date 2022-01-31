import icons from "url:../../img/icons.svg"; // for parcel 2

import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (event) {
      const btn = event.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const currentPage = this._data.page;

    // Page 1, and there are other pages
    if (currentPage === 1 && totalPages > 1) {
      console.log("option: 1");
      return this._generateMarkupButton(1, currentPage);
    }

    // Last Page
    if (currentPage === totalPages && totalPages > 1) {
      console.log("option: 2");
      return this._generateMarkupButton(2, currentPage);
    }

    // Other Page
    if (currentPage < totalPages && currentPage > 1) {
      console.log("option: 3");
      return this._generateMarkupButton(3, currentPage);
    }

    // Page 1, and there are NO other pages
    return this._generateMarkupButton();
  }

  _generateMarkupButton(curState = 0, currentPage = 0) {
    const paginationBtns = [];
    const prv = `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        `;
    const nxt = `
        <button data-goto="${
          !currentPage ? 0 : currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>${!curState ? "" : "Page "}${
      curState < 1 ? "No more results" : currentPage + 1
    }
            </span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;

    paginationBtns.push(prv, nxt);
    if (curState === 1) {
      return paginationBtns[1];
    }
    if (curState === 2) {
      return paginationBtns[0];
    }
    if (curState === 3) {
      return paginationBtns.join("");
    }

    return nxt;
  }
}

export default new PaginationView();
