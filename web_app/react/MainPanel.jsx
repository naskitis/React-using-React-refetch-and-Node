import { connect, PromiseState } from 'react-refetch';
import store from 'store';

import SearchBar from './SearchBar.jsx';
import FavouriteMovies from './FavouriteMovies.jsx';

const { Component } = React;

require("../scss/bootstrap.scss");

function customFetch(input, init) {
  return fetch(input.url);
}

class MainPanel extends Component
{ 
  updateMovieRating(imdb, rating)
  { 
    let obj = store.get(imdb);
    if (typeof obj !== 'undefined') 
    {
      obj.Rating = rating;
      store.set(imdb, obj);
    }
  }

  saveMovie(movie) { 
    store.set(movie.IMDB, movie);
    this.props.fetchRating(movie.IMDB);
  }

  deleteMovie(movieID) { 
    store.remove(movieID);
    this.forceUpdate();
  }

  savedMovies() { 
    return store.getAll();
  }

  render()
  {
    const { movieResults, movieRating  } = this.props;
 
    if ((typeof movieRating !== 'undefined') && (movieRating.fulfilled)) {
      this.updateMovieRating(movieRating.value.imdbID, movieRating.value.imdbRating);
    }

    return(
      <div className="container">
        <div className="form-group row">
          <div className="col-12">
            <br /> <br />
            <h3> Search Movies </h3>
            <SearchBar fetchMovies={this.props.fetchMovies} movieResults={movieResults} saveMovie={this.saveMovie.bind(this)} />
            <br />
            <br />
            <FavouriteMovies savedMovies={this.savedMovies} deleteMovie={this.deleteMovie.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect.defaults({ fetch: customFetch })(props => {
  return {
    fetchRating: imdb => ({
      movieRating: {
        url: `http://www.omdbapi.com/?i=${imdb}&r=json`,
        force: true,
        refreshing: true
      }
    }),
    fetchMovies: query => ({
      movieResults: {
        url: `http://www.omdbapi.com/?s=${query}&r=json`,
        force: true, 
        refreshing: true,
        then: (data) => {
          if ((data.Response === "True") && data.Search)
          {
            data.Search = data.Search.map((item) => ({Title:item.Title,Year:item.Year,IMDB:item.imdbID,Poster:item.Poster,Rating:"Loading ..."}));
          }
          return { value: data };
        }
      }
    })
  }
})(MainPanel);