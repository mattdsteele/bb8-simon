import { Howl } from 'howler';

class BB8Simon {
  constructor() {
    this.beeps = [];
    this.remainingBeeps = [];
    this.colors = ['red', 'blue', 'yellow', 'green'];
    this.printTime = 450;
    this.delay = 100;
    document.querySelector('.start').addEventListener('click', e => {
      e.target.classList.add('hidden');
      this.addBeep();
    });

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
    console.log('YOU LOSE');
  }

  addBeep() {
    this.beeps.push(_.sample(this.colors));
    this.remainingBeeps = this.beeps;
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

  print(e) {
    //const { classList } = document.querySelector('.current');
    //classList.remove('red', 'green', 'blue', 'yellow');
    const screenOutput = document.querySelector('screen-output');
    if (this.beeps[e]) {
      const color = this.beeps[e];
      this.audios[color].play();
      //classList.add(color);
      screenOutput.color = color;
    }
  }

  off() {
    const screenOutput = document.querySelector('screen-output');
    screenOutput.color = '';
    //const { classList } = document.querySelector('.current');
    //classList.remove('red', 'green', 'blue', 'yellow');
  }
}

const simon = new BB8Simon();
