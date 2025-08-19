import { gameState } from './main.js';
import { simulatePractice } from './hockey-sim.js';

export function renderApps(app) {
    if (app === 'fitness') {
        return `
            <div>Daily Steps: ${gameState.phone.fitness.currentSteps}/${gameState.phone.fitness.dailyGoal}</div>
            <button onclick="trackWorkout()">Workout</button>
        `;
    } else if (app === 'study') {
        return `
            <button onclick="studyBoost()">Study Session</button>
        `;
    }
}

window.trackWorkout = () => { 
    simulatePractice('strength'); 
    gameState.phone.fitness.currentSteps += 2000;
    gameState.player.status.nutrition -= 10; 
};

window.studyBoost = () => { 
    gameState.player.status.gpa += 0.1; 
    gameState.player.status.stress += 5; 
};