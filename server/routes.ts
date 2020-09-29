/**
 * Application-wise router.
 */
import { Application } from 'express';

import geocodingRouter from './api/controllers/geocoding/router';

export default function routes(app: Application): void {
  app.use('/api/v1/geolocation', geocodingRouter);
}
