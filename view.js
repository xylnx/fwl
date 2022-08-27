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
   */
  const toggleInput = (DS) => {
    const headerLower = view.getElement(DS.headerLower);
    headerLower.classList.toggle("hidden");
    getElement(DS.btnAddSvg).classList.toggle("rotate");
    if (!headerLower.classList.contains("hidden")) {
      view.getElement(DS.input).focus();
      return;
    }
    getElement(DS.btnAdd).focus();
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

  const insertHeading = (heading = "test", DOMString = ".header") => {
    const header = getElement(DOMString);
    clearView(DOMString);
    const html = generateHtml(templates.header, {
      headingMain: heading,
    });

    header.insertAdjacentHTML("beforeend", html);
  };

  /**
   * Adds the lists to the list view.
   * @param {Object} data -
   */
  const renderLists = (data) => {
    const { lists, clearHtml, DOMString } = data;

    const parent = document.createElement("div");
    parent.classList.add("grid-container");

    clearView(DOMString);

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

    getElement(DOMString).appendChild(parent);
  };

  const renderList = (data) => {
    const { list, DOMString } = data;

    // Create a container for list items
    const parent = document.createElement("div");
    parent.classList.add("grid-container");

    clearView(DOMString);

    // Show list name in Header
    insertHeading(list.listName);

    // Go back to overview btn
    getElement(".control__back-to-overview").classList.remove("hidden");

    // Check if there are any items in the list
    if (list.listItems === null) {
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
    getElement(DOMString).appendChild(parent);
  };

  const renderLogin = ({ DOMString, isLocalData = false }) => {
    const hidden = isLocalData ? "" : "hidden";
    clearView(DOMString);
    insertHeading("LOGIN");
    const html = generateHtml(templates.login, { hidden: hidden });
    getElement(DOMString).insertAdjacentHTML("beforeend", html);
    console.log(1);
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
