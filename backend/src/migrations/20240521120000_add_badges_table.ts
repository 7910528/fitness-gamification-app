import { type Knex } from 'knex';

const TABLE_NAME = 'badges';
const ACHIEVEMENTS_TABLE = 'achievements';

const ColumnName = {
    ID: 'id',
    URL: 'url',
    ACHIEVEMENT_ID: 'achievement_id',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
} as const;

async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.increments(ColumnName.ID).primary();
        table.string(ColumnName.URL).notNullable();
        table
            .integer(ColumnName.ACHIEVEMENT_ID)
            .unsigned()
            .notNullable()
            .unique()
            .references('id')
            .inTable(ACHIEVEMENTS_TABLE)
            .onDelete('CASCADE');
        table
            .dateTime(ColumnName.CREATED_AT)
            .notNullable()
            .defaultTo(knex.fn.now());
        table
            .dateTime(ColumnName.UPDATED_AT)
            .notNullable()
            .defaultTo(knex.fn.now());
    });
}

async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TABLE_NAME);
}

export { down, up };
