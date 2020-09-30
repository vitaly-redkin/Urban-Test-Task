import L from '../../common/logger';
import { getCordinatesByAddress } from '../geocoding';
import { IGeoCodingResult } from '../geocoding/geocoding.provider';
import { cacheGet, cacheSet, cacheComposeKey } from '../../util/cache-manager';
import { findDistrict } from '../district-finder/district-finder';

/**
 * Interface for geo location results.
 */
interface IResponse {
  // Geo location status
  status: 'OK' | 'NOT_FOUND' | 'ERROR';
  // Search ID
  search: string;
  // Location - as resolved by geo coding servoice plus the service area
  location?: IGeoCodingResult & {
    // Service area - the result of our search for the address
    serviceArea?: string;
  };
}

/**
 * Geo Location service.
 */
export class GeoLocatorService {
  /**
   * Locates the service area and other geo details for the user-entered address.
   *
   * @param search search ID
   * @param address user enetred address
   * @returns object with the status, search ID, geo coding data and the service area
   */
  async locate(search: string, address: string): Promise<IResponse> {
    L.info(`Search ${search} for "${address}"...`);

    try {
      const cacheKey: string = cacheComposeKey('geo-locator.locate', address);
      let result: IResponse | undefined = cacheGet<IResponse>(cacheKey);
      if (!result || result.status === 'ERROR') {
        const gcr: IGeoCodingResult = await getCordinatesByAddress(address);

        const serviceArea: string | null = findDistrict(gcr);
        if (serviceArea) {
          result = {
            status: 'OK',
            search,
            location: {
              ...gcr,
              serviceArea,
            },
          };
        } else {
          result = {
            status: 'NOT_FOUND',
            search,
            location: {
              ...gcr,
            },
          };
        }

        cacheSet<IResponse>(cacheKey, result);

        L.info(
          `Search ${search} for "${address}" completed: ${JSON.stringify(
            result,
            null,
            2
          )}`
        );
      } else {
        L.info(
          `Search ${search} for "${address}" found in cache: ${JSON.stringify(
            result,
            null,
            2
          )}`
        );
      }

      return Promise.resolve(result);
    } catch (e) {
      L.error(e);

      // Return error status for the search
      return {
        status: 'ERROR',
        search,
      };
    }
  }
}

export default new GeoLocatorService();
