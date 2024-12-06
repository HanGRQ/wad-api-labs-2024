export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=e0a23ced8716630906cbfb3c490ac3e9&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };