// ⭐⭐⭐ BOSS TOWER SYSTEM
// ระบบ Boss Tower 10 ชั้น แยกออกมาเป็นไฟล์อิสระ
// เวอร์ชัน: 2.0 - Modal Selection System

// ========================================
// TOWER CONFIGURATION (ปรับแต่งได้ง่าย)
// ========================================

const TOWER_CONFIG = {
    // จำนวนชั้น
    totalFloors: 20,  // ⭐ แก้: 10 → 20 ชั้น
    
    // ตำแหน่งพื้นฐาน (สำหรับ 1024x1024)
    spawnPosition: { x: 512, y: 750 },      // ⭐ แก้: เปลี่ยน Y จาก 800 → 750 (ให้อยู่สูงกว่าเดิม)
    bossPosition: { x: 512, y: 400 },       // ⭐ แก้: เพิ่ม Y จาก 300 → 400
    
    // Background images (1024x1024)
    backgrounds: {
        floor_1_10: {
            image: 'img/BossStage_1.png',
            mask: 'img/BossStage_Mask.png'  // ⭐ ใช้ mask เดียวกันทุกชั้น
        },
        floor_11_15: {
            image: 'img/BossStage_3.png',
            mask: 'img/BossStage_Mask.png'  // ⭐ ใช้ mask เดียวกันทุกชั้น
        },
        floor_16_20: {
            image: 'img/BossStage_4.png',
            mask: 'img/BossStage_Mask.png'  // ⭐ ใช้ mask เดียวกันทุกชั้น
        }
    },
    
    // Map bounds (สำหรับกล้อง)
    bounds: {
        minX: 0,
        maxX: 1024,
        minY: 0,
        maxY: 1024
    },
    
    // Boss configurations (ปรับสเตตัสได้ง่าย)
    bosses: [
        // F1-F10 (BossStage_1.png)
        { level: 20, name: 'Fire Guardian', hp: 2000, atk: 40, def: 25, exp: 1000 },
        { level: 25, name: 'Ice Warden', hp: 3500, atk: 50, def: 30, exp: 1500 },
        { level: 30, name: 'Thunder Knight', hp: 5000, atk: 60, def: 35, exp: 2000 },
        { level: 35, name: 'Dark Assassin', hp: 7000, atk: 70, def: 40, exp: 2500 },
        { level: 40, name: 'Wind Reaper', hp: 9000, atk: 80, def: 45, exp: 3000 },
        { level: 45, name: 'Earth Titan', hp: 12000, atk: 90, def: 50, exp: 3500 },
        { level: 50, name: 'Light Paladin', hp: 15000, atk: 100, def: 55, exp: 4000 },
        { level: 55, name: 'Shadow Demon', hp: 18000, atk: 110, def: 60, exp: 4500 },
        { level: 60, name: 'Blood Dragon', hp: 22000, atk: 130, def: 65, exp: 5000 },
        { level: 70, name: 'Tower Master', hp: 30000, atk: 150, def: 70, exp: 10000 },
        
        // F11-F15 (BossStage_3.png)
        { level: 75, name: 'Void Stalker', hp: 35000, atk: 160, def: 75, exp: 12000 },
        { level: 80, name: 'Chaos Berserker', hp: 40000, atk: 170, def: 80, exp: 14000 },
        { level: 85, name: 'Crystal Golem', hp: 45000, atk: 180, def: 85, exp: 16000 },
        { level: 90, name: 'Phantom Lord', hp: 50000, atk: 190, def: 90, exp: 18000 },
        { level: 95, name: 'Arcane Overlord', hp: 55000, atk: 200, def: 95, exp: 20000 },
        
        // F16-F20 (BossStage_4.png)
        { level: 100, name: 'Inferno Beast', hp: 60000, atk: 210, def: 100, exp: 22000 },
        { level: 105, name: 'Frostbite Wyrm', hp: 65000, atk: 220, def: 105, exp: 24000 },
        { level: 110, name: 'Storm Emperor', hp: 70000, atk: 230, def: 110, exp: 26000 },
        { level: 115, name: 'Abyss King', hp: 80000, atk: 250, def: 120, exp: 30000 },
        { level: 120, name: 'Tower God', hp: 100000, atk: 300, def: 150, exp: 50000 }
    ],
    
    // Respawn time (seconds)
    bossRespawnTime: 3600  // ⭐ 1 hour (3600 seconds)
};

// ========================================
// TOWER STATE MANAGEMENT
// ========================================

// Initialize tower state in game object
function initializeTowerSystem() {
    if (!game.tower) {
        game.tower = {
            clearedFloors: [1],  // ชั้น 1 เข้าได้ตลอด
            bossDefeated: {},    // { tower_1: true, ... }
            bossRespawnTimer: {} // { tower_1: 300, ... }
        };
    }
    
    console.log('🏰 Tower System Initialized');
}

