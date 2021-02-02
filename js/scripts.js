/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
  */

//----------------------------GLOBAL VARIABLES--------------------------------//
const randUserUrl = 'https://randomuser.me/api/?nat=US&results=12'; //US info only, limit to 12x results
const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-container');
const personData = []; //declare an array to store the returned random user data

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
  gallery.innerHTML = ''; //clear the window of any previous cards
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
  generateModalHTML(data);
}

function generateModalHTML(data) {
  //target the newly-created children (cards) of gallery class
  const cards = gallery.children;
  //loop through list of cards
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i]; //declare var for applicable card in order to 'click'
    //event listener for the selected card:
    card.addEventListener('click', () => {
      //Dynamically insert the required information for selected modal object
      gallery.insertAdjacentHTML('beforeend', `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${data[i].image}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${data[i].fullName}</h3>
                    <p class="modal-text">${data[i].email}</p>
                    <p class="modal-text cap">${data[i].loc}</p>
                    <hr>
                    <p class="modal-text">${data[i].cellNumber}</p>
                    <p class="modal-text">${data[i].address}</p>
                    <p class="modal-text">Birthday: ${data[i].birthday}</p>
                </div>
            </div>
      `);

      addModalToggle(data, i);

      //Close Modal window button
      const modalCloseBtn = document.getElementById('modal-close-btn');
      modalCloseBtn.addEventListener('click', () => {
        gallery.lastElementChild.remove(); //remove it from the screen...
      });
    });
  }
}

//--------------------------------EXTRA FEATURES------------------------------//
//Dynamically add search bar to index.html
function searchList(names) {
  search.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `);
    const searchBtn = document.querySelector('.search-submit');
    const searchBar = document.querySelector('.search-input');
    //search using finder button
    searchBtn.addEventListener('click', (e) => { //target the search button
      filterNames(names);
    });
    //Live/active search using 'keyup' event
    searchBar.addEventListener('keyup', (e) => { //target the search button
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
    gallery.innerHTML = '<h1>No results found.</h1>'; //let the user know
  } else {
    generateGalleryHTML(filteredList);
  }
}

//modal toggle
function addModalToggle(data, index) {
  //TODO: Figure out how to harness the index of data and feed it to the generateModalHTML() function for switching cards
  // data.next;
  // console.log(data.next);
  // console.log(index)

  //extra feature - cycle between cards
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
    console.log('Clicked Previous');
    gallery.lastElementChild.remove(); //remove it from the screen...
  });
  modalNext.addEventListener('click', () => {
    console.log('Clicked Next');
    gallery.lastElementChild.remove(); //remove it from the screen...
  });
}

//--------------------------------CALL FUNCTIONS------------------------------//
getUserList(randUserUrl) // get the user postData
  .then(mapData)          // Pass the data to generateHTML()

searchList(personData); //create search function to search through the list of users
