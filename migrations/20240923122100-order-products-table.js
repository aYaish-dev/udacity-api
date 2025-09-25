'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  // جدول ربط المنتجات بالطلبات
  await db.createTable('order_products', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    order_id: { type: 'int', notNull: true },
    product_id: { type: 'int', notNull: true },
    quantity: { type: 'int', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  });

  // مفاتيح أجنبية
  await db.addForeignKey('order_products', 'orders', 'op_order_id_fk', { order_id: 'id' }, { onDelete: 'CASCADE' });
  await db.addForeignKey('order_products', 'products', 'op_product_id_fk', { product_id: 'id' }, { onDelete: 'CASCADE' });

  // قيود تحقق (كمية > 0)
  await db.runSql('ALTER TABLE order_products ADD CONSTRAINT order_products_qty_check CHECK (quantity > 0);');

  // (اختياري) منع تكرار نفس المنتج لنفس الطلب إلا لو بدك تسمح
  // await db.runSql('CREATE UNIQUE INDEX order_products_unique ON order_products(order_id, product_id);');
};

exports.down = async function (db) {
  await db.removeForeignKey('order_products', 'op_order_id_fk');
  await db.removeForeignKey('order_products', 'op_product_id_fk');
  await db.dropTable('order_products');
};

exports._meta = { version: 1 };
