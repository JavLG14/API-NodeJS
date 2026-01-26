import { Product } from '../models/product.model.js';

export async function list(req, res, next) {
  try {
    const { q, active, minPrice, maxPrice, category, sort } = req.query;
    
    const page = Math.max(parseInt(req.query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { sku: { $regex: q, $options: 'i' } }];
    if (active !== undefined) filter.active = active === 'true';
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (category) filter.categoryId = category; // id de categoria

    let sortObj = { createdAt: -1 }; // por defecto
    if (sort) {
      sortObj = {};
      sort.split(',').forEach(field => {
        if (field.startsWith('-')) sortObj[field.slice(1)] = -1;
        else sortObj[field] = 1;
      });
    }

    const [total, data] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate('categoryId', 'name')
        .populate('supplierId', 'name email phone')
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean()
    ]);
    res.json({
      data,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .populate('supplierId', 'name email phone')
      .lean();
    if (!product) return res.status(404).json({ error: 'No trobat' });
    res.json(product);
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'SKU duplicat' });
    if (err?.name === 'ValidationError') return res.status(422).json({ error: err.message });
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ error: 'No trobat' });
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'SKU duplicat' });
    if (err?.name === 'ValidationError') return res.status(422).json({ error: err.message });
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const out = await Product.findByIdAndDelete(req.params.id).lean();
    if (!out) return res.status(404).json({ error: 'No trobat' });
    res.status(204).send();
  } catch (err) { next(err); }
}

export async function exportCSV(req, res, next) {
  try {
    const products = await Product.find().lean();

    // Cabecera CSV
    const header = 'name,sku,price,stock,active\n';

    // Filas
    const rows = products.map(p =>
      `${p.name},${p.sku ?? ''},${p.price},${p.stock},${p.active}`
    ).join('\n');

    const csv = header + rows;

    // Indicamos que es un CSV descargable
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');

    res.send(csv);

  } catch (err) { next(err); }
}