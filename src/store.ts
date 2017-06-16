import { Device, devices} from 'node-hid';
import { SingleHidKeyReport } from './hidreport';
import {
  ObservableMap,
  IObservableValue,
  observable,
  action,
} from 'mobx';

export class KeyData {
  @observable name: string;
  @observable report: SingleHidKeyReport;
  @observable serial: string;
  @observable firmware: string;
  @observable address: string;
  @observable path: string;

  @observable keyMode: IObservableValue<string>;
  @observable lightMode: IObservableValue<string>;

  constructor(device: Device) {
    this.name = device.product;
    this.report = new SingleHidKeyReport();
    this.serial = device.serialNumber;
    this.firmware = 'Unknown';
    this.address = '0xA1';
    this.path = device.path;
    this.keyMode = observable('keypress');
    this.lightMode = observable('onpress');
  }

  static isSupported(device: Device): boolean {
    return /USB/.test(device.product);
  }
}


export class AppStore {
  @observable devices: ObservableMap<KeyData>;
  @observable selectedDevice: KeyData | null;

  constructor() {
    this.devices = observable.map<KeyData>();
    this.selectedDevice = null;
  }

  @action.bound public updateDevices(): void {
    console.log('updating...');
    let allHidDevices = devices();

    this.devices.clear();

    for (let d of allHidDevices) {
      if (!KeyData.isSupported(d)) continue;
      this.devices.set(d.path, new KeyData(d));
    }
  }
}
