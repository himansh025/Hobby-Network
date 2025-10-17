import { Router } from 'express';
import { getGraphData } from '../controllers/graphController';

const graphRoutes = (): Router => {
  const router = Router();

  router.get('/', getGraphData);

  return router;
};

export { graphRoutes };