"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
const slides=[
  {src:"/images/sources/doctors-file-interview.jpg",alt:"診療について説明する院長 上田大介",position:"center center"},
  {src:"/images/doctor/ueda-daisuke-portrait.jpg",alt:"うえだ歯科医院 院長 上田大介",position:"center 22%"},
  {src:"/images/clinic/exterior.jpg",alt:"うえだ歯科医院の外観",position:"center center"},
] as const;
export function HeroSlideshow(){const[active,setActive]=useState(0);useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const timer=window.setInterval(()=>setActive(current=>(current+1)%slides.length),7000);return()=>window.clearInterval(timer)},[]);return <div className="hero-slideshow" aria-label="院長と医院の写真">{slides.map((slide,index)=><Image key={slide.src} className={index===active?"is-active":""} src={slide.src} alt={slide.alt} fill priority={index===0} sizes="100vw" style={{objectPosition:slide.position}}/>)}<div className="hero-slideshow__dots" aria-hidden="true">{slides.map((slide,index)=><i className={index===active?"is-active":""} key={slide.src}/>)}</div></div>}
