import { Router } from 'express';
import * as controller from '../controllers/categories.controller.js';

/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Operacions sobre categories
 *
 * /api/v1/categories:
 *   get:
 *     summary: Llistar categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Category' }
 *
 *   post:
 *     summary: Crear category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CategoryCreate' }
 *           examples:
 *             ok:
 *               value: { name: "Vasos" }
 *             invalid:
 *               value: { name: "" }
 *     responses:
 *       201: { description: Creat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string, minLength: 2 }
 *       required: [id, name]
 *     CategoryCreate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 2 }
 *       required: [name]
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 *         errors:
 *           type: array
 *           items: { type: object }
 */

const router = Router();
router.get('/', controller.list);
router.post('/', controller.create);
export default router;