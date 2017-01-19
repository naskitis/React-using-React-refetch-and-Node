
const { Component } = React;
import AutoComplete from './AutoComplete.jsx';
import Loader from  './Loader.jsx';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);    
    this.timer = null;
    this.debounceTimerDelay = this.props.debounceTimerDelay;
    this.searchBar = this.props.searchBarDefault;
  }

  clearSearchBar()
  {
    this.searchBar.value="";
    this.props.fetchMovies(this.searchBar.value);
  }

  handleChange(event) {
    event.preventDefault();
    event.stopPropagation();

    const { fetchMovies } = this.props;

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer=null;
    }

    const query = event.target.value;
    this.timer = setTimeout(function() {
      fetchMovies(query);
      this.timer=null;
    }.bind(this), this.debounceTimerDelay);
    return false;
  }

  render() {
    const { movieResults } = this.props;
    const components = [];

    if ((typeof movieResults === 'undefined') || (this.searchBar.value === "")) {
      ;
    }
    else if (movieResults.pending || movieResults.refreshing) {
      components.push(<Loader key={"1"} />);
    }
    else if (movieResults.fulfilled) {
      components.push(<AutoComplete key={"2"} movieResults={movieResults.value} clearSearch={this.clearSearchBar.bind(this)} saveMovie={this.props.saveMovie} />);
    }

    return (
      <div>
        <input className="form-control form-control-lg" 
               title="Enter a movie title" 
               alt="Enter a movie title" 
               type="text" 
               ref={(input) => { this.searchBar = input; }}
               onChange={this.handleChange.bind(this)} />
        <br />
        {components}
      </div>
    );
  }
}
SearchBar.defaultProps = { searchBarDefault: { value: "" }, debounceTimerDelay: 500 };
