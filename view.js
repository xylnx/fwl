/**
 * @module view
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const view = (function () {
  const getElement = (domString) => {
    return document.querySelector(domString);
  };

  const clearView = (DOMString) => {
    getElement(DOMString).innerHTML = '';
  };

  const clearInputField = (DOMString) => {
    getElement(DOMString).value = '';
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  /**
   * Toggles the visibility of the input form
   * @returns { boolean } - true if input is open, false when collapsed.
   * @memberof module:view
   */
  const toggleInput = (DS) => {
    const headerLower = view.getElement(DS.headerLower);
    headerLower.classList.toggle('hidden');
    document.body.classList.toggle('form-open');
    getElement(DS.btnAddSvg).classList.toggle('rotate');
    if (!headerLower.classList.contains('hidden')) {
      view.getElement(DS.input).focus();
      return true;
    }
    getElement(DS.btnAdd).focus();
    return false;
  };

  /**
   * Generates HTML from a template and dynamic data.
   * @param {string} template - Generic HTML stored as a template string.
   * @param {Object} data - Data to be inserted. The key is used to identify where to put the data.
   * @memberof module:view
   */
  const generateHtml = (template, data) => {
    // Put data into the markup
    let html = template;
    if (!data) return html;
    for (const [key, value] of Object.entries(data)) {
      html = html.replaceAll(`{%${key}%}`, `${value}`);
    }
    return html;
  };

  const insertHeading = (
    heading = 'test',
    DOMString = '.header__heading-main'
  ) => {
    const headerHeading = getElement(DOMString);
    clearView(DOMString);
    const html = `<span>${heading}</span>`;
    headerHeading.insertAdjacentHTML('beforeend', html);
  };

  const insertPlaceholder = (
    DOMString = '.input__input',
    placeholder = 'Add item'
  ) => {
    const input = view.getElement(DOMString);
    input.placeholder = placeholder;
  };

  /**
   * Sort lists or list items according to their position in the DOM.
   * @param {array} elArr -- an array of lists or list items
   * @returns {array} an array of elements sorted in an ascending order.
   * @memberof module:view
   *
   */
  const sortDomPos = (elArr) => {
    console.log(elArr);
    sortedEls = elArr.sort((a, b) => {
      // Asign default vals if domPos prop does not exist
      if (!a.domPos) a.domPos = elArr.indexOf(a);
      if (!b.domPos) b.domPos = elArr.indexOf(b);
      return a.domPos - b.domPos;
    });

    return sortedEls;
  };

  /**
   * Adds the lists to the list view.
   * @param {Object} props -
   */
  const renderLists = (props) => {
    const { lists, clearHtml, DOMStrings, scroll = true } = props;

    const parent = document.createElement('div');
    parent.classList.add('grid-container');

    clearView(DOMStrings.main);
    insertPlaceholder(DOMStrings.input, 'Insert a list name');
    insertHeading('Available Lists');

    // Scroll view to top
    if (scroll) scrollToTop();

    // Hide `go back to overview` btn
    getElement('.control__back-to-overview').classList.add('hidden');

    getElement('body').classList.remove('view-login');
    getElement('body').classList.remove('view-list-items');
    getElement('body').classList.add('view-list-overview');

    if (!lists) return;

    // Sort lists according to their desired (defined by the user) position in the DOM
    const sortedLists = sortDomPos(lists);

    sortedLists.map((list) => {
      const html = generateHtml(templates.list, {
        listName: list.listName,
        listID: list.listID,
        domPos: list.domPos,
      });
      parent.insertAdjacentHTML('beforeend', html);
    });

    getElement(DOMStrings.main).appendChild(parent);
  };

  const renderList = (props) => {
    const { list, DOMStrings, scroll = true } = props;

    // Create a container for list items
    const parent = document.createElement('div');
    parent.classList.add('grid-container');

    clearView(DOMStrings.main);

    if (scroll) {
      scrollToTop();
    }

    // Show list name in Header
    insertHeading(list.listName);
    // Insert a placeholder into the form
    insertPlaceholder(DOMStrings.input, 'Insert new item');

    // Go back to overview btn
    getElement('.control__back-to-overview').classList.remove('hidden');

    getElement('body').classList.remove('view-list-overview');
    getElement('body').classList.add('view-list-items');

    // Check if there are any items in the list
    if (list.listItems === null) {
      console.log('there are no list items');
      return;
    }

    // Sort lists according to their desired (defined by the user) position in the DOM
    const sortedListItems = sortDomPos(list.listItems);

    // Render existing items
    sortedListItems.map((item) => {
      const html = generateHtml(templates.listItem, {
        itemID: item.itemID,
        itemName: item.itemName,
        isDone: item.isDone,
        domPos: item.domPos,
      });
      parent.insertAdjacentHTML('beforeend', html);
    });
    getElement(DOMStrings.main).appendChild(parent);
  };

  const renderLogin = ({ DOMStrings, isLocalData = false }) => {
    const hidden = isLocalData ? '' : 'hidden';
    clearView(DOMStrings.main);
    scrollToTop();
    insertHeading('LOGIN');
    const html = generateHtml(templates.login, { hidden: hidden });
    getElement(DOMStrings.main).insertAdjacentHTML('beforeend', html);
    getElement('body').classList.add('view-login');
  };

  return {
    getElement,
    generateHtml,
    renderLists,
    renderList,
    renderLogin,
    toggleInput,
    clearInputField,
    insertHeading,
  };
})();
