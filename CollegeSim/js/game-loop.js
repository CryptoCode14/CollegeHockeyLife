import { gameState } from './main.js';
import { updateUI } from './ui/index.js';
import { eventLibrary } from './events.js';

const GAME_TICK_INTERVAL = 2000; // 2 seconds per tick
const MINUTES_PER_TICK = 15; // Each tick advances the game time by 15 minutes

// Random event chance per tick (1% chance by default)
const RANDOM_EVENT_CHANCE = 0.01;

// Time-based events that can trigger at specific times
const timeBasedEvents = [
    {
        id: 'morning_class',
        condition: (date) => {
            const hours = date.getHours();
            const day = date.getDay();
            // Weekday mornings between 8-11am
            return day >= 1 && day <= 5 && hours >= 8 && hours <= 11;
        },
        chance: 0.1 // 10% chance when condition is met
    },
    {
        id: 'team_practice',
        condition: (date) => {
            const hours = date.getHours();
            const day = date.getDay();
            // Afternoon practice on weekdays between 2-5pm
            return day >= 1 && day <= 5 && hours >= 14 && hours <= 17;
        },
        chance: 0.15 // 15% chance when condition is met
    },
    {
        id: 'weekend_party',
        condition: (date) => {
            const hours = date.getHours();
            const day = date.getDay();
            // Weekend nights (Friday/Saturday) between 8pm-1am
            return (day === 5 || day === 6) && (hours >= 20 || hours <= 1);
        },
        chance: 0.2 // 20% chance when condition is met
    }
];

// Advance game time by MINUTES_PER_TICK
function advanceTime() {
    gameState.gameDate.setMinutes(gameState.gameDate.getMinutes() + MINUTES_PER_TICK);
    
    // Check for calendar events
    checkCalendarEvents();
}

// Check if there are any calendar events at the current time
function checkCalendarEvents() {
    const currentDate = gameState.gameDate;
    const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    
    // Check each calendar event
    gameState.phone.calendar.events.forEach(event => {
        if (event.date === dateString) {
            // Parse event time (format: "HH:MM")
            const [eventHour, eventMinute] = event.time.split(':').map(Number);
            
            // Check if the event is happening now (within the current tick)
            const prevTime = new Date(currentDate);
            prevTime.setMinutes(prevTime.getMinutes() - MINUTES_PER_TICK);
            const prevHour = prevTime.getHours();
            const prevMinute = prevTime.getMinutes();
            
            // Event starts in this tick if the previous time was before event time and current time is at or after
            const eventStartsNow = 
                (prevHour < eventHour || (prevHour === eventHour && prevMinute < eventMinute)) &&
                (currentHour > eventHour || (currentHour === eventHour && currentMinute >= eventMinute));
            
            if (eventStartsNow) {
                // Trigger notification for event
                gameState.notifications++;
                
                // Map calendar events to game events if applicable
                if (event.title.includes('Practice')) {
                    // Could trigger a practice event
                    checkRandomEvent('team_practice', 0.8); // 80% chance to trigger practice event
                } else if (event.title.includes('ECON') || event.title.includes('PSYCH')) {
                    // Could trigger a class event
                    checkRandomEvent('class_event', 0.7); // 70% chance to trigger class event
                }
            }
        }
    });
}

