import * as React from 'react';
import { AppStore } from '../store';
import { observer } from 'mobx-react';
import { RgbLedEditor } from './lighteditor/rgbled';
import { UserLedEditor } from './lighteditor/userled';

@observer
export class LightEditor extends React.Component<{ appStore: AppStore }, {}> {

  public render() {
    return (<div>
      {/*<Switch label='Enable RGB LED' />

      <div className='pt-dark' style={{
          backgroundColor: Colors.DARK_GRAY5,
          borderRadius: 5,
          padding: 10,
          }}>
        <LedColorPicker />
        <LedColorPicker />
      </div>
      <Switch label='Enable User LED' />*/}
      <RgbLedEditor appStore={this.props.appStore} />
      {/*<UserLedEditor appStore={this.props.appStore}/>*/}
    </div>);
  }
}