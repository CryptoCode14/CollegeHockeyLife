import { gameState } from './main.js';

export function simulatePractice(focus) {
    // Mini-game logic: Success based on attributes
    const baseSuccess = gameState.player.attributes[focus] / 100;
    const success = Math.random() < baseSuccess;
    if (success) {
        gameState.player.attributes[focus] += 2;
        gameState.player.status.happiness += 5;
    } else {
        gameState.player.status.injury += 5; // Risk
        gameState.player.status.stress += 10;
    }
    // Random injury risk
    if (Math.random() < 0.1) gameState.player.status.injury += 20;
}

export function simulateGame() {
    // Full game sim: Generate stats
    const goals = Math.floor(Math.random() * (gameState.player.attributes.shooting / 20));
    const assists = Math.floor(Math.random() * (gameState.player.attributes.puckHandling / 30));
    gameState.player.seasonStats.goals += goals;
    gameState.player.seasonStats.assists += assists;
    gameState.player.seasonStats.points += goals + assists;
    gameState.player.seasonStats.gamesPlayed += 1;
    gameState.player.status.energy -= 30;
    // Win/loss random, affect reputation
    const win = Math.random() < 0.6;
    if (win) gameState.player.status.reputation += 10;
    else gameState.player.status.reputation -= 5;
}