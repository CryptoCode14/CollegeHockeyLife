// js/ui/phone-ui.js
import { gameState, addMessage, getUnreadCount } from '../main.js';
import { elements } from './base.js';
import { generateNpcReply } from '../npc-logic.js';
import { generateSocialPosts } from '../social-data.js';
import { renderMessages } from '../phone-messages.js';
import { renderApps } from '../phone-apps.js';
import { renderNews } from '../social-data.js';

// Track current phone state
let currentPhoneScreen = 'home';
let currentChat = null;

// App icon definitions (expanded)
export const appIcons = {
    messages: { name: 'Messages', icon: 'fa-comments' },
    settings: { name: 'Settings', icon: 'fa-gear' },
    appstore: { name: 'App Store', icon: 'fa-store' },
    chirper: { name: 'Chirper', icon: 'fa-dove' },
    rinkrater: { name: 'Rink Rater', icon: 'fa-fire' },
    calendar: { name: 'Calendar', icon: 'fa-calendar-days' },
    camera: { name: 'Camera', icon: 'fa-camera' },
    notes: { name: 'Notes', icon: 'fa-note-sticky' },
    maps: { name: 'Maps', icon: 'fa-map-location-dot' },
    weather: { name: 'Weather', icon: 'fa-cloud-sun' },
    fitness: { name: 'Fitness', icon: 'fa-dumbbell' },
    news: { name: 'News', icon: 'fa-newspaper' },
    shop: { name: 'Shop', icon: 'fa-shop' } // New
};

// Initialize phone UI
export function initializePhoneUI() {
    // Listen for the openPhone event from the main UI
    window.addEventListener('openPhone', () => {
        currentPhoneScreen = 'home';
        renderPhone();
    });

    // Home indicator click to go home
    elements.phoneScreen.addEventListener('click', (e) => {
        if (e.target.classList.contains('home-indicator')) {
            currentPhoneScreen = 'home';
            renderPhone();
        }
    });

    // Basic swipe detection for dating app
    let touchStartX = 0;
    elements.phoneScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    elements.phoneScreen.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (currentPhoneScreen === 'rinkrater') {
            if (touchEndX < touchStartX - 50) {
                // Swipe left
                swipeProfile('left');
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right
                swipeProfile('right');
            }
        }
    });
}

// Function to handle profile swipes
function swipeProfile(direction) {
    const profileElement = elements.phoneScreen.querySelector('.dating-profile');
    if (profileElement) {
        profileElement.classList.add(direction === 'left' ? 'swiped-left' : 'swiped-right');
        setTimeout(() => {
            const currentProfile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex];
            if (direction === 'right' && Math.random() > 0.5 && currentProfile) {
                if (!gameState.phone.dating.matches.some(match => match.id === currentProfile.id)) {
                    gameState.phone.dating.matches.push({
                        ...currentProfile,
                        id: `match_${Date.now()}`
                    });
                    gameState.notifications++;
                }
            }
            gameState.phone.dating.currentIndex++;
            renderPhone();
        }, 500);
    }
}

