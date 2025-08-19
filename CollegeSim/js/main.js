import { initializeMap } from './map.js';
import { updateUI, showEvent, initializeAllUI } from './ui/index.js';
import { startGameLoop } from './game-loop.js';
import { socialFeedPosts, datingProfiles } from './app-data.js';

export let gameState = {
    player: {
        name: "Alex Johnson",
        position: "Forward",
        attributes: { 
            skating: 65, 
            shooting: 70, 
            puckHandling: 68, 
            checking: 60, 
            defense: 55,
            strength: 62,
            speed: 72,
            stamina: 68,
            agility: 70,
            awareness: 65
        },
        status: { 
            energy: 100, 
            stress: 10, 
            reputation: 50, 
            gpa: 3.0,
            happiness: 75,
            health: 90
        },
        seasonStats: { 
            gamesPlayed: 0, 
            goals: 0, 
            assists: 0,
            points: 0,
            plusMinus: 0,
            penaltyMinutes: 0,
            shotsTaken: 0,
            timeOnIce: 0
        },
    },
    gameDate: new Date('2025-08-18T08:00:00'),
    notifications: 0,
    mapInitialized: false,
    relationships: {
        coach: { name: "Coach Davis", level: 50, avatarColor: "#34495e" },
        mom: { name: "Mom", level: 80, avatarColor: "#e74c3c" },
        teammate_jake: { name: "Jake", level: 40, avatarColor: "#27ae60" },
        teammate_tyler: { name: "Tyler", level: 30, avatarColor: "#8e44ad" },
        professor_miller: { name: "Prof. Miller", level: 45, avatarColor: "#2c3e50" },
        sarah: { name: "Sarah", level: 20, avatarColor: "#e84393" }
    },
    conversations: {
        coach: { 
            messages: [
                { 
                    sender: "coach", 
                    text: "Welcome to Penn State. See you at camp.", 
                    timestamp: new Date('2025-08-17T14:30:00')
                }
            ] 
        },
        mom: { 
            messages: [
                { 
                    sender: "mom", 
                    text: "Did you finish unpacking? Don't forget to eat!", 
                    timestamp: new Date('2025-08-17T18:15:00')
                }
            ] 
        },
        teammate_jake: { 
            messages: [
                { 
                    sender: "teammate_jake", 
                    text: "Hey man, welcome to the team.", 
                    timestamp: new Date('2025-08-17T20:45:00')
                }
            ] 
        },
        teammate_tyler: { 
            messages: [
                { 
                    sender: "teammate_tyler", 
                    text: "Yo, I'm having a party this weekend. You should come.", 
                    timestamp: new Date('2025-08-18T09:20:00')
                }
            ] 
        },
        professor_miller: { 
            messages: [
                { 
                    sender: "professor_miller", 
                    text: "Welcome to ECON 101. Please review the syllabus before our first class.", 
                    timestamp: new Date('2025-08-17T11:00:00')
                }
            ] 
        },
        sarah: { 
            messages: [] // Empty conversation to start
        }
    },
    // Enhanced phone state
    phone: {
        theme: 'dark', // 'light' or 'dark'
        wallpaper: 'default', // Corresponds to a CSS class
        installedApps: ['messages', 'settings', 'appstore', 'chirper', 'rinkrater'],
        appStore: {
            available: ['calendar', 'camera', 'notes', 'maps', 'weather', 'fitness'],
        },
        dating: {
            profiles: datingProfiles,
            currentIndex: 0,
            matches: [],
            conversations: {}
        },
        social: {
            posts: socialFeedPosts,
            userHandle: 'ajohnson_88',
            followers: 124,
            following: 87,
            myPosts: []
        },
        calendar: {
            events: [
                { date: '2025-08-19', time: '09:00', title: 'ECON 101', location: 'Business Building 302' },
                { date: '2025-08-19', time: '14:00', title: 'Team Practice', location: 'Pegula Ice Arena' },
                { date: '2025-08-20', time: '11:00', title: 'PSYCH 100', location: 'Moore Building 113' },
                { date: '2025-08-21', time: '09:30', title: 'Team Workout', location: 'Athletics Complex' },
                { date: '2025-08-22', time: '15:30', title: 'Study Group', location: 'Pattee Library' }
            ]
        },
        notes: [
            {
                title: 'Hockey Practice Notes',
                content: 'Work on power play positioning. Coach wants me to shoot more from the slot.',
                date: new Date('2025-08-17T16:30:00')
            },
            {
                title: 'ECON 101 Syllabus',
                content: 'Midterm: Oct 15\nFinal: Dec 10\nTextbook: Principles of Economics, 8th Ed.',
                date: new Date('2025-08-17T20:15:00')
            }
        ],
        fitness: {
            dailyGoal: 10000,
            currentSteps: 7245,
            workouts: [
                { type: 'Hockey Practice', duration: 90, calories: 650, date: new Date('2025-08-17T15:00:00') },
                { type: 'Weight Training', duration: 45, calories: 320, date: new Date('2025-08-16T10:30:00') }
            ]
        }
    },
    // Game progress tracking
    progress: {
        eventsCompleted: [],
        achievementsUnlocked: [],
        skillPointsAvailable: 0,
        storylineProgress: 0,
        gameWeek: 1,
        seasonPhase: 'preseason' // preseason, regular, playoffs, offseason
    }
};

// Enhanced message function with timestamp support
export function addMessage(contactId, sender, messageText, timestamp = null) {
    if (!gameState.conversations[contactId]) {
        // Create conversation if it doesn't exist
        gameState.conversations[contactId] = { messages: [] };
    }
    
    gameState.conversations[contactId].messages.push({
        sender: sender,
        text: messageText,
        timestamp: timestamp || new Date()
    });
}

// Save game state to localStorage
export function saveGame() {
    try {
        const saveData = {
            player: gameState.player,
            relationships: gameState.relationships,
            progress: gameState.progress,
            gameDate: gameState.gameDate.toISOString(),
            // Don't save everything to keep save file smaller
        };
        localStorage.setItem('collegeHockeyLifeSave', JSON.stringify(saveData));
        return true;
    } catch (error) {
        console.error('Error saving game:', error);
        return false;
    }
}

// Load game state from localStorage
export function loadGame() {
    try {
        const saveData = JSON.parse(localStorage.getItem('collegeHockeyLifeSave'));
        if (!saveData) return false;
        
        // Restore saved data
        gameState.player = saveData.player;
        gameState.relationships = saveData.relationships;
        gameState.progress = saveData.progress;
        gameState.gameDate = new Date(saveData.gameDate);
        
        updateUI();
        return true;
    } catch (error) {
        console.error('Error loading game:', error);
        return false;
    }
}

function initializeGame() {
    // Initialize all UI components
    initializeAllUI();
    
    // Initialize map
    initializeMap(gameState);
    
    // Start game loop
    startGameLoop();
    
    // Show welcome event
    showEvent('event_welcome');
}

document.addEventListener('DOMContentLoaded', initializeGame);