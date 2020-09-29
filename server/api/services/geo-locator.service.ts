import L from '../../common/logger';

import { getCordinatesByAddress } from '../geocoding';
import { IGeoCodingResult } from '../geocoding/GeoGodingProvider';

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
    serviceArea: string;
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
      const gcr: IGeoCodingResult = await getCordinatesByAddress(address);
      const serviceArea = '111'; // TO DO
      const result: IResponse = {
        status: 'OK',
        search,
        location: {
          ...gcr,
          serviceArea,
        },
      };

      L.info(
        `Search ${search} for "${address}" completed: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );

      return Promise.resolve(result);
    } catch (e) {
      // Return error status for the search
      return {
        status: 'ERROR',
        search,
      };
    }
  }
}

export default new GeoLocatorService();
