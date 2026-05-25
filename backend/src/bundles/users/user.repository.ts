import { UserEntity } from '~/bundles/users/user.entity.js';
import { type UserModel } from '~/bundles/users/user.model.js';
import { DatabaseTableName } from '~/common/database/database.js';
import { HttpCode, HttpError } from '~/common/http/http.js';
import { type Repository } from '~/common/types/types.js';

import { type AchievementRepository } from '../achievements/achievement.repository.js';
import { Achievements, ErrorMessage } from '../achievements/achievements.js';
import { type LevelService } from '../levels/levels.js';
import {
    type UserBonusEntity,
    type UserBonusGetAllItemResponseDto,
} from '../user-bonuses/user-bonuses.js';
import { type UserDetailsModel } from './user-details.model.js';

class UserRepository implements Repository {
    private userModel: typeof UserModel;

    private achievementRepository: AchievementRepository;

    private levelService: LevelService;

    public constructor(
        userModel: typeof UserModel,
        achievementRepository: AchievementRepository,
        levelService: LevelService,
    ) {
        this.userModel = userModel;
        this.achievementRepository = achievementRepository;
        this.levelService = levelService;
    }

    public async find(
        query: Record<string, unknown>,
    ): Promise<UserEntity | null> {
        const user = await this.userModel
            .query()
            .findOne(query)
            .withGraphFetched('userDetails')
            .execute();

        if (!user) {
            return null;
        }

        const { userDetails, ...userInfo } = user;

        const level = await this.levelService.calculateLevel(
            userDetails.bonusBalance,
        );

        return UserEntity.initialize({
            ...userInfo,
            fullName: userDetails.fullName,
            avatarUrl: userDetails.avatarUrl,
            username: userDetails.username,
            dateOfBirth: userDetails.dateOfBirth,
            weight: userDetails.weight,
            height: userDetails.height,
            gender: userDetails.gender,
            isPublic: userDetails.isPublic,
            referralCode: userDetails.referralCode,
            bonusBalance: userDetails.bonusBalance,
            location: userDetails.location,
            level,
        });
    }

    public async findWithUserDetailsJoined(
        query: Record<string, unknown>,
    ): Promise<UserEntity | null> {
        const user = await this.userModel
            .query()
            .joinRelated('userDetails')
            .findOne(query)
            .withGraphFetched('userDetails')
            .execute();

        if (!user) {
            return null;
        }

        const { userDetails, ...userInfo } = user;

        const level = await this.levelService.calculateLevel(
            userDetails.bonusBalance,
        );

        return UserEntity.initialize({
            ...userInfo,
            fullName: userDetails.fullName,
            avatarUrl: userDetails.avatarUrl,
            username: userDetails.username,
            dateOfBirth: userDetails.dateOfBirth,
            weight: userDetails.weight,
            height: userDetails.height,
            gender: userDetails.gender,
            isPublic: userDetails.isPublic,
            referralCode: userDetails.referralCode,
            bonusBalance: userDetails.bonusBalance,
            location: userDetails.location,
            level,
        });
    }

    public async findAll(): Promise<UserEntity[]> {
        const users = await this.userModel
            .query()
            .withGraphFetched('userDetails')
            .execute();

        return await Promise.all(
            users.map(async (user) => {
                const { userDetails, ...userInfo } = user;
                const level = await this.levelService.calculateLevel(
                    userDetails.bonusBalance,
                );

                return UserEntity.initialize({
                    ...userInfo,
                    fullName: userDetails.fullName,
                    avatarUrl: userDetails.avatarUrl,
                    username: userDetails.username,
                    dateOfBirth: userDetails.dateOfBirth,
                    weight: userDetails.weight,
                    height: userDetails.height,
                    gender: userDetails.gender,
                    isPublic: userDetails.isPublic,
                    referralCode: userDetails.referralCode,
                    bonusBalance: userDetails.bonusBalance,
                    location: userDetails.location,
                    level,
                });
            }),
        );
    }

