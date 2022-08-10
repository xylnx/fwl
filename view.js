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

  const toggleInput = (DS, btnEl) => {
    const headerLower = view.getElement(DS.headerLower);
    headerLower.classList.toggle('hidden');
    if (!headerLower.classList.contains('hidden')) {
      const input = view.getElement(DS.input).focus();
      return;
    }
    btnEl.focus();
  };

  /**
   * Generates HTML from a template and dynamic data.
   * @param {string} template - Generic HTML stored as a template string.
   * @param {Object} data - Data to be inserted. The key is used to identify where to put the data.
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

  const insertHeading = (DOMString = '.header', heading = 'test') => {
    const header = getElement(DOMString);
    clearView(DOMString);
    const html = generateHtml(templates.header, {
      headingMain: heading,
    });

    header.insertAdjacentHTML('beforeend', html);
  };

  /**
   * Adds the lists to the list view.
   * @param {Object} data -
   */
  const renderLists = (data) => {
    const { lists, clearHtml, DOMString } = data;
    clearView(DOMString);

    // Hide go back to overview btn
    getElement('.control__back-to-overview').classList.add('hidden');

    if (!lists) return;
    lists.map((list) => {
      const html = generateHtml(templates.list, {
        listName: list.listName,
        listID: list.listID,
      });
      getElement(DOMString).insertAdjacentHTML('beforeend', html);
    });
  };

  const renderList = (data) => {
    const { list, DOMString } = data;
    console.log('renderList:', { list });
    clearView(DOMString);

    // Go back to overview btn
    getElement('.control__back-to-overview').classList.remove('hidden');

    // Check if there are any items in the list
    if (list.listItems === null) {
      console.log('there are no list items');
      return;
    }
    // Render existing items
    list.listItems.map((item) => {
      const html = generateHtml(templates.listItem, {
        itemID: item.itemID,
        itemName: item.itemName,
        isDone: item.isDone,
      });
      getElement(DOMString).insertAdjacentHTML('beforeend', html);
    });
  };

  const renderLogin = ({ DOMString }) => {
    clearView(DOMString);
    const html = generateHtml(templates.login);
    getElement(DOMString).insertAdjacentHTML('beforeend', html);
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
