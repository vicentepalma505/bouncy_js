function drawCircle(context, x, y, radius, color = "red") {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}

function drawLine(context, [x1, y1], [x2, y2]) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function drawRectangle(context, [x1, y1], [x2, y2]) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1, y2);
    context.lineTo(x2, y2);
    context.lineTo(x2, y1);
    context.lineTo(x1, y1);
    context.closePath();
    context.stroke();
}

let canvas;
let context;
let boing;
let start;
let speed = 100;
let paused;
let muted;

const balls = [];

function checkForCollision(balls) {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            const ballA = balls[i];
            const ballB = balls[j];
            const dx = ballA.x - ballB.x;
            const dy = ballA.y - ballB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ballA.radius + ballB.radius) {
                ballA.dirx = -ballA.dirx;
                ballA.diry = -ballA.diry;
                ballB.dirx = -ballB.dirx;
                ballB.diry = -ballB.diry;

                if (!muted) boing.play().catch(() => { });
            }
        }
    }
}


function step(timestamp, radius = 69, speed = 100, x, y, dx = speed, dy = speed, dirx = 1, diry = 1, color = "red") {
    if (start === undefined) {
        start = timestamp;
    }
    const dt = (timestamp - start) / 1000;
    start = timestamp;

    if (!paused) {
        console.log(dx, dy);
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        context.clearRect(0, 0, width, height);
        drawRectangle(context, [0, 0], [width, height]);
        

        balls.forEach(ball => {
            ball.dx = speed * ball.dirx;
            ball.dy = speed * ball.diry;

            if (ball.x + ball.radius + (ball.dx * dt) >= width || ball.x - ball.radius + (ball.dx * dt) <= 0) {
                ball.dirx = -ball.dirx;
                ball.dx = Math.abs(ball.dx) * ball.dirx;
                if (!muted) boing.play().catch(() => { });
            }
            if (ball.y + ball.radius + (ball.dy * dt) >= height || ball.y - ball.radius + (ball.dy * dt) <= 0) {
                ball.diry = -ball.diry;
                ball.dy = Math.abs(ball.dy) * ball.diry;
                if (!muted) boing.play().catch(() => { });
            }
        });

        checkForCollision(balls);

        balls.forEach(ball => {
            ball.dx = speed * ball.dirx;
            ball.dy = speed * ball.diry;

            ball.x += ball.dx * dt;
            ball.y += ball.dy * dt;
            drawCircle(context, ball.x, ball.y, ball.radius, ball.color);
        });
    }
    window.requestAnimationFrame(step);
}

(() => {
    canvas = document.getElementById("game");
    context = canvas.getContext("2d");
    boing = new Audio("boing.mp3");
    let radius = 69;



    balls.push({
        x: radius + 10,
        y: radius + 10,
        dx: speed,
        dy: speed, 
        dirx: 1,
        diry: 1,
        radius: radius,
        color: "red"
    });

    // Configuración Ball 2
    balls.push({
        x: radius + 1000, // Separadas un poco para que no se superpongan exactamente
        y: radius + 10,
        dx: speed,
        dy: speed,
        dirx: -1, // Dirección opuesta para ver el rebote cruzado
        diry: 1,
        radius: radius,
        color: "blue" // CORREGIDO: Declarado correctamente dentro del objeto
    });

    paused = false;
    muted = false;

    window.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            paused = !paused;
        }
        if (e.key === 'm') {
            muted = !muted;
        }
        if (e.key === '+') {
            if (speed < 1000) speed += 20;
        }
        if (e.key === '-') {
            if (speed > 20) speed -= 20;
        }
    });

    //let ball1 = step(undefined, radius, speed, x1, y1, dx1, dy1, dirx1, diry1);
    window.requestAnimationFrame(step);

    //let ball2 = step(undefined, radius, speed, x2, y2, dx2, dy2, dirx2, diry2, color2);
    //window.requestAnimationFrame(ball2);
})();