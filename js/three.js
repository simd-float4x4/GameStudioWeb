// ページの読み込みを待つ
window.addEventListener('DOMContentLoaded', init);

function init() {
  // サイズを指定
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +100);

  let pointCloud,linesMesh;
  let particleVelocity = [];
  
// BufferGeometryのConfig =================================================================================================
  // 頂点描画数
  const particleCount = 550;
  // 描画領域の半径
  const r = 75;
  // 線を消去する距離
  const connectionDistance = 14;
  //最大速度の設定
  const maxVelocity = 0.2;
  // 点のデザイン
	const particleMaterial = new THREE.PointsMaterial({
		color:0xFFFFFF,
		size:0.25,
		blending:THREE.AdditiveBlending,
		transparent:true
	});
// =========================================================================================================================

  //　初期位置を型付配列で宣言
	const particlePositions = new Float32Array(particleCount * 3);

	for(let i = 0; i < particleCount; i++){

    // Positionの初期位置を決定
		particlePositions[i*3] = Math.random() * r * 2.0 - r;
		particlePositions[i*3+1] = Math.random() * r - r / 2.0;
		particlePositions[i*3+2] = Math.random() * r - r / 2.0;

    // Velocityの初期値を決定
		particleVelocity[i] = new THREE.Vector3();
		particleVelocity[i].x = -1.0 + Math.random() * 2.0;
		particleVelocity[i].y = -1.0 + Math.random() * 2.0;
		particleVelocity[i].z = -1.0 + Math.random() * 2.0;

    // 背面ベクトルを、maxVelocity/√3分だけ引き伸ばす。
		particleVelocity[i].multiplyScalar(maxVelocity / Math.sqrt(3.0));
	}

  // BufferGeometryの点描画を行う。
	const particles = new THREE.BufferGeometry();
	particles.setAttribute('position',new THREE.BufferAttribute(particlePositions,3).setUsage(THREE.DynamicDrawUsage));
	pointCloud = new THREE.Points(particles,particleMaterial);
	scene.add(pointCloud);

  // 
	const segments = particleCount * particleCount;
	let positions = new Float32Array(segments * 3);
	let colors = new Float32Array(segments * 3);

  // lineGeometryを実装する
	const lineGeometry = new THREE.BufferGeometry();
	lineGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));
	lineGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage));
	const lineMaterial = new THREE.LineBasicMaterial({
		vertexColors:true,
		blending:THREE.AdditiveBlending,
		transparent:true
	});
	linesMesh = new THREE.LineSegments(lineGeometry,lineMaterial);
	scene.add(linesMesh);
   
  tick();

  // 毎フレーム時に実行されるループイベントです
  function tick() {
    requestAnimationFrame(tick);
  
    let numConnected = 0;
    let vertexpos = 0;
    let colorpos = 0;
    const rHarf = r / 2.0;
  
    let particlePositions = pointCloud.geometry.attributes.position.array;
  
    for(let i = 0; i < particleCount; i++){
      // 位置の更新：現在位置に重力分を足す
      particlePositions[i*3] += particleVelocity[i].x;
      particlePositions[i*3+1] += particleVelocity[i].y;
      particlePositions[i*3+2] += particleVelocity[i].z;
  
      // 折り返し判定（PONGの要領でゴリ押す）
      // TODO: rHarf = r / PIにすることで円周上の判定は作れるが、跳ね返し方がわからない
      if(particlePositions[i*3] < -rHarf*2.0 || particlePositions[i*3] > rHarf*2.0){
        particleVelocity[i].x *= -1;
      }
  
      if(particlePositions[i*3+1] < -rHarf || particlePositions[i*3+1] > rHarf){
        particleVelocity[i].y *= -1;
      }
  
      if(particlePositions[i*3+2] < -rHarf || particlePositions[i*3+2] > rHarf){
        particleVelocity[i].z *= -1;
      }
  
      // 全配列検索：全部の頂点の値の距離(移動量)を調べる
      for(let j = i + 1; j < particleCount; j++){
        let dx = particlePositions[i*3]-particlePositions[j*3];
        let dy = particlePositions[i*3+1]-particlePositions[j*3+1];
        let dz = particlePositions[i*3+2]-particlePositions[j*3+2];
        let dist = Math.sqrt(dx*dx+dy*dy+dz*dz);
  
        // 距離がConnectionDistance以下であれば
        if(dist < connectionDistance){
          // 離れた分だけ色味を減らす
          let gray = 1.0 - dist/connectionDistance;
          let linePositions = linesMesh.geometry.attributes.position.array;
          let lineColors = linesMesh.geometry.attributes.color.array;
  
          linePositions[vertexpos++] = particlePositions[i*3];
          linePositions[vertexpos++] = particlePositions[i*3+1];
          linePositions[vertexpos++] = particlePositions[i*3+2];
  
          linePositions[vertexpos++] = particlePositions[j*3];
          linePositions[vertexpos++] = particlePositions[j*3+1];
          linePositions[vertexpos++] = particlePositions[j*3+2];
  
          lineColors[colorpos++] = gray;
          lineColors[colorpos++] = gray;
          lineColors[colorpos++] = gray;
          lineColors[colorpos++] = gray;
          lineColors[colorpos++] = gray;
          lineColors[colorpos++] = gray;
  
          numConnected++;
        }
      }

      // linesMeshの更新を許可してあげる
      linesMesh.geometry.setDrawRange(0,numConnected*2);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
      pointCloud.geometry.attributes.position.needsUpdate = true;
    }
  
    renderer.render(scene,camera);
  }
}