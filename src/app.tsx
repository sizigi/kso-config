import * as classNames from 'classNames';
import * as React from 'react';
import { Button, EditableText } from '@blueprintjs/core';
import {
  Colors,
  FocusStyleManager,
  Intent,
  NonIdealState,
  Tab2,
  Tabs2
} from '@blueprintjs/core';
import { HotkeyInput } from './hotkey';
import { MainToaster } from './toaster';
import { observer } from 'mobx-react';
import { SingleHidKeyReport } from './hidreport';
import { SingleKeyReportEditor } from './singlekeyreporteditor';


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
          display: 'flex',
        }}
      >
        <nav style={{ flex: 1, backgroundColor: Colors.LIGHT_GRAY1, height: '100vh' }}>
          <div className='pt-navbar pt-dark kso-navbar'>
            <div className="pt-navbar-group pt-align-left">
              <div className="pt-navbar-heading pt-text-muted">keyswitch.one</div>
            </div>
            <div className="pt-navbar-group pt-align-right">
              <button className="pt-button pt-minimal pt-icon-refresh"></button>
              {/*<button className="pt-button pt-minimal pt-icon-cog"></button>*/}
            </div>
          </div>
          <div style={{ height: 'calc(100vh - 75px)' }} data-simplebar>
            <div className="p-t-lg">
              <NonIdealState
                visual="warning-sign"
                title="No devices found"
                description="No supported devices were detected. Try plugging one in." />
            </div>
            {/*<div className="kso-tab active">
              <img src="http://placehold.it/48x48" style={{ borderRadius: 48, marginRight: 20 }}></img>
              <div style={{ paddingTop: 10 }}>
                <h4>Help Key</h4>
                <h6 className="pt-text-muted">Key: F1</h6>
              </div>
            </div>
            <div className="kso-tab">
              <img src="http://placehold.it/48x48" style={{ borderRadius: 48, marginRight: 20 }}></img>
              <div style={{ paddingTop: 10 }}>
                <h4>Help Key</h4>
                <h6 className="pt-text-muted">Key: F1</h6>
              </div>
            </div>*/}
          </div>
        </nav>

        <section style={{ flex: 2 }}>
          <div style={{ padding: 20 }}>
            <Button
              style={{ float: "right" }}
              text="Save"
              onClick={() => {
                MainToaster.show({
                  message: "Saved!",
                  intent: Intent.SUCCESS,
                  iconName: "floppy-disk",
                })
              }}
              iconName='floppy-disk'
              className={classNames('pt-button', 'pt-large', 'pt-intent-primary')} />
            <h1>
              <EditableText placeholder="Click to name..." maxLength={32} />
            </h1>
            <ul className="pt-list-unstyled">
              <li><strong>Serial: </strong>5AE3FB6DEEFFB3</li>
              <li><strong>Firmware: </strong>A01</li>
              <li><strong>I<sup>2</sup>C Address: </strong>
                <EditableText placeholder="Address" defaultValue="0x4F" />
              </li>
            </ul>
            <Tabs2 id="action-type" className="p-t-md">
              <Tab2 id="press" title="Keypress" panel={(
                <div>
                  <HotkeyInput keyReport={keyReport} />
                  <SingleKeyReportEditor keyReport={keyReport} style={{ paddingTop: 20 }} />
                </div>)} />
              <Tab2 id="macro" title="Macro" />
              <Tabs2.Expander />
              <Button iconName="help" className="pt-intent-primary pt-minimal" />
            </Tabs2>
          </div>
        </section>
      </div>
    );
  }
}
