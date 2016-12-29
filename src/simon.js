import { Howl } from 'howler';

class BB8Simon {
  constructor() {
    this.beeps = [];
    this.remainingBeeps = [];
    this.colors = ['red', 'blue', 'yellow', 'green'];
    this.printTime = 450;
    this.delay = 100;
    this.audios = {
      red: new Howl({ src: ['sfx/bb8-28.mp3'] }),
      green:new Howl({ src: ['sfx/bb8-06.mp3'] }),
      blue: new Howl({ src: ['sfx/bb8-16.mp3'] }),
      yellow: new Howl({ src: ['sfx/bb2-02.mp3'] })
    };

    document.addEventListener('button-clicked', ({ detail }) => {
      const { color } = detail;
      this.push(color);
    });

    document.addEventListener('bb8-clicked', () => {
      document.querySelector('sphero-bb8').connect()
      .then(_ => {
        this.addBeep();
      });
    }, { once: true });


  }

  push(color) {
    const [ nextColor, ...rest ] = this.remainingBeeps;
    if (color === nextColor) {
      if (rest.length === 0) {
        this.addBeep();
      } else {
        this.remainingBeeps = rest;
      }
    } else {
      this.lose();
    }
  }

  lose() {
    const score = document.querySelector('simon-score');
    score.playing = false;
  }

  addBeep() {
    const score = document.querySelector('simon-score');
    this.beeps.push(_.sample(this.colors));
    this.remainingBeeps = this.beeps;
    score.currentScore = [].concat(this.beeps);
    this.printBeeps();
  }

  printBeeps() {
    const interval = Rx.Observable
      .interval(this.printTime + this.delay)
      .take(this.beeps.length + 1);

    const onOff = interval.flatMap(e => {
      return Rx.Observable
        .interval(this.printTime).map(m => 'off').take(1)
        .merge(Rx.Observable.of(e));
    });
    onOff.subscribe(e => {
      if (e === 'off') {
        this.off();
      } else {
        this.print(e);
      }
    });
  }

  cssColor(color) {
    const colors = {
      red: { red: 255, green: 0, blue: 0 },
      green: { red: 0, green: 255, blue: 0 },
      blue: { red: 0, green: 0, blue: 255 },
      yellow: { red: 255, green: 255, blue: 0 },
    };
    return colors[color];
  }

  print(e) {
    const screenOutput = document.querySelector('screen-output');
    const sphero = document.querySelector('sphero-bb8');
    if (this.beeps[e]) {
      const color = this.beeps[e];
      this.audios[color].play();
      //screenOutput.color = color;
      sphero.color = this.cssColor(color);
    }
  }

  off() {
    const screenOutput = document.querySelector('screen-output');
    const sphero = document.querySelector('sphero-bb8');
    sphero.color = {};
    // screenOutput.color = '';
  }
}

const simon = new BB8Simon();
