import { Device, devices, HID } from 'node-hid';
import {
  ObservableMap,
  IObservableValue,
  observable,
  action,
  computed,
} from 'mobx';
import {
  asyncAction
} from 'mobx-utils';
import { toHex } from './util';
import { KSO, KSOConfig } from './kso';
import { MainToaster } from './components/toaster';
import { Intent } from '@blueprintjs/core';

export class LightData {
  @observable userCurrent: number;
  @observable userOnStrength: number;
  @observable userOffStrength: number;
}

export class KeyData {
  @observable name: string;
  @observable lightData: LightData;
  @observable serial: string;
  @observable firmware: string;
  @observable address: string;
  @observable path: string;

  @observable keyMode: IObservableValue<string>;
  @observable lightMode: IObservableValue<string>;

  @observable config: KSOConfig;

  @observable public loading: boolean;
  private readonly kso: KSO;

  constructor(device: Device) {
    this.loading = true;

    this.kso = new KSO(device.path);

    this.name = device.product;
    this.lightData = new LightData();
    this.serial = device.serialNumber;
    this.firmware = `0x${toHex(device.release)}`;
    this.address = '0xA1';
    this.path = device.path;
    this.keyMode = observable.box('macro');
    this.lightMode = observable.box('rgb');
  }

  @asyncAction
  public *fetch_data() {
    this.config = yield this.kso.get_config();
    this.loading = false;
  }

  @asyncAction
  public *save_data() {
    yield this.kso.set_config(this.config);
    MainToaster.show({
      message: 'Saved!',
      intent: Intent.SUCCESS,
      iconName: 'floppy-disk',
    });
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
  @observable devices: ObservableMap<string, KeyData>;
  @observable selectedDevice: KeyData | null;
  @observable warning: boolean;

  constructor() {
    this.devices = observable.map<string, KeyData>();
    this.selectedDevice = null;
  }

  @action.bound public updateDevices(): void {
    let allHidDevices = devices();
    this.devices.clear();

    let deviceCount = 0;

    for (let d of allHidDevices) {
      if (!KeyData.isSupported(d)) { continue; }

      const kd = new KeyData(d);
      kd.fetch_data();
      this.devices.set(d.path, kd);
      deviceCount++;
    }

    // selected device has disappeared
    if (this.selectedDevice != null && !this.devices.has(this.selectedDevice.path)) {
      this.selectedDevice = null;
      this.warning = true;
      return;
    }

    // if there's only one device, auto-select it
    if (this.selectedDevice == null && deviceCount == 1) {
      this.selectedDevice = this.devices.values().next().value;
    }

  }
}
