const player = document.getElementById('player');
const bulletContainer = document.getElementById('bullet-container');
const enemyContainer = document.getElementById('enemy-container');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const shootBtn = document.getElementById('shoot-btn');

let gameWidth = window.innerWidth;
let playerPosition = gameWidth / 2 - 20;
let isMovingLeft = false;
let isMovingRight = false;

// Move player using keyboard
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        movePlayer(-25); // Increased speed for keyboard controls
    } else if (e.key === 'ArrowRight') {
        movePlayer(25);  // Increased speed for keyboard controls
    } else if (e.key === ' ') {
        shootBullet();
    }
});

document.addEventListener('keyup', () => {
    isMovingLeft = false;
    isMovingRight = false;
});

// Debugging and Ensuring Touch/Mobile Controls Work

leftBtn.addEventListener('mousedown', () => {
    console.log("Left Button Clicked (Mouse)");
    isMovingLeft = true;
    movePlayerContinuously(-25);  // Increased movement speed for mouse click
});
leftBtn.addEventListener('touchstart', (e) => {
    console.log("Left Button Touched");
    e.preventDefault();  // Prevents default behavior on mobile devices
    isMovingLeft = true;
    movePlayerContinuously(-25);  // Increased movement speed for touch
});
leftBtn.addEventListener('mouseup', () => {
    isMovingLeft = false;
});
leftBtn.addEventListener('touchend', (e) => {
    console.log("Left Button Touch End");
    e.preventDefault();
    isMovingLeft = false;
});

rightBtn.addEventListener('mousedown', () => {
    console.log("Right Button Clicked (Mouse)");
    isMovingRight = true;
    movePlayerContinuously(25);  // Increased movement speed for mouse click
});
rightBtn.addEventListener('touchstart', (e) => {
    console.log("Right Button Touched");
    e.preventDefault();
    isMovingRight = true;
    movePlayerContinuously(25);  // Increased movement speed for touch
});
rightBtn.addEventListener('mouseup', () => {
    isMovingRight = false;
});
rightBtn.addEventListener('touchend', (e) => {
    console.log("Right Button Touch End");
    e.preventDefault();
    isMovingRight = false;
});

shootBtn.addEventListener('mousedown', () => {
    console.log("Shoot Button Clicked (Mouse)");
    shootBullet();
});
shootBtn.addEventListener('touchstart', (e) => {
    console.log("Shoot Button Touched");
    e.preventDefault();
    shootBullet();
});

// Continuous movement while the button is pressed
function movePlayerContinuously(amount) {
    if (isMovingLeft || isMovingRight) {
        movePlayer(amount);
        setTimeout(() => movePlayerContinuously(amount), 50);  // Reduced delay for faster movement
    }
}

// Player movement function
function movePlayer(amount) {
    playerPosition += amount;
    if (playerPosition < 0) playerPosition = 0;
    if (playerPosition > gameWidth - 40) playerPosition = gameWidth - 40;
    player.style.left = `${playerPosition}px`;
}

// Shoot bullets
function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    const playerRect = player.getBoundingClientRect();
    const bulletX = playerRect.left + (playerRect.width / 2) - 2.5;
    bullet.style.left = `${bulletX}px`; bullet.style.bottom = '140px';
    bulletContainer.appendChild(bullet);
    moveBullet(bullet);
}

// Bullet movement
function moveBullet(bullet) {
    let bulletInterval = setInterval(() => {
        const bulletBottom = parseInt(bullet.style.bottom);

        if (bulletBottom > window.innerHeight) {
            clearInterval(bulletInterval);
            bullet.remove();
        } else {
            bullet.style.bottom = `${bulletBottom + 5}px`;
            checkCollision(bullet);
        }
    }, 20);
}

// Spawning enemies
function spawnEnemies() {
    setInterval(() => {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        const randomX = Math.floor(Math.random() * (gameWidth - 30));
        enemy.style.left = `${randomX}px`;
        enemy.style.top = '0px';
        enemyContainer.appendChild(enemy);
        moveEnemy(enemy);
    }, 2000);
}

// Enemy movement
function moveEnemy(enemy) {
    let enemyInterval = setInterval(() => {
        const enemyTop = parseInt(enemy.style.top);
        if (enemyTop > window.innerHeight) {
            clearInterval(enemyInterval);
            enemy.remove();
        } else {
            enemy.style.top = `${enemyTop + 3}px`;
        }
    }, 20);
}

// Collision detection
function checkCollision(bullet) {
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        const bulletRect = bullet.getBoundingClientRect();
        const enemyRect = enemy.getBoundingClientRect();

        if (
            bulletRect.left < enemyRect.left + enemyRect.width &&
            bulletRect.left + bulletRect.width > enemyRect.left &&
            bulletRect.top < enemyRect.top + enemyRect.height &&
            bulletRect.height + bulletRect.top > enemyRect.top
        ) {
            bullet.remove();
            enemy.remove();
        }
    });
}

// Start spawning enemies
spawnEnemies();
