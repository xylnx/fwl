const templates = (function () {
  // SVG
  const _svgMenu = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
    </svg>
  `;

  const _svgPlus = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
    </svg>
  `;

  const _svgDelete = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
      <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
    </svg>
  `;

  // TEMPLATE PARTS
  const header = `
  <div class="header__upper">
    <h1 class="header__heading-main">{%headingMain%}</h1>
    <div class="controls">
      <button type="button" class="btn control__menu-toggle">
        ${_svgMenu}
      </button>
      <button type="button" class="btn control__add">
        ${_svgPlus}
      </button>
    </div>
  </div>

  <div class="header__lower">
      <form>
        <label class="input__label">
          <span class="hidden">
            {%labelHeaderInput%}
          </span>
          <input type="text"/>
          <button type="button" class="btn input__submit">{%submitBtn%}</button>
        </label>
      </form>
  </div>
  `;

  const list = `
    <div class="list" data-id={%listID%}>
      <div class="list__title">{%listName%}</div>
      <div class="list__actions">
        <button type="button" class="btn list__actions__delete">
          ${_svgDelete}
        </button>
    </div>
  `;

  return {
    header,
    list,
  };
})();
