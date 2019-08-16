import React from 'react';
import logo from './logo.svg';
import './App.css';

function isSearched(searchTerm) {
  return function (item) {
    if (!item.title) {
      return false;
    }
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }
}

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: null,
      searchTerm: ''
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ list: result });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => console.log(error));
  }

  onDismiss(id) {
    const isNotId = item => item.objectID != id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, list } = this.state;

    if (!list) { return null; }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>
            Поиск
          </Search>
        </div>
        <Table
          list={list.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends React.Component {
  render() {
    const { value, onChange, children } = this.props;

    return (
      <form>
        {children} <input type="text"
          onChange={onChange}
          value={value}
        />
      </form>
    );
  }
}

class Table extends React.Component {
  render() {
    const { list, pattern, onDismiss } = this.props;

    return (
      <div className="table">
        {list.filter(isSearched(pattern)).map(item => {
          return (
            <div key={item.objectID} className="table-row">
              <span>
                <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <Button
                  onClick={() => onDismiss(item.objectID)}
                  className="button-inline"
                >
                  Удалить
              </Button>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

class Button extends React.Component {
  render() {
    const { onClick, className = '', children } = this.props;

    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}

export default App;
