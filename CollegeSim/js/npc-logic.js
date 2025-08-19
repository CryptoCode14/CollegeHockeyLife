// js/npc-logic.js - Enhanced NPC interaction system
import { gameState } from './main.js';

// NPC personality traits and conversation styles
const npcPersonalities = {
    coach: {
        traits: {
            seriousness: 0.8,      // 0-1 scale, higher = more serious
            patience: 0.5,         // 0-1 scale, higher = more patient
            supportiveness: 0.6,   // 0-1 scale, higher = more supportive
            strictness: 0.7        // 0-1 scale, higher = more strict
        },
        topics: {
            hockey: 0.9,           // Interest level in topics (0-1)
            academics: 0.6,
            personal: 0.3,
            social: 0.2
        },
        vocabulary: {
            formal: true,
            usesJargon: true,
            shortResponses: true
        },
        contextMemory: []          // Stores recent conversation context
    },
    mom: {
        traits: {
            seriousness: 0.4,
            patience: 0.9,
            supportiveness: 0.95,
            strictness: 0.5
        },
        topics: {
            hockey: 0.5,
            academics: 0.8,
            personal: 0.9,
            social: 0.7
        },
        vocabulary: {
            formal: false,
            usesJargon: false,
            shortResponses: false
        },
        contextMemory: []
    },
    teammate_jake: {
        traits: {
            seriousness: 0.3,
            patience: 0.6,
            supportiveness: 0.7,
            strictness: 0.2
        },
        topics: {
            hockey: 0.8,
            academics: 0.4,
            personal: 0.6,
            social: 0.9
        },
        vocabulary: {
            formal: false,
            usesJargon: true,
            shortResponses: true
        },
        contextMemory: []
    },
    teammate_tyler: {
        traits: {
            seriousness: 0.2,
            patience: 0.4,
            supportiveness: 0.5,
            strictness: 0.1
        },
        topics: {
            hockey: 0.7,
            academics: 0.3,
            personal: 0.5,
            social: 0.95
        },
        vocabulary: {
            formal: false,
            usesJargon: false,
            shortResponses: true
        },
        contextMemory: []
    },
    professor_miller: {
        traits: {
            seriousness: 0.9,
            patience: 0.7,
            supportiveness: 0.5,
            strictness: 0.8
        },
        topics: {
            hockey: 0.2,
            academics: 0.95,
            personal: 0.4,
            social: 0.3
        },
        vocabulary: {
            formal: true,
            usesJargon: true,
            shortResponses: false
        },
        contextMemory: []
    },
    sarah: {
        traits: {
            seriousness: 0.4,
            patience: 0.8,
            supportiveness: 0.8,
            strictness: 0.3
        },
        topics: {
            hockey: 0.6,
            academics: 0.5,
            personal: 0.7,
            social: 0.9
        },
        vocabulary: {
            formal: false,
            usesJargon: false,
            shortResponses: false
        },
        contextMemory: []
    }
};

// Topic detection patterns
const topicPatterns = {
    hockey: [
        /hockey|practice|game|coach|team|skate|ice|puck|goal|assist|save|penalty|power play|check|defense|forward/i,
        /pegula|rink|arena|locker room|stick|helmet|pad|jersey|tournament|championship|playoff|season/i
    ],
    academics: [
        /class|study|exam|test|quiz|grade|gpa|professor|lecture|assignment|homework|project|paper|course|major/i,
        /academic|college|university|school|education|learn|library|textbook|note|syllabus|semester|final/i
    ],
    personal: [
        /feel|stress|tired|sleep|rest|health|sick|injury|hurt|pain|energy|mood|emotion|happy|sad|angry|upset/i,
        /family|home|mom|dad|parent|brother|sister|relative|personal|private|secret|worry|concern|problem/i
    ],
    social: [
        /friend|party|hang out|fun|weekend|drink|date|relationship|girl|boy|roommate|dorm|apartment|social/i,
        /event|club|activity|group|meet|introduce|chat|talk|text|message|phone|app|social media|profile/i
    ]
};

