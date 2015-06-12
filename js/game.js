var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');
var bestScore  = 0;

var mainState = {
    preload: function() {
        game.stage.backgroundColor = '#ffc';

        game.load.image('bird', 'assets/smile.png');

        game.load.image('pipe', ' assets/rock.png');

        game.load.image('emptyHole', 'assets/empty.png');
    },
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bird = this.game.add.sprite(100, 245, 'bird');

        game.physics.arcade.enable(this.bird);

        this.bird.body.gravity.y = 100;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        spaceKey.onDown.add(this.jump, this);

        //build 磚塊
        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');

        this.emptyHoles = game.add.group();
        this.emptyHoles.enableBody = true;
        this.emptyHoles.createMultiple(8, 'emptyHole');

        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

        this.score = 0;
        this.isPassFirstOne = false;
        this.lableScore = game.add.text(20, 70, "0", {
            font: "30px Arial",
            fill: "#000"
        });
        this.bestScoreLable = game.add.text(20, 20, bestScore, {
            font: "32px Arial",
            fill: "#ff0000"
        });
    },
    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        game.physics.arcade.overlap(this.bird, this.emptyHole, this.hitHole, null, this);
    },
    hitHole: function() {
        console.log('hitHole');
        this.isPassFirstOne = true;
    },
    hitPipe: function() {
        if (this.bird.alive == false) return;
        this.bird.alive = false;

        game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p) {
            p.body.velocity.x = 0;
        }, this)
    },
    jump: function() {
        if (this.bird.alive == false) return;
        this.bird.body.velocity.y = -50;
    },
    restartGame: function() {
        bestScore = this.score;
        game.state.start('main');
    },
    addOnePipe: function(x, y, isEmpty) {
        if (!isEmpty) {
            var pipe = this.pipes.getFirstDead();
            pipe.reset(x, y);
            pipe.body.velocity.x = -200;
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        } else {
            var hole = this.emptyHoles.getFirstDead();
            hole.reset(x, y);
            hole.body.velocity.x = -200;
            hole.checkWorldBounds = true;
            hole.outOfBoundsKill = true;
        }
    },
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1)
                this.addOnePipe(400, i * (50 + 10) + 10, false);
            else
                this.addOnePipe(400, i * (50 + 10) + 10, true);
        }

        if (this.isPassFirstOne) {
            this.score += 1;
            this.lableScore.text = this.score;
            if(score > bestScore)
            {
                bestScore = score;
                this.bestScoreLable.text = bestScore;
            }
        }
    }
};


game.state.add('main', mainState);

game.state.start('main');
