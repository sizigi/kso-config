import * as React from 'react';

import {Collapse, Switch} from '@blueprintjs/core';

import {SingleHidKeyReport} from './hidreport';
import {observer} from "mobx-react";
import {observable} from 'mobx';

import {ByteInput} from './byteinput'


class DisplayState {
  @observable showAdvancedState : boolean = false;
}

export class ISingleKeyReportEditorProps {
  keyReport: SingleHidKeyReport;
}


@observer
export class SingleKeyReportEditor extends React.Component<ISingleKeyReportEditorProps, void> {
  private displayState: DisplayState;

  constructor() {
    super();
    this.displayState = new DisplayState();
  }

  private toggleDisplayState() : void {
    this.displayState.showAdvancedState = !this.displayState.showAdvancedState;
  }


  render() {
    const kr = this.props.keyReport;
    return (<div>
        <Switch label="Advanced" checked={this.displayState.showAdvancedState} onChange={this.toggleDisplayState.bind(this)}/>
        <Collapse isOpen={this.displayState.showAdvancedState}>
          <ByteInput
            value={kr.rawData}
            onChange={(data) => {kr.rawData = data}}/>
          <Switch label="Ctrl" checked={kr.ctrlState} onChange={() => kr.ctrlState = !kr.ctrlState}/>
          <Switch label="Shift" checked={kr.shiftState} onChange={() => kr.shiftState = !kr.shiftState}/>
          <Switch label="Alt" checked={kr.altState} onChange={() => kr.altState = !kr.altState}/>
          <Switch label="Gui" checked={kr.guiState} onChange={() => kr.guiState = !kr.guiState}/>
        </Collapse>
      </div>);
  }
}
