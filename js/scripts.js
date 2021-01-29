const randUserUrl = 'https://randomuser.me/api/?nat=US&results=12';

//async function to return a promise resolved by parsing the body text as JSON
async function getJSON(url) {
  try {
    const res = await fetch(randUserUrl);
    return await res.json(); //return a promise
  } catch (error) { //catch any errors
    throw(error);
  }
}

//async function to gather user data required to be displayed from api
async function getUserList(url) {
  const randomUserJSON = await getJSON(url); //get a Promise by calling getJSON()
  //map out data from randomUserJSON in order to use the information
  const profiles = randomUserJSON.results.map(person => {
    const image = person.picture.large;
    const fullName = `${person.name.first} ${person.name.last}`;
    const email = person.email;
    const location = `${person.location.city}, ${person.location.state}`;

    //return all collected data var names for future use (see generateHTML())
    return { image, fullName, email, location };
  });
  return Promise.all(profiles); //return profiles variable
}

//Function to generate HTML data to div element with id of 'gallery'
function generateHTML(data) {
  data.map( person => {
    const gallery = document.querySelector('.gallery');
    gallery.insertAdjacentHTML('beforeend', `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${person.image}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${person.fullName}</h3>
            <p class="card-text">${person.email}</p>
            <p class="card-text cap">${person.location}</p>
        </div>
    </div>
    `);
  });
}

getUserList(randUserUrl) //1. get the user postData
  .then(generateHTML)    //2. Pass the data to generateHTML()
