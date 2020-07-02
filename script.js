const form = document.getElementById('form');
const result = document.getElementById('result');
const body = document.body;


// Display the UI result
function showUi(data, query) {
  result.innerHTML = `
    <a href="${data.href}" target="_blank">NASA API Endpoints for "${query}"</a>
    <p>${data.metadata['total_hits']} Hit</p>
  `;  

  for (let i=0; i<data.items.length; i++) {
    let image;
    try {
      image = data.items[i].links[0]['href']
    } catch(error) {
      console.log(error);
      image = 'vendors/img/alt.jpg';
    }
    result.innerHTML += `
      <div class="col 1-span-of-3">
          <div id="${data.items[i].data[0]['nasa_id']}" class="image-box">
            <img class="img-box" src="${image}" alt="${data.items[i].data[0]['title']}">
            <div class="title">
              ${data.items[i].data[0]['title']}
            </div>
          </div>
          <p>${data.items[i].data[0]['description'].slice(0,30)+'...'}</p>
      </div>
  `;
  }
}

// Search for result match with the input
async function getSearchResult(query) {
  result.innerText = `Searching for "${query}"...`
  const resp = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
  const data = await resp.json();
  data.collection.metadata['total_hits'] > 0 ? showUi(data.collection, query) : result.innerText = `Ther is no result for "${query}"`
}

function onClick(event) {
  const boxId = event.target.parentElement.id;
  fetch(`https://images-api.nasa.gov/search?nasa_id=${boxId}`)
    .then(resp => resp.json())
    .then(data => {
      const title = data.collection.items[0].data[0]['title'];
      const description = data.collection.items[0].data[0]['description'];
      const keyWorlds = data.collection.items[0].data[0]['keywords'];
      
      const descBox = document.createElement('div');
      descBox.className = "descBox";
      // descBox.classList.toggle("hidden")
      const keyWordsList = document.createElement('ul');

      keyWorlds.forEach(keyWord => keyWordsList.innerHTML += ` <li>${keyWord}</li>`);
      descBox.innerHTML = `
        <span class="close">&times;</span>
        <h2>${title} :</h2>
        <p>${description}</p>
        <hr>
        <h3>Key Words :</h3>
      `;

      descBox.appendChild(keyWordsList);
      body.appendChild(descBox);
      body.classList.toggle('bg-on');

      descBox.addEventListener('click', event => {
        if (event.target.tagName === "SPAN") {
          descBox.classList.toggle('hidden');
          body.classList.toggle('bg-on');
        }
      })
    });
};

function onSubmit(event) {
  event.preventDefault();
  const inputVal = event.target.querySelector('input').value;
  event.target.querySelector('input').value = "";
  getSearchResult(inputVal);
};

// Event listeners
form.addEventListener('submit', onSubmit);
result.addEventListener('click', onClick);