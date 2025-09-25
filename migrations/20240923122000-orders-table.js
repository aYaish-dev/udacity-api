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
  // جدول الطلبات
  await db.createTable('orders', {
    id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
    user_id: { type: 'int', notNull: true },
    status: { type: 'string', length: 20, notNull: true, defaultValue: 'active' },
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

  // مفتاح أجنبي على users(id) مع حذف متسلسل
  await db.addForeignKey('orders', 'users', 'orders_user_id_fk', { user_id: 'id' }, { onDelete: 'CASCADE' });

  // قيد التحقق على status
  await db.runSql("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('active','complete'));");
};

exports.down = async function (db) {
  await db.removeForeignKey('orders', 'orders_user_id_fk');
  await db.dropTable('orders');
};

exports._meta = { version: 1 };
