import { Device, devices, HID } from 'node-hid';
import { SingleHidKeyReport } from './hidreport';
import {
  ObservableMap,
  IObservableValue,
  observable,
  action,
  computed,
} from 'mobx';
import { toHex } from './util';

export class LightData {
  @observable userCurrent: number;
  @observable userOnStrength: number;
  @observable userOffStrength: number;
}

export class KeyData {
  @observable name: string;
  @observable report: SingleHidKeyReport;
  @observable lightData: LightData;
  @observable serial: string;
  @observable firmware: string;
  @observable address: string;
  @observable path: string;

  @observable keyMode: IObservableValue<string>;
  @observable lightMode: IObservableValue<string>;

  private readonly hid: HID;

  constructor(device: Device) {
    this.hid = new HID(device.path);

    this.name = device.product;
    this.report = new SingleHidKeyReport();
    this.lightData = new LightData();
    this.serial = device.serialNumber;
    this.firmware = `0x${toHex(device.release)}`;
    this.address = '0xA1';
    this.path = device.path;
    this.keyMode = observable('keypress');
    this.lightMode = observable('onpress');
  }

  static isSupported(device: Device): boolean {
    return device.vendorId == 0x1209 && device.productId == 0x5261 && device.interface == 1
  }
}

export interface IColor {
  r: number;
  g: number;
  b: number;
}

export class Color implements IColor {
  @observable public r: number = 0;
  @observable public g: number = 0;
  @observable public b: number = 0;

  private static componentToHex(c: number): string {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  @computed public get toHex(): string {
    return '#' +
      Color.componentToHex(this.r) +
      Color.componentToHex(this.g) +
      Color.componentToHex(this.b);
  }

  @action public set(other: IColor): void {
    this.r = other.r;
    this.g = other.g;
    this.b = other.b;
  }

}

export interface IAppStoreProp {
  appStore: AppStore;
}

export class AppStore {
  @observable devices: ObservableMap<KeyData>;
  @observable selectedDevice: KeyData | null;
  @observable warning: boolean;

  constructor() {
    this.devices = observable.map<KeyData>();
    this.selectedDevice = null;
  }

  @action.bound public updateDevices(): void {
    let allHidDevices = devices();
    this.devices.clear();

    for (let d of allHidDevices) {
      if (!KeyData.isSupported(d)) { continue; }
      this.devices.set(d.path, new KeyData(d));
    }

    // selected device has disappeared
    if (this.selectedDevice != null && !this.devices.has(this.selectedDevice.path)) {
      this.selectedDevice = null;
      this.warning = true;
    }

  }
}
