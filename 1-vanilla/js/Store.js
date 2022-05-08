import { TabType } from './views/TabView.js';
import { createNextId } from './helpers.js';

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
    this.addHistory(searchKeyword);
  }

  getKeywordList() {
    return this.storage.keywordData;
  }

  getHistoryList() {
    return this.storage.historyData.sort(this._sortHistory);
  }

  _sortHistory(history1, history2) {
    return history2.date - history1.date;
  }

  removeHistory(keyword) {
    this.storage.historyData = this.storage.historyData.filter(
      (history) => history.keyword !== keyword
    );
  }

  addHistory(keyword) {
    keyword = keyword.trim();
    if (!keyword) return;

    const hasHistory = this.storage.historyData.some(
      (history) => history.keyword === keyword
    );
    if (hasHistory) {
      this.removeHistory(keyword);
    }

    const id = createNextId(this.storage.historyData);
    const date = new Date();
    this.storage.historyData.push({ id, keyword, date });
    this.storage.historyData = this.storage.historyData.sort(this._sortHistory);
  }
}
