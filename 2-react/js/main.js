import { formatRelativeDate } from './js/helpers.js';
import store from './js/Store.js';

const TabType = {
  KEYWORD: 'KEYWORD',
  HISTORY: 'HISTORY',
};

const TabLabel = {
  [TabType.KEYWORD]: '추천 검색어',
  [TabType.HISTORY]: '최근 검색어',
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      searchKeyword: '',
      searchResult: [],
      submitted: false,
      selectedTab: TabType.KEYWORD,
      keywordList: [],
      historyList: [],
    };
  }

  componentDidMount = () => {
    const keywordList = store.getKeywordList();
    const historyList = store.getHistoryList();
    this.setState({ keywordList, historyList });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.search(this.state.searchKeyword);
  };

  search = (searchKeyword) => {
    const searchResult = store.search(searchKeyword);
    const historyList = store.getHistoryList();

    this.setState({
      searchKeyword,
      searchResult,
      historyList,
      submitted: true,
    });
  };

  handleReset = () => {
    this.setState({
      searchKeyword: '',
      submitted: false,
    });
  };

  handleChangeInput = (e) => {
    const searchKeyword = e.target.value;

    if (searchKeyword.length <= 0 && this.state.submitted) {
      return this.handleReset();
    }

    this.setState({
      searchKeyword,
    });
  };

  handleClickTab = (e) => {
    this.setState({
      selectedTab: e.target.dataset.type,
    });
  };

  handleClickRemoveHistory = (e, keyword) => {
    e.stopPropagation();
    store.removeHistory(keyword);
    const historyList = store.getHistoryList();
    this.setState({
      historyList,
    });
  };

  render() {
    const searchForm = (
      <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          autoFocus
          value={this.state.searchKeyword}
          onChange={this.handleChangeInput}
        />
        {this.state.searchKeyword.length > 0 && (
          <button type="reset" className="btn-reset" />
        )}
      </form>
    );

    const searchResult =
      this.state.searchResult.length > 0 ? (
        <ul className="result">
          {this.state.searchResult.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-box">검색 결과가 없습니다</div>
      );

    const keywordList = (
      <ul className="list">
        {this.state.keywordList.map((item, index) => (
          <li key={item.id} onClick={() => this.search(item.keyword)}>
            <span className="number">{index + 1}</span>
            <span>{item.keyword}</span>
          </li>
        ))}
      </ul>
    );

    const historyList = (
      <ul className="list">
        {this.state.historyList.map(({ id, keyword, date }) => (
          <li key={id} onClick={() => this.search(keyword)}>
            <span>{keyword}</span>
            <span className="date">{formatRelativeDate(date)}</span>
            <button
              className="btn-remove"
              onClick={(e) => this.handleClickRemoveHistory(e, keyword)}
            />
          </li>
        ))}
      </ul>
    );

    const tabs = (
      <>
        <ul className="tabs">
          {Object.values(TabType).map((tabType) => (
            <li
              className={this.state.selectedTab === tabType ? 'active' : ''}
              key={tabType}
              data-type={tabType}
              onClick={this.handleClickTab}
            >
              {TabLabel[tabType]}
            </li>
          ))}
        </ul>
        {this.state.selectedTab === TabType.KEYWORD && keywordList}
        {this.state.selectedTab === TabType.HISTORY && historyList}
      </>
    );

    return (
      <>
        <header>
          <h2 className="container">검색</h2>
        </header>
        <div className="container">
          {searchForm}
          <div className="content">
            {this.state.submitted ? searchResult : tabs}
          </div>
        </div>
      </>
    );
  }
}

const container = document.querySelector('#app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
