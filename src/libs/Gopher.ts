import { render } from 'ejs';
import { readFileSync } from 'fs';
import type { GopherProperty } from '../types/mascot';

export class Gopher {
  #strokeWidth = 6;

  template = this.getTemplate();

  getTemplate() {
    return readFileSync('src/templates/gopher.ejs').toString();
  }

  setTemplate(property: GopherProperty) {
    const { height, bodyColor, noseColor, handColor, footColor } = property;
    const svg = render(this.template, {
      bodyColor,
      noseColor,
      handColor,
      footColor,
      stomachHeight: height,
      lowerHalfOfBodyHeight: height - this.#strokeWidth,
    });
    return svg;
  }
}
