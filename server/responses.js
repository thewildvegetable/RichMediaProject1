const fs = require('fs');
const requestAPI = require('request');

const index = fs.readFileSync(`${__dirname}/../hosted/index.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const users = {};

let armors; // all the armors
let weapons; // all the weapons
let charms; // all the charms

const errorMessage = { message: '' };

// function to handle the index page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// function to handle the css
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function to handle the js
const getJS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(bundle);
  response.end();
};

// function to send a json object
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  // stringify the object
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name, Head armor, Chest armor, Gloves, Waist armor, Leg armor, Weapon, and Charm are all required.',
  };

  // check to make sure we have all the fields
  if (!body.name || !body.head || || !body.chest || !body.arms || !body.waist || !body.legs || !body.weapon || !body.charm) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 201;
    
  //rest the error message
  responseJSON.message = "";

  // if that user's name already exists in our object return an updated
  if (users[body.name]) {
      responseCode = 204;
  }
  else if (g) {
      responseJSON.message += "Head piece not found. ";
  }
  else if (g) {
      responseJSON.message += "Chest piece not found. ";
  }
  else if (g) {
      responseJSON.message += "Gloves not found. ";
  }
  else if (g) {
      responseJSON.message += "Waist piece not found. ";
  }
  else if (g) {
      responseJSON.message += "Legs not found. ";
  }
  else if (g) {
      responseJSON.message += "Weapon not found. ";
  }
  else if (g) {
      responseJSON.message += "Charm not found.";
  } 
  else {
    // otherwise create an object with that name
    users[body.name] = {};
  }

  //check if any params were incorrect
  if (responseJSON.message != ""){
      responseJSON.id = 'invalidParams';
      return respondJSON(request, response, 400, responseJSON);
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

  // if response is created, then set our created message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};


// function to show not found error
const notFound = (request, response) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
  };

  // return a 404 not found error code
  return respondJSON(request, response, 404, responseJSON);
};

// get all the armors from the mhw api
const getArmors = () => {
  const requestUrl = 'https://mhw-db.com/armor';

  // request the contents of request url
  requestAPI.get(requestUrl, (error, response, body) => {
    // if no error, store the armor json object in armors
    if (!error && response.statusCode === 200) {
      console.dir(body);
      armors = body;
    } else {
      // if an error, send that an error occurred to the client
      errorMessage.message += 'Armor could not be acquired, the MHW api may be down ';
    }
  });
};

// get all the weapons from the mhw api
const getWeapons = () => {
  const requestUrl = 'https://mhw-db.com/weapons';

  // request the contents of request url
  requestAPI.get(requestUrl, (error, response, body) => {
    // if no error, store the armor json object in armors
    if (!error && response.statusCode === 200) {
      weapons = body;
    } else {
      // if an error, send that an error occurred to the client
      errorMessage.message += 'Weapons could not be acquired, the MHW api may be down ';
    }
  });
};

// get all the charms from the mhw api
const getCharms = () => {
  const requestUrl = 'https://mhw-db.com/charms';

  // request the contents of request url
  requestAPI.get(requestUrl, (error, response, body) => {
    // if no error, store the armor json object in armors
    if (!error && response.statusCode === 200) {
      charms = body;
    } else {
      // if an error, send that an error occurred to the client
      errorMessage.message += 'Charms could not be acquired, the MHW api may be down ';
    }
  });
};

module.exports = {
  getIndex,
  getCSS,
  getJS,
  getUsers,
  addUser,
  notFound,
  getArmors,
  getWeapons,
  getCharms,
};
