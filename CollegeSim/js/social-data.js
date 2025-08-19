import { gameState } from './main.js';

export function generateSocialPosts() {
    // Dynamic based on state
    if (gameState.player.seasonStats.goals > 5) {
        gameState.phone.social.posts.push({
            user: 'Teammate', handle: 'psu_hockey', time: new Date().toLocaleTimeString(),
            text: `Great game! @${gameState.player.name} scored!`, likes: 50, retweets: 10, comments: 5
        });
    }
    // Add random posts
    gameState.phone.social.posts.push({ user: 'Fan', handle: 'fan1', text: 'PSU rules!', likes: 20, retweets: 5, comments: 3 });
    gameState.notifications += 1;
}

export function postToFeed(post) {
    gameState.phone.social.myPosts.push(post);
    gameState.phone.social.posts.push(post);
    // Affect stats
    if (post.text.includes('win')) gameState.player.status.reputation += 5;
}

export function renderNews() {
    // Generate news dynamically
    const news = [];
    if (gameState.semester === 'Winter') news.push({ title: 'Big Ten Rankings', text: 'PSU #3!' });
    if (gameState.player.seasonStats.points > 20) news.push({ title: 'Star Player Spotlight', text: `${gameState.player.name} leading in points!` });
    if (gameState.player.status.gpa > 3.5) news.push({ title: 'Academic All-Star', text: 'Hockey player excels in classroom.' });
    news.push({ title: 'Campus News', text: 'Upcoming events at PSU.' });
    news.push({ title: 'Hockey Update', text: 'Next game vs Michigan.' });
    return news.map(n => `<div>${n.title}: ${n.text}</div>`).join('');
}