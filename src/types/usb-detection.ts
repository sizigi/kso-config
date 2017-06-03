declare module 'usb-detection' {

  interface usbDevice {
    locationId: number;
    vendorId: number;
    productId: number;
    deviceName: string;
    manufacturer: string;
    serialNumber: string;
    deviceAddress: number;
  }

  namespace usbDetect {
    type eventType = "add" | "insert" | "remove" | "change" | string;
    type deviceListCallback = (err: Error, devices: Array<usbDevice>) => void;

    function find() : Promise<Array<usbDevice>>;
    function find(callback: deviceListCallback): void;
    function find(vid: string, callback: deviceListCallback): void;
    function find(vid: string, pid: string, callback: deviceListCallback): void;

    function on(eventName: eventType, callback: (device: usbDevice) => void) : void;

    function startMonitoring() : void;
    function stopMonitoring() : void;
  }

  export = usbDetect;

}