// Sentiment analysis function
function analyzeSentiment(message) {
    // Simple sentiment analysis based on keywords
    const positiveWords = [
        'good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'happy', 'thanks', 'thank', 
        'appreciate', 'nice', 'cool', 'fun', 'best', 'better', 'well', 'yes', 'yeah', 'sure'
    ];
    
    const negativeWords = [
        'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 'angry', 'upset', 
        'annoyed', 'frustrated', 'sorry', 'apology', 'mistake', 'wrong', 'no', 'not', 'never'
    ];
    
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'could', 'would', 'will'];
    
    const words = message.toLowerCase().split(/\W+/);
    let positiveCount = 0;
    let negativeCount = 0;
    let isQuestion = false;
    
    // Check for question marks or question words at beginning
    if (message.includes('?') || questionWords.some(qw => message.toLowerCase().startsWith(qw))) {
        isQuestion = true;
    }
    
    // Count positive and negative words
    words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
    });
    
    // Calculate sentiment score (-1 to 1)
    const totalWords = words.length;
    const sentimentScore = totalWords > 0 ? 
        (positiveCount - negativeCount) / Math.min(totalWords, 10) : 0;
    
    return {
        score: sentimentScore,
        isPositive: sentimentScore > 0.1,
        isNegative: sentimentScore < -0.1,
        isNeutral: sentimentScore >= -0.1 && sentimentScore <= 0.1,
        isQuestion: isQuestion
    };
}

// Detect the main topic of a message
function detectTopic(message) {
    const topics = Object.keys(topicPatterns);
    const scores = {};
    
    // Initialize scores
    topics.forEach(topic => {
        scores[topic] = 0;
    });
    
    // Calculate scores for each topic
    topics.forEach(topic => {
        topicPatterns[topic].forEach(pattern => {
            const matches = message.match(pattern);
            if (matches) {
                scores[topic] += matches.length;
            }
        });
    });
    
    // Find the topic with the highest score
    let maxScore = 0;
    let mainTopic = 'general';
    
    for (const [topic, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            mainTopic = topic;
        }
    }
    
    return {
        mainTopic: mainTopic,
        scores: scores
    };
}

// Update NPC's memory with new context
function updateNpcMemory(npcId, playerMessage, npcResponse) {
    if (!npcPersonalities[npcId]) return;
    
    // Add new conversation to memory
    npcPersonalities[npcId].contextMemory.push({
        playerMessage: playerMessage,
        npcResponse: npcResponse,
        timestamp: Date.now(),
        topic: detectTopic(playerMessage).mainTopic,
        sentiment: analyzeSentiment(playerMessage)
    });
    
    // Keep only the last 5 messages for context
    if (npcPersonalities[npcId].contextMemory.length > 5) {
        npcPersonalities[npcId].contextMemory.shift();
    }
}

