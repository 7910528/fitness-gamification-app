const NUMBER_OF_LEVELS = 20;
const BASE_INCREMENT = 100;
const INCREMENT_STEP = 50;

const generateLevels = (): { level: number; requiredPoints: number }[] => {
    const levels: { level: number; requiredPoints: number }[] = [];
    let requiredPoints = 0;

    for (let level = 1; level <= NUMBER_OF_LEVELS; level++) {
        levels.push({ level, requiredPoints });
        const increment = BASE_INCREMENT + INCREMENT_STEP * (level - 1);
        requiredPoints += increment;
    }

    return levels;
};

const levels = generateLevels();

export { levels };
