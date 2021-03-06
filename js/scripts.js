/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 */

//----------------------------GLOBAL VARIABLES--------------------------------//
const randUserUrl = 'https://randomuser.me/api/?nat=US&results=12'; //US info only, limit to 12x results
const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-container');
const personData = []; //declare an array to store the returned random user data
let canToggle = false; //declare var to track determine when modal window can toggle

//----------------------------------FETCH DATA--------------------------------//
//async function to return a promise resolved by parsing the body text as JSON
async function getJSON(url) {
  try {
    const res = await fetch(randUserUrl);
    return await res.json(); //return a promise
  } catch (error) { //catch any errors
    throw (error);
  }
}

//-------------------------------HELPER FUNCTIONS-----------------------------//
//Convert the date to the proper format(MM/DD/YYYY)
function dateConverter(date) {
  const newDate = new Date(date);
  return new Intl.DateTimeFormat('en-US').format(newDate);
}

//Convert the cell number into the proper format (xxx) xxx-xxxx
//Credit: https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
function phoneNumConverter(num) {
  let nonDigits = (num).replace(/\D/g, ''); //target, replace non-digit characters so we are left with numbers only
  let number = nonDigits.match(/^(\d{3})(\d{3})(\d{4})$/); //organize/"match" numbers into three groups (3,3,4)
  if(number) {
    return `(${number[1]}) ${number[2]}-${number[3]}`; //correctly format the phone number '(xxx) xxx-xxxx'
  }
}

//async function to gather user data required to be displayed from api
async function getUserList(url) {
  try {
    //generate 12 random users pulled from the API in a single request
    const randomUserJSON = await getJSON(url); //get a Promise by calling getJSON()
    //map out data from randomUserJSON in order to use the information
    const profiles = randomUserJSON.results.map(person => {
      const image = person.picture.large;
      const fullName = `${person.name.first} ${person.name.last}`;
      const email = person.email;
      const loc = `${person.location.city}, ${person.location.state}`;
      const cellNumber = phoneNumConverter(person.cell); //Convert to proper format: (xxx) xxx-xxxx
      const address = `${person.location.street.number} ${person.location.street.name}, ${loc} ${person.location.postcode}`;
      const birthday = dateConverter(person.dob.date); //Convert to format: MM/DD/YYYY

      //return all collected data var names for future use (see generateGalleryHTML())
      return { image, fullName, email, loc, cellNumber, address, birthday };
    });
    return Promise.all(profiles); //return profiles variable
  } catch (error) {
    gallery.innerHTML = `<h1>An error occurred while fetching data.</h1>
      <h2>Please try again in a moment. If the error persists, please contact the webmaster.</h2>`
  }
}

//Function to generate HTML data to div element with id of 'gallery'
function mapData(data) {
  data.map(person => {
    personData.push(person); //store all the person data in personData array
  });
  generateGalleryHTML(data);
}

function generateGalleryHTML(data){
  gallery.innerHTML = ''; //clear the window of any previous cards (start from scratch)
  //Dynamically insert required data for 12 random user cards
  for (let i = 0; i < data.length; i++) {
    gallery.insertAdjacentHTML('beforeend', `
      <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${data[i].image}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${data[i].fullName}</h3>
              <p class="card-text">${data[i].email}</p>
              <p class="card-text cap">${data[i].loc}</p>
          </div>
      </div>
      `);
  }
  generateModalHTML(data); //initial call to generateModalHTML
}

function generateModalHTML(data, index) {
  //console.log(index);
  if(index === undefined) index = 0; //if no index argument, set index to 0
  //target the newly-created children (cards) of gallery class
  const cards = gallery.children;
  //loop through list of cards
  if(index === 0 && !canToggle) {
    for (let i = index; i < cards.length; i++) {
      let card = cards[i]; //declare var for applicable card in order to 'click'
      //event listener for the selected card:
      card.addEventListener('click', () => {
        addModalData(data, i); //Dynamically insert modal HTML
      });
    }
  } else {
    if(index < 0) index = (cards.length - 2); //cards will equal 13 due to utilizing insertAdjacentHTML
    if(index > cards.length -2) index = 0; //recycle back through shown cards when at max index val
    gallery.lastElementChild.remove(); //remove the previous card
    addModalData(data, index); //add the new card to the modal window
  }
}

function addModalData(data, index) {
    //Dynamically insert the required information for selected modal object
    gallery.insertAdjacentHTML('beforeend', `
      <div class="modal-container">
          <div class="modal">
              <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
              <div class="modal-info-container">
                  <img class="modal-img" src="${data[index].image}" alt="profile picture">
                  <h3 id="name" class="modal-name cap">${data[index].fullName}</h3>
                  <p class="modal-text">${data[index].email}</p>
                  <p class="modal-text cap">${data[index].loc}</p>
                  <hr>
                  <p class="modal-text">${data[index].cellNumber}</p>
                  <p class="modal-text">${data[index].address}</p>
                  <p class="modal-text">Birthday: ${data[index].birthday}</p>
              </div>
          </div>
    `);

    addModalToggle(data, index); //declared in Extra features section

    //Close Modal window button
    const modalCloseBtn = document.getElementById('modal-close-btn');
    modalCloseBtn.addEventListener('click', () => {
      gallery.lastElementChild.remove(); //remove it from the screen...
    });
  //});
}

//--------------------------------EXTRA FEATURES------------------------------//
//modal toggle
function addModalToggle(data, index) {
  canToggle = true;
  //const prev = index--;
  //const next = index++;

  //dynamically add HTML for prev and next buttons to modal window
  const modal = document.querySelector('.modal');
  modal.insertAdjacentHTML('beforeend', `
      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>
  `);

  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  modalPrev.addEventListener('click', () => {
    index--;
    generateModalHTML(data, index--); //show previous card
  });
  modalNext.addEventListener('click', () => {
    index++;
    generateModalHTML(data, index++); //show next card
  });
}

//Function to dynamically add search bar to index.html
function searchList(names) {
  search.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `);
    const searchBtn = document.querySelector('.search-submit');
    const searchBar = document.querySelector('.search-input');
    //search using click handler on search button element
    searchBtn.addEventListener('click', (e) => { //target the search button
      filterNames(names);
    });
    //Live/active search using 'keyup' event handler
    searchBar.addEventListener('keyup', (e) => { //target the search bar
      filterNames(names);
    });
}

function filterNames(names) { //call list parameter
  const searchInputValue = document.querySelector('#search-input').value.toLowerCase(); //target input id of 'search-input' and convert its value to lower case
  let filteredList = []; //Create a new array to hold the filtered results, below
  for (let i = 0; i < personData.length; i++) {
    //check to see if the full name matches any or all of the search input
    if (personData[i].fullName.toLowerCase().includes(searchInputValue)) { //convert name to lowerCase and check against search input value
      filteredList.push(names[i]); //if it's a "match" add it to filteredList array
    }
  }

  if (filteredList.length === 0) { //Check to see if there are no matches
    gallery.innerHTML = '<h1>No search results found.</h1>'; //let the user know
  } else {
    canToggle = false; //set to false to prevent generateModalHTML() from automatically opening the modal window
    generateGalleryHTML(filteredList);
  }
}

//--------------------------------CALL FUNCTIONS------------------------------//
getUserList(randUserUrl) //get the user postData
  .then(mapData)         //pass the data to generateHTML()

searchList(personData); //add a search bar
