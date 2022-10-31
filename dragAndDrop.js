/**
 * @module dragAndDrop
 * @description Make it possible to drag and drop lists and list items. The functions in this model essentially allow to swap DOM elements.
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const dragAndDrop = (function () {
  /**
   * Runs when a user starts dragging an item (ondragstart).
   * It sets the dataTransfer property to the id of the dragged element.
   * @param {Object} e -- event object
   * @memberof module:dragAndDrop
   */
  function drag(e) {
    e.dataTransfer.setData('text', e.target.id);
  }

  /** Runs when a user places a draggable item over a drop zone: per default browsers do not allow drag and drop => prevent the default.
   * @param {Object} e -- event object
   * @memberof module:dragAndDrop
   */
  function allowDrop(e) {
    e.preventDefault();
  }

  /** Runs when a user drops the dragged item onto a possible drop zone.
   * @param {Object} e -- event object
   * @memberof module:dragAndDrop
   */
  function drop(e) {
    e.preventDefault();

    // The index of the dragged element in the nodeList of all elements (will be set below)
    let dragindex = 0;

    // Create a clone of the element onto which the dragged element was dropped
    const clone = e.target.cloneNode(true);
    // Get ID of the dragged element => this ID was stored in drag() using `setData()`
    const data = e.dataTransfer.getData('text');
    const curEl = document.getElementById(data);

    const cloneDomPos = e.target.dataset.domPos;
    const curDomPos = curEl.dataset.domPos;

    if (clone.id !== data) {
      // Get all list/list item elements
      let nodeList = document.querySelector('.grid-container').childNodes;
      for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].id === data) {
          dragindex = i;
        }
      }
      // Replace the node in the drop zone with the dragged node
      document
        .querySelector('.grid-container')
        .replaceChild(document.getElementById(data), e.target);

      // Insert the clone of the node in the drop zone at the previous index (dragindex) of the dragged node
      document
        .querySelector('.grid-container')
        .insertBefore(
          clone,
          document.querySelector('.grid-container').childNodes[dragindex]
        );

      // Model: get both elements and update their domPos val
      model.updateDomPos({ id: curEl.id, newPos: cloneDomPos });
      model.updateDomPos({ id: clone.id, newPos: curDomPos });
      // View update data attrs of the swapped elements
      clone.dataset.domPos = curDomPos;
      curEl.dataset.domPos = cloneDomPos;
    }
  }

  return {
    allowDrop,
    drag,
    drop,
  };
})();
