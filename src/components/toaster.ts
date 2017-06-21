import { IToaster, Position, Toaster } from '@blueprintjs/core';

export const MainToaster: IToaster = Toaster.create({
  className: 'toaster-main',
  position: Position.TOP,
});