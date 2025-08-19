import { gameState } from './main.js';
import { updateUI } from './ui/index.js';
import { eventLibrary } from './events.js';
import { applyStatBounds } from './app-data.js';
import { simulateGame } from './hockey-sim.js';

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
    },
    // New: Weather-based
    {
        id: 'weather_event',
        condition: (date) => true, // Always check
        chance: 0.05
    }
];

// Advance game time by MINUTES_PER_TICK
function advanceTime() {
    gameState.gameDate.setMinutes(gameState.gameDate.getMinutes() + MINUTES_PER_TICK);
    
    // Check for calendar events
    checkCalendarEvents();

    // New: Semester/year progression
    const month = gameState.gameDate.getMonth();
    if (month === 11 && gameState.gameDate.getDate() === 15) gameState.semester = 'Winter'; // Fall to Winter
    if (month === 3 && gameState.gameDate.getDate() === 1) gameState.semester = 'Spring'; // Winter to Spring
    if (month === 5 && gameState.gameDate.getDate() === 15) { 
        gameState.semester = 'Summer'; // End year
        gameState.gameDate.setFullYear(gameState.gameDate.getFullYear() + 1); // Advance year
        if (gameState.gameDate.getFullYear() === 2029) endGameDraft(); // Senior year end
    }
    if (month === 8 && gameState.gameDate.getDate() === 1) gameState.semester = 'Fall'; // New year
    
    // New: Battery drain
    gameState.phone.battery = Math.max(0, gameState.phone.battery - 1);
    if (gameState.phone.battery < 20) {
        checkRandomEvent('event_battery_low', 1); // Force trigger
    }
}

// New: Endgame NHL draft
function endGameDraft() {
    const totalPoints = gameState.player.seasonStats.points;
    const draftPosition = Math.max(1, Math.floor(200 - totalPoints / 2)); // Better stats = higher pick
    alert(`Congratulations! You've completed college. NHL Draft: Picked #${draftPosition} overall!`);
    // Optional: End game or start pro mode
}

// Check if there are any calendar events at the current time
function checkCalendarEvents() {
    const currentDate = gameState.gameDate;
    const dateString = currentDate.toISOString().slice(0,10);
    // Find matching events from app-data.js calendarEvents
    import('./app-data.js').then(data => {
        data.calendarEvents.forEach(event => {
            if (event.date === dateString && event.time === currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})) {
                window.dispatchEvent(new CustomEvent('triggerEvent', { detail: { eventId: event.type + '_event' } }));
            }
        });
    });
}

// Update player status on each tick (passive changes)
function updatePlayerStatus() {
    // Passive decay
    gameState.player.status.energy -= 1;
    gameState.player.status.stress += 0.5;
    gameState.player.status.nutrition -= 0.5;
    
    // Apply bounds and debuffs
    applyStatBounds(gameState);
    
    // Random chance for events
    if (Math.random() < RANDOM_EVENT_CHANCE) {
        const eventTypes = ['social', 'academic', 'hockey', 'personal'];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        checkRandomEvent(randomType);
    }
    
    // Check time-based events
    timeBasedEvents.forEach(tbEvent => {
        if (tbEvent.condition(gameState.gameDate) && Math.random() < tbEvent.chance) {
            checkRandomEvent(tbEvent.id);
        }
    });
    
    // New: Weather influence
    if (gameState.semester === 'Winter' && Math.random() < 0.1) {
        checkRandomEvent('event_weather_delay');
    }
}

// Check if a specific random event should trigger
function checkRandomEvent(eventType, forcedChance = null) {
    // Use forced chance if provided, otherwise use default logic
    const chance = forcedChance !== null ? forcedChance : 0.5;
    
    // Only proceed if random check passes
    if (Math.random() > chance) return;
    
    // Map of event types to potential event IDs (expanded with new)
    const eventMap = {
        'social': ['event_party_invite', 'event_teammate_conflict', 'event_dating_app_match', 'event_group_chat'],
        'academic': ['event_study_group', 'event_missed_assignment', 'event_professor_meeting', 'event_prof_email'],
        'hockey': ['event_extra_practice', 'event_coach_feedback', 'event_team_bonding', 'event_mini_game_practice'],
        'personal': ['event_homesick', 'event_health_issue', 'event_financial_problem', 'event_shopping_trip'],
        'team_practice': ['event_team_practice_good', 'event_team_practice_bad'],
        'class_event': ['event_class_question', 'event_class_group_project'],
        'morning_class': ['event_oversleep', 'event_class_pop_quiz'],
        'weekend_party': ['event_party_invite', 'event_party_drama'],
        'event_weather_delay': ['event_snow_delay', 'event_rainy_day'],
        'event_battery_low': ['event_battery_low']
    };
    
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