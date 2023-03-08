'use strict';

const animationCanvas = document.querySelector('.animation-canvas');
const animationCanvasCtx = animationCanvas.getContext('2d');
const previewCanvas = document.querySelector('.preview-canvas');
const previewCanvasCtx = previewCanvas.getContext('2d');
let imageCluster = null;

//  HealthBar DataSet
const healthBarData = {
	frame: 0,
	frameMax: 23,

	keyFrames: {
		keyFrame01: {
			r: 255,
			g: 0,
			b: 0,
			dx: 92,
			dy: 50,
			dw: 163,
			dh: 30,
		},
		keyFrame02: {
			r: 0,
			g: 0,
			b: 255,
			dx: 92,
			dy: 50,
			dw: 0,
			dh: 30,
		},
	},
};

// Load images before animation starts
const loadImages = async (imageNames) => {
	const images = await Promise.all(
		imageNames.map(
			(name) =>
				new Promise((resolve) => {
					const img = new Image();
					img.onload = () => resolve(img);
					img.src = `assets/img/${name}.png`;
				}),
		),
	);

	imageCluster = imageNames.reduce((acc, name, index) => {
		acc[name] = images[index];
		return acc;
	}, {});

	animate();
};

// This is for tweening
const lerp = (start, end, time) => {
	if (time === 0) return start;
	if (time >= 1) return end;
	return Math.floor(start + (end - start) * time);
};

// This will animate on each frame
const animate = () => {
	const time = healthBarData.frame / healthBarData.frameMax;

	const red = lerp(
		healthBarData.keyFrames.keyFrame01.r,
		healthBarData.keyFrames.keyFrame02.r,
		time,
	);

	const green = lerp(
		healthBarData.keyFrames.keyFrame01.g,
		healthBarData.keyFrames.keyFrame02.g,
		time,
	);

	const blue = lerp(
		healthBarData.keyFrames.keyFrame01.b,
		healthBarData.keyFrames.keyFrame02.b,
		time,
	);

	const dw = lerp(
		healthBarData.keyFrames.keyFrame01.dw,
		healthBarData.keyFrames.keyFrame02.dw,
		time,
	);

	animationCanvasCtx.clearRect(0, 0, 256, 128);
	animationCanvasCtx.fillStyle = 'white';
	animationCanvasCtx.fillRect(92, 50, 163, 30);
	animationCanvasCtx.fillStyle = `rgba(${red}, ${green}, ${blue})`;
	animationCanvasCtx.fillRect(92, 50, dw, 30);
	animationCanvasCtx.drawImage(imageCluster['HealthBar_256x128'], 0, 0);

	// Draw on preview
	previewCanvasCtx.clearRect(256 * healthBarData.frame, 0, 256, 128);

	previewCanvasCtx.fillStyle = 'white';

	previewCanvasCtx.fillRect(92 + 256 * healthBarData.frame, 50, 163, 30);

	previewCanvasCtx.fillStyle = `rgba(${red}, ${green}, ${blue})`;

	previewCanvasCtx.fillRect(92 + 256 * healthBarData.frame, 50, dw, 30);

	previewCanvasCtx.drawImage(
		imageCluster['HealthBar_256x128'],
		256 * healthBarData.frame,
		0,
	);

	// Loop the frames
	if (healthBarData.frame >= healthBarData.frameMax) {
		healthBarData.frame = 0;
	} else {
		healthBarData.frame++;
	}

	setTimeout(() => {
		animate();
	}, 3000 / 23);
};

loadImages(['HealthBar_256x128']);
