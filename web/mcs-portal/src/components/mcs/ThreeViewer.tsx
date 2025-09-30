'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Spin } from 'antd';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false
});
const OrbitControls = dynamic(() => import('@react-three/drei').then((mod) => mod.OrbitControls), {
  ssr: false
});

interface ThreeViewerProps {
  modelUrl?: string;
}

export default function ThreeViewer({ modelUrl }: ThreeViewerProps) {
  return (
    <div style={{ height: 320 }}>
      <Suspense fallback={<Spin style={{ marginTop: 120 }} />}>
        <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 5, 3]} intensity={0.7} />
          <SampleModel />
          <gridHelper args={[10, 10]} />
          <OrbitControls />
        </Canvas>
      </Suspense>
      {modelUrl ? (
        <small style={{ display: 'block', marginTop: 8 }}>모델 경로: {modelUrl}</small>
      ) : (
        <small style={{ display: 'block', marginTop: 8 }}>샘플 모델(박스)을 표시 중입니다.</small>
      )}
    </div>
  );
}

function SampleModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0078A6" />
    </mesh>
  );
}
