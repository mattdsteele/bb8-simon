import 'skatejs-web-components';
import { Component, h, emit, prop } from 'skatejs';

class SimonScore extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.playing = true;
  }

  static get props() {
    return {
      currentScore: prop.array(),
      playing: prop.boolean()
    };
  }

  updatedCallback() {
    if (!this.playing) {
      console.log('GAME OVER MAN');
      this.status = 'GAME OVER MAN';
    } else {
      this.status = this.currentScore.length;
    }
    return true;
  }

  renderCallback() {
    return (
      <span>{this.status}</span>
    );
  }
}

customElements.define('simon-score', SimonScore);
