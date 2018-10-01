
//function to parse our response
const parseJSON = (xhr, content) => {
  //parse response
  const obj = JSON.parse(xhr.response);
  console.dir(obj);

  //if message in response, add it
  if (obj.message) {
    const p = document.createElement('p');
    p.textContent = `Message: ${obj.message}`;
    content.appendChild(p);
  }

  //if users in response, add it
  if (obj.users) {
    const userList = document.createElement('p');
    const users = JSON.stringify(obj.users);
    userList.textContent = users;
    content.appendChild(userList);
  }
};

//function to handle response
const handleResponse = xhr => {
  const content = document.querySelector('#content');

  //check the status code
  switch (xhr.status) {
    case 200:
      //success
      content.innerHTML = `<b>Success</b>`;
      break;
    case 201:
      //created
      content.innerHTML = '<b>Create</b>';
      break;
    case 204:
      //updated
      content.innerHTML = '<b>Updated (No Content)</b>';
      return;
    case 400:
      //bad request
      content.innerHTML = `<b>Bad Request</b>`;
      break;
    default:
      //any other status code
      content.innerHTML = `Error code not implemented by client.`;
      break;
  }
  //parse response 
  parseJSON(xhr, content);
};

//function to send our post request
const sendPost = (e, nameForm) => {
  //grab the forms action
  const nameAction = nameForm.getAttribute('action');
  const nameMethod = nameForm.getAttribute('method');

  //grab the form's name and age fields so we can check user input
  const nameField = nameForm.querySelector('#nameField');
  const ageField = nameForm.querySelector('#ageField');

  //create a new Ajax request (remember this is asynchronous)
  const xhr = new XMLHttpRequest();
  //set the method (POST) and url (action field from form)
  xhr.open(nameMethod, nameAction);

  //set our request type
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //set our requested response type in hopes of a JSON response
  xhr.setRequestHeader('Accept', 'application/json');

  //set our function to handle the response
  xhr.onload = () => handleResponse(xhr);

  //build our x-www-form-urlencoded format
  const formData = `name=${nameField.value}&age=${ageField.value}`;

  //send our request with the data
  xhr.send(formData);

  //prevent the browser's default action
  e.preventDefault();
  return false;
};

const init = () => {
  //grab form
  const nameForm = document.querySelector('#nameForm');

  //create handler
  const addUser = e => sendPost(e, nameForm);

  //attach submit event
  nameForm.addEventListener('submit', addUser);
};

window.onload = init;
