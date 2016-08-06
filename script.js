/*
==============================
		CANVAS SETUP
==============================
*/
var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth-6;
canvas.height = window.innerHeight-6;




/*
==============================
	OBJECTS & VARIABLES
==============================
*/
var Game = {
	started: false,
	FPS: 60
}

var map = {
	x: 0,
	y: 0,
	width: canvas.width,
	height: canvas.height,

	clear: function(){
		ctx.clearRect(this.x, this.y, this.width, this.height);
	}
};

var enemy = {
	x: map.width/2,
	y: map.height/2,
	size: 15,
	speed: 5,

	draw: function(){
		ctx.fillStyle = "#F33";
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	follow: function(unit){
		if(Game.started == false){return}

		if(unit.x > this.x){
			if(unit.x - this.x > this.speed){
				this.x += this.speed;
			}
		}else{
			if(this.x - unit.x > this.speed){
				this.x -= this.speed;
			}	
		}

		if(unit.y > this.y){
			if(unit.y - this.y > this.speed){
				this.y += this.speed;
			}	
		}else{
			if(this.y - unit.y > this.speed){
				this.y -= this.speed;
			}
		}		
	},

	reset: function(){
		this.x = map.width/2 - this.size;
		this.y = map.height/2 - this.size;
		this.size = 15;
		this.speed = 5;
	}
};

var player = {
	x: 0,
	y: 0,
	size: 15,
	speed: 10,
	score: 0,
	cheating: false,

	draw: function(){
		ctx.fillStyle = "#0A0";
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
		ctx.fill();
		ctx.stroke();
	},

	drawScore: function(x, y){
		ctx.fillStyle = "#000";
		ctx.font = "20px Trebuchet MS";
		ctx.fillText("Score: " + this.score, x, y);
	},

	drawDist: function(unit, x, y){
		ctx.fillStyle = "#000";
		ctx.font = "20px Trebuchet MS";
		ctx.fillText("Distance: " + getDist(this, unit) + "px", x, y);
	},

	hitCheck: function(unit){
		if(getDist(this, unit) < this.size + unit.size){
			alert("You have died. Score: " + this.score);
			this.reset();
			unit.reset();
			Game.started = false;
		}		
	},

	evade: function(unit){
		if(getDist(this, unit) < this.size*2 + unit.size*2){
			if(unit.x < map.width/2){
				this.x = random(unit.x + unit.size*2 + this.size*2, map.width - this.size);
			}else{
				this.x = random(map.x + this.size, unit.x - unit.size*2 + this.size*2);
			}

			if(unit.y < map.height/2){
				this.y = random(unit.y + unit.size*2 + this.size*2, map.height - this.size);
			}else{
				this.y = random(map.y + this.size, unit.y - unit.size*2 + this.size*2);
			}
		}		
	},

	reset: function(){
		this.score = 0;
	}
};

var msgbox = {
	x: map.width / 2 - 200,
	y: map.height / 2 - 100,
	width: 400,
	height: 200
}




/*
==============================
		EVENTS
==============================
*/

document.addEventListener("mousemove", function(e){
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
});

document.addEventListener("keydown", function(e){
	if(e.keyCode == 45){
		if(player.cheating){
			player.cheating = false;
		}else{
			player.cheating = true;
		}
	}
});

document.addEventListener("mousedown", function(e){
	if(Game.started){
		Game.started = false;
		enemy.reset();
		player.reset();
	}else{
		Game.started = true;
	}
});

function drawLine(){
	ctx.strokeStyle = "#F00";
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(enemy.x, enemy.y);
	ctx.stroke();
}

function getDist(a, b){
	var x;
	var y;

	if(a.x > b.x){
		x = a.x - b.x;
	}else{
		x = b.x - a.x;
	}

	if(a.y > b.y){
		y = a.y - b.y;
	}else{
		y = b.y - a.y;
	}

	return Math.round(Math.sqrt(x*x + y*y));
}

function msg(){
	ctx.fillStyle = "#FFF";
	ctx.font = "20px Trebuchet MS";
	ctx.fillText("Click to start!", map.width / 2 - 70, map.y + 30);
}

function random(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}




/*
==============================
		INTERVALS
==============================
*/
setInterval(function(){
	map.clear();
	
	enemy.draw();
	enemy.follow(player);
	
	player.draw();
	player.drawDist(enemy, 20, 30);
	player.drawScore(map.width - 150, 30);
	player.hitCheck(enemy);

	if(Game.started == false){msg();}
	if(player.cheating == true){player.evade(enemy);}
}, 1000/Game.FPS);


setInterval(function(){
	if(Game.started){
		player.score++;
	}
}, 1000);

setInterval(function(){
	if(Game.started){
		enemy.speed += 1;
		enemy.size += 5;
	}
}, 10000);