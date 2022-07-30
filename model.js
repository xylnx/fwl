// Data structureli:k

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
  let lists = [];
  // let lists = listsExample;
  let listsLSKey = 'fwlLists';
  let state = {
    view: 'overview',
    listID: null,
    itemID: null,
    user: null,
    password: null,
    authToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5Eb2UiLCJpYXQiOjE2NTkwODIxNjMsImV4cCI6MTY1OTE2ODU2M30.AA-KGs_DdC-m_DsI--MsV1V_jHCVcL56pGIRCiEkqII',
    // authToken: null,
    update(args) {
      const {
        view = this.view,
        listID = this.listID,
        itemID = this.itemID,
        user = this.user,
        password = this.password,
        authToken = this.authToken,
      } = args;
      this.view = view;
      this.listID = listID;
      this.itemID = itemID;
      this.user = user;
      this.password = password;
      this.authToken = authToken;
      console.log('STATE:', this);
    },
  };

  const getLists = (opts = {}) => {
    const { LS, API } = opts;
    if (!LS && !API) return model.lists;
    if (LS) return getListsFromLS();
    if (API) return getListsFromAPI();
  };

  const getListsFromAPI = async () => {
    const fetchOpts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.authToken}`,
      },
    };

    try {
      const response = await fetch(
        'http://localhost:3001/api/v1/json/lists',
        fetchOpts
      );
      if (!response.ok) {
        if (response.status === 401) {
          return await sendRefreshToken();
        }
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('api response: ', response);
      model.lists = data.data.lists;
    } catch (error) {
      console.log(error);
    }
  };
  const sendListsToAPI = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/json/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ lists: model.lists }),
      });
      console.log(response);
    } catch (error) {
      console.log('from model.sendListsToAPI: ', error);
    }
  };

  const getListsFromLS = () => {
    // Return lists stored in local storage
    const restoredLists = readFromLocalStorage(listsLSKey);
    if (!restoredLists) return;
    lists = restoredLists;
    return lists;
  };
  const saveListsToLS = () => {
    writeToLocalStorage({ [listsLSKey]: lists });
  };

  /** Create a pseudo ID. It is very unlikely to end up with two identical ids using this function. */
  const _getId = () => Math.floor(Math.random() * 1e15).toString();

  /** Persist data to local storage
   * @param {Object} data - Contains key value pairs. Keys are used to identify assotiated data in LS, e.g {myKey: myData}.
   */
  const writeToLocalStorage = (data) => {
    const keys = Object.keys(data);
    keys.map((key) => {
      const json = JSON.stringify(data[key]);
      window.localStorage.setItem(key, json);
    });
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

    model.lists.push({
      listID: id,
      listName: name,
      listItems: items,
    });
    // writeToLocalStorage({ [listsLSKey]: lists });
    sendListsToAPI();
  };

  const getListIndex = (id) => {
    return model.lists.findIndex((list) => list.listID === id);
  };

  const getList = (id) => {
    const list = model.lists.find((list) => list.listID === id);
    return list;
  };

  const getItemIndex = (args) => {
    const { listID = state.listID, itemID = state.itemID } = args;
    const list = getList(listID);

    return list.listItems.findIndex((item) => item.itemID === itemID);
  };

  const removeList = (id) => {
    const index = getListIndex(id);
    model.lists.splice(index, 1);
    // writeToLocalStorage({ [listsLSKey]: lists });
    sendListsToAPI();
  };

  const item = {
    add(args) {
      const { name } = args;
      const id = _getId();
      const listIndex = getListIndex(state.listID);
      if (!model.lists[listIndex].listItems) {
        model.lists[listIndex].listItems = [];
      }
      model.lists[listIndex].listItems.push({
        itemName: name,
        itemID: id,
        isDone: false,
      });
      // writeToLocalStorage({ [listsLSKey]: lists });
      sendListsToAPI();
    },
    statusUpdate(args) {
      const { isDone } = args;
      const listIndex = getListIndex(state.listID);
      const itemIndex = getItemIndex(model.state.itemID);

      // access the list + change item status
      model.lists[listIndex].listItems[itemIndex].isDone = isDone;
      // writeToLocalStorage({ [listsLSKey]: lists });
      sendListsToAPI();
    },
  };

  return {
    item,
    addList,
    removeList,
    getList,
    getLists,
    state,
    getListsFromAPI,
    sendListsToAPI,
  };
})();
