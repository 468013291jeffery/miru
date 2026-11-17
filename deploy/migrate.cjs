'use strict';
// Run explicitly with the database owner's environment before starting a new release.
delete process.env.MIRU_SKIP_SCHEMA;
require('../api/_lib.js').db().then(() => {
  console.log('MIRU schema initialization completed');
}).catch(err => {
  console.error('MIRU schema initialization failed:', err.code || err.name);
  process.exitCode = 1;
});
