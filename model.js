// Data structure:

let listsExample = [
  {
    listID: '9999',
    listName: 'my list',
    listItems: [
      { itemID: '1234', itemName: 'my item name 1', itemStatus: 0 },
      { itemID: '1235', itemName: 'my item name 2', itemStatus: 0 },
      { itemID: '1236', itemName: 'my item name 3', itemStatus: 0 },
    ],
  },
];

const model = (function () {
  // let lists = [];
  let lists = listsExample;

  let state = {
    view: 'overview',
    listID: null,
  };

  /** Creates a pseudo ID. It is very unlikely to end up with two identical ids using this function. */
  const _getId = () => Math.floor(Math.random() * 1e15).toString();

  /**
   * Adds a new list to the lists array.
   * @param {Object} data - Necessary data to create a list item, contains e.g. its name.
   */
  const addList = (data) => {
    const { name } = data;
    const id = _getId();
    const items = null;

    lists.push({
      listID: id,
      listName: name,
      listItems: items,
    });
  };

  const removeList = (id) => {
    console.log(typeof id);
    const index = lists.findIndex((list) => list.listID === id);
    lists.splice(index, 1);
  };

  const getList = (id) => {
    const list = lists.find((list) => list.listID === id);
    return list;
  };

  return {
    lists,
    addList,
    removeList,
    getList,
    null: null,
  };
})();
