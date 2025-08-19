import { gameState, addMessage, getUnreadCount } from '../main.js';
import { elements } from './base.js';
import { generateNpcReply } from '../npc-logic.js';
import { calendarEvents, socialFeedPosts } from '../app-data.js';

// --- STATE & CONFIG ---
let currentPhoneScreen = 'home';
let currentChat = null;
let draggedIcon = null;
let offsetX, offsetY;

const appIcons = {
    messages: { name: 'Messages', icon: 'fa-comments' },
    chirper: { name: 'Chirper', icon: 'fa-dove' },
    rinkrater: { name: 'Rink Rater', icon: 'fa-fire' },
    calendar: { name: 'Calendar', icon: 'fa-calendar-days' },
    fitness: { name: 'Fitness', icon: 'fa-dumbbell' },
    news: { name: 'News', icon: 'fa-newspaper' },
    weather: { name: 'Weather', icon: 'fa-cloud-sun' },
    notes: { name: 'Notes', icon: 'fa-note-sticky' },
    shop: { name: 'Shop', icon: 'fa-shop' }
};

// --- CORE RENDERING ---
export function initializePhoneUI() {
    window.addEventListener('openPhone', () => {
        currentPhoneScreen = 'home';
        renderPhone();
    });
}

export function renderPhone() {
    const screenTemplate = phoneTemplates[currentPhoneScreen];
    if (typeof screenTemplate === 'function') {
        elements.phoneScreen.innerHTML = screenTemplate();
    }
    attachAllEventListeners();
}

