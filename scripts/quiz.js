const startExerciseBtn = document.querySelector('.start__exercise-btn')
const numberOfQuestionOptions = document.querySelectorAll('.start__options-btn--questions'), 
chordQualityOptions = document.querySelectorAll('.start__options-btn--qualities'), 
numberOfNoteOptions = document.querySelectorAll('.start__options-btn--size') 
const repeatBtn = document.querySelector('.exercise__btn--repeat') 
const nextBtn = document.querySelector('.exercise__btn--next') 
const endBtn = document.querySelector('.exercise__btn--end')
let exerciseButtons = document.querySelectorAll('.exercise__btn')
const startContainer = document.querySelector('.start')
const exerciseContainer = document.querySelector('.exercise')        
const timesAnsweredContainer = document.querySelector('.exercise__container--percent-correct')
const questionCount = document.querySelector('.exercise__container--questions-left')
const correctIndicator = document.querySelector('.exercise__container--correct')
let notesIndex = 0, maximumNoteNumber, maxQuestions, questionCounter = 1, answeredCorrect = 0, timesAnswered = 0//quiz related constant variables
let isQuestionsActive = false, isQualityActive = false, isNumberActive = false
let chosenChordQualities = document.querySelectorAll('.active-quality-btn')

//sets the number of questions to answer
function setNumberOfQuestions(){
    const numberOfQuestionsText = document.querySelector('.start__options-chosen--questions')
    toggleButton(this, numberOfQuestionOptions)//'this' is the html button clicked
    numberOfQuestionsText.innerText = ` ${this.innerText}`//creates text showing what option is chosen
    
    maxQuestions = parseInt(this.innerText, 10)//assigns the text to the maxQuestions variable
    isQuestionsActive = true//condition in order to start the quiz
}

//sets the types of chord qualities to be used. Can have more than one quality
function setPossibleChordQualities(){
    const chordQualitiesTitle = document.querySelector('.start__options--qualities')
    this.classList.toggle('active-quality-btn')//toggles this class

    //removes all chord qualities text
    while(chordQualitiesTitle.firstChild) {
        chordQualitiesTitle.removeChild(chordQualitiesTitle.lastChild)
    }

    //if chord quality button has the 'active-quality-btn' class, create text in chordQualityOptions
    for(i = 0; i < chordQualityOptions.length; i++){
        const newSpan = document.createElement('span')

        for(j = 0; j < chordQualityOptions[i].classList.length; j++){
            if(chordQualityOptions[i].classList[j]  == 'active-quality-btn'){
                newSpan.innerText = ` ${chordQualityOptions[i].innerText}`
                chordQualitiesTitle.insertBefore(newSpan, chordQualitiesTitle.nextChild)
            }
        }
    }
    
    chosenChordQualities = document.querySelectorAll('.active-quality-btn')//updating selectorall

    //set this condition to true if at least one quality is chosen
    if(chosenChordQualities.length > 0){
        isQualityActive = true
    } else {
        isQualityActive = false
    }

}

//sets a range of notes in each chord
function setNumberOfNotes(){
    const numberOfNotesText = document.querySelector('.start__options-chosen--notes')
    let minimumNoteNumber = 3 //might change depending on what chords will be given as a choice down the line
    toggleButton(this, numberOfNoteOptions)

    if(this.innerText == minimumNoteNumber){
        numberOfNotesText.innerText = ` ${minimumNoteNumber}`
    } else {
        numberOfNotesText.innerText = ` ${minimumNoteNumber}~${this.innerText}`
    }

    maximumNoteNumber = parseInt(this.innerText)

    isNumberActive = true
}   

//highlights clicked button and removes all buttons that were previously highlighted
function toggleButton(btn, list){
    for(i = 0; i < list.length; i++){
        for(j = 0; j < list[i].classList.length; j++){
            if(list[i].classList[j] == 'active-btn'){
                list[i].classList.remove('active-btn')
            }
        }
    }
    btn.classList.add('active-btn')
}

//checks if all conditions are true then starts exercise. If conditions not met, show alert
function startExercise(){
    //if all conditions are true hide startContainer and show exerciseContainer
    if(isQualityActive && isQuestionsActive && isNumberActive){
        startContainer.classList.add('no-display')
        exerciseContainer.classList.add('display-flex')
    
        chooseNotesAndSounds()// choose first set of notes and sounds
        questionCount.innerText = `${questionCounter}/${maxQuestions}` //defining questionCount which is the current question number / total questions
    //shows alert if not all required conditions met
    } else {
        alert('Please fill in all options before starting the exercise!')
    }
}

