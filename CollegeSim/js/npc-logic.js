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

// Generate a response based on NPC personality, topic, and context
function generateContextualResponse(npcId, playerMessage, topic, sentiment) {
    const npc = npcPersonalities[npcId];
    if (!npc) return null;
    
    // Check if we should reference previous context
    const shouldReferenceContext = npc.contextMemory.length > 0 && Math.random() < 0.3;
    let contextReference = '';
    
    if (shouldReferenceContext) {
        const recentContext = npc.contextMemory[npc.contextMemory.length - 1];
        if (recentContext && recentContext.topic === topic.mainTopic) {
            contextReference = `About ${recentContext.topic} again, `;
        }
    }
    
    // Base responses by NPC and topic
    const responses = {
        coach: {
            hockey: [
                "Focus on your fundamentals. That's what makes a great player.",
                "I need you at 100% for the next game. Keep working hard.",
                "Your skating has improved, but your defensive positioning needs work.",
                "The team is counting on you to perform.",
                "We'll review the game tape tomorrow. Be ready to learn."
            ],
            academics: [
                "Academics come first. No grades, no ice time.",
                "Make sure you're keeping up with your classes.",
                "I expect all my players to excel in the classroom too.",
                "Study hall is mandatory for anyone with a GPA below 3.0.",
                "Talk to the academic advisor if you're struggling."
            ],
            personal: [
                "Keep your personal issues off the ice.",
                "Mental toughness is part of being an athlete.",
                "If you need time, let me know. But I expect you back at 100%.",
                "The team psychologist is available if you need to talk.",
                "Take care of yourself, but remember your commitment to this team."
            ],
            social: [
                "Your social life shouldn't interfere with hockey.",
                "Be careful about your public image. You represent this program.",
                "I don't care what you do off-ice as long as it doesn't affect your performance.",
                "Team bonding is important, but know your limits.",
                "Stay out of trouble. I don't want to hear about you from campus security."
            ],
            general: [
                "Keep me updated.",
                "Let's talk more at practice.",
                "I expect your best effort every day.",
                "Remember what we're working toward.",
                "Stay focused on our goals."
            ]
        },
        mom: {
            hockey: [
                "I'm so proud of you playing college hockey! Are you having fun?",
                "Your father and I are planning to come to your next home game!",
                "Are you getting enough ice time? You know you can talk to your coach.",
                "Don't forget to ice those bruises, honey.",
                "I still have all your youth hockey trophies in your room!"
            ],
            academics: [
                "How are your classes going? Are you keeping up with your studies?",
                "Don't let hockey get in the way of your education, sweetie.",
                "Do you need any money for textbooks?",
                "I saw your school is offering tutoring. Maybe that would help?",
                "Your father and I are so proud of you balancing hockey and school!"
            ],
            personal: [
                "Are you eating enough? You sound tired.",
                "Make sure you're getting enough sleep, honey.",
                "I worry about you. Are you taking care of yourself?",
                "You know you can always come home if you need a break.",
                "I sent you a care package. It should arrive tomorrow!"
            ],
            social: [
                "Have you made any new friends? What are they like?",
                "Just be careful at those college parties, okay?",
                "Your high school friends were asking about you!",
                "Are you dating anyone? You know I won't pry too much...",
                "Don't spend all your time studying and playing hockey. Have some fun too!"
            ],
            general: [
                "I love you so much, sweetie!",
                "Call me more often, okay? I miss hearing your voice.",
                "Your father says hi!",
                "Let me know if you need anything at all.",
                "I'm always here for you, no matter what."
            ]
        },
        teammate_jake: {
            hockey: [
                "Coach was brutal at practice today. My legs are dead.",
                "You coming to the optional skate tomorrow? Could use your help on the power play.",
                "Did you see that sick goal in the NHL game last night?",
                "We need to step it up before the weekend series.",
                "The freshmen are looking good this year. Gonna be competitive for ice time."
            ],
            academics: [
                "You in Professor Miller's class? I need the notes from yesterday.",
                "This econ homework is killing me. You get it done yet?",
                "How'd you do on that exam? I barely passed.",
                "Thinking about switching my major. This business stuff is boring.",
                "You know anyone in the study group for biology? I need to join."
            ],
            personal: [
                "Dude, I'm exhausted. Coach's workouts plus these 8am classes are brutal.",
                "My shoulder's still messed up from that hit last week.",
                "Parents keep asking when I'm coming home. Told them not until Thanksgiving.",
                "Been feeling kinda off lately. Might be coming down with something.",
                "Need to catch up on sleep this weekend."
            ],
            social: [
                "Party at the lacrosse house tonight. You in?",
                "Met this girl at the Hub yesterday. Might ask her out.",
                "The boys are getting together to watch the game. Bring snacks if you come.",
                "Did you see what Tyler posted? Dude is wild.",
                "We should hit up that new place downtown this weekend."
            ],
            general: [
                "What's up man?",
                "Let me know what's going on later.",
                "Cool, keep me posted.",
                "Sounds good bro.",
                "Later dude."
            ]
        }
    };
    
    // Select appropriate responses based on topic
    const topicResponses = responses[npcId]?.[topic.mainTopic] || responses[npcId]?.general;
    if (!topicResponses) return null;
    
    // Modify response based on sentiment
    let responsePool = [...topicResponses];
    
    // If it's a question, prepare question-specific responses
    if (sentiment.isQuestion) {
        const questionResponses = {
            coach: {
                hockey: ["That's a good question about the team. ", "Regarding your question about hockey, ", "About your hockey question, "],
                academics: ["About your academic question, ", "Regarding your studies, ", "About your classes, "],
                personal: ["About your personal question, ", "Regarding that, ", "I'll tell you this: "],
                social: ["About your social question, ", "Regarding that, ", "Let me be clear: "]
            },
            mom: {
                hockey: ["About your hockey question, sweetie, ", "Oh, you're asking about hockey? Well, ", "Let me think about your hockey question... "],
                academics: ["About your studies, honey, ", "That's a good question about school. ", "Regarding your academic question, "],
                personal: ["About your personal question, dear, ", "Oh, you're asking about that? Well, ", "Let me see... "],
                social: ["About your friends, ", "That's a good question about your social life. ", "Well, regarding that, "]
            },
            teammate_jake: {
                hockey: ["About hockey? ", "You're asking about the team? ", "Hockey question, huh? "],
                academics: ["About class? ", "School stuff? ", "Academic question? "],
                personal: ["About that? ", "You're asking me personally? ", "Well, if you want to know, "],
                social: ["About the social scene? ", "Party question? ", "About that situation? "]
            }
        };
        
        const prefix = questionResponses[npcId]?.[topic.mainTopic]?.[Math.floor(Math.random() * 3)] || "";
        responsePool = responsePool.map(response => prefix + response);
    }
    
    // Adjust response based on relationship level
    const relationshipLevel = gameState.relationships[npcId]?.level || 50;
    if (relationshipLevel > 75) {
        // Very positive relationship - more supportive, friendly responses
        if (npcId === 'coach') {
            responsePool = responsePool.map(r => r.replace(/I expect|you need to|make sure/g, "I'd appreciate if you"));
        } else if (npcId === 'mom') {
            responsePool = responsePool.map(r => r + " I'm so proud of you!");
        } else if (npcId === 'teammate_jake') {
            responsePool = responsePool.map(r => r + " You're the best, man.");
        }
    } else if (relationshipLevel < 25) {
        // Poor relationship - more distant, cold responses
        if (npcId === 'coach') {
            responsePool = responsePool.map(r => r.replace(/good|great|improved/g, "acceptable"));
        } else if (npcId === 'mom') {
            responsePool = responsePool.map(r => r.replace(/love|proud|sweetie|honey/g, ""));
        } else if (npcId === 'teammate_jake') {
            responsePool = responsePool.map(r => r.replace(/we|us/g, "I"));
        }
    }
    
    // Select a random response from the pool
    const randomIndex = Math.floor(Math.random() * responsePool.length);
    let response = contextReference + responsePool[randomIndex];
    
    // Add emoji for certain NPCs and sentiments
    if (npcId === 'mom' && (sentiment.isPositive || Math.random() > 0.7)) {
        const momEmojis = ['❤️', '😊', '🤗', '💕', '👩‍👦'];
        response += ' ' + momEmojis[Math.floor(Math.random() * momEmojis.length)];
    } else if (npcId === 'teammate_jake' && (topic.mainTopic === 'social' || sentiment.isPositive)) {
        const jakeEmojis = ['🏒', '🍻', '👊', '😎', '🔥'];
        response += ' ' + jakeEmojis[Math.floor(Math.random() * jakeEmojis.length)];
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
        ]
    };
    
    const defaultResponses = defaults[contactId];
    if (defaultResponses) {
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    return "...";
}