// js/events.js - Enhanced event system with more events and categories
import { addMessage } from './main.js';
import { gameState } from './main.js';
import { simulatePractice } from './hockey-sim.js';

export const eventLibrary = {
    // --- ONBOARDING EVENTS ---
    'event_welcome': {
        title: "First Day on Campus",
        text: "It's the first week before the season starts. You have some free time this morning. What's the plan?",
        choices: [
            { text: "Go to the rink for an extra workout.", nextEvent: 'event_afternoon_free', action: (gameState) => {
                gameState.player.attributes.skating += 1;
                gameState.player.status.stress += 5;
                gameState.player.status.energy -= 20;
                gameState.relationships.coach.level += 5;
                gameState.player.status.happiness += 3;
            }},
            { text: "Introduce yourself to some teammates in the lounge.", nextEvent: 'event_afternoon_free', action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.energy -= 10;
                gameState.relationships.teammate_jake.level += 10;
                gameState.notifications++; 
                gameState.player.status.happiness += 5;
                
                // Add a message from Jake
                setTimeout(() => {
                    addMessage('teammate_jake', 'teammate_jake', "Good meeting you today. Let me know if you need anything!", new Date());
                }, 3000);
            }},
            { text: "Get a head start on your syllabus reading.", nextEvent: 'event_afternoon_free', action: (gameState) => {
                gameState.player.status.gpa += 0.05;
                gameState.player.status.stress -= 5;
                gameState.player.status.energy -= 15;
                gameState.player.status.happiness += 2;
                
                // Add a message from professor
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "I noticed you've already reviewed the syllabus. Good initiative.", new Date());
                }, 5000);
            }},
        ]
    },
    'event_afternoon_free': {
        title: "Afternoon Skate",
        text: "It's now afternoon. The coach mentioned an optional team skate later.",
        choices: [
            { text: "Definitely going. I need to make a good impression.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.energy -= 25;
                gameState.relationships.coach.level += 5;
                gameState.player.attributes.skating += 1;
                gameState.player.status.happiness += 3;
                gameState.notifications++;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "Good work at the optional skate today. That's the dedication I want to see.", new Date());
                }, 3000);
            }},
            { text: "I'll skip it and explore the campus instead.", action: (gameState) => {
                gameState.player.status.stress -= 5;
                gameState.player.status.energy -= 10;
                gameState.player.status.happiness += 5;
                gameState.relationships.coach.level -= 3;
                
                // Random chance to meet someone new
                if (Math.random() > 0.5) {
                    setTimeout(() => {
                        addMessage('sarah', 'sarah', "Hey, I saw you walking around campus today. I'm Sarah from your Psych class. Just wanted to say hi!", new Date());
                        gameState.relationships.sarah.level += 10;
                        gameState.notifications++;
                    }, 4000);
                }
            }},
        ]
    },
    
    // --- LOCATION-BASED EVENTS ---
    'event_extra_practice': {
        title: "Pegula Ice Arena",
        text: "You decided to get some extra work in at the rink. What do you want to focus on?",
        choices: [
            { text: "Work on skating drills.", action: (gameState) => {
                gameState.player.attributes.skating += 2;
                gameState.player.attributes.speed += 1;
                gameState.player.status.stress += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 3;
                simulatePractice('skating'); // New: Mini-sim
                
                // Random chance to run into coach
                if (Math.random() > 0.7) {
                    setTimeout(() => {
                        addMessage('coach', 'coach', "Saw you putting in extra work on your skating. That's what I like to see.", new Date());
                        gameState.relationships.coach.level += 5;
                        gameState.notifications++;
                    }, 3000);
                }
            }},
            { text: "Take shots on the empty net.", action: (gameState) => {
                gameState.player.attributes.shooting += 2;
                gameState.player.attributes.puckHandling += 1;
                gameState.player.status.stress += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 3;
                simulatePractice('shooting'); // New
            }},
            { text: "Work on defensive positioning.", action: (gameState) => {
                gameState.player.attributes.defense += 2;
                gameState.player.attributes.awareness += 1;
                gameState.player.status.stress += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 2;
                simulatePractice('defense'); // New
            }},
            { text: "Just skate around and have fun.", action: (gameState) => {
                gameState.player.attributes.skating += 1;
                gameState.player.status.stress -= 10;
                gameState.player.status.energy -= 15;
                gameState.player.status.happiness += 8;
            }},
        ]
    },
    'event_library_study': {
        title: "Pattee Library",
        text: "You head to the library to get some studying done. It's quiet here.",
        choices: [
            { text: "Review class notes for 2 hours.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.stress -= 5;
                gameState.player.status.energy -= 15;
                gameState.player.status.happiness += 2;
            }},
            { text: "Join a study group you see nearby.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
                gameState.player.status.reputation += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 5;
                // Branch: Low GPA risks probation
                if (gameState.player.status.gpa < 2.5) {
                    setTimeout(() => showEvent('event_academic_probation'), 5000);
                }
            }},
        ]
    },
    'event_dorm_room': {
        title: "East Halls Dorm",
        text: "Back in your dorm room. Time to relax or get some work done?",
        choices: [
            { text: "Take a nap to recover energy.", action: (gameState) => {
                gameState.player.status.energy += 30;
                gameState.player.status.stress -= 10;
                gameState.player.status.happiness += 5;
            }},
            { text: "Call home to chat with family.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.player.status.mentalHealth += 5;
                gameState.relationships.mom.level += 5;
                setTimeout(() => {
                    addMessage('mom', 'mom', "It was great hearing from you! Stay safe and study hard.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Do some light reading for class.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
                gameState.player.status.energy -= 10;
            }},
        ]
    },
    'event_class_econ': {
        title: "ECON 101 Class",
        text: "In economics class. The professor is discussing supply and demand.",
        choices: [
            { text: "Pay attention and take notes.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.attributes.awareness += 1;
                gameState.player.status.energy -= 15;
            }},
            { text: "Daydream about hockey.", action: (gameState) => {
                gameState.player.status.gpa -= 0.05;
                gameState.player.status.happiness += 5;
                gameState.player.status.stress -= 5;
            }},
            { text: "Ask a question about real-world applications.", action: (gameState) => {
                gameState.player.status.gpa += 0.15;
                gameState.relationships.professor_miller.level += 5;
                gameState.player.status.reputation += 3;
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "Good question in class today. Come see me if you want more examples.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
        ]
    },
    'event_student_center': {
        title: "HUB-Robeson Center",
        text: "At the student center. Lots of activity here.",
        choices: [
            { text: "Grab a quick meal.", action: (gameState) => {
                gameState.player.status.energy += 20;
                gameState.player.status.nutrition += 15;
                gameState.player.status.happiness += 5;
            }},
            { text: "Chat with some students.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.happiness += 10;
                if (Math.random() > 0.6) {
                    gameState.relationships.sarah.level += 5;
                    setTimeout(() => {
                        addMessage('sarah', 'sarah', "Nice chatting at the HUB! We should hang out sometime.", new Date());
                        gameState.notifications++;
                    }, 3000);
                }
            }},
            { text: "Check out club fair booths.", action: (gameState) => {
                gameState.player.status.reputation += 10;
                gameState.player.status.stress += 5;
                gameState.player.status.happiness += 8;
            }},
        ]
    },
    'event_gym_workout': {
        title: "Recreation Center Workout",
        text: "Time for a workout session. What to focus on?",
        choices: [
            { text: "Weight lifting for strength.", action: (gameState) => {
                gameState.player.attributes.strength += 2;
                gameState.player.attributes.checking += 1;
                gameState.player.status.energy -= 25;
                gameState.player.status.health += 5;
                simulatePractice('strength');
            }},
            { text: "Cardio for stamina.", action: (gameState) => {
                gameState.player.attributes.stamina += 2;
                gameState.player.attributes.speed += 1;
                gameState.player.status.energy -= 20;
                gameState.player.status.nutrition -= 10;
                simulatePractice('stamina');
            }},
            { text: "Yoga for mental health.", action: (gameState) => {
                gameState.player.status.mentalHealth += 10;
                gameState.player.status.stress -= 15;
                gameState.player.status.happiness += 10;
            }},
        ]
    },
    // --- SOCIAL EVENTS ---
    'event_party_invite': {
        title: "Party Invite",
        text: "Your teammate invites you to a party tonight. Go?",
        choices: [
            { text: "Yes, let's socialize.", action: (gameState) => {
                gameState.player.status.reputation += 10;
                gameState.player.status.happiness += 15;
                gameState.player.status.energy -= 30;
                gameState.player.status.stress -= 10;
                gameState.relationships.teammate_tyler.level += 10;
                if (Math.random() < 0.3) {
                    gameState.player.status.health -= 10; // Risk of hangover
                    gameState.player.status.nutrition -= 15;
                }
                setTimeout(() => {
                    addMessage('teammate_tyler', 'teammate_tyler', "Awesome party last night! Glad you came.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "No, stay in and rest.", action: (gameState) => {
                gameState.player.status.energy += 20;
                gameState.player.status.stress -= 5;
                gameState.relationships.teammate_tyler.level -= 5;
            }},
        ]
    },
    'event_teammate_conflict': {
        title: "Teammate Conflict",
        text: "A teammate is arguing with you over a drill mistake. How to handle?",
        choices: [
            { text: "Apologize and move on.", action: (gameState) => {
                gameState.relationships.teammate_jake.level += 5;
                gameState.player.status.reputation += 5;
                gameState.player.status.stress += 5;
            }},
            { text: "Stand your ground.", action: (gameState) => {
                gameState.relationships.teammate_jake.level -= 10;
                gameState.player.status.reputation -= 5;
                gameState.player.status.mentalHealth -= 5;
            }},
            { text: "Talk it out calmly.", action: (gameState) => {
                gameState.relationships.teammate_jake.level += 10;
                gameState.player.attributes.awareness += 1;
                gameState.player.status.happiness += 5;
            }},
        ]
    },
    'event_dating_app_match': {
        title: "Dating App Match",
        text: "You matched with someone on Rink Rater. Message them?",
        choices: [
            { text: "Send a message.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.player.status.stress -= 5;
                // Add new relationship if not exist
                if (!gameState.relationships.new_match) {
                    gameState.relationships.new_match = { name: "New Match", level: 10, avatarColor: "#ff69b4" };
                    gameState.conversations.new_match = { messages: [] };
                }
                setTimeout(() => {
                    addMessage('new_match', 'new_match', "Hey! Saw you're into hockey. Me too!", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Ignore for now.", action: (gameState) => {
                gameState.player.status.stress += 5;
            }},
        ]
    },
    // --- ACADEMIC EVENTS ---
    'event_study_group': {
        title: "Study Group Invite",
        text: "Classmates invite you to a study group. Join?",
        choices: [
            { text: "Yes, collaborate.", action: (gameState) => {
                gameState.player.status.gpa += 0.15;
                gameState.player.status.reputation += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 5;
                gameState.relationships.professor_miller.level += 5;
            }},
            { text: "No, study alone.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.energy -= 15;
            }},
        ]
    },
    'event_missed_assignment': {
        title: "Missed Assignment",
        text: "You forgot about an assignment due tomorrow. What now?",
        choices: [
            { text: "Pull an all-nighter.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
                gameState.player.status.energy -= 40;
                gameState.player.status.stress += 20;
                gameState.player.status.mentalHealth -= 10;
            }},
            { text: "Ask for extension.", action: (gameState) => {
                if (gameState.relationships.professor_miller.level > 50) {
                    gameState.player.status.gpa -= 0.05;
                    gameState.player.status.stress -= 5;
                } else {
                    gameState.player.status.gpa -= 0.2;
                    gameState.relationships.professor_miller.level -= 10;
                }
            }},
        ]
    },
    'event_professor_meeting': {
        title: "Office Hours Meeting",
        text: "Meeting with professor about your progress.",
        choices: [
            { text: "Ask for advice.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.relationships.professor_miller.level += 10;
            }},
            { text: "Discuss career goals.", action: (gameState) => {
                gameState.player.attributes.awareness += 2;
                gameState.player.status.happiness += 5;
            }},
        ]
    },
    // --- HOCKEY EVENTS ---
    'event_coach_feedback': {
        title: "Coach's Feedback",
        text: "Coach Davis calls you into his office to discuss your performance so far.",
        choices: [
            { text: "Listen carefully and ask for specific ways to improve.", action: (gameState) => {
                gameState.player.attributes.awareness += 2;
                gameState.player.status.reputation += 5;
                gameState.relationships.coach.level += 8;
                gameState.player.status.happiness += 3;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "Good talk today. I appreciate your willingness to learn and improve. Keep working on those areas we discussed.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Defend your performance and make excuses.", action: (gameState) => {
                gameState.player.status.reputation -= 5;
                gameState.relationships.coach.level -= 10;
                gameState.player.status.happiness -= 5;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "I need you to take responsibility for your performance. No excuses. We'll talk again next week.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Accept the criticism without comment.", action: (gameState) => {
                gameState.player.status.reputation += 0;
                gameState.relationships.coach.level += 3;
                gameState.player.status.happiness += 0;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "Think about what we discussed. I need to see improvement in practice this week.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
        ]
    },
    'event_team_bonding': {
        title: "Team Bonding Activity",
        text: "Team is having a bonding session. Participate actively?",
        choices: [
            { text: "Yes, lead an activity.", action: (gameState) => {
                gameState.player.status.reputation += 15;
                gameState.relationships.teammate_jake.level += 10;
                gameState.relationships.teammate_tyler.level += 10;
                gameState.player.status.happiness += 10;
            }},
            { text: "Join but stay quiet.", action: (gameState) => {
                gameState.player.status.happiness += 5;
                gameState.relationships.teammate_jake.level += 5;
            }},
        ]
    },
    'event_team_practice_good': {
        title: "Good Practice Session",
        text: "Practice went well today. You feel improved.",
        choices: [
            { text: "Celebrate with team.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.player.status.reputation += 5;
            }},
        ]
    },
    'event_team_practice_bad': {
        title: "Bad Practice Session",
        text: "Practice was rough. Coach is disappointed.",
        choices: [
            { text: "Extra effort next time.", action: (gameState) => {
                gameState.player.attributes.stamina += 1;
                gameState.player.status.stress += 10;
            }},
        ]
    },
    // --- PERSONAL EVENTS ---
    'event_homesick': {
        title: "Feeling Homesick",
        text: "Missing home. What to do?",
        choices: [
            { text: "Call family.", action: (gameState) => {
                gameState.player.status.mentalHealth += 10;
                gameState.player.status.happiness += 15;
                gameState.player.status.stress -= 10;
                gameState.relationships.mom.level += 5;
            }},
            { text: "Go out with friends.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.player.status.energy -= 15;
            }},
        ]
    },
    'event_health_issue': {
        title: "Minor Health Issue",
        text: "Not feeling well. Visit clinic?",
        choices: [
            { text: "Yes, get checked.", action: (gameState) => {
                gameState.player.status.health += 10;
                gameState.player.status.energy -= 10;
            }},
            { text: "Ignore and push through.", action: (gameState) => {
                gameState.player.status.health -= 10;
                gameState.player.status.injury += 5;
            }},
        ]
    },
    'event_financial_problem': {
        title: "Financial Squeeze",
        text: "You check your bank account and realize you're running low on funds for the month.",
        choices: [
            { text: "Ask your parents for money.", action: (gameState) => {
                gameState.player.status.stress -= 10;
                gameState.player.status.happiness += 3;
                gameState.relationships.mom.level -= 3;
                
                // Add a message from mom
                setTimeout(() => {
                    addMessage('mom', 'mom', "I've sent you some money, honey. Try to budget better next month, okay? Let me know if you need help with that.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Look for a part-time campus job.", action: (gameState) => {
                gameState.player.status.energy -= 10;
                gameState.player.status.stress += 5;
                gameState.player.status.happiness -= 3;
                gameState.player.status.gpa -= 0.03;
                gameState.relationships.coach.level -= 3;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "I heard you took a campus job. Make sure it doesn't interfere with hockey or academics.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Cut back on expenses and budget carefully.", action: (gameState) => {
                gameState.player.status.happiness -= 5;
                gameState.player.attributes.awareness += 2;
                
                // Add a note to the phone
                if (gameState.phone.notes) {
                    gameState.phone.notes.unshift({
                        title: 'Monthly Budget',
                        content: 'Food: $200\nEntertainment: $50\nBooks/Supplies: $100\nMiscellaneous: $50',
                        date: new Date(gameState.gameDate)
                    });
                }
            }},
        ]
    },
    'event_oversleep': {
        title: "Overslept",
        text: "You wake up with a start, realizing you've overslept and your morning class started 15 minutes ago!",
        choices: [
            { text: "Rush to class immediately.", action: (gameState) => {
                gameState.player.status.energy -= 10;
                gameState.player.status.stress += 15;
                gameState.player.status.gpa -= 0.03;
                gameState.player.status.happiness -= 3;
                
                // Add a message from professor
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "Please make an effort to arrive on time. You missed an important concept today.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Skip class and email the professor an excuse.", action: (gameState) => {
                gameState.player.status.energy += 5;
                gameState.player.status.gpa -= 0.08;
                gameState.relationships.professor_miller.level -= 5;
                gameState.player.status.happiness += 0;
                
                // Add a message from professor
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "I received your email. Please get notes from a classmate and see me during office hours.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Skip class but ask a classmate for notes.", action: (gameState) => {
                gameState.player.status.energy += 5;
                gameState.player.status.gpa -= 0.05;
                gameState.player.status.happiness += 0;
                
                // Random chance to get notes from Sarah
                if (Math.random() > 0.5 && gameState.relationships.sarah.level > 0) {
                    setTimeout(() => {
                        addMessage('sarah', 'sarah', "Here are the notes from class today. Don't worry, I got you covered! 📝", new Date());
                        gameState.relationships.sarah.level += 5;
                        gameState.notifications++;
                    }, 3000);
                }
            }},
        ]
    },
    'event_class_pop_quiz': {
        title: "Pop Quiz in Class",
        text: "Surprise quiz! How prepared are you?",
        choices: [
            { text: "Give it your best shot.", action: (gameState) => {
                const prep = gameState.player.attributes.awareness / 100;
                if (Math.random() < prep) {
                    gameState.player.status.gpa += 0.1;
                    gameState.player.status.happiness += 5;
                } else {
                    gameState.player.status.gpa -= 0.05;
                    gameState.player.status.stress += 10;
                }
            }},
        ]
    },
    'event_class_group_project': {
        title: "Group Project Assigned",
        text: "Paired with classmates for a project. Take lead?",
        choices: [
            { text: "Yes, organize the group.", action: (gameState) => {
                gameState.player.status.reputation += 10;
                gameState.player.status.stress += 15;
                gameState.player.status.gpa += 0.15;
            }},
            { text: "No, contribute equally.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.happiness += 5;
            }},
        ]
    },
    'event_party_drama': {
        title: "Party Drama",
        text: "Drama at the party. Get involved?",
        choices: [
            { text: "Yes, mediate.", action: (gameState) => {
                gameState.player.status.reputation += 10;
                gameState.player.status.stress += 20;
                gameState.player.attributes.awareness += 1;
            }},
            { text: "No, stay out.", action: (gameState) => {
                gameState.player.status.happiness -= 5;
            }},
        ]
    },
    'event_random_encounter': {
        title: "Random Campus Encounter",
        text: "You bump into a professor on the path.",
        choices: [
            { text: "Chat briefly.", action: (gameState) => {
                gameState.relationships.professor_miller.level += 5;
                gameState.player.status.reputation += 3;
            }},
            { text: "Nod and keep walking.", action: (gameState) => {
                // No change
            }},
        ]
    },
    'event_snow_delay': {
        title: "Snow Storm Delay",
        text: "Heavy snow is delaying travel to practice. What do you do?",
        choices: [
            { text: "Push through and go", action: (gameState) => { gameState.player.status.energy -= 15; gameState.player.status.injury += 10; gameState.relationships.coach.level += 5; } },
            { text: "Stay home", action: (gameState) => { gameState.relationships.coach.level -= 5; gameState.player.status.stress -= 5; } }
        ]
    },
    'event_academic_probation': {
        title: "Academic Probation Warning",
        text: "Your GPA is low. Risk of probation.",
        choices: [
            { text: "Study harder.", action: (gameState) => { gameState.player.status.gpa += 0.2; gameState.player.status.stress += 15; } },
            { text: "Seek tutoring.", action: (gameState) => { gameState.player.status.gpa += 0.15; gameState.player.status.reputation -= 5; } },
        ]
    },
    'event_injury_recovery': {
        title: "Injury Recovery",
        text: "Recovering from minor injury. Follow trainer's advice?",
        choices: [
            { text: "Yes, rest properly.", action: (gameState) => { gameState.player.status.injury -= 10; gameState.player.status.health += 10; } },
            { text: "Push back early.", action: (gameState) => { gameState.player.status.injury += 5; gameState.player.attributes.strength += 1; } },
        ]
    },
    'event_nutrition_boost': {
        title: "Nutrition Seminar",
        text: "Attend team nutrition seminar?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.nutrition += 20; gameState.player.status.health += 5; } },
            { text: "Skip.", action: (gameState) => { gameState.player.status.nutrition -= 10; } },
        ]
    },
    'event_mental_health_check': {
        title: "Mental Health Day",
        text: "Feeling overwhelmed. Take a break?",
        choices: [
            { text: "Yes, relax.", action: (gameState) => { gameState.player.status.mentalHealth += 15; gameState.player.status.stress -= 20; gameState.player.status.energy += 10; } },
            { text: "No, keep going.", action: (gameState) => { gameState.player.status.mentalHealth -= 10; gameState.player.status.stress += 10; } },
        ]
    },
    'event_team_rivalry': {
        title: "Rivalry Build-up",
        text: "Tension with rival team. Prepare mentally?",
        choices: [
            { text: "Yes, visualize success.", action: (gameState) => { gameState.player.attributes.awareness += 2; gameState.player.status.mentalHealth += 5; } },
            { text: "Ignore.", action: (gameState) => { gameState.player.status.stress += 5; } },
        ]
    },
    'event_sponsorship_offer': {
        title: "Sponsorship Opportunity",
        text: "Local brand offers sponsorship. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 15; gameState.player.status.happiness += 10; } },
            { text: "No.", action: (gameState) => { gameState.player.status.reputation -= 5; } },
        ]
    },
    'event_exam_success': {
        title: "Exam Success",
        text: "Aced the exam! Celebrate?",
        choices: [
            { text: "Yes, treat yourself.", action: (gameState) => { gameState.player.status.happiness += 10; gameState.player.status.energy -= 5; } },
            { text: "No, keep studying.", action: (gameState) => { gameState.player.status.gpa += 0.05; } },
        ]
    },
    'event_exam_failure': {
        title: "Exam Failure",
        text: "Failed the exam. How to recover?",
        choices: [
            { text: "Study more.", action: (gameState) => { gameState.player.status.gpa += 0.1; gameState.player.status.stress += 10; } },
            { text: "Talk to professor.", action: (gameState) => { gameState.relationships.professor_miller.level += 5; } },
        ]
    },
    'event_family_visit': {
        title: "Family Visit",
        text: "Family coming to visit. Excited?",
        choices: [
            { text: "Yes, show them around.", action: (gameState) => { gameState.player.status.happiness += 20; gameState.relationships.mom.level += 10; } },
            { text: "Busy with practice.", action: (gameState) => { gameState.relationships.mom.level -= 5; gameState.player.attributes.skating += 1; } },
        ]
    },
    'event_roommate_issue': {
        title: "Roommate Conflict",
        text: "Roommate is messy. Address it?",
        choices: [
            { text: "Yes, talk it out.", action: (gameState) => { gameState.player.status.stress -= 5; gameState.player.status.happiness += 5; } },
            { text: "Ignore.", action: (gameState) => { gameState.player.status.stress += 10; } },
        ]
    },
    'event_volunteer_event': {
        title: "Volunteer Opportunity",
        text: "Campus volunteer event. Participate?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; gameState.player.status.happiness += 10; gameState.player.status.energy -= 15; } },
            { text: "No.", action: (gameState) => { } },
        ]
    },
    'event_campus_event': {
        title: "Campus Festival",
        text: "Big campus festival. Attend?",
        choices: [
            { text: "Yes, have fun.", action: (gameState) => { gameState.player.status.happiness += 15; gameState.player.status.reputation += 5; gameState.player.status.energy -= 20; } },
            { text: "No, rest.", action: (gameState) => { gameState.player.status.energy += 10; } },
        ]
    },
    'event_study_abroad_interest': {
        title: "Study Abroad Info Session",
        text: "Interested in study abroad next semester?",
        choices: [
            { text: "Attend session.", action: (gameState) => { gameState.player.attributes.awareness += 2; gameState.player.status.happiness += 5; } },
            { text: "Skip.", action: (gameState) => {  } },
        ]
    },
    'event_internship_offer': {
        title: "Internship Opportunity",
        text: "Summer internship offer. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 20; gameState.player.status.gpa += 0.1; gameState.player.status.stress += 10; } },
            { text: "No.", action: (gameState) => { gameState.player.status.happiness += 5; } },
        ]
    },
    'event_club_join': {
        title: "Join a Club",
        text: "Which club to join?",
        choices: [
            { text: "Hockey fan club.", action: (gameState) => { gameState.player.status.reputation += 10; } },
            { text: "Academic society.", action: (gameState) => { gameState.player.status.gpa += 0.1; } },
        ]
    },
    'event_midterm_prep': {
        title: "Midterm Preparation",
        text: "Midterms approaching. Study plan?",
        choices: [
            { text: "Intense study.", action: (gameState) => { gameState.player.status.gpa += 0.2; gameState.player.status.energy -= 30; } },
            { text: "Balanced approach.", action: (gameState) => { gameState.player.status.gpa += 0.1; gameState.player.status.happiness += 5; } },
        ]
    },
    'event_final_exam': {
        title: "Final Exam",
        text: "Final exam time. Ready?",
        choices: [
            { text: "Take the exam.", action: (gameState) => {
                const prep = gameState.player.status.gpa / 4.0;
                if (Math.random() < prep) {
                    gameState.player.status.gpa += 0.3;
                } else {
                    gameState.player.status.gpa -= 0.1;
                }
            }},
        ]
    },
    'event_graduation_approach': {
        title: "Graduation Approaching",
        text: "Senior year ending. Reflect?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 20; gameState.player.status.mentalHealth += 10; } },
        ]
    },
    'event_nhl_scout': {
        title: "NHL Scout Watching",
        text: "Scout at practice. Impress?",
        choices: [
            { text: "Give 110%.", action: (gameState) => { gameState.player.status.reputation += 20; gameState.player.status.energy -= 25; } },
            { text: "Play normal.", action: (gameState) => { gameState.player.status.stress += 10; } },
        ]
    },
    'event_team_captain_vote': {
        title: "Team Captain Vote",
        text: "Vote for captain. Who?",
        choices: [
            { text: "Vote for Jake.", action: (gameState) => { gameState.relationships.teammate_jake.level += 10; } },
        ]
    },
    'event_injury_prevention': {
        title: "Injury Prevention Workshop",
        text: "Attend workshop?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.health += 10; gameState.player.status.injury -= 5; } },
            { text: "No.", action: (gameState) => { gameState.player.status.injury += 5; } },
        ]
    },
    'event_nutrition_plan': {
        title: "Create Nutrition Plan",
        text: "Work with nutritionist?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.nutrition += 20; gameState.player.status.health += 5; } },
        ]
    },
    'event_mental_training': {
        title: "Mental Training Session",
        text: "Join session?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.mentalHealth += 15; gameState.player.attributes.awareness += 2; } },
        ]
    },
    'event_rivalry_game': {
        title: "Rivalry Game",
        text: "Big game against rival. Strategy?",
        choices: [
            { text: "Aggressive play.", action: (gameState) => { gameState.player.seasonStats.points += 2; gameState.player.status.injury += 10; } },
            { text: "Defensive.", action: (gameState) => { gameState.player.attributes.defense += 1; } },
        ]
    },
    'event_post_game_interview': {
        title: "Post-Game Interview",
        text: "Media interview after game. Be honest?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; } },
            { text: "Diplomatic.", action: (gameState) => { gameState.player.attributes.awareness += 1; } },
        ]
    },
    'event_team_meeting': {
        title: "Team Meeting",
        text: "Coach calls meeting. Speak up?",
        choices: [
            { text: "Yes, share ideas.", action: (gameState) => { gameState.relationships.coach.level += 5; gameState.player.status.reputation += 5; } },
            { text: "Listen only.", action: (gameState) => {  } },
        ]
    },
    'event_offseason_training': {
        title: "Offseason Training Plan",
        text: "Plan summer training?",
        choices: [
            { text: "Intense regimen.", action: (gameState) => { gameState.player.attributes.strength += 5; gameState.player.attributes.speed += 5; gameState.player.status.energy -= 20; } },
            { text: "Balanced with rest.", action: (gameState) => { gameState.player.attributes.stamina += 3; gameState.player.status.mentalHealth += 10; } },
        ]
    },
    'event_summer_job': {
        title: "Summer Job Opportunity",
        text: "Take a job or focus on hockey?",
        choices: [
            { text: "Take job.", action: (gameState) => { gameState.player.status.reputation += 5; gameState.player.status.stress += 10; } },
            { text: "Focus on hockey.", action: (gameState) => { gameState.player.attributes.skating += 3; } },
        ]
    },
    'event_family_vacation': {
        title: "Family Vacation Invite",
        text: "Join family vacation?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 20; gameState.relationships.mom.level += 10; gameState.player.status.energy += 15; } },
            { text: "No.", action: (gameState) => { gameState.relationships.mom.level -= 5; } },
        ]
    },
    'event_new_teammate': {
        title: "New Teammate Arrival",
        text: "Welcome new freshman?",
        choices: [
            { text: "Yes, show around.", action: (gameState) => { gameState.player.status.reputation += 10; gameState.player.status.happiness += 5; } },
        ]
    },
    'event_coach_retirement_rumor': {
        title: "Coach Retirement Rumor",
        text: "Rumors about coach retiring. Discuss with team?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.relationships.teammate_jake.level += 5; gameState.player.status.stress += 5; } },
            { text: "No.", action: (gameState) => {  } },
        ]
    },
    'event_injury_teammate': {
        title: "Teammate Injury",
        text: "Teammate injured. Support them?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.relationships.teammate_tyler.level += 10; gameState.player.status.reputation += 5; } },
        ]
    },
    'event_award_nomination': {
        title: "Award Nomination",
        text: "Nominated for rookie award. Excited?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 15; gameState.player.status.happiness += 10; } },
        ]
    },
    'event_media_interview': {
        title: "Media Interview",
        text: "Local media wants interview. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; } },
            { text: "No.", action: (gameState) => { gameState.player.status.stress -= 5; } },
        ]
    },
    'event_charity_event': {
        title: "Charity Hockey Event",
        text: "Participate in charity game?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 20; gameState.player.status.happiness += 10; } },
        ]
    },
    'event_coaching_change': {
        title: "Assistant Coach Change",
        text: "New assistant coach. Adapt?",
        choices: [
            { text: "Yes, learn new techniques.", action: (gameState) => { gameState.player.attributes.defense += 2; } },
        ]
    },
    'event_trade_rumor': {
        title: "Trade Rumor",
        text: "Rumors of team trade. Worry?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.stress += 10; } },
            { text: "No, focus on game.", action: (gameState) => { gameState.player.status.mentalHealth += 5; } },
        ]
    },
    'event_playoff_push': {
        title: "Playoff Push",
        text: "Team pushing for playoffs. Extra effort?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.stamina += 2; gameState.player.status.energy -= 15; } },
        ]
    },
    'event_season_end_review': {
        title: "Season End Review",
        text: "Review season with coach.",
        choices: [
            { text: "Discuss improvements.", action: (gameState) => { gameState.relationships.coach.level += 10; gameState.player.attributes.awareness += 3; } },
        ]
    },
    'event_draft_prep': {
        title: "NHL Draft Preparation",
        text: "Prepare for draft interviews?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 20; } },
        ]
    },
    'event_summer_camp': {
        title: "Summer Hockey Camp",
        text: "Attend development camp?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.shooting += 3; gameState.player.attributes.puckHandling += 3; } },
            { text: "No.", action: (gameState) => { gameState.player.status.happiness += 10; } },
        ]
    },
    'event_international_tournament': {
        title: "International Tournament Invite",
        text: "Represent country in tournament?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 30; gameState.player.status.energy -= 30; } },
            { text: "No.", action: (gameState) => { gameState.player.status.stress -= 10; } },
        ]
    },
    'event_agent_meeting': {
        title: "Meet with Agent",
        text: "Discuss pro career options.",
        choices: [
            { text: "Sign with agent.", action: (gameState) => { gameState.player.status.reputation += 10; } },
        ]
    },
    'event_combine_invite': {
        title: "NHL Combine Invite",
        text: "Attend combine?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.strength += 2; gameState.player.attributes.speed += 2; } },
        ]
    },
    'event_draft_day': {
        title: "Draft Day",
        text: "NHL Draft day arrives.",
        choices: [
            { text: "Wait anxiously.", action: (gameState) =>  { } },
        ]
    },
    // Total: 50+ events
};