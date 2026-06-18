// HeroGo! - Music Note System with Your Real Images (IMG2828 ~ IMG2842)
let game = {
    stage: 1,
    wave: 1,
    monsterHP: 150,
    maxMonsterHP: 150,
    tapDamage: 10,
    dps: 8,
    gold: 0,
    relics: 0,
    heroLevel: 1,
    companionCount: 0,
    
    currentNoteIndex: 0,     // 0 ~ 14 對應你的 15 張圖片
    currentNoteName: "C4",   // 顯示用音符名稱
    correctAnswers: 0,
    totalAnswers: 0
};

// 你的圖片對應音符名稱（請根據實際圖片內容調整順序）
const noteData = [
    { file: "IMG2828.jpeg", name: "C4" },
    { file: "IMG2829.jpeg", name: "D4" },
    { file: "IMG2830.jpeg", name: "E4" },
    { file: "IMG2831.jpeg", name: "F4" },
    { file: "IMG2832.jpeg", name: "G4" },
    { file: "IMG2833.jpeg", name: "A4" },
    { file: "IMG2834.jpeg", name: "B4" },
    { file: "IMG2835.jpeg", name: "C5" },
    { file: "IMG2836.jpeg", name: "D5" },
    { file: "IMG2837.jpeg", name: "E5" },
    { file: "IMG2838.jpeg", name: "F5" },
    { file: "IMG2839.jpeg", name: "G5" },
    { file: "IMG2840.jpeg", name: "A5" },
    { file: "IMG2841.jpeg", name: "B5" },
    { file: "IMG2842.jpeg", name: "C6" }
];

function updateUI() {
    document.getElementById("stage").textContent = game.stage;
    document.getElementById("wave").textContent = game.wave;
    document.getElementById("hp").textContent = Math.ceil(game.monsterHP);
    document.getElementById("maxhp").textContent = game.maxMonsterHP;
    document.getElementById("tapDmg").textContent = game.tapDamage;
    document.getElementById("dps").textContent = game.dps;
    document.getElementById("gold").textContent = Math.floor(game.gold);
    document.getElementById("relics").textContent = game.relics;

    const hpPercent = (game.monsterHP / game.maxMonsterHP) * 100;
    document.getElementById("hp-bar-inner").style.width = `${Math.max(hpPercent, 0)}%`;

    // 顯示你的真實譜號圖片
    const noteContainer = document.getElementById("note-display");
    noteContainer.innerHTML = `
        <img src="assets/notes/${noteData[game.currentNoteIndex].file}" 
             alt="${noteData[game.currentNoteIndex].name}" 
             style="width:100%; height:100%; object-fit:contain;">
    `;

    // 同時顯示音符名稱
    document.getElementById("current-note").textContent = noteData[game.currentNoteIndex].name;
}

function spawnMonster() {
    game.monsterHP = Math.floor(120 * Math.pow(1.4, game.stage - 1));
    game.maxMonsterHP = game.monsterHP;

    // 隨機選一張圖片
    game.currentNoteIndex = Math.floor(Math.random() * noteData.length);

    const monsterEl = document.getElementById("monster");
    monsterEl.classList.remove("hit");

    updateUI();
}

function tapMonster() {
    const damage = game.tapDamage;
    game.monsterHP -= damage;
    
    showDamagePopup(damage);
    
    const monsterEl = document.getElementById("monster");
    monsterEl.classList.add("hit");
    setTimeout(() => monsterEl.classList.remove("hit"), 300);

    game.correctAnswers++;
    game.totalAnswers++;

    if (game.monsterHP <= 0) {
        nextWave();
    }

    updateUI();
}

function showDamagePopup(damage) {
    const container = document.getElementById("monster-container");
    const popup = document.createElement("div");
    popup.className = "damage-popup";
    popup.textContent = `-${damage}`;
    popup.style.left = `${Math.random() * 60 + 20}%`;
    popup.style.top = `${Math.random() * 40 + 30}%`;
    container.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
}

function nextWave() {
    game.wave++;
    game.gold += 8 + Math.floor(game.stage * 1.5);

    if (game.wave > 5) {
        game.stage++;
        game.wave = 1;
        game.gold += 25;
    }
    spawnMonster();
}

// 其他功能（升級、重生）保持不變...
function upgradeHero() {
    const cost = Math.floor(25 * Math.pow(1.25, game.heroLevel));
    if (game.gold >= cost) {
        game.gold -= cost;
        game.heroLevel++;
        game.tapDamage += 4;
        updateUI();
    } else {
        alert(`需要 ${cost} 金幣！`);
    }
}

function hireCompanion() {
    const cost = Math.floor(60 * Math.pow(1.3, game.companionCount));
    if (game.gold >= cost) {
        game.gold -= cost;
        game.companionCount++;
        game.dps += 6;
        updateUI();
    } else {
        alert(`需要 ${cost} 金幣！`);
    }
}

function prestige() {
    if (game.stage < 5) {
        alert("至少要到第 5 關才能重生！");
        return;
    }
    const earnedRelics = Math.floor(Math.pow(game.stage, 1.6) * 0.8);
    game.relics += earnedRelics;

    game.stage = 1;
    game.wave = 1;
    game.gold = 0;
    game.heroLevel = 1;
    game.companionCount = 0;
    game.tapDamage = 10 + Math.floor(game.relics * 1.5);
    game.dps = 8 + Math.floor(game.relics * 0.8);

    alert(`重生成功！獲得 ${earnedRelics} 遺物！`);
    spawnMonster();
    updateUI();
}

setInterval(() => {
    if (game.dps > 0 && game.monsterHP > 0) {
        game.monsterHP -= game.dps * 0.2;
        if (game.monsterHP <= 0) nextWave();
        updateUI();
    }
}, 200);

document.getElementById("monster-container").addEventListener("click", tapMonster);

function initGame() {
    spawnMonster();
    updateUI();
}

initGame();
