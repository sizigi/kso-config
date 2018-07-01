
// tslint:disable-next-line
import mapping = require('../data/mapping.json');

// generate static lookups
export const usbToEvent = new Map<number, number>();
export const eventToUsb = new Map<number, number>();

for (const record of mapping.data) {
  if (record.usb_keycode !== undefined &&
    record.keyboardevent_keycode !== undefined) {
    usbToEvent[record.usb_keycode] = record.keyboardevent_keycode;
    eventToUsb[record.keyboardevent_keycode] = record.usb_keycode;
  }
}