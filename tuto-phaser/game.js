var transparent = true;
var antialias = false;
var game = new Phaser.Game(768, 640, Phaser.AUTO, 'catfish-game', this, transparent, antialias);

// Inputs
var cursors;
var keyUpPressed = false;
var keyDownPressed = false;
var keyLeftPressed = false;
var keyRightPressed = false;

// Objects
var player = {
  sprite: undefined,
  x: 32,
  y: 32,
  direction: 'down'
};

var goal = {
  sprite: undefined,
  x: 736,
  y: 608
};

// Sprites and variables

var playerShadow;
var goalShadow;
var shadowOffset = new Phaser.Point(0, 8);


var catfish = {
  preload: function () {
  //  Chargement images
    game.load.image('fond', 'assets/images/background.png');
    game.load.image('player', 'assets/images/cat.png');
    game.load.image('pelote', 'assets/images/woolball.png');
  },
  create: function () {
  //  Setup + affichage
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'fond');
    cursors = game.input.keyboard.createCursorKeys();

    goalShadow = game.add.sprite(goal.x, goal.y, 'pelote');
    goalShadow.tint = 0x333333;
    goalShadow.alpha = 0.6;
    goalShadow.anchor.set(0.5);
    goalShadow.x += shadowOffset.x;
    goalShadow.y += shadowOffset.y;

    goal.sprite = game.add.sprite(goal.x, goal.y, 'pelote');
    goal.sprite.anchor.set(0.5);

    playerShadow = game.add.sprite(player.x, player.y, 'player');
    playerShadow.tint = 0x333333;
    playerShadow.alpha = 0.6;
    playerShadow.anchor.set(0.5);

    player.sprite = game.add.sprite(player.x, player.y, 'player');
    player.sprite.anchor.set(0.5);


    game.physics.arcade.enable(player.sprite);

  },
  update: function () {
  //  Logique et déroulement du jeu
    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;

    playerShadow.x = player.sprite.x + shadowOffset.x;
    playerShadow.y = player.sprite.y + shadowOffset.y;

    // Down
    if (cursors.down.isDown) {
      if (!this.keyDownPressed && player.sprite.y < 608) {
        player.sprite.y += 64;
        this.keyDownPressed = true;
      }
    }
    else if (cursors.down.isUp) {
      this.keyDownPressed = false;
    }

    // Up
    if (cursors.up.isDown) {
      if (!this.keyUpPressed && player.sprite.y > 32) {
        player.sprite.y -= 64;
        this.keyUpPressed = true;
      }
    }
    else if (cursors.up.isUp) {
      this.keyUpPressed = false;
    }

    // Left
    if (cursors.left.isDown) {
      if (!this.keyLeftPressed && player.sprite.x > 32) {
        player.sprite.x -= 64;
        this.keyLeftPressed = true;
      }
    }
    else if (cursors.left.isUp) {
      this.keyLeftPressed = false;
    }

    // Right
    if (cursors.right.isDown) {
      if (!this.keyRightPressed && player.sprite.x < 736) {
        player.sprite.x += 64;
        this.keyRightPressed = true;
      }
    }
    else if (cursors.right.isUp) {
      this.keyRightPressed = false;
    }


  }
};

game.state.add('catfish', catfish);
game.state.start('catfish');
