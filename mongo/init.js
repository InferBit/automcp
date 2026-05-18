// MongoDB init — runs on first container start.
// Creates the application database, collections, and indexes used by
// automcp-api (and inherited by automcp-enterprise-api).

const dbName = process.env.MONGO_INITDB_DATABASE || 'automcp';
const appUser = process.env.MONGO_APP_USER || 'automcp_app';
const appPassword = process.env.MONGO_APP_PASSWORD || 'changeme_app';

db = db.getSiblingDB(dbName);

db.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [{ role: 'readWrite', db: dbName }],
});

// Specs
db.createCollection('specs');
db.specs.createIndex({ id: 1 }, { unique: true });
db.specs.createIndex({ url: 1 });

// Templates (managed-platform schema; pre-create indexes so enterprise rollout is smooth)
db.createCollection('templates');
db.templates.createIndex({ platform: 1, version: 1 }, { unique: true });

// Instances
db.createCollection('instances');
db.instances.createIndex({ template_id: 1 });
db.instances.createIndex({ org_id: 1 });

// Marketplace listings
db.createCollection('marketplace_listings');
db.marketplace_listings.createIndex({ org_id: 1 });
db.marketplace_listings.createIndex({ ownership_type: 1 });
db.marketplace_listings.createIndex({ status: 1 });

// Transactions
db.createCollection('transactions');
db.transactions.createIndex({ id: 1 }, { unique: true });
db.transactions.createIndex({ status: 1, created_at: -1 });
db.transactions.createIndex({ agent_id: 1, created_at: -1 });

print(`AutoMCP MongoDB initialized: db=${dbName}, app user=${appUser}`);
