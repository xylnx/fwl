/**
 * @module controller
 * @description Catches user input and triggers {@link auth}, {@link model} and {@link module:view} functions accordingly.
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const controller = (function () {
  /**
   * Contains html selectors, which are used to query elements.
   * @type {Object<string, string>}
   * @memberof module:controller
   */
  const DOMStrings = {
    header: "header",
    headerLower: ".header__lower",
    btnAdd: ".control__add",
    btnAddSvg: ".control__add svg",
    main: "main",
    input: ".header__lower input",
    items: "main",
    loginUser: ".login__input--user",
    loginPw: ".login__input--pw",
  };

  const changeTheme = () => {
    const themeDefault = "dark";
    const theme = model.state.colorTheme;
    const path = `style.${theme}.css`;

    // Remove current active state
    const menuItems = document.querySelectorAll("[data-theme-name]");
    menuItems.forEach((item) => item.classList.remove("menu__item--active"));

    // Apply new active state
    const menuItemActive = document.querySelector(
      `[data-theme-name="${theme}"]`
    );
    menuItemActive.classList.add("menu__item--active");
    removeCss();

    if (theme !== themeDefault) {
      // create link element
      const sheet = document.createElement("link");
      sheet.setAttribute("rel", "stylesheet");
      sheet.setAttribute("type", "text/css");
      sheet.setAttribute("data-styles", "true");
      sheet.setAttribute("href", path);
      document.querySelector("head").appendChild(sheet);
    }
  };

  const removeCss = () => {
    const sheet = document.querySelector("[data-styles=true]");

    if (!sheet) return;
    sheet.remove();
  };

  // appendCss("style.legacy.css");
  // removeCss();

  /**
   * Triggers a dialog modal asking the user to confirm deleting an item.
   * @param {string} itemName - The name of a list or an item
   * @memberof module:controller
   *
   */
  const confirmDelete = (itemName) => {
    return window.confirm(`Delete ${itemName}?`);
  };

  /**
   * Show/hide the input form.
   * @see {module:model.state.update} -- updates application state
   * @see {module:view.toggleInput} -- toggle classes to show/hide the input field
   * @memberof module:controller
   */
  const handleAddBtn = () => {
    model.state.update({ inputIsOpen: view.toggleInput(DOMStrings) });
  };

  /**
   * Handles a form submit in the `overview view` and creates a new list if successful. It uses and triggers functions in {@link module:view} and {@link module:model}
   * @see {module:view.getElement} -- queries elements
   * @see {module:model.addList} -- adds a list to the data structure
   * @see {module:view.clearInputField} -- clears the input form
   * @see {module:view.renderLists} -- (re)renders the lists view
   * @memberof module:controller
   */
  const handleSubmit = () => {
    // Query the input element
    const input = view.getElement(DOMStrings.input);

    // Stop here, if the the form is empty
    if (!input.value) return;

    // Update model
    model.addList({ name: input.value });
    view.clearInputField(DOMStrings.input);

    // Render lists
    view.renderLists({ lists: model.getLists(), DOMStrings: DOMStrings });
  };

  /**
   * Handles a form submit in the `list view`. Adds a new item to the list if successful. It uses and triggers functions in {@link module:view} and {@link module:model}
   * @see {module:model.getList} -- retrieves a list by ID
   * @see {module:view.getElement} -- queries elements
   * @see {module:model.item.add} -- adds an item to a list
   * @see {module:view.clearInputField} -- clears the input form
   * @see {module:view.renderLists} -- (re)renders the lists view
   * @memberof module:controller
   */
  const handleItemSubmit = () => {
    const list = model.getList(model.state.listID); // ID of the current list
    const input = view.getElement(DOMStrings.input);

    // Do not do anything, if the form was empty
    if (!input.value) return;

    // Update model
    model.item.add({ name: input.value });
    view.clearInputField(DOMStrings.input);

    // Render items
    view.renderList({ list: list, DOMStrings: DOMStrings });
  };

  /**
   * Handles a form submit in the `login view`. Logs the user in and renders their lists, if successfull.
   * It uses and triggers functions in {@link module:view} and {@link module:model}
   * @see {module:view.getElement} -- queries elements
   * @see {module:model.state.update} -- updates application state
   * @see {module:auth.login} -- authenticates the user
   * @see {module:controller.loadLists} -- loads list data from an API
   * @see {module:view.renderLists} -- (re)renders the lists view
   * @memberof module:controller
   */
  const handleLoginSubmit = async () => {
    const user = view.getElement(DOMStrings.loginUser).value;
    const pw = view.getElement(DOMStrings.loginPw).value;
    if (!user || !pw) return;

    model.state.update({
      view: "overview",
      useAPI: true,
      user: user,
      password: pw,
    });

    const loginResponse = await auth.login();
    if (!loginResponse) {
      model.state.update({ authToken: null, view: "login" });
      loadLists();
    }
    model.state.update({ authToken: loginResponse.accessToken });
    await loadLists();
    view.renderLists({ lists: model.lists, DOMStrings: DOMStrings });
  };

  /**
   * Is called if a user clicks the `try out` option in the login view. In `try out mode` data is written to local storage.
   * This function uses:
   * @see {module:controller.confirmDelete} -- confirms deletion of data living in Local Storage (if it exists)
   * @see {module:model.state.update} -- updates application state
   * @see {module:view.renderLists} -- (re)renders the lists view
   * @see {module:view.toggleInput} -- toggles classes to show/hide input form element
   * @memberof module:controller
   */
  const handleTryOut = () => {
    // `Try out` stores lists in the same location potential existing data is stored in.
    // This deletes existing data,
    // so check:
    if (model.state.isLocalData) {
      if (!confirmDelete("existing local Data")) return;
    }

    // Return and assign current state of the list array,
    // on start up, it should be empty ([])
    const curLists = model.getLists();
    model.state.update({ view: "overview" });

    // Render lists; in try out there should be no lists visible, so:
    // this mostly clears the login screen
    view.renderLists({
      lists: curLists,
      DOMStrings: DOMStrings,
    });

    // Show input and get ready for creating the first list
    model.state.update({ inputIsOpen: view.toggleInput(DOMStrings) });
  };

  const handleUseWithExistingLocalData = () => {
    const curLists = model.getLists({ LS: true });
    model.state.update({ view: "overview" });
    view.renderLists({
      lists: curLists,
      DOMStrings: DOMStrings,
    });
  };

  const handleListDelete = (target) => {
    const dataSet = target.parentNode.parentNode.dataset;
    const ID = dataSet.id;
    const name = dataSet.name;

    if (!confirmDelete(name)) return;

    model.removeList(ID);
    view.renderLists({ lists: model.getLists(), DOMStrings: DOMStrings });
  };

  const showList = (target) => {
    const id = target.dataset.id;
    const list = model.getList(id);
    view.renderList({ list: list, DOMStrings: DOMStrings });
    model.state.update({ view: "list", listID: id });
  };

  const showOverview = () => {
    view.renderLists({ lists: model.getLists(), DOMStrings: DOMStrings });
    model.state.update({ view: "overview", listID: null });
  };

  const changeItemStatus = (target) => {
    const itemID = target.parentNode.parentNode.dataset.id;
    model.state.update({ itemID: itemID });
    if (target.classList.contains("list-item__actions__status--do")) {
      model.item.statusUpdate({ itemID: itemID, isDone: true });
    }
    if (target.classList.contains("list-item__actions__status--done")) {
      model.item.statusUpdate({ itemID: itemID, isDone: false });
    }
    view.renderList({
      list: model.getList(model.state.listID),
      DOMStrings: DOMStrings,
    });
  };

  const handleMenu = () => {
    document.querySelector(".menu").classList.toggle("hidden");
    model.state.update({ menuIsOpen: !model.state.menuIsOpen });
  };

  const handleMenuItem = (e) => {
    const themeName = e.srcElement.dataset.themeName;

    if (!themeName) return;

    if (themeName === "dark") {
      model.state.update({ colorTheme: "dark" });
      model.writeColorThemeToLS();
      changeTheme();
    }
    if (themeName === "legacy") {
      model.state.update({ colorTheme: "legacy" });
      model.writeColorThemeToLS();
      changeTheme();
    }
  };

  const dispatchEvents = (e) => {
    const events = {
      // Handle clicks:
      click: function () {
        if (
          model.state.menuIsOpen &&
          !e.target.classList.contains("control__menu-toggle")
        ) {
          handleMenu();
        }
        if (e.target.classList.contains("control__menu-toggle")) {
          handleMenu();
        }
        if (e.target.classList.contains("menu__item")) {
          handleMenuItem(e);
        }
        if (
          e.target.classList.contains("control__add") &&
          model.state.view !== "login"
        ) {
          handleAddBtn(e);
        }

        // LOGIN VIEW
        if (model.state.view === "login") {
          if (e.target.classList.contains("login__submit")) {
            handleLoginSubmit();
          }
          if (e.target.classList.contains("login__try-me")) {
            handleTryOut();
          }
          if (e.target.classList.contains("login__local-data")) {
            handleUseWithExistingLocalData();
          }
        }

        // LIST OVERVIEW
        if (model.state.view === "overview") {
          if (e.target.classList.contains("input__submit")) {
            handleSubmit();
          }
          if (e.target.classList.contains("list__actions__delete")) {
            handleListDelete(e.target);
          }
          if (e.target.classList.contains("list")) {
            showList(e.target);
          }
        }

        // LIST VIEW
        if (model.state.view === "list") {
          if (e.target.classList.contains("list-item__actions__status")) {
            changeItemStatus(e.target);
          }
          if (e.target.classList.contains("input__submit")) {
            handleItemSubmit();
          }
          if (e.target.classList.contains("control__back-to-overview")) {
            showOverview();
          }
        }
      },
      keydown: function () {
        const input = view.getElement(DOMStrings.input);
        if (model.state.view === "login" && e.key === "Enter") {
          handleLoginSubmit();
        }
        if (
          model.state.view === "list" && //
          document.activeElement === input
        ) {
          if (e.key === "Enter") {
            e.preventDefault();
            handleItemSubmit();
          }
        }
        if (
          model.state.view === "overview" &&
          document.activeElement === input
        ) {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }
      },
    };
    return events[e.type]();
  };

  const listenToEvents = () => {
    const eventTypes = ["click", "keydown"];
    eventTypes.map((eventType) =>
      document.body.addEventListener(eventType, dispatchEvents)
    );
  };

  const loadLists = async () => {
    try {
      await model.getLists({ API: true });
    } catch (error) {
      if (error.message === "forbidden" || error.message === "unauthorized") {
        try {
          await auth.refresh();
        } catch (error) {
          /*
          console.log('from init => try refresh:', error.message);
          if (error.message === 'refresh failed') {
          */
          // Show login form
          model.state.update({ view: "login" });
          view.renderLogin({ DOMStrings: DOMStrings });
          // }
        }

        await model.getLists({ API: true });
        view.renderLists({ lists: model.lists, DOMStrings: DOMStrings });
        return;
      }
      if (error.message === "no content") {
      } else {
        console.log(error.message);
        return;
      }
    } finally {
      return null;
    }
  };

  const checkForLocalData = () => {
    if (!model.getListsFromLS()) {
      model.state.update({ view: "login" });
    } else {
      model.state.update({ view: "login", isLocalData: true });
      // calling model.getListsFromLS (see above) writes data into model.list
      // so we need to reset the lists in case the 'Try out' option will be choosen
      model.lists = [];
    }
    view.renderLogin({
      DOMStrings: DOMStrings,
      isLocalData: model.state.isLocalData, // if true an optional btn is displayed `use with local data`
    });
  };

  const checkForColorTheme = () => {
    const colorTheme = model.getColorThemeFromLS();
    console.log(colorTheme);
    if (!colorTheme) return;
    changeTheme();
  };

  const init = async () => {
    listenToEvents();
    const header = view.getElement(DOMStrings.header);
    const html = view.generateHtml(templates.header, {
      headingMain: "hello world",
    });
    header.insertAdjacentHTML("beforeend", html);

    // Show login view
    // model.state.update({ view: 'login' });
    // view.renderLogin({ DOMStrings: DOMStrings });

    // testing();
    checkForColorTheme();
    checkForLocalData();

    // loadLists();

    // view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };
  init();
})();
