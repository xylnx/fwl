// Data structureli:

let listsExample = [
  {
    listID: '9999',
    listName: 'my list',
    listItems: [
      { itemID: '1234', itemName: 'my item name 1', isDone: true },
      { itemID: '1235', itemName: 'my item name 2', isDone: false },
      { itemID: '1236', itemName: 'my item name 3', isDone: true },
    ],
  },
];

const model = (function () {
  // DATA
  // let lists = [];
  let lists = listsExample;
  let state = {
    view: 'overview',
    listID: null,
    itemID: null,
    update(args) {
      const {
        view = this.view,
        listID = this.listID,
        itemID = this.itemID,
      } = args;
      this.view = view;
      this.listID = listID;
      this.itemID = itemID;
    },
  };

  /** Create a pseudo ID. It is very unlikely to end up with two identical ids using this function. */
  const _getId = () => Math.floor(Math.random() * 1e15).toString();

  /** Persist data to local storage
   * @param {Object} data - Contains data a key used to identify this data in local storage.
   */
  const writeToLocalStorage = (data) => {
    const { key, value } = data;
    const json = JSON.stringify(value);
    window.localStorage.setItem(key, json);
  };

  /** Get data from local storage and parse it.
   * @param {string} key - The key assotiated with JSON stored in local storage.
   */
  const readFromLocalStorage = (key) => {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  };

  /**
   * Add a new list to the lists array.
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

  const getListIndex = (id) => {
    return lists.findIndex((list) => list.listID === id);
  };

  const getList = (id) => {
    const list = lists.find((list) => list.listID === id);
    return list;
  };

  const getItemIndex = (args) => {
    const { listID = state.listID, itemID = state.itemID } = args;
    const list = getList(listID);
    console.log(list.listItems);

    return list.listItems.findIndex((item) => item.itemID === itemID);
  };

  const removeList = (id) => {
    const index = getListIndex(id);
    lists.splice(index, 1);
  };

  const item = {
    add(args) {
      const { name } = args;
      const id = _getId();
      const listIndex = getListIndex(state.listID);
      if (!lists[listIndex].listItems) {
        lists[listIndex].listItems = [];
      }
      lists[listIndex].listItems.push({
        itemName: name,
        itemID: id,
        isDone: false,
      });
    },
    statusUpdate(args) {
      const { isDone } = args;
      const listIndex = getListIndex(state.listID);
      const itemIndex = getItemIndex(state.itemID);

      // access the list + change item status
      lists[listIndex].listItems[itemIndex].isDone = isDone;
    },
  };

  return {
    lists,
    item,
    addList,
    removeList,
    getList,
    state,
  };
})();
