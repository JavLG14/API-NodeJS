import { Router } from 'express';
import { validationResult } from 'express-validator';
import * as controller from '../controllers/products.controller.js';
import { productCreateRules, productUpdateRules } from '../validation/products.rules.js';

/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Operacions sobre productes
 *
 * /api/v1/products:
 *   get:
 *     summary: Llistar productes
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Pàgina actual
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *         description: Elements per pàgina
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Cerca per nom o sku
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *         description: Filtra actius/inactius
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 *                 pages: { type: integer }
 *
 *   post:
 *     summary: Crear producte
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductCreate' }
 *           examples:
 *             ok:
 *               value: { name: "Tassa", sku: "TAS-001", price: 4.5, stock: 20, categoryId: "123", supplierId: "456" }
 *             invalid:
 *               value: { name: "", price: -1 }
 *     responses:
 *       201: { description: Creat }
 *       409: { description: SKU duplicat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 * /api/v1/products/export.csv:
 *   get:
 *     summary: Exportar productes a CSV
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Cerca per nom o sku
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *         description: Filtra actius/inactius
 *     responses:
 *       200:
 *         description: CSV exportat
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "id,name,sku,price,stock,active,categoryId,supplierId\n1,Tassa,TAS-001,4.5,20,true,123,456"
 *
 * /api/v1/products/{id}:
 *   get:
 *     summary: Obtindre producte per ID
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No trobat }
 *
 *   put:
 *     summary: Actualitzar producte
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductUpdate' }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No trobat }
 *       409: { description: SKU duplicat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 *   delete:
 *     summary: Esborrar producte
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Esborrat }
 *       404: { description: No trobat }
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string, minLength: 3 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *         categoryId:
 *           type: object
 *           properties:
 *             id: { type: string }
 *             name: { type: string }
 *         supplierId:
 *           type: object
 *           properties:
 *             id: { type: string }
 *             name: { type: string }
 *             email: { type: string, format: email }
 *             phone: { type: string }
 *       required: [id, name, price, stock]
 *     ProductCreate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 3 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *         categoryId: { type: string }
 *         supplierId: { type: string }
 *       required: [name, price, stock]
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 3 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *         categoryId: { type: string }
 *         supplierId: { type: string }
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 *         errors:
 *           type: array
 *           items: { type: object }
*/

const router = Router();
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({
        message: 'Error de validación',
        errors: result.array({ onlyFirstError: true })
      });
    }
    next();
  }
];

router.get('/', controller.list);
router.get('/export.csv', controller.exportCSV);
router.get('/:id', controller.getById);
router.post('/', validate(productCreateRules), controller.create);
router.put('/:id', validate(productUpdateRules), controller.update);
router.delete('/:id', controller.remove);
export default router;