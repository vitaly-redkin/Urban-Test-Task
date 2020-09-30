/**
 * Module "root" file to contain the entry point and the list of providers.
 */
import { IGeoCodingResult, GeoCodigException } from './geocoding.provider';
import { GoogleMapsProvider } from './google-maps.provider';

import '../../common/env';
import L from '../../common/logger';

/**
 * The list of providers to use - in the order they are tried.
 */
const providers = [
  {
    // "Working" Google Maps geo provider
    name: 'Google Maps',
    provider: new GoogleMapsProvider(process.env.GOOGLE_MAPS_API_KEY),
  },
  {
    // "Broken" Google Maps geo provider - to emulate the "fault tolerance" swap it with the first one
    name: 'Google Maps with wrong API key',
    provider: new GoogleMapsProvider(process.env.GOOGLE_MAPS_API_KEY + '*'),
  },
];

/**
 * Gets coordinates and other data (full address, post code) by user-entered address.
 * Uses the data returned by the first provier in the list.
 * If it fails tries the next one and so on.
 *
 * @param address user-entered address to search for
 * @returns object with geographical coordinates and other address fields.
 * @throws GeoCodigException if none of the provider returned the results
 */
export async function getCordinatesByAddress(
  address: string
): Promise<IGeoCodingResult> {
  for (const p of providers) {
    try {
      const result = await p.provider.getCordinatesByAddress(address);
      return result;
    } catch (e) {
      L.error(`Error from ${p.name}: ${e}`);
    }
  }

  // If we are here no providers returned the coordinates - reject the promise
  return Promise.reject(
    new GeoCodigException(
      'UNKNOWN',
      `No provider can resolve this address: ${address}`,
      address
    )
  );
}