    public async create(entity: UserEntity): Promise<UserEntity> {
        const {
            email,
            passwordHash,
            stripeCustomerId,
            referralCode,
            fullName,
            avatarUrl,
        } = entity.toNewObject();

        const trx = await this.userModel.startTransaction();

        try {
            const user = await this.userModel
                .query(trx)
                .insert({
                    email,
                    passwordHash,
                    stripeCustomerId,
                })
                .returning('*')
                .execute();

            const userDetails = await user
                .$relatedQuery('userDetails', trx)
                .insert({ referralCode, fullName, avatarUrl })
                .returning('*')
                .execute();

            const achievement = await this.achievementRepository.find({
                name: Achievements.JOIN,
            });

            if (!achievement) {
                throw new HttpError({
                    message: ErrorMessage.ACHIEVEMENT_NOT_FOUND,
                    status: HttpCode.NOT_FOUND,
                });
            }

            const { id } = achievement.toObject();

            await user
                .$relatedQuery('userAchievements', trx)
                .insert({ achievementId: id })
                .returning('*')
                .execute();

            await trx.commit();

            const level = await this.levelService.calculateLevel(
                userDetails.bonusBalance,
            );

            return UserEntity.initialize({
                ...user,
                fullName: userDetails.fullName,
                avatarUrl: userDetails.avatarUrl,
                username: userDetails.username,
                dateOfBirth: userDetails.dateOfBirth,
                weight: userDetails.weight,
                height: userDetails.height,
                gender: userDetails.gender,
                isPublic: userDetails.isPublic,
                referralCode: userDetails.referralCode,
                bonusBalance: userDetails.bonusBalance,
                location: userDetails.location,
                level,
            });
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    public async update(
        query: Record<string, unknown>,
        payload: Record<string, unknown>,
    ): ReturnType<Repository['update']> {
        return await this.userModel
            .query()
            .patch(payload)
            .where(query)
            .returning('*')
            .first()
            .execute();
    }

    public async updateUserDetails(
        userId: number,
        payload: Partial<UserDetailsModel>,
    ): Promise<UserEntity | null> {
        const trx = await this.userModel.startTransaction();
        try {
            const user = await this.userModel.query(trx).findById(userId);

            if (!user) {
                return null;
            }

            const userDetails = await user
                .$relatedQuery('userDetails', trx)
                .patch(payload)
                .returning('*')
                .first();

            await trx.commit();

            if (!userDetails) {
                return null;
            }

            const level = await this.levelService.calculateLevel(
                userDetails.bonusBalance,
            );

            return UserEntity.initialize({
                ...user,
                fullName: userDetails.fullName,
                avatarUrl: userDetails.avatarUrl,
                username: userDetails.username,
                dateOfBirth: userDetails.dateOfBirth,
                weight: userDetails.weight,
                height: userDetails.height,
                gender: userDetails.gender,
                isPublic: userDetails.isPublic,
                referralCode: userDetails.referralCode,
                bonusBalance: userDetails.bonusBalance,
                location: userDetails.location,
                level,
            });
        } catch (error) {
            await trx.rollback();
            throw new Error(`Error updating user details: ${error}`);
        }
    }

    public async createUserBonusTransaction(
        entity: UserBonusEntity,
    ): Promise<UserBonusGetAllItemResponseDto | null> {
        const { userId, actionType, transactionType, amount } =
            entity.toNewObject();

        const user = await this.userModel.query().findById(userId);

        if (!user) {
            return null;
        }

        const userBonusTransaction = await user
            .$relatedQuery('userBonus')
            .insert({ userId, actionType, transactionType, amount })
            .returning('*')
            .first();

        return {
            id: userBonusTransaction.id,
            userId: userBonusTransaction.userId,
            actionType: userBonusTransaction.actionType,
            transactionType: userBonusTransaction.transactionType,
            amount: userBonusTransaction.amount,
            createdAt: userBonusTransaction.createdAt,
        };
    }

    public async findLeaderboard(payload: {
        currentUserId: number;
        page: number;
        limit: number;
        friendsOnly: boolean;
    }): Promise<{
        items: {
            id: number;
            email: string;
            fullName: string | null;
            username: string | null;
            avatarUrl: string | null;
            bonusBalance: number;
            level: number | null;
            rank: number;
        }[];
        totalCount: number;
        currentUserRank: number | null;
    }> {
        const { currentUserId, page, limit, friendsOnly } = payload;

        let allowedIds: number[] | null = null;

        if (friendsOnly) {
            const followingsRows = await this.userModel
                .knex()
                .from(DatabaseTableName.FRIENDS)
                .where({ userId: currentUserId })
                .select('followingId as id');
            const followersRows = await this.userModel
                .knex()
                .from(DatabaseTableName.FRIENDS)
                .where({ followingId: currentUserId })
                .select('userId as id');

            const idsSet = new Set<number>([currentUserId]);
            for (const row of followingsRows) {
                idsSet.add(Number(row.id));
            }
            for (const row of followersRows) {
                idsSet.add(Number(row.id));
            }
            allowedIds = [...idsSet];
        }

        const baseQuery = this.userModel
            .query()
            .withGraphFetched('userDetails');

        if (allowedIds) {
            void baseQuery.whereIn(
                `${DatabaseTableName.USERS}.id`,
                allowedIds,
            );
        }

        const usersForRanking = await baseQuery;

        const ranked = usersForRanking
            .map((user) => {
                const { userDetails, id, email } = user;
                return {
                    id,
                    email,
                    fullName: userDetails?.fullName ?? null,
                    username: userDetails?.username ?? null,
                    avatarUrl: userDetails?.avatarUrl ?? null,
                    bonusBalance: Number(userDetails?.bonusBalance ?? 0),
                };
            })
            .sort((a, b) => b.bonusBalance - a.bonusBalance);

        const totalCount = ranked.length;

        const currentUserIndex = ranked.findIndex(
            (item) => item.id === currentUserId,
        );
        const currentUserRank =
            currentUserIndex === -1 ? null : currentUserIndex + 1;

        const offset = (page - 1) * limit;
        const slice = ranked.slice(offset, offset + limit);

        const items = await Promise.all(
            slice.map(async (item, index) => {
                const level = await this.levelService.calculateLevel(
                    item.bonusBalance,
                );
                return {
                    ...item,
                    level,
                    rank: offset + index + 1,
                };
            }),
        );

        return { items, totalCount, currentUserRank };
    }

    public async calculateStreak(
        userId: number,
        tzOffsetMinutes: number,
    ): Promise<number> {
        const rows = await this.userModel
            .knex()
            .from(DatabaseTableName.WORKOUTS)
            .where({ userId })
            .select('workoutStartedAt');

        if (rows.length === 0) {
            return 0;
        }

        // Convert each workout's UTC timestamp into the user's local date.
        // JS Date.getTimezoneOffset() returns minutes WEST of UTC (e.g. UTC+3
        // returns -180). We accept the same convention from the client.
        const dayMs = 24 * 60 * 60 * 1000;
        const toLocalDayKey = (date: Date): string => {
            const local = new Date(date.getTime() - tzOffsetMinutes * 60 * 1000);
            const year = local.getUTCFullYear();
            const month = String(local.getUTCMonth() + 1).padStart(2, '0');
            const day = String(local.getUTCDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const workoutDays = new Set<string>();
        for (const row of rows) {
            const value = (row as { workoutStartedAt: Date | string })
                .workoutStartedAt;
            if (!value) {
                continue;
            }
            workoutDays.add(toLocalDayKey(new Date(value)));
        }

        const todayKey = toLocalDayKey(new Date());
        const yesterday = new Date(Date.now() - dayMs);
        const yesterdayKey = toLocalDayKey(yesterday);

        let cursor: Date;
        if (workoutDays.has(todayKey)) {
            cursor = new Date(
                new Date().getTime() - tzOffsetMinutes * 60 * 1000,
            );
        } else if (workoutDays.has(yesterdayKey)) {
            cursor = new Date(yesterday.getTime() - tzOffsetMinutes * 60 * 1000);
        } else {
            return 0;
        }

        let streak = 0;
        while (true) {
            const year = cursor.getUTCFullYear();
            const month = String(cursor.getUTCMonth() + 1).padStart(2, '0');
            const day = String(cursor.getUTCDate()).padStart(2, '0');
            const key = `${year}-${month}-${day}`;
            if (!workoutDays.has(key)) {
                break;
            }
            streak += 1;
            cursor = new Date(cursor.getTime() - dayMs);
        }

        return streak;
    }

    public delete(): ReturnType<Repository['delete']> {
        return Promise.resolve(true);
    }
}

export { UserRepository };
