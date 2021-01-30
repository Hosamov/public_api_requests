const randUserUrl = 'https://randomuser.me/api/?nat=US&results=12';
const gallery = document.querySelector('.gallery');

//async function to return a promise resolved by parsing the body text as JSON
async function getJSON(url) {
  try {
    const res = await fetch(randUserUrl);
    return await res.json(); //return a promise
  } catch (error) { //catch any errors
    throw (error);
  }
}

//async function to gather user data required to be displayed from api
async function getUserList(url) {
    try {
      const randomUserJSON = await getJSON(url); //get a Promise by calling getJSON()
      //map out data from randomUserJSON in order to use the information
      const profiles = randomUserJSON.results.map(person => {
        const image = person.picture.large;
        const fullName = `${person.name.first} ${person.name.last}`;
        const email = person.email;
        const loc = `${person.location.city}, ${person.location.state}`;
        const cellNumber = person.cell;
        const address = `${person.location.street.number} ${person.location.street.name}, ${loc} ${person.location.postcode}`;
        const birthday = parseInt(person.dob.age);

        //return all collected data var names for future use (see generateHTML())
        return { image, fullName, email, loc, cellNumber, address };
      });
      return Promise.all(profiles); //return profiles variable
    } catch (error) {
      gallery.innerHTML = `<h1>An error occurred while fetching data.</h1>
      <h2>Please try again in a moment. If the error persists, please contact the webmaster.</h2>
      `
    }
  }
  //TODO: add array to store mapped vars
  const personData = [];

  //Function to generate HTML data to div element with id of 'gallery'
  function generateGalleryHTML(data) {
    data.map(person => {
      personData.push(person);
      //Dynamically insert required data for 12 random user cards
      gallery.insertAdjacentHTML('beforeend', `
      <div class="card">
          <div class="card-img-container">
              <img class="card-img" src="${person.image}" alt="profile picture">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${person.fullName}</h3>
              <p class="card-text">${person.email}</p>
              <p class="card-text cap">${person.loc}</p>
          </div>
      </div>
      `);
    });



      const cards = gallery.children;
      for(let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.addEventListener('click', () => {
          console.log('card ' + i + ' was clicked');
          //Dynamically insert information for selected modal object
          gallery.insertAdjacentHTML('beforeend', `
          <div class="modal-container">
              <div class="modal">
                  <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                  <div class="modal-info-container">
                      <img class="modal-img" src="${personData[i].image}" alt="profile picture">
                      <h3 id="name" class="modal-name cap">name</h3>
                      <p class="modal-text">${personData[i].email}</p>
                      <p class="modal-text cap">${personData[i].loc}</p>
                      <hr>
                      <p class="modal-text">${personData[i].cellNumber}</p>
                      <p class="modal-text">${personData[i].address}</p>
                      <p class="modal-text">Birthday: ${personData[i].birthday}</p>
                  </div>
              </div>
          `);
          const modalContainer = document.querySelector('#modal-container');
          const modalCloseBtn = document.getElementById('modal-close-btn');
          modalCloseBtn.addEventListener('click', (e) => {
            console.log('closed');
            gallery.lastElementChild.remove();
          });
        });

      }
    }

    //Function to generate Modal HTML data to div element with id of 'gallery'
    function generateModalHTML(data) {

    }

    getUserList(randUserUrl) //1. get the user postData
      .then(generateGalleryHTML) //2. Pass the data to generateHTML()
