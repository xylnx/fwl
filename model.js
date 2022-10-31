// Data structure

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
  // HELPER: figure out if in dev or production
  const isDev = () => {
    let dev = false;
    if (typeof config !== 'undefined') {
      dev = config.development;
    }
    return dev;
  };

  if (isDev()) {
    API = {
      root: 'http://localhost:3001/api/v1',
      authUrl: 'http://localhost:3001/api/v1/auth',
      refreshUrl: 'http://localhost:3001/api/v1/refresh',
      logoutUrl: 'http://localhost:3001/api/v1/logout',
    };
    console.log({ API });
  } else {
    API = {
      root: 'https://simjson.herokuapp.com/api/v1',
      authUrl: 'https://simjson.herokuapp.com/api/v1/auth',
      refreshUrl: 'https://simjson.herokuapp.com/api/v1/refresh',
      logoutUrl: 'https://simjson.herokuapp.com/api/v1/logout',
    };
  }

  // DATA
  let lists = [];

  // Keys for local storage
  const listsLSKey = 'fwlLists';
  const colorThemeKey = 'fwlColorTheme';

  let state = {
    view: 'overview',
    inputIsOpen: false,
    isLocalData: false,
    menuIsOpen: false,
    colorTheme: 'dark',
    useAPI: false,
    listID: null,
    itemID: null,
    user: null,
    password: null,
    authToken: null,
    update(args) {
      const {
        view = this.view,
        inputIsOpen = this.inputIsOpen,
        isLocalData = this.isLocalData,
        menuIsOpen = this.menuIsOpen,
        useAPI = this.useAPI,
        colorTheme = this.colorTheme,
        listID = this.listID,
        itemID = this.itemID,
        user = this.user,
        password = this.password,
        authToken = this.authToken,
      } = args;
      this.view = view;
      this.inputIsOpen = inputIsOpen;
      this.menuIsOpen = menuIsOpen;
      this.colorTheme = colorTheme;
      this.listID = listID;
      this.itemID = itemID;
      this.user = user;
      this.password = password;
      this.authToken = authToken;
      this.isLocalData = isLocalData;
      this.useAPI = useAPI;
      console.log('STATE:', this);
    },
  };

  const getLists = (opts = {}) => {
    const { LS, API } = opts;
    if (!LS && !API) return model.lists;
    if (LS) return getListsFromLS();
    if (API) return getListsFromAPI();
  };

  const setLists = () => {
    if (state.useAPI) sendListsToAPI();
    if (!state.useAPI) saveListsToLS();
  };

  const getListsFromAPI = async () => {
    const fetchOpts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.authToken}`,
      },
    };

    const response = await fetch(`${API.root}/json/lists`, fetchOpts);
    console.log(response);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('unauthorized');
      }
      if (response.status === 403) {
        throw new Error('forbidden');
      }
      throw new Error(`${response.status} ${response.statusText}`);
    }
    // authorized but no content here
    if (response.status === 204) {
      console.log('no content here, create your first list');
      model.lists = [];
      throw new Error('no content');
    }

    console.log(response);
    const data = await response.json();
    console.log('api response: ', response);
    model.lists = data.data.lists;
    console.log(model.lists);
  };

  const sendListsToAPI = async () => {
    try {
      const response = await fetch(`${API.root}/json/lists`, {
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
    if (!restoredLists) return null;
    model.lists = restoredLists;
    return model.lists;
  };
  const saveListsToLS = () => {
    writeToLocalStorage({ [listsLSKey]: model.lists });
  };

  const writeColorThemeToLS = () => {
    writeToLocalStorage({ [colorThemeKey]: model.state.colorTheme });
  };

  const getColorThemeFromLS = () => {
    const restoredColorTheme = readFromLocalStorage(colorThemeKey);
    console.log(restoredColorTheme);
    if (!restoredColorTheme) return null;
    model.state.update({ colorTheme: restoredColorTheme });
    return restoredColorTheme;
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

    if (!model.lists) model.lists = [];

    model.lists.push({
      listID: id,
      listName: name,
      listItems: items,
    });
    setLists();
  };

  const getListIndex = (id) => {
    return model.lists.findIndex((list) => list.listID === id);
  };

  const getList = (id) => {
    if (!id) return model.lists.find((list) => list.listID === state.listID);
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
    setLists();
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
      setLists();
    },
    statusUpdate(args) {
      const { isDone } = args;
      const listIndex = getListIndex(state.listID);
      const itemIndex = getItemIndex(model.state.itemID);

      // access the list + change item status
      model.lists[listIndex].listItems[itemIndex].isDone = isDone;
      setLists();
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
    getListsFromLS,
    getColorThemeFromLS,
    writeColorThemeToLS,
    sendListsToAPI,
    API,
  };
})();
