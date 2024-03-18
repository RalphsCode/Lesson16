/**
 * Ralph's Jeopardy game.
 * Using data from: https://rithm-jeopardy.herokuapp.com/api/
 */

// Show the loading spinner
showLoadingView()

// Create some global variables
const categoryPool = [2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18];
let gameCategories = [];
let gameData = [];
let gameQuestions;


/**  *
 * Returns array of a certain number of 
 * randomly selected elements from a passed in array.
 */
function getCategoryIds(arr, count) {
        const shuffled = arr.slice();
        let i = arr.length;
        let min = i - count;
        let temp, index;
      
        while (i-- > min) {
          index = Math.floor((i + 1) * Math.random());
          temp = shuffled[index];
          shuffled[index] = shuffled[i];
          shuffled[i] = temp;
        } // END while...
      
        return shuffled.slice(min);
}  // END getCategoryIds()


/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory() {
    sixRandomNumbers = getCategoryIds(categoryPool, 6);
    const baseURL = 'https://rithm-jeopardy.herokuapp.com/api/category?id='
    for (categoryNumber of sixRandomNumbers){
        urlForAcategory = baseURL + categoryNumber;
            await axios.get(urlForAcategory)
                .then(response => {
                    // Handle successful response
                    gameQuestions = response.data;
                    gameData.push(gameQuestions);
                    })
                .catch(error => {
                    // Handle error
                    console.error('Error fetching data:', error);
                });
                
} return gameData;
}  // END getCategory()


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

function fillTable(gameData) {
    // create the table
    const table = document.createElement('table');
    document.body.append(table);
    // create header row
    const theadRow = document.createElement('tr');
    gameData.forEach(function(category){
        const theadCol = document.createElement('th');
        theadCol.textContent = category.title;
        theadRow.appendChild(theadCol);
    })
    table.appendChild(theadRow);
    // create the table body
    for (let k = 0; k< 5; k++){
        const questionRows = document.createElement('tr');
            for (let i = 0; i< gameData.length; i++){
                const clue = document.createElement('td'); 
                // Build the HTML content string
                const tdCode = `<span id="step 0">?</span>
                                <span id="step 1" style="display: none;">${gameData[i].clues[k].question}</span>
                                <span id="step 2" style="display: none;">${gameData[i].clues[k].answer}</span>`
                clue.innerHTML = tdCode;
                // Add the contents to the td (questions & answers)
                questionRows.appendChild(clue);
            } // END for loop
        
        table.appendChild(questionRows);    
    } // END for loop
} // END fillTable()


/** 
 * create the 'start new game' button & functionality
 * */
function startBtn(){
    //  Create a start button
    
    const startBtnDiv = document.createElement('div');

    const startButton = document.createElement('button');
    startButton.setAttribute('class', 'restart-button');
    startButton.innerHTML = '<span>Start New Game</span>';
    // Have it clear the page and restart the game
    startButton.addEventListener('click', function() {
        const oldTable = document.querySelector('table');
        oldTable.remove();
        // now it destroys itself!
        const oldBtn = document.querySelector('button');
        oldBtn.remove();
        // restart the game
        setupAndStart();
    });

    startBtnDiv.append(startButton);
    document.body.append(startBtnDiv);
}  // END startBtn()


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses the spans to display the necessary text.
 * Starts with <span> step 0 displayed,
 * when it is clicked; it hides step 0, and displays
 * step 1. Same for step 2.
 * */

function handleClick() {
    // Add event listener to the body tag
    document.body.addEventListener('click', function(evt) {
    // Check if the clicked element is a span
    if (evt.target.tagName.toLowerCase() === 'span') {
      // Code to execute when a question span is clicked
      if (evt.target.id !== 'step 2'){
        evt.target.style.display = 'none';
        evt.target.nextElementSibling.style.display = 'inline';
        }
    }
})
}  // END handleClick()


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    //  Create a start button
    const spinnerDiv = document.createElement('div');
    spinnerDiv.setAttribute('id', 'spinner');
    document.body.append(spinnerDiv);
}


/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    if (document.querySelector('#spinner')){
    const oldSpinner = document.querySelector('#spinner');
        oldSpinner.remove();
}
} // END hideLoadingView()


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    gameCategories = [];
    gameData = [];
    gameQuestions = [];
    await getCategory();
    fillTable(gameData);
    startBtn();
    handleClick();
    hideLoadingView();
}


// Turn the key!
setupAndStart();
