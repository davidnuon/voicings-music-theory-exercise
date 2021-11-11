const lengthInMs = 1500
const exerciseNoties = [
  {
    name: 'C2',
    sound: [0 * lengthInMs, lengthInMs],
    color: 'white',
    num: 0
  },
  {
    name: 'CSharp2',
    sound: [1 * lengthInMs, lengthInMs],
    color: 'black',
    num: 0
  },
  {
    name: 'D2',
    sound: [2 * lengthInMs, lengthInMs],
    color: 'white',
    num: 1
  },
  {
    name: 'DSharp2',
    sound: [3 * lengthInMs, lengthInMs],
    color: 'black',
    num: 1
  },
  {
    name: 'E2',
    sound: [4 * lengthInMs, lengthInMs],
    color: 'white',
    num: 2
  },
  {
    name: 'F2',
    sound: [5 * lengthInMs, lengthInMs],
    color: 'white',
    num: 3
  },
  {
    name: 'FSharp2',
    sound: [6 * lengthInMs, lengthInMs],
    color: 'black',
    num: 3
  },
  {
    name: 'G2',
    sound: [7 * lengthInMs, lengthInMs],
    color: 'white',
    num: 4
  },
  {
    name: 'GSharp2',
    sound: [8 * lengthInMs, lengthInMs],
    color: 'black',
    num: 4
  },
  {
    name: 'A2',
    sound: [9 * lengthInMs, lengthInMs],
    color: 'white',
    num: 5
  },
  {
    name: 'ASharp2',
    sound: [10 * lengthInMs, lengthInMs],
    color: 'black',
    num: 5
  },
  {
    name: 'B2',
    sound: [11 * lengthInMs, lengthInMs],
    color: 'white',
    num: 6
  },
  {
    name: 'C3',
    sound: [12 * lengthInMs, lengthInMs],
    color: 'white',
    num: 7
  },
  {
    name: 'CSharp3',
    sound: [13 * lengthInMs, lengthInMs],
    color: 'black',
    num: 7
  },
  {
    name: 'D3',
    sound: [14 * lengthInMs, lengthInMs],
    color: 'white',
    num: 8
  },
  {
    name: 'DSharp3',
    sound: [15 * lengthInMs, lengthInMs],
    color: 'black',
    num: 8
  },
  {
    name: 'E3',
    sound: [16 * lengthInMs, lengthInMs],
    color: 'white',
    num: 9
  },
  {
    name: 'F3',
    sound: [17 * lengthInMs, lengthInMs],
    color: 'white',
    num: 10
  },
  {
    name: 'FSharp3',
    sound: [18 * lengthInMs, lengthInMs],
    color: 'black',
    num: 10
  },
  {
    name: 'G3',
    sound: [19 * lengthInMs, lengthInMs],
    color: 'white',
    num: 11
  },
  {
    name: 'GSharp3',
    sound: [20 * lengthInMs, lengthInMs],
    color: 'black',
    num: 11
  },
  {
    name: 'A3',
    sound: [21 * lengthInMs, lengthInMs],
    color: 'white',
    num: 12
  },
  {
    name: 'ASharp3',
    sound: [22 * lengthInMs, lengthInMs],
    color: 'black',
    num: 12
  },
  {
    name: 'B3',
    sound: [23 * lengthInMs, lengthInMs],
    color: 'white',
    num: 13
  },
  {
    name: 'C4',
    sound: [24 * lengthInMs, lengthInMs],
    color: 'white',
    num: 14
  },
  {
    name: 'CSharp4',
    sound: [25 * lengthInMs, lengthInMs],
    color: 'black',
    num: 14
  },
  {
    name: 'D4',
    sound: [26 * lengthInMs, lengthInMs],
    color: 'white',
    num: 15
  },
  {
    name: 'DSharp4',
    sound: [27 * lengthInMs, lengthInMs],
    color: 'black',
    num: 15
  },
  {
    name: 'E4',
    sound: [28 * lengthInMs, lengthInMs],
    color: 'white',
    num: 16
  },
  {
    name: 'F4',
    sound: [29 * lengthInMs, lengthInMs],
    color: 'white',
    num: 17
  },
  {
    name: 'FSharp4',
    sound: [30 * lengthInMs, lengthInMs],
    color: 'black',
    num: 17
  },
  {
    name: 'G4',
    sound: [31 * lengthInMs, lengthInMs],
    color: 'white',
    num: 18
  },
  {
    name: 'GSharp4',
    sound: [32 * lengthInMs, lengthInMs],
    color: 'black',
    num: 18
  },
  {
    name: 'A4',
    sound: [33 * lengthInMs, lengthInMs],
    color: 'white',
    num: 19
  },
  {
    name: 'ASharp4',
    sound: [34 * lengthInMs, lengthInMs],
    color: 'black',
    num: 19
  },
  {
    name: 'B4',
    sound: [35 * lengthInMs, lengthInMs],
    color: 'white',
    num: 20
  },
  {
    name: 'C5',
    sound: [36 * lengthInMs, lengthInMs],
    color: 'white',
    num: 21
  },
  {
    name: 'CSharp5',
    sound: [37 * lengthInMs, lengthInMs],
    color: 'black',
    num: 21
  },
  {
    name: 'D5',
    sound: [38 * lengthInMs, lengthInMs],
    color: 'white',
    num: 22
  },
  {
    name: 'DSharp5',
    sound: [39 * lengthInMs, lengthInMs],
    color: 'black',
    num: 22
  },
  {
    name: 'E5',
    sound: [40 * lengthInMs, lengthInMs],
    color: 'white',
    num: 23
  },
  {
    name: 'F5',
    sound: [41 * lengthInMs, lengthInMs],
    color: 'white',
    num: 24
  },
  {
    name: 'FSharp5',
    sound: [42 * lengthInMs, lengthInMs],
    color: 'black',
    num: 24
  },
  {
    name: 'G5',
    sound: [43 * lengthInMs, lengthInMs],
    color: 'white',
    num: 25
  },
  {
    name: 'GSharp5',
    sound: [44 * lengthInMs, lengthInMs],
    color: 'black',
    num: 25
  },
  {
    name: 'A5',
    sound: [45 * lengthInMs, lengthInMs],
    color: 'white',
    num: 26
  },
  {
    name: 'ASharp5',
    sound: [46 * lengthInMs, lengthInMs],
    color: 'black',
    num: 26
  },
  {
    name: 'B5',
    sound: [47 * lengthInMs, lengthInMs],
    color: 'white',
    num: 27
  },
  {
    name: 'C6',
    sound: [48 * lengthInMs, lengthInMs],
    color: 'white',
    num: 28
  },
  {
    name: 'CSharp6',
    sound: [49 * lengthInMs, lengthInMs],
    color: 'black',
    num: 28
  },
]
var soundies = new Howl({
    src: ['./sounds/piano-spritesheet.mp3'],
    sprite: {
      C2: exerciseNoties[0].sound,
      CSharp2: exerciseNoties[1].sound,
      D2: exerciseNoties[2].sound,
      DSharp2: exerciseNoties[3].sound,
      E2: exerciseNoties[4].sound,
      F2: exerciseNoties[5].sound,
      FSharp2: exerciseNoties[6].sound,
      G2: exerciseNoties[7].sound,
      GSharp2: exerciseNoties[8].sound,
      A2: exerciseNoties[9].sound,
      ASharp2: exerciseNoties[10].sound,
      B2: exerciseNoties[11].sound,
      C3: exerciseNoties[12].sound,
      CSharp3: exerciseNoties[13].sound,
      D3: exerciseNoties[14].sound,
      DSharp3: exerciseNoties[15].sound,
      E3: exerciseNoties[16].sound,
      F3: exerciseNoties[17].sound,
      FSharp3: exerciseNoties[18].sound,
      G3: exerciseNoties[19].sound,
      GSharp3: exerciseNoties[20].sound,
      A3: exerciseNoties[21].sound,
      ASharp3: exerciseNoties[22].sound,
      B3: exerciseNoties[23].sound,
      C4: exerciseNoties[24].sound,
      CSharp4: exerciseNoties[25].sound,
      D4: exerciseNoties[26].sound,
      DSharp4: exerciseNoties[27].sound,
      E4: exerciseNoties[28].sound,
      F4: exerciseNoties[29].sound,
      FSharp4: exerciseNoties[30].sound,
      G4: exerciseNoties[31].sound,
      GSharp4: exerciseNoties[32].sound,
      A4: exerciseNoties[33].sound,
      ASharp4: exerciseNoties[34].sound,
      B4: exerciseNoties[35].sound,
      C5: exerciseNoties[36].sound,
      CSharp5: exerciseNoties[37].sound,
      D5: exerciseNoties[38].sound,
      DSharp5: exerciseNoties[39].sound,
      E5: exerciseNoties[40].sound,
      F5: exerciseNoties[41].sound,
      FSharp5: exerciseNoties[42].sound,
      G5: exerciseNoties[43].sound,
      GSharp5: exerciseNoties[44].sound,
      A5: exerciseNoties[45].sound,
      ASharp5: exerciseNoties[46].sound,
      B5: exerciseNoties[47].sound,
      C6: exerciseNoties[48].sound,
      CSharp6: exerciseNoties[49].sound,
    }
  });