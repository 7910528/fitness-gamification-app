import { type Knex } from 'knex';

import { BADGE_URLS } from '~/seed-data/badges-data.js';

const SEED = {
    TABLE_NAME: 'badges',
    ACHIEVEMENTS_TABLE: 'achievements',
};

async function seed(knex: Knex): Promise<void> {
    await knex(SEED.TABLE_NAME).del();

    const achievements = await knex(SEED.ACHIEVEMENTS_TABLE)
        .select('id')
        .orderBy('id', 'asc')
        .limit(BADGE_URLS.length);

    if (achievements.length === 0) {
        return;
    }

    const badges = achievements.map((achievement, index) => ({
        url: BADGE_URLS[index],
        achievementId: achievement.id,
    }));

    await knex(SEED.TABLE_NAME).insert(badges);
}

export { seed };
