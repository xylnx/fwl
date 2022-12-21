/**
 * @module model
 * @description Contains data structures and methods to perform or assist CRUD operations on these structures. It also contains functions to persist and get data to/fro local storage and an API.
 * @author xylnx
 * @see <a href="https://github.com/xylnx">https://github.com/xylnx</a>
 */
const model = (function () {
  /** Figure out, if the App runs locally or live, then set API endpoints accordingly.
   * @memberof module:model
   * */
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
      root: 'https://fwl.0b101010.site/api/v1',
      authUrl: 'https://fwl.0b101010.site/api/v1/auth',
      refreshUrl: 'https://fwl.0b101010.site/api/v1/refresh',
      logoutUrl: 'https://fwl.0b101010.site/api/v1/logout',
    };
  }

  // DATA
  /**
   * An array containing all list objects.
   * @type {Object[]}
   * @memberof module:model
   */
  let lists = [];

  // KEYS FOR LOCAL STORAGE
  /**
   * The name of the key used to store lists in local storage.
   * @type {string}
   * @memberof module:model
   */
  const listsLSKey = 'fwlLists';
  /**
   * The name of the key used to store the current color scheme in local storage.
   * @type {string}
   * @memberof module:model
   */
  const colorThemeKey = 'fwlColorTheme';

  // TODO: Document all values + fns.
  /**
   * Application state and a method to update this state.
   * @type {Object}
   * @memberof module:model
   */
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
    dropPos: '0',
    dragPos: '0',
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
        dropPos = this.dropPos,
        dragPos = this.dragPos,
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
      this.dropPos = dropPos;
      this.dragPos = dragPos;
      console.log('STATE:', this);
    },
  };

  /**
   * Calls functions which return lists {@link module:model.getListsFromLS | from LS} or {@link module:model.getListsFromAPI | the API}.
   * @param {Object.<boolean> | undefined} [opts] define if lists should be returned from LS or API, return {@link module:model.lists} if undefined
   * @returns {Object[]}  {@link module:model.lists} only returned, if param is `undefined`
   * @memberof module:model
   * @todo Do not allow to set both (API + LS) to true at the same time.
   */
  const getLists = (opts = {}) => {
    const { LS, API } = opts;
    if (!LS && !API) return model.lists;
    if (LS) return getListsFromLS();
    if (API) return getListsFromAPI();
  };

  /** Calls functions which persist lists to {@link module:model.sendListsToAPI | the API} or {@link module:model.saveListsToLS | local storage}. This is done using values from {@link module:model.state}: state knows if the App currently persists to LS or API.
   * @memberof module:model
   */
  const setLists = () => {
    if (state.useAPI) sendListsToAPI();
    if (!state.useAPI) saveListsToLS();
  };

  /** Fetches lists from the API and sets {@link module:model.lists}.
   * @memberof module:model
   */
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

  /**
   * Persists list to the API.
   * @memberof module:model
   */
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

  /**
   * Fetches lists from local storage, sets and returns {@link module:model.lists}.
   * @returns {Object[]} {@link module:model.lists}
   * @see {module:model.readFromLocalStorage}
   * @memberof module:model
   */
  const getListsFromLS = () => {
    // Return lists stored in local storage
    const restoredLists = readFromLocalStorage(listsLSKey);
    if (!restoredLists) return null;
    model.lists = restoredLists;
    return model.lists;
  };

  /** Persists {@link module:model.lists} to local storage.
   * @see {module:model.listsLSKey}
   * @see {module:model.writeToLocalStorage}
   * @memberof module:model
   */
  const saveListsToLS = () => {
    writeToLocalStorage({ [listsLSKey]: model.lists });
  };

  /** Persists current color scheme to local storage.
   * @see {module:model.colorThemeKey}
   * @see {module:model.writeToLocalStorage}
   * @memberof module:model
   */
  const writeColorThemeToLS = () => {
    writeToLocalStorage({ [colorThemeKey]: model.state.colorTheme });
  };

  /** Fetches color scheme names from local storage, updates {@link module:model.state} and returns the restored color scheme.
   * @returns {string} restoredColorTheme - name of a color scheme
   * @see {module:model.colorThemeKey}
   * @see {module:model.readFromLocalStorage}
   * @see {module:model.state.update}
   * @see {module:model.state.colorTheme}
   * @memberof module:model
   */
  const getColorThemeFromLS = () => {
    const restoredColorTheme = readFromLocalStorage(colorThemeKey);
    console.log(restoredColorTheme);
    if (!restoredColorTheme) return null;
    model.state.update({ colorTheme: restoredColorTheme });
    return restoredColorTheme;
  };

  /** Creates a pseudo ID. It is unlikely (but not impossible) to end up with two identical ids using this function.
   * @returns {string}
   * @memberof module:model
   */
  const _getId = () => Math.floor(Math.random() * 1e15).toString();

  /** Persists data to local storage.
   * @param {Object.<string | Object>} data key value pairs, e.g {myKey: myData}.
   * @memberof module:model
   */
  const writeToLocalStorage = (data) => {
    const keys = Object.keys(data);
    keys.map((key) => {
      const json = JSON.stringify(data[key]);
      window.localStorage.setItem(key, json);
    });
  };
  /** Get data from local storage and parse it.
   * @param {string} key the key assotiated with JSON stored in local storage.
   * @memberof module:model
   */
  const readFromLocalStorage = (key) => {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  };

  /**
   * Adds a new list to the lists array.
   * @param {Object} data data to create a list item, contains e.g. its name.
   * @memberof module:model
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

  /** Finds the index of a list in {@link module:model.lists}.
   * @param {string} id the id of a list
   * @returns {number} index of a list in {@link module:model.lists}
   * @memberof module:model
   */
  const getListIndex = (id) => {
    return model.lists.findIndex((list) => list.listID === id);
  };

  /** Return a list from {@link.model.lists}.
   * @param {string} id the id of a list.
   * @returns {Object} a list
   * @memberof module:model
   * */
  const getList = (id) => {
    if (!id) return model.lists.find((list) => list.listID === state.listID);
    const list = model.lists.find((list) => list.listID === id);
    return list;
  };

  /** Return the index of an item in a list.
   * @param {Object.<string>} [args]
   * @param {string | udefined} [args.listID] if undefined {@link module:model.state.listID} is used
   * @param {string | udefined} [args.itemID] if undefined {@link module:model.state.itemID} is used
   * @returns {number} index of a list item
   * @memberof module:model
   */
  const getItemIndex = (args) => {
    const { listID = state.listID, itemID = state.itemID } = args;
    const list = getList(listID);
    return list.listItems.findIndex((item) => item.itemID === itemID);
  };

  /** Remove a list from {@link module:modle.lists}.
   * @param {string} id ID of the list, which should be deleted
   * @see {module:model.setLists}
   * @memberof: module:model
   */
  const removeList = (id) => {
    const index = getListIndex(id);
    model.lists.splice(index, 1);
    setLists();
  };

  /** Update the position of an item (list or list item) in the DOM. Used to facilitate {@link module:dragAndDrop | drag and drop}.
   * @param {Object.<string>}
   * @param {string} id id of the list, or the item to be updated
   * @param {string} newPos the new DOM position of the item
   * @see {module:model.setLists}
   * @todo Do not call setLists after updating each individual item.
   * @memberof module:model
   */
  const updateDomPos = ({ id = null, newPos = null }) => {
    if (!id || !newPos) return;

    // List overview
    if (state.view === 'overview') {
      model.lists[getListIndex(id)].domPos = newPos;
    }
    // List items
    if (state.view === 'list') {
      const list = model.getList();
      const item = list.listItems[getItemIndex({ itemID: id })];
      list.listItems[getItemIndex({ itemID: id })].domPos = newPos;
    }
    // Persist lists (LS or API)
    setLists();
  };

  /** Functions to add and update list items.
   * @memberof module:model
   */
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
    updateDomPos,
  };
})();
