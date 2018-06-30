import * as HID from 'node-hid';
import * as fs from 'fs';
import { platform } from 'process';
import { TextDecoder, TextEncoder } from 'util';
import { computed, observable } from 'mobx';
import { safe_set } from './util';
import { SingleHidKeyReport } from './hidreport';

export class KSOConfig {

  set mode(id: number) { this.buffer[0] = id; }
  set i2c_address(address: number) { this.buffer[1] = address; }
  set keyreport(report: SingleHidKeyReport) {
    this.buffer.set(report.packet, 8);
  }

  set name(val: string) {
    this.buffer.set(
      new TextEncoder()
        .encode(
          val.slice(0, 15).concat('\0')
        ), 16);
  }

  @observable public readonly buffer: Uint8Array;
  @computed get mode(): number { return this.buffer[0]; }
  @computed get i2c_address(): number { return this.buffer[1]; }
  @computed get keyreport(): SingleHidKeyReport {
    return new SingleHidKeyReport(this.buffer.subarray(8, 16));
  }
  @computed get name(): string {
    return new TextDecoder('utf-8')
      .decode(
        this.buffer.subarray(16, 32)
      ).split('\0')[0];
  }


  constructor(buffer?: Uint8Array) {
    this.buffer = buffer || new Uint8Array(32);
  }
}


function num_to_bytearray_be(data: number): Uint8Array {
  const rv = [];
  while (data != 0) {
    let byte = data & 0xFF
    rv.unshift(byte);
    data = data >> 8
  }
  return new Uint8Array(rv);
}


abstract class BaseHIDDevice {
  protected readonly hid: HID.HID;

  public constructor(hid: HID.HID) {
    this.hid = hid;
  }

  public disconnect(): void {
    this.hid.close();
  }

  protected _read(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      this.hid.read((err, data) => {
        if (err) reject(err);
        resolve(Uint8Array.from(data));
      });
    })
  }

  protected _write(data: Uint8Array): void {
    let writebuffer: Uint8Array;

    if (platform == 'win32') {
      writebuffer = new Uint8Array(65);
      writebuffer.set(data, 1);
    } else {
      writebuffer = new Uint8Array(64);
      writebuffer.set(data, 0);
    }
    this.hid.write(Array.from(writebuffer));
  }
}

export class DFU extends BaseHIDDevice {
  public constructor() {
    super(new HID.HID(0x10C4, 0xEACB));
  }

  public async write_record(record: Uint8Array): Promise<number> {
    for (let n = 0; n < record.length; n += 64) {
      this._write(record.subarray(n, n + 64));
    }
    let response = await this._read()
    return response[0];
  }

  public async load(bootfile: string): Promise<void> {

    const records = []
    const fd = fs.openSync(bootfile, 'r');
    const buffer = new Uint8Array(255);

    while (fs.readSync(fd, buffer, 0, 1, null)) {
      fs.readSync(fd, buffer, 1, 1, null);
      fs.readSync(fd, buffer, 2, buffer[1], null);
      records.push(buffer.subarray(0, 2 + buffer[1]));
    }

    for (const record of records) {
      let code = await this.write_record(record);
      console.log(String.fromCharCode(code));
    }

  }
}

export class KSO extends BaseHIDDevice {
  public constructor(path: string) {
    super(new HID.HID(path));
  }

  public async get_config(): Promise<KSOConfig> {
    return new KSOConfig(await this.read_memory(0x3000, 32));
  }

  public async set_config(config: KSOConfig): Promise<void> {
    const request = new Uint8Array(64);
    request[0] = 0x10;
    request[1] = 0x00;
    request.set(config.buffer, 2);
    this._write(request);
  }


  public async read_memory(address: number, bytes: number): Promise<Uint8Array> {

    const rv = new Uint8Array(bytes);

    for (let offset = 0; offset < bytes; offset += 64) {
      const request = new Uint8Array(64);
      request[0] = 0x40;
      request[1] = 0x00;
      request.set(num_to_bytearray_be(address + offset), 2);
      this._write(request);
      safe_set(rv, await this._read(), offset);
    }

    return rv;
  }
}