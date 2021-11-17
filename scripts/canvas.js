//creates canvas and animates it
function draw(){
    //creating canvas
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    
    const grandStaff = 'icons/grand-staff.svg'
    
    
    //create image on canvas with provided x and y coord
    function createImages(source, xCoord, yCoord){
        const imgMaker = document.createElement('img')
        imgMaker.onload = () => {ctx.drawImage(imgMaker, xCoord, yCoord)}
            
        imgMaker.src = source
    }

    //if there is an accidental, draw accidental
    function drawNotesAndSharps(){
        for(i = 0; i < notesIndex; i++){
            const note = notesArr[i], sound = soundsArr[i], accidental = sound.sharpOrFlat
            const sharp = 'icons/sharp-sign.svg', flat = 'icons/flat-sign.svg', doubleSharp = 'icons/double-sharp.svg', wholeNote = 'icons/whole-note.svg'
            const noteXCoord = note.xCoord, noteYCoord = note.yCoord
            const accidentalXCoord = (note.xCoord - note.xCoordModifier) - 20, accidentalYCoord = (note.yCoord - 16)
            //draws the accidental if required
            if(accidental == 'sharp'){
                createImages(sharp, accidentalXCoord, accidentalYCoord)
            } else if(accidental == 'flat'){
                createImages(flat, accidentalXCoord, accidentalYCoord)
            } else if(accidental == 'double sharp'){
                createImages(doubleSharp, accidentalXCoord, accidentalYCoord)
            }
            createImages(wholeNote, noteXCoord, noteYCoord)// draws the note
        }
    }
    
    //if there are ledger lines needed, draw ledger
    function drawLedgerLines(){
        for(i = 0; i<ledgerLinesArr.length; i++){
            const ledgerLine = 'icons/ledger-line.svg', thereIsLedger = ledgerLinesArr[i].true
            const ledgerLineXCoord = xCoord, ledgerLineYCoord = ledgerLinesArr[i].yCoord

            if(thereIsLedger){
                createImages(ledgerLine, ledgerLineXCoord, ledgerLineYCoord)// draws the ledger line if required
            }
        }
    }

    ctx.clearRect(0,0,canvas.width, canvas.height)// draws blank white canvas
    createImages(grandStaff, 0, 0)//draws music staff
    drawNotesAndSharps() // draws notes and sharps
    drawLedgerLines() // draws ledger lines
    // requestAnimationFrame(draw)// draws staff again
}
//updates information related to canvas and remakes the buttons
function updateScreen(){
    //if a note is drawn on a specific x coord where a ledger line is needed, draw ledger
    function determineLedgerLines(note, drawn){
        if(note == 0 && drawn){//if note is C below bass clef, set the 2 lines needed to true
            ledgerLinesArr[0].true = true
            ledgerLinesArr[1].true = true
        } else if(note > 0 && note < 3 && drawn){//if the note either D or E below bass clef, set the 1 line needed to true
            ledgerLinesArr[1].true = true
        } else if(note == 14 && drawn){//if middle C, set the 1 line needed to true
            ledgerLinesArr[2].true = true
        } else if((note == 26 || note == 27) && drawn){//if A or B above treble staff, set 1 line needed to true
            ledgerLinesArr[3].true = true
        } else if(note == 28 && drawn){//if C above treble staff, set 2 lines need to true
            ledgerLinesArr[3].true = true
            ledgerLinesArr[4].true = true
        }
    }

    //confirm note is drawn, needed to prevent ledger line to be drawn before note is revealed
    function confirmNoteDrawn(){
        let noteNumber = parseInt(notesArr[notesIndex].num, 10)

        notesArr[notesIndex].isDrawn = true // sets the most recently drawn note key of isDrawn to true
        determineLedgerLines(noteNumber, notesArr[notesIndex].isDrawn)
        
        notesIndex += 1
    }

    //repositions x position of accidentals. If one accidental is too close to another one, it causes the drawing of the accidentals to overlap thus necessitating the repositioning
    function repositionAccidentals(){
        for(i = 1; i < soundsArr.length; i++){
            //if an interval between 2 notes is a 3rd, both notes have an accidental, and both are now drawn, have the first note's accidental moved to the left
            const prevIndex = i - 1
            const currentIndex = i
            if((soundsArr[prevIndex].interval == 'm3' || soundsArr[prevIndex].interval == 'M3') && soundsArr[prevIndex].sharpOrFlat != 'none' && soundsArr[currentIndex].sharpOrFlat != 'none' && notesArr[prevIndex].staff == notesArr[currentIndex].staff && notesArr[prevIndex].isDrawn && notesArr[currentIndex].isDrawn){
                notesArr[prevIndex].xCoordModifier = 20
            }
        }
    }
    
    //removes and makes new buttons when an exercise button is clicked
    function updateButtons(){
        const exerciseContainerChoices = document.querySelector('.exercise__container--choices')
        const currentSoundsArrIndex = notesIndex - 1
        const currentExerciseNotesIndex = Array.prototype.indexOf.call(exerciseNotes, soundsArr[currentSoundsArrIndex].exerciseNoteItem)
        
        //removes items in possibleButtonsArr below the highest currently shown note
        for(i = 1; i < possibleButtonsArr.length + 1; i++){
            if(soundsArr[currentSoundsArrIndex].exerciseNoteItem == possibleButtonsArr[i - 1].exerciseNoteItem){//if the current sound from soundsArr matches the sound of the possibleButtonsArr
                possibleButtonsArr.splice(0, i)//remove all items in arr below highest currently shown note
                break
            }
        }

        //removes all buttons
        while (exerciseContainerChoices.firstChild) {//while exerciseContainerChoices has a firstChild
            exerciseContainerChoices.removeChild(exerciseContainerChoices.firstChild)// remove child
        }
        
        //create 6 exercise buttons
        for(i = 0; i < possibleButtonsArr.length; i++){
            const possibleExerciseNotesIndex = Array.prototype.indexOf.call(exerciseNotes, possibleButtonsArr[i].exerciseNoteItem)
            possibleButtonsArr[i].interval = intervalsArr[possibleExerciseNotesIndex - currentExerciseNotesIndex]//creates interval key
            const buttonCreator = document.createElement('button')//create button
            buttonCreator.classList.add('btn', 'exercise__btn')// give these html classes
            buttonCreator.dataset.interval = possibleButtonsArr[i].interval//add intervals to data-interval attribute
            const chordLength = 3
            const maxNumberOfButtons = chordLength * 2 //creates 2 chord lengths' worth of buttons
            
            if(i == maxNumberOfButtons){
                break
            } else {
                buttonCreator.innerText = possibleButtonsArr[i].noteName
            }
            exerciseContainerChoices.appendChild(buttonCreator)
        }
        //add selectors and event listeners
        exerciseButtons = document.querySelectorAll('.exercise__btn')
        exerciseButtons.forEach(btn => btn.addEventListener('click', answerQuestion))   
    }
    
    confirmNoteDrawn()//confirm the highest currently drawn note is drawn
    repositionAccidentals()// repositions accidentals if necessary
    updateButtons()// removes old and creates new buttons
    
    draw()//calls draw function
}