import { type Knex } from 'knex';

import { ActivityType, Metric } from './enums/enums.js';

const Achievements = [
    {
        name: 'Joining StayFit',
        activityType: null,
        requirement: 1,
        requirementMetric: null,
        points: 10,
    },
    {
        name: 'Cycling Milestone: 5 km',
        activityType: ActivityType.CYCLING,
        requirement: 5,
        requirementMetric: Metric.KILOMETERS,
        points: 30,
    },
    {
        name: 'Cycling Milestone: 20 km',
        activityType: ActivityType.CYCLING,
        requirement: 20,
        requirementMetric: Metric.KILOMETERS,
        points: 75,
    },
    {
        name: 'Cycling Milestone: 50 km',
        activityType: ActivityType.CYCLING,
        requirement: 50,
        requirementMetric: Metric.KILOMETERS,
        points: 150,
    },
    {
        name: 'Cycling Milestone: 200 km',
        activityType: ActivityType.CYCLING,
        requirement: 200,
        requirementMetric: Metric.KILOMETERS,
        points: 400,
    },
    {
        name: 'Cycling Milestone: 300 km',
        activityType: ActivityType.CYCLING,
        requirement: 300,
        requirementMetric: Metric.KILOMETERS,
        points: 600,
    },
    {
        name: 'Cycling Milestone: 2 hours',
        activityType: ActivityType.CYCLING,
        requirement: 120,
        requirementMetric: Metric.MINUTES,
        points: 50,
    },
    {
        name: 'Cycling Milestone: 5 hours',
        activityType: ActivityType.CYCLING,
        requirement: 300,
        requirementMetric: Metric.MINUTES,
        points: 120,
    },
    {
        name: 'Running Milestone: 1 km',
        activityType: ActivityType.RUNNING,
        requirement: 1,
        requirementMetric: Metric.KILOMETERS,
        points: 15,
    },
    {
        name: 'Running Milestone: 5 km',
        activityType: ActivityType.RUNNING,
        requirement: 5,
        requirementMetric: Metric.KILOMETERS,
        points: 50,
    },
    {
        name: 'Running Milestone: 10 km',
        activityType: ActivityType.RUNNING,
        requirement: 10,
        requirementMetric: Metric.KILOMETERS,
        points: 100,
    },
    {
        name: 'Running Milestone: 21 km (half marathon)',
        activityType: ActivityType.RUNNING,
        requirement: 21,
        requirementMetric: Metric.KILOMETERS,
        points: 250,
    },
    {
        name: 'Running Milestone: 42 km (marathon)',
        activityType: ActivityType.RUNNING,
        requirement: 42,
        requirementMetric: Metric.KILOMETERS,
        points: 500,
    },
    {
        name: 'Running Milestone: 30 min',
        activityType: ActivityType.RUNNING,
        requirement: 30,
        requirementMetric: Metric.MINUTES,
        points: 25,
    },
    {
        name: 'Running Milestone: 1 hour',
        activityType: ActivityType.RUNNING,
        requirement: 60,
        requirementMetric: Metric.MINUTES,
        points: 60,
    },
    {
        name: 'Running Milestone: 100 km',
        activityType: ActivityType.RUNNING,
        requirement: 100,
        requirementMetric: Metric.KILOMETERS,
        points: 700,
    },
    {
        name: 'Running Milestone: 200 km',
        activityType: ActivityType.RUNNING,
        requirement: 200,
        requirementMetric: Metric.KILOMETERS,
        points: 1200,
    },
    {
        name: 'Walking Milestone: 5000 steps',
        activityType: ActivityType.WALKING,
        requirement: 5000,
        requirementMetric: Metric.STEPS,
        points: 20,
    },
    {
        name: 'Walking Milestone: 10,000 steps',
        activityType: ActivityType.WALKING,
        requirement: 10_000,
        requirementMetric: Metric.STEPS,
        points: 40,
    },
    {
        name: 'Walking Milestone: 15,000 steps',
        activityType: ActivityType.WALKING,
        requirement: 15_000,
        requirementMetric: Metric.STEPS,
        points: 70,
    },
    {
        name: 'Walking Milestone: 20,000 steps',
        activityType: ActivityType.WALKING,
        requirement: 20_000,
        requirementMetric: Metric.STEPS,
        points: 100,
    },
    {
        name: 'Walking Milestone: 10 km',
        activityType: ActivityType.WALKING,
        requirement: 10,
        requirementMetric: Metric.KILOMETERS,
        points: 50,
    },
    {
        name: 'Walking Milestone: 20 km',
        activityType: ActivityType.WALKING,
        requirement: 20,
        requirementMetric: Metric.KILOMETERS,
        points: 100,
    },
    {
        name: 'Walking Milestone: 50 km',
        activityType: ActivityType.WALKING,
        requirement: 50,
        requirementMetric: Metric.KILOMETERS,
        points: 250,
    },
    {
        name: 'Walking Milestone: 100 km',
        activityType: ActivityType.WALKING,
        requirement: 100,
        requirementMetric: Metric.KILOMETERS,
        points: 500,
    },
    {
        name: 'Walking Milestone: 100 kcal burned',
        activityType: ActivityType.WALKING,
        requirement: 100,
        requirementMetric: Metric.KILOCALORIES,
        points: 15,
    },
    {
        name: 'Walking Milestone: 300 kcal burned',
        activityType: ActivityType.WALKING,
        requirement: 300,
        requirementMetric: Metric.KILOCALORIES,
        points: 40,
    },
    {
        name: 'Walking Milestone: 1000 kcal burned',
        activityType: ActivityType.WALKING,
        requirement: 1000,
        requirementMetric: Metric.KILOCALORIES,
        points: 120,
    },
];

async function seed(knex: Knex): Promise<void> {
    await knex.transaction(async (trx) => {
        await trx('achievements').del();

        await trx('achievements').insert([...Achievements]);
    });
}

export { seed };
