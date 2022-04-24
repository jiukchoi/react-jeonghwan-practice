export default class Store {
  constructor(storage) {
    if (!storage) throw 'no storage';

    this.storage = storage;

    this.searchKeyword = '';
    this.searchResult = [];
  }

  search(searchKeyword) {
    this.searchKeyword = searchKeyword;
    this.searchResult = this.storage.productData.filter((product) =>
      product.name.includes(searchKeyword)
    );
  }
}