// Phone screen templates (enhanced with badges, status bar, home indicator)
const phoneTemplates = {
    // Home screen with app grid
    home: () => `
        <div class="phone-app-view app-home-screen">
            <div class="phone-status-bar">
                <div class="status-time">${gameState.gameDate.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'})}</div>
                <div class="status-icons">
                    <i class="fa-solid fa-signal"></i>
                    <i class="fa-solid fa-wifi"></i>
                    <i class="fa-solid fa-battery-${Math.floor(gameState.phone.battery / 25)}"></i>
                </div>
            </div>
            <div class="app-content">
                <div class="app-grid">
                    ${gameState.phone.installedApps.map(appId => `
                        <div class="app-icon" data-app="${appId}">
                            <i class="fa-solid ${appIcons[appId].icon}"></i>
                            <span>${appIcons[appId].name}</span>
                            ${appId === 'messages' && getUnreadCount() > 0 ? `<div class="app-badge">${getUnreadCount()}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="home-indicator"></div>
        </div>`,

    // Messages app with contact list
    messages: () => `
        <div class="phone-app-view app-messages">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Messages</div>
                <div class="header-action"><i class="fa-solid fa-pen-to-square"></i></div>
            </div>
            <div class="app-content contact-list">
                ${Object.entries(gameState.relationships).map(([id, data]) => {
                    const lastMessage = gameState.conversations[id].messages.slice(-1)[0] || {};
                    const timestamp = lastMessage.timestamp ? formatMessageTime(lastMessage.timestamp) : '';
                    const unread = getUnreadCount(id);
                    return `
                        <div class="contact-item" data-contact-id="${id}">
                            <div class="contact-avatar" style="background-color:${data.avatarColor};">${data.name.charAt(0)}</div>
                            <div class="contact-info">
                                <div class="contact-name">${data.name}</div>
                                <div class="contact-preview">${lastMessage.text || 'No messages yet'}</div>
                            </div>
                            <div class="contact-time">${timestamp}</div>
                            ${unread > 0 ? `<div class="app-badge">${unread}</div>` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="home-indicator"></div>
        </div>`,

    // Chat view
    chat: () => {
        const contact = gameState.relationships[currentChat] || {};
        return `
            <div class="phone-app-view app-chat">
                <div class="app-header">
                    <div class="back-button" data-back="messages">&lt;</div>
                    <div class="header-title">${contact.name}</div>
                    <div class="header-action"><i class="fa-solid fa-info-circle"></i></div>
                </div>
                <div class="app-content chat-view">
                    <div class="chat-messages">
                        ${gameState.conversations[currentChat].messages.map(m => `
                            <div class="message ${m.sender === 'player' ? 'player' : ''}">
                                ${m.text}
                                <div class="message-timestamp">${formatMessageTime(m.timestamp)}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="iMessage">
                        <button id="send-chat-button">Send</button>
                    </div>
                </div>
                <div class="home-indicator"></div>
            </div>
        `;
    },

    // Chirper app (enhanced styling)
    chirper: () => `
        <div class="phone-app-view app-chirper">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Chirper</div>
                <div class="header-action"><i class="fa-solid fa-pen"></i></div>
            </div>
            <div class="app-content social-feed">
                ${gameState.phone.social.posts.map(post => `
                    <div class="post">
                        <div class="post-header">
                            <div class="post-avatar" style="background-color:${post.avatarColor};">${post.user.charAt(0)}</div>
                            <div>
                                <div class="post-user">${post.user}</div>
                                <div class="post-handle">@${post.handle}</div>
                            </div>
                            <div class="post-time">${post.time}</div>
                        </div>
                        <div class="post-text">${post.text}</div>
                        <div class="post-actions">
                            <span><i class="fa-solid fa-heart"></i> ${post.likes}</span>
                            <span><i class="fa-solid fa-retweet"></i> ${post.retweets}</span>
                            <span><i class="fa-solid fa-comment"></i> ${post.comments}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="home-indicator"></div>
        </div>`,

    // Rink Rater app (with swipe animations)
    rinkrater: () => {
        const profile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex] || { name: 'No more profiles', age: '', bio: '', interests: [], image: '' };
        return `
            <div class="phone-app-view app-rinkrater">
                <div class="app-header">
                    <div class="back-button" data-app="home">&lt;</div>
                    <div class="header-title">Rink Rater</div>
                    <div class="header-action"><i class="fa-solid fa-user-group"></i></div>
                </div>
                <div class="app-content dating-view">
                    <div class="dating-profile">
                        <img src="${profile.image || 'placeholder.jpg'}" alt="${profile.name}" class="profile-image">
                        <div class="profile-name">${profile.name}, ${profile.age}</div>
                        <div class="profile-bio">${profile.bio}</div>
                        <div class="profile-interests">
                            ${profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                        </div>
                    </div>
                    <div class="swipe-buttons">
                        <button class="swipe-button" data-swipe="left">Nope</button>
                        <button class="swipe-button" data-swipe="right">Like</button>
                    </div>
                    <button class="refresh-profiles-button">Refresh Profiles</button>
                </div>
                <div class="home-indicator"></div>
            </div>
        `;
    },

    // Calendar app
    calendar: () => `
        <div class="phone-app-view app-calendar">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Calendar</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content calendar-view">
                ${calendarEvents.map(event => `
                    <div class="calendar-event">
                        <div class="event-title">${event.title}</div>
                        <div class="event-details">${event.date} at ${event.time} - ${event.location}</div>
                    </div>
                `).join('')}
            </div>
            <div class="home-indicator"></div>
        </div>
    `,

    // Fitness app
    fitness: () => `
        <div class="phone-app-view app-fitness">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Fitness</div>
                <div class="header-action"><i class="fa-solid fa-chart-line"></i></div>
            </div>
            <div class="app-content fitness-view">
                <div class="fitness-header">
                    <div class="fitness-progress">
                        <svg viewBox="0 0 160 160">
                            <circle class="progress-ring" cx="80" cy="80" r="70"></circle>
                            <circle class="progress-fill" cx="80" cy="80" r="70" style="stroke-dashoffset: ${440 - (440 * (gameState.phone.fitness.currentSteps / gameState.phone.fitness.dailyGoal))}"></circle>
                        </svg>
                        <div class="progress-text">
                            <div class="steps-count">${gameState.phone.fitness.currentSteps}</div>
                            <div class="steps-goal">/${gameState.phone.fitness.dailyGoal} steps</div>
                        </div>
                    </div>
                </div>
                <div class="fitness-metrics">
                    <div class="fitness-metric">
                        <i class="fa-solid fa-heart-pulse"></i>
                        <div>
                            <div class="metric-value">145 bpm</div>
                            <div class="metric-label">Heart Rate</div>
                        </div>
                    </div>
                    <div class="fitness-metric">
                        <i class="fa-solid fa-fire"></i>
                        <div>
                            <div class="metric-value">650</div>
                            <div class="metric-label">Calories</div>
                        </div>
                    </div>
                </div>
                <div class="fitness-workouts">
                    <h3>Recent Workouts</h3>
                    ${gameState.phone.fitness.workouts.map(workout => `
                        <div class="workout-item">
                            <div class="workout-icon"><i class="fa-solid fa-dumbbell"></i></div>
                            <div class="workout-details">
                                <div class="workout-title">${workout.type}</div>
                                <div class="workout-stats">${workout.duration} min • ${workout.calories} cal</div>
                            </div>
                            <div class="workout-time">${workout.date.toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="home-indicator"></div>
        </div>
    `,

    // New: Shop app
    shop: () => `
        <div class="phone-app-view app-shop">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Shop</div>
                <div class="header-action">$${gameState.player.money}</div>
            </div>
            <div class="app-content shop-view">
                ${gameState.phone.shop.items.map(item => `
                    <div class="shop-item">
                        <div>${item.name} - $${item.price}</div>
                        <button data-item-id="${item.id}">Buy</button>
                    </div>
                `).join('')}
            </div>
            <div class="home-indicator"></div>
        </div>
    `,

    // New: Weather app
    weather: () => {
        const weatherConditions = ['Sunny', 'Rainy', 'Snowy', 'Cloudy'];
        const currentWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        return `
            <div class="phone-app-view app-weather">
                <div class="app-header">
                    <div class="back-button" data-app="home">&lt;</div>
                    <div class="header-title">Weather</div>
                    <div class="header-action"><i class="fa-solid fa-location-dot"></i></div>
                </div>
                <div class="app-content weather-view">
                    <i class="fa-solid fa-${currentWeather.toLowerCase() === 'sunny' ? 'sun' : currentWeather.toLowerCase() === 'rainy' ? 'cloud-rain' : 'snowflake'}" class="weather-icon"></i>
                    <div class="weather-temp">72°F</div>
                    <div class="weather-desc">${currentWeather}</div>
                </div>
                <div class="home-indicator"></div>
            </div>
        `;
    },

    // New: Notes app
    notes: () => `
        <div class="phone-app-view app-notes">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Notes</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content notes-view">
                ${gameState.phone.notes.map((note, index) => `
                    <div class="note-item" data-note-index="${index}">${note}</div>
                `).join('')}
                <input type="text" id="add-note-input" placeholder="New note...">
                <button id="add-note-button">Add Note</button>
            </div>
            <div class="home-indicator"></div>
        </div>
    `
};

// Format timestamp for messages
function formatMessageTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return timestamp.toLocaleDateString();
}

// Render the phone screen
export function renderPhone() {
    elements.phoneScreen.innerHTML = phoneTemplates[currentPhoneScreen] ? phoneTemplates[currentPhoneScreen]() : '';

    // Attach event listeners dynamically
    elements.phoneScreen.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            currentPhoneScreen = icon.dataset.app;
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            currentPhoneScreen = button.dataset.app || 'messages'; // For chat back to messages
            renderPhone();
        });
    });

    elements.phoneScreen.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            currentChat = item.dataset.contactId;
            // Mark messages as read
            gameState.conversations[currentChat].messages.forEach(m => m.read = true);
            gameState.notifications -= getUnreadCount(currentChat);
            currentPhoneScreen = 'chat';
            renderPhone();
        });
    });

    // Post actions (likes, etc.)
    elements.phoneScreen.querySelectorAll('.post-actions i').forEach(action => {
        action.addEventListener('click', (e) => {
            e.currentTarget.style.color = 'var(--highlight-blue)';
        });
    });

    // Swipe buttons
    elements.phoneScreen.querySelectorAll('.swipe-button').forEach(button => {
        button.addEventListener('click', () => {
            swipeProfile(button.dataset.swipe);
        });
    });

    // Refresh profiles
    const refreshButton = elements.phoneScreen.querySelector('.refresh-profiles-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            gameState.phone.dating.currentIndex = 0;
            renderPhone();
        });
    }

    // Chat send
    const sendButton = document.getElementById('send-chat-button');
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
        chatInput.focus();
    }

    // Shop buy buttons
    elements.phoneScreen.querySelectorAll('.shop-item button').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.itemId;
            const item = gameState.phone.shop.items.find(i => i.id === itemId);
            if (item && gameState.player.money >= item.price) {
                gameState.player.money -= item.price;
                Object.assign(gameState.player.attributes, item.effect);
                alert(`Purchased ${item.name}!`);
                renderPhone();
            } else {
                alert('Not enough money!');
            }
        });
    });

    // Notes add button
    const addNoteButton = document.getElementById('add-note-button');
    if (addNoteButton) {
        addNoteButton.addEventListener('click', () => {
            const input = document.getElementById('add-note-input');
            if (input.value.trim()) {
                gameState.phone.notes.push(input.value.trim());
                input.value = '';
                renderPhone();
            }
        });
    }
}

// Handle sending messages in chat
function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addMessage(currentChat, 'player', message);
        input.value = '';
        const reply = generateNpcReply(currentChat, message);
        setTimeout(() => addMessage(currentChat, currentChat, reply), 1000);
        renderPhone();
    }
}