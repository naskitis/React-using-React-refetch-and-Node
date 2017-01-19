const { Component } = React;

export default class FavouriteMovies extends Component
{  
   constructor(props) {
     super(props);    
     this.sortMethod="0";
   }

   handleSelect(event)
   {
     event.preventDefault();
     event.stopPropagation();
     this.sortMethod=event.currentTarget.value;
     this.forceUpdate();
     return false;
   }

   handleDelete(event)
   {
     event.preventDefault();
     event.stopPropagation();
     const { deleteMovie } = this.props;
     const movieID = event.currentTarget.getAttribute("data-movieID");
     deleteMovie(movieID);
     return false;
   }

   render()
   { 
     const { savedMovies, deleteMovie } = this.props;
     let movies=[];

     const moviesStored = savedMovies();
     Object.entries(moviesStored).forEach(([key, value]) => {
        movies.push(moviesStored[key]);
     });

     switch(this.sortMethod)
     {
       case '0':
         movies.sort(function(a, b) { return a.Title.localeCompare(b.Title); });
         break;
       case '1':
         movies.sort(function(a, b) { return parseInt(a.Year) - parseInt(b.Year); });
         break;
       case '2':
         movies.sort(function(a, b) { return parseFloat(a.Rating) - parseFloat(b.Rating); });
         break;
       default:
     }

     const tableRows = movies.map(function(movie)
     { 
       let movieImg = movie.Poster;
       if (movieImg == "N/A") movieImg=require("../img/play-movie.png");
       return <tr key={movie.IMDB}><td><img style={{width:'100px'}} src={movieImg} /></td><td style={{width:'90%'}} > {movie.Title} ({movie.Year})<br />IMDB: {movie.Rating}</td><td><button data-movieID={movie.IMDB} onClick={this.handleDelete.bind(this)} className="btn btn-default btn-block">Remove</button></td></tr>;
     }.bind(this));

     const numFav = tableRows.length;
     if (!numFav)
     {
       tableRows.push(<tr key={"1"}><td colSpan="3"><div className="alert alert-info"> You have no favourite movies </div></td></tr>);
     }

     return (
       <div>
         <br />
         <br />
         <hr />
         <h4> Favourites </h4>
         You have {numFav} favourite movies
 
         <br />
         <br />
         <select defaultValue={0} onChange={this.handleSelect.bind(this)} className="form-control">
           <option value="0"> Sort by Title </option>
           <option value="1"> Sort by Year </option> 
           <option value="2"> Sort by Rating </option>
         </select>

         <br />
         <br />
         <br />

         <div className="table-responsive">
           <table className="table table-hover ">
             <tbody>
               {tableRows}
             </tbody>
           </table>
         </div>
       </div>
     );
   }
}
