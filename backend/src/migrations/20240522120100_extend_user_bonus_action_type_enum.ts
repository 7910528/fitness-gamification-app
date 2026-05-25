import { type Knex } from 'knex';

const ACTION_TYPE_ENUM = 'action_type_enum';

const NewValues = {
    WORKOUT_COMPLETED: 'workout_completed',
    ACHIEVEMENT_COMPLETED: 'achievement_completed',
} as const;

async function up(knex: Knex): Promise<void> {
    await knex.schema.raw(
        `ALTER TYPE ${ACTION_TYPE_ENUM} ADD VALUE IF NOT EXISTS '${NewValues.WORKOUT_COMPLETED}'`,
    );
    await knex.schema.raw(
        `ALTER TYPE ${ACTION_TYPE_ENUM} ADD VALUE IF NOT EXISTS '${NewValues.ACHIEVEMENT_COMPLETED}'`,
    );
}

async function down(): Promise<void> {
    // PostgreSQL does not support removing values from enums.
    // No-op rollback.
}

export { down, up };
