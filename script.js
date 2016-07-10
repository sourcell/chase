var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");

var x;
var y;
var dist;
var score = 0;
var started = false;
var fps = 60;

var map = {
	x: 0,
	y: 0,
	width: 1280,
	height: 640
};

var enemy = {
	x: map.width/2,
	y: map.height/2,
	size: 15,
	speed: 4
};

var player = {
	x: 0,
	y: 0,
	size: 15,
	speed: 10
};

document.onmousemove = function(e){
	if(e.clientX > map.width - player.size){
		player.x = map.width - player.size;
	}else{
		player.x = e.clientX;
	}

	if(e.clientY > map.height - player.size){
		player.y = map.height - player.size;
	}else{
		player.y = e.clientY;
	}
}

document.onclick = function(e){
	if(started == false){
		started = true;
	}
}

function drawEnemy(){
	ctx.fillStyle = "#F33";
	ctx.strokeStyle = "#000";
	ctx.beginPath();
	ctx.arc(enemy.x, enemy.y, enemy.size, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
}

function drawPlayer(){
	ctx.fillStyle = "#0A0";
	ctx.strokeStyle = "#000";
	ctx.beginPath();
	ctx.arc(player.x, player.y, player.size, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke();
}

function drawLine(){
	ctx.strokeStyle = "#F00";
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(enemy.x, enemy.y);
	ctx.stroke();
}

function getDist(){
	if(player.x > enemy.x){
		x = player.x - enemy.x;
	}else{
		x = enemy.x - player.x;
	}

	if(player.y > enemy.y){
		y = player.y - enemy.y;
	}else{
		y = enemy.y - player.y;
	}

	dist = Math.round(Math.sqrt(x*x + y*y));
	return dist;
}

function drawDist(){
	ctx.fillStyle = "#000";
	ctx.font = "20px Trebuchet MS";
	ctx.fillText("Distance: " + getDist() + "px", map.x + 20, map.y + 30);
}

function msg(){
	ctx.fillStyle = "#FFF";
	ctx.font = "20px Trebuchet MS";
	ctx.fillText("Click to start!", map.x + 570, map.y + 30);
}

function drawScore(){
	ctx.fillStyle = "#000";
	ctx.font = "20px Trebuchet MS";
	ctx.fillText("Score: " + score, map.width - 100, map.y + 30);
}

function clear(){
	ctx.clearRect(map.x, map.y, map.width, map.height);
}

function enemyMoving(){
	if(started == false){return}

	if(player.x > enemy.x){
		if(player.x - enemy.x > enemy.speed){
			enemy.x += enemy.speed;
		}
	}else{
		if(enemy.x - player.x > enemy.speed){
			enemy.x -= enemy.speed;
		}	
	}

	if(player.y > enemy.y){
		if(player.y - enemy.y > enemy.speed){
			enemy.y += enemy.speed;
		}	
	}else{
		if(enemy.y - player.y > enemy.speed){
			enemy.y -= enemy.speed;
		}
	}
}

function hitCheck(){
	if(getDist() < player.size + enemy.size){
		alert("You have died. Score: " + score);
		score = 0;
		enemy.x = map.width/2;
		enemy.y = map.height/2;
		enemy.size = 15;
		started = false;
	}
}

function incSpeed(){
	if(score < 10){
		enemy.speed = 4;
		enemy.size = 15;
	}else if(score >= 10 && score <= 20){
		enemy.speed = 5;
		enemy.size = 20;
	}else if(score >= 21 && score <= 30){
		enemy.speed = 6;
		enemy.size = 25;
	}else if(score >= 31 && score <= 40){
		enemy.speed = 7;
		enemy.size = 30;
	}else if(score >= 41 && score <= 50){
		enemy.speed = 8;
		enemy.size = 35;
	}else if(score >= 51 && score <= 60){
		enemy.speed = 9;
		enemy.size = 40;
	}else if(score >= 61 && score <= 70){
		enemy.speed = 10;
		enemy.size = 45;
	}else if(score >= 71 && score <= 80){
		enemy.speed = 11;
		enemy.size = 50;
	}else if(score >= 81 && score <= 90){
		enemy.speed = 12;
		enemy.size = 55;
	}else if(score >= 91 && score <= 100){
		enemy.speed = 13;
		enemy.size = 60;
	}
}

setInterval(function(){
	clear();
	drawEnemy();
	drawPlayer();
	drawDist();
	drawScore();
	if(started == false){msg();}
	enemyMoving();
	hitCheck();
}, 1000/fps);

setInterval(function(){
	if(started){
		score++;
	}
	incSpeed();
}, 1000);