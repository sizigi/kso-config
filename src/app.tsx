import * as React from 'react';

import { FocusStyleManager, Colors, NonIdealState } from '@blueprintjs/core';
import { Button, EditableText, Position, Toaster} from '@blueprintjs/core';

import {SingleKeyReportEditor} from './singlekeyreporteditor'

import {observer} from "mobx-react";
import {HotkeyInput} from './hotkey';

import * as classNames from 'classNames';

import {SingleHidKeyReport} from './hidreport';

FocusStyleManager.onlyShowFocusOnTabs();

let keyReport = new SingleHidKeyReport();

@observer
export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div
        style={{
          backgroundColor: Colors.LIGHT_GRAY5,
          height: '100vh',
          display: 'flex'
        }}
      >
        <nav style={{flex: 1, backgroundColor: Colors.LIGHT_GRAY1}} data-simplebar>
          <div style={{padding: 20}}>

            <NonIdealState
              visual="warning-sign"
              title="No devices found"
              description="No supported devices were detected. Try plugging one in." />

            {/*<div>
              <h3>Help Key</h3>
              <h6 className="pt-text-muted">Key: F1</h6>
            </div>*/}
          </div>
        </nav>

        <section style={{flex: 2}}>
          <div style={{padding: 20}}>
            <Button style={{float: "right"}} text="Save" iconName='floppy-disk' className={classNames('pt-button', 'pt-large', 'pt-intent-primary')}/>
            <h1>
              <EditableText placeholder="Click to name..." maxLength={32}/>
            </h1>
            <ul className="pt-list-unstyled">
              <li><strong>Serial: </strong>5AE3FB6DEEFFB3</li>
              <li><strong>Firmware: </strong>A01</li>
              <li><strong>I<sup>2</sup>C Address: </strong>
                <EditableText placeholder="Address" defaultValue="0x4F" />
              </li>
            </ul>
            <div style={{paddingTop: 20}}>
              <HotkeyInput keyReport={keyReport} />
              <SingleKeyReportEditor keyReport={keyReport} style={{paddingTop: 20}}/>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
