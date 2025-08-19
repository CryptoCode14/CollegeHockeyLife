// js/app-data.js - Enhanced data for phone apps

// Social media posts for the Chirper app
export const socialFeedPosts = [
    { 
        user: 'Jake (C)', 
        handle: 'jwall_21', 
        text: 'First team meeting of the year. The boys are buzzing. #GoLions #HockeyIsBack', 
        avatarColor: '#27ae60',
        time: '2h',
        likes: 42,
        retweets: 8,
        comments: 5
    },
    { 
        user: 'PSU Hockey', 
        handle: 'PennStateHky', 
        text: 'Pre-season camp starts next week! Get ready for another exciting season at Pegula! #WeAre #HockeyValley', 
        avatarColor: '#3498db',
        time: '5h',
        likes: 156,
        retweets: 37,
        comments: 12
    },
    { 
        user: 'Coach Davis', 
        handle: 'CoachD_PSU', 
        text: 'The standard is the standard. It all starts with hard work. Looking forward to seeing what this team can accomplish.', 
        avatarColor: '#34495e',
        time: '1d',
        likes: 89,
        retweets: 15,
        comments: 3
    },
    { 
        user: 'Penn State', 
        handle: 'penn_state', 
        text: 'Welcome back, students! Campus is alive again and we couldn\'t be more excited for the new academic year. #WeAre', 
        avatarColor: '#2980b9',
        time: '1d',
        likes: 1243,
        retweets: 302,
        comments: 87
    },
    { 
        user: 'Tyler', 
        handle: 'ty_snipes', 
        text: 'Dorm is all set up and ready for sophomore year. Hockey season can\'t come soon enough! 🏒', 
        avatarColor: '#8e44ad',
        time: '2d',
        likes: 35,
        retweets: 2,
        comments: 8
    },
    { 
        user: 'Sarah', 
        handle: 'sarah_creates', 
        text: 'Just finished my first art installation of the semester. Come check it out at the HUB gallery this week! #PennStateArts', 
        avatarColor: '#e84393',
        time: '2d',
        likes: 67,
        retweets: 12,
        comments: 9
    },
    { 
        user: 'Big Ten Hockey', 
        handle: 'B1GHockey', 
        text: 'The countdown to the 2025-26 season is on! Which team are you most excited to watch? #B1GHockey', 
        avatarColor: '#0984e3',
        time: '3d',
        likes: 215,
        retweets: 42,
        comments: 78
    },
];