// --- CALENDAR GENERATION LOGIC ---
function generateCalendarHTML() {
    const now = gameState.gameDate;
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<div class="calendar-header readable-text">
        <i class="fa-solid fa-chevron-left"></i>
        <strong>${monthName} ${year}</strong>
        <i class="fa-solid fa-chevron-right"></i>
    </div>`;
    
    html += `<div class="calendar-grid">`;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-name readable-text">${day}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="calendar-day other-month"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasEvent = calendarEvents.some(event => event.date === dateStr);
        html += `<div class="calendar-day readable-text">
            ${day}
            ${hasEvent ? '<div class="calendar-event-dot"></div>' : ''}
        </div>`;
    }
    html += `</div>`;
    return html;
}


// --- HTML TEMPLATES ---
const phoneTemplates = {
    home: () => `
        <div class="home-screen">
            <div class="icon-grid"></div>
        </div>
        <div class="home-indicator"></div>`,
    messages: () => `
        <div class="app-header">
            <div class="back-button" data-target="home">&lt; Back</div>
            <div class="header-title">Messages</div>
        </div>
        <div class="app-content">
            ${Object.entries(gameState.relationships).map(([id, data]) => {
                const lastMessage = gameState.conversations[id]?.messages.slice(-1)[0] || {};
                return `
                <div class="contact-item" data-contact-id="${id}">
                    <div class="contact-name readable-text">${data.name}</div>
                    <div class="contact-preview readable-text">${lastMessage.text || 'No messages yet'}</div>
                </div>`;
            }).join('')}
        </div>
        <div class="home-indicator"></div>`,
    chat: () => {
        const conversation = gameState.conversations[currentChat];
        return `
        <div class="app-header">
            <div class="back-button" data-target="messages">&lt; Back</div>
            <div class="header-title">${gameState.relationships[currentChat].name}</div>
        </div>
        <div class="app-content chat-messages">
            ${conversation.messages.map(msg => `<div class="chat-bubble ${msg.sender === 'player' ? 'sent' : 'received'}">${msg.text}</div>`).join('')}
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Message...">
            <button id="send-chat-button">Send</button>
        </div>`;
    },
    chirper: () => `
        <div class="app-header">
            <div class="back-button" data-target="home">&lt; Back</div>
            <div class="header-title">Chirper</div>
        </div>
        <div class="app-content">
            ${socialFeedPosts.map(post => `
                <div class="social-post liquid-glass">
                    <div class="post-header">
                        <div class="post-avatar" style="--avatar-color: ${post.avatarColor}">${post.user.charAt(0)}</div>
                        <div class="post-user-info">
                            <div class="post-user readable-text">${post.user}</div>
                            <div class="post-handle readable-text">@${post.handle}</div>
                        </div>
                        <div class="post-time readable-text">${post.time}</div>
                    </div>
                    <p class="post-text readable-text">${post.text}</p>
                    <div class="post-actions readable-text">
                        <span><i class="fa-regular fa-comment"></i> ${post.comments}</span>
                        <span><i class="fa-solid fa-retweet"></i> ${post.retweets}</span>
                        <span><i class="fa-regular fa-heart"></i> ${post.likes}</span>
                        <span><i class="fa-solid fa-arrow-up-from-bracket"></i></span>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="home-indicator"></div>`,
    rinkrater: () => {
        const profile = gameState.phone.dating.profiles[gameState.phone.dating.currentIndex];
        return `
        <div class="app-header">
            <div class="back-button" data-target="home">&lt; Back</div>
            <div class="header-title">Rink Rater</div>
        </div>
        <div class="app-content">
            ${profile ? `
            <div class="dating-card liquid-glass">
                <img src="${profile.image}" style="width:100%; height: 200px; object-fit: cover; border-radius: 15px;" onerror="this.src='https://placehold.co/600x400/222/fff?text=Profile'" />
                <h3 class="readable-text">${profile.name}, ${profile.age}</h3>
                <p class="readable-text">${profile.bio}</p>
            </div>
            <div class="dating-controls">
                <button class="swipe-button" data-swipe="left">Nope</button>
                <button class="swipe-button" data-swipe="right">Like</button>
            </div>
            ` : `<p class="readable-text">No more profiles.</p>`}
        </div>
        <div class="home-indicator"></div>`;
    },
    calendar: () => `
        <div class="app-header">
            <div class="back-button" data-target="home">&lt; Back</div>
            <div class="header-title">Calendar</div>
        </div>
        <div class="app-content">
            ${generateCalendarHTML()}
        </div>
        <div class="home-indicator"></div>`,
    fitness: () => `<div class="app-header"><div class="back-button" data-target="home">&lt; Back</div><div class="header-title">Fitness</div></div><div class="app-content"><p class="readable-text">Fitness tracking coming soon.</p></div><div class="home-indicator"></div>`,
    news: () => `<div class="app-header"><div class="back-button" data-target="home">&lt; Back</div><div class="header-title">News</div></div><div class="app-content"><p class="readable-text">News feed coming soon.</p></div><div class="home-indicator"></div>`,
    weather: () => `<div class="app-header"><div class="back-button" data-target="home">&lt; Back</div><div class="header-title">Weather</div></div><div class="app-content"><p class="readable-text">Weather app coming soon.</p></div><div class="home-indicator"></div>`,
    notes: () => `<div class="app-header"><div class="back-button" data-target="home">&lt; Back</div><div class="header-title">Notes</div></div><div class="app-content"><p class="readable-text">Notes app coming soon.</p></div><div class="home-indicator"></div>`,
    shop: () => `<div class="app-header"><div class="back-button" data-target="home">&lt; Back</div><div class="header-title">Shop</div></div><div class="app-content"><p class="readable-text">Shop coming soon.</p></div><div class="home-indicator"></div>`,
};

// --- EVENT LISTENERS & LOGIC ---
function attachAllEventListeners() {
    if (currentPhoneScreen === 'home') {
        renderHomeScreenIcons();
        attach3DTiltListeners();
    }
    elements.phoneScreen.querySelectorAll('.back-button').forEach(btn => btn.addEventListener('click', () => { currentPhoneScreen = btn.dataset.target; renderPhone(); }));
    const homeIndicator = elements.phoneScreen.querySelector('.home-indicator');
    if (homeIndicator) { homeIndicator.addEventListener('click', () => { currentPhoneScreen = 'home'; renderPhone(); }); }
    if (currentPhoneScreen === 'messages') {
        elements.phoneScreen.querySelectorAll('.contact-item').forEach(item => item.addEventListener('click', () => { currentChat = item.dataset.contactId; currentPhoneScreen = 'chat'; renderPhone(); }));
    }
    if (currentPhoneScreen === 'chat') {
        const sendButton = document.getElementById('send-chat-button');
        const chatInput = document.getElementById('chat-input');
        sendButton.addEventListener('click', handleSendMessage);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });
    }
    if (currentPhoneScreen === 'rinkrater') {
        elements.phoneScreen.querySelectorAll('.swipe-button').forEach(button => button.addEventListener('click', () => { gameState.phone.dating.currentIndex++; renderPhone(); }));
    }
}

function handleSendMessage() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    addMessage(currentChat, 'player', input.value.trim());
    const reply = generateNpcReply(currentChat, input.value.trim());
    setTimeout(() => { addMessage(currentChat, currentChat, reply); renderPhone(); }, 1500);
    renderPhone();
}

