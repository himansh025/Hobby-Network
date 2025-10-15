import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createRelationship,
  removeRelationship
} from '../controllers/userController';

// TypeScript: Route definitions that call controller functions
const userRoutes = (): Router => {
  const router = Router();

  // User CRUD routes
  router.get('/', getAllUsers);
  router.post('/', createUser);
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);
  router.get('/:id', getUserById);

  // Relationship routes
  router.post('/:id/link', createRelationship);
  router.delete('/:id/unlink', removeRelationship);

  return router;
};

export { userRoutes };