import { type Knex } from 'knex';

const TABLE_NAME = 'levels';

const ColumnName = {
    ID: 'id',
    LEVEL: 'level',
    REQUIRED_POINTS: 'required_points',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
} as const;

async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TABLE_NAME, (table) => {
        table.increments(ColumnName.ID).primary();
        table.integer(ColumnName.LEVEL).notNullable().unique();
        table.integer(ColumnName.REQUIRED_POINTS).notNullable();
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
