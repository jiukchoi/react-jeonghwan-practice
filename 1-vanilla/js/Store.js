import { TabType } from './views/TabView.js';

export default class Store {
  constructor(storage) {
    if (!storage) throw 'no storage';

    this.storage = storage;

    this.searchKeyword = '';
    this.searchResult = [];
    this.selectedTab = TabType.KEYWORD;
  }

  search(searchKeyword) {
    this.searchKeyword = searchKeyword;
    this.searchResult = this.storage.productData.filter((product) =>
      product.name.includes(searchKeyword)
    );
  }

  getKeywordList() {
    return this.storage.keywordData;
  }

  getHistoryList() {
    return this.storage.historyData.sort(this._sortHistory);
  }

  _sortHistory(history1, history2) {
    return history2.date > history1.date;
  }
}
