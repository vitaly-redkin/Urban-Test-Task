/**
 * Interface for the coding (address -> coordinates) operation result.
 */
export interface IGeoCodingResult {
  address: string; // Full address (as returned by tge Geo Coding provider)
  lat: number; // Lattitude of the address
  lng: number; // Longitude of the address
  postCode: string; // Address post code
}

/**
 * Abstract class to be extended by real Geo Coding provider classes.
 */
export abstract class GeoCodingProvider {
  /**
   * Gets coordinates and other data (full address, post code) by user-entered address.
   *
   * @param address string with user-entered address to search the coordinates for
   * @returns object with geographical coordinates and other address fields.message
   * @throws GeoCodigException when an exception occurred in the geo locating or when processing the results
   */
  public async getCordinatesByAddress(
    address: string
  ): Promise<IGeoCodingResult> {
    try {
      const addressRec: Record<string, unknown> = this.prepareAddress(address);
      const resultRec = await this.getCordinatesByAddressInt(addressRec);
      const result: IGeoCodingResult = this.convertResult(resultRec, address);
      return result;
    } catch (e) {
      const code: string = 'code' in e ? (e.code as string) : 'UNKNOWN';
      return Promise.reject(new GeoCodigException(code, e, address));
    }
  }

  /**
   * Abstract method to search for coordinates and other data (full address, post code) by user-entered address.
   *
   * @param addressRec object with provider-specific version of the user entered address
   * @returns object with provider-specific output data
   */
  protected abstract async getCordinatesByAddressInt(
    addressRec: Record<string, unknown>
  ): Promise<Record<string, unknown>>;

  /**
   * Prepares user-entered address to be used by geo coding provider.
   *
   * @param address user-entered address
   * @returns object with provider-specific version of the user entered addres
   */
  protected abstract prepareAddress(address: string): Record<string, unknown>;

  /**
   * Converts the result returned by the geo coding provider to the data we are interested in.
   *
   * @param result object returned by the geo coding provider to extract the information from
   * @param address original user-entered address
   * @returns obecjt with geo coding data with are interested in
   */
  protected abstract convertResult(
    result: Record<string, unknown>,
    address: string
  ): IGeoCodingResult;
}

/**
 * Exception class to use in geo coding operations.
 */
export class GeoCodigException extends Error {
  /**
   * Constructor.
   *
   * @param code exception code (as returned by the geo provider or 'UNKNOWN' or 'NO_RESULTS')
   * @param message exception message
   * @param address address that caused this exception
   */
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly address: string
  ) {
    super(`Exception with code ${code} for "${address}": ${message}`);
  }
}
