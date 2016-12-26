class BB8Simon {
  constructor() {
    this.beeps = [];
    this.remainingBeeps = [];
    this.colors = ['Red', 'Blue', 'Yellow', 'Green'];
    this.printTime = 450;
    this.delay = 100;
    document.querySelector('.start').addEventListener('click', e => {
      e.target.classList.add('hidden');
      this.addBeep();
    });
    const button = (selector, color) => {
      document.querySelector(selector).addEventListener('click', () => {
        this.push(color);
      });
    };

    this.audios = {
      red: new Howl({ src: ['sfx/bb8-28.mp3'] }),
      green:new Howl({ src: ['sfx/bb8-06.mp3'] }),
      blue: new Howl({ src: ['sfx/bb8-16.mp3'] }),
      yellow: new Howl({ src: ['sfx/bb2-02.mp3'] })
    };

    button('.red', 'Red');
    button('.green', 'Green');
    button('.blue', 'Blue');
    button('.yellow', 'Yellow');
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
    const sfx = document.querySelector('.sfx-red');
    const { classList } = document.querySelector('.current');
    classList.remove('red', 'green', 'blue', 'yellow');
    if (this.beeps[e]) {
      const color = this.beeps[e].toLowerCase();
      this.audios[color].play();
      classList.add(color);
    }
  }

  off() {
    const { classList } = document.querySelector('.current');
    classList.remove('red', 'green', 'blue', 'yellow');
  }
}

const simon = new BB8Simon();
