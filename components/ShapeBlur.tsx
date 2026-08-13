'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `varying vec2 v_texcoord; void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);v_texcoord=uv;}`;
const fragmentShader = `
varying vec2 v_texcoord; uniform vec2 u_mouse; uniform vec2 u_resolution; uniform float u_pixelRatio; uniform vec3 u_color;
uniform float u_shapeSize; uniform float u_roundness; uniform float u_borderSize; uniform float u_circleSize; uniform float u_circleEdge;
vec2 coord(in vec2 p){p=p/u_resolution.xy;if(u_resolution.x>u_resolution.y){p.x*=u_resolution.x/u_resolution.y;p.x+=(u_resolution.y-u_resolution.x)/u_resolution.y/2.0;}else{p.y*=u_resolution.y/u_resolution.x;p.y+=(u_resolution.x-u_resolution.y)/u_resolution.x/2.0;}p-=0.5;p*=vec2(-1.0,1.0);return p;}
float sdRoundRect(vec2 p,vec2 b,float r){vec2 d=abs(p-0.5)*4.2-b+vec2(r);return min(max(d.x,d.y),0.0)+length(max(d,0.0))-r;}
float sdCircle(in vec2 st,in vec2 center){return length(st-center)*2.0;}
float strokeAA(float x,float size,float w,float edge){float afwidth=length(vec2(dFdx(x),dFdy(x)))*0.70710678;float d=smoothstep(size-edge-afwidth,size+edge+afwidth,x+w*.5)-smoothstep(size-edge-afwidth,size+edge+afwidth,x-w*.5);return clamp(d,0.0,1.0);}
float fill(float x,float size,float edge){return 1.0-smoothstep(size-edge,size+edge,x);}
void main(){vec2 st=coord(gl_FragCoord.xy)+.5;vec2 mx=coord(u_mouse*u_pixelRatio);vec2 posMouse=mx*vec2(1.,-1.)+.5;float circle=fill(sdCircle(st,posMouse),u_circleSize,u_circleEdge);float sdf=sdRoundRect(st,vec2(u_shapeSize),u_roundness);sdf=strokeAA(sdf,0.,u_borderSize,circle)*4.;gl_FragColor=vec4(u_color,sdf);}`;

export default function ShapeBlur({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const scene = new THREE.Scene(); const camera = new THREE.OrthographicCamera(); camera.position.z = 1;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); renderer.setClearColor(0x000000, 0); mount.appendChild(renderer.domElement);
    const mouse = new THREE.Vector2(), damp = new THREE.Vector2(), res = new THREE.Vector2();
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, transparent: true, uniforms: {
      u_mouse: { value: damp }, u_resolution: { value: res }, u_pixelRatio: { value: 1 }, u_color: { value: new THREE.Color('#00B8C4') },
      u_shapeSize: { value: 1.2 }, u_roundness: { value: .42 }, u_borderSize: { value: .035 }, u_circleSize: { value: .28 }, u_circleEdge: { value: .45 },
    }});
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1,1), material); scene.add(quad);
    let w=1,h=1,raf=0,last=performance.now();
    const resize=()=>{w=mount.clientWidth;h=mount.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);camera.left=-w/2;camera.right=w/2;camera.top=h/2;camera.bottom=-h/2;camera.updateProjectionMatrix();quad.scale.set(w,h,1);res.set(w,h).multiplyScalar(dpr);material.uniforms.u_pixelRatio.value=dpr;};
    const onMove=(e:PointerEvent)=>{const r=mount.getBoundingClientRect();mouse.set(e.clientX-r.left,e.clientY-r.top);}; window.addEventListener('pointermove',onMove,{passive:true});
    const ro=new ResizeObserver(resize);ro.observe(mount);resize();
    const tick=(now:number)=>{const dt=Math.min((now-last)/1000,.05);last=now;damp.x=THREE.MathUtils.damp(damp.x,mouse.x,8,dt);damp.y=THREE.MathUtils.damp(damp.y,mouse.y,8,dt);renderer.render(scene,camera);raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener('pointermove',onMove);quad.geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();if(renderer.domElement.parentNode===mount)mount.removeChild(renderer.domElement);};
  },[]);
  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
