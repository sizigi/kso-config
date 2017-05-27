import * as React from 'react';

import { FocusStyleManager } from '@blueprintjs/core';

import {SingleKeyReportEditor} from './singlekeyreporteditor'

import {observer} from "mobx-react";
import {HotkeyInput} from './hotkey';

import {SingleHidKeyReport} from './hidreport';


FocusStyleManager.onlyShowFocusOnTabs();
// let testData = observable({
//   data: new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF, 0xDE, 0xAD, 0xBE, 0xEF]),
//   advancedToggle: true,
// });


let keyReport = new SingleHidKeyReport();

@observer
export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <HotkeyInput />
        <SingleKeyReportEditor keyReport={keyReport} />
      </div>
    );
  }
}
