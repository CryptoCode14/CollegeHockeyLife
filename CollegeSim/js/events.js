export const eventLibrary = {
    'event_welcome': {
        title: "First Day on Campus",
        text: "It's the first week before the season starts. You have some free time this morning. What's the plan?",
        choices: [
            { text: "Go to the rink for an extra workout.", nextEvent: 'event_afternoon_free', action: (gameState) => {
                gameState.player.attributes.skating += 1;
                gameState.player.status.stress += 5;
            }},
            { text: "Introduce yourself to some teammates in the lounge.", nextEvent: 'event_afternoon_free', action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.notifications++; // Simplified notification add
            }},
        ]
    },
    'event_afternoon_free': {
        title: "Afternoon Skate",
        text: "It's now afternoon. The coach mentioned an optional team skate later.",
        choices: [
            { text: "Definitely going. I need to make a good impression.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.notifications++;
            }},
            { text: "I'll skip it and explore the campus instead.", action: (gameState) => {
                gameState.player.status.stress -= 5;
            }},
        ]
    },
    'event_extra_practice': {
        title: "Matthews Arena",
        text: "You decided to get some extra work in at the rink. What do you want to focus on?",
        choices: [
            { text: "Work on skating drills.", action: (gameState) => {
                gameState.player.attributes.skating += 1;
                gameState.player.status.stress += 5;
                gameState.notifications++;
            }},
            { text: "Take shots on the empty net.", action: (gameState) => {
                gameState.player.attributes.shooting += 1;
                gameState.player.status.stress += 5;
                gameState.notifications++;
            }},
        ]
    },

// Add this new event to your eventLibrary object in js/events.js
    'event_library_study': {
        title: "Pattee Library",
        text: "You head to the library to get some studying done. It's quiet here.",
        choices: [
            { text: "Review class notes for 2 hours.", action: (gameState) => {
            // In the future, this would improve your GPA
            gameState.player.status.stress -= 5;
            gameState.notifications++;
        }},
            { text: "Just browse the web and relax.", action: (gameState) => {
            gameState.player.status.stress -= 10;
        }},
    ]
}



};