// ========================================
// MAP GENERATION
// ========================================

function generateTowerMaps() {
    const maps = {};
    
    for (let i = 1; i <= TOWER_CONFIG.totalFloors; i++) {
        const mapKey = `tower_${i}`;
        const bossConfig = TOWER_CONFIG.bosses[i - 1];
        
        // เลือก background และ mask ตามชั้น
        let bgConfig;
        if (i <= 10) {
            bgConfig = TOWER_CONFIG.backgrounds.floor_1_10;    // F1-10: BossStage_1
        } else if (i <= 15) {
            bgConfig = TOWER_CONFIG.backgrounds.floor_11_15;   // F11-15: BossStage_3
        } else {
            bgConfig = TOWER_CONFIG.backgrounds.floor_16_20;   // F16-20: BossStage_4
        }
        
        maps[mapKey] = {
            name: `Boss Tower F${i}`,
            background: bgConfig.image,
            mask: bgConfig.mask,  // ⭐ ใช้ mask เดียวกันทุกชั้น (BossStage_Mask.png)
            spawnPoint: { ...TOWER_CONFIG.spawnPosition },
            portals: [],  // ไม่ใช้ portal แล้ว
            allowMonsters: false,
            bounds: TOWER_CONFIG.bounds,
            boss: { ...bossConfig }
        };
    }
    
    console.log(`🏰 Generated ${TOWER_CONFIG.totalFloors} tower maps`);
    return maps;
}

// ========================================
// BOSS SPAWNING
// ========================================

function spawnTowerBoss(mapName) {
    console.log(`🎯 spawnTowerBoss called for: ${mapName}`);
    
    const mapData = game.maps[mapName];
    if (!mapData || !mapData.boss) {
        console.warn(`⚠️ No boss config for ${mapName}`);
        return;
    }
    
    console.log(`   Boss config: ${JSON.stringify(mapData.boss)}`);
    
    // ⭐ เช็คว่าบอสตายแล้วและยัง cooldown อยู่หรือไม่
    if (game.tower && game.tower.bossDefeated[mapName] && 
        game.tower.bossRespawnTimer[mapName] > 0) {
        const timer = game.tower.bossRespawnTimer[mapName];
        const minutes = Math.floor(timer / 60);
        const seconds = Math.floor(timer % 60);
        console.log(`⏳ Boss on cooldown: ${minutes}:${seconds.toString().padStart(2, '0')} remaining`);
        return; // ไม่ spawn
    }
    
    // Clear existing tower boss
    const beforeCount = game.monsters.length;
    game.monsters = game.monsters.filter(m => !m.isTowerBoss);
    console.log(`   Cleared ${beforeCount - game.monsters.length} existing tower bosses`);
    
    // เช็คว่า Monster class มีหรือไม่
    if (typeof Monster === 'undefined') {
        console.error(`❌ Monster class not found!`);
        return;
    }
    
    const bossConfig = mapData.boss;
    
    console.log(`   Creating boss at (${TOWER_CONFIG.bossPosition.x}, ${TOWER_CONFIG.bossPosition.y})`);
    
    try {
        const boss = new Monster(
            TOWER_CONFIG.bossPosition.x,
            TOWER_CONFIG.bossPosition.y,
            bossConfig.level,  // ⭐ แก้: level มาก่อน
            'towerBoss'        // ⭐ แก้: type มาทีหลัง
        );
        
        boss.name = bossConfig.name;
        boss.hp = bossConfig.hp;
        boss.maxHp = bossConfig.hp;
        boss.atk = bossConfig.atk;
        boss.def = bossConfig.def;
        boss.expReward = bossConfig.exp;
        boss.isTowerBoss = true;
        
        game.monsters.push(boss);
        
        console.log(`👹 Tower Boss spawned: ${boss.name} (Level ${boss.level})`);
        console.log(`   Position: (${boss.x}, ${boss.y})`);
        console.log(`   HP: ${boss.hp}/${boss.maxHp}`);
        console.log(`   Total monsters: ${game.monsters.length}`);
        console.log(`   Boss object:`, boss);
    } catch (error) {
        console.error(`❌ Error spawning boss:`, error);
    }
}

// ========================================
// BOSS DEATH HANDLER
// ========================================

