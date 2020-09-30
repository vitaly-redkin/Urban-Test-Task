/**
 * Module to read GeoJSON file.
 */
import fs from 'fs';
import path from 'path';
import { GeoJSON } from 'geojson';

import L from '../common/logger';

let districts: GeoJSON | undefined = undefined;

/**
 * "Singleton" function to return districts.
 */
export function getDistricts(): GeoJSON {
  if (!districts) {
    L.info('Reading districts...');
    const buf = fs.readFileSync(
      path.resolve('./server/data/formatted-districts.json')
    );
    districts = JSON.parse(buf.toString()) as GeoJSON;
    L.info('Districts read.');
  }

  return districts;
}
