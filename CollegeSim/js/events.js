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
            { text: "Skip it and relax in the dorm.", action: (gameState) => {
                gameState.player.status.energy += 15;
                gameState.player.status.stress -= 10;
                gameState.player.status.happiness += 5;
                gameState.player.status.reputation -= 2; // Slight rep hit
            }},
            { text: "Go shopping for new gear with money.", action: (gameState) => {
                if (gameState.player.money >= 50) {
                    gameState.player.money -= 50;
                    gameState.player.attributes.strength += 2;
                    gameState.player.status.happiness += 5;
                } else {
                    alert("Not enough money!");
                }
            }}
        ]
    },
    // Existing events from original code (assuming based on patterns)
    'event_party_invite': {
        title: "Party Invite",
        text: "Teammate invites you to a party. Go?",
        choices: [
            { text: "Yes, have fun.", action: (gameState) => {
                gameState.player.status.happiness += 10;
                gameState.player.status.energy -= 15;
                gameState.player.status.reputation += 5;
                gameState.relationships.teammate_jake.level += 5;
            }},
            { text: "No, study instead.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.stress -= 5;
            }}
        ]
    },
    'event_teammate_conflict': {
        title: "Teammate Conflict",
        text: "Argument with a teammate. How to handle?",
        choices: [
            { text: "Talk it out.", action: (gameState) => {
                gameState.relationships.teammate_tyler.level += 10;
                gameState.player.status.mentalHealth += 5;
            }},
            { text: "Ignore it.", action: (gameState) => {
                gameState.player.status.stress += 10;
            }}
        ]
    },
    'event_dating_app_match': {
        title: "Dating App Match",
        text: "You matched with someone. Message them?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.happiness += 8;
                addMessage('sarah', 'sarah', "Hey! Saw you're a hockey player. Cool!", new Date());
            }},
            { text: "No.", action: (gameState) => {} }
        ]
    },
    'event_study_group': {
        title: "Study Group",
        text: "Join a study group for your class?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.gpa += 0.15;
                gameState.player.status.stress -= 5;
                gameState.player.status.energy -= 10;
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_missed_assignment': {
        title: "Missed Assignment",
        text: "You forgot an assignment. What to do?",
        choices: [
            { text: "Ask for extension.", action: (gameState) => {
                if (Math.random() > 0.5) {
                    gameState.player.status.gpa -= 0.05;
                } else {
                    gameState.player.status.gpa -= 0.2;
                    gameState.player.status.stress += 10;
                }
            }},
            { text: "Accept the zero.", action: (gameState) => {
                gameState.player.status.gpa -= 0.1;
                gameState.player.status.mentalHealth -= 5;
            }}
        ]
    },
    'event_professor_meeting': {
        title: "Professor Meeting",
        text: "Meet with professor about grades?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.professor_miller.level += 10;
                gameState.player.status.gpa += 0.05;
            }}
        ]
    },
    'event_homesick': {
        title: "Feeling Homesick",
        text: "Missing home. Call mom?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.mom.level += 5;
                gameState.player.status.happiness += 5;
                addMessage('mom', 'mom', "Miss you too! Keep up the good work.", new Date());
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_health_issue': {
        title: "Health Issue",
        text: "Not feeling well. Go to clinic?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.health += 10;
                gameState.player.status.energy -= 5;
            }},
            { text: "Ignore.", action: (gameState) => {
                gameState.player.status.health -= 10;
                gameState.player.status.injury += 5;
            }}
        ]
    },
    'event_financial_problem': {
        title: "Financial Problem",
        text: "Low on money. Get a part-time job?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.money += 100;
                gameState.player.status.energy -= 10;
                gameState.player.status.stress += 5;
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.stress += 10;
            }}
        ]
    },
    'event_team_practice_good': {
        title: "Good Practice",
        text: "Great practice session. Keep it up?",
        choices: [
            { text: "Push harder.", action: (gameState) => {
                gameState.player.attributes.stamina += 2;
                gameState.player.status.energy -= 10;
            }}
        ]
    },
    'event_team_practice_bad': {
        title: "Bad Practice",
        text: "Rough practice. What to do?",
        choices: [
            { text: "Extra effort.", action: (gameState) => {
                gameState.player.attributes.awareness += 1;
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_class_question': {
        title: "Class Question",
        text: "Professor asks a question. Answer?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                if (Math.random() > 0.7) {
                    gameState.player.status.reputation += 3;
                } else {
                    gameState.player.status.reputation -= 2;
                }
            }},
            { text: "No.", action: (gameState) => {} }
        ]
    },
    'event_class_group_project': {
        title: "Group Project",
        text: "Assigned to a group project. Lead it?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.stress += 10;
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.stress -= 5;
            }}
        ]
    },
    'event_oversleep': {
        title: "Overslept",
        text: "Missed morning class. Explain?",
        choices: [
            { text: "Honest excuse.", action: (gameState) => {
                gameState.player.status.gpa -= 0.05;
            }},
            { text: "Skip explanation.", action: (gameState) => {
                gameState.player.status.gpa -= 0.1;
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_class_pop_quiz': {
        title: "Pop Quiz",
        text: "Surprise quiz in class. Prepared?",
        choices: [
            { text: "Studied.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
            }},
            { text: "Not prepared.", action: (gameState) => {
                gameState.player.status.gpa -= 0.1;
            }}
        ]
    },
    'event_party_drama': {
        title: "Party Drama",
        text: "Drama at the party. Intervene?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.reputation += 5;
                gameState.player.status.stress += 10;
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.happiness -= 5;
            }}
        ]
    },
    'event_snow_delay': {
        title: "Snow Delay",
        text: "Practice delayed due to snow. Extra gym time?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.attributes.strength += 2;
                gameState.player.status.energy -= 10;
            }}
        ]
    },
    'event_extra_practice': {
        title: "Extra Practice",
        text: "Coach offers extra ice time. Take it?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.attributes.puckHandling += 2;
                gameState.player.status.energy -= 15;
            }}
        ]
    },
    'event_coach_feedback': {
        title: "Coach Feedback",
        text: "Coach gives feedback. Improve defense?",
        choices: [
            { text: "Focus on it.", action: (gameState) => {
                gameState.player.attributes.defense += 3;
            }}
        ]
    },
    'event_team_bonding': {
        title: "Team Bonding",
        text: "Team bonding event. Participate fully?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.teammate_jake.level += 5;
                gameState.relationships.teammate_tyler.level += 5;
                gameState.player.status.happiness += 5;
            }}
        ]
    },
    'event_library_study': {
        title: "Library Study",
        text: "Quiet study time at library. Focus on which subject?",
        choices: [
            { text: "Math.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
            }}
        ]
    },
    'event_dorm_room': {
        title: "Dorm Room",
        text: "Roommate wants to hang out. Join?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.happiness += 5;
            }}
        ]
    },
    'event_class_econ': {
        title: "Econ Class",
        text: "Econ lecture. Take notes?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
            }}
        ]
    },
    'event_student_center': {
        title: "Student Center",
        text: "Grab food at HUB. Healthy choice?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.nutrition += 5;
            }},
            { text: "No.", action: (gameState) => {
                gameState.player.status.nutrition -= 5;
                gameState.player.status.happiness += 3;
            }}
        ]
    },
    'event_gym_workout': {
        title: "Gym Workout",
        text: "Hit the gym. Focus on strength?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.attributes.strength += 2;
                gameState.player.status.energy -= 10;
            }}
        ]
    },
    'event_random_encounter': {
        title: "Random Encounter",
        text: "Bump into professor. Chat?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.professor_miller.level += 5;
            }}
        ]
    },
    // New events added
    'event_shopping_trip': {
        title: "Shopping Trip",
        text: "You have some free time. Head to the mall?",
        choices: [
            { text: "Buy new hockey stick ($100).", action: (gameState) => {
                if (gameState.player.money >= 100) {
                    gameState.player.money -= 100;
                    gameState.player.attributes.shooting += 5;
                }
            }},
            { text: "Get coffee ($5).", action: (gameState) => {
                if (gameState.player.money >= 5) {
                    gameState.player.money -= 5;
                    gameState.player.status.energy += 10;
                }
            }},
            { text: "Window shop.", action: (gameState) => {
                gameState.player.status.happiness += 3;
            }}
        ]
    },
    'event_rainy_day': {
        title: "Rainy Day",
        text: "It's raining hard. Practice might be affected.",
        choices: [
            { text: "Push through.", action: (gameState) => {
                gameState.player.status.injury += 10; // Increased risk
                gameState.player.attributes.stamina += 2;
            }},
            { text: "Stay indoors and study.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
            }}
        ]
    },
    'event_group_chat': {
        title: "Team Group Chat",
        text: "Teammates are planning a night out. Join?",
        choices: [
            { text: "Yes, build bonds.", action: (gameState) => {
                gameState.relationships.teammate_jake.level += 10;
                gameState.relationships.teammate_tyler.level += 10;
                gameState.player.status.energy -= 15;
            }},
            { text: "No, rest.", action: (gameState) => {
                gameState.player.status.energy += 10;
            }}
        ]
    },
    'event_achievement_unlock': {
        title: "Achievement Unlocked",
        text: "You've reached 10 goals! Reward?",
        choices: [
            { text: "Claim $50 bonus.", action: (gameState) => {
                gameState.player.money += 50;
                gameState.progress.achievementsUnlocked.push('goal_master');
            }}
        ]
    },
    'event_battery_low': {
        title: "Phone Battery Low",
        text: "Your phone is at 20%. Charge it?",
        choices: [
            { text: "Charge now.", action: (gameState) => {
                gameState.phone.battery = 100;
                gameState.player.status.stress -= 5;
            }},
            { text: "Ignore.", action: (gameState) => {
                gameState.phone.battery -= 10; // Risk missing notifications
            }}
        ]
    },
    'event_weather_alert': {
        title: "Weather Alert",
        text: "Snow storm incoming. Prepare?",
        choices: [
            { text: "Stock up on food ($20).", action: (gameState) => {
                gameState.player.money -= 20;
                gameState.player.status.nutrition += 10;
            }}
        ]
    },
    'event_mini_game_practice': {
        title: "Practice Mini-Game",
        text: "Choose focus: Shoot or Skate?",
        choices: [
            { text: "Shoot.", action: (gameState) => {
                if (Math.random() > 0.5) gameState.player.attributes.shooting += 3;
                else gameState.player.status.injury += 5;
            }},
            { text: "Skate.", action: (gameState) => {
                if (Math.random() > 0.5) gameState.player.attributes.skating += 3;
                else gameState.player.status.energy -= 10;
            }}
        ]
    },
    'event_date_match': {
        title: "Date with Match",
        text: "Go on a date with your match?",
        choices: [
            { text: "Yes ($30).", action: (gameState) => {
                gameState.player.money -= 30;
                gameState.player.status.happiness += 15;
            }}
        ]
    },
    'event_prof_email': {
        title: "Professor Email",
        text: "Reminder for assignment. Respond?",
        choices: [
            { text: "Yes, submit early.", action: (gameState) => {
                gameState.player.status.gpa += 0.05;
            }}
        ]
    },
    'event_team_rivalry': {
        title: "Rivalry Game",
        text: "Big game against Michigan. Pump up?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.attributes.awareness += 2;
            }}
        ]
    },
    // Additional fleshed-out events
    'event_injury_recovery': {
        title: "Injury Recovery",
        text: "Dealing with a minor injury. Rehab?",
        choices: [
            { text: "Yes, follow plan.", action: (gameState) => {
                gameState.player.status.injury -= 10;
                gameState.player.status.health += 5;
            }},
            { text: "Push through pain.", action: (gameState) => {
                gameState.player.status.injury += 5;
                gameState.player.attributes.strength += 1;
            }}
        ]
    },
    'event_academic_probation': {
        title: "Academic Probation Warning",
        text: "GPA is slipping. Meet advisor?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.stress -= 5;
            }},
            { text: "Ignore.", action: (gameState) => {
                gameState.player.status.stress += 10;
            }}
        ]
    },
    'event_team_captain_vote': {
        title: "Team Captain Vote",
        text: "Vote for team captain. Who?",
        choices: [
            { text: "Vote for Jake.", action: (gameState) => {
                gameState.relationships.teammate_jake.level += 5;
            }},
            { text: "Vote for yourself.", action: (gameState) => {
                if (gameState.player.status.reputation > 70) {
                    gameState.player.status.reputation += 10;
                } else {
                    gameState.player.status.reputation -= 5;
                }
            }}
        ]
    },
    'event_charity_event': {
        title: "Charity Event",
        text: "Team charity event. Volunteer?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.reputation += 10;
                gameState.player.status.happiness += 5;
                gameState.player.status.energy -= 10;
            }}
        ]
    },
    'event_midterm_crunch': {
        title: "Midterm Crunch",
        text: "Midterms approaching. All-nighter?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.gpa += 0.2;
                gameState.player.status.energy -= 20;
                gameState.player.status.stress += 15;
            }},
            { text: "Paced study.", action: (gameState) => {
                gameState.player.status.gpa += 0.1;
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_romantic_date': {
        title: "Romantic Date",
        text: "Date with Sarah. Impress her?",
        choices: [
            { text: "Yes, plan something special.", action: (gameState) => {
                if (gameState.player.money >= 50) {
                    gameState.player.money -= 50;
                    gameState.relationships.sarah.level += 15;
                    gameState.player.status.happiness += 10;
                }
            }}
        ]
    },
    'event_coach_meeting': {
        title: "One-on-One with Coach",
        text: "Coach wants to discuss performance. Honest?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.coach.level += 10;
                gameState.player.attributes.awareness += 2;
            }}
        ]
    },
    'event_family_visit': {
        title: "Family Visit",
        text: "Mom coming to visit. Spend time?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.relationships.mom.level += 10;
                gameState.player.status.happiness += 10;
                gameState.player.status.energy -= 5;
            }}
        ]
    },
    'event_rival_taunt': {
        title: "Rival Taunt",
        text: "Rival player taunts you. Respond?",
        choices: [
            { text: "Ignore.", action: (gameState) => {
                gameState.player.status.mentalHealth += 5;
            }},
            { text: "Fire back.", action: (gameState) => {
                gameState.player.status.reputation += 3;
                gameState.player.status.stress += 5;
            }}
        ]
    },
    'event_scholarship_review': {
        title: "Scholarship Review",
        text: "Athletic scholarship review. Perform well?",
        choices: [
            { text: "Impress committee.", action: (gameState) => {
                if (gameState.player.status.gpa > 3.0 && gameState.player.seasonStats.points > 10) {
                    gameState.player.money += 200;
                }
            }}
        ]
    },
    'event_internship_offer': {
        title: "Internship Offer",
        text: "Summer internship offer. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.money += 500;
                gameState.player.status.stress += 10;
                gameState.player.attributes.awareness += 3;
            }},
            { text: "No, focus on hockey.", action: (gameState) => {
                gameState.player.attributes.skating += 2;
            }}
        ]
    },
    'event_media_interview': {
        title: "Media Interview",
        text: "Local media wants an interview. Agree?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.status.reputation += 15;
            }},
            { text: "No.", action: (gameState) => {} }
        ]
    },
    'event_defense_drill': {
        title: "Defense Drill",
        text: "Extra defense drills. Join?",
        choices: [
            { text: "Yes.", action: (gameState) => {
                gameState.player.attributes.defense += 2;
            }}
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
    // Total: 50+ events (expanded further)
    'event_spring_break': {
        title: "Spring Break",
        text: "Spring break plans?",
        choices: [
            { text: "Train extra.", action: (gameState) => { gameState.player.attributes.agility += 3; } },
            { text: "Relax at home.", action: (gameState) => { gameState.player.status.energy += 20; gameState.player.status.happiness += 10; } },
        ]
    },
    'event_senior_night': {
        title: "Senior Night",
        text: "Celebrate seniors. Give speech?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; } },
        ]
    },
    'event_nhl_scout_visit': {
        title: "NHL Scout Visit",
        text: "Scouts watching practice. Impress?",
        choices: [
            { text: "Give 110%.", action: (gameState) => { gameState.player.status.reputation += 15; gameState.player.status.energy -= 10; } },
        ]
    },
    'event_academic_award': {
        title: "Academic Award",
        text: "Nominated for academic all-star. Attend ceremony?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.gpa += 0.1; gameState.player.status.reputation += 5; } },
        ]
    },
    'event_team_prank': {
        title: "Team Prank",
        text: "Teammates planning a prank. Join in?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 5; gameState.relationships.teammate_tyler.level += 5; } },
            { text: "No.", action: (gameState) => { gameState.player.status.reputation -= 2; } },
        ]
    },
    'event_study_abroad_info': {
        title: "Study Abroad Info Session",
        text: "Info session for study abroad. Interested?",
        choices: [
            { text: "Attend.", action: (gameState) => { gameState.player.attributes.awareness += 2; } },
        ]
    },
    'event_volunteer_drive': {
        title: "Volunteer Drive",
        text: "Campus volunteer drive. Sign up?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 5; gameState.player.status.happiness += 3; } },
        ]
    },
    'event_campus_protest': {
        title: "Campus Protest",
        text: "Student protest on campus. Join?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 5; gameState.player.status.stress += 5; } },
            { text: "No.", action: (gameState) => {} },
        ]
    },
    'event_new_equipment': {
        title: "New Equipment Day",
        text: "Team gets new equipment. Test it out?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.puckHandling += 1; } },
        ]
    },
    'event_mentor_session': {
        title: "Mentor Session",
        text: "Upperclassman offers mentoring. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.checking += 2; } },
        ]
    },
    'event_fan_meet_greet': {
        title: "Fan Meet and Greet",
        text: "Team fan event. Interact with fans?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; } },
        ]
    },
    'event_nutrition_seminar': {
        title: "Nutrition Seminar",
        text: "Attend nutrition seminar for athletes?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.nutrition += 10; } },
        ]
    },
    'event_sleep_study': {
        title: "Sleep Study",
        text: "Participate in campus sleep study?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.energy += 5; gameState.player.money += 50; } },
        ]
    },
    'event_art_exhibit': {
        title: "Art Exhibit",
        text: "Attend Sarah's art exhibit?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.relationships.sarah.level += 10; } },
        ]
    },
    'event_hackathon': {
        title: "Hackathon",
        text: "Campus hackathon. Join a team?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.awareness += 3; gameState.player.status.stress += 10; } },
        ]
    },
    'event_concert_ticket': {
        title: "Concert Tickets",
        text: "Win concert tickets. Go?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 15; } },
        ]
    },
    'event_lost_wallet': {
        title: "Lost Wallet",
        text: "Find a lost wallet. Return it?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 10; gameState.player.money += 20; } },
            { text: "Keep it.", action: (gameState) => { gameState.player.money += 100; gameState.player.status.mentalHealth -= 10; } },
        ]
    },
    'event_roommate_dispute': {
        title: "Roommate Dispute",
        text: "Argument with roommate. Resolve?",
        choices: [
            { text: "Talk it out.", action: (gameState) => { gameState.player.status.stress -= 5; } },
        ]
    },
    'event_campus_job': {
        title: "Campus Job Offer",
        text: "Part-time campus job. Take it?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.money += 150; gameState.player.status.energy -= 10; } },
        ]
    },
    'event_viral_post': {
        title: "Viral Post",
        text: "Your social post goes viral. Respond to fame?",
        choices: [
            { text: "Engage.", action: (gameState) => { gameState.player.status.reputation += 20; } },
        ]
    },
    'event_study_abroad': {
        title: "Study Abroad Opportunity",
        text: "Chance to study abroad next semester. Apply?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.awareness += 5; gameState.player.status.stress += 10; } },
        ]
    },
    'event_team_bus_breakdown': {
        title: "Team Bus Breakdown",
        text: "Bus breaks down on way to game. Help fix?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 5; } },
        ]
    },
    'event_surprise_birthday': {
        title: "Surprise Birthday Party",
        text: "Teammates throw surprise party. Enjoy?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 20; } },
        ]
    },
    'event_academic_conference': {
        title: "Academic Conference",
        text: "Invite to present at conference. Go?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.gpa += 0.2; gameState.player.status.reputation += 10; } },
        ]
    },
    'event_injury_setback': {
        title: "Injury Setback",
        text: "Injury worsens. See specialist?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.injury -= 15; gameState.player.money -= 100; } },
        ]
    },
    'event_leadership_role': {
        title: "Leadership Role",
        text: "Offered alternate captain. Accept?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 15; gameState.player.status.stress += 5; } },
        ]
    },
    'event_family_emergency': {
        title: "Family Emergency",
        text: "Family emergency at home. Go back?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.relationships.mom.level += 20; gameState.player.status.happiness -= 10; gameState.player.status.energy -= 20; } },
            { text: "Stay.", action: (gameState) => { gameState.player.status.mentalHealth -= 10; } },
        ]
    },
    'event_nhl_interest': {
        title: "NHL Interest",
        text: "NHL team shows interest. Get excited?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.motivation += 10; } }, // Assuming motivation stat added
        ]
    },
    'event_season_awards': {
        title: "Season Awards",
        text: "Nominated for rookie of the year. Attend banquet?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 20; } },
        ]
    },
    // Even more events to reach 80+
    'event_power_outage': {
        title: "Power Outage",
        text: "Campus power outage. Study by flashlight?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.gpa += 0.05; } },
        ]
    },
    'event_new_friend': {
        title: "New Friend",
        text: "Meet potential new friend in class. Hang out?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 5; } },
        ]
    },
    'event_lost_bet': {
        title: "Lost Bet",
        text: "Lost a bet with teammate. Pay up?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.money -= 20; gameState.relationships.teammate_jake.level += 5; } },
        ]
    },
    'event_surprise_test': {
        title: "Surprise Test",
        text: "Unannounced test. Wing it?",
        choices: [
            { text: "Try your best.", action: (gameState) => { if (Math.random() > 0.5) gameState.player.status.gpa += 0.05; else gameState.player.status.gpa -= 0.05; } },
        ]
    },
    'event_campus_festival': {
        title: "Campus Festival",
        text: "Annual campus festival. Attend?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 10; gameState.player.status.energy -= 5; } },
        ]
    },
    'event_gear_malfunction': {
        title: "Gear Malfunction",
        text: "Skate blade breaks. Buy new ($50)?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.money -= 50; gameState.player.attributes.skating += 1; } },
        ]
    },
    'event_mentor_advice': {
        title: "Mentor Advice",
        text: "Alumni mentor offers advice. Listen?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.defense += 2; } },
        ]
    },
    'event_social_media_drama': {
        title: "Social Media Drama",
        text: "Drama on Chirper. Respond?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation -= 5; } },
            { text: "Ignore.", action: (gameState) => { gameState.player.status.mentalHealth += 5; } },
        ]
    },
    'event_exam_cheat': {
        title: "Exam Temptation",
        text: "Opportunity to cheat on exam. Do it?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.gpa += 0.3; gameState.player.status.mentalHealth -= 15; } },
            { text: "No.", action: (gameState) => { gameState.player.status.mentalHealth += 5; } },
        ]
    },
    'event_team_bus_trip': {
        title: "Team Bus Trip",
        text: "Long bus trip. Bond with team?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.relationships.coach.level += 5; } },
        ]
    },
    // Continue adding until sufficiently large (80+ total)
    'event_campus_lecture_series': {
        title: "Campus Lecture Series",
        text: "Guest speaker on sports psychology. Attend?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.mentalHealth += 5; gameState.player.attributes.awareness += 1; } },
        ]
    },
    'event_fraternity_rush': {
        title: "Fraternity Rush",
        text: "Invited to fraternity rush event. Go?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.reputation += 5; gameState.player.status.stress += 5; } },
            { text: "No.", action: (gameState) => {} },
        ]
    },
    'event_art_contest': {
        title: "Art Contest",
        text: "Enter campus art contest?",
        choices: [
            { text: "Yes.", action: (gameState) => { if (Math.random() > 0.5) gameState.player.status.reputation += 10; } },
        ]
    },
    'event_hacknight': {
        title: "Hack Night",
        text: "Overnight coding event. Participate?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.puckHandling += 1; gameState.player.status.energy -= 20; } }, // Analogous to skill building
        ]
    },
    'event_charity_run': {
        title: "Charity Run",
        text: "5K charity run. Join?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.speed += 2; gameState.player.status.happiness += 5; } },
        ]
    },
    'event_movie_night': {
        title: "Movie Night",
        text: "Dorm movie night. Attend?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 5; } },
        ]
    },
    'event_lab_experiment': {
        title: "Lab Experiment",
        text: "Science lab experiment. Careful?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.gpa += 0.05; } },
        ]
    },
    'event_debate_club': {
        title: "Debate Club",
        text: "Join debate club meeting?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.attributes.awareness += 2; } },
        ]
    },
    'event_cooking_class': {
        title: "Cooking Class",
        text: "Campus cooking class. Sign up?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.nutrition += 5; } },
        ]
    },
    'event_photography_workshop': {
        title: "Photography Workshop",
        text: "Learn photography. Interested?",
        choices: [
            { text: "Yes.", action: (gameState) => { gameState.player.status.happiness += 5; } },
        ]
    },
    // And so on for more events...
};