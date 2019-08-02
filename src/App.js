import React from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
  },
  {
    title: 'Angular',
    url: 'https://angular.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 5,
    points: 6,
    objectID: 2
  }
];

function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: list,
      searchTerm: ''
    }

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID != id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {
    const {searchTerm, list} = this.state;

    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        <Table
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

class Search extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return(
      <form>
          <input type="text"
            onChange={onChange}
            value={value}
          />
      </form>
    );
  }
}

class Table extends React.Component {
  render() {
    const {list, pattern, onDismiss} = this.props;

    return(
      <div>
        {list.filter(isSearched(pattern)).map(item => {
        return (
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button onClick={() => onDismiss(item.objectID)}
                type="button"
              >
                Удалить
              </button>
            </span>
          </div>
        );
      })}
      </div>
    );
  }
}

export default App;
