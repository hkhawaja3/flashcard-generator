// Application requirements

var fs = require('fs');
var inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
var argv = require('argv');

var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

var args = argv.run().targets;
var cardDeck = [];

// pushes data from the save file into the current card deck
var loadCards = function(cards) {
    for (var i = 0; i < cards.length; i++) {
        cardDeck.push(cards[i]);
    };
};

// displays the created card for the user and pushes it to the card deck
var displayCard = function(card) {
    console.log(card);
    cardDeck.push(card);
    makeAnother();
};

//displays all cards in the deck
var displayCardDeck = function() {
    // fs.readFile('cards.json', 'utf8', function(err, data) {
    //     if (err) {
    //         console.log('No Cards Found');
    //         displayMenu();
    //     } else {
    //         cardDeck = JSON.parse(data);
    //         console.log(cardDeck[1]);
    //         for (var i = 0; i < cardDeck.length; i++) {
    //             console.log(cardDeck[i]);
    //         };
    //     };
    // });
    if (cardDeck.length > 0) {
        for (var i = 0; i < cardDeck.length; i++) {
            console.log(cardDeck[i]);
        };
    } else {
        console.log('There are no cards in the deck!');

    };
    displayMenu();
};

// prompts user to see if they want to make another card
var makeAnother = function() {
    prompt([{
        type: 'confirm',
        message: 'Would you like to make another card?',
        name: 'confirm',
        default: true
    }]).then(function(answer) {
        if (answer.confirm) {
            displayMenu();
        } else {
            exit();
        };
    });
};

//exit function. writes the card deck to a .json file if there are any cards in the deck.
var exit = function() {
    console.log('Thanks for stopping by!');
    if (cardDeck.length > 0) {
        fs.writeFile('cards.json', JSON.stringify(cardDeck, null, 2), function(err) {
            if (err) throw err;
        });
    };
};

// this is the hub of the application.
var displayMenu = function() {
    prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'cardType',
        choices: ['Make a Basic Card', 'Make a Cloze Card', 'See Card Deck', 'Exit.']
    }]).then(function(answer) {
        if (answer.cardType === 'Make a Basic Card') {
            prompt([{
                type: 'input',
                message: 'What is the Front of the Card?',
                name: 'question',
            }, {
                type: 'input',
                message: 'What is the Back of the Card?',
                name: 'answer'
            }]).then(function(basic) {
                var card = new BasicCard(basic.answer, basic.question);
                displayCard(card);
            });
        } else if (answer.cardType === 'Make a Cloze Card') {
            clozePrompt();
        } else if (answer.cardType === 'See Card Deck') {
            displayCardDeck();
        } else {
            exit();
        };
    });
};

//promts user for the cloze card info and validates if the card follows the proper syntax.
var clozePrompt = function() {
    prompt([{
        type: 'input',
        message: 'What is the Full Text?',
        name: 'question',
    }, {
        type: 'input',
        message: 'What is the Cloze?',
        name: 'answer'
    }]).then(function(cloze) {
        if (cloze.question.includes(cloze.answer)) {

            var card = new ClozeCard(cloze.answer, cloze.question);
            displayCard(card);
        } else {
            console.log('Hm, it doesn\'t look like the Cloze is in the Full Text.');
            clozePrompt();
        }
    });
};

// checks if the save file exists. if so, it prompts the user the option to load the data
fs.readFile('cards.json', 'utf8', function(error, data) {
    if (error) {
        displayMenu();
    } else {
        data = JSON.parse(data);
        prompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Card Data Found. Load cards??'
        }).then(function(answers) {
            if (answers.confirm) {
                loadCards(data);
                displayMenu();
            } else {
                displayMenu();
            };
        });
    };
});
