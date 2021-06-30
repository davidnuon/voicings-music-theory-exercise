    const startExerciseBtn = document.querySelector('.start__exercise-btn')

    const numberOfQuestionOptions = document.querySelectorAll('.start__options-btn--questions')
    const chordQualityOptions = document.querySelectorAll('.start__options-btn--qualities')
    const numberOfNoteOptions = document.querySelectorAll('.start__options-btn--size')

    const timesAnsweredContainer = document.querySelector('.exercise__container--percent-correct')
    const questionCount = document.querySelector('.exercise__container--questions-left')
    const repeatBtn = document.querySelector('.exercise__btn--repeat');
    const nextBtn = document.querySelector('.exercise__btn--next');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let exerciseButtons = document.querySelectorAll('.exercise__btn');
    const exerciseNotes = document.querySelectorAll('.note');
    const accidentalRegex = new RegExp('#')
    const whiteKeys = document.querySelectorAll("[data-color='white']")
    const fartherXCoord = 171
    const xCoord = 170
    let yCoord = 276
    let sharpOrFlat = 'none'
    const yCoordChange = 7
    const lowestLedgerLineYCoord = 276
    const secondLowestLedgerLineYCoord = lowestLedgerLineYCoord - yCoordChange * 2
    const middleCLedgerLineYCoord = 111
    const highestLedgerLineYCoord = 13
    const secondHighestLedgerLineYCoord = highestLedgerLineYCoord + yCoordChange * 2
    const endBtn = document.querySelector('.exercise__btn--end')
    const startContainer = document.querySelector('.start')
    const exerciseContainer = document.querySelector('.exercise')
    let notesIndex = 0
    let maximumNoteNumber
    let maxQuestions
    let counter = 1
    let questionCounter = 1
    let answeredCorrect = 0
    let timesAnswered = 0
    let chordQualityArr = []

    let notesArr = []
    let soundsArr = []
    let ledgerLinesArr = [
        {name:'lowestLedger', yCoord: lowestLedgerLineYCoord, true: false},
        {name:'secondLowestLedger', yCoord: secondLowestLedgerLineYCoord, true: false},
        {name:'middleCLedger', yCoord: middleCLedgerLineYCoord, true: false},
        {name:'secondHighestLedger', yCoord: secondHighestLedgerLineYCoord, true: false},
        {name:'highestLedger', yCoord: highestLedgerLineYCoord, true: false}
    ]
    let possibleButtonsArr = []
    const intervalsArr = ['unison', 'm2', 'M2', 'm3', 'M3', 'P4', 'Aug4/Dim5', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8', 'm9', 'M9', 'm10', 'M10', 'P11', 'Aug11/Dim12', 'P12', 'm13', 'M13', 'm14', 'M14', 'P15']
    let isQuestionsActive = false
    let isQualityActive = false
    let isNumberActive = false

    let chosenChordQualities = document.querySelectorAll('.active-quality-btn')

    function randomize(number){
        return Math.floor(Math.random() * number)
    }

    function setNumberOfQuestions(){
        const numberOfQuestionsText = document.querySelector('.start__options-chosen--questions')
        toggleButton(this, numberOfQuestionOptions)
        numberOfQuestionsText.innerText = ` ${this.innerText}`

        maxQuestions = parseInt(this.innerText, 10)
        isQuestionsActive = true
    }

    function setPossibleChordQualities(){
        const chordQualitiesTitle = document.querySelector('.start__options--qualities')
        this.classList.toggle('active-quality-btn')
        while(chordQualitiesTitle.firstChild) {
            chordQualitiesTitle.removeChild(chordQualitiesTitle.lastChild)
        }

        for(i = 0; i < chordQualityOptions.length; i++){
            const newSpan = document.createElement('span')
            for(j = 0; j < chordQualityOptions[i].classList.length; j++){
                if(chordQualityOptions[i].classList[j]  == 'active-quality-btn'){
                    newSpan.innerText = ` ${chordQualityOptions[i].innerText}`
                    chordQualitiesTitle.insertBefore(newSpan, chordQualitiesTitle.nextChild)
                }
            }
        }
        
        chosenChordQualities = document.querySelectorAll('.active-quality-btn')
        if(chosenChordQualities.length > 0){
            isQualityActive = true
        } else {
            isQualityActive = false
        }

    }


    function setNumberOfNotes(){
        const numberOfNotesText = document.querySelector('.start__options-chosen--notes')
        let minimumNoteNumber = 3
        toggleButton(this, numberOfNoteOptions)

        if(this.innerText == minimumNoteNumber){
            numberOfNotesText.innerText = ` ${minimumNoteNumber}`
        } else {
            numberOfNotesText.innerText = ` ${minimumNoteNumber}~${this.innerText}`
        }

        maximumNoteNumber = parseInt(this.innerText)

        isNumberActive = true
    }   

    function toggleButton(btn, list){
        for(i = 0; i < list.length; i++){
            for(j = 0; j < list[i].classList.length; j++){
                if(list[i].classList[j] == 'active-btn'){
                    list[i].classList.remove('active-btn')
                }
            }
        }
        btn.classList.toggle('active-btn')
    }


    function startExercise(){
        if(isQualityActive && isQuestionsActive && isNumberActive){
            for(i = 0; i < chosenChordQualities.length; i++){
                chordQualityArr.push(chosenChordQualities[i].innerText)
            }
            startContainer.classList.add('no-display')
            exerciseContainer.classList.add('display-flex')
        
            chooseNotesAndSounds()
            animate();


            questionCount.innerText = `${questionCounter}/${maxQuestions}`
        } else {
            alert('Please fill in all options before starting the exercise!')
        }
    }


    function determineLedgerLines(note, drawn){
        //if the note starts on a ledger line, add the appropriate ledger lines
        if(note == 0 && drawn){
            ledgerLinesArr[0].true = true
            ledgerLinesArr[1].true = true
        } else if(note > 0 && note < 3 && drawn){
            ledgerLinesArr[1].true = true
        } else if(note == 14 && drawn){
            ledgerLinesArr[2].true = true
        } else if((note == 26 || note == 27) && drawn){
            ledgerLinesArr[3].true = true
        } else if(note == 28 && drawn){
            ledgerLinesArr[3].true = true
            ledgerLinesArr[4].true = true
        }
    }

    function chooseStaff(note, coord){
        //sets where the notes will be
        if(note < 14){
            coord = lowestLedgerLineYCoord - (note * yCoordChange)
        //if the starting note starts or is above middle C, have that note start on the treble clef
        } else if(note >= 14){
            coord = middleCLedgerLineYCoord - ((note - 14) * yCoordChange)
        }
    }


    function createImages(source, xCoord, yCoord){
        const imgMaker = document.createElement('img');
        imgMaker.src = source;
        ctx.drawImage(imgMaker, xCoord, yCoord);
    }

    function animate(){
        const grandStaff = 'icons/grand-staff.svg'
        const wholeNote = 'icons/whole-note.svg'

        ctx.clearRect(0,0,canvas.width, canvas.height);
        createImages(grandStaff, 0, 0);

        for(i = 0; i < counter; i++){
            const note = notesArr[i]
            const sound = soundsArr[i]
            createImages(wholeNote, note.xCoord, note.yCoord)

            if(sound.sharpOrFlat == 'sharp'){
                createImages('icons/sharp-sign.svg', (note.xCoord - note.xCoordModifier) - 20, (note.yCoord - 9))
            } else if(sound.sharpOrFlat == 'flat'){
                createImages('icons/flat-sign.svg', (note.xCoord - note.xCoordModifier)  - 20, (note.yCoord - 16))
            } else if(sound.sharpOrFlat == 'double sharp'){
                createImages('icons/double-sharp.svg', (note.xCoord - note.xCoordModifier)  - 20, (note.yCoord - 16))
            }
        }

        for(i = 0; i<ledgerLinesArr.length; i++){
            if(ledgerLinesArr[i].true){
                createImages('icons/ledger-line.svg', xCoord, ledgerLinesArr[i].yCoord)
            }
            
        }
        requestAnimationFrame(animate);
    }

    function chooseNotesAndSounds(){
        let randomizeWhiteKeys = randomize(whiteKeys.length)
        let randomizedWhiteKey = whiteKeys[randomizeWhiteKeys]
        
        const randomizedChordQualityIndex = randomize(chordQualityArr.length)
        const randomizedChordQuality = chordQualityArr[randomizedChordQualityIndex]
        
        //lowers randomized white key if the chosen randomized white key is too high to make a closed triad
        if(randomizeWhiteKeys >= whiteKeys.length - 7){
            randomizeWhiteKeys -= 7
            randomizedWhiteKey = whiteKeys[randomizeWhiteKeys]
        }
        
        
        const possibleNotesArr = [{sound:randomizedWhiteKey, noteType:'root', yCoord: '', xCoord: xCoord}]
        let whiteKeysIndex = Array.prototype.indexOf.call(whiteKeys, possibleNotesArr[possibleNotesArr.length - 1].sound)


        //
        for(i = 0; i < 2; i++){
            if(whiteKeysIndex >= whiteKeys.length){
                break
            }
            for(j = 0; j < 3; j++){
                let noteType 
                if(j == 0){
                    whiteKeysIndex += 2
                    noteType = '3rd'
                } else if(j == 1){
                    whiteKeysIndex += 2
                    noteType = '5th'
                }else if(j == 2){
                    whiteKeysIndex += 3
                    noteType = 'root'
                }

                if(whiteKeysIndex >= whiteKeys.length){
                    break
                }

                possibleNotesArr.push({
                    sound:whiteKeys[whiteKeysIndex],
                    noteType: noteType,
                    yCoord: '',
                    xCoord: xCoord,
                    xCoordModifier: 0,
                    staff: '',
                    isDrawn: false,
                })
            }
        }

        
        let firstRootIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[0].sound)
        let firstThirdIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[1].sound)
        let firstFifthIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[2].sound)

        let whiteKeyChordQuality

        const firstInterval = firstThirdIndex - firstRootIndex
        const secondInterval = firstFifthIndex - firstThirdIndex

        //POSSIBLY MAKE INTO OWN FUNCTION
        if(firstInterval == 3){
            if(secondInterval == 3){
                whiteKeyChordQuality = 'Diminished'
            } else if(secondInterval == 4){
                whiteKeyChordQuality = 'Minor'
            }
        } else if(firstInterval == 4){
                whiteKeyChordQuality = 'Major'
        }
        
        function addAccidentals(initialArr, finalArr){
            for(i = 0; i < initialArr.length; i++){
                let sound
                let sharpOrFlat
                if(initialArr[i].noteType == '3rd'){
                    if(whiteKeyChordQuality == 'Major' && (randomizedChordQuality == 'Minor' || randomizedChordQuality == 'Diminished')){
                        sound = initialArr[i].sound.previousElementSibling
                        sharpOrFlat = 'flat'
                    } else if((whiteKeyChordQuality == 'Minor' || whiteKeyChordQuality == 'Diminished') && (randomizedChordQuality == 'Major' || randomizedChordQuality == 'Augmented')){
                        sound = initialArr[i].sound.nextElementSibling
                        sharpOrFlat = 'sharp'
                    } else {
                        sound = initialArr[i].sound
                        sharpOrFlat = 'none'
                    }  
                } else if(initialArr[i].noteType == '5th'){
                    if((whiteKeyChordQuality == 'Major' || whiteKeyChordQuality == 'Minor') && randomizedChordQuality == 'Diminished'){
                        sound = initialArr[i].sound.previousElementSibling
                        sharpOrFlat = 'flat'
                    }else if((whiteKeyChordQuality == 'Major' || whiteKeyChordQuality == 'Minor') && randomizedChordQuality == 'Augmented'){
                        sound = initialArr[i].sound.nextElementSibling
                        sharpOrFlat = 'sharp'
                    }else if(whiteKeyChordQuality == 'Diminished' && (randomizedChordQuality == 'Major' || randomizedChordQuality == 'Minor')){
                        sound = initialArr[i].sound.nextElementSibling
                        sharpOrFlat = 'sharp'
                    } else if(whiteKeyChordQuality == 'Diminished' && randomizedChordQuality == 'Augmented'){
                        sound = initialArr[i].sound.nextElementSibling.nextElementSibling
                        sharpOrFlat = 'double sharp'
                    } else {
                        sound = initialArr[i].sound
                        sharpOrFlat = 'none'
                    }
                } else {
                    sound = initialArr[i].sound
                    sharpOrFlat = 'none'
    
                }
                noteType = initialArr[i].noteType
                finalArr.push({sound: sound, sharpOrFlat: sharpOrFlat, interval: '', noteType: noteType, chordQuality: randomizedChordQuality})
            }
        }       

        addAccidentals(possibleNotesArr, possibleButtonsArr)
        let rootNotesArr = [], thirdsNotesArr = [], fifthsNotesArr = [], finalSoundsArr = [], finalNotesArr = []

        splitByNoteType(possibleNotesArr, rootNotesArr, 'root')
        splitByNoteType(possibleNotesArr, thirdsNotesArr, '3rd')
        splitByNoteType(possibleNotesArr, fifthsNotesArr, '5th')

        shuffle(rootNotesArr)
        shuffle(thirdsNotesArr)
        shuffle(fifthsNotesArr)

        while(maximumNoteNumber < rootNotesArr.length + thirdsNotesArr.length + fifthsNotesArr.length){
            while(fifthsNotesArr.length > 1){
                fifthsNotesArr.pop()
            }

            while(rootNotesArr.length > 1){
                rootNotesArr.pop()
            }

            while(thirdsNotesArr.length > 1){
                thirdsNotesArr.pop()
            }
        }
        
        pickRandomNumElements(rootNotesArr, finalNotesArr)
        pickRandomNumElements(thirdsNotesArr, finalNotesArr)
        pickRandomNumElements(fifthsNotesArr, finalNotesArr)
        
        addAccidentals(finalNotesArr, finalSoundsArr)
        
        //POSSIBLY MAKE INTO OWN FUNCTION
        
        
        finalNotesArr.sort((a, b) => parseInt(a.sound.dataset.num, 10) - parseInt(b.sound.dataset.num, 10))
        finalSoundsArr.sort((a, b) => parseInt(a.sound.dataset.num, 10) - parseInt(b.sound.dataset.num, 10))

        getIntervals(finalSoundsArr)
        
        //POSSIBLY MAKE INTO OWN FUNCTION
        for(i = 0; i < finalNotesArr.length; i++){
        const dataNumInteger = parseInt(finalNotesArr[i].sound.dataset.num, 10)
        
            if(dataNumInteger < 14){
                finalNotesArr[i].yCoord = lowestLedgerLineYCoord - (dataNumInteger * yCoordChange)
                finalNotesArr[i].staff = 'lower staff'
            //if the starting note starts or is above middle C, have that note start on the treble clef
            }else if(dataNumInteger >= 14){
                finalNotesArr[i].yCoord = middleCLedgerLineYCoord - ((dataNumInteger - 14) * yCoordChange)
                finalNotesArr[i].staff = 'higher staff'
            }

        }
        
        notesArr = finalNotesArr
        soundsArr = finalSoundsArr
        confirmNoteDrawn()
        repositionAccidentals()
        playSounds()
        updateButtons()
    }


    function confirmNoteDrawn(){
        let noteNumber = parseInt(notesArr[notesIndex].sound.dataset.num, 10)
        notesArr[notesIndex].isDrawn = true
        //console.log(noteNumber)
        //console.log(notesArr[notesIndex].isDrawn)
        determineLedgerLines(noteNumber, notesArr[notesIndex].isDrawn)
        
        notesIndex += 1
    }

    function shuffle(arr) {
        let currentIndex = arr.length
        let temporaryValue
        let randomIndex
    
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
        }
    
        return arr;
    }

    function splitByNoteType(initialArr, newArr, noteType){
        for(i = 0; i < initialArr.length; i++){
            if(initialArr[i].noteType == noteType){
                newArr.push(initialArr[i])
            }
        }
    }

    function pickRandomNumElements(firstArr, finalArr){
        const arrLength = randomize(firstArr.length) + 1

        for(i = 0; i < arrLength; i++){
            finalArr.push(firstArr[i])
        }
    }

    
    function getIntervals(arr){
        for(i = 1; i < arr.length; i++){
            let index = parseInt(Array.prototype.indexOf.call(exerciseNotes, arr[i].sound), 10)
            let previousIndex = parseInt(Array.prototype.indexOf.call(exerciseNotes, arr[i-1].sound), 10)
            arr[i-1].interval = intervalsArr[(index - previousIndex)]
        } 
    }

    function repositionAccidentals(){
        for(i = 1; i < soundsArr.length; i++){
            if((soundsArr[i - 1].interval == 'm3' || soundsArr[i - 1].interval == 'M3') && soundsArr[i - 1].sharpOrFlat != 'none' && soundsArr[i].sharpOrFlat != 'none' && notesArr[i - 1].staff == notesArr[i].staff && notesArr[i - 1].isDrawn && notesArr[i].isDrawn){
                notesArr[i - 1].xCoordModifier = 20
            }
        }
    }

    function playSounds(){
        for(i = 0; i < soundsArr.length; i++){
            soundsArr[i].sound.load()
            soundsArr[i].sound.play()
        }
    }

    function answerQuestion(){
        counter += 1
        confirmNoteDrawn()
        repositionAccidentals()
        answerChecker(this)
        updateButtons()
        endQuestion(counter, soundsArr.length, exerciseButtons)
    }

    const correctIndicator = document.querySelector('.exercise__container--correct')
    
    function answerChecker(btn){
        const soundsIndex = counter - 2    
        let answer = soundsArr[soundsIndex].interval
        correctIndicator.style.display = 'block'
        if(btn.dataset.interval == answer){
            correctIndicator.innerText = 'correct'
        } else {
            correctIndicator.innerText = `incorrect the answer is ${btn.innerText}`
        }

        updateScore()
    }

    function updateScore(){
        timesAnswered += 1
        
        if(correctIndicator.innerText == 'correct'){
            answeredCorrect += 1
        }

        timesAnsweredContainer.innerText = Math.floor(answeredCorrect / timesAnswered * 100) + '%'
    }

    function updateButtons(){
        const exerciseContainerChoices = document.querySelector('.exercise__container--choices')
        const currentSoundsArrIndex = counter - 1
        const currentExerciseNotesIndex = Array.prototype.indexOf.call(exerciseNotes, soundsArr[currentSoundsArrIndex].sound)
        const uppercase = /[A-Z]/
        for(i = 1; i < possibleButtonsArr.length + 1; i++){
                if(soundsArr[currentSoundsArrIndex].sound == possibleButtonsArr[i - 1].sound){
                possibleButtonsArr.splice(0, i)
                break

            }
        }

        while (exerciseContainerChoices.firstChild) {
            exerciseContainerChoices.removeChild(exerciseContainerChoices.firstChild);
        }

        for(i = 0; i< possibleButtonsArr.length; i++){
            const possibleExerciseNotesIndex = Array.prototype.indexOf.call(exerciseNotes, possibleButtonsArr[i].sound)
            possibleButtonsArr[i].interval = intervalsArr[possibleExerciseNotesIndex - currentExerciseNotesIndex]
            const buttonCreator = document.createElement('button')
            buttonCreator.classList.add('btn')
            buttonCreator.classList.add('exercise__btn')
            buttonCreator.dataset.interval = possibleButtonsArr[i].interval
            const whiteKeyName = possibleButtonsArr[i].sound.dataset.note.match(uppercase)[0]
            let prevWhiteKeyName = String.fromCharCode(whiteKeyName.charCodeAt(0) - 1)
        
            if(prevWhiteKeyName == '@'){
                prevWhiteKeyName = 'G'
            }

            if(possibleButtonsArr[i].sharpOrFlat == 'none' || possibleButtonsArr[i].sharpOrFlat == 'sharp'){
                if(i < 3){
                    buttonCreator.innerText = possibleButtonsArr[i].sound.dataset.note
                } else if(i >= 3){
                    buttonCreator.innerText = `${possibleButtonsArr[i].sound.dataset.note} higher octave`
                }
            } else if(possibleButtonsArr[i].sharpOrFlat == 'flat'){
                if(i < 3){
                    buttonCreator.innerText = `${prevWhiteKeyName}b`
                } else if(i >= 3){
                    buttonCreator.innerText = `${prevWhiteKeyName}b higher octave`
                }
            } else if(possibleButtonsArr[i].sharpOrFlat == 'double sharp'){
                if(i < 3){
                    buttonCreator.innerText = `${whiteKeyName}x`
                } else if(i >= 3){
                    buttonCreator.innerText = `${whiteKeyName}x higher octave`
                }
            }
            

            exerciseContainerChoices.appendChild(buttonCreator)
        }
        
        exerciseButtons = document.querySelectorAll('.exercise__btn')
        exerciseButtons.forEach(btn => btn.addEventListener('click', answerQuestion))   
    }

    function endQuestion(x, y, btns){
        
        if(x == y && questionCounter < maxQuestions){
            switchButtons(repeatBtn, nextBtn)
            btns.forEach(button => button.removeEventListener('click', answerQuestion))        
        } else if(x == y && questionCounter == maxQuestions){
            switchButtons(repeatBtn, endBtn)
            btns.forEach(button => button.removeEventListener('click', answerQuestion))
            correctIndicator.innerText = `You finished! You got ${timesAnsweredContainer.innerText}`
        }
    }

    function switchButtons(btnOne, btnTwo){
        btnOne.style.display = 'none'
        btnTwo.style.display = 'inline'
    }

    function startNewQuestion(){
        exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))
        counter = 1
        notesIndex = 0
        for(i = 0; i < ledgerLinesArr.length; i++){
            ledgerLinesArr[i].true = false
        }
        chooseNotesAndSounds()
        correctIndicator.innerText = 'pick the next note above the current highest'
        switchButtons(nextBtn, repeatBtn)
        questionCounter = 1 + questionCounter
        questionCount.innerText = `${questionCounter}/${maxQuestions}`
        
        
    }

    function endExercise(){
        questionCounter = 1
        counter = 1
        answeredCorrect = 0
        timesAnswered = 0
        notesIndex = 0
        correctIndicator.innerText = 'pick the next note above the current highest'
        startContainer.classList.remove('no-display')
        exerciseContainer.classList.remove('display-flex')
        updateScore()
        exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))    
        switchButtons(endBtn, repeatBtn)
        for(i = 0; i < ledgerLinesArr.length; i++){
            ledgerLinesArr[i].true = false
        }
    }

    startExerciseBtn.addEventListener('click', startExercise)
    numberOfQuestionOptions.forEach(btn => btn.addEventListener('click', setNumberOfQuestions))
    chordQualityOptions.forEach(btn => btn.addEventListener('click', setPossibleChordQualities))
    numberOfNoteOptions.forEach(btn => btn.addEventListener('click', setNumberOfNotes))
    repeatBtn.addEventListener('click', playSounds)
    exerciseButtons.forEach(button => button.addEventListener('click', answerQuestion))    
    nextBtn.addEventListener('click', startNewQuestion)
    endBtn.addEventListener('click', endExercise)


    /*THINGS I NEED TO FIX
    1.CHANGE THE NOTE NAMES IN THE EXERCISE BUTTONS NAMES IF THEY AREN'T SUPPOSED TO BE SHARPS
    2. Figure how to make the code scrambled so you can inhibit cheating
    3. COMMENT CODE
    4. SIMPLIFY CODE SOMEHOW
        -move more variables inside functions
        -instead of using the animate function, only animate when something new needs to be drawn
    5.upload to github
    // POSSIBLY MAKE A CHORD QUALITIES BUTTON 
    */