import { type Knex } from 'knex';

import { levels } from '~/seed-data/levels-data.js';

const SEED = {
    TABLE_NAME: 'levels',
};

async function seed(knex: Knex): Promise<void> {
    await knex(SEED.TABLE_NAME).del();

    await knex(SEED.TABLE_NAME).insert(levels);
}

export { seed };
