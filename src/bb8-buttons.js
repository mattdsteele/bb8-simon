import 'skatejs-web-components';
import { Component, h, emit } from 'skatejs';
import { style, cssFor, merge } from 'glamor';

const buttonWrapper = style({
  position: 'relative',
  width: '100vw',
  height: '100vw'
});

const buttonStyle = style({
  width: 'calc(100%/3)',
  height: 'calc(100%/3)',
  position: 'absolute'
});

const redButton = merge(buttonStyle, style({
  background: 'red',
  left: 'calc(100%/3)',
  top: '0'
}));

const blueButton = merge(buttonStyle, style({
  background: 'blue',
  left: 0,
  top: 'calc(100%/3)'
}));

const greenButton = merge(buttonStyle, style({
  background: 'green',
  bottom: 0,
  left: 'calc(100%/3)'
}));

const yellowButton = merge(buttonStyle, style({
  background: 'yellow',
  right: 0,
  top: 'calc(100%/3)'
}));

const bb8Logo = merge(buttonStyle, style({
  left: 'calc(100%/3)',
  top: 'calc(100%/3)'
}));
class BB8Buttons extends Component {
  connectedCallback() {
    super.connectedCallback();
  }

  button (selector, color) {
    document.querySelector(selector).addEventListener('click', () => {
      this.push(color);
    });
  }

  click(color) {
    emit(this, 'button-clicked', { detail: { color }});
  }

  bb8Click() {
    emit(this, 'bb8-clicked');
  }

  renderCallback() {
    const clk = (col) => () => this.click(col);
    return (
<div {...buttonWrapper}>
  <style>{cssFor(buttonWrapper, redButton, blueButton, greenButton, yellowButton, bb8Logo)}</style>
  <div onclick={clk('red')} {...redButton}></div>
  <div onclick={clk('blue')} {...blueButton}></div>
  <div onclick={clk('yellow')} {...yellowButton}></div>
  <div onclick={clk('green')} {...greenButton}></div>
  <img src="img/bb8.svg" {...bb8Logo} onclick={this.bb8Click}></img>
</div>);
  }

  renderedCallback() {
  }
}

customElements.define('bb8-buttons', BB8Buttons);