//switches buttons that are in the same container
function switchButtons(btnOne, btnTwo){
    btnOne.style.display = 'none'
    btnTwo.style.display = 'inline'
}

//updates the score when a button is clicked. Represented as a percentage
function updateScore(){
    timesAnswered += 1//always updates when an exercise button is clicked
    
    if(correctIndicator.innerText == 'correct'){
        answeredCorrect += 1//only updates when a correct exercise button is clicked
    }

    timesAnsweredContainer.innerText = Math.floor(answeredCorrect / timesAnswered * 100) + '%'//score is number of correct answer divided by total number of times answer
}

//checks for the correct answer and if the question is ended, switch out buttons to continue or end the exercise and remove event listeners
function answerQuestion(){
    //defines an answer and checks if the button clicked gives the answer
    function answerChecker(btn){
        const soundsIndex = notesIndex - 1
        let answer = soundsArr[soundsIndex].interval //answer is the interval
        correctIndicator.style.display = 'block'
        //checks if the button's data-interval attribute text matches the interval value of soundsArr
        if(btn.dataset.interval == answer){
            correctIndicator.innerText = `correct`
        } else {
            //finds the correct answer's inner text and writes it out in the correctIndicator container
            for(i = 0; i < exerciseButtons.length; i++){
                if (exerciseButtons[i].dataset.interval == answer){
                    correctIndicator.innerText = `incorrect the answer is ${exerciseButtons[i].innerText}`
                }
            } 
        }
        updateScore()
    }
    //makes the end state for the end of a question or the end of the exercise. Switches out buttons and removes event listeners
    function endQuestion(x, y, btns){
        if(x == y && questionCounter < maxQuestions){//if reached the last note of the soundsArr and there are still questions to be asked
            switchButtons(repeatBtn, nextBtn)//switch the repeat sounds button to the next button
            btns.forEach(button => button.removeEventListener('click', answerQuestion))//removes event listeners for exercise buttons
        } else if(x == y && questionCounter == maxQuestions){//if instead there are no more questions to be asked
            switchButtons(repeatBtn, endBtn)//switch repeat sounds button to end exercise button
            btns.forEach(button => button.removeEventListener('click', answerQuestion))//removes event listeners
            correctIndicator.innerText = `You finished! You got ${timesAnsweredContainer.innerText}`//show final score
        }
    }

    answerChecker(this)//checks if button clicked is correct
    updateScreen()// updates the screen
    endQuestion(notesIndex, soundsArr.length, exerciseButtons)//gives end state of exercise or question
}

//resets info so that new question can be asked
function startNewQuestion(){
    exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))//gives event listeners to new buttons
    notesIndex = 0//resets notesIndex, identifying which note is to be asked about next
    //sets all ledgerLinesArr conditions to false, removing them from the canvas
    for(i = 0; i < ledgerLinesArr.length; i++){
        ledgerLinesArr[i].true = false
    }
    chooseNotesAndSounds()//chooses notes and sounds
    correctIndicator.innerText = 'pick the next note above the current highest'//reset text
    switchButtons(nextBtn, repeatBtn)//switches buttons
    questionCounter += 1//increases counter
    questionCount.innerText = `${questionCounter}/${maxQuestions}`//updates questionCount text
    
}

//resets info so that the exercise can be restarted
function endExercise(){
    questionCounter = 1, answeredCorrect = 0, timesAnswered = 0, notesIndex = 0
    correctIndicator.innerText = 'pick the next note above the current highest'
    //hides exerciseContainer and displays startContainer
    startContainer.classList.remove('no-display')
    exerciseContainer.classList.remove('display-flex')
    updateScore()
    exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))    
    switchButtons(endBtn, repeatBtn)
    for(i = 0; i < ledgerLinesArr.length; i++){
        ledgerLinesArr[i].true = false
    }
}

startExerciseBtn.addEventListener('click', startExercise)//click to start exercise
numberOfQuestionOptions.forEach(btn => btn.addEventListener('click', setNumberOfQuestions))//click to toggle number of questions options
chordQualityOptions.forEach(btn => btn.addEventListener('click', setPossibleChordQualities))//click to toggle chord quality types
numberOfNoteOptions.forEach(btn => btn.addEventListener('click', setNumberOfNotes))//click to toggle the range of number of notes per question
repeatBtn.addEventListener('click', playSounds)//click on the repeat sounds button to hear the chord again
exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))//click on these to answer the question
nextBtn.addEventListener('click', startNewQuestion)//click to end question and set up info for new question
endBtn.addEventListener('click', endExercise)//click to end the exercise and show the startContainer again