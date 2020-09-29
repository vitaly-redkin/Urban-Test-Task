export abstract class GeoCodingProvider {
  public async getCordinatesByAddress(
    address: string
  ): Promise<[number, number]> {
    try {
      const addressRec: Record<string, string> = this.prepareAddress(address);
      const resultRec = await this.getCordinatesByAddressInt(addressRec);
      const result: [number, number] = this.convertResult(resultRec, address);
      return result;
    } catch (e) {
      const code: string = 'code' in e ? (e.code as string) : 'UNKNOWN';
      return Promise.reject(new GeoCodigException(code, e, address));
    }
  }

  protected abstract async getCordinatesByAddressInt(
    addressRec: Record<string, string>
  ): Promise<Record<string, unknown>>;

  protected abstract prepareAddress(address: string): Record<string, string>;

  protected abstract convertResult(
    result: Record<string, unknown>,
    address: string
  ): [number, number];
}

export class GeoCodigException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly address: string
  ) {
    super(`Exception with code ${code} for "${address}": ${message}`);
  }
}
