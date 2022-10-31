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

  const _svgLists = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
      <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
      <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
    </svg>
  `;

  const _svgDelete = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
      <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
    </svg>
  `;

  const _svgExclam = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
    </svg>
  `;

  const _svgCheck = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">
      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
    </svg>
  `;

  const _popupMenu = `
    <div class="menu hidden">
      <div class="menu__wrapper">
        <div class="menu__content">
          <div class="menu__themes flow">
            <h2 class="menu__heading">Themes</h2>
            <ul class="menu__list flow">
              <li class="menu__item menu__item--active" data-theme-name="dark">
                <span>${_svgCheck}</span>
                Dark theme
              </li>
              <li class="menu__item" data-theme-name="legacy">
                <span>${_svgCheck}</span>
                Legacy theme
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // TEMPLATE PARTS
  const header = `
    <div class="header__upper">
      <div class="header__brand">FWL</div>
      <div class="controls">
        <button type="button" class="btn control__back-to-overview hidden">
          ${_svgLists}
        </button>
        <button type="button" class="btn control__menu-toggle">
          ${_svgMenu}
          ${_popupMenu}
        </button>
        <button type="button" class="btn control__add">
          ${_svgPlus}
        </button>
      </div>
    </div>

    <form class="header__lower hidden">
      <label class="input__label">
        <span class="vis-hidden">
          {%labelHeaderInput%}
        </span>
        <input type="text" class="input__input" placeholder="{%placeholder%}"/>
        <button type="button" class="btn input__submit">Add</button>
      </label>
    </form>

    <h1 class="header__heading-main">{%headingMain%}</h1>
  `;

  const list = `
    <div 
      id={%listID%}
      class="list" 
      data-id={%listID%}
      data-name={%listName%}
      data-dom-pos={%domPos%}
      draggable="true"
      ondragstart="dd.drag(event)"
      ondrop="dd.drop(event)" 
      ondragover="dd.allowDrop(event)"
      >
      <div class="list__name">{%listName%}</div>
      <div class="list__actions">
        <button type="button" class="btn list__actions__delete">
          ${_svgDelete}
        </button>
    </div>
  `;

  const listItem = `
    <div 
      id={%itemID%}
      class="list-item" 
      data-id={%itemID%} 
      data-isdone="{%isDone%}"
      data-dom-pos={%domPos%}
      draggable="true"
      ondragstart="dd.drag(event)"
      ondrop="dd.drop(event)" 
      ondragover="dd.allowDrop(event)"
      >

      <div class="list-item__name">{%itemName%}</div>
      <div class="list-item__actions">
        <button type="button" class="btn list-item__actions__status list-item__actions__status--do">
          ${_svgExclam}
        </button>
        <button type="button" class="btn list-item__actions__status list-item__actions__status--done">
          ${_svgCheck}
        </button>
        <button type="button" class="btn list-item__actions__delete hidden">
          ${_svgDelete}
        </button>
    </div>
  `;

  const login = `
    <form class="login grid-container flow">
      <p class="login__msg">Please sign in!</p>
      <label class="login__label">
        <span>User name</span>
        <input type="text" class="login__input login__input--user">
      </label>
      <label class="login__label">
        <span>Password</span>
        <input type="password" class="login__input login__input--pw">
      </label>
      <button type="button" class="btn login__submit">Log me in!</button>

    </form>
    <div class="login login--alternatives grid-container flow">
    
      <p class="login__msg login__msg--options">Or pick another option:</p>
      <div class="login__actions">
        <button type="button" class="btn login__local-data {%hidden%}">Use existing local data</button>
        <button type="button" class="btn login__try-me"><span>Try</span>without logging in</button>
      </div>
    </div>
  `;

  return {
    header,
    list,
    listItem,
    login,
  };
})();
