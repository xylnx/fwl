/**
 * @module dragAndDrop
 * @description Make it possible to drag and drop lists and list items. The functions in this model essentially allow to swap DOM elements.
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const dragAndDrop = (function () {
  /** Filters a nodeList for element nodes. Used to remove text nodes etc.
   * @param {nodeList}
   */
  function filterForElementTypes(nodeList) {
    return [...nodeList].filter((node) => node.nodeType == Node.ELEMENT_NODE);
  }

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

    // Starting position of a dragged element (dragee)
    let dragindex = 0;

    // Postion of the element the dragee is exchanged with
    let dropindex = 0;

    // Get ID of the dragged element => this ID was stored in drag() using `setData()`
    const data = e.dataTransfer.getData('text');

    // Dragged element
    const dropee = document.getElementById(data);
    // Drop zone element
    const dragee = e.target;

    if (dragee.id !== data) {
      // Get all list/list item elements
      let children = document.querySelector('.grid-container').children;

      // ToDo: Will this even be necessary?
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === data) {
          dragindex = i;
          console.log({ dragindex });
        }
        if (children[i].id === dragee.id) {
          dropindex = i;
          console.log({ dropindex });
        }
      }

      // Move an item down
      if (dragindex < dropindex) {
        console.log('%cmove item down', 'color: red');
        // loop over all elements
        for (i = 0; i < children.length; i++) {
          let child = children[i];
          if (
            // decrement domPos if
            // current domPOs <= dropindex
            // current domPos > dragindex
            Number(child.dataset.domPos) <= dropindex &&
            Number(child.dataset.domPos > dragindex)
          ) {
            let newPos = String(Number(child.dataset.domPos) - 1);
            console.log('newPos:', newPos);
            model.updateDomPos({
              id: child.id,
              newPos,
            });
          }
        }
        let newPos = String(Number(dropindex) - 1);
        model.updateDomPos({
          id: dropee.id,
          newPos: String(Number(dropindex) - 1),
        });
      }

      // Move an item up
      if (dragindex > dropindex) {
        console.log('%cmove item up', 'color: darkorange');
        const dropeeDomPosStart = Number(dropee.dataset.domPos);

        // loop over all elements
        for (i = 0; i < children.length; i++) {
          let child = children[i];
          if (
            // increment domPos by one if
            // current domPos < dragindex (original position of the dragee)
            // current domPos >= dropindex (element onto which we drop)
            Number(child.dataset.domPos) < dragindex &&
            Number(child.dataset.domPos >= dropindex)
          ) {
            let newPos = String(Number(child.dataset.domPos) + 1);
            model.updateDomPos({
              id: child.id,
              newPos,
            });
          }
        }
      }

      // Assign the new domPos to the dropee
      // dragee becomes dropee
      model.updateDomPos({ id: dropee.id, newPos: String(dropindex) });

      // Rerender list overview or list
      // TODO: Put this logic into controller.js

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

      console.log('Lists after:', model.lists);
    }
  }

  return {
    allowDrop,
    drag,
    drop,
  };
})();
