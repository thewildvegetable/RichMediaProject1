let users = {};

const selectUser = (name) => {
    //get user
    const selectedUser = users[name];
    
    //if selected user not found, do nothing
    if (!selectedUser){
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
    let keys = Object.keys(selectedUser.head.skills)
    for (let i = 0; i < keys.length; i++){
        skills += selectedUser.head.skills[keys[i]].skillName + ' ';
    }
    //chest
    keys = Object.keys(selectedUser.chest.skills)
    for (let i = 0; i < keys.length; i++){
        skills += selectedUser.chest.skills[keys[i]].skillName + ' ';
    }
    //arms
    keys = Object.keys(selectedUser.arms.skills)
    for (let i = 0; i < keys.length; i++){
        skills += selectedUser.arms.skills[keys[i]].skillName + ' ';
    }
    //waist
    keys = Object.keys(selectedUser.waist.skills)
    for (let i = 0; i < keys.length; i++){
        skills += selectedUser.waist.skills[keys[i]].skillName + ' ';
    }
    //legs
    keys = Object.keys(selectedUser.legs.skills)
    for (let i = 0; i < keys.length; i++){
        skills += selectedUser.legs.skills[keys[i]].skillName + ' ';
    }
    
    //if charm exists, add it
    if (selectedUser.charm.name != 'None'){
        let charmKeys = Object.keys(selectedUser.charm.ranks[0].skills)
        for (let i = 0; i < charmKeys.length; i++){
            skills += selectedUser.charm.ranks[0].skills[charmKeys[i]].skillName + ' ';
        }
    }
    
    //add to stats
    stats.textContent = `Armor: ${defense} Fire Resistance: ${fire} Water Resistance: ${water} Ice Resistance: ${ice} Thunder Resistance: ${thunder} Dragon Resistance: ${dragon} `;
    skillsPara.textContent = `Skills: ${skills}`;
    
    //weapon info
    weaponInfoPara.textContent = `Damage: ${selectedUser.weapon.attack.display}`;
    //if there is element damage, add it
    if (selectedUser.weapon.elements[0]){
        weaponInfoPara.textContent += ` ${selectedUser.weapon.elements[0].type}: ${selectedUser.weapon.elements[0].damage}`;
    }
    
};