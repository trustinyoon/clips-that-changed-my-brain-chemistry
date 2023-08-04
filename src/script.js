import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { gsap } from 'gsap'
import VanillaTilt from 'vanilla-tilt'


/**
 * Base
 */
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// HTML Elements
let linkHoverReady = false;

const slideTitleElement = document.getElementsByClassName("slideTitle")[0];
const slideDescriptionElement = document.getElementsByClassName("slideDescription")[0];
const slideContainer = document.querySelector('.slideContainer');
const miscContainer = document.querySelector('.miscContainer');


// Create GSAP Timeline
const tl = gsap.timeline();

// MOUSE
const mouse = new THREE.Vector2();
const cameraRotation = new THREE.Vector2();

const customCursor = document.createElement('div');
customCursor.className = 'custom-cursor';
document.body.appendChild(customCursor);

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Adjust sensitivity and limit the tilt angles as needed
    const targetRotationX = THREE.MathUtils.clamp(mouse.y * 0.5, -Math.PI / 4, Math.PI / 4);
    const targetRotationY = mouse.x * 0.5;

    // Update the position of the custom cursor
    gsap.to(customCursor, {
        duration: 0.2,
        left: event.clientX,
        top: event.clientY,
        overwrite: 'auto',
    });

    // Use gsap.to for smoother animation with easing
    gsap.to(cameraRotation, {
        duration: 1,
        x: targetRotationX,
        y: targetRotationY,
        ease: 'power2.out'
    });
});

const enterButton = document.querySelector('.enterButton');

enterButton.addEventListener('mouseover', () => {
    //gsap animation to make cursorstylewidth bigger
    gsap.to(customCursor, {
        duration: 0.2,
        scale: 3,
        overwrite: 'auto',
        })
});

enterButton.addEventListener('mouseout', () => {
    gsap.to(customCursor, {
        duration: 0.2,
        scale: 1,
        overwrite: 'auto',
        })
});

enterButton.addEventListener('click', () => {
    gallery.forEach((slide) => {
        slide.element.play();
        // unmute all videos
        slide.element.muted = false;
    });
    
    tl
        .to(".overlay", {duration: 3, backdropFilter: "blur(0px)"})
        .to(".enterButton", {duration: .3, opacity: 0, ease: "sine.inOut", onComplete: () => {  } }, "-=3")
        .to(".titleText", {duration: .5, fontSize: "1rem", ease: "sine.inOut"}, "-=1.5")
        .to(".miscContainer", {duration: .8, top: "1rem", ease: "sine.inOut"}, "-=.85")
        .to(".miscContainer", {duration: .8, left: "1rem", ease: "sine.inOut"}, "-=.85")
        .to(".overlay", { duration: 1, backgroundColor: 'rgba(0,0,0,0', ease: "sine.inOut", onComplete: () => 
            { 
                overlayReady = true
                enterButton.remove()
                slideTitleElement.style.display = "block"
                slideDescriptionElement.style.display = "block"
                linkHoverReady = true
            } }, "-=.85")
});

slideTitleElement.addEventListener('mouseover', () => {
    if (linkHoverReady) {
        gsap.to(customCursor, {
            duration: 0.2,
            scale: 3,
            overwrite: 'auto',
            })
    }
});

slideTitleElement.addEventListener('mouseout', () => {
    if (linkHoverReady) {
        gsap.to(customCursor, {
            duration: 0.2,
            scale: 1,
            overwrite: 'auto',
            })
    }
});

VanillaTilt.init(document.querySelector(".tilt"), {
    max: 3,
    speed: 100
});

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.BoxGeometry(1,1)

/**
 * Textures
 */
let videoReady = false;
let overlayReady = false;

async function loadVideoData(videoElement) {
    // Load video data asynchronously (e.g., fetching video sources, setting video properties)

    // Return a Promise once video data is loaded and metadata is ready
    return new Promise((resolve) => {
        videoElement.addEventListener('loadedmetadata', () => {
            videoReady = true;
            resolve(videoElement);
        });
    });
}

function createVideoTexture(videoElementID) {
    const videoElement = document.getElementById(videoElementID);
    // videoElement.play();

    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    return videoTexture;
}

const kobeTexture = createVideoTexture('kobe');
const kanyeTexture = createVideoTexture('kanye');
const kendrickTexture = createVideoTexture('kendrick');
const zeroTexture = createVideoTexture('zero');
const tysonTexture = createVideoTexture('tyson');



