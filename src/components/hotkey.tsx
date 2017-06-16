import * as React from 'react';
import * as keycode from 'keycode';

import {Modkey, SingleHidKeyReport} from '../hidreport';
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

export interface IHotkeyInputProps {
  keyReport: SingleHidKeyReport;
}

@observer
export class HotkeyInput extends React.Component<IHotkeyInputProps, void> {

  @observable private keyList: Array<number>;
  @observable private keyCount: number;
  @observable private modState: number;

  @computed get keyString() : string {
    const sb: Array<string> = [];
    const kr = this.props.keyReport;

    if (kr.modState & Modkey.LAlt) sb.push('Alt');
    if (kr.modState & Modkey.LCtrl) sb.push('Ctrl');
    if (kr.modState & Modkey.LGui) sb.push('Gui');
    if (kr.modState & Modkey.LShift) sb.push('⇧');

    if (kr.modState & Modkey.RCtrl) sb.push('RCtrl');
    if (kr.modState & Modkey.RAlt) sb.push('RAlt');
    if (kr.modState & Modkey.RGui) sb.push('RGui');
    if (kr.modState & Modkey.RShift) sb.push('RShift');

    for (let key of kr.keys) {
      if(key != 0) {
        let str = keycode(key);
        sb.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
    }

    return sb.join('+');
  }

  constructor() {
    super();
    this.keyCount = 0;
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

  private handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const [mod, key] = this.getKey(event);

    // need to reset?
    if (this.keyCount <= 0) {
      this.keyCount = 0;
      this.keyList = [];
      this.modState = Modkey.None;
    }

    // valid new normal key
    if (key != null && this.keyList.indexOf(key) == -1) {
      this.keyList = [...this.keyList, key];
      this.keyCount++;
    }

    // valid new modifier key
    if (mod != Modkey.None && (mod & this.modState) === 0) {
      this.modState = mod | this.modState;
      this.keyCount++;
    }

    this.props.keyReport.setKeys(...this.keyList);
    this.props.keyReport.modState = this.modState;
  }


  private handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    this.keyCount -= 1;
  }

  public render() {
    return (
      <input
        className="pt-large pt-input pt-fill"
        tabIndex={-1}
        type="text"
        value={this.keyString}
        placeholder="Type hotkey..."
        onKeyDown={this.handleKeyDown.bind(this)}
        onKeyUp={this.handleKeyUp.bind(this)}
      />
    )
  }
}