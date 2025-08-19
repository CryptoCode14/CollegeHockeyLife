// js/ui/phone-ui.js
import { gameState, addMessage } from '../main.js';
import { elements } from './base.js';
import { generateNpcReply } from '../npc-logic.js';
import { generateSocialPosts } from '../social-data.js';
import { renderMessages } from '../phone-messages.js';
import { renderApps } from '../phone-apps.js';
import { renderNews } from '../social-data.js';

// Track current phone state
let currentPhoneScreen = 'home';
let currentChat = null;

// App icon definitions
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
    news: { name: 'News', icon: 'fa-newspaper' }
};

// Initialize phone UI
export function initializePhoneUI() {
    // Listen for the openPhone event from the main UI
    window.addEventListener('openPhone', () => {
        currentPhoneScreen = 'home';
        renderPhone();
    });
}

// Phone screen templates
const phoneTemplates = {
    // Home screen with app grid
    home: () => `
        <div class="phone-app-view app-home-screen">
            <div class="app-content">
                <div class="phone-status-bar">
                    <div class="status-time">${new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit'})}</div>
                    <div class="status-icons">
                        <i class="fa-solid fa-signal"></i>
                        <i class="fa-solid fa-wifi"></i>
                        <i class="fa-solid fa-battery-three-quarters"></i>
                    </div>
                </div>
                <div class="app-grid">
                    ${gameState.phone.installedApps.map(appId => `
                        <div class="app-icon" data-app="${appId}">
                            <i class="fa-solid ${appIcons[appId].icon}"></i>
                            <span>${appIcons[appId].name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
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
                    const lastMessage = gameState.conversations[id].messages.slice(-1)[0];
                    const timestamp = lastMessage.timestamp ? formatMessageTime(lastMessage.timestamp) : '';
                    return `
                    <div class="contact-item" data-contact-id="${id}">
                        <div class="contact-avatar" style="background-color:${data.avatarColor};">${data.name.charAt(0)}</div>
                        <div class="contact-info">
                            <div class="contact-name">${data.name}</div>
                            <div class="contact-preview">${lastMessage.text}</div>
                        </div>
                        <div class="message-time">${timestamp}</div>
                    </div>
                `}).join('')}
            </div>
        </div>`,

    // Individual chat view
    chat: (contactId) => {
        const contact = gameState.relationships[contactId];
        const conversation = gameState.conversations[contactId];
        return `
        <div class="phone-app-view chat-view">
            <div class="app-header">
                <div class="back-button" data-app="messages">&lt;</div>
                <div class="header-title">${contact.name}</div>
                <div class="header-action"><i class="fa-solid fa-info-circle"></i></div>
            </div>
            <div class="app-content chat-messages">
                ${conversation.messages.map(msg => {
                    const timestamp = msg.timestamp ? formatMessageTime(msg.timestamp) : '';
                    return `
                    <div class="chat-bubble-container ${msg.sender === 'player' ? 'sent' : 'received'}">
                        <div class="chat-bubble">${msg.text}</div>
                        <div class="chat-timestamp">${timestamp}</div>
                    </div>
                `}).join('')}
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Message...">
                <button id="send-chat-button"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>`;
    },

    // Settings app
    settings: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Settings</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content settings-list">
                <div class="settings-item" data-setting="theme">
                    <span>Theme</span> 
                    <span class="setting-value">${gameState.phone.theme === 'dark' ? 'Dark' : 'Light'} &gt;</span>
                </div>
                <div class="settings-item" data-setting="wallpaper">
                    <span>Wallpaper</span> 
                    <span class="setting-value">&gt;</span>
                </div>
            </div>
        </div>`,

    // App Store
    appstore: () => `
        <div class="phone-app-view">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">App Store</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content app-list">
                ${gameState.phone.appStore.available.map(appId => `
                    <div class="app-list-item">
                        <i class="fa-solid ${appIcons[appId].icon} app-list-icon"></i>
                        <div class="app-list-info">
                            <strong>${appIcons[appId].name}</strong>
                            <span>Productivity</span>
                        </div>
                        <button class="app-download-button" data-app-id="${appId}">GET</button>
                    </div>
                `).join('')}
                ${gameState.phone.installedApps.includes('calendar') ? `<div class="app-list-item"><i class="fa-solid fa-calendar-days app-list-icon"></i><div class="app-list-info"><strong>Calendar</strong><span>Productivity</span></div><button class="app-download-button installed">Installed</button></div>` : ''}
            </div>
        </div>`,

    // Chirper (Social Feed)
    chirper: () => `
        <div class="phone-app-view app-chirper">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Chirper</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content social-feed">
                ${gameState.phone.social.posts.map(post => `
                    <div class="social-post">
                        <div class="post-header">
                            <div class="post-avatar" style="background-color:${post.avatarColor};">${post.user.charAt(0)}</div>
                            <div>
                                <strong>${post.user}</strong> @${post.handle} · ${post.time}
                            </div>
                        </div>
                        <p>${post.text}</p>
                        <div class="post-actions">
                            <span>❤️ ${post.likes}</span>
                            <span>🔁 ${post.retweets}</span>
                            <span>💬 ${post.comments}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`,

    // Rink Rater (Dating App)
    rinkrater: () => {
        const profile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex % gameState.phone.dating.profiles.length];
        return `
        <div class="phone-app-view app-rinkrater">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Rink Rater</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content dating-profile">
                <img src="${profile.img}" alt="${profile.name}">
                <h2>${profile.name}</h2>
                <p>${profile.bio}</p>
                <div class="interests">${profile.interests.join(', ')}</div>
                <div class="swipe-buttons">
                    <button class="swipe-button dislike" data-swipe="left">❌</button>
                    <button class="swipe-button like" data-swipe="right">❤️</button>
                </div>
                <button class="refresh-profiles-button">Refresh Profiles</button>
            </div>
        </div>`;
    },

    // Calendar App
    calendar: () => `
        <div class="phone-app-view app-calendar">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Calendar</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content calendar-events">
                ${gameState.phone.calendar.events.map(event => `
                    <div class="calendar-event">
                        <div>${event.date} ${event.time}</div>
                        <strong>${event.title}</strong>
                        <span>${event.location}</span>
                    </div>
                `).join('')}
            </div>
        </div>`,

    // Camera App (Placeholder)
    camera: () => `
        <div class="phone-app-view app-camera">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Camera</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content camera-view">
                <div class="camera-preview">Camera Preview (Placeholder)</div>
                <button class="camera-shutter"><i class="fa-solid fa-camera"></i></button>
            </div>
        </div>`,

    // Notes App
    notes: () => `
        <div class="phone-app-view app-notes">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Notes</div>
                <div class="header-action"><i class="fa-solid fa-plus"></i></div>
            </div>
            <div class="app-content notes-list">
                ${gameState.phone.notes.map(note => `
                    <div class="note-item">
                        <strong>${note.title}</strong>
                        <p>${note.content}</p>
                        <span>${note.date.toLocaleDateString()}</span>
                    </div>
                `).join('')}
            </div>
        </div>`,

    // Maps App
    maps: () => `
        <div class="phone-app-view app-maps">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Maps</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content maps-view">
                <div class="location-list">
                    <div class="location-item" data-location="pegula"><i class="fa-solid fa-hockey-puck"></i>Pegula Ice Arena</div>
                    <div class="location-item" data-location="library"><i class="fa-solid fa-book"></i>Pattee Library</div>
                    <div class="location-item" data-location="dorm"><i class="fa-solid fa-bed"></i>East Halls</div>
                    <div class="location-item" data-location="business"><i class="fa-solid fa-landmark"></i>Business Building</div>
                    <div class="location-item" data-location="hub"><i class="fa-solid fa-utensils"></i>HUB-Robeson Center</div>
                    <div class="location-item" data-location="rec"><i class="fa-solid fa-dumbbell"></i>Recreation Center</div>
                </div>
            </div>
        </div>`,

    // Weather App
    weather: () => `
        <div class="phone-app-view app-weather">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Weather</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content weather-view">
                <div class="weather-location">State College, PA</div>
                <div class="current-weather">
                    <i class="fa-solid fa-sun weather-icon"></i>
                    <div class="weather-temp">72°F</div>
                    <div class="weather-desc">Sunny</div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail"><span>Humidity</span> 65%</div>
                    <div class="weather-detail"><span>Wind</span> 5 mph</div>
                    <div class="weather-detail"><span>UV Index</span> 7</div>
                </div>
                <div class="forecast-days">
                    <div class="forecast-day"><span>Mon</span><i class="fa-solid fa-cloud"></i>68°</div>
                    <div class="forecast-day"><span>Tue</span><i class="fa-solid fa-cloud-rain"></i>65°</div>
                    <div class="forecast-day"><span>Wed</span><i class="fa-solid fa-sun"></i>75°</div>
                    <div class="forecast-day"><span>Thu</span><i class="fa-solid fa-cloud-sun"></i>72°</div>
                    <div class="forecast-day"><span>Fri</span><i class="fa-solid fa-wind"></i>70°</div>
                </div>
            </div>
        </div>`,

    // Fitness App
    fitness: () => `
        <div class="phone-app-view app-fitness">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">Fitness</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content fitness-view">
                <div class="fitness-summary">
                    <div class="fitness-rings">
                        <div class="fitness-stats">
                            <div>${gameState.phone.fitness.currentSteps}</div>
                            <div>Steps</div>
                        </div>
                    </div>
                    <div class="fitness-metrics">
                        <div class="fitness-metric">
                            <i class="fa-solid fa-walking"></i>
                            <div class="metric-value">${gameState.phone.fitness.currentSteps}</div>
                            <div class="metric-label">Steps</div>
                        </div>
                        <div class="fitness-metric">
                            <i class="fa-solid fa-heart-pulse"></i>
                            <div class="metric-value">1450</div>
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
                                <div class="workout-stats">${workout.duration} min · ${workout.calories} cal</div>
                            </div>
                            <div class="workout-time">${workout.date.toLocaleDateString()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`,
    // New: News app
    news: () => `
        <div class="phone-app-view app-news">
            <div class="app-header">
                <div class="back-button" data-app="home">&lt;</div>
                <div class="header-title">News</div>
                <div class="placeholder"></div>
            </div>
            <div class="app-content news-feed">
                ${renderNews()}
            </div>
        </div>`,
    // New: Study app (mini-app)
    study: () => renderApps('study')
};

// Helper function to format message timestamps
function formatMessageTime(timestamp) {
    const now = new Date();
    const msgDate = new Date(timestamp);
    const diff = (now - msgDate) / 1000; // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return msgDate.toLocaleDateString();
}

// Render phone screen
export function renderPhone() {
    if (gameState.phone.battery < 20) {
        alert('Phone battery low! Recharge by resting (increase energy).');
        elements.phoneModal.classList.add('hidden');
        return;
    }
    elements.phoneScreen.innerHTML = phoneTemplates[currentPhoneScreen] ? phoneTemplates[currentPhoneScreen](currentChat) : '';
    // Battery drain
    gameState.phone.battery -= 1;
    if (gameState.phone.battery < 0) gameState.phone.battery = 0;

    // Apply theme and wallpaper
    elements.phoneModal.className = `phone-modal theme-${gameState.phone.theme} wallpaper-${gameState.phone.wallpaper}`;

    // Add event listeners for the current screen
    addPhoneEventListeners();
}

// Add event listeners for phone interactions
function addPhoneEventListeners() {
    // App icons and back buttons
    elements.phoneScreen.querySelectorAll('.app-icon, .back-button').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (el.dataset.app) {
                currentPhoneScreen = el.dataset.app;
                currentChat = null; // Reset current chat when changing screens
                renderPhone();
            }
        });
    });
    
    // Contact items in messages app
    elements.phoneScreen.querySelectorAll('.contact-item').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            if (el.dataset.contactId) {
                currentPhoneScreen = 'chat';
                currentChat = el.dataset.contactId;
                renderPhone();
            }
        });
    });

    // Settings items
    elements.phoneScreen.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', () => {
            const setting = item.dataset.setting;
            if (setting === 'theme') {
                gameState.phone.theme = gameState.phone.theme === 'dark' ? 'light' : 'dark';
            }
            if (setting === 'wallpaper') {
                const wallpapers = ['default', '1', '2'];
                const currentIndex = wallpapers.indexOf(gameState.phone.wallpaper);
                gameState.phone.wallpaper = wallpapers[(currentIndex + 1) % wallpapers.length];
            }
            renderPhone();
        });
    });

    // App Store download buttons
    elements.phoneScreen.querySelectorAll('.app-download-button:not(.installed)').forEach(button => {
        button.addEventListener('click', () => {
            const appId = button.dataset.appId;
            if (appId && !gameState.phone.installedApps.includes(appId)) {
                gameState.phone.installedApps.push(appId);
                gameState.phone.appStore.available = gameState.phone.appStore.available.filter(id => id !== appId);
                renderPhone();
            }
        });
    });

    // Dating app swipe buttons
    elements.phoneScreen.querySelectorAll('.swipe-button').forEach(button => {
        button.addEventListener('click', () => {
            const swipeDirection = button.dataset.swipe;
            const currentProfile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex];
            
            // If swiping right, add to matches with 50% chance
            if (swipeDirection === 'right' && Math.random() > 0.5 && currentProfile) {
                if (!gameState.phone.dating.matches.some(match => match.id === currentProfile.id)) {
                    gameState.phone.dating.matches.push({
                        ...currentProfile,
                        id: `match_${Date.now()}`
                    });
                    gameState.notifications++;
                }
            }
            
            // Move to next profile
            gameState.phone.dating.currentIndex++;
            renderPhone();
        });
    });
    
    // Refresh dating profiles button
    const refreshButton = elements.phoneScreen.querySelector('.refresh-profiles-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            gameState.phone.dating.currentIndex = 0;
            renderPhone();
        });
    }
    
    // Chat send button
    const sendButton = document.getElementById('send-chat-button');
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }
    
    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
        chatInput.focus(); // Auto-focus the input field
    }
    
    // Maps location items
    elements.phoneScreen.querySelectorAll('.location-item').forEach(item => {
        item.addEventListener('click', () => {
            // In a real implementation, this would show the location on the map
            const locationId = item.dataset.location;
            console.log(`Showing location: ${locationId}`);
            // For now, just highlight the selected item
            elements.phoneScreen.querySelectorAll('.location-item').forEach(el => {
                el.classList.remove('selected');
            });
            item.classList.add('selected');
        });
    });
}

// Handle sending messages in chat
function handleSendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        addMessage(currentChat, 'player', message);
        input.value = '';
        // Generate NPC reply
        const reply = generateNpcReply(currentChat, message);
        setTimeout(() => addMessage(currentChat, currentChat, reply), 1000);
        // Update chat view
        renderPhone();
    }
}