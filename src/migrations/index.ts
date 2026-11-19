import * as migration_20261103_065455_baseline from './20261103_065455_baseline';
import * as migration_20261103_070346_cms_globals from './20261103_070346_cms_globals';
import * as migration_20261105_110855_contact_form from './20261105_110855_contact_form';
import * as migration_20261119_085256_contact_public_email from './20261119_085256_contact_public_email';

export const migrations = [
  {
    up: migration_20261103_065455_baseline.up,
    down: migration_20261103_065455_baseline.down,
    name: '20261103_065455_baseline',
  },
  {
    up: migration_20261103_070346_cms_globals.up,
    down: migration_20261103_070346_cms_globals.down,
    name: '20261103_070346_cms_globals',
  },
  {
    up: migration_20261105_110855_contact_form.up,
    down: migration_20261105_110855_contact_form.down,
    name: '20261105_110855_contact_form',
  },
  {
    up: migration_20261119_085256_contact_public_email.up,
    down: migration_20261119_085256_contact_public_email.down,
    name: '20261119_085256_contact_public_email'
  },
];
