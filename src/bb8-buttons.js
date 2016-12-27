import 'skatejs-web-components';
import { Component, h } from 'skatejs';

class BB8Buttons extends Component {
  connectedCallback() {
    super.connectedCallback();
    console.log('okay');
    /*
    button('.red', 'Red');
    button('.green', 'Green');
    button('.blue', 'Blue');
    button('.yellow', 'Yellow');
    */
  }

  button (selector, color) {
    document.querySelector(selector).addEventListener('click', () => {
      this.push(color);
    });
  }

  click(color) {
    console.log(color);
  }

  renderCallback() {
    console.log('rendering');
    return (<div class="buttons">
        <div class="red button" onClick={this.click('red')}></div>
        <div class="blue button"></div>
        <div class="yellow button"></div>
        <div class="green button"></div>
        <img class="bb8-logo button" src="img/bb8.svg"></img>
      </div>);
  }
}

customElements.define('bb8-buttons', BB8Buttons);
