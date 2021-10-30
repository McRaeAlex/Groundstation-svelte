<script lang="ts">
	import {
		Spherical,
		DoubleSide,
		GridHelper,
		MathUtils,
		Mesh,
		MeshBasicMaterial,
		PerspectiveCamera,
		PlaneGeometry,
		Scene,
		Sphere,
		Vector3,
		WebGLRenderer
	} from 'three';
	import { OrbitControls } from 'three/examples/js/controls/OrbitControls';

	let canvas: HTMLCanvasElement;
	let compass: HTMLImageElement;

	const scene = new Scene();
	const renderer = new WebGLRenderer({ canvas: canvas });
	renderer.setSize(canvas.width, canvas.height);

	// Basically we want the height and width once its computed
	const parent_computed_styles = getComputedStyle(canvas.parentElement);

	// Get the width and height of the parent
	canvas.width = parseInt(parent_computed_styles.width) - 4;
	canvas.height = parseInt(parent_computed_styles.height) - 1;

	// Create a camera and add arcball controls
	const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
	const controls = new OrbitControls(camera, canvas);

	// Load the models
	const geometry = new PlaneGeometry(5, 5, 32);
	const material = new MeshBasicMaterial({ color: 0xffffff, side: DoubleSide });
	const cube = new Mesh(geometry, material);

	const gridHelper = new GridHelper(10, 10, 'aqua', 'gray');

	// For the compass
	const sph = new Spherical();
	const dir = new Vector3();

	// Create the scene
	scene.add(cube);
	scene.add(gridHelper);

	camera.position.z = 10;
	controls.update();

	function animate() {
		requestAnimationFrame(animate);

		camera.getWorldDirection(dir);
		sph.setFromVector3(dir);
		compass.style.transform = `rotate(${MathUtils.radToDeg(sph.theta) - 180}deg)`;
		controls.update();
		renderer.render(scene, camera);
	}
	animate();
</script>

<div class="chart">
	<img
		bind:this={compass}
		id="compass"
		src="./compass.svg"
		alt="compass"
		class="absolute filter invert w-24 ml-4"
	/>
	<canvas bind:this={canvas} />
</div>