// Dating profiles for the Rink Rater app
export const datingProfiles = [
    { 
        id: 'profile_1',
        name: 'Sarah, 20', 
        bio: 'Art major. Just looking for someone to go to hockey games with 😉. Love painting, photography, and good coffee.', 
        img: 'https://i.pravatar.cc/300?img=1',
        school: 'Penn State',
        distance: '1 mile away',
        interests: ['Art', 'Hockey', 'Photography', 'Coffee']
    },
    { 
        id: 'profile_2',
        name: 'Emily, 21', 
        bio: 'Love hiking and coffee. Psychology major. Looking for someone to explore nature trails with on weekends!', 
        img: 'https://i.pravatar.cc/300?img=2',
        school: 'Penn State',
        distance: '2 miles away',
        interests: ['Hiking', 'Psychology', 'Nature', 'Coffee']
    },
    { 
        id: 'profile_3',
        name: 'Jessica, 19', 
        bio: 'Just a girl who loves sports and dogs. Business major. Looking for someone who can make me laugh.', 
        img: 'https://i.pravatar.cc/300?img=3',
        school: 'Penn State',
        distance: '0.5 miles away',
        interests: ['Sports', 'Dogs', 'Business', 'Comedy']
    },
    { 
        id: 'profile_4',
        name: 'Chloe, 22', 
        bio: 'Grad student in Engineering. Show me the best spot for pizza in town. Love sci-fi movies and board games.', 
        img: 'https://i.pravatar.cc/300?img=4',
        school: 'Penn State',
        distance: '3 miles away',
        interests: ['Engineering', 'Pizza', 'Sci-Fi', 'Board Games']
    },
    { 
        id: 'profile_5',
        name: 'Madison, 20', 
        bio: 'Journalism major. Hockey fan since I was little. Looking for someone to watch games with and have good conversations.', 
        img: 'https://i.pravatar.cc/300?img=5',
        school: 'Penn State',
        distance: '1.5 miles away',
        interests: ['Journalism', 'Hockey', 'Writing', 'Film']
    },
    { 
        id: 'profile_6',
        name: 'Olivia, 21', 
        bio: 'Nursing student. Love fitness, healthy cooking, and outdoor activities. Looking for someone active and positive!', 
        img: 'https://i.pravatar.cc/300?img=6',
        school: 'Penn State',
        distance: '2 miles away',
        interests: ['Nursing', 'Fitness', 'Cooking', 'Outdoors']
    },
    { 
        id: 'profile_7',
        name: 'Zoe, 19', 
        bio: 'Computer Science major. Gamer, coder, and coffee addict. Let\'s talk about tech or play some games together!', 
        img: 'https://i.pravatar.cc/300?img=7',
        school: 'Penn State',
        distance: '0.8 miles away',
        interests: ['Computer Science', 'Gaming', 'Coding', 'Coffee']
    },
    { 
        id: 'profile_8',
        name: 'Ava, 20', 
        bio: 'Music major. Singer, pianist, and concert enthusiast. Looking for someone to share my passion for music with!', 
        img: 'https://i.pravatar.cc/300?img=8',
        school: 'Penn State',
        distance: '1.2 miles away',
        interests: ['Music', 'Piano', 'Concerts', 'Singing']
    },
];

// Team roster data
export const teamRoster = [
    {
        id: 'player_1',
        name: 'Jake Wallace',
        number: 21,
        position: 'Center',
        year: 'Senior',
        hometown: 'Minneapolis, MN',
        height: '6\'1"',
        weight: '195 lbs',
        shoots: 'Right',
        role: 'Captain',
        attributes: {
            skating: 85,
            shooting: 88,
            puckHandling: 90,
            checking: 75,
            defense: 82
        }
    },
    {
        id: 'player_2',
        name: 'Tyler Snipes',
        number: 13,
        position: 'Right Wing',
        year: 'Sophomore',
        hometown: 'Boston, MA',
        height: '5\'11"',
        weight: '180 lbs',
        shoots: 'Left',
        role: 'Alternate Captain',
        attributes: {
            skating: 92,
            shooting: 90,
            puckHandling: 85,
            checking: 70,
            defense: 75
        }
    },
    {
        id: 'player_3',
        name: 'Mike Chen',
        number: 5,
        position: 'Defenseman',
        year: 'Junior',
        hometown: 'San Jose, CA',
        height: '6\'3"',
        weight: '210 lbs',
        shoots: 'Right',
        role: 'Alternate Captain',
        attributes: {
            skating: 80,
            shooting: 75,
            puckHandling: 82,
            checking: 90,
            defense: 92
        }
    },
    {
        id: 'player_4',
        name: 'Alex Johnson',
        number: 88,
        position: 'Forward',
        year: 'Freshman',
        hometown: 'Chicago, IL',
        height: '6\'0"',
        weight: '185 lbs',
        shoots: 'Right',
        role: 'Player',
        attributes: {
            skating: 65,
            shooting: 70,
            puckHandling: 68,
            checking: 60,
            defense: 55
        }
    },
    {
        id: 'player_5',
        name: 'David Smith',
        number: 30,
        position: 'Goalie',
        year: 'Senior',
        hometown: 'Toronto, ON',
        height: '6\'2"',
        weight: '200 lbs',
        catches: 'Left',
        role: 'Starting Goalie',
        attributes: {
            reflexes: 88,
            positioning: 90,
            puckHandling: 75,
            rebound: 85,
            mentalToughness: 92
        }
    },
    {
        id: 'player_6',
        name: 'Ryan Miller',
        number: 23,
        position: 'Left Wing',
        year: 'Junior',
        hometown: 'Detroit, MI',
        height: '6\'1"',
        weight: '190 lbs',
        shoots: 'Right',
        role: 'Player',
        attributes: {
            skating: 83,
            shooting: 87,
            puckHandling: 80,
            checking: 78,
            defense: 75
        }
    },
    {
        id: 'player_7',
        name: 'Kevin Park',
        number: 44,
        position: 'Defenseman',
        year: 'Sophomore',
        hometown: 'Philadelphia, PA',
        height: '6\'4"',
        weight: '215 lbs',
        shoots: 'Left',
        role: 'Player',
        attributes: {
            skating: 78,
            shooting: 72,
            puckHandling: 75,
            checking: 88,
            defense: 85
        }
    },
    {
        id: 'player_8',
        name: 'Jason Rodriguez',
        number: 9,
        position: 'Center',
        year: 'Freshman',
        hometown: 'Miami, FL',
        height: '5\'10"',
        weight: '175 lbs',
        shoots: 'Left',
        role: 'Player',
        attributes: {
            skating: 80,
            shooting: 75,
            puckHandling: 82,
            checking: 65,
            defense: 70
        }
    },
];

