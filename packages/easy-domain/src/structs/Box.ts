import { Struct, required } from '@thisisagile/easy';
import { Dimension } from './Dimension';

export class Box extends Struct {
  @required() readonly l: Dimension = new Dimension(this.state.l);
  @required() readonly w: Dimension = new Dimension(this.state.w);
  @required() readonly h: Dimension = new Dimension(this.state.h);

  private readonly sorted: Dimension[] = [this.l, this.w, this.h].sort((n1, n2) => n1.inMilliMeters - n2.inMilliMeters);
  lowestDim: Dimension = this.sorted[0];
  medianDim: Dimension = this.sorted[1];
  maxDim: Dimension = this.sorted[2];

  get isValid(): boolean {
    return super.isValid && this.l.isValid && this.w.isValid && this.h.isValid;
  }

  static with = (l: Dimension, w: Dimension, h: Dimension) => new Box({ l, w, h });

  stack(qty: number): Box {
    return Box.with(this.maxDim, this.medianDim, Dimension.with(this.lowestDim.value * qty, this.lowestDim.uom));
  }

  fits(contents: Box, qty = 1): boolean {
    const stackedContent = contents.stack(qty);
    return this.lowestDim.gte(stackedContent.lowestDim) && this.medianDim.gte(stackedContent.medianDim) && this.maxDim.gte(stackedContent.maxDim);
  }
}
