/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// the game itself
var	game;
	// the spinning wheel
var	wheel; 
	// can the wheel spin?
var	canSpin;
	// slices (prizes) placed in the wheel
var	slices = 12;
	// prize names, starting from 12 o'clock going clockwise
var	slicePrizes = ["Tất cả uống 100%", "Uống 50% + thêm lượt quay", "Uống 50%", "Bên phải uống 50%", "Uống 200% bỏ 1 lượt uống sau", "Qua tour", "Uống 50%", "Uống 100% với người chỉ định", "Bên trái uống 50%", "Uống 100% với hai người kế bên", "Uống 100% miễn quay vòng sau", "Uống 50% nhờ trợ giúp 50%"];
	// the prize you are about to win
var	prize;
	// text field where to show the prize
var	prizeText;
var gwidth = screen.width;
var gheight = screen.height;
var app = {
    // Application Constructor
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
	onDeviceReady: function() {
        game = new Phaser.Game(gwidth, gwidth, Phaser.AUTO, "");
		// adding "PlayGame" state
		game.state.add("PlayGame",playGame);
		// launching "PlayGame" state
		game.state.start("PlayGame");
    }	
};
playGame = function(game){};
playGame.prototype = {
		// function to be executed once the state preloads
		preload: function(){
			// preloading graphic assets
			game.load.image("wheel", "img/wheel.png");
			game.load.image("pin", "img/pin.png");     
		},
		 // funtion to be executed when the state is created
		create: function(){
			  // giving some color to background
			game.stage.backgroundColor = "#FFFFFF";
			  // adding the wheel in the middle of the canvas
			wheel = game.add.sprite(gwidth/2 , gheight / 2, "wheel");
			wheel.width = gheight;
			wheel.height = gheight;
			// setting wheel registration point in its center
			wheel.anchor.set(0.5);
			  // adding the pin in the middle of the canvas
			var pin = game.add.sprite(gwidth/2 , gheight / 2, "pin");
			  // setting pin registration point in its center
			pin.anchor.set(0.5);
			  // adding the text field
			prizeText = game.add.text(game.world.centerX, window.innerHeight, "");
			  // setting text field registration point in its center
			//  prizeText.anchor.set(0.5);
			  // aligning the text to center
			 // prizeText.align = "center";
			  // the game has just started = we can spin the wheel
			canSpin = true;
			  // waiting for your input, then calling "spin" function
			game.input.onDown.add(this.spin, this);		
		},
		// function to spin the wheel
		spin(){
			// can we spin the wheel?
			if(canSpin){  
				// resetting text field
				prizeText.text = "";
				// the wheel will spin round from 2 to 4 times. This is just coreography
				var rounds = game.rnd.between(2, 4);
				// then will rotate by a random number from 0 to 360 degrees. This is the actual spin
				var degrees = game.rnd.between(0, 360);
				// before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
				prize = slices - 1 - Math.floor(degrees / (360 / slices));
				// now the wheel cannot spin because it's already spinning
				canSpin = false;
				// animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
				// the quadratic easing will simulate friction
				var spinTween = game.add.tween(wheel).to({
					angle: 360 * rounds + degrees
				}, 3000, Phaser.Easing.Quadratic.Out, true);
				// once the tween is completed, call winPrize function
				spinTween.onComplete.add(this.winPrize, this);
			}
		},
		// function to assign the prize
		winPrize(){
			  // now we can spin the wheel again
			  canSpin = true;
			  // writing the prize you just won
			  confirm('Xin chúc mừng! bạn trúng giải ' + slicePrizes[prize]);
		}
	}
app.initialize();