// Generate contextual response based on personality, topic, sentiment, and memory
function generateContextualResponse(npcId, playerMessage, topic, sentiment) {
    if (!npcPersonalities[npcId]) return null;
    
    const personality = npcPersonalities[npcId];
    const memory = personality.contextMemory;
    
    // Reference recent context if available
    let contextReference = '';
    if (memory.length > 0) {
        const lastMemory = memory[memory.length - 1];
        if (lastMemory.topic === topic.mainTopic) {
            contextReference = `Regarding what you said earlier about ${lastMemory.playerMessage.substring(0, 20)}..., `;
        }
    }
    
    // Base response pool by NPC and topic
    const responsePools = {
        coach: {
            hockey: ['Keep pushing in practice.', 'Focus on defense.', 'Team first always.'],
            academics: ['Grades matter as much as goals.', 'Balance is key.'],
            personal: ['Talk to the trainer if needed.', 'Stay focused.'],
            social: ['Team bonding is good, but not too much.'],
            general: ['What\'s on your mind?']
        },
        mom: {
            hockey: ['Be safe on the ice!', 'Proud of you always.'],
            academics: ['Grades hard, honey.', 'Need help with homework?'],
            personal: ['Are you eating well?', 'Call if you\'re homesick.'],
            social: ['Make good friends.', 'Have fun but be careful.'],
            general: ['How are you feeling?']
        },
        teammate_jake: {
            hockey: ['Let\'s crush practice!', 'Nice shot yesterday.'],
            academics: ['Class sucks, man.', 'Copy your notes?'],
            personal: ['You okay bro?', 'Hit the gym later?'],
            social: ['Party tonight?', 'Met any girls?'],
            general: ['What\'s up?']
        },
        teammate_tyler: {
            hockey: ['Game on Friday?', 'Coach is tough.'],
            academics: ['Skipped class again.', 'Test was easy.'],
            personal: ['Tired AF.', 'Injured my knee.'],
            social: ['Big party!', 'Double date?'],
            general: ['Yo.']
        },
        professor_miller: {
            hockey: ['Sports and studies balance.', 'Missed class for game?'],
            academics: ['Review chapter 3.', 'Office hours tomorrow.'],
            personal: ['Everything okay?', 'Stress management tips.'],
            social: ['Join study group.', 'Campus events.'],
            general: ['Questions?']
        },
        sarah: {
            hockey: ['Come to the game?', 'You scored!'],
            academics: ['Study together?', 'Psych exam hard.'],
            personal: ['Feeling better?', 'Miss you.'],
            social: ['Movie night?', 'Art show Friday.'],
            general: ['Hi!']
        }
    };
    
    // Adjust based on sentiment
    let responsePool = responsePools[npcId]?.[topic.mainTopic] || responsePools[npcId].general;
    if (sentiment.isQuestion) {
        responsePool = responsePool.map(r => `To answer your question, ${r.toLowerCase()}`);
    }
    if (sentiment.isPositive) {
        responsePool = responsePool.map(r => `Glad to hear! ${r}`);
    } else if (sentiment.isNegative) {
        responsePool = responsePool.map(r => `Sorry about that. ${r}`);
    }
    
    // Adjust for personality traits
    if (personality.traits.seriousness > 0.7) {
        responsePool = responsePool.map(r => r.replace(/!/, '.'));
    }
    if (personality.traits.supportiveness > 0.7) {
        responsePool = responsePool.map(r => r + ' I\'m here for you.');
    }
    
    // New: Tie to game events/stats
    if (topic.mainTopic === 'hockey' && gameState.player.seasonStats.points > 10) {
        responsePool.push('You\'re on fire this season!');
    } else if (topic.mainTopic === 'academics' && gameState.player.status.gpa < 2.5) {
        responsePool.push('Your grades are slipping. Need help?');
    } else if (topic.mainTopic === 'personal' && gameState.player.status.mentalHealth < 50) {
        responsePool.push('You seem down. Talk about it?');
    } else if (topic.mainTopic === 'social' && gameState.player.status.happiness > 80) {
        responsePool.push('Glad you\'re having fun!');
    }
    
    // Select random response
    const randomIndex = Math.floor(Math.random() * responsePool.length);
    let response = contextReference + responsePool[randomIndex];
    
    // Adjust length based on vocabulary
    if (personality.vocabulary.shortResponses) {
        response = response.split(' ').slice(0, 10).join(' ');
    }
    
    // Add emoji based on NPC and sentiment
    if (sentiment.isPositive) {
        const positiveEmojis = npcId === 'mom' ? ' ❤️' : (npcId === 'teammate_jake' ? ' 👍' : ' 😊');
        response += positiveEmojis;
    } else if (sentiment.isNegative) {
        const negativeEmojis = npcId === 'mom' ? ' 😔' : (npcId === 'coach' ? ' 💪' : ' 😕');
        response += negativeEmojis;
    }
    
    // Add jargon if applicable
    if (personality.vocabulary.usesJargon && topic.mainTopic === 'hockey') {
        response += ' Remember, no icing on the cake.';
    }
    
    return response;
}

// Main function to generate NPC replies
export function generateNpcReply(contactId, playerMessage) {
    // Analyze the message
    const sentiment = analyzeSentiment(playerMessage);
    const topic = detectTopic(playerMessage);
    
    // Generate contextual response
    const response = generateContextualResponse(contactId, playerMessage, topic, sentiment);
    
    // Update NPC memory
    updateNpcMemory(contactId, playerMessage, response);
    
    // If no contextual response, fall back to keyword matching
    if (!response) {
        return findKeywordResponse(contactId, playerMessage) || "...";
    }
    
    return response;
}