// --- HOME SCREEN 3D ICONS ---
function renderHomeScreenIcons() {
    const iconGrid = elements.phoneScreen.querySelector('.icon-grid');
    if (!iconGrid) return;
    iconGrid.innerHTML = '';
    gameState.phone.installedApps.forEach((appId, index) => {
        const appInfo = appIcons[appId];
        if (!appInfo) return;
        const icon = document.createElement('div');
        icon.classList.add('app-icon');
        icon.innerHTML = `<div class="icon-surface"><i class="fa-solid ${appInfo.icon}"></i></div><div class="app-icon-label">${appInfo.name}</div>`;
        const row = Math.floor(index / 4);
        const col = index % 4;
        icon.style.top = `${40 + row * 90}px`;
        icon.style.left = `${20 + col * 85}px`;
        icon.dataset.app = appId;
        iconGrid.appendChild(icon);
        updateRefraction(icon, parseFloat(icon.style.left), parseFloat(icon.style.top));
    });
    attachIconDragListeners();
    iconGrid.querySelectorAll('.app-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            if (e.target.closest('.app-icon').classList.contains('was-dragged')) {
                e.target.closest('.app-icon').classList.remove('was-dragged');
                return;
            }
            currentPhoneScreen = icon.dataset.app;
            renderPhone();
        });
    });
}

function updateRefraction(icon, x, y) {
    const surface = icon.querySelector('.icon-surface');
    if (!surface) return;
    const distortionFactor = 0.5;
    const bgPosX = -x - (icon.offsetWidth * distortionFactor / 2);
    const bgPosY = -y - (icon.offsetHeight * distortionFactor / 2);
    surface.style.setProperty('--refraction-x', `${bgPosX}px`);
    surface.style.setProperty('--refraction-y', `${bgPosY}px`);
}

function attachIconDragListeners() {
    const allIcons = elements.phoneScreen.querySelectorAll('.app-icon');
    allIcons.forEach(icon => {
        icon.addEventListener('mousedown', onIconDragStart);
        icon.addEventListener('touchstart', onIconDragStart, { passive: false });
    });
    document.addEventListener('mousemove', onIconDragMove);
    document.addEventListener('touchmove', onIconDragMove, { passive: false });
    document.addEventListener('mouseup', onIconDragEnd);
    document.addEventListener('touchend', onIconDragEnd);
}

function onIconDragStart(e) {
    draggedIcon = e.currentTarget;
    draggedIcon.classList.add('is-dragging');
    if (e.touches) {
        offsetX = e.touches[0].clientX - draggedIcon.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - draggedIcon.getBoundingClientRect().top;
    } else {
        offsetX = e.clientX - draggedIcon.getBoundingClientRect().left;
        offsetY = e.clientY - draggedIcon.getBoundingClientRect().top;
    }
}

function onIconDragMove(e) {
    if (!draggedIcon) return;
    e.preventDefault();
    draggedIcon.classList.add('was-dragged');
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    const screenRect = elements.phoneScreen.getBoundingClientRect();
    let x = clientX - screenRect.left - offsetX;
    let y = clientY - screenRect.top - offsetY;
    x = Math.max(0, Math.min(x, screenRect.width - draggedIcon.offsetWidth));
    y = Math.max(0, Math.min(y, screenRect.height - draggedIcon.offsetHeight));
    draggedIcon.style.left = `${x}px`;
    draggedIcon.style.top = `${y}px`;
    updateRefraction(draggedIcon, x, y);
}

function onIconDragEnd() {
    if (!draggedIcon) return;
    const iconToSettle = draggedIcon;
    iconToSettle.classList.remove('is-dragging');
    iconToSettle.classList.add('is-settling');
    iconToSettle.addEventListener('animationend', () => {
        iconToSettle.classList.remove('is-settling');
    }, { once: true });
    draggedIcon = null;
}

function attach3DTiltListeners() {
    const allIcons = elements.phoneScreen.querySelectorAll('.app-icon');
    phoneScreen.addEventListener('mousemove', (e) => {
        if (draggedIcon) return;
        const screenRect = phoneScreen.getBoundingClientRect();
        const mouseX = e.clientX - screenRect.left;
        const mouseY = e.clientY - screenRect.top;
        const centerX = screenRect.width / 2;
        const centerY = screenRect.height / 2;
        const rotateX = (mouseY - centerY) / centerY * -12;
        const rotateY = (mouseX - centerX) / centerX * 12;

        allIcons.forEach(icon => {
            icon.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            const currentX = parseFloat(icon.style.left);
            const currentY = parseFloat(icon.style.top);
            const refractionShiftX = rotateY * -1;
            const refractionShiftY = rotateX * 1;
            const surface = icon.querySelector('.icon-surface');
            const distortionFactor = 0.5;
            const bgPosX = -currentX - (icon.offsetWidth * distortionFactor / 2) + refractionShiftX;
            const bgPosY = -currentY - (icon.offsetHeight * distortionFactor / 2) + refractionShiftY;
            surface.style.setProperty('--refraction-x', `${bgPosX}px`);
            surface.style.setProperty('--refraction-y', `${bgPosY}px`);
        });
    });

    phoneScreen.addEventListener('mouseleave', () => {
         allIcons.forEach(icon => {
            icon.style.transform = `rotateX(0deg) rotateY(0deg)`;
            updateRefraction(icon, parseFloat(icon.style.left), parseFloat(icon.style.top));
        });
    });
}
