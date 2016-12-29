import 'skatejs-web-components';
import { Component, h, emit, prop } from 'skatejs';
import { style, cssFor, merge } from 'glamor';

const output = style({
  paddingTop: '3em',
  display: 'flex',
  justifyContent: 'center'
});

const current = style({
  width: '50vw',
  height: '50vw',
  border: '1px solid black' 
});

class ScreenOutput extends Component {
  connectedCallback() {
    super.connectedCallback();
  }

  static get props() {
    return {
      color: prop.string()
    };
  }

  makeStyle(color) {
    return merge(current, style({ backgroundColor: color }));
  }

  updatedCallback() {
    if (this.color) {
      this.currentStyle = this.makeStyle(this.color);
    } else {
      this.currentStyle = current;
    }
    return true;
  }

  renderCallback() {
    return ([
      <style>{cssFor(output, this.currentStyle)}</style>,
      <div {...output}>
        <div {...this.currentStyle}>
        </div>
      </div>
    ]);
  }
}

customElements.define('screen-output', ScreenOutput);
