/**
 * Routes for the geo location end point.
 */
import express from 'express';

import controller from './controller';

export default express.Router().get('/', controller.locate);
