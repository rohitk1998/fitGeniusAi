import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const ANSWERS_KEY = 'fitaura_onboarding';
const DONE_KEY = 'fitaura_onboarding_complete';

function loadAnswers(): Record<string, string> {
    try {
        const raw = localStorage.getItem(ANSWERS_KEY);
        return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
        return {};
    }
}

function loadIsDone(): boolean {
    try {
        return localStorage.getItem(DONE_KEY) === 'true';
    } catch {
        return false;
    }
}

interface OnboardingState {
    answers: Record<string, string>;
    currentStep: number;
    isDone: boolean;
}

const initialState: OnboardingState = {
    answers: loadAnswers(),
    currentStep: 0,
    isDone: loadIsDone(),
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setAnswer(state, action: PayloadAction<{ id: string; value: string }>) {
            state.answers[action.payload.id] = action.payload.value;
            try {
                localStorage.setItem(ANSWERS_KEY, JSON.stringify(state.answers));
            } catch { }
        },
        setStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        markDone(state) {
            state.isDone = true;
            try {
                localStorage.setItem(DONE_KEY, 'true');
            } catch { }
        },
        resetOnboarding(state) {
            state.answers = {};
            state.currentStep = 0;
            state.isDone = false;
            try {
                localStorage.removeItem(ANSWERS_KEY);
                localStorage.removeItem(DONE_KEY);
            } catch { }
        },
    },
});

export const { setAnswer, setStep, markDone, resetOnboarding } =
    onboardingSlice.actions;

export default onboardingSlice.reducer;
