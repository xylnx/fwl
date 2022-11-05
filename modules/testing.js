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
        listID: '8197761511846935',
        domPos: '5',
        listName: '6',
        listItems: null,
      },
      {
        listID: '810776159846935',
        domPos: '6',
        listName: '7',
        listItems: null,
      },
      {
        listID: '8107761588846935',
        domPos: '7',
        listName: '8',
        listItems: null,
      },
      {
        listID: '81077615846935',
        domPos: '8',
        listName: '9',
        listItems: null,
      },
      {
        listID: '810776155846935',
        domPos: '9',
        listName: '10',
        listItems: null,
      },
      {
        listID: '810776153846935',
        domPos: '10',
        listName: '11',
        listItems: null,
      },
      {
        listID: '810776156446935',
        domPos: '11',
        listName: '12',
        listItems: null,
      },
      {
        listID: '810776156246935',
        domPos: '12',
        listName: '13',
        listItems: null,
      },
      {
        listID: '810776156146935',
        domPos: '13',
        listName: '14',
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
