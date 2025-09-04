// Spartan Movement Controls
document.addEventListener('DOMContentLoaded', function() {
    const spartan = document.getElementById('spartan');
    let position = { x: 0, y: 0 };
    const speed = 10;
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 500;
    
    // Handle keyboard input
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        
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
                // Flip spartan to face left
                spartan.style.transform = 'scale(1.2) translateY(0px) scaleX(-1)';
                break;
            case 'd':
            case 'arrowright':
                position.x = Math.min(position.x + speed, maxX/2);
                // Flip spartan to face right
                spartan.style.transform = 'scale(1.2) translateY(0px) scaleX(1)';
                break;
        }
        
        // Update spartan position
        spartan.style.left = (50 + position.x) + '%';
        spartan.style.top = (50 + position.y) + '%';
        spartan.style.transform = `translate(-50%, -50%) scale(1.2) ${position.x < 0 ? 'scaleX(-1)' : 'scaleX(1)'}`;
    });
    
    // Reset position on window resize
    window.addEventListener('resize', function() {
        const newMaxX = window.innerWidth - 300;
        const newMaxY = window.innerHeight - 500;
        
        if (position.x > newMaxX/2) position.x = newMaxX/2;
        if (position.x < -newMaxX/2) position.x = -newMaxX/2;
        if (position.y > newMaxY/2) position.y = newMaxY/2;
        if (position.y < -newMaxY/2) position.y = -newMaxY/2;
    });
    
    // Add running animation when moving
    let isMoving = false;
    let animationId;
    
    document.addEventListener('keydown', function(event) {
        const key = event.key.toLowerCase();
        if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            if (!isMoving) {
                isMoving = true;
                spartan.classList.add('running');
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        const key = event.key.toLowerCase();
        if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            isMoving = false;
            spartan.classList.remove('running');
        }
    });
});
