// Enhanced Combat System
document.addEventListener('DOMContentLoaded', function() {
    const spartan = document.getElementById('spartan');
    const sword = document.getElementById('sword');
    const shield = document.getElementById('shield');
    const enemy = document.getElementById('enemy');
    const effects = document.getElementById('effects');
    
    // Health elements
    const spartanHealthFill = document.getElementById('spartan-health-fill');
    const spartanHealthText = document.getElementById('spartan-health-text');
    const enemyHealthFill = document.getElementById('enemy-health-fill');
    const enemyHealthText = document.getElementById('enemy-health-text');
    
    // Stats elements
    const killsElement = document.getElementById('kills');
    const comboElement = document.getElementById('combo');
    const rageElement = document.getElementById('rage');
    
    // Game state
    let position = { x: 0, y: 0 };
    let spartanHealth = 100;
    let enemyHealth = 100;
    let isAttacking = false;
    let isBlocking = false;
    let isEnemyAttacking = false;
    let gameRunning = true;
    let kills = 0;
    let combo = 0;
    let rage = 0;
    let lastHitTime = 0;
    
    const speed = 15;
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 500;
    
    // Update display
    function updateDisplay() {
        spartanHealthFill.style.width = spartanHealth + '%';
        spartanHealthText.textContent = spartanHealth;
        enemyHealthFill.style.width = enemyHealth + '%';
        enemyHealthText.textContent = enemyHealth;
        killsElement.textContent = kills;
        comboElement.textContent = combo;
        rageElement.textContent = rage + '%';
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', function(event) {
        if (!gameRunning) return;
        
        const key = event.key.toLowerCase();
        
        // Movement
        switch(key) {
            case 'w':
            case 'arrowup':
                position.y = Math.max(position.y - speed, -maxY/2);
                break;
            case 's':
            case 'arrowdown':
                position.y = Math.min(position.y + speed, maxY/2);
                break;
            case 'a':
            case 'arrowleft':
                position.x = Math.max(position.x - speed, -maxX/2);
                break;
            case 'd':
            case 'arrowright':
                position.x = Math.min(position.x + speed, maxX/2);
                break;
            case ' ':
                event.preventDefault();
                if (!isAttacking) {
                    attack();
                }
                break;
            case 'shift':
                event.preventDefault();
                if (!isBlocking) {
                    block();
                }
                break;
            case 'r':
                event.preventDefault();
                if (rage >= 100) {
                    rageMode();
                }
                break;
        }
        
        // Update spartan position
        spartan.style.left = (30 + position.x) + '%';
        spartan.style.top = (50 + position.y) + '%';
        spartan.style.transform = `translate(-50%, -50%) scale(1.2) ${position.x < 0 ? 'scaleX(-1)' : 'scaleX(1)'}`;
        
        // Add running animation
        if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            spartan.classList.add('running');
        }
    });
    
    document.addEventListener('keyup', function(event) {
        const key = event.key.toLowerCase();
        if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            spartan.classList.remove('running');
        }
        if (key === 'shift') {
            stopBlock();
        }
    });
    
    // Attack function
    function attack() {
        if (isAttacking) return;
        
        isAttacking = true;
        sword.classList.add('attacking');
        
        // Check if enemy is in range
        const spartanRect = spartan.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(spartanRect.left - enemyRect.left, 2) + 
            Math.pow(spartanRect.top - enemyRect.top, 2)
        );
        
        if (distance < 250) {
            // Hit the enemy
            hitEnemy();
        }
        
        setTimeout(() => {
            sword.classList.remove('attacking');
            isAttacking = false;
        }, 300);
    }
    
    // Block function
    function block() {
        isBlocking = true;
        shield.classList.add('blocking');
        spartan.classList.add('blocking');
    }
    
    function stopBlock() {
        isBlocking = false;
        shield.classList.remove('blocking');
        spartan.classList.remove('blocking');
    }
    
    // Hit enemy function
    function hitEnemy() {
        const currentTime = Date.now();
        const timeSinceLastHit = currentTime - lastHitTime;
        
        // Check for combo
        if (timeSinceLastHit < 1000) {
            combo++;
            rage += 5;
        } else {
            combo = 1;
            rage += 2;
        }
        
        lastHitTime = currentTime;
        
        // Calculate damage
        let damage = 15;
        if (combo >= 3) {
            damage = 25; // Critical hit
            createCriticalEffect(enemy.getBoundingClientRect());
        } else {
            createHitEffect(enemy.getBoundingClientRect());
        }
        
        enemyHealth -= damage;
        updateDisplay();
        
        // Check if enemy is dead
        if (enemyHealth <= 0) {
            killEnemy();
        } else {
            // Enemy takes damage but survives
            enemy.classList.add('hit');
            setTimeout(() => {
                enemy.classList.remove('hit');
            }, 500);
        }
    }
    
    // Kill enemy function
    function killEnemy() {
        kills++;
        combo += 5;
        rage += 20;
        updateDisplay();
        
        // Create death effect
        createDeathEffect(enemy.getBoundingClientRect());
        
        // Hide enemy
        enemy.style.opacity = '0';
        enemy.style.transform = 'translate(50%, -50%) scale(1.1) scale(0)';
        
        // Respawn new enemy after delay
        setTimeout(() => {
            respawnEnemy();
        }, 2000);
    }
    
    // Rage mode function
    function rageMode() {
        rage = 0;
        spartan.classList.add('rage-mode');
        updateDisplay();
        
        // Rage mode effects
        setTimeout(() => {
            spartan.classList.remove('rage-mode');
        }, 5000);
    }
    
    // Enemy AI
    function enemyAI() {
        if (!gameRunning || isEnemyAttacking) return;
        
        const spartanRect = spartan.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(spartanRect.left - enemyRect.left, 2) + 
            Math.pow(spartanRect.top - enemyRect.top, 2)
        );
        
        // Enemy attacks if close enough
        if (distance < 200 && Math.random() < 0.02) {
            enemyAttack();
        }
        
        // Move enemy towards player occasionally
        if (Math.random() < 0.01) {
            moveEnemyTowardsPlayer();
        }
    }
    
    // Enemy attack function
    function enemyAttack() {
        isEnemyAttacking = true;
        enemy.classList.add('attacking');
        
        const spartanRect = spartan.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(spartanRect.left - enemyRect.left, 2) + 
            Math.pow(spartanRect.top - enemyRect.top, 2)
        );
        
        if (distance < 200) {
            // Check if spartan is blocking
            if (isBlocking) {
                // Blocked attack
                createBlockEffect(spartan.getBoundingClientRect());
                rage += 5;
            } else {
                // Hit spartan
                spartanHealth -= 10;
                createHitEffect(spartan.getBoundingClientRect());
                combo = 0; // Reset combo when hit
            }
            updateDisplay();
            
            if (spartanHealth <= 0) {
                gameOver();
            }
        }
        
        setTimeout(() => {
            enemy.classList.remove('attacking');
            isEnemyAttacking = false;
        }, 500);
    }
    
    // Move enemy towards player
    function moveEnemyTowardsPlayer() {
        const spartanRect = spartan.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        
        const deltaX = spartanRect.left - enemyRect.left;
        const deltaY = spartanRect.top - enemyRect.top;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 150) {
            const moveX = (deltaX / distance) * 20;
            const moveY = (deltaY / distance) * 20;
            
            const currentRight = parseFloat(enemy.style.right) || 20;
            const currentTop = parseFloat(enemy.style.top) || 50;
            
            enemy.style.right = Math.max(5, Math.min(40, currentRight - moveX/10)) + '%';
            enemy.style.top = Math.max(20, Math.min(80, currentTop + moveY/10)) + '%';
        }
    }
    
    // Create effects
    function createHitEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'hit-effect';
        effect.style.left = (rect.left + rect.width/2 - 30) + 'px';
        effect.style.top = (rect.top + rect.height/2 - 30) + 'px';
        
        effects.appendChild(effect);
        
        setTimeout(() => {
            if (effects.contains(effect)) {
                effects.removeChild(effect);
            }
        }, 600);
    }
    
    function createCriticalEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'critical-hit';
        effect.style.left = (rect.left + rect.width/2 - 40) + 'px';
        effect.style.top = (rect.top + rect.height/2 - 40) + 'px';
        
        effects.appendChild(effect);
        
        setTimeout(() => {
            if (effects.contains(effect)) {
                effects.removeChild(effect);
            }
        }, 800);
    }
    
    function createBlockEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'block-effect';
        effect.style.left = (rect.left + rect.width/2 - 25) + 'px';
        effect.style.top = (rect.top + rect.height/2 - 25) + 'px';
        
        effects.appendChild(effect);
        
        setTimeout(() => {
            if (effects.contains(effect)) {
                effects.removeChild(effect);
            }
        }, 400);
    }
    
    function createDeathEffect(rect) {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const effect = document.createElement('div');
                effect.className = 'critical-hit';
                effect.style.left = (rect.left + rect.width/2 - 40 + (Math.random() - 0.5) * 80) + 'px';
                effect.style.top = (rect.top + rect.height/2 - 40 + (Math.random() - 0.5) * 80) + 'px';
                
                effects.appendChild(effect);
                
                setTimeout(() => {
                    if (effects.contains(effect)) {
                        effects.removeChild(effect);
                    }
                }, 800);
            }, i * 100);
        }
    }
    
    // Respawn enemy
    function respawnEnemy() {
        enemyHealth = 100;
        enemy.style.opacity = '1';
        enemy.style.transform = 'translate(50%, -50%) scale(1.1)';
        enemy.style.right = (Math.random() * 30 + 10) + '%';
        enemy.style.top = (Math.random() * 40 + 30) + '%';
        
        updateDisplay();
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        alert(`Game Over!\nKills: ${kills}\nFinal Combo: ${combo}`);
        location.reload();
    }
    
    // Initialize game
    function initGame() {
        updateDisplay();
        respawnEnemy();
        
        // Start game loop
        setInterval(enemyAI, 100);
        
        // Health regeneration
        setInterval(() => {
            if (spartanHealth < 100 && gameRunning) {
                spartanHealth = Math.min(100, spartanHealth + 1);
                updateDisplay();
            }
        }, 3000);
        
        // Combo decay
        setInterval(() => {
            if (combo > 0 && gameRunning) {
                combo = Math.max(0, combo - 1);
                updateDisplay();
            }
        }, 2000);
    }
    
    // Start the game
    initGame();
    
    // Reset position on window resize
    window.addEventListener('resize', function() {
        const newMaxX = window.innerWidth - 300;
        const newMaxY = window.innerHeight - 500;
        
        if (position.x > newMaxX/2) position.x = newMaxX/2;
        if (position.x < -newMaxX/2) position.x = -newMaxX/2;
        if (position.y > newMaxY/2) position.y = newMaxY/2;
        if (position.y < -newMaxY/2) position.y = -newMaxY/2;
    });
});
