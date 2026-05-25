import {
    type ActivityType,
    type Entity,
    type Metric,
    type ValueOf,
} from './enums/enums.js';

class AchievementEntity implements Entity {
    private 'id': number | null;

    private 'name': string;

    private 'activityType': ValueOf<typeof ActivityType> | null;

    private 'requirement': number;

    private 'requirementMetric': ValueOf<typeof Metric> | null;

    private 'points': number;

    private 'createdAt': string | null;

    private constructor({
        id,
        name,
        activityType,
        requirement,
        requirementMetric,
        points,
        createdAt,
    }: {
        id: number | null;
        name: string;
        activityType: ValueOf<typeof ActivityType> | null;
        requirement: number;
        requirementMetric: ValueOf<typeof Metric> | null;
        points: number;
        createdAt: string | null;
    }) {
        this.id = id;
        this.name = name;
        this.activityType = activityType;
        this.requirement = requirement;
        this.requirementMetric = requirementMetric;
        this.points = points;
        this.createdAt = createdAt;
    }

    public static initialize({
        id,
        name,
        activityType,
        requirement,
        requirementMetric,
        points,
        createdAt,
    }: {
        id: number;
        name: string;
        activityType: ValueOf<typeof ActivityType> | null;
        requirement: number;
        requirementMetric: ValueOf<typeof Metric> | null;
        points?: number;
        createdAt: string | null;
    }): AchievementEntity {
        return new AchievementEntity({
            id,
            name,
            activityType,
            requirement,
            requirementMetric,
            points: points ?? 0,
            createdAt,
        });
    }

    public static initializeNew({
        name,
        activityType,
        requirement,
        requirementMetric,
        points,
        createdAt,
    }: {
        name: string;
        activityType: ValueOf<typeof ActivityType> | null;
        requirement: number;
        requirementMetric: ValueOf<typeof Metric> | null;
        points?: number;
        createdAt: string | null;
    }): AchievementEntity {
        return new AchievementEntity({
            id: null,
            name,
            activityType,
            requirement,
            requirementMetric,
            points: points ?? 0,
            createdAt,
        });
    }

    public toObject(): {
        id: number;
        name: string;
        activityType: ValueOf<typeof ActivityType> | null;
        requirement: number;
        requirementMetric: ValueOf<typeof Metric> | null;
        points: number;
        createdAt: string | null;
    } {
        return {
            id: this.id as number,
            name: this.name,
            activityType: this.activityType,
            requirement: this.requirement,
            requirementMetric: this.requirementMetric,
            points: this.points,
            createdAt: this.createdAt,
        };
    }

    public toNewObject(): {
        name: string;
        activityType: ValueOf<typeof ActivityType> | null;
        requirement: number;
        requirementMetric: ValueOf<typeof Metric> | null;
        points: number;
        createdAt: string | null;
    } {
        return {
            name: this.name,
            activityType: this.activityType,
            requirement: this.requirement,
            requirementMetric: this.requirementMetric,
            points: this.points,
            createdAt: this.createdAt,
        };
    }
}

export { AchievementEntity };
