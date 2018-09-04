function GameMusic() {
  this.state = false;
  
  const ac = new AudioContext();
  const tempo = 180;
  const C = ['C3', 'E3', 'G3'];
  const D = ['D3', 'Gb3', 'A3'];
  const Em = ['E3', 'G3', 'B3'];
  const Fd = ['Gb3', 'A3', 'C4'];
  const G = ['G3', 'B3', 'D4'];
  const Am = ['A3', 'C4', 'E4'];
  const B = ['B3', 'Eb4', 'Gb4'];
  
  const m = (seq, time) => {
    let arr = [];
    for (let i = 0; i < time; i++) {
      arr = [...arr, ...seq];
    }
    return arr;
  };
  
  const s = (seq, time) => seq.map(note => `${note} ${time}`);
  
  const aChords = [Em,Em,Em,Am,Am,Am,B,Em];
  const bChords = [Em,Am,D,G,C,Am,Fd,Em];
  const cChords = [G,G,B,B,D,D,Am,B,C,C,Em,Em,Fd,Fd,B,Em,];
  
  const allChords = [
    Em, Em,
    ...m(aChords, 2), 
    ...m(bChords, 2), 
    ...cChords, 
    ...bChords
  ];
  
  const createChords = chords => {
    const seqs = [];
    for (let i = 0; i < chords[0].length; i++) {
      const notes = chords.reduce((rv, notes) => {
        const note = i === 0 ?
          [`${notes[i]} 1`, '- 2'] :
          ['- 1', `${notes[i]} 0.5`, '- 0.5', `${notes[i]} 0.5`, '- 0.5'];
  
        return [...rv, ...note];
      }, []);
      
      seqs.push(new TinyMusic.Sequence(ac, tempo, notes));
    }
  
    return seqs;
  };
  
  const melPattern = [
    '- 1', 'G5 0.5', 'Gb5 0.5', 'E5 1',
    'E5 0.333', 'D5 0.333', 'C5 0.334', 'B4 1', 'C5 1',
    '- 1', 'Gb5 0.5', 'E5 0.5', 'D5 1',
    'D5 0.333', 'C5 0.333', 'B4 0.334', 'A4 1', 'B4 1',
    '- 1', 'E5 0.5', 'D5 0.5', 'C5 1',
    'C5 0.333', 'B4 0.333', 'A4 0.334', 'Ab4 1', 'A4 1'
  ];
  
  const melody = new TinyMusic.Sequence(ac, tempo, [
    ...m(['- 3'], 2),
    ...m([
      ...s(['-', '-', 'E4', ...m(['Gb4', 'G4'], 3), 'B4', 'G4', 'Gb4', 'G4', 'D5', 'C5', 'B4', 'A4', 'Ab4'], 0.5),
      'A4 3',
      ...s(['-', '-', 'A4', ...m(['B4', 'C5'], 3), 'E5', 'C5', 'B4', 'Eb5', 'A5', 'G5', 'Gb5', 'Eb5', 'Gb5'], 0.5),
      'E5 3'
    ], 2),
    ...melPattern,
    'Eb4 0.5', 'Gb4 0.5', 'A4 0.5', 'C5 0.5', 'B4 0.5', 'Bb4 0.5',
    'B4 1', 'E4 2',
    ...melPattern,
    'Eb5 0.5', 'C5 0.5', 'B4 0.5', 'A4 0.5', 'Gb4 0.5', 'G4 0.5',
    'E4 1.75', '- 0.25', 'E4 0.333', 'F4 0.333', 'Gb4 0.334',
    'G4 0.75', '- 0.25', 'G4 0.5', 'Gb4 0.5', 'G4 0.5', 'A4 0.5', 'G4 0.75', '- 0.25', 'G4 1.50', '- 0.5',
    'B4 0.75', '- 0.25', 'B4 0.5', 'Bb4 0.5', 'B4 0.5', 'C5 0.5', 'B4 0.75', '- 0.25', 'B4 0.75', '- 0.25',
    'B4 0.333', 'C5 0.333', 'Db5 0.334',
    'D5 0.75', '- 0.25', 'D5 0.5', 'Db5 0.5', 'D5 0.5', 'E5 0.5', 'D5 0.5', 'C5 0.5', 'B4 0.50', 'A4 0.5', 'G4 0.75', '- 0.25',
    'Gb4 0.5', 'G4 0.5', 'A4 0.5', 'C5 0.5', 'B4 0.5', 'Bb4 0.5', 'B4 1.5', '- 1.5',
    'C5 0.75', '- 0.25', 'C5 0.5', 'B4 0.5', 'C5 0.5', 'D5 0.5', 'C5 0.75', '- 0.25', 'C5 1.50', '- 0.5',
    'E5 0.75', '- 0.25', 'E5 0.5', 'Eb5 0.5', 'E5 0.5', 'Gb5 0.5', 'E5 0.75', '- 0.25', 'E5 1.50', '- 0.5',
    'Gb5 1', 'G5 0.5', 'Gb5 0.5', 'A5 0.5', 'Gb5 0.5', 'Eb5 0.5', 'C5 0.5', 'B4 0.5', 'A4 0.5', 'G4 1',
    'Gb4 0.5', 'G4 0.5', 'A4 0.5', 'C5 0.5', 'B4 0.5', 'Bb4 0.5', 'B4 1.5', '- 1.5',
    '- 1', 'E5 0.5', 'D5 0.5', 'C5 1',
    'C5 0.333', 'B4 0.333', 'A4 0.334', 'Ab4 1', 'A4 1',
    '- 1', 'D5 0.5', 'C5 0.5', 'B4 1',
    'B4 0.333', 'A4 0.333', 'G4 0.334', 'Gb4 1', 'G4 1',
    '- 1', 'C5 0.5', 'B4 0.5', 'A4 1',
    'A4 0.333', 'G4 0.333', 'Gb4 0.334', 'E4 1', 'Gb4 1',
    'Eb5 0.5', 'C5 0.5', 'B4 0.5', 'A4 0.5', 'Gb4 0.5', 'G4 0.5',
    'E4 2.5', '- 0.5',
  ]);
  
  
  const seqs = [...createChords(allChords), melody];
  const gains = [0.15, 0.15, 0.15, 0.15];
  
  seqs.forEach((seq, i) => {
    seq.gain.gain.value = gains[i];
    seq.waveType = 'sine';
  });
  
  this.toggleMusic = function() {
    seqs.forEach(seq => seq[this.state ? 'stop' : 'play']());
    this.state = !this.state;
  }
}
