const express = require('express');
const { resolve } = require('path');

const hotels = require('./hotels.js');

const app = express();
const port = 3000;

let cors = require('cors');
app.use(cors());


function highToLow(sortParam) {
  return function sort(obj1, obj2) {
    return obj2[sortParam] - obj1[sortParam];
  };
}

function lowToHigh(sortParam) {
  return function sort(obj1, obj2) {
    return obj1[sortParam] - obj2[sortParam];
  };
}

function wrapperFunction(sortParam, compareFun) {
  return compareFun(sortParam);
}

function handleSort(isSortByLowToHigh, sortParam) {
  let hotelsCopy = hotels.slice();
  if (isSortByLowToHigh) {
    return hotelsCopy.sort(wrapperFunction(sortParam, lowToHigh));
  }
  return hotelsCopy.sort(wrapperFunction(sortParam, highToLow));
}
// sort
// Endpoint 1: Get the hotels sorted by pricing
// <http://localhost:3000/hotels/sort/pricing?pricing=low-to-high>

app.get('/hotels/sort/pricing', (req, resp) => {
  let isSortByLowToHigh = req.query.pricing === 'low-to-high' ? true : false;
  resp.json(handleSort(isSortByLowToHigh, 'price'));
});

// Endpoint 2: Get the hotels sorted based on their Ratings
// <http://localhost:3000/hotels/sort/rating?rating=low-to-high>

app.get('/hotels/sort/rating', (req, resp) => {
  let isSortByLowToHigh = req.query.rating === 'low-to-high' ? true : false;
  resp.json(handleSort(isSortByLowToHigh, 'rating'));
});

// Endpoint 3: Get the Hotels sorted based on their Reviews
// <http://localhost:3000/hotels/sort/reviews?reviews=least-to-most>

app.get('/hotels/sort/reviews', (req, resp) => {
  let isSortByLowToHigh = req.query.reviews === 'least-to-most' ? true : false;
  resp.json(handleSort(isSortByLowToHigh, 'reviews'));
});

// filter
// Endpoint 4: Filter the hotels based on the Hotel Amenity
// <http://localhost:3000/hotels/filter/amenity?amenity=spa>

function filterBy(field, param) {
  let hotelsCopy = hotels.slice();
  return hotelsCopy.filter(
    (hotel) => hotel[param].toLowerCase() === field.toLowerCase()
  );
}

app.get('/hotels/filter/amenity', (req, resp) => {
  let field = req.query.amenity;
  let filteredHotels = filterBy(field, 'amenity');
  resp.json(filteredHotels);
});

// Endpoint 5: Filter the hotels based on the selected Country
// <http://localhost:3000/hotels/filter/country?country=india>

app.get('/hotels/filter/country', (req, resp) => {
  let hotelsCopy = hotels.slice();
  let field = req.query.country;
  let filteredHotels = filterBy(field, 'country');
  resp.json(filteredHotels);
});

// Endpoint 6: Filter the hotels based on the selected Category
//<http://localhost:3000/hotels/filter/category?category=luxury>

app.get('/hotels/filter/category', (req, resp) => {
  let hotelsCopy = hotels.slice();
  let field = req.query.category;
  let filteredHotels = filterBy(field, 'category');
  resp.json(filteredHotels);
});

// Send all hotels
// /hotels

app.get('/hotels', (req, resp) => {
  resp.json(hotels);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