const gallery = [
    {
        element: document.getElementById('kanye'),
        texture: kanyeTexture,
        title: "Prelaunch",
        description: `"I’m not gonna say there’s no way that I could fail, but with God’s blessings, it shouldn’t be no way for me to lose really." -  Kanye West in 2003 on his upcoming debut album, The College Dropout`
    },
    {
        element: document.getElementById('kendrick'),
        texture: kendrickTexture,
        title: "Alright",
        description: "We gon be alright"
    },
    {
        element: document.getElementById('kobe'),
        texture: kobeTexture,
        title: "Job finished",
        description: "Kobe drops 60 in his final game before retirement, scoring the Lakers' last 17 points to come back and win the game in 2016."
    },
    {
        element: document.getElementById('zero'),
        texture: zeroTexture,
        title: "Elysian",
        description: "Caught the ebike bug right after moving to SF in Feb 2022."
    },
    {
        element: document.getElementById('tyson'),
        texture: tysonTexture,
        title: "Poet",
        description: `"I trained probably, two weeks or three weeks for this for this fight. I had to bury my best friend, and I dedicate this fight—I wasn't going to fight—I dedicate this fight to him. I was gonna rip his heart out, I'm the best ever. I'm the most brutal and vicious and most ruthless champion there's ever been, there's no one can stop me. Lennox is a conqueror? No, I'm Alexander—he's no Alexander. I'm the best ever. There's never been anybody as ruthless. I'm Sonny Liston, I'm Jack Dempsey, there's no one like—I'm from their cloth. There's no one that can match me. My style is﻿ impetuous, my defense is impregnable, and I'm just ferocious. I want your heart, I want to eat his children. Praise be to Allah." - Mike Tyson post fight Lewis vs Tyson 2002.`
    }
]

loadVideoData(gallery[0].element);

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        u_time: { type: 'f', value: 0.0 },
        u_pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        u_uvRate1: { value: new THREE.Vector2(1, 1) },
        u_accel: { type: "v2", value: [.5, 2.0] },
        u_progress: { type: 'f', value: 0.0 },
        u_texture1: { value: gallery[0].texture },
        u_texture2: { value: gallery[1].texture },
    }
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

/**
 * Sizes
 */
function resizer () {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    material.uniforms.u_uvRate1.value.y = sizes.height / sizes.width;

    let dist = camera.position.z - mesh.position.z;
    let height = 1;
    camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    const aspectRatio = sizes.width / sizes.height;
    mesh.scale.x = sizes.width / sizes.height;
}

window.addEventListener('resize', () =>
{
    resizer()
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, .5)
camera.rotation.set(0, 0, 0)

scene.add(camera)

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
ambientLight.position.set(0, 3, 0);
scene.add(ambientLight);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let time = 0;
let speed = 0;
let position = 0;
document.addEventListener('wheel', (e) => {
    speed += e.deltaY * 0.0003;
})

let prevTextSlide = 0;
let firstSlideAnimated = false;

const tick = () =>
{
    time += 0.05;
    position += speed;
    speed *= 0.7;

    let i = Math.round(position);
    let dif = i - position;

    position += dif * 0.03;
    if(Math.abs(i - position) < 0.001) {
        position = i;
    }

    // Update material
    material.uniforms.u_time.value = time;
    material.uniforms.u_progress.value = position;
    // Update controls
    // controls.update()

    let currentSlide = Math.abs(Math.floor(position) % gallery.length);
    let nextSlide = Math.abs((Math.floor(position) + 1) % gallery.length);

    let currentTextSlide = Math.abs(Math.round(position) % gallery.length);

    
    gallery[currentSlide].element.muted = false
    
    // Mute all other videos
    for (let i = 0; i < gallery.length; i++) {
        if (i !== currentTextSlide) {
            gallery[i].element.muted = true;
        }
    }

    // if (currentSlide !== lastFrameCurrentSlide) {
    //     console.log('slide changed from last frame')
    //     const slideTitleElement = document.getElementsByClassName("slideTitle")[0];
    //     slideTitleElement.innerHTML = gallery[currentSlide].title;
    //     lastFrameCurrentSlide = currentSlide;
    // }

    // Import GSAP if you're using ES6 modules
    // import { gsap } from 'gsap';

    // Assuming you have already initialized the gallery and other necessary variables
    // ...

    // Add this code inside your Three.js tick function

    if (currentTextSlide !== prevTextSlide) {
        animateTextChange(slideTitleElement, gallery[currentTextSlide].title);
        animateTextChange(slideDescriptionElement, gallery[currentTextSlide].description);
        prevTextSlide = currentTextSlide;
    } else if (currentTextSlide === prevTextSlide && overlayReady && !firstSlideAnimated) {
        animateTextChange(slideTitleElement, gallery[currentTextSlide].title);
        animateTextChange(slideDescriptionElement, gallery[currentTextSlide].description);
        firstSlideAnimated = true;
    }

    // Helper function to animate text change
    function animateTextChange(element, newText) {
        gsap.to(element, {
            duration: 0.3, // Change the duration as needed
            opacity: 0,   // Animate opacity to 0 to fade out the text
            onComplete: () => {
                // When the animation is complete, update the text
                element.innerText = newText;
                // Animate opacity back to 1 to fade in the new text
                gsap.to(element, {
                    duration: 0.3, // Change the duration as needed
                    opacity: 1,    // Animate opacity to 1 to fade in the new text
                });
            },
        });
    }
    

    material.uniforms.u_texture1.value = gallery[currentSlide].texture;
    material.uniforms.u_texture2.value = gallery[nextSlide].texture;

    // Apply tilt to the camera
    camera.rotation.x = cameraRotation.x * .1;
    camera.rotation.y = cameraRotation.y * .1;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// HTML
resizer();
