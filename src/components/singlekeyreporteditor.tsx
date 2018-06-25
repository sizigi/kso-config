import * as React from 'react';

import { Collapse, Colors, Switch } from '@blueprintjs/core';

import { SingleHidKeyReport } from '../hidreport';
import { observer } from "mobx-react";
import { observable } from 'mobx';
import { ByteInput } from './byteinput'

class DisplayState {
  @observable showAdvancedState: boolean = true;
}

export class ISingleKeyReportEditorProps {
  keyReport: SingleHidKeyReport;
  style?: any;
}

@observer
export class SingleKeyReportEditor extends React.Component<ISingleKeyReportEditorProps, Readonly<any>> {
  private displayState: DisplayState;

  constructor() {
    super();
    this.displayState = new DisplayState();
  }

  private toggleDisplayState(): void {
    this.displayState.showAdvancedState = !this.displayState.showAdvancedState;
  }


  render() {
    const kr = this.props.keyReport;

    return (<div style={this.props.style}>
      <Switch
        label="Advanced Editor"
        checked={this.displayState.showAdvancedState}
        onChange={this.toggleDisplayState.bind(this)}
      />
      <Collapse isOpen={this.displayState.showAdvancedState}>
        <div className="pt-dark" style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
        }}>
          <label className="pt-label">
            Raw Packet Data:
              <ByteInput
              style={{ marginTop: 10, marginBottom: 20 }}
              value={kr.packet}
              onChange={(data) => { kr.packet = data }} />
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: "row" }}>
            <Switch label="Ctrl" checked={kr.ctrlState} onChange={() => kr.ctrlState = !kr.ctrlState} />
            <Switch label="Shift" checked={kr.shiftState} onChange={() => kr.shiftState = !kr.shiftState} />
            <Switch label="Alt" checked={kr.altState} onChange={() => kr.altState = !kr.altState} />
            <Switch label="Gui" checked={kr.guiState} onChange={() => kr.guiState = !kr.guiState} />
          </div>
        </div>
      </Collapse>
    </div>);
  }
}