function handleTowerBossDefeat(mapName) {
    console.log(`💀 Tower Boss defeated on ${mapName}!`);
    
    // Mark as defeated
    game.tower.bossDefeated[mapName] = true;
    
    // Set respawn timer
    game.tower.bossRespawnTimer[mapName] = TOWER_CONFIG.bossRespawnTime;
    
    // Unlock next floor
    const currentFloor = parseInt(mapName.replace('tower_', ''));
    if (currentFloor < TOWER_CONFIG.totalFloors) {
        const nextFloor = currentFloor + 1;
        if (!game.tower.clearedFloors.includes(nextFloor)) {
            game.tower.clearedFloors.push(nextFloor);
            console.log(`🔓 Unlocked Floor ${nextFloor}!`);
        }
    }
    
    // Show victory modal
    showTowerVictoryModal(currentFloor);
}

// ========================================
// TOWER SELECTION MODAL
// ========================================

function showTowerSelectionModal() {
    const modal = document.getElementById('towerSelectionModal');
    const floorList = document.getElementById('towerFloorList');
    
    if (!modal || !floorList) {
        console.error('❌ Tower selection modal not found!');
        return;
    }
    
    // Clear existing list
    floorList.innerHTML = '';
    
    // Generate floor buttons
    for (let i = 1; i <= TOWER_CONFIG.totalFloors; i++) {
        const mapKey = `tower_${i}`;
        const bossConfig = TOWER_CONFIG.bosses[i - 1];
        const isUnlocked = game.tower.clearedFloors.includes(i);
        const cooldown = game.tower.bossRespawnTimer[mapKey] || 0;
        
        const floorBtn = document.createElement('div');
        floorBtn.className = `tower-floor-btn ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        let statusText = '';
        let statusClass = '';
        
        if (!isUnlocked) {
            statusText = '🔒 Locked';
            statusClass = 'status-locked';
        } else if (cooldown > 0) {
            const minutes = Math.floor(cooldown / 60);
            const seconds = Math.floor(cooldown % 60);
            statusText = `⏳ Boss Respawn: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            statusClass = 'status-cooldown';
        } else {
            statusText = '✅ Ready';
            statusClass = 'status-ready';
        }
        
        floorBtn.innerHTML = `
            <div class="floor-info">
                <div class="floor-number">Floor ${i}</div>
                <div class="floor-boss">👹 ${bossConfig.name}</div>
                <div class="floor-level">Level ${bossConfig.level}</div>
            </div>
            <div class="floor-status ${statusClass}">${statusText}</div>
        `;
        
        if (isUnlocked) {
            floorBtn.onclick = () => enterTowerFloor(i);
        }
        
        floorList.appendChild(floorBtn);
    }
    
    modal.style.display = 'flex';
}

function closeTowerSelectionModal() {
    const modal = document.getElementById('towerSelectionModal');
    if (modal) modal.style.display = 'none';
}

function enterTowerFloor(floorNumber) {
    const mapKey = `tower_${floorNumber}`;
    
    console.log(`🏰 Entering Tower Floor ${floorNumber}...`);
    console.log(`   Config spawn: (${TOWER_CONFIG.spawnPosition.x}, ${TOWER_CONFIG.spawnPosition.y})`);
    console.log(`   Config boss: (${TOWER_CONFIG.bossPosition.x}, ${TOWER_CONFIG.bossPosition.y})`);
    
    closeTowerSelectionModal();
    
    // Warp to tower
    changeMap(mapKey);
    game.player.x = TOWER_CONFIG.spawnPosition.x;
    game.player.y = TOWER_CONFIG.spawnPosition.y;
    
    console.log(`   Player actual position: (${game.player.x}, ${game.player.y})`);
    console.log(`   Map: ${game.currentMap}`);
    console.log(`   Bounds: ${JSON.stringify(game.maps[mapKey].bounds)}`);
    
    // Teleport mercenaries
    if (typeof teleportMercenariesToPlayer === 'function') {
        teleportMercenariesToPlayer();
    }
    
    // Note: Boss spawning handled by changeMap()
    console.log(`   Boss spawning delegated to changeMap()`);
    console.log(`   Current monsters: ${game.monsters.length}`);
    
    // เช็คว่า Mask โหลดหรือยัง
    if (MASKS[mapKey]) {
        console.log(`   Mask loaded: ${MASKS[mapKey].loaded}`);
        if (MASKS[mapKey].canvas) {
            console.log(`   Mask size: ${MASKS[mapKey].canvas.width}x${MASKS[mapKey].canvas.height}`);
            
            // ⭐ เช็ค brightness ที่ spawn point
            try {
                const ctx = MASKS[mapKey].context;
                const px = Math.floor(game.player.x);
                const py = Math.floor(game.player.y);
                const pixelData = ctx.getImageData(px, py, 1, 1).data;
                const r = pixelData[0];
                const g = pixelData[1];
                const b = pixelData[2];
                const alpha = pixelData[3];  // ⭐ Alpha channel
                
                console.log(`   🎨 Spawn Point Alpha Check:`);
                console.log(`      Position: (${px}, ${py})`);
                console.log(`      RGBA: (${r}, ${g}, ${b}, ${alpha})`);
                console.log(`      Alpha: ${alpha} / 255`);
                console.log(`      Walkable: ${alpha <= 128 ? '✅ YES (transparent)' : '❌ NO (opaque)'}`);
            } catch (err) {
                console.warn(`   ⚠️ Could not check spawn alpha:`, err);
            }
        }
    } else {
        console.warn(`   ⚠️ No mask found for ${mapKey}`);
    }
    
    createFloatingText(game.player.x, game.player.y - 50, `🏰 Floor ${floorNumber}`, '#9b59b6', 24);
}

