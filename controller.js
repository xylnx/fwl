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
   * Triggers {@link module:view.toggleInput}, which toggles the visibility of the input form.
   * @memberof module:controller
   */
  const handleAddBtn = () => {
    view.toggleInput(DOMStrings);
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
    const input = view.getElement(DOMStrings.input);

    // Stop here, if the the form is empty
    if (!input.value) return;

    // Update model
    model.addList({ name: input.value });
    view.clearInputField(DOMStrings.input);

    // Render listsj
    view.renderLists({ lists: model.getLists(), DOMString: DOMStrings.items });
  };

  /**
   * Handles a form submit in the `list view`. Adds a new item to the list if successful. It uses and triggers functions in {@link module:view} and {@link module:model}
   * @see {module:model.getList} -- retrieves a list by ID
   * @see {module:view.getElement} -- queries elements
   * @see {module:model.item.add} -- adds an item to a list
   * @see {module:view.clearInputField} -- clears the input form
   * @see {module:view.renderLists} -- (re)renders the lists view
   * @see {module:view.toggleInput} -- toggles visibility of the input form
   * @memberof module:controller
   */
  const handleItemSubmit = () => {
    const list = model.getList(model.state.listID);
    const input = view.getElement(DOMStrings.input);
    if (!input.value) return;

    // Update model
    model.item.add({ name: input.value });
    view.clearInputField(DOMStrings.input);

    // Render items
    view.renderList({ list: list, DOMString: DOMStrings.items });

    // Open input again
    view.toggleInput(DOMStrings);
  };

  /**
   * Handles a form submit in the `login view`. Logs the user in and renders their lists, if successfull.
   * It uses and triggers functions in {@link module:view} and {@link module:model}
   * @see {module:view.getElement} -- queries elements
   * @see {module:model.state.update} -- updates application state
   * @see {module:auth.login} -- authenticates the user
   * @see {module:controller.loadLists} -- loads list data from an API
   * @see {module:view.renderLists} -- (re)renders the lists view
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
    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };

  const handleTryOut = () => {
    // Try out will store lists in the same location potential existing data is stored in, so check:
    if (model.state.isLocalData) {
      if (!confirmDelete("existing local Data")) return;
    }

    const curLists = model.getLists();
    model.state.update({ view: "overview" });
    view.renderLists({
      lists: curLists,
      DOMString: DOMStrings.main,
    });
    view.toggleInput(DOMStrings, document.querySelector(".controls__add"));
  };

  const handleUseWithExistingLocalData = () => {
    const curLists = model.getLists({ LS: true });
    model.state.update({ view: "overview" });
    view.renderLists({
      lists: curLists,
      DOMString: DOMStrings.main,
    });
  };

  const handleListDelete = (target) => {
    const dataSet = target.parentNode.parentNode.dataset;
    const ID = dataSet.id;
    const name = dataSet.name;

    if (!confirmDelete(name)) return;

    model.removeList(ID);
    view.renderLists({ lists: model.getLists(), DOMString: DOMStrings.items });
  };

  const showList = (target) => {
    const id = target.dataset.id;
    const list = model.getList(id);
    view.renderList({ list: list, DOMString: DOMStrings.items });
    model.state.update({ view: "list", listID: id });
  };

  const showOverview = () => {
    view.renderLists({ lists: model.getLists(), DOMString: DOMStrings.items });
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
      DOMString: DOMStrings.items,
    });
  };

  const dispatchEvents = (e) => {
    const events = {
      // Handle clicks:
      click: function () {
        if (e.target.classList.contains("control__add")) {
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
          view.renderLogin({ DOMString: DOMStrings.main });
          // }
        }

        await model.getLists({ API: true });
        view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
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
      DOMString: DOMStrings.main,
      isLocalData: model.state.isLocalData, // if true an optional btn is displayed `use with local data`
    });
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
    // view.renderLogin({ DOMString: DOMStrings.main });

    // testing();
    checkForLocalData();

    // loadLists();

    // view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };
  init();
})();
