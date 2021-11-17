const xCoord = 170
const yCoordChange = 7
const lowestLedgerLineYCoord = 276, secondLowestLedgerLineYCoord = lowestLedgerLineYCoord - yCoordChange * 2, middleCLedgerLineYCoord = 111, highestLedgerLineYCoord = 13, secondHighestLedgerLineYCoord = highestLedgerLineYCoord + yCoordChange * 2
let ledgerLinesArr = [
    {name:'lowestLedger', yCoord: lowestLedgerLineYCoord, true: false},
    {name:'secondLowestLedger', yCoord: secondLowestLedgerLineYCoord, true: false},
    {name:'middleCLedger', yCoord: middleCLedgerLineYCoord, true: false},
    {name:'secondHighestLedger', yCoord: secondHighestLedgerLineYCoord, true: false},
    {name:'highestLedger', yCoord: highestLedgerLineYCoord, true: false}
]
const intervalsArr = ['unison', 'm2', 'M2', 'm3', 'M3', 'P4', 'Aug4/Dim5', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8', 'm9', 'M9', 'm10', 'M10', 'P11', 'Aug11/Dim12', 'P12', 'm13', 'M13', 'm14', 'M14', 'P15']
let notesArr = [], soundsArr = []
let possibleButtonsArr = []


//gives a number from 0 to number specified - 1, decimals will round down
function randomize(number){
    const randomNum = Math.floor(Math.random() * number)

    return randomNum
}

//generates all the notes and sounds data to create the pictures on the canvas, create the buttons, and play the sounds
function chooseNotesAndSounds(){
    const whiteKeys = exerciseNotes.filter(notes => notes.color == 'white')// these correspond to the white keys of a keyboard instrument
    const randomizeWhiteKeys = randomize(whiteKeys.length - 18)// range is between 0 and whiteKeys length minus 19 so there are at least 2 buttons to choose from at the end of each question
    const randomizedWhiteKey = whiteKeys[randomizeWhiteKeys]// choose a white key randomly in node list
    const randomizedChordQualityIndex = randomize(chosenChordQualities.length)
    const randomizedChordQuality = chosenChordQualities[randomizedChordQualityIndex].innerText//randomly choose a chord quality
    const allNotesArr = [{staffNote: randomizedWhiteKey.name, exerciseNoteItem:randomizedWhiteKey, num: randomizedWhiteKey.num, noteType:'root', yCoord: '', xCoord: xCoord}]//first item in array is the lowest possible note in the question
    let whiteKeysIndex = Array.prototype.indexOf.call(whiteKeys, allNotesArr[allNotesArr.length - 1].exerciseNoteItem)// this is the index of the randomly chosen note of the whiteKeys nodelist
    let whiteKeyChordQuality
    let possibleNotesArr = []
    //adds all notes from randomizedWhiteKey to end of whiteKeys nodelist skipping notes that don't form the chord from randomizedWhiteKey
    function addToAllNotesArr(){
        //if whiteKeysIndex ever exceeds whiteKeys length, stop loop
        while(whiteKeysIndex < whiteKeys.length){
            for(j = 0; j < 3; j++){//3 is the chord's length
                let noteType 
                //create array with randomizedWhiteKey as root, creating a chord based off of only white keys
                if(j == 0){
                    whiteKeysIndex += 2
                    noteType = 'third'
                } else if(j == 1){
                    whiteKeysIndex += 2
                    noteType = 'fifth'
                } else if(j == 2){
                    whiteKeysIndex += 3
                    noteType = 'root'
                }
                //if whiteKeysIndex ever exceeds whiteKeys length, stop loop
                if(whiteKeysIndex >= whiteKeys.length){
                    break
                }
                //pushes an object into allNotesArr with various data attached to it
                allNotesArr.push({
                    staffNote: whiteKeys[whiteKeysIndex].name,
                    exerciseNoteItem:whiteKeys[whiteKeysIndex],
                    num: whiteKeys[whiteKeysIndex].num,
                    noteType: noteType,
                    yCoord: '',
                    xCoord: xCoord,
                    xCoordModifier: 0,
                    staff: '',
                    isDrawn: false,
                })
            }
        }    
    }
    //creates new array from allNotesArr which'll be used to determine the possible notes written on the staff
    function addToPossibleNotesArr(){
        const highestWhiteKeyIndex = Array.prototype.indexOf.call(whiteKeys, whiteKeys[whiteKeys.length - 1]) 
        const thirdHighestWhiteKeyIndex = Array.prototype.indexOf.call(whiteKeys, whiteKeys[whiteKeys.length - 3])
        //create arr, go to 8 so that notes down the line aren't too far apart and there are enough so that there are at least two notes at the end of each question
        for(i = 0; i < 8; i++){
            possibleNotesArr.push(allNotesArr[i])
        }


        const highestPossibleNoteArrIndex = Array.prototype.indexOf.call(whiteKeys, possibleNotesArr[possibleNotesArr.length - 1].exerciseNoteItem)
        //if the highest possible note is between the third highest and highest overall note in program, remove the second highest note
        if(highestPossibleNoteArrIndex >= thirdHighestWhiteKeyIndex && highestPossibleNoteArrIndex <= highestWhiteKeyIndex){   
            const secondHighestIndex = possibleNotesArr.length - 2
            possibleNotesArr.splice(secondHighestIndex, 1)
        }
    }
    //determine the quality of the chord made in allNotesArr, which was then passed onto possibleNotesArr
    function determineWhiteKeyChordQuality(){
        
        let firstRootIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[0].exerciseNoteItem)
        let firstThirdIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[1].exerciseNoteItem)
        let firstFifthIndex = Array.prototype.indexOf.call(exerciseNotes, possibleNotesArr[2].exerciseNoteItem)

        const firstInterval = firstThirdIndex - firstRootIndex //an interval is how far one note is from another
        const secondInterval = firstFifthIndex - firstThirdIndex
        const minorThird = 3 //a type of interval
        const majorThird = 4 //a type of interval
        //if the first interval is a minor third, the possible qualities are 'diminished' and 'minor'
        if(firstInterval == minorThird){
            if(secondInterval == minorThird){
                whiteKeyChordQuality = 'Diminished'
            } else if(secondInterval == majorThird){
                whiteKeyChordQuality = 'Minor'
            }
        //if the first interval is a major third, the only possible quality would be major
        } else if(firstInterval == majorThird){
            whiteKeyChordQuality = 'Major'
        }
    }

    //takes items in initial arr, changes the item if needed and push to final arr
    function addAccidentals(initialArr, finalArr){
        for(i = 0; i < initialArr.length; i++){
            const noteTypeIndex = Array.prototype.indexOf.call(exerciseNotes, initialArr[i].exerciseNoteItem)
            let exerciseNoteItem, sharpOrFlat
            let sharpOrFlatObj = {flat: {sharpOrFlat: 'flat', sharpOrFlatSymbol: 'b'}, sharp: {sharpOrFlat: 'sharp', sharpOrFlatSymbol: '#'}, doubleSharp: {sharpOrFlat: 'double sharp', sharpOrFlatSymbol: 'x'}, none: {sharpOrFlat: 'none', sharpOrFlatSymbol: ''}}
            if(initialArr[i].noteType == 'third'){
                if(whiteKeyChordQuality == 'Major' && (randomizedChordQuality == 'Minor' || randomizedChordQuality == 'Diminished')){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex - 1]
                    sharpOrFlat = sharpOrFlatObj.flat
                    
                } else if((whiteKeyChordQuality == 'Minor' || whiteKeyChordQuality == 'Diminished') && (randomizedChordQuality == 'Major' || randomizedChordQuality == 'Augmented')){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex + 1]
                    sharpOrFlat = sharpOrFlatObj.sharp
                } else {
                    exerciseNoteItem = exerciseNotes[noteTypeIndex]
                    sharpOrFlat = sharpOrFlatObj.none
                }  
            } else if(initialArr[i].noteType == 'fifth'){
                if((whiteKeyChordQuality == 'Major' || whiteKeyChordQuality == 'Minor') && randomizedChordQuality == 'Diminished'){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex - 1]
                    sharpOrFlat = sharpOrFlatObj.flat
                }else if((whiteKeyChordQuality == 'Major' || whiteKeyChordQuality == 'Minor') && randomizedChordQuality == 'Augmented'){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex + 1]
                    sharpOrFlat = sharpOrFlatObj.sharp
                }else if(whiteKeyChordQuality == 'Diminished' && (randomizedChordQuality == 'Major' || randomizedChordQuality == 'Minor')){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex + 1]
                    sharpOrFlat = sharpOrFlatObj.sharp
                } else if(whiteKeyChordQuality == 'Diminished' && randomizedChordQuality == 'Augmented'){
                    exerciseNoteItem = exerciseNotes[noteTypeIndex + 2]
                    sharpOrFlat = sharpOrFlatObj.doubleSharp
                } else {
                    exerciseNoteItem = exerciseNotes[noteTypeIndex]
                    sharpOrFlat = sharpOrFlatObj.none
                }
            } else {
                exerciseNoteItem = exerciseNotes[noteTypeIndex]
                sharpOrFlat = sharpOrFlatObj.none
            }

            const chars = initialArr[i].staffNote.split('');
            let noteName = `${chars[0]}${sharpOrFlat.sharpOrFlatSymbol}${chars[1]}`
            
            noteType = initialArr[i].noteType
            finalArr.push({exerciseNoteItem: exerciseNoteItem, noteName: noteName, staffNote: exerciseNoteItem.name, sharpOrFlat: sharpOrFlat.sharpOrFlat, sharpOrFlatSymbol: sharpOrFlat.sharpOrFlatSymbol, interval: '', noteType: noteType, chordQuality: randomizedChordQuality})
        }
    }       
    
    let finalSoundsArr = [], finalNotesArr = []
    
    //groups items in array by specified object key and returns a new array
    function groupBy(array, property) {
        var arr = []
        for (var i = 0; i < array.length; i++) {
            if (!arr[array[i][property]]) {arr[array[i][property]] = []}
            arr[array[i][property]].push(array[i])
        }
        return arr
    }

    //reduces number of notes by first determining final number of notes in chord, removing items in such a way that at least one of each note type remains
    function reduceNumberOfNotes(){
        let currentNumberOfNotes = splitArr.root.length + splitArr.third.length + splitArr.fifth.length// later down the line, redefine so that chords of various chord lengths can be put here
        const randomizedMinMaxNum = randomize(maximumNoteNumber - 2) + 3 //gives a range of 3 to 7 depending on maximumNoteNumber
        //while the current number of notes is greater than the randomized number, remove a note
        while(randomizedMinMaxNum < currentNumberOfNotes){
            const randomizeThree = randomize(3)
            let splitIntervalsArr = [splitArr.root, splitArr.third, splitArr.fifth]
            const randomizedSplitIntervalsArr = splitIntervalsArr[randomizeThree]
            //remove item if chosen arr has more than one item
            if(randomizedSplitIntervalsArr.length > 1)
            randomizedSplitIntervalsArr.splice(randomize(randomizedSplitIntervalsArr.length), 1)
            currentNumberOfNotes = splitArr.root.length + splitArr.third.length + splitArr.fifth.length
        }
    }

    //brings all arrays into one final array
    function consolidateArrays(arrOne, arrTwo, arrThree, finalArr){
        let consolidatedArr = arrOne.concat(arrTwo, arrThree)
        for(i = 0; i < consolidatedArr.length; i++){
            finalArr.push(consolidatedArr[i])
        }
    }
    
    //gets names of intervals from the intervalsArr data and adds key to object
    function getIntervals(arr){
        for(i = 1; i < arr.length; i++){
            let index = parseInt(Array.prototype.indexOf.call(exerciseNotes, arr[i].exerciseNoteItem), 10)
            let previousIndex = parseInt(Array.prototype.indexOf.call(exerciseNotes, arr[i-1].exerciseNoteItem), 10)
            arr[i-1].interval = intervalsArr[(index - previousIndex)]
        } 
    }
    
    //separates notes by staff, the lower numbered notes go into the lower staff called the bass clef and the higher go into the higher staff aka treble clef
    function separateNotesIntoStaves(){
        for(i = 0; i < finalNotesArr.length; i++){
            const numInteger = parseInt(finalNotesArr[i].num, 10)//change data-num attribute from string to integer 
            
            if(numInteger < 14){
                finalNotesArr[i].yCoord = lowestLedgerLineYCoord - (numInteger * yCoordChange)
                finalNotesArr[i].staff = 'lower staff'
                //if the starting note starts or is above middle C, have that note start on the treble clef
            }else if(numInteger >= 14){
                finalNotesArr[i].yCoord = middleCLedgerLineYCoord - ((numInteger - 14) * yCoordChange)
                finalNotesArr[i].staff = 'higher staff'
            }
        }
    }
    
    addToAllNotesArr()// creates allNotesArr
    addToPossibleNotesArr()// takes allNotesArr and creates possibleNotesArr
    determineWhiteKeyChordQuality()// determine chord quality for canvas purposes
    addAccidentals(allNotesArr, possibleButtonsArr) // takes allNotes and creates possibleButtonsArr
    const splitArr = groupBy(possibleNotesArr, 'noteType')// splits possibleNotesArr by noteType
    reduceNumberOfNotes()// reduces number of notes if needed to fit max number of notes requirement
    consolidateArrays(splitArr.root, splitArr.third, splitArr.fifth, finalNotesArr)// brings back split array back into one finalNotesArr
    finalNotesArr.sort((a, b) => parseInt(a.num, 10) - parseInt(b.num, 10))//arrange notes
    addAccidentals(finalNotesArr, finalSoundsArr)// add accidentals from finalNotesArr to make finalSoundsArr
    getIntervals(finalSoundsArr)//add intervals key to finalSoundsArr
    separateNotesIntoStaves()//add staff key to finalNotesArr
    notesArr = finalNotesArr
    soundsArr = finalSoundsArr
    playSounds() //play sounds of soundsArr
    updateScreen() //update the canvas and buttons
}

//loops through soundsArr and playing one sound per loop
function playSounds(){
    for(i = 0; i < soundsArr.length; i++){
        soundies.play(soundsArr[i].staffNote)
    }
}
