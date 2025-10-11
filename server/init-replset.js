// init-replset.js
const { MongoClient } = require('mongodb');

(async () => {
  // directConnection ВАЖЕН до rs.initiate()
  const uri = 'mongodb://127.0.0.1:27017/?directConnection=true';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });

  try {
    await client.connect();
    const admin = client.db('admin');

    try {
      const res = await admin.command({
        replSetInitiate: {
          _id: 'rs0',
          members: [{ _id: 0, host: '127.0.0.1:27017' }],
        },
      });
      console.log('Replica set initiated:', res);
    } catch (e) {
      if (e.codeName === 'AlreadyInitialized' || /already initialized/i.test(e.message)) {
        console.log('Replica set already initialized');
      } else {
        throw e;
      }
    }

    const status = await admin.command({ replSetGetStatus: 1 });
    console.log('set:', status.set);
    console.log((status.members || []).map(m => ({ name: m.name, stateStr: m.stateStr })));
  } catch (err) {
    console.error('Init error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
})();