// Update player status based on time and activities
function updatePlayerStatus() {
    // Slowly recover energy if not exhausted
    if (gameState.player.status.energy < 100) {
        gameState.player.status.energy += 1;
    }
    
    // Stress increases slightly during the day and decreases at night
    const currentHour = gameState.gameDate.getHours();
    if (currentHour >= 8 && currentHour <= 18) {
        // Daytime: slight stress increase
        gameState.player.status.stress += 0.2;
    } else if (currentHour >= 22 || currentHour <= 6) {
        // Nighttime: stress recovery
        gameState.player.status.stress -= 0.5;
    }
    
    // Happiness decreases slightly over time if not maintained
    gameState.player.status.happiness -= 0.1;
    
    // Health fluctuates based on energy and stress
    if (gameState.player.status.energy < 30 || gameState.player.status.stress > 80) {
        gameState.player.status.health -= 0.3;
    } else if (gameState.player.status.energy > 70 && gameState.player.status.stress < 30) {
        gameState.player.status.health += 0.2;
    }

    // Clamp values to be within 0-100 range (except GPA)
    gameState.player.status.energy = Math.max(0, Math.min(100, gameState.player.status.energy));
    gameState.player.status.stress = Math.max(0, Math.min(100, gameState.player.status.stress));
    gameState.player.status.reputation = Math.max(0, Math.min(100, gameState.player.status.reputation));
    gameState.player.status.happiness = Math.max(0, Math.min(100, gameState.player.status.happiness));
    gameState.player.status.health = Math.max(0, Math.min(100, gameState.player.status.health));

    // Clamp relationship values
    for (let rel in gameState.relationships) {
        gameState.relationships[rel].level = Math.max(0, Math.min(100, gameState.relationships[rel].level));
    }
    
    // Check for random events
    checkRandomEvents();
}

// Check for random events based on time and conditions
function checkRandomEvents() {
    // Base chance for a random event
    if (Math.random() < RANDOM_EVENT_CHANCE) {
        // Determine which type of random event to trigger
        const eventTypes = ['social', 'academic', 'hockey', 'personal'];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        // Trigger a random event of the selected type
        checkRandomEvent(randomType);
    }
    
    // Check time-based events
    timeBasedEvents.forEach(event => {
        if (event.condition(gameState.gameDate) && Math.random() < event.chance) {
            checkRandomEvent(event.id);
        }
    });
}

// Check if a specific random event should trigger
function checkRandomEvent(eventType, forcedChance = null) {
    // Use forced chance if provided, otherwise use default logic
    const chance = forcedChance !== null ? forcedChance : 0.5;
    
    // Only proceed if random check passes
    if (Math.random() > chance) return;
    
    // Map of event types to potential event IDs
    const eventMap = {
        'social': ['event_party_invite', 'event_teammate_conflict', 'event_dating_app_match'],
        'academic': ['event_study_group', 'event_missed_assignment', 'event_professor_meeting'],
        'hockey': ['event_extra_practice', 'event_coach_feedback', 'event_team_bonding'],
        'personal': ['event_homesick', 'event_health_issue', 'event_financial_problem'],
        'team_practice': ['event_team_practice_good', 'event_team_practice_bad'],
        'class_event': ['event_class_question', 'event_class_group_project'],
        'morning_class': ['event_oversleep', 'event_class_pop_quiz'],
        'weekend_party': ['event_party_invite', 'event_party_drama']
    };
    
    // Get potential events for this type
    const potentialEvents = eventMap[eventType] || [];
    
    if (potentialEvents.length > 0) {
        // Select a random event from the potential events
        const eventId = potentialEvents[Math.floor(Math.random() * potentialEvents.length)];
        
        // Check if this event exists in the event library
        if (eventLibrary[eventId]) {
            // Check if we've already completed this event recently
            const recentlyCompleted = gameState.progress.eventsCompleted.includes(eventId);
            
            // Only trigger if not recently completed
            if (!recentlyCompleted) {
                // Queue this event to be shown on the next UI update
                window.setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('triggerEvent', { detail: { eventId } }));
                }, 500);
                
                // Add to completed events
                gameState.progress.eventsCompleted.push(eventId);
                
                // Keep only the last 10 completed events
                if (gameState.progress.eventsCompleted.length > 10) {
                    gameState.progress.eventsCompleted.shift();
                }
            }
        }
    }
}

// Main game tick function
function gameTick() {
    advanceTime();
    updatePlayerStatus();
    updateUI();
}

// Start the game loop
export function startGameLoop() {
    // Initial UI update
    updateUI();
    
    // Set up event listener for triggered events
    window.addEventListener('triggerEvent', (e) => {
        const { eventId } = e.detail;
        if (eventId && eventLibrary[eventId]) {
            // Show the event in the UI
            import('./ui/index.js').then(ui => {
                ui.showEvent(eventId);
            });
        }
    });
    
    // Start the interval
    setInterval(gameTick, GAME_TICK_INTERVAL);
}