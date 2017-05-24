import * as React from 'react';
import * as keycode from 'keycode';

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
}

export interface IHotkeyState {
  keyString: string;
  keyCount: number;
  keyList: Array<number>;
  modState: Modkey;
}

export class Hotkey extends React.Component<{}, IHotkeyState> {
  constructor() {
    super();
    this.state = {
      keyString: "",
      keyCount: 0,
      keyList: [],
      modState: Modkey.None,
    };
  }

  private getKey(event: React.KeyboardEvent<HTMLInputElement>): [Modkey, number | null] {
    const code = event.keyCode;
    const location = event.location;

    // translate modifier keys
    switch (event.keyCode) {
      case 16:
        return location === 2 ? [Modkey.RShift, null] : [Modkey.LShift, null];
      case 17:
        return location === 2 ? [Modkey.RCtrl, null] : [Modkey.LCtrl, null];
      case 18:
        return location === 2 ? [Modkey.RAlt, null] : [Modkey.LAlt, null];
      case 91:
        return [Modkey.LGui, null];
      case 93:
        return [Modkey.RGui, null];
      default:
        return [Modkey.None, code];
    }
  }

  private setStateWithKeyString(state : IHotkeyState) : void {
    const sb: Array<string> = [];

    if(state.modState & Modkey.LAlt) sb.push('Alt');
    if(state.modState & Modkey.LCtrl) sb.push('Ctrl');
    if(state.modState & Modkey.LGui) sb.push('Gui');
    if(state.modState & Modkey.LShift) sb.push('⇧');

    if(state.modState & Modkey.RCtrl) sb.push('RCtrl');
    if(state.modState & Modkey.RAlt) sb.push('RAlt');
    if(state.modState & Modkey.RGui) sb.push('RGui');
    if(state.modState & Modkey.RShift) sb.push('RShift');

    for(let key of state.keyList) {
      let str = keycode(key);
      sb.push(str.charAt(0).toUpperCase() + str.slice(1));
    }

    state.keyString = sb.join('+');
    this.setState(state);
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    let state = {...this.state};
    const [mod, key] = this.getKey(event);

    // need to reset?
    if(state.keyCount <= 0) {
      state.keyCount = 0;
      state.keyList = [];
      state.modState = Modkey.None;
      state.keyString = "";
    }

    // valid new normal key
    if(key != null && state.keyList.indexOf(key) == -1) {
      state.keyList = [...state.keyList, key];
      state.keyCount++;
    }

    // valid new modifier key
    if(mod != Modkey.None && (mod & state.modState) === 0) {
      state.modState = mod | state.modState;
      state.keyCount++;
    }

    this.setStateWithKeyString(state);
  }


  private handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    this.setState({
      keyCount: this.state.keyCount - 1,
    });
  }

  public render() {
    return (
      <div>
        <h1>Test</h1>
        <input
          type="text"
          value={this.state.keyString}
          onKeyDown={this.handleKeyDown.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
        />
      </div>
    )
  }
}