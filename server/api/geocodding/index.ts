import { GeoCodigException } from './GeoGodingProvider';
import { GoogleMapsProvider } from './GoogleMapsProvider';

import '../../common/env';
import L from '../../common/logger';

const providers = [
  {
    name: 'Google Maps with wrong API key',
    provider: new GoogleMapsProvider(process.env.GOOGLE_MAPS_API_KEY + '*'),
  },
  {
    name: 'Google Maps',
    provider: new GoogleMapsProvider(process.env.GOOGLE_MAPS_API_KEY),
  },
];

export async function getCordinatesByAddress(
  address: string
): Promise<[number, number]> {
  for (const p of providers) {
    try {
      const result = await p.provider.getCordinatesByAddress(address);
      return result;
    } catch (e) {
      L.error(`Error from ${p.name}: ${e}`);
    }
  }
  return Promise.reject(
    new GeoCodigException(
      'UNKNOWN',
      `No provider can resolve this address: ${address}`,
      address
    )
  );
}
