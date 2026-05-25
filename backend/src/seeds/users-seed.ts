import crypto from 'node:crypto';

import * as Bcrypt from 'bcrypt';
import { type Knex } from 'knex';

const SEED = {
    USERS_TABLE: 'users',
    USER_DETAILS_TABLE: 'user_details',
};

const TOTAL_USERS = 100;
const MIN_POINTS = 101;
const MAX_POINTS = 5000;
const DEFAULT_PASSWORD = 'Password123!';
const SALT_ROUNDS = 10;

const FIRST_NAMES = [
    'Oleksii',
    'Mariia',
    'Ivan',
    'Sofiia',
    'Andrii',
    'Olena',
    'Dmytro',
    'Kateryna',
    'Mykola',
    'Anastasiia',
    'Bohdan',
    'Yuliia',
    'Taras',
    'Iryna',
    'Sergii',
    'Daria',
    'Maksym',
    'Nataliia',
    'Volodymyr',
    'Tetiana',
];

const LAST_NAMES = [
    'Shevchenko',
    'Kovalenko',
    'Bondarenko',
    'Tkachenko',
    'Kravchenko',
    'Melnyk',
    'Boiko',
    'Marchenko',
    'Lysenko',
    'Pavlenko',
    'Savchenko',
    'Petrenko',
    'Moroz',
    'Vasylenko',
    'Romanenko',
    'Kuzmenko',
    'Mazur',
    'Hryhorenko',
    'Sokolov',
    'Zhuk',
];

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const pickRandom = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)] as T;
};

async function seed(knex: Knex): Promise<void> {
    const passwordHash = Bcrypt.hashSync(DEFAULT_PASSWORD, SALT_ROUNDS);

    await knex.transaction(async (trx) => {
        for (let index = 1; index <= TOTAL_USERS; index++) {
            const email = `seed.user${index}@stayfit.dev`;

            const existing = await trx(SEED.USERS_TABLE)
                .where({ email })
                .first();

            if (existing) {
                continue;
            }

            const [insertedUser] = await trx(SEED.USERS_TABLE)
                .insert({
                    email,
                    passwordHash,
                    stripeCustomerId: `seed_${crypto.randomUUID()}`,
                })
                .returning('id');

            const userId = (insertedUser as { id: number }).id;

            const firstName = pickRandom(FIRST_NAMES);
            const lastName = pickRandom(LAST_NAMES);

            await trx(SEED.USER_DETAILS_TABLE).insert({
                userId,
                fullName: `${firstName} ${lastName}`,
                username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index}`,
                avatarUrl: null,
                referralCode: crypto.randomUUID(),
                bonusBalance: getRandomInt(MIN_POINTS, MAX_POINTS),
                isPublic: true,
            });
        }
    });
}

export { seed };
