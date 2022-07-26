const controller = (function () {
  const DOMStrings = {
    header: 'header',
    headerLower: '.header__lower',
    main: 'main',
    input: '.header__lower input',
    items: '.items',
  };

  const confirmDelete = (item) => {
    return window.confirm(`Delete ${item}?`);
  };

  const handleAddBtn = (e) => {
    view.toggleInput(DOMStrings, e.target);
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

  const testing = () => {
    const DS = DOMStrings.items;
    const testData = [
      { name: 'test-1' },
      { name: 'test-2' },
      { name: 'test-3' },
      { name: 'test-4' },
      { name: 'test-5' },
    ];

    testData.map((dp) => {
      model.addList(dp);
    });
  };

  const init = () => {
    listenToEvents();
    const header = view.getElement(DOMStrings.header);
    const html = view.generateHtml(templates.header, {
      headingMain: 'hello world',
    });
    header.insertAdjacentHTML('beforeend', html);

    const curLists = model.getLists();

    // testing();
    view.renderLists({ lists: curLists, DOMString: DOMStrings.items });
  };
  init();
})();
