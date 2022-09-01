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
    getElement(DOMString).innerHTML = "";
  };

  const clearInputField = (DOMString) => {
    getElement(DOMString).value = "";
  };

  /**
   * Toggles the visibility of the input form
   * @memberof module:view
   * @returns { boolean } - true if input is open, false when collapsed.
   */
  const toggleInput = (DS) => {
    const headerLower = view.getElement(DS.headerLower);
    headerLower.classList.toggle("hidden");
    document.body.classList.toggle("form-open");
    getElement(DS.btnAddSvg).classList.toggle("rotate");
    if (!headerLower.classList.contains("hidden")) {
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
    heading = "test",
    DOMString = ".header__heading-main"
  ) => {
    const headerHeading = getElement(DOMString);
    clearView(DOMString);
    const html = `<span>${heading}</span>`;
    headerHeading.insertAdjacentHTML("beforeend", html);
  };

  const insertPlaceholder = (
    DOMString = ".input__input",
    placeholder = "Add item"
  ) => {
    const input = view.getElement(DOMString);
    input.placeholder = placeholder;
  };

  /**
   * Adds the lists to the list view.
   * @param {Object} data -
   */
  const renderLists = (data) => {
    const { lists, clearHtml, DOMStrings } = data;

    const parent = document.createElement("div");
    parent.classList.add("grid-container");

    clearView(DOMStrings.main);

    // Hide `go back to overview` btn
    getElement(".control__back-to-overview").classList.add("hidden");

    if (!lists) return;

    insertHeading("Available Lists");

    lists.map((list) => {
      const html = generateHtml(templates.list, {
        listName: list.listName,
        listID: list.listID,
      });
      parent.insertAdjacentHTML("beforeend", html);
    });

    insertPlaceholder(DOMStrings.input, "Insert a list name");
    getElement(DOMStrings.main).appendChild(parent);
  };

  const renderList = (data) => {
    const { list, DOMStrings } = data;

    // Create a container for list items
    const parent = document.createElement("div");
    parent.classList.add("grid-container");

    clearView(DOMStrings.main);

    // Show list name in Header
    insertHeading(list.listName);
    // Insert a placeholder into the form
    insertPlaceholder(DOMStrings.input, "Insert new item");

    // Go back to overview btn
    getElement(".control__back-to-overview").classList.remove("hidden");

    // Check if there are any items in the list
    if (list.listItems === null) {
      toggleInput(DOMStrings);
      console.log("there are no list items");
      return;
    }
    // Render existing items
    list.listItems.map((item) => {
      const html = generateHtml(templates.listItem, {
        itemID: item.itemID,
        itemName: item.itemName,
        isDone: item.isDone,
      });
      parent.insertAdjacentHTML("beforeend", html);
    });
    getElement(DOMStrings.main).appendChild(parent);
  };

  const renderLogin = ({ DOMStrings, isLocalData = false }) => {
    const hidden = isLocalData ? "" : "hidden";
    clearView(DOMStrings.main);
    insertHeading("LOGIN");
    const html = generateHtml(templates.login, { hidden: hidden });
    getElement(DOMStrings.main).insertAdjacentHTML("beforeend", html);
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
