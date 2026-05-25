import { type Knex } from 'knex';

const TABLE_NAME = 'achievements';
const COLUMN_NAME = 'points';

async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.integer(COLUMN_NAME).notNullable().defaultTo(0);
    });
}

async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.dropColumn(COLUMN_NAME);
    });
}

export { down, up };
