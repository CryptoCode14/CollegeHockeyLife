import { initializeMap } from './map.js';
import { updateUI, showEvent, initializeAllUI } from './ui/index.js';
import { startGameLoop } from './game-loop.js';
import { socialFeedPosts, datingProfiles } from './app-data.js';
import { generateSocialPosts } from './social-data.js';
import { renderMessages } from './phone-messages.js';
import { renderApps } from './phone-apps.js';
import { initializeNPCs } from './npc-logic.js';

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
            health: 90,
            injury: 0,
            nutrition: 100,
            mentalHealth: 100
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
        money: 500 // New: Starting money for economy
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
                    timestamp: new Date('2025-08-17T14:30:00'),
                    read: true // New: Track read status for notifications
                }
            ] 
        },
        mom: { 
            messages: [
                { 
                    sender: "mom", 
                    text: "Did you finish unpacking? Don't forget to eat!", 
                    timestamp: new Date('2025-08-17T18:15:00'),
                    read: true
                }
            ] 
        },
        teammate_jake: { 
            messages: [
                { 
                    sender: "teammate_jake", 
                    text: "Hey man, welcome to the team.", 
                    timestamp: new Date('2025-08-17T20:45:00'),
                    read: false // Unread for badge
                }
            ] 
        },
        teammate_tyler: { 
            messages: [] 
        },
        professor_miller: { 
            messages: [] 
        },
        sarah: { 
            messages: [] 
        },
        // New: Group chat example
        team_group: { 
            messages: [] 
        }
    },
    phone: {
        installedApps: ['messages', 'chirper', 'rinkrater', 'calendar', 'fitness', 'news', 'weather', 'notes', 'shop'], // Added shop, weather, notes
        theme: 'dark',
        social: {
            posts: socialFeedPosts,
            myPosts: []
        },
        dating: {
            profiles: datingProfiles,
            matches: [],
            currentIndex: 0
        },
        fitness: {
            currentSteps: 0,
            dailyGoal: 10000,
            workouts: [
                { type: 'Hockey Practice', duration: 90, calories: 650, date: new Date('2025-08-17T15:00:00') },
                { type: 'Weight Training', duration: 45, calories: 320, date: new Date('2025-08-16T10:30:00') }
            ]
        },
        news: [], // New: For phone news tab
        battery: 100, // Battery simulation
        notes: [], // New: Player notes
        shop: { // New: Shop items
            items: [
                { id: 'stick', name: 'New Hockey Stick', price: 100, effect: { shooting: 5 } },
                { id: 'skates', name: 'Speed Skates', price: 150, effect: { skating: 5 } },
                { id: 'protein', name: 'Protein Shake', price: 20, effect: { nutrition: 10 } }
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
    },
    semester: 'Fall' // New
};

// Enhanced message function with timestamp and read status
export function addMessage(contactId, sender, messageText, timestamp = null) {
    if (!gameState.conversations[contactId]) {
        gameState.conversations[contactId] = { messages: [] };
    }
    
    const newMessage = {
        sender: sender,
        text: messageText,
        timestamp: timestamp || new Date(),
        read: sender === 'player' // Player messages are read by default
    };
    
    gameState.conversations[contactId].messages.push(newMessage);
    
    if (sender !== 'player') {
        gameState.notifications++;
    }
}

// Get unread count for app badges
export function getUnreadCount(contactId = null) {
    if (contactId) {
        return gameState.conversations[contactId].messages.filter(m => !m.read).length;
    }
    // Total for messages app
    return Object.values(gameState.conversations).reduce((total, conv) => {
        return total + conv.messages.filter(m => !m.read).length;
    }, 0);
}

// Save game state to localStorage
export function saveGame() {
    try {
        const saveData = {
            player: gameState.player,
            relationships: gameState.relationships,
            progress: gameState.progress,
            gameDate: gameState.gameDate.toISOString(),
            phone: gameState.phone,
            semester: gameState.semester,
            conversations: gameState.conversations // Added for read status
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
        gameState.phone = saveData.phone;
        gameState.semester = saveData.semester;
        gameState.conversations = saveData.conversations;
        
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
    
    // Initialize NPCs
    initializeNPCs();
    
    // Start game loop
    startGameLoop();
    
    // Show welcome event
    showEvent('event_welcome');

    // New: Generate initial dynamic content
    generateSocialPosts();
}

document.addEventListener('DOMContentLoaded', initializeGame);