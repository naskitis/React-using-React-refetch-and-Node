const { Component } = React;

export default class AutoComplete extends Component {
  addMovie(event) {
    event.preventDefault();
    event.stopPropagation();
    const { saveMovie, clearSearch } = this.props;
    const movieObj = JSON.parse(event.currentTarget.getAttribute("data-movie"));

    saveMovie(movieObj);
    clearSearch();
    return false;
  }

  render() {
    const { movieResults, clearSearch } = this.props;

    if (movieResults.Response === "False") {
      return (<div className="alert alert-danger" role="alert"> {movieResults.Error} </div>);
    }

    const tableRows = movieResults.Search.map(function(item) {
      const strObj = JSON.stringify(item);
      return <tr key={item.IMDB}><td style={{ width:'90%' }}>{item.Title}<br /><small>({item.Year})</small></td><td><button onClick={this.addMovie.bind(this)} data-movie={strObj} className="btn btn-success btn-block">Add</button></td></tr>;
    }.bind(this));

    return (
      <div>
        <button onClick={clearSearch} type="button" className="close pull-right" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="table-responsive">
          <table className="table table-inverse table-striped table-hover table-bordered">
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
        <hr />
        <small>Found {movieResults.totalResults} movies | The first {movieResults.Search.length} are shown  </small>
      </div>
    );
  }
}
