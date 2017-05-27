import { observable, computed } from "mobx";

export const enum Modkey {
  None = 0,
  LCtrl = 1 << 0,
  LShift = 1 << 1,
  LAlt = 1 << 2,
  LGui = 1 << 3,
  RCtrl = 1 << 4,
  RShift = 1 << 5,
  RAlt = 1 << 6,
  RGui = 1 << 7,

  Shift = LShift | RShift,
  Alt = LAlt | RAlt,
  Gui = LGui | RGui,
  Ctrl = LCtrl | RCtrl,
}

export class SingleHidKeyReport {
  @observable rawData: Uint8Array;

  constructor() {
    this.rawData = new Uint8Array(8);
  }

  @computed get shiftState(): boolean { return (this.rawData[0] & Modkey.Shift) > 0; }
  @computed get ctrlState(): boolean { return (this.rawData[0] & Modkey.Ctrl) > 0; }
  @computed get guiState(): boolean { return (this.rawData[0] & Modkey.Gui) > 0; }
  @computed get altState(): boolean { return (this.rawData[0] & Modkey.Alt) > 0; }

  set modState(state: Modkey) {
    this.rawData = new Uint8Array([state, ...this.rawData.slice(1)]);
  }

  get modState() {
    return this.rawData[0];
  }

  set shiftState(state: boolean) {
    this.modState = state
      ? this.modState | Modkey.LShift
      : this.modState & ~Modkey.Shift;
  }

  set altState(state: boolean) {
    this.modState = state
      ? this.modState | Modkey.LAlt
      : this.modState & ~Modkey.Alt;
  }

  set ctrlState(state: boolean) {
    this.modState = state
      ? this.modState | Modkey.LCtrl
      : this.modState & ~Modkey.Ctrl;
  }

  set guiState(state: boolean) {
    this.modState = state
      ? this.modState | Modkey.LGui
      : this.modState & ~Modkey.Gui;
  }
}