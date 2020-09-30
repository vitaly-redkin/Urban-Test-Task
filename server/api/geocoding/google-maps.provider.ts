import fetch from 'node-fetch';

import {
  GeoCodingProvider,
  IGeoCodingResult,
  GeoCodigException,
} from './geocoding.provider';
import { fixedEncodeURIComponent } from '../../util/util';

/**
 * Google Maps implemetation of the Geo Provider.
 */
export class GoogleMapsProvider extends GeoCodingProvider {
  /**
   * Constructor.
   *
   * @param apiKey Google Maps API key.
   */
  constructor(private readonly apiKey: string) {
    super();
  }

  /**
   * Method to search for coordinates and other data (full address, post code) by user-entered address.
   *
   * @param addressRec object with provider-specific version of the user entered address
   * @returns object with provider-specific output data
   */
  protected async getCordinatesByAddressInt(
    addressRec: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const apiKey: string = fixedEncodeURIComponent(this.apiKey);
    const address: string = addressRec['address'] as string;
    const addressForUrl: string = fixedEncodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${addressForUrl}`;

    try {
      const response = await fetch(url);
      // fetch() is well-known for returning normally when HTTP status is 4xx or 5xx
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

  /**
   * Prepares user-entered address to be used by geo coding provider.
   *
   * @param address user-entered address
   * @returns object with provider-specific version of the user entered addres
   */
  protected prepareAddress(address: string): Record<string, unknown> {
    return { address: address.trim() };
  }

  /**
   * Converts the result returned by the geo coding provider to the data we are interested in.
   *
   * @param result object returned by the geo coding provider to extract the information from
   * @param address original user-entered address
   * @returns obecjt with geo coding data with are interested in
   */
  protected convertResult(
    result: Record<string, unknown>,
    address: string
  ): IGeoCodingResult {
    const results = ((result as unknown) as GoogleGeoMapsCoddingResult).results;
    if (Array.isArray(results) && results.length && results[0]) {
      // If there are more than one result always take the firt one (for start!)
      const r = results[0];
      // Finds the postal code in the list of address components
      const ac = r.address_components.find(
        (ac) => ac.types.length === 1 && ac.types[0] === 'postal_code'
      );

      return {
        address: r.formatted_address,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
        postCode: ac ? ac.short_name : 'N/A',
      };
    } else {
      // No results are returned by the geo coding provider
      throw new GeoCodigException(
        'NO_RESULTS',
        `No results returned:\n${JSON.stringify(results, null, 2)}`,
        address
      );
    }
  }
}

/**
 * Class to describe the fields in the Google Map returned results we are interested in.
 */
class GoogleGeoMapsCoddingResult {
  results: {
    address_components: {
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
}