// ========================================
// TOWER VICTORY MODAL
// ========================================

function showTowerVictoryModal(currentFloor) {
    const modal = document.getElementById('towerVictoryModal');
    const floorText = document.getElementById('victoryFloorText');
    const nextBtn = document.getElementById('victoryNextBtn');
    
    if (!modal || !floorText) {
        console.error('❌ Tower victory modal not found!');
        return;
    }
    
    floorText.textContent = `Floor ${currentFloor} Cleared!`;
    
    // Show/hide next button
    if (currentFloor < TOWER_CONFIG.totalFloors && nextBtn) {
        nextBtn.style.display = 'block';
        nextBtn.onclick = () => {
            closeTowerVictoryModal();
            enterTowerFloor(currentFloor + 1);
        };
    } else if (nextBtn) {
        nextBtn.style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function closeTowerVictoryModal() {
    const modal = document.getElementById('towerVictoryModal');
    if (modal) modal.style.display = 'none';
}

function exitTowerToTown() {
    closeTowerVictoryModal();
    
    // Warp to town
    changeMap('town');
    game.player.x = 900;
    game.player.y = 900;
    
    if (typeof teleportMercenariesToPlayer === 'function') {
        teleportMercenariesToPlayer();
    }
    
    createFloatingText(game.player.x, game.player.y - 50, '🏠 Returned to Town!', '#3498db', 24);
}

// ========================================
// UPDATE TOWER SYSTEM (Real-time cooldown)
// ========================================

function updateTowerSystem(delta) {
    if (!game.tower) return;
    
    // Update boss respawn timers
    Object.keys(game.tower.bossRespawnTimer).forEach(mapName => {
        if (game.tower.bossRespawnTimer[mapName] > 0) {
            game.tower.bossRespawnTimer[mapName] -= delta;
            
            // Respawn boss if player is in that map
            if (game.tower.bossRespawnTimer[mapName] <= 0 && game.currentMap === mapName) {
                game.tower.bossDefeated[mapName] = false;
                spawnTowerBoss(mapName);
                createFloatingText(game.player.x, game.player.y - 50, '👹 Boss Respawned!', '#e74c3c', 20);
            }
        }
    });
    
    // Update cooldown display if modal is open
    const modal = document.getElementById('towerSelectionModal');
    if (modal && modal.style.display === 'flex') {
        updateTowerSelectionDisplay();
    }
}

function updateTowerSelectionDisplay() {
    const floorBtns = document.querySelectorAll('.tower-floor-btn');
    
    floorBtns.forEach((btn, index) => {
        const floorNum = index + 1;
        const mapKey = `tower_${floorNum}`;
        const cooldown = game.tower.bossRespawnTimer[mapKey] || 0;
        const statusEl = btn.querySelector('.floor-status');
        
        if (!statusEl) return;
        
        const isUnlocked = game.tower.clearedFloors.includes(floorNum);
        
        if (!isUnlocked) {
            statusEl.textContent = '🔒 Locked';
            statusEl.className = 'floor-status status-locked';
        } else if (cooldown > 0) {
            const minutes = Math.floor(cooldown / 60);
            const seconds = Math.floor(cooldown % 60);
            statusEl.textContent = `⏳ Boss Respawn: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            statusEl.className = 'floor-status status-cooldown';
        } else {
            statusEl.textContent = '✅ Ready';
            statusEl.className = 'floor-status status-ready';
        }
    });
}

// ========================================
// EXPORT TO GLOBAL SCOPE
// ========================================

window.TowerSystem = {
    // Core functions
    initialize: initializeTowerSystem,
    generateMaps: generateTowerMaps,
    update: updateTowerSystem,
    
    // Boss management
    spawnBoss: spawnTowerBoss,
    handleBossDefeat: handleTowerBossDefeat,
    
    // UI functions
    showSelectionModal: showTowerSelectionModal,
    closeSelectionModal: closeTowerSelectionModal,
    showVictoryModal: showTowerVictoryModal,
    closeVictoryModal: closeTowerVictoryModal,
    exitToTown: exitTowerToTown,
    
    // Configuration
    config: TOWER_CONFIG
};

console.log('🏰 Tower System Module Loaded!');
