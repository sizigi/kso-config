import * as parse from 'csv-parse';
import * as fs from 'fs';

console.log('Generating JSON...');
let raw = fs.readFileSync('./data/mapping.csv');
parse(raw.toString(), { columns: true }, (_, records: any) => {

  for (const record of records) {
    for (const key in record) {
      if (record[key].trim() === '') {
        delete record[key];
      } else if (key.endsWith('keycode')) {
        record[key] = parseInt(record[key], 16);
      }
    }
  }

  const rv = { data: records };
  fs.writeFileSync('./data/mapping.json', JSON.stringify(rv));

  console.log('Generation Done!');
});