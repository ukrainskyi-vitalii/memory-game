const username = 'Vitalii';
let defaultCards = 12;
const bodyContainer = document.querySelector('body');
const cardsContainer = document.querySelector('.container-cards');
const winnerContainer = document.querySelector('#popup-winner');
const fadeContainer = document.querySelector('#fade');
const stepsContainer = document.querySelector('.steps');
const modeContainer = document.querySelector('.mode-section');
const scoreContainer = document.querySelector('.score-table');
const cardsArray = [
    'zuma',
    'turbot',
    'tracker',
    'skye',
    'ryder',
    'rubble',
    'rocky',
    'robodog',
    'marshall',
    'everest',
    'chase',
];

let steps = 0;
let isLocked = false;
let isOpened = false;
let firstCard, secondCard;

const getLocalStorageCards = () => Number(getLocalStorage('cards', defaultCards));

const setLocalStorage = (key, value) => localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);

const getLocalStorage = (key, defaultValue) => [NaN, null, 'undefined'].includes(localStorage.getItem(key)) ? defaultValue : localStorage.getItem(key);

const init = () => {
    setCards();
    shuffleCards();
}

const setCards = () => {
    cardsContainer.innerHTML = '';
    let count = getLocalStorageCards();
    let title;
    for (let i = 0; i < count; i++) {
        title = i % 2 === 0 ? cardsArray[i / 2] : title;
        cardsContainer.appendChild(getCardSection(title));
    }
}

function openCard() {
    if (isLocked) return;
    if (firstCard === this) return;
    steps++;
    this.classList.add('open');
    if (!isOpened) {
        isOpened = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

const reset = () => {
    [firstCard, secondCard] = [null, null];
    [isOpened, isLocked] = [false, false];
}

const checkForMatch = () => firstCard.dataset.title === secondCard.dataset.title ? disableCards() : closeCards();

function disableCards() {
    firstCard.removeEventListener('click', openCard);
    secondCard.removeEventListener('click', openCard);
    if (document.querySelectorAll('.open').length >= defaultCards) finishGame();
    reset();
}

function closeCards() {
    isLocked = true;
    setTimeout(() => {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');
        reset();
    }, 1000);
}

const shuffleCards = () => document.querySelectorAll('.card').forEach(card => card.style.order = Math.floor(Math.random() * defaultCards));

const getCardSection = (title) => {
    let div = getHtmlSection('div', 'card');
    div.addEventListener('click', openCard);
    div.setAttribute('data-title', title);
    let imgFace = getImgSection('./assets/img/cards/paw-patrol.png', 'React', 'back-card');
    let imgFront = getImgSection(`./assets/img/cards/${title}.png`, 'React', 'front-card');
    div.appendChild(imgFace);
    div.appendChild(imgFront);
    return div;
}

const getHtmlSection = (tagName, className, content = '') => {
    const tag = document.createElement(tagName);
    tag.className = className;
    if (content.toString().length > 0) tag.innerHTML = content;
    return tag;
}

const getImgSection = (src, title, className) => {
    let img = document.createElement('img');
    img.classList.add(className);
    img.src = src;
    img.alt = title;
    return img;
}

const finishGame = () => {
    let conrgatsNode = getConrgatsNode();
    showWinnerPopup(conrgatsNode);
    updateWinnerTable();
}

const getConrgatsNode = () => {
    let block = getHtmlSection('div', 'congrats-block', '<h2>Congrats, WINNER!</h2>');
    block.appendChild(getHtmlSection('p', 'congrats-text', `You have finished this game in <span class="steps">${steps}</span> steps`));
    return block;
}

const showWinnerPopup = (node) => {
    winnerContainer.appendChild(node);
    winnerContainer.style.display = 'block';
    fadeContainer.style.display = 'block';
}

const updateWinnerTable = () => {
    let winners = getWinnersData();
    if (winners.length === 10) winners.splice(9, 1);
    winners.unshift({ 'name': username, 'steps': steps });
    setLocalStorage('winners', winners);
    bodyContainer.addEventListener('click', closePopup);
}

const getWinnersData = () => {
    let winners = getLocalStorage('winners', []);
    if (winners.length > 0) winners = JSON.parse(winners);
    return winners;
}

const setGameMode = event => {
    defaultCards = event.target.dataset.mode;
    bodyContainer.setAttribute('data-mode', defaultCards);
    steps = 0;
    init();
    reset();
}


const closePopup = () => bodyContainer.addEventListener('click', () => document.location.reload());

const getWinnersNode = () => {
    const winner = getWinnersData();
    let block = getHtmlSection('div', 'score-list', `<h2>Last ${winner.length} games</h2>`);
    winner.map((item, index) => {
        block.appendChild(getHtmlSection('p', 'list-item', `${index + 1} game: ${item.steps} steps`));
    });
    return block;
}

scoreContainer.addEventListener('click', () => {
    let winnersNode = getWinnersNode();
    showWinnerPopup(winnersNode);
    bodyContainer.addEventListener('click', closePopup);
})

modeContainer.addEventListener('click', setGameMode);

window.addEventListener('load', init);