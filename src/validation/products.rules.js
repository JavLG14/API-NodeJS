import { body, param } from 'express-validator';
export const productCreateRules = [
  body('name')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 3 }).withMessage('El nombre debe tener mínimo 3 caracteres'),

  body('price')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número ≥ 0'),

  body('stock')
    .isInt({ min: 0 }).withMessage('El stock debe ser un entero ≥ 0'),

  body('sku')
    .optional()
    .matches(/^[A-Z0-9-]+$/).withMessage('SKU solo puede contener A-Z, 0-9 y guiones'),

  body('supplierId').optional().isMongoId().withMessage('Supplier no válido')
];

export const productUpdateRules = [
  param('id').isMongoId().withMessage('ID no válido'),

  body('name')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 3 }).withMessage('El nombre debe tener mínimo 3 caracteres'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número ≥ 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser entero ≥ 0'),

  body('sku')
    .optional()
    .matches(/^[A-Z0-9-]+$/).withMessage('SKU solo puede contener A-Z, 0-9 y guiones'),

  body('active')
    .optional()
    .isBoolean().withMessage('Active debe ser true o false'),

  body('supplierId').optional().isMongoId().withMessage('Supplier no válido')
];