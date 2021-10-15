// Foursquare API Info
const clientId = ''; //add clientId key here
const clientSecret = ''; //add clientSecret key here
const url = 'https://api.foursquare.com/v2/venues/explore?near='; //API endpoint

// OpenWeather API Info
const openWeatherKey = ''; //add API key here
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'; //API endpoint

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $weatherDiv = $("#weather1");
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


// GETTING DATA from FOURSQUARE with an AJAX function
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = url + city + '&limit=10&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20200219'; //entire req URL

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json(); //converting the response obj to a JSON obj
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue); //saving some data of the JSON obj into a variable
      return venues;
    }
  } catch (error) {
      console.log(error);
    }
}; //async funct returning a Promise


// GETTING DATA from OPENWEATHER with an AJAX funcion
const getForecast = async () => {
  const urlToFetch = weatherUrl + '?&q=' + $input.val() + '&APPID=' + openWeatherKey; //entire req URL

  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const jsonResponse = await response.json(); //converting the response obj to a JSON obj
      return jsonResponse;
    }
  } catch(error) {
      console.log(error);
    }
}; //async funct returning a Promise


// RENDERING DATA FUNCTION from FOURSQUARE API
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    //Using HTML template in helpers.js:
    /*const createVenueHTML = (name, location, iconSource) => {
       return `<h2>${name}</h2>
       <img class="venueimage" src="${iconSource}"/>
       <h3>Address:</h3>
       <p>${location.address}</p>
       <p>${location.city}</p>
       <p>${location.country}</p>`;
      } */
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
};

// RENDERING DATA FUNCTION from OPENWEATHER API
const renderForecast = (day) => {
  const weatherContent = createWeatherHTML(day);
  //Using HTML template in helpers.js:
  /*const createWeatherHTML = (currentDay) => {
      console.log(currentDay)
      return `<h2>${weekDays[(new Date()).getDay()]}</h2>
	    <h2>Temperature: ${kelvinToFahrenheit(currentDay.main.temp)}&deg;F</h2>
	    <h2>Condition: ${currentDay.weather[0].description}</h2>
      <img src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png">`;
    }
    const kelvinToFahrenheit = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);*/
  $weatherDiv.append(weatherContent);
};

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
};

$submit.click(executeSearch)
