import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js'

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl-container");
    // _로 시작하는 필드나 메서드는 이 App클래스 내부에만 쓰이는 private 필드, 메서드라는 의미다.(개발자들간의 약속)
		this._divCotainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
    // 3차원 모델 설정
		this._setupModel();
		this._setupControls();

    // 리사이즈 - renderer나 camera가 창 크기가 변경될 때마다 그 크기에 맞게 속성 값을 재설정 해줘야 하기때문에 필요.
		window.onresize = this.resize.bind(this);
		this.resize();

		requestAnimationFrame(this.render.bind(this));
	}

	_setupControls() {
		new OrbitControls(this._camera, this._divCotainer);
	}

	_setupCamera() {
		const width = this._divCotainer.clientWidth;
		const height = this._divCotainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(
      75, 
      width / height, 
      0.1, 
      100);
		camera.position.z = 2;
		this._camera = camera;
	}

	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setupModel() {
    // 정육면체
		const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 3, 4); // 가로, 세로, 깊이. (지정하지 않으면 기본값은 1)
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		const cube = new THREE.Mesh(geometry, fillMaterial);

		// 정육면체에 선을 추가
		const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
		const line = new THREE.LineSegments(
			// 와이어프레임의 형태로 지오메트리를 표현하기 위해 사용된다.
			new THREE.WireframeGeometry(geometry), lineMaterial);
		
		const group = new THREE.Group()
		// 큐브
		group.add(cube);
		// 선 (위의 큐브를 주석처리하면 정육면체의 선만 나타난다.)
		group.add(line);

		this._scene.add(group);
		this._cube = group;
	}

  // resize메서드 - 브라우저 창 크기가 변경될 때 발생하는 이벤트
	resize() {
		const width = this._divCotainer.clientWidth;
		const height = this._divCotainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001;

		// 자동으로 cube가 회전되도록 하는 코드
		// this._cube.rotation.x = time;
		// this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};