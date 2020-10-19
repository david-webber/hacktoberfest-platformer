//main game file
export default class extends Phaser.Scene {
	constructor() {
		super({
			key: `Main`
		});
	}

	preload() {
		var progress = this.add.graphics();

		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffffff, 1);
			progress.fillRect(0, 270, 800 * value, 60);
		});

		this.load.on('complete', function () {
			progress.destroy();
		});

		this.load.setPath('/src/assets/');
		this.load.image('bg', 'Graveyard-bg.png');
		this.load.image('horizon', 'horizon.png');
		this.load.image('path', 'path.png');
		this.load.image('platform', 'platform.png');
		this.load.image('gy3', 'gy3.png');
		this.load.image('pr', 'pull-request.png')
		this.load.image('pumpkin', 'pumpkin.png');

		this.load.spritesheet('dude', 'dude.png', {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	create() {

		this.horizon = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2 - 100, window.innerWidth * 2, 400, 'horizon');
		this.tilesprite2 = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2 - 100, window.innerWidth * 2, 500, 'gy3');
		this.tilesprite = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth * 2, 500, 'bg');
		this.path = this.add.tileSprite(window.innerWidth / 2, window.innerHeight - 50, window.innerWidth * 2, 50, 'path');

		this.horizon.setTint(0x0000dd, 0xddd000, 0x0000dd, 0xdd0000);
		this.tilesprite2.setTint(0x2222ee, 0xfff000, 0xffffee, 0xee1111);
		this.tilesprite.setTint(0x999999);

		const platforms = this.physics.add.staticGroup();
		// bottom right platform
		platforms.create(1150, 557, 'platform').setScale(0.6).refreshBody();
		// top right platform
		platforms.create(1130, 200, 'platform').setScale(0.1).refreshBody();
		// mid left platform
		platforms.create(198, 250, 'platform').setScale(0.4);

		
		// added little bounce to sprite
		this.player = this.physics.add.sprite(100, 450, 'dude');

		this.physics.add.collider(this.player, platforms);
		this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);

		
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
			key: 'turn',
			frames: [{
				key: 'dude',
				frame: 4
			}],
			frameRate: 20
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});



		this.cursors = this.input.keyboard.createCursorKeys();

		prs = this.physics.add.group({
			key: 'pr',
			repeat: 1,
			setXY: {
				x: 1,
				y: 5,
				stepX: 30
			}
		});

		prs.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.1));
		});

		this.physics.add.collider(prs, platforms);
		this.physics.add.overlap(this.player, prs, collectPr, null, this);

		function collectPr (player, pr) {
			pr.disableBody(true, true);
		}	

	}


	update() {

		if (this.cursors.left.isDown) {
			this.player.setVelocityX(-160);
			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.player.setVelocityX(160);
			this.tilesprite.tilePositionX += 1;
			this.tilesprite2.tilePositionX += 0.8;
			this.horizon.tilePositionX += 0.4;
			this.path.tilePositionX += 1;
			this.player.anims.play('right', true);
		} else {
			this.player.setVelocityX(0);

			this.player.anims.play('turn');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330);
		}



	}
}