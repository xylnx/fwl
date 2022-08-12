const controller = (function () {
  const DOMStrings = {
    header: 'header',
    headerLower: '.header__lower',
    btnAdd: '.control__add',
    btnAddSvg: '.control__add svg',
    main: 'main',
    input: '.header__lower input',
    items: 'main',
    loginUser: '.login__input--user',
    loginPw: '.login__input--pw',
  };

  const confirmDelete = (item) => {
    return window.confirm(`Delete ${item}?`);
  };

  const handleAddBtn = () => {
    view.toggleInput(DOMStrings);
  };

  const handleSubmit = () => {
    const input = view.getElement(DOMStrings.input);
    if (!input.value) return;

    // Update model
    model.addList({ name: input.value });
    view.clearInputField(DOMStrings.input);
    // render lists
    view.renderLists({ lists: model.getLists(), DOMString: DOMStrings.items });
  };

  const handleItemSubmit = () => {
    const list = model.getList(model.state.listID);
    const input = view.getElement(DOMStrings.input);
    if (!input.value) return;

    // Update model
    model.item.add({ name: input.value });
    view.clearInputField(DOMStrings.input);
    // render items
    view.renderList({ list: list, DOMString: DOMStrings.items });
  };

  const handleLoginSubmit = async () => {
    const user = view.getElement(DOMStrings.loginUser).value;
    const pw = view.getElement(DOMStrings.loginPw).value;
    if (!user || !pw) return;

    model.state.update({ view: 'overview', user: user, password: pw });

    const loginResponse = await auth.login();
    if (!loginResponse) {
      model.state.update({ authToken: null, view: 'login' });
      loadLists();
    }
    model.state.update({ authToken: loginResponse.accessToken });
    await loadLists();
    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };

  const handleTryOut = () => {
    const curLists = model.getLists();
    model.state.update({ view: 'overview' });
    view.renderLists({
      lists: curLists,
      DOMString: DOMStrings.main,
    });
    view.toggleInput(DOMStrings, document.querySelector('.controls__add'));
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
    model.state.update({ view: 'list', listID: id });
  };

  const showOverview = () => {
    view.renderLists({ lists: model.getLists(), DOMString: DOMStrings.items });
    model.state.update({ view: 'overview', listID: null });
  };

  const changeItemStatus = (target) => {
    const itemID = target.parentNode.parentNode.dataset.id;
    model.state.update({ itemID: itemID });
    if (target.classList.contains('list-item__actions__status--do')) {
      model.item.statusUpdate({ itemID: itemID, isDone: true });
    }
    if (target.classList.contains('list-item__actions__status--done')) {
      model.item.statusUpdate({ itemID: itemID, isDone: false });
    }
    view.renderList({
      list: model.getList(model.state.listID),
      DOMString: DOMStrings.items,
    });
  };

  const dispatchEvents = (e) => {
    const events = {
      click: function () {
        if (e.target.classList.contains('control__add')) {
          handleAddBtn(e);
        }
        // LOGIN VIEW
        if (model.state.view === 'login') {
          if (e.target.classList.contains('login__submit')) {
            handleLoginSubmit();
          }
          if (e.target.classList.contains('login__try-me')) {
            handleTryOut();
          }
        }
        // LIST VIEW
        if (model.state.view === 'list') {
          if (e.target.classList.contains('list-item__actions__status')) {
            changeItemStatus(e.target);
          }
          if (e.target.classList.contains('input__submit')) {
            handleItemSubmit();
          }
          if (e.target.classList.contains('control__back-to-overview')) {
            showOverview();
          }
        }
        // LIST OVERVIEW
        if (model.state.view === 'overview') {
          if (e.target.classList.contains('input__submit')) {
            handleSubmit();
          }
          if (e.target.classList.contains('list__actions__delete')) {
            handleListDelete(e.target);
          }
          if (e.target.classList.contains('list')) {
            showList(e.target);
          }
        }
      },
      keydown: function () {
        const input = view.getElement(DOMStrings.input);
        if (model.state.view === 'login' && e.key === 'Enter') {
          handleLoginSubmit();
        }
        if (
          model.state.view === 'list' && //
          document.activeElement === input
        ) {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleItemSubmit();
          }
        }
        if (
          model.state.view === 'overview' &&
          document.activeElement === input
        ) {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }
      },
    };
    return events[e.type]();
  };

  const listenToEvents = () => {
    const eventTypes = ['click', 'keydown'];
    eventTypes.map((eventType) =>
      document.body.addEventListener(eventType, dispatchEvents)
    );
  };

  const loadLists = async () => {
    try {
      await model.getLists({ API: true });
    } catch (error) {
      console.log('###', error.message);
      if (error.message === 'forbidden' || error.message === 'unauthorized') {
        console.log(1);

        try {
          await auth.refresh();
        } catch (error) {
          console.log('from init => try refresh:', error.message);
          if (error.message === 'refresh failed') {
            // Show login form
            model.state.update({ view: 'login' });
            view.renderLogin({ DOMString: DOMStrings.main });
          }
        }

        await model.getLists({ API: true });
        view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
        return;
      }
      if (error.message === 'no content') {
        console.log(555);
      } else {
        console.log(error.message);
        return;
      }
    }
  };

  const init = async () => {
    listenToEvents();
    const header = view.getElement(DOMStrings.header);
    const html = view.generateHtml(templates.header, {
      headingMain: 'hello world',
    });
    header.insertAdjacentHTML('beforeend', html);

    // Show login view
    // model.state.update({ view: 'login' });
    // view.renderLogin({ DOMString: DOMStrings.main });

    // testing();

    loadLists();

    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };
  init();
})();
