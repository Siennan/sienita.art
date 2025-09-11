// Battle Arena Game Logic
document.addEventListener('DOMContentLoaded', function() {
    const spartan = document.getElementById('spartan');
    const sword = document.getElementById('sword');
    const enemy = document.getElementById('enemy');
    const effects = document.getElementById('effects');
    const scoreElement = document.getElementById('score');
    const healthElement = document.getElementById('health');
    
    let position = { x: 0, y: 0 };
    let score = 0;
    let health = 100;
    let isAttacking = false;
    let gameRunning = true;
    
    const speed = 15;
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 500;
    
    // Update display
    function updateDisplay() {
        scoreElement.textContent = score;
        healthElement.textContent = health;
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
        }
        
        // Update spartan position
        spartan.style.left = (50 + position.x) + '%';
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
        
        if (distance < 200) {
            // Hit the enemy
            hitEnemy();
        }
        
        setTimeout(() => {
            sword.classList.remove('attacking');
            isAttacking = false;
        }, 300);
    }
    
    // Hit enemy function
    function hitEnemy() {
        enemy.classList.add('hit');
        score += 10;
        updateDisplay();
        
        // Create hit effect
        createHitEffect(enemy.getBoundingClientRect());
        
        // Enemy respawn after hit
        setTimeout(() => {
            enemy.classList.remove('hit');
            respawnEnemy();
        }, 500);
    }
    
    // Create hit effect
    function createHitEffect(rect) {
        const effect = document.createElement('div');
        effect.className = 'hit-effect';
        effect.style.left = (rect.left + rect.width/2 - 25) + 'px';
        effect.style.top = (rect.top + rect.height/2 - 25) + 'px';
        
        effects.appendChild(effect);
        
        setTimeout(() => {
            effects.removeChild(effect);
        }, 500);
    }
    
    // Respawn enemy
    function respawnEnemy() {
        const randomX = Math.random() * (window.innerWidth - 200) + 100;
        const randomY = Math.random() * (window.innerHeight - 300) + 100;
        
        enemy.style.left = randomX + 'px';
        enemy.style.top = randomY + 'px';
    }
    
    // Enemy AI - move towards player occasionally
    function enemyAI() {
        if (!gameRunning) return;
        
        const spartanRect = spartan.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();
        
        const distance = Math.sqrt(
            Math.pow(spartanRect.left - enemyRect.left, 2) + 
            Math.pow(spartanRect.top - enemyRect.top, 2)
        );
        
        // If enemy is too close, damage player
        if (distance < 100) {
            damagePlayer();
        }
        
        // Randomly move enemy
        if (Math.random() < 0.02) {
            const currentLeft = parseInt(enemy.style.left) || window.innerWidth * 0.7;
            const currentTop = parseInt(enemy.style.top) || window.innerHeight * 0.2;
            
            const newLeft = Math.max(50, Math.min(window.innerWidth - 150, currentLeft + (Math.random() - 0.5) * 100));
            const newTop = Math.max(50, Math.min(window.innerHeight - 250, currentTop + (Math.random() - 0.5) * 100));
            
            enemy.style.left = newLeft + 'px';
            enemy.style.top = newTop + 'px';
        }
    }
    
    // Damage player
    function damagePlayer() {
        health -= 5;
        updateDisplay();
        
        if (health <= 0) {
            gameOver();
        }
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        alert(`Game Over! Final Score: ${score}`);
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
            if (health < 100 && gameRunning) {
                health = Math.min(100, health + 1);
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
