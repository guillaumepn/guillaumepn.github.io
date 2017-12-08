var transparent = true;
var antialias = false;
var game = new Phaser.Game(768, 640, Phaser.AUTO, 'catfish-game', this, transparent, antialias);

// Inputs
var cursors;
var keyPressed = false;

// Objects
var player = {
  sprite: undefined,
  x: 32,
  y: 32,
  direction: 'down'
};

var catfish = {
  preload: function () {
  //  Chargement images
    game.load.image('fond', 'assets/images/background.png');
    game.load.image('player', 'assets/images/cat.png');
  },
  create: function () {
  //  Setup + affichage
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'fond');
    cursors = game.input.keyboard.createCursorKeys();

    player.sprite = game.add.sprite(player.x, player.y, 'player');
    player.sprite.anchor.set(0.5);

    game.physics.arcade.enable(player.sprite);

  },
  update: function () {
  //  Logique et déroulement du jeu
    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;

    // Down
    if (cursors.down.isDown) {
      if (!this.keyPressed && player.sprite.y < 608) {
        player.sprite.y += 64;
        this.keyPressed = true;
      }
    }
    else if (cursors.down.isUp) {
      this.keyPressed = false;
    }

    // Up
    if (cursors.up.isDown) {
      if (!this.keyPressed && player.sprite.y > 32) {
        player.sprite.y -= 64;
        this.keyPressed = true;
      }
    }
    else if (cursors.up.isUp) {
      this.keyPressed = false;
    }

    // Left
    if (cursors.left.isDown) {
      if (!this.keyPressed && player.sprite.x > 32) {
        player.sprite.x -= 64;
        this.keyPressed = true;
      }
    }
    else if (cursors.left.isUp) {
      this.keyPressed = false;
    }

    // Right
    if (cursors.right.isDown) {
      if (!this.keyPressed && player.sprite.x < 736) {
        player.sprite.x += 64;
        this.keyPressed = true;
      }
    }
    else if (cursors.right.isUp) {
      this.keyPressed = false;
    }


  }
};

game.state.add('catfish', catfish);
game.state.start('catfish');
