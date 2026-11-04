import * as migration_20261103_065455_baseline from './20261103_065455_baseline';
import * as migration_20261103_070346_cms_globals from './20261103_070346_cms_globals';

export const migrations = [
  {
    up: migration_20261103_065455_baseline.up,
    down: migration_20261103_065455_baseline.down,
    name: '20261103_065455_baseline',
  },
  {
    up: migration_20261103_070346_cms_globals.up,
    down: migration_20261103_070346_cms_globals.down,
    name: '20261103_070346_cms_globals'
  },
];
