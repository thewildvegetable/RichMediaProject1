let armorForm; //form for armor
let userForm; //form for getusers
let displayedUsersSection; //section containing all of the user names
let selectedUserSection; //section containing the selected user

//function to parse our response
const parseJSON = xhr => {
    //parse response
    const obj = JSON.parse(xhr.response);
    console.dir(obj);

    displayedUsersSection.innerHTML = '';
    //if message in response, add it
    if (obj.message) {
        const p = document.createElement('p');
        p.textContent = `Message: ${obj.message}`;
        displayedUsersSection.appendChild(p);
    }

    //if users in response, add it
    if (obj.users) {
        let keys = Object.keys(obj.users);
        //loop through users array and add all the users to the user object
        for (let i = 0; i < keys.length; i++) {
            let span1 = document.createElement('span');
            let currentUser = obj.users[keys[i]];

            //store current user in users array
            users[currentUser.name] = currentUser;

            //setup the span
            span1.textContent = `Name: ${currentUser.name}`;
            span1.value = currentUser.name;
            span1.className = 'userDisplay';

            //onclick, display selected user's info
            const selectedUserMethod = () => selectUser(currentUser.name);
            span1.onclick = selectedUserMethod;
            displayedUsersSection.appendChild(span1);
        }
    }
};

//function to handle response
const handleResponse = xhr => {

    //parse response 
    parseJSON(xhr);
};

const sendUsers = (e, userForm) => {
    //grab the forms action
    const userAction = userForm.getAttribute('action');
    const userMethod = userForm.getAttribute('method');

    //create a new Ajax request
    const xhr = new XMLHttpRequest();
    xhr.open(userMethod, userAction);

    //set our request type and response type
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');

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
    xhr.setRequestHeader('Accept', 'application/json');

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
    //grab page contents
    armorForm = document.querySelector('#armorForm');
    userForm = document.querySelector('#userForm');
    displayedUsersSection = document.querySelector('#users');
    selectedUserSection = document.querySelector('#selectedUser');

    //create handler
    const addUser = e => sendPost(e, armorForm);
    const getUsers = e => sendUsers(e, userForm);

    //attach submit event
    armorForm.addEventListener('submit', addUser);
    userForm.addEventListener('submit', getUsers);
};

window.onload = init;
let users = {};

const selectUser = name => {
    //get user
    const selectedUser = users[name];

    //if selected user not found, do nothing
    if (!selectedUser) {
        return;
    }

    selectedUserSection.style.display = "inline";

    //note: all charm parts will be done at the end since its possible to have no charm in your armorset

    //get the page parts
    const namePara = document.querySelector('#name');
    const headPara = document.querySelector('#head');
    const chestPara = document.querySelector('#chest');
    const armsPara = document.querySelector('#arms');
    const waistPara = document.querySelector('#waist');
    const legsPara = document.querySelector('#legs');
    const weaponPara = document.querySelector('#weapon');
    const weaponInfoPara = document.querySelector('#weaponInfo');
    const charmPara = document.querySelector('#charm');
    const headImg = document.querySelector('#headImg');
    const chestImg = document.querySelector('#chestImg');
    const armsImg = document.querySelector('#armsImg');
    const waistImg = document.querySelector('#waistImg');
    const legsImg = document.querySelector('#legsImg');
    const weaponImg = document.querySelector('#weaponImg');
    const stats = document.querySelector('#stats');
    const skillsPara = document.querySelector('#skills');

    //set the images
    headImg.src = selectedUser.head.assets.imageMale;
    chestImg.src = selectedUser.chest.assets.imageMale;
    armsImg.src = selectedUser.arms.assets.imageMale;
    waistImg.src = selectedUser.waist.assets.imageMale;
    legsImg.src = selectedUser.legs.assets.imageMale;
    weaponImg.src = selectedUser.weapon.assets.image;

    //add the names
    namePara.textContent = `${selectedUser.name}`;
    headPara.textContent = `${selectedUser.head.name}`;
    chestPara.textContent = `${selectedUser.chest.name}`;
    armsPara.textContent = `${selectedUser.arms.name}`;
    waistPara.textContent = `${selectedUser.waist.name}`;
    legsPara.textContent = `${selectedUser.legs.name}`;
    weaponPara.textContent = `${selectedUser.weapon.name}`;
    charmPara.textContent = `${selectedUser.charm.name}`;

    //get the stats
    let defense = selectedUser.head.defense.base + selectedUser.chest.defense.base + selectedUser.arms.defense.base + selectedUser.waist.defense.base + selectedUser.legs.defense.base;
    let fire = selectedUser.head.resistances.fire + selectedUser.chest.resistances.fire + selectedUser.arms.resistances.fire + selectedUser.waist.resistances.fire + selectedUser.legs.resistances.fire;
    let water = selectedUser.head.resistances.water + selectedUser.chest.resistances.water + selectedUser.arms.resistances.water + selectedUser.waist.resistances.water + selectedUser.legs.resistances.water;
    let ice = selectedUser.head.resistances.ice + selectedUser.chest.resistances.ice + selectedUser.arms.resistances.ice + selectedUser.waist.resistances.ice + selectedUser.legs.resistances.ice;
    let thunder = selectedUser.head.resistances.thunder + selectedUser.chest.resistances.thunder + selectedUser.arms.resistances.thunder + selectedUser.waist.resistances.thunder + selectedUser.legs.resistances.thunder;
    let dragon = selectedUser.head.resistances.dragon + selectedUser.chest.resistances.dragon + selectedUser.arms.resistances.dragon + selectedUser.waist.resistances.dragon + selectedUser.legs.resistances.dragon;

    //get the skills
    //for each armor piece loop through and add all its skills
    let skills = '';
    //head
    let keys = Object.keys(selectedUser.head.skills);
    for (let i = 0; i < keys.length; i++) {
        skills += selectedUser.head.skills[keys[i]].skillName + ' ';
    }
    //chest
    keys = Object.keys(selectedUser.chest.skills);
    for (let i = 0; i < keys.length; i++) {
        skills += selectedUser.chest.skills[keys[i]].skillName + ' ';
    }
    //arms
    keys = Object.keys(selectedUser.arms.skills);
    for (let i = 0; i < keys.length; i++) {
        skills += selectedUser.arms.skills[keys[i]].skillName + ' ';
    }
    //waist
    keys = Object.keys(selectedUser.waist.skills);
    for (let i = 0; i < keys.length; i++) {
        skills += selectedUser.waist.skills[keys[i]].skillName + ' ';
    }
    //legs
    keys = Object.keys(selectedUser.legs.skills);
    for (let i = 0; i < keys.length; i++) {
        skills += selectedUser.legs.skills[keys[i]].skillName + ' ';
    }

    //if charm exists, add it
    if (selectedUser.charm.name != 'None') {
        let charmKeys = Object.keys(selectedUser.charm.ranks[0].skills);
        for (let i = 0; i < charmKeys.length; i++) {
            skills += selectedUser.charm.ranks[0].skills[charmKeys[i]].skillName + ' ';
        }
    }

    //add to stats
    stats.textContent = `Armor: ${defense} Fire Resistance: ${fire} Water Resistance: ${water} Ice Resistance: ${ice} Thunder Resistance: ${thunder} Dragon Resistance: ${dragon} `;
    skillsPara.textContent = `Skills: ${skills}`;

    //weapon info
    weaponInfoPara.textContent = `Damage: ${selectedUser.weapon.attack.display}`;
};
