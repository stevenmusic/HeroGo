// HeroGo! - 音樂音符系統（IMG2528 ~ IMG2542）
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
    
    currentNoteIndex: 0,
    correctAnswers: 0,
    totalAnswers: 0
};

// 你的圖片對應音符名稱（請依照實際圖片內容調整）
const noteData = [
    { file: "IMG2528.jpeg", name: "C4" },
    { file: "IMG2529.jpeg", name: "D4" },
    { file: "IMG2530.jpeg", name: "E4" },
    { file: "IMG2531.jpeg", name: "F4" },
    { file: "IMG2532.jpeg", name: "G4" },
    { file: "IMG2533.jpeg", name: "A4" },
    { file: "IMG2534.jpeg", name: "B4" },
    { file: "IMG2535.jpeg", name: "C5" },
    { file: "IMG2536.jpeg", name: "D5" },
    { file: "IMG2537.jpeg", name: "E5" },
    { file: "IMG2538.jpeg", name: "F5" },
    { file: "IMG2539.jpeg", name: "G5" },
    { file: "IMG2540.jpeg", name: "A5" },
    { file: "IMG2541.jpeg", name: "B5" },
    { file: "IMG2542.jpeg", name: "C6" }
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

    // 顯示你的高音譜號圖片
    const noteContainer = document.getElementById("note-display");
    noteContainer.innerHTML = `
        <img src="assets/${noteData[game.currentNoteIndex].file}" 
             alt="${noteData[game.currentNoteIndex].name}" 
             style="width:100%; height:100%; object-fit:contain; border:3px solid #05d9e8; border-radius:12px;">
    `;

    document.getElementById("current-note").textContent = noteData[game.currentNoteIndex].name;
}

function spawnMonster() {
    game.monsterHP = Math.floor(120 * Math.pow(1.4, game.stage - 1));
    game.maxMonsterHP = game.monsterHP;
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
