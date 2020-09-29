import GeoLocationService from '../../services/geo-locator.service';
import { Request, Response } from 'express';

/**
 * Controller for the geo location item end point.
 */
export class Controller {
  /**
   * Locates service area by the address given as a query parameter.message
   * 
   * @param req request object
   * @param res response object
   */
  async locate(req: Request, res: Response): Promise<void> {
    const search: string = req.query.search as string;
    const address: string = req.query.address as string;

    try {
      const r = await GeoLocationService.locate(search, address);
      res.status(200).json(r);
    } catch (e) {
      res.status(500).json({
        search,
        message: e.message,
      });
    }
  }
}

export default new Controller();