// Schedule data
export const seasonSchedule = [
    {
        id: 'game_1',
        opponent: 'Michigan',
        date: '2025-10-15',
        time: '19:00',
        location: 'Home',
        isConference: true,
        result: null // null for future games, { homeScore: 3, awayScore: 2, win: true } for completed games
    },
    {
        id: 'game_2',
        opponent: 'Ohio State',
        date: '2025-10-22',
        time: '19:00',
        location: 'Away',
        isConference: true,
        result: null
    },
    {
        id: 'game_3',
        opponent: 'Minnesota',
        date: '2025-10-29',
        time: '19:30',
        location: 'Home',
        isConference: true,
        result: null
    },
    {
        id: 'game_4',
        opponent: 'Wisconsin',
        date: '2025-11-05',
        time: '19:00',
        location: 'Away',
        isConference: true,
        result: null
    },
    {
        id: 'game_5',
        opponent: 'Notre Dame',
        date: '2025-11-12',
        time: '19:00',
        location: 'Home',
        isConference: true,
        result: null
    },
    {
        id: 'game_6',
        opponent: 'Michigan State',
        date: '2025-11-19',
        time: '19:30',
        location: 'Away',
        isConference: true,
        result: null
    },
    {
        id: 'game_7',
        opponent: 'Boston College',
        date: '2025-11-26',
        time: '19:00',
        location: 'Home',
        isConference: false,
        result: null
    },
    {
        id: 'game_8',
        opponent: 'Cornell',
        date: '2025-12-03',
        time: '19:00',
        location: 'Away',
        isConference: false,
        result: null
    }
];

// Class schedule data
export const classSchedule = [
    {
        id: 'class_1',
        name: 'ECON 101',
        professor: 'Dr. Miller',
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '09:00',
        endTime: '09:50',
        location: 'Business Building 302',
        credits: 3
    },
    {
        id: 'class_2',
        name: 'PSYCH 100',
        professor: 'Dr. Thompson',
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '12:15',
        location: 'Moore Building 113',
        credits: 3
    },
    {
        id: 'class_3',
        name: 'COMM 150',
        professor: 'Prof. Garcia',
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '13:00',
        endTime: '13:50',
        location: 'Willard Building 201',
        credits: 3
    },
    {
        id: 'class_4',
        name: 'KINES 101',
        professor: 'Dr. Johnson',
        days: ['Tuesday', 'Thursday'],
        startTime: '14:30',
        endTime: '15:45',
        location: 'Recreation Hall 108',
        credits: 3
    }
];