// Legacy keyword matching function (fallback)
function findKeywordResponse(contactId, playerMessage) {
    const lowerCaseMessage = playerMessage.toLowerCase();
    
    // Basic keyword responses
    const keywords = {
        mom: {
            "love": "Love you too, sweetie! ❤️",
            "miss": "I miss you too! Call more often!",
            "money": "I'll send some money to your account. Don't spend it all at once!",
            "food": "Are you eating enough? I can send you some homemade cookies!",
            "sick": "Oh no! Are you taking medicine? Do you need to see a doctor?",
            "tired": "Make sure you're getting enough sleep, honey. College is demanding!",
            "dad": "Your father says hi! He's so proud of you.",
            "home": "Your room is just how you left it. Visit soon!"
        },
        coach: {
            "practice": "Be on time. I expect 100% effort.",
            "game": "Focus on execution. We've prepared for this.",
            "injured": "See the trainer immediately. I need a full report.",
            "sorry": "Actions speak louder than words. Show me improvement.",
            "tired": "Mental toughness is part of being an athlete. Push through.",
            "class": "Academics come first. No grades, no ice time.",
            "help": "My door is always open. But come with solutions, not just problems.",
            "thanks": "Just doing my job. Keep working hard."
        },
        teammate_jake: {
            "party": "Hell yeah! It's gonna be lit! 🔥",
            "homework": "Dude, I haven't even started. Can I copy yours?",
            "practice": "Coach is killing us lately. My legs are dead.",
            "game": "We're gonna crush them this weekend!",
            "girl": "You should meet my friend Sarah. She's in my psych class.",
            "beer": "I've got a case in my fridge. Come over later.",
            "help": "I got you, bro. What do you need?",
            "tired": "Same. These morning workouts are brutal."
        },
        teammate_tyler: {
            "party": "Let's rage!",
            "game": "Score a hat trick!",
            "tired": "Coffee time.",
            "help": "Sure thing."
        },
        professor_miller: {
            "exam": "Study the notes.",
            "help": "Office hours.",
            "grade": "You can improve.",
            "thanks": "You're welcome."
        },
        sarah: {
            "date": "Sounds fun!",
            "class": "Psych is boring.",
            "art": "Come to my show.",
            "hi": "Hey! 😊"
        }
    };
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(keywords[contactId] || {})) {
        if (lowerCaseMessage.includes(keyword)) {
            return response;
        }
    }
    
    // Default responses if no keyword matches
    const defaults = {
        mom: [
            "How are your classes going?",
            "Are you eating enough?",
            "Don't forget to call your father!",
            "I sent you a care package! ❤️",
            "Get enough sleep, sweetie!"
        ],
        coach: [
            "Keep me updated.",
            "Focus on your development.",
            "The team needs your best effort.",
            "We'll discuss more at practice.",
            "Remember what we're working toward."
        ],
        teammate_jake: [
            "Cool, man.",
            "Let me know what's up later.",
            "Sounds good bro.",
            "I'm heading to the gym. Wanna join?",
            "Did you finish the assignment for econ?"
        ],
        teammate_tyler: [
            "Cool.",
            "Later.",
            "Party?",
            "Game on."
        ],
        professor_miller: [
            "See you in class.",
            "Review the material.",
            "Questions?",
            "Good luck on the test."
        ],
        sarah: [
            "What's up?",
            "Miss you.",
            "Study date?",
            "Hi! 😊"
        ]
    };
    
    const defaultResponses = defaults[contactId];
    if (defaultResponses) {
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    return "...";
}

// New: Initialize NPCs with event hooks
export function initializeNPCs() {
    // Example: Coach comments on low stats
    if (gameState.player.status.energy < 50) {
        addMessage('coach', 'coach', "You look tired. Get rest or you'll be benched.");
    }
    if (gameState.player.status.gpa < 2.5) {
        addMessage('professor_miller', 'professor_miller', "Your grades need improvement. See me.");
    }
    if (gameState.player.seasonStats.points > 5) {
        addMessage('teammate_jake', 'teammate_jake', "Killing it on the ice! Keep it up.");
    }
}