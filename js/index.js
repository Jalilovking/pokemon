/* Select and create func */
const findEl = element => document.querySelector(element);
const createEl = element => document.createElement(element);

/* main selection */
const form = findEl(".form");
const ul = findEl(".pokemon__card-wrapper");
const template = findEl("#template").content
const select = findEl(".type__selection");
const search = findEl(".form__search");
const sortSelect = findEl(".sort__selection")

const modalList = findEl(".modal__list");
const openM = findEl(".header__btn");
const modal = findEl(".modal");
const body = findEl("body");
const modalBtn = findEl(".modal__btn");
const modalImg = findEl(".modal__img")
const pokemonsTypes = [];


let sortAz = function (a, b) {
    if (a.name > b.name) {
        return 1
    } else if (a.name < b.name) {
        return -1
    } else {
        return 0
    }
}

let sortZa = function (a, b) {
    if (a.name > b.name) {
        return -1
    } else if (a.name < b.name) {
        return 1
    } else {
        return 0
    }
}

let newOld = function (a, b) {
    return a.birth_date - b.birth_date;
}

let oldNew = function (a, b) {
    return b.birth_date - a.birth_date;
}

let sortObj = {
    'a_z': sortAz,
    'z_a': sortZa,
    'old_new': oldNew,
    'new_old': newOld
}


/* create pokemon list */
function create(arr) {
    let temp = template.cloneNode(true);
    temp.querySelector(".pokemon__img").src = arr.img;
    temp.querySelector(".pokemon__img").width = 157;
    temp.querySelector(".pokemon__img").height = 157;
    temp.querySelector(".pokemon__card-title").textContent = arr.name;
    temp.querySelector(".pokemon__type").textContent = arr.type;
    temp.querySelector(".pokemon__weight").textContent = arr.weight;
    temp.querySelector(".pokemon__card-btn").dataset.id = arr.id;
    let age = 2021 - new Date(arr.birth_date).getFullYear()
    temp.querySelector(".pokemon__age").textContent = `${age} age`;
    ul.appendChild(temp)
    for (const iterator of arr.type) {

        findByGenre(iterator)
    }
}


/* round type */

/* Find by types */
function findByGenre(type) {

    if (!pokemonsTypes.includes(type)) {
        pokemonsTypes.push(type)

        /* Find Genre and add to option */
        let option = createEl("option");
        option.textContent = type;
        select.appendChild(option)

    }
}

/* find  */

function searchFunc(evt) {
    evt.preventDefault();

    ul.innerHTML = ""

    let value = select.value;
    let searchValue = search.value;

    let sortValue = sortSelect.value;
    console.log(sortValue);
    let newRegExp = new RegExp(searchValue, "gi")

    let foundPokemons = pokemons.filter(pokemon => {
        if (value === "All") {
            return pokemons

        } else {
            return pokemon.type.includes(value)
        }
    }).filter(pok => {
        return pok.name.match(newRegExp)
    }).sort(sortObj[sortValue])

    foundPokemons.forEach(pokemon => {
        create(pokemon)
    })
}


pokemons.forEach(element => {
    create(element)
})

openM.addEventListener('click', () =>{
    modal.classList.add('modal-active')
})
modalBtn.addEventListener('click', () =>{
    modal.classList.remove('modal-active')
})
modal.addEventListener('click', evt =>{
    const modalId = evt.target.dataset.modal
    if(modalId == 1){
        modal.classList.remove('modal-active')    
    }
})

form.addEventListener("submit", searchFunc);

let savedPokemons = JSON.parse(window.localStorage.getItem("saved")) || []




ul.addEventListener("click", function(evt) {
    if(evt.target.matches(".pokemon__card-img")){
        let findPok = pokemons.find(pokemon => String(pokemon.id) === evt.target.dataset.id);
        if(!savedPokemons.includes(findPok)) {
            savedPokemons.push(findPok)
        }
        window.localStorage.setItem("saved", JSON.stringify(savedPokemons))
        modalList.innerHTML = null
        
        savedPokemons.forEach(element => createModal(element))
        // createModal(findPok);
    }
 
})

savedPokemons.forEach(element => createModal(element))
function createModal(arr) {
    let temp = template.cloneNode(true);
    temp.querySelector(".pokemon__img").src = arr.img;
    temp.querySelector(".pokemon__card-title").textContent = arr.name;
    temp.querySelector(".pokemon__type").textContent = arr.type;
    temp.querySelector(".pokemon__weight").textContent = arr.weight;
    temp.querySelector(".pokemon__card-btn").dataset.id = arr.id;
    temp.querySelector(".pokemon__card-img").src = './img/trash.svg';
    temp.querySelector(".pokemon__card-img").classList.add("delate");
    temp.querySelector(".pokemon__card-img").classList.remove("pokemon__card-img");
    let age = 2021 - new Date(arr.birth_date).getFullYear()
    temp.querySelector(".pokemon__age").textContent = `${age} age`;
    modalList.appendChild(temp)
}

modalList.addEventListener("click", function (evt) {
    if(evt.target.matches(".delate")) {
        
        let foundIndex = savedPokemons.findIndex(item => String(item.id) === evt.target.dataset.id)
        savedPokemons.splice(foundIndex, 1);
        modalList.innerHTML = ''
        window.localStorage.setItem("saved", JSON.stringify(savedPokemons))
        savedPokemons.forEach(element => createModal(element))
    }
})