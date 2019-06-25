'use strict';

// put your own value below!
const apiKey = 'v1HeMYCkHelp7mdy8OcC4CPK3Q5XZd7ZLWrg1Roi';
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const exampleCall = 'https://developer.nps.gov/api/v1/parks?stateCode=MA%2CCA&limit=10&q=q&api_key=v1HeMYCkHelp7mdy8OcC4CPK3Q5XZd7ZLWrg1Roi';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}


function getParkList(searchTerm,maxResults) {
  const params = {
    q: 'q',
    stateCode: searchTerm,
    limit: maxResults,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

fetch(url)
  .then(response => {
      if (response.ok) {
          return response.json();
      }
      throw new Error(response.statusText);
  })
  .then(responseJson => displayResults(responseJson))
  .catch(err => {
      $('.park-Group').empty();
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
  });
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.park-Group').empty();
  $('#results').removeClass('hidden');
  // iterate through the items array
  const noResults = !responseJson || (responseJson && !responseJson.data.length);

  if (noResults) {
    $('#park-Group').append('No reslts found');
    return;
  }

  /*const resultList = responseJson.data.map(({snippet = {}}) => 
  `<li><h3>${snippet.name}</h3>
  <p>${snippet.description}</p>
  <p> Park Website: <a href="${snippet.thumbnails.default.url}" target="_blank">${snippet.thumbnails.default.url}</p>
  </li>`
  ).join('');*/
  const jsonLength = responseJson.data.length;
  for (let i = 0; i < jsonLength; i++) {
    const jsonIndex = responseJson.data[i];
    $('#park-Group').append(
      `<h1>${jsonIndex.name} (${jsonIndex.states})</h1>
        <p>${jsonIndex.description}</p>
        <p> Park Website: <a href="${jsonIndex.url}" target="_blank">${jsonIndex.url}</p>`
    )
  }

  /*$('#park-Group').append(resultList);*/
  //display the results section  
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkList(searchTerm, maxResults);
  });
}

$(watchForm);