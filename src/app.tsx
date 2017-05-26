import * as React from 'react';

import { Button } from '@blueprintjs/core';
import { Hotkey } from './hotkey';

export class App extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>
        <Hotkey />
        <Button>Hello World</Button>
      </div>
    );
  }
}
