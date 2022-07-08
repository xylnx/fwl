const controller = (function () {
  const DOMStrings = {
    header: 'header',
    main: 'main',
    input: '.input input',
    items: '.items',
  };

  const handleAddBtn = () => {
    console.log('Add btn');

    // Create a list with a form field
    // Apend this template
  };

  const handleSubmit = () => {
    const input = view.getElement(DOMStrings.input);
    const data = { title: input.value, DOMString: DOMStrings.items };
    // Update model
    model.addList({ name: input.value });
    // render lists
    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };

  const handleListDelete = (target) => {
    const ID = target.parentNode.parentNode.dataset.id;
    model.removeList(ID);
    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };

  const openList = (target) => {
    const id = target.dataset.id;
    const list = model.getList(id);
    view.renderList({ list: list, DOMString: DOMStrings.items });
  };

  const dispatchEvents = (e) => {
    const events = {
      click: function () {
        if (e.target.classList.contains('control__add')) {
          handleAddBtn();
        }
        if (e.target.classList.contains('input__submit')) {
          handleSubmit();
        }
        if (e.target.classList.contains('list__actions__delete')) {
          handleListDelete(e.target);
        }
        if (e.target.classList.contains('list')) {
          openList(e.target);
        }
      },
    };
    return events[e.type]();
  };

  const listenToEvents = () => {
    const eventTypes = ['click'];
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
    view.renderLists({ lists: model.lists, DOMString: DOMStrings.items });
  };

  const init = () => {
    listenToEvents();
    const header = view.getElement(DOMStrings.header);
    const html = view.generateHtml(templates.header, {
      headingMain: 'hello world',
    });
    header.insertAdjacentHTML('beforeend', html);

    testing();
  };
  init();
})();
