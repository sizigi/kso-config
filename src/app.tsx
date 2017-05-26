import * as React from 'react';

import { Button } from '@blueprintjs/core';
import { HotkeyInput } from './hotkey';
import { ByteInput } from './byteinput';

export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <HotkeyInput />
        <ByteInput />
        <Button>Upload</Button>
      </div>
    );
  }
}
