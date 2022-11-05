/**
 * @module dragAndDrop
 * @description Makes it possible to drag and drop lists and list items. The functions in this model essentially allow to swap DOM elements.
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const dragAndDrop = (function () {
  const debug = false;

  document.querySelector('main').addEventListener('dragstart', drag);

  /**
   * Removes classes from lists and list items, depending on which view is active.
   * @param {array} [classSelectors] an array containg one or more classes to be removed
   * @memberof module:dragAndDrop
   */
  function removeClasses(
    classSelectors = [
      'dragging',
      'drag-sibling',
      'show-drop-zone-top',
      'show-drop-zone-bottom',
      'bg-accent',
    ]
  ) {
    const children = document.querySelector('.grid-container').children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      classSelectors.forEach((cls) => {
        child.classList.remove(cls);
      });
    }
  }

  /**
   * Runs when a user starts dragging an item (ondragstart).
   * It sets the dataTransfer property to the id of the dragged element.
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function drag(e) {
    e.dataTransfer.effectAllowed = 'move';
    removeClasses(['blink']);

    // Add event listeners
    // They are destroyed when dragging ends
    const ddContainer = document.querySelector('.grid-container');
    ddContainer.addEventListener('dragenter', handleDragEnter);
    ddContainer.addEventListener('dragover', allowDrop);
    ddContainer.addEventListener('dragleave', hideDropZone);
    ddContainer.addEventListener('drop', drop);
    ddContainer.addEventListener('dragend', () => removeClasses());

    e.dataTransfer.setData('text', e.target.id);
    e.target.classList.add('dragging');

    model.state.update({ dragPos: e.target.dataset.domPos });
  }

  /** Runs when a user places a draggable item over a drop zone: per default browsers do not allow drag and drop => prevent the default.
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function allowDrop(e) {
    e.preventDefault();
  }

  /** Adds and removes classes to show if and where an element will be placed when dropped
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function showDropZone(e) {
    const draggedDP = Number(model.state.dragPos);
    let enteredDP = Number(e.target.dataset.domPos);
    const draggedEl = document.querySelector(
      `[data-dom-pos="${model.state.dragPos}"]`
    );

    if (draggedDP === enteredDP) {
      draggedEl.classList.add('bg-accent');
    }

    if (draggedDP < enteredDP - 1) {
      draggedEl.classList.remove('bg-accent');
      e.target.classList.add('show-drop-zone-top');
    }
    if (draggedDP > enteredDP + 1) {
      draggedEl.classList.remove('bg-accent');
      e.target.classList.add('show-drop-zone-bottom');
    }
  }

  /** Removes classes and hides visual cues for showing if and where an element would be placed when dropped. Usually triggered ondragleave.
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function hideDropZone(e) {
    e.target.classList.remove('show-drop-zone-top');
    e.target.classList.remove('show-drop-zone-bottom');
  }

  /** Tracks the drop position by updating {@link module:model.state.dropPos}. Triggers {@link module:dragAndDrop.showDropZone}.
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function handleDragEnter(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    model.state.update({ dropPos: e.target.dataset.domPos });
    showDropZone(e);
  }

  /** Updates positons of lists and list items in the DOM. They are persisted in {@link module:model.lists}. This function runs when a user drops a dragged item onto a possible drop zone.
   *
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function drop(e) {
    e.preventDefault();

    // Dragged element
    // Get ID of the dragged element => this ID was stored in drag() using `setData()`
    const dragID = e.dataTransfer.getData('text');
    const dragEl = document.getElementById(dragID);

    // Drop zone element
    const dropEl = e.target;

    // Starting position of a dragged element (dragEl)
    const dragPos = Number(model.state.dragPos);

    // Postion of the element the dragEl is exchanged with
    const dropPos = Number(model.state.dropPos);

    // Do not do anything if dragEl + dropEl are the same
    if (dropEl.id === dragID) return;

    // Get all list/list item elements
    const children = document.querySelector('.grid-container').children;

    if (debug) {
      console.log({ dragPos });
      console.log({ dropPos });
    }

    // Move an item down
    if (dragPos < dropPos) {
      if (debug) console.log('%cmove item down', 'color: red');

      // loop over all elements
      for (i = 0; i < children.length; i++) {
        let child = children[i];
        let childDomPos = Number(child.dataset.domPos);
        let newPos = childDomPos;

        // if a child is above the dropPos and below the dragPos
        // move it one position up
        if (childDomPos < dropPos && childDomPos > dragPos)
          newPos = String(Number(child.dataset.domPos) - 1);

        // if a child is the dragged element
        // move it one position up from the drop position
        if (childDomPos === dragPos) newPos = dropPos - 1;

        // Store new dom position in the model
        model.updateDomPos({
          id: child.id,
          newPos: String(newPos),
        });
      }
    }

    // Move an item up
    if (dragPos > dropPos) {
      if (debug) console.log('%cmove item up', 'color: darkorange');

      // loop over all elements
      for (i = 0; i < children.length; i++) {
        let child = children[i];
        let childDomPos = Number(child.dataset.domPos);
        let newPos = childDomPos;

        if (childDomPos > dropPos && childDomPos < dragPos)
          newPos = String(Number(child.dataset.domPos) + 1);

        if (childDomPos === dragPos) newPos = dropPos + 1;

        model.updateDomPos({
          id: child.id,
          newPos: String(newPos),
        });
      }
    }

    // Rerender list overview or list
    // TODO: Put this logic into controller.js
    rerender();

    // Flash dragged element briefly for awareness
    const dragElNew = document.getElementById(dragID);
    dragElNew.classList.add('blink');
    if (debug) console.log('Lists after:', model.lists);
  }

  /** Rerenders lists and list items
   * @param {Object} e event object
   * @memberof module:dragAndDrop
   */
  function rerender() {
    // Get current scroll position
    const scrollPos = window.scrollY;

    // Rerender
    if (model.state.view === 'overview') {
      view.renderLists({
        lists: model.getLists(),
        DOMStrings: controller.DOMStrings,
      });
    }

    if (model.state.view === 'list') {
      console.log(model.state.listID);
      view.renderList({
        list: model.getList(),
        DOMStrings: controller.DOMStrings,
      });
    }

    // Scroll back to the last scroll position
    window.scrollTo(0, scrollPos);
  }
})();
