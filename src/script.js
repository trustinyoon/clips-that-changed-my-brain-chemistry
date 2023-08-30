import * as THREE from 'three'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import { gsap } from 'gsap'
import VanillaTilt from 'vanilla-tilt'


/**
 * Base
 */
// Debug
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);



function removeVideosOnMobile() {
    const videos = document.querySelectorAll('video');
    for (let i = 0; i < videos.length; i++) {
        videos[i].remove();
    }
}

if (isMobile) 
{
    removeVideosOnMobile();

    // Create a new div element with the class "mobileLOL"
    const mobileLOLDiv = document.createElement('div');
    mobileLOLDiv.className = 'mobileLOL';
    mobileLOLDiv.innerHTML = 'please use a desktop browser for the intended 3D video experience :)'

    // Get a reference to the body
    const body = document.body;

    // Remove all existing elements from the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Append the "mobileLOL" div to the body
    body.appendChild(mobileLOLDiv);
} else
{
    let prevTextSlide = 0;
    let currentSlide = 0;
    let firstSlideAnimated = false;
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
    let noButtonHover = false;
    
    const slideTitleElement = document.getElementsByClassName("slideTitle")[0];
    const slideDescriptionElement = document.getElementsByClassName("slideDescription")[0];
    const slideDateElement = document.querySelector(".slideDate");
    const slideCreatorElement = document.querySelector(".slideCreator");
    const audioButton = document.querySelector('.audioButton');
    
    let audioButtonOptions = {
        width: audioButton.offsetWidth,
        height: audioButton.offsetHeight,
        midY: audioButton.offsetHeight / 2,
        points: 80,
        stretch: 10,
        sinHeight: 0,
        speed: -0.1,
        strokeColor: 'ivory',
        strokeWidth: 2,
        power: true,
    }
    
    audioButton.width = audioButtonOptions.width * 2;
    audioButton.height = audioButtonOptions.height * 2;
    audioButton.style.width = audioButtonOptions.width;
    audioButton.style.height = audioButtonOptions.height;
    
    const audioButtonCtx = audioButton.getContext('2d');
    audioButtonCtx.scale(2, 2);
    
    audioButtonCtx.strokeStyle = audioButtonOptions.strokeColor;
    audioButtonCtx.lineWidth = audioButtonOptions.strokeWidth;
    audioButtonCtx.lineCap = 'round';
    audioButtonCtx.lineJoin = 'round';
    
    let audioTime = 0;
    
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
    const scrollAndEnterContainer = document.querySelector('.scrollAndEnterContainer');
    
    enterButton.addEventListener('mouseover', () => {
        //gsap animation to make cursorstylewidth bigger
        if (!noButtonHover) {
            gsap.to(customCursor, {
                duration: 0.2,
                scale: 5,
                backgroundColor: 'rgba(255, 255, 240, 1)',
                overwrite: 'auto',
            })
        }
    });
    
    enterButton.addEventListener('mouseout', () => {
        gsap.to(customCursor, {
            duration: 0.2,
            scale: 1,
            backgroundColor: 'ivory',
            overwrite: 'auto',
        })
    });
    
    enterButton.addEventListener('click', () => {
    
        gallery.forEach((slide) => {
            slide.element.play();
            // unmute all videos
            // slide.element.muted = false;
        });
    
        tl
            .to(".overlay", { duration: 3, backdropFilter: "blur(1px)" })
            .to(".scrollAndEnterContainer", { duration: .3, opacity: 0, ease: "sine.inOut", onComplete: () => { noButtonHover = true } }, "-=3")
            .to(".titleText", { duration: .5, fontSize: "1rem", ease: "sine.inOut" }, "-=1.5")
            .to(".miscContainer", { duration: .8, top: "4rem", ease: "sine.inOut" }, "-=1.5")
            .to(".miscContainer", { duration: .8, left: "4rem", ease: "sine.inOut" }, "-=1.5")
            .to(".overlay", {
                duration: 1, backgroundColor: 'rgba(0,0,0,0', ease: "sine.inOut", onComplete: () => {
                    overlayReady = true
                    // enterButton.remove()
                    slideTitleElement.style.display = "block"
                    slideDescriptionElement.style.display = "block"
                    linkHoverReady = true
                }
            }, "-=.85")
            .to(".audioButton", { duration: .8, opacity: 1 }, "-=1")
    });
    
    slideTitleElement.addEventListener('mouseover', () => {
        if (linkHoverReady) {
            gsap.to(customCursor, {
                duration: 0.2,
                scale: 5,
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
    
    audioButton.addEventListener('mouseover', () => {
        gsap.to(customCursor, {
            duration: 0.2,
            scale: 5,
            backgroundColor: 'black',
            overwrite: 'auto',
        })
    });
    
    audioButton.addEventListener('mouseout', () => {
        gsap.to(customCursor, {
            duration: 0.2,
            scale: 1,
            backgroundColor: 'ivory',
            overwrite: 'auto',
        })
    });
    
    audioButton.addEventListener('click', () => {
        audioButtonOptions.power = !audioButtonOptions.power;
    
        if (audioButtonOptions.power) {
            gallery[currentSlide].element.muted = false;
            gsap.to(audioButtonOptions, {
                sinHeight: 4,
                stretch: 5,
                ease: "power2.easeInOut"
            })
        } else {
            gallery[currentSlide].element.muted = true;
            gsap.to(audioButtonOptions, {
                sinHeight: 0,
                stretch: 10,
                ease: "power2.easeInOut"
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
    const geometry = new THREE.BoxGeometry(1, 1)
    
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
    
    // const kobeTexture = createVideoTexture('kobe');
    const kanyeTexture = createVideoTexture('kanye');
    const nujabesTexture = createVideoTexture('nujabes');
    const fkjTexture = createVideoTexture('fkj');
    // const zeroTexture = createVideoTexture('zero');
    const tysonTexture = createVideoTexture('tyson');
    const easyTexture = createVideoTexture('easy');
    const louisTexture = createVideoTexture('louis');
    const dillaTexture = createVideoTexture('dilla');
    const daftpunkTexture = createVideoTexture('daftpunk');
    
    // const kobeImage = new THREE.TextureLoader().load('kobe.png');
    const kanyeImage = new THREE.TextureLoader().load('kanye.png');
    const nujabesImage = new THREE.TextureLoader().load('nujabes.png');
    const fkjImage = new THREE.TextureLoader().load('fkj.png');
    // const zeroImage = new THREE.TextureLoader().load('zero.png');
    const tysonImage = new THREE.TextureLoader().load('tyson.png');
    const easyImage = new THREE.TextureLoader().load('easy.png');
    const louisImage = new THREE.TextureLoader().load('louis.png');
    const dillaImage = new THREE.TextureLoader().load('dilla.png');
    const daftpunkImage = new THREE.TextureLoader().load('daftpunk.png');
    
    const gallery = [
        {
            element: document.getElementById('louis'),
            texture: louisTexture,
            title: "LONG LIVE",
            description: `Kendrick performs Count Me Out and pays tribute to Virgil Abloh at Louis Vuitton Men's Spring-Summer 2023 Show.`,
            date: "06/23/2022",
            source: "https://www.youtube.com/watch?v=6SX50BOmArI&ab_channel=LouisVuitton",
            mobilePic: "louis.png",
            creator: "Louis Vuitton",

        },
        {
            element: document.getElementById('kanye'),
            texture: kanyeTexture,
            title: "Prelaunch",
            description: `"I’m not gonna say there’s no way that I could fail, but with God’s blessings, it shouldn’t be no way for me to lose really." -  Kanye West in 2003 on his upcoming debut album, The College Dropout.`,
            date: "circa2002",
            source: "",
            mobilePic: "kanye.png",
            creator: "Jeen-Yuhs",
        },
        {
            element: document.getElementById('easy'),
            texture: easyTexture,
            title: "Easy",
            description: `Go easy on me, Father. I am still your child. And I need the chance to, 
            Feel your love around me, And today I choose You, the way, the truth. So go easy on me.`,
            date: "11/28/2021",
            source: "https://www.youtube.com/watch?v=V9xlMDxrp0A&ab_channel=robbie",
            mobilePic: "easy.png",
            creator: "Sunday Service Choir",
    
        },
        {
            element: document.getElementById('nujabes'),
            texture: nujabesTexture,
            title: "Nujabes",
            description: `Perfect vibes paying tribute to Nujabes, the father of lofi hip hop.`,
            date: "03/02/2020",
            source: "https://www.youtube.com/watch?v=LcbTSLZl9hs&ab_channel=FutureArtsNow",
            mobilePic: "nujabes.png",
            creator: "Retro Ronin",
    
        },
        {
            element: document.getElementById('fkj'),
            texture: fkjTexture,
            title: "FKJ",
            description: "Jack of all trades, master of all. Essential listening in any focus session.",
            date: "09/02/2020",
            source: "https://www.youtube.com/watch?v=pfU0QORkRpY&list=LL&index=74&ab_channel=Fkj",
            mobilePic: "fkj.png",
            creator: "FKJ",
    
        },
        // {
        //     element: document.getElementById('kobe'),
        //     texture: kobeTexture,
        //     title: "Job finished",
        //     description: "Kobe drops 60 in his final game before retirement, scoring the Lakers' last 17 points to come back and win the game, further cementing GOAT status in my books.",
        //     date: "04/13/2016",
        //     source: "https://www.youtube.com/watch?v=Rx2inwUj_F0&t=280s&ab_channel=NBAHighlights",
        //     mobilePic: "kobe.png",
        //     creator: "NBA",
    
        // },
        {
            element: document.getElementById('tyson'),
            texture: tysonTexture,
            title: "Poet",
            description: `"I trained probably, two weeks or three weeks for this for this fight. I had to bury my best friend, and I dedicate this fight—I wasn't going to fight—I dedicate this fight to him. I was gonna rip his heart out, I'm the best ever. I'm the most brutal and vicious and most ruthless champion there's ever been, there's no one can stop me. Lennox is a conqueror? No, I'm Alexander—he's no Alexander. I'm the best ever. There's never been anybody as ruthless. I'm Sonny Liston, I'm Jack Dempsey, there's no one like—I'm from their cloth. There's no one that can match me. My style is impetuous, my defense is impregnable, and I'm just ferocious. I want your heart, I want to eat his children. Praise be to Allah."`,
            date: "06/24/2000",
            source: "https://www.youtube.com/watch?v=KG-xC8Mu6SM&ab_channel=IsiMan85",
            mobilePic: "tyson.png",
            creator: "IsiMan85",
    
        },
        {
            element: document.getElementById('dilla'),
            texture: dillaTexture,      
            title: "Dilla",
            description: `J Dilla worked on the album while he was hospitalized and in deteriorating health due to a rare blood disease called thrombotic thrombocytopenic purpura (TTP). During his hospital stay, he created the album using a portable record player, a small sampler, and a few records. "Donuts" was released on February 7, 2006, just three days before J Dilla passed away on February 10, 2006, at the age of 32. The album's release coincided with his death, and it became an elegy for the legendary producer.`,
            date: "06/19/2014",
            source: "https://www.youtube.com/watch?v=NHn-G_YpQB0&ab_channel=StonesThrow",
            mobilePic: "dilla.png",
            creator: "Stones Throw",
        },
        // {
        //     element: document.getElementById('daftpunk'),
        //     texture: daftpunkTexture, 
        //     title: "Giorgio",
        //     description: `Giorgio Moroder's describes his start with the synthesizer that birthed electronic music on Daft Punk's "Giorgio by Moroder" from their 2013 album, Random Access Memories. The inclusion comes full circle, as Daft Punk built upon Giorgio's pioneering work to become the greatest electronic music artists of all time.`,
        //     date: "02/24/2014",
        //     source: "https://www.youtube.com/watch?v=zhl-Cs1-sG4&ab_channel=DaftPunkVEVO",
        //     mobilePic: "daftpunk.png",
        //     creator: "Daft Punk",
        // }
    ]
    
    loadVideoData(gallery[0].element);
    
    if (audioButtonOptions.power) {
        gallery[currentSlide].element.muted = false;
        gsap.to(audioButtonOptions, {
            sinHeight: 4,
            stretch: 5,
            ease: "power2.easeInOut"
        })
    }
    
    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: testVertexShader,
        fragmentShader: testFragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
            u_time: { type: 'f', value: 0.0 },
            u_pixels: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
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
    function resizer() {
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
    
        const aspectRatio = sizes.width / sizes.height;
        mesh.scale.x = sizes.width / sizes.height;
    }
    
    window.addEventListener('resize', () => {
        resizer()
    })
    
    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0, 0, .3)
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
    
    const tick = () => {
        // Update audio button
        audioButtonCtx.clearRect(0, 0, audioButtonOptions.width, audioButtonOptions.height);
        audioTime += 1;
        audioButtonCtx.beginPath();
        let increment = 0;
    
        for (let i = 0; i < audioButtonOptions.points; i++) {
            if (i < audioButtonOptions.points / 2) {
                increment += 0.1;
            } else {
                increment -= 0.1;
            }
    
            const x = (audioButtonOptions.width / audioButtonOptions.points) * i;
            const y = audioButtonOptions.midY + Math.sin(audioTime * audioButtonOptions.speed + i / audioButtonOptions.stretch) * audioButtonOptions.sinHeight * increment;
            audioButtonCtx.lineTo(x, y);
        }
    
        audioButtonCtx.stroke();
    
        // SLIDE ANIMATION
    
        time += 0.05;
        position += speed;
        speed *= 0.7;
    
        let i = Math.round(position);
        let dif = i - position;
    
        position += dif * 0.03;
        if (Math.abs(i - position) < 0.001) {
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
    
        audioButtonOptions.power ? gallery[currentSlide].element.muted = false : gallery[currentSlide].element.muted = true;
    
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
            animateTextChange(slideDateElement, gallery[currentTextSlide].date);
            animateTextChange(slideCreatorElement, gallery[currentTextSlide].creator)
            prevTextSlide = currentTextSlide;
        } else if (currentTextSlide === prevTextSlide && overlayReady && !firstSlideAnimated) {
            animateTextChange(slideTitleElement, gallery[currentTextSlide].title);
            animateTextChange(slideDescriptionElement, gallery[currentTextSlide].description);
            animateTextChange(slideDateElement, gallery[currentTextSlide].date);
            animateTextChange(slideCreatorElement, gallery[currentTextSlide].creator)
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
    
    //HTML
    resizer();
}

