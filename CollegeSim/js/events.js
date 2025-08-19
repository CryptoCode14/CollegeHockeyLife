// js/events.js - Enhanced event system with more events and categories
import { addMessage } from './main.js';

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
            }},
            { text: "Work on defensive positioning.", action: (gameState) => {
                gameState.player.attributes.defense += 2;
                gameState.player.attributes.awareness += 1;
                gameState.player.status.stress += 5;
                gameState.player.status.energy -= 20;
                gameState.player.status.happiness += 2;
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
                gameState.player.status.stress -= 3;
                gameState.player.status.energy -= 10;
                gameState.player.status.happiness += 5;
                gameState.player.status.reputation += 2;
                
                // Random chance to meet Sarah
                if (Math.random() > 0.6 && gameState.relationships.sarah.level < 30) {
                    setTimeout(() => {
                        addMessage('sarah', 'sarah', "Hey, it was nice studying with you today. We should do it again sometime!", new Date());
                        gameState.relationships.sarah.level += 8;
                        gameState.notifications++;
                    }, 3000);
                }
            }},
            { text: "Just browse the web and relax.", action: (gameState) => {
                gameState.player.status.stress -= 10;
                gameState.player.status.energy -= 5;
                gameState.player.status.happiness += 3;
            }},
        ]
    },
    'event_dorm_room': {
        title: "East Halls - Your Dorm",
        text: "You're back in your dorm room. How do you want to spend your time?",
        choices: [
            { text: "Get some rest and recover energy.", action: (gameState) => {
                gameState.player.status.energy += 30;
                gameState.player.status.stress -= 15;
                gameState.player.status.happiness += 5;
                
                // Advance time by a few hours
                gameState.gameDate.setHours(gameState.gameDate.getHours() + 3);
            }},
            { text: "Call home and talk to your parents.", action: (gameState) => {
                gameState.player.status.stress -= 10;
                gameState.player.status.happiness += 8;
                gameState.relationships.mom.level += 5;
                
                // Add a message from mom
                setTimeout(() => {
                    addMessage('mom', 'mom', "It was so good to hear your voice today! Dad says hi too. We're so proud of you!", new Date());
                    gameState.notifications++;
                }, 2000);
            }},
            { text: "Watch game film to improve hockey IQ.", action: (gameState) => {
                gameState.player.attributes.awareness += 2;
                gameState.player.status.energy -= 10;
                gameState.player.status.happiness += 2;
            }},
            { text: "Play video games with your roommate.", action: (gameState) => {
                gameState.player.status.stress -= 15;
                gameState.player.status.energy -= 5;
                gameState.player.status.happiness += 10;
            }},
        ]
    },
    'event_class_econ': {
        title: "Business Building - ECON 101",
        text: "You're in your Economics class. Professor Miller is discussing supply and demand curves.",
        choices: [
            { text: "Pay close attention and take detailed notes.", action: (gameState) => {
                gameState.player.status.gpa += 0.15;
                gameState.player.status.energy -= 15;
                gameState.player.status.stress += 5;
                gameState.relationships.professor_miller.level += 3;
            }},
            { text: "Participate actively in class discussion.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.energy -= 10;
                gameState.player.status.reputation += 3;
                gameState.relationships.professor_miller.level += 8;
                
                // Message from professor
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "Good contributions in class today. Keep it up.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Zone out and check your phone.", action: (gameState) => {
                gameState.player.status.stress -= 5;
                gameState.player.status.gpa -= 0.05;
                gameState.relationships.professor_miller.level -= 5;
            }},
        ]
    },
    'event_student_center': {
        title: "HUB-Robeson Center",
        text: "The student center is bustling with activity. What would you like to do here?",
        choices: [
            { text: "Grab a healthy meal at the food court.", action: (gameState) => {
                gameState.player.status.energy += 15;
                gameState.player.status.health += 5;
                gameState.player.status.happiness += 3;
            }},
            { text: "Check out the club fair and sign up for activities.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.energy -= 10;
                gameState.player.status.happiness += 8;
                
                // Add a social media post
                if (gameState.phone.social && gameState.phone.social.posts) {
                    gameState.phone.social.posts.unshift({
                        user: "Student Activities",
                        handle: "PSUclubs",
                        text: "Great turnout at today's club fair! Welcome to all our new members! #PennState",
                        avatarColor: "#3498db",
                        time: "Just now",
                        likes: 24,
                        retweets: 5,
                        comments: 3
                    });
                }
            }},
            { text: "Hang out with some teammates you spot.", action: (gameState) => {
                gameState.player.status.stress -= 10;
                gameState.player.status.energy -= 5;
                gameState.player.status.happiness += 10;
                gameState.relationships.teammate_jake.level += 5;
                
                // Message from teammate
                setTimeout(() => {
                    addMessage('teammate_jake', 'teammate_jake', "Good hanging at the HUB today. Team dinner tomorrow?", new Date());
                    gameState.notifications++;
                }, 2000);
            }},
        ]
    },
    'event_gym_workout': {
        title: "Recreation Center",
        text: "You're at the campus gym. Time for a workout.",
        choices: [
            { text: "Focus on strength training.", action: (gameState) => {
                gameState.player.attributes.strength += 3;
                gameState.player.attributes.checking += 1;
                gameState.player.status.energy -= 25;
                gameState.player.status.health += 5;
                gameState.player.status.happiness += 5;
                
                // Add workout to fitness app
                if (gameState.phone.fitness && gameState.phone.fitness.workouts) {
                    gameState.phone.fitness.workouts.unshift({
                        type: "Strength Training",
                        duration: 60,
                        calories: 450,
                        date: new Date(gameState.gameDate)
                    });
                }
            }},
            { text: "Do cardio for endurance.", action: (gameState) => {
                gameState.player.attributes.stamina += 3;
                gameState.player.attributes.speed += 1;
                gameState.player.status.energy -= 20;
                gameState.player.status.health += 8;
                gameState.player.status.happiness += 5;
                
                // Add workout to fitness app
                if (gameState.phone.fitness && gameState.phone.fitness.workouts) {
                    gameState.phone.fitness.workouts.unshift({
                        type: "Cardio",
                        duration: 45,
                        calories: 380,
                        date: new Date(gameState.gameDate)
                    });
                }
            }},
            { text: "Work with the team trainer on hockey-specific exercises.", action: (gameState) => {
                gameState.player.attributes.agility += 2;
                gameState.player.attributes.balance += 2;
                gameState.player.status.energy -= 30;
                gameState.player.status.health += 5;
                gameState.player.status.happiness += 3;
                
                // Add workout to fitness app
                if (gameState.phone.fitness && gameState.phone.fitness.workouts) {
                    gameState.phone.fitness.workouts.unshift({
                        type: "Hockey Training",
                        duration: 75,
                        calories: 520,
                        date: new Date(gameState.gameDate)
                    });
                }
            }},
        ]
    },
    
    // --- RANDOM EVENTS ---
    'event_party_invite': {
        title: "Party Invitation",
        text: "Tyler texts you about a party at the lacrosse house tonight. It sounds like it could be fun, but you have practice early tomorrow.",
        choices: [
            { text: "Go to the party and have fun.", action: (gameState) => {
                gameState.player.status.energy -= 30;
                gameState.player.status.stress -= 15;
                gameState.player.status.happiness += 15;
                gameState.player.status.reputation += 5;
                gameState.relationships.teammate_tyler.level += 10;
                gameState.relationships.coach.level -= 5; // Coach might find out
                
                // Add a message from Tyler
                setTimeout(() => {
                    addMessage('teammate_tyler', 'teammate_tyler', "Great party last night! You're a legend for that beer pong shot! 🍻", new Date());
                    gameState.notifications++;
                }, 3000);
                
                // Random chance to meet Sarah
                if (Math.random() > 0.5 && gameState.relationships.sarah.level < 30) {
                    setTimeout(() => {
                        addMessage('sarah', 'sarah', "Hey, I saw you at the party last night. We should hang out sometime!", new Date());
                        gameState.relationships.sarah.level += 15;
                        gameState.notifications++;
                    }, 5000);
                }
            }},
            { text: "Skip the party and get a good night's sleep.", action: (gameState) => {
                gameState.player.status.energy += 20;
                gameState.player.status.happiness -= 5;
                gameState.relationships.teammate_tyler.level -= 5;
                gameState.relationships.coach.level += 3; // Coach appreciates responsibility
                
                // Add a message from Tyler
                setTimeout(() => {
                    addMessage('teammate_tyler', 'teammate_tyler', "Missed you at the party last night. It was epic!", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Go for a little while but leave early.", action: (gameState) => {
                gameState.player.status.energy -= 10;
                gameState.player.status.stress -= 5;
                gameState.player.status.happiness += 5;
                gameState.player.status.reputation += 2;
                gameState.relationships.teammate_tyler.level += 3;
                
                // Add a message from Tyler
                setTimeout(() => {
                    addMessage('teammate_tyler', 'teammate_tyler', "Glad you could make it for a bit last night!", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
        ]
    },
    'event_team_practice_good': {
        title: "Team Practice",
        text: "You're feeling great at practice today. Coach notices your energy and gives you a chance to run with the first line.",
        choices: [
            { text: "Give it everything you've got to impress.", action: (gameState) => {
                gameState.player.attributes.skating += 1;
                gameState.player.attributes.shooting += 1;
                gameState.player.status.energy -= 40;
                gameState.player.status.reputation += 10;
                gameState.relationships.coach.level += 8;
                gameState.player.status.happiness += 10;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "Good work with the first line today. Keep that up and you'll earn more ice time.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Play it safe and focus on fundamentals.", action: (gameState) => {
                gameState.player.attributes.awareness += 2;
                gameState.player.status.energy -= 25;
                gameState.player.status.reputation += 5;
                gameState.relationships.coach.level += 3;
                gameState.player.status.happiness += 5;
            }},
        ]
    },
    'event_team_practice_bad': {
        title: "Rough Practice",
        text: "You're not feeling your best at practice today. Your legs are heavy and you're struggling to keep up.",
        choices: [
            { text: "Push through the pain and fatigue.", action: (gameState) => {
                gameState.player.attributes.stamina += 2;
                gameState.player.status.energy -= 40;
                gameState.player.status.health -= 5;
                gameState.relationships.coach.level += 5;
                gameState.player.status.happiness -= 5;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "I noticed you struggling today but appreciated the effort. Get some rest.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Take it easy and conserve energy.", action: (gameState) => {
                gameState.player.status.energy -= 15;
                gameState.player.status.health += 3;
                gameState.relationships.coach.level -= 5;
                gameState.player.status.happiness -= 3;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "I need more effort than what I saw today. This is Division I hockey.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Talk to the trainer about how you're feeling.", action: (gameState) => {
                gameState.player.status.energy -= 20;
                gameState.player.status.health += 10;
                gameState.player.status.happiness += 0;
                
                // Add a message from coach
                setTimeout(() => {
                    addMessage('coach', 'coach', "Trainer told me about your situation. Smart to speak up. Get healthy.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
        ]
    },
    'event_class_question': {
        title: "Called On In Class",
        text: "Professor Miller suddenly calls on you to answer a question about economic principles. You...",
        choices: [
            { text: "Confidently give a well-thought-out answer.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.reputation += 5;
                gameState.relationships.professor_miller.level += 10;
                gameState.player.status.happiness += 8;
                
                // Add a message from professor
                setTimeout(() => {
                    addMessage('professor_miller', 'professor_miller', "Excellent answer in class today. You clearly understand the material.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Admit you don't know but make an educated guess.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
                gameState.player.status.reputation += 2;
                gameState.relationships.professor_miller.level += 3;
                gameState.player.status.happiness += 0;
            }},
            { text: "Freeze up and have no answer.", action: (gameState) => {
                gameState.player.status.gpa -= 0.05;
                gameState.player.status.stress += 10;
                gameState.relationships.professor_miller.level -= 5;
                gameState.player.status.happiness -= 5;
            }},
        ]
    },
    'event_dating_app_match': {
        title: "Dating App Match",
        text: "You got a match on Rink Rater! Sarah, 20, an Art major who loves hockey games, wants to chat.",
        choices: [
            { text: "Message her right away.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.relationships.sarah.level += 15;
                
                // Add Sarah to dating matches if not already there
                if (gameState.phone.dating && gameState.phone.dating.matches) {
                    const sarahProfile = gameState.phone.dating.profiles.find(p => p.name.includes("Sarah"));
                    if (sarahProfile && !gameState.phone.dating.matches.some(m => m.name.includes("Sarah"))) {
                        gameState.phone.dating.matches.push({
                            ...sarahProfile,
                            id: `match_sarah_${Date.now()}`
                        });
                    }
                }
                
                // Add a message from Sarah
                setTimeout(() => {
                    addMessage('sarah', 'sarah', "Hey! Thanks for the message. I've seen you around campus before. You play hockey, right?", new Date());
                    gameState.notifications++;
                }, 2000);
            }},
            { text: "Wait a bit before responding.", action: (gameState) => {
                gameState.player.status.happiness += 5;
                gameState.relationships.sarah.level += 5;
                
                // Add Sarah to dating matches if not already there
                if (gameState.phone.dating && gameState.phone.dating.matches) {
                    const sarahProfile = gameState.phone.dating.profiles.find(p => p.name.includes("Sarah"));
                    if (sarahProfile && !gameState.phone.dating.matches.some(m => m.name.includes("Sarah"))) {
                        gameState.phone.dating.matches.push({
                            ...sarahProfile,
                            id: `match_sarah_${Date.now()}`
                        });
                    }
                }
                
                // Add a message from Sarah later
                setTimeout(() => {
                    addMessage('sarah', 'sarah', "Hey there! We matched on Rink Rater. How's it going?", new Date());
                    gameState.notifications++;
                }, 5000);
            }},
            { text: "Ignore the match and focus on hockey.", action: (gameState) => {
                gameState.player.status.happiness -= 3;
                gameState.relationships.sarah.level -= 5;
                gameState.player.attributes.awareness += 1; // More focus on hockey
            }},
        ]
    },
    'event_homesick': {
        title: "Feeling Homesick",
        text: "It's been a few weeks away from home, and you're starting to feel homesick. What do you do?",
        choices: [
            { text: "Call your parents for support.", action: (gameState) => {
                gameState.player.status.stress -= 15;
                gameState.player.status.happiness += 10;
                gameState.relationships.mom.level += 10;
                
                // Add a message from mom
                setTimeout(() => {
                    addMessage('mom', 'mom', "It was so good to talk to you, sweetie. We miss you too! Remember we're always here for you. ❤️", new Date());
                    gameState.notifications++;
                }, 2000);
                
                // Add a care package note
                setTimeout(() => {
                    addMessage('mom', 'mom', "I'm sending you a care package with your favorite snacks and some new socks. Should arrive by Friday! 📦", new Date());
                    gameState.notifications++;
                }, 4000);
            }},
            { text: "Talk to your teammates about it.", action: (gameState) => {
                gameState.player.status.stress -= 10;
                gameState.player.status.happiness += 5;
                gameState.relationships.teammate_jake.level += 8;
                
                // Add a message from teammate
                setTimeout(() => {
                    addMessage('teammate_jake', 'teammate_jake', "Hey man, thanks for opening up earlier. We're all in this together. Let's grab dinner this weekend.", new Date());
                    gameState.notifications++;
                }, 3000);
            }},
            { text: "Keep it to yourself and try to stay busy.", action: (gameState) => {
                gameState.player.status.stress += 5;
                gameState.player.status.happiness -= 5;
                gameState.player.attributes.awareness += 1; // More focus on hockey and school
            }},
        ]
    },
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
    }
};