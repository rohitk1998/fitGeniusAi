import {
    GoalType,
    ActivityLevel,
    Gender,
    ExperienceLevel,
    type UserProfile,
} from '../types';

type AnswerMap = Record<string, string>;

/** Convert onboarding localStorage answers → UserProfile for generateFitnessPlan */
export function mapOnboardingToProfile(answers: AnswerMap): UserProfile {
    // --- Goal ---
    const lookingFor = answers.lookingFor ?? '';
    let goal: GoalType = GoalType.LOSE_WEIGHT;
    if (lookingFor.toLowerCase().includes('muscle')) goal = GoalType.GAIN_MUSCLE;
    else if (lookingFor.toLowerCase().includes('recomp')) goal = GoalType.RECOMP;
    else if (lookingFor.toLowerCase().includes('stamina') || lookingFor.toLowerCase().includes('athletic')) goal = GoalType.STAMINA;

    // --- Timeline ---
    const timeline = answers.goalPace ?? '12 weeks';

    // --- Quantifiable target ---
    const currentWeight = parseFloat(answers.currentWeight ?? '70');
    const targetWeight = parseFloat(answers.targetWeight ?? '65');
    const diff = Math.abs(currentWeight - targetWeight);
    const direction = targetWeight < currentWeight ? 'Lose' : 'Gain';
    const quantifiableTarget = `${direction} ${diff}kg`;

    // --- Biometrics ---
    const age = parseInt(answers.age ?? '25', 10);

    let gender: Gender = Gender.OTHER;
    if (answers.biologicalSex === 'Male') gender = Gender.MALE;
    else if (answers.biologicalSex === 'Female') gender = Gender.FEMALE;

    // Height: stored as "5ft 10in" → convert to cm
    let heightCm = 170;
    const heightMatch = (answers.height ?? '').match(/(\d+)ft\s*(\d+)in/);
    if (heightMatch) {
        const feet = parseInt(heightMatch[1], 10);
        const inches = parseInt(heightMatch[2], 10);
        heightCm = Math.round((feet * 30.48) + (inches * 2.54));
    }

    const weight = currentWeight;
    const dietaryRestrictions = answers.dietaryNotes === 'None' ? 'None' : (answers.dietaryNotes ?? 'None');

    // --- Fitness ---
    const experience: ExperienceLevel = ExperienceLevel.BEGINNER;

    // --- Activity level ---
    const rawActivity = answers.activityLevel ?? '';
    let activityLevel: ActivityLevel = ActivityLevel.SEDENTARY;
    if (rawActivity.includes('Light')) activityLevel = ActivityLevel.LIGHT;
    else if (rawActivity.includes('Moderate')) activityLevel = ActivityLevel.MODERATE;
    else if (rawActivity.includes('Active')) activityLevel = ActivityLevel.HIGH;
    else if (rawActivity.includes('Very active') || rawActivity.includes('athlete')) activityLevel = ActivityLevel.ATHLETE;

    return {
        // Goals
        goal,
        timeline,
        quantifiableTarget,

        // Profile
        age: isNaN(age) ? 25 : age,
        gender,
        height: heightCm,
        weight: isNaN(currentWeight) ? 70 : currentWeight,
        bodyFat: 'N/A',
        dietaryRestrictions,
        medicalConditions: 'None',

        // Fitness
        experience,
        frequency: 4,
        equipment: 'Gym',
        workoutSplit: 'Full Body',
        cardioPreference: 'Moderate cardio',

        // Lifestyle
        activityLevel,
        sleepHours: 7,
        stressLevel: 'Medium',
        minutesPerSession: 60,
        mealPrepStyle: 'Flexible',
        cuisinePreference: 'Any',
    };
}
