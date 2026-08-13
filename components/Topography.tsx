'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const vertex = `#version 300 es\nin vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `#version 300 es
precision highp float;uniform vec2 iResolution;uniform float iTime;out vec4 fragColor;
float bez(float t,vec4 c){float w=6.2831853*t;return .5*(c.x*sin(w)+c.y*cos(w)+c.z*sin(2.*w)+c.w*cos(2.*w));}
float field(vec2 uv){vec4 a=vec4(sin(iTime*.08+1.),cos(iTime*.09+2.),sin(iTime*.07+3.),cos(iTime*.06+4.));vec4 b=vec4(sin(iTime*.05+9.),cos(iTime*.04+8.),sin(iTime*.07+7.),cos(iTime*.03+6.));vec2 p=vec2(bez(uv.x,a)*2.8,bez(uv.y,b)*2.8);return length(p);}
void main(){vec2 uv=gl_FragCoord.xy/iResolution;float fv=field(uv);float f=fv*11.;float frac=fract(f);float ld=min(frac,1.-frac);float aa=fwidth(f)+.001;float mask=1.-smoothstep(.035-aa,.035+aa,ld);float glow=1.-smoothstep(.035,.16,ld);float e=clamp(fv/3.,0.,1.);vec3 teal=vec3(0.,.72,.77);vec3 copper=vec3(.79,.48,.20);vec3 col=mix(teal,copper,smoothstep(.25,.9,e));float a=clamp(mask+glow*.2,0.,1.)*.72;fragColor=vec4(col*a,a);}`;

export default function Topography(){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const el=ref.current;if(!el)return;const renderer=new Renderer({webgl:2,alpha:true,dpr:Math.min(devicePixelRatio||1,2)});const gl=renderer.gl;gl.clearColor(0,0,0,0);el.appendChild(gl.canvas);const geometry=new Triangle(gl);const program=new Program(gl,{vertex,fragment,uniforms:{iResolution:{value:new Float32Array([1,1])},iTime:{value:0}}});const mesh=new Mesh(gl,{geometry,program});let raf=0;const start=performance.now();const resize=()=>{const r=el.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height));program.uniforms.iResolution.value[0]=gl.drawingBufferWidth;program.uniforms.iResolution.value[1]=gl.drawingBufferHeight;};const ro=new ResizeObserver(resize);ro.observe(el);resize();const tick=(t:number)=>{program.uniforms.iTime.value=(t-start)/1000;renderer.render({scene:mesh});raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(raf);ro.disconnect();if(gl.canvas.parentNode===el)el.removeChild(gl.canvas);gl.getExtension('WEBGL_lose_context')?.loseContext();};},[]);return <div ref={ref} className="topography" aria-hidden="true"/>;}
