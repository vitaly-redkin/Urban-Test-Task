import fetch from 'node-fetch';

import { GeoCodingProvider, GeoCodigException } from './GeoGodingProvider';

export class GoogleMapsProvider extends GeoCodingProvider {
  constructor(private readonly apiKey: string) {
    super();
  }

  protected async getCordinatesByAddressInt(
    addressRec: Record<string, string>
  ): Promise<Record<string, unknown>> {
    const apiKey: string = encodeURIComponent(this.apiKey);
    const address: string = addressRec['address'];
    const addressForUrl: string = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${addressForUrl}`;
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        const result = (await response.json()) as Record<string, unknown>;
        return result;
      } else {
        return Promise.reject(
          new GeoCodigException(
            `${response.status}: `,
            response.statusText,
            address
          )
        );
      }
    } catch (e) {
      return Promise.reject(new GeoCodigException('UNKNOWN', e, address));
    }
  }

  protected prepareAddress(address: string): Record<string, string> {
    return { address: address.trim() };
  }

  protected convertResult(
    result: Record<string, unknown>,
    address: string
  ): [number, number] {
    const results = ((result as unknown) as GoogleGeoMapsCoddingResult).results;
    if (Array.isArray(results) && results.length) {
      const loc = results[0].geometry.location;
      return [loc.lat, loc.lng];
    } else {
      throw new GeoCodigException(
        'NO_RESULTS',
        `No results returned:\n${JSON.stringify(results, null, 2)}`,
        address
      );
    }
  }
}

class GoogleGeoMapsCoddingResult {
  results: { geometry: { location: { lat: number; lng: number } } }[];
}
