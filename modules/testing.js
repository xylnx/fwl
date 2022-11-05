const testing = (function () {
  showTestData = ({ DOMStrings }) => {
    const testLists = [
      {
        listID: '491576615309313',
        domPos: '0',
        listName: '1',
        listItems: [
          { itemName: 'Test item 1', itemID: '405111563634750', isDone: false },
          { itemName: 'Test item 2', itemID: '613242526685035', isDone: false },
          { itemName: 'Test item 3', itemID: '619582700464144', isDone: false },
          { itemName: 'Test item 4', itemID: '268696937085884', isDone: false },
        ],
      },
      {
        listID: '672486483285118',
        domPos: '1',
        listName: '2',
        listItems: null,
      },

      {
        listID: '816776156846935',
        domPos: '2',
        listName: '3',
        listItems: null,
      },
      {
        listID: '812776156846935',
        domPos: '3',
        listName: '4',
        listItems: null,
      },
      {
        listID: '810776156846935',
        domPos: '4',
        listName: '5',
        listItems: null,
      },
      {
        listID: '819776156846935',
        domPos: '5',
        listName: '6',
        listItems: null,
      },
    ];

    model.lists = testLists;
    view.renderLists({ lists: model.getLists(), DOMStrings: DOMStrings });
  };

  return {
    showTestData,
  };
})();
