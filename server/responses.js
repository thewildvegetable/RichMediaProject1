const fs = require('fs');
const requestAPI = require('request');

const index = fs.readFileSync(`${__dirname}/../hosted/index.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

const users = {};

const armors = {}; // all the armors
let apiArmors; // all the armors, unindexed
const weapons = {}; // all the weapons
let apiWeapons; // all the weapons, unindexed
const charms = {}; // all the charms
let apiCharms; // all the charms, unindexed


const errorMessage = { message: '' };   //used if any api data is not gotten

// makes the default user
const setUpBaseUser = () => {
  const user = {};
  user.name = 'Demo User';
  user.head = armors['leather headgear'];
  user.chest = armors['leather mail'];
  user.arms = armors['leather gloves'];
  user.waist = armors['leather belt'];
  user.legs = armors['leather trousers'];
  user.weapon = weapons['buster sword 1'];
  user.charm = charms['poison charm'];
  users[user.name] = user;
};

// function to handle the index page
const getIndex = (request, response) => {
  setUpBaseUser();
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
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
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
    message: 'Name, Head armor, Chest armor, Gloves, Waist armor, Leg armor, Weapon, and Charm are all required. ',
  };

  // check to make sure we have all the fields (charms can be empty)
  let fields = !body.name || !body.head || !body.chest || !body.arms;
  fields = fields || !body.waist || !body.legs || !body.weapon;
  if (fields) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // check to make sure everything was nabbed from the mhw api
  if (!armors || !weapons || !charms) {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(errorMessage.message));
    response.end();
  }

  // default status code
  let responseCode = 201;

  // rest the error message
  responseJSON.message = '';

  // if that user's name already exists in our object return an updated
  if (users[body.name]) {
    responseCode = 204;
  }
  // if any part of the loadout is missing, response 400
  if (!armors[body.head.toLowerCase()]) {
    responseJSON.message += 'Head piece not found. ';
    responseCode = 400;
  }
  if (!armors[body.chest.toLowerCase()]) {
    responseJSON.message += 'Chest piece not found. ';
    responseCode = 400;
  }
  if (!armors[body.arms.toLowerCase()]) {
    responseJSON.message += 'Gloves not found. ';
    responseCode = 400;
  }
  if (!armors[body.waist.toLowerCase()]) {
    responseJSON.message += 'Waist piece not found. ';
    responseCode = 400;
  }
  if (!armors[body.legs.toLowerCase()]) {
    responseJSON.message += 'Legs not found. ';
    responseCode = 400;
  }
  if (!weapons[body.weapon.toLowerCase()]) {
    responseJSON.message += 'Weapon not found. ';
    responseCode = 400;
  }
  if (!body.charm) {
    // no charm data sent
  } else if (!charms[body.charm.toLowerCase()]) {
    // charm data sent but charm was not found
    responseJSON.message += 'Charm not found.';
    responseCode = 400;
  }

  // check if any params were incorrect
  if (responseCode === 400) {
    responseJSON.id = 'invalidParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // otherwise create an object with that name
  const user = {};
  user.name = body.name;
  user.head = armors[body.head.toLowerCase()];
  user.chest = armors[body.chest.toLowerCase()];
  user.arms = armors[body.arms.toLowerCase()];
  user.waist = armors[body.waist.toLowerCase()];
  user.legs = armors[body.legs.toLowerCase()];
  user.weapon = weapons[body.weapon.toLowerCase()];
  if (body.charm) {
    user.charm = charms[body.charm.toLowerCase()];
  } else {
    user.charm = { name: 'None' };
  }
  users[body.name] = user;


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
      apiArmors = JSON.parse(body);

      const count = Object.keys(apiArmors).length;

      // loop through the armors from the api, and make armors into a map
      for (let i = 0; i < count; i++) {
        armors[apiArmors[i].name.toLowerCase()] = apiArmors[i];
      }
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
      apiWeapons = JSON.parse(body);

      const count = Object.keys(apiWeapons).length;

      // loop through the armors from the api, and make armors into a map
      for (let i = 0; i < count; i++) {
        weapons[apiWeapons[i].name.toLowerCase()] = apiWeapons[i];
      }
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
      apiCharms = JSON.parse(body);

      const count = Object.keys(apiCharms).length;

      // loop through the armors from the api, and make armors into a map
      for (let i = 0; i < count; i++) {
        charms[apiCharms[i].name.toLowerCase()] = apiCharms[i];
      }
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
