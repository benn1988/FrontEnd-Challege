let list = document.getElementById("artists");
let artistUrlBase ='https://www.theaudiodb.com/api/v1/json/1/search.php?s='; // base url for getting artist name
let albumUrlBase = "https://theaudiodb.com/api/v1/json/1/album.php?i="; // base url for getting albums

document.getElementById("searchBtn").onclick = function() {getData(artistUrlBase, 1)}; // passing artist url and 1 to indicate that it is an artist fetch

async function getData(url, artist, event) { //main fn to fetch data
  let finalUrl = artist ? url + document.getElementById("searchBox").value.trim() : url + event.target.getAttribute("id"); // final url depending if it is artist or album request
  fetch(finalUrl)
  .then(status)
  .then(json)
  .then(function(data) {
    if (data.artists || data.album) { // checking if result not null
      if (data.artists) { // handling artist fetch
        removeAllChildNodes(list); // remove previous artists
        data.artists.forEach(artist => { // adding all artists names 
          let li = document.createElement("li");
          li.innerHTML = artist.strArtist + "<br>";
          li.setAttribute("id", artist.idArtist);
          list.appendChild(li); 
        });
      } else if (data.album) { // handling album fetch
        data.album.forEach(album => { // adding album names
          let span = document.createElement("span");
          span.innerHTML = album.strAlbum + "<br>";
          event.target.appendChild(span);
        })
      }
    } else {
      alert("No result"); // handle no result returned
    }

  }).catch(function(error) { // catch any response errors
    console.log('Request failed', error);
  });
}

// helper fn to check response status
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

// json-ify the response
function json(response) {
  return response.json()
}
// helper fn to remove existing results from page
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
