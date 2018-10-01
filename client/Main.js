let armorForm;      //form for armor
let userForm;       //form for getusers

//function to parse our response
const parseJSON = (xhr, content) => {
    //parse response
    const obj = JSON.parse(xhr.response);
    console.dir(obj);
      
    //if message in response, add it
    if(obj.message) {
        const p = document.createElement('p');
        p.textContent = `Message: ${obj.message}`;
        content.appendChild(p);
    }
      
    //if users in response, add it
    if(obj.users) {
        const userList = document.createElement('p');
        const users = JSON.stringify(obj.users);
        userList.textContent = users;
        content.appendChild(userList);
    }
};

//function to handle response
const handleResponse = (xhr) => {
    const content = document.querySelector('#content');
      
    //check the status code
    switch(xhr.status) {
        case 200: //success
          content.innerHTML = `<b>Success</b>`;
          break;
        case 201: //created
          content.innerHTML = '<b>Create</b>';
          break;
        case 204: //updated
          content.innerHTML = '<b>Updated (No Content)</b>';
          return;
        case 400: //bad request
          content.innerHTML = `<b>Bad Request</b>`;
          break;
        default: //any other status code
          content.innerHTML = `Error code not implemented by client.`;
          break;
    }
    //parse response 
    parseJSON(xhr, content);
};

const sendUsers = (e, userForm) => {
    //grab the forms action
    const userAction = userForm.getAttribute('action');
    const userMethod = userForm.getAttribute('method');
        
    //create a new Ajax request
    const xhr = new XMLHttpRequest();
    console.log(userMethod);
    xhr.open(userMethod, userAction);
        
    //set our request type and response type
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader ('Accept', 'application/json');
      
    xhr.onload = () => handleResponse(xhr);
        
    //send our request with the data
    xhr.send();
    
    //prevent the browser's default action
    e.preventDefault();
    return false;
};

//function to send our post request
const sendPost = (e, armorForm) => {
    //grab the forms action
    const nameAction = armorForm.getAttribute('action');
    const nameMethod = armorForm.getAttribute('method');
      
    //grab the form's name and age fields so we can check user input
    const nameField = armorForm.querySelector('#nameField');
    const headField = armorForm.querySelector('#headField');
    const chestField = armorForm.querySelector('#chestField');
    const armsField = armorForm.querySelector('#armsField');
    const waistField = armorForm.querySelector('#waistField');
    const legsField = armorForm.querySelector('#legsField');
    const weaponField = armorForm.querySelector('#weaponField');
    const charmField = armorForm.querySelector('#charmField');
      
    //create a new Ajax request (remember this is asynchronous)
    const xhr = new XMLHttpRequest();
    //set the method (POST) and url (action field from form)
    xhr.open(nameMethod, nameAction);
      
    //set our request type
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //set our requested response type in hopes of a JSON response
    xhr.setRequestHeader ('Accept', 'application/json');
      
    //set our function to handle the response
    xhr.onload = () => handleResponse(xhr);
      
    //build our x-www-form-urlencoded format
    const formData = `name=${nameField.value}&head=${headField.value}&chest=${chestField.value}&arms=${armsField.value}&waist=${waistField.value}&legs=${legsField.value}&weapon=${weaponField.value}&charm=${charmField.value}`;
      
    //send our request with the data
    xhr.send(formData);
    
    //prevent the browser's default action
    e.preventDefault();
    return false;
};

const init = () => {
    //grab form
    armorForm = document.querySelector('#armorForm');
    userForm = document.querySelector('#userForm');
     
    //create handler
    const addUser = (e) => sendPost(e, armorForm);
    const getUsers = (e) => sendUsers(e, userForm);
    
    //attach submit event
    armorForm.addEventListener('submit', addUser);
    userForm.addEventListener('submit', getUsers);
};

window.onload = init;