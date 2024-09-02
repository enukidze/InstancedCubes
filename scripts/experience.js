import * as THREE from 'three';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';

// import {
//     OrbitControls,GLTFL
// } from 'three/examples/jsm';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui'



// console.log(THREE)

const noise = `vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}`

export default class Experience {
    constructor() {
        // Defining state attributes
        const attrs = {
            id: "ID" + Math.floor(Math.random() * 1000000),
            width: window.innerWidth - 0,
            height: window.innerHeight - 0,
            marginTop: 0,
            marginBottom: 0,
            marginRight: 0,
            marginLeft: 0,
            canvas: null,
            scene: null,
            scene2: null,
            texture: null,
            texture2: null,
            texture3: null,
            gui: null,
            settings: null,
            geometry: null,
            material: null,
            mesh: null,
            camera: null,
            fboCamera: null,
            Light1: null,
            controls: null,
            renderer: null,
            container: "body",
            defaultFont: "Helvetica",
            vertexShader: null,
            fragmentShader: null,
            data: null,
            time:0,
        };

        // Defining accessors
        this.getState = () => attrs;
        this.setState = (d) => Object.assign(attrs, d);

        // Automatically generate getter and setters for chart object based on the state properties;
        Object.keys(attrs).forEach((key) => {
            //@ts-ignore
            this[key] = function (_) {
                if (!arguments.length) {
                    return attrs[key];
                }
                attrs[key] = _;
                return this;
            };
        });

        // Custom enter exit update pattern initialization (prototype method)
        this.initializeEnterExitUpdatePattern();
    }


    render() {
        this.setDynamicContainer();
        this.drawCanvasAndWrapper();
         this.setupScene()
        this.setupScene2()
        this.setupGui()
        this.setupTextures();
        this.setupGeometryMaterialMesh();
        this.setupCamera()
        this.setupControls()
        this.setupLights()
        this.setupRenderer();
        this.tick();

        return this;
    }

    setupScene() {
        const scene = new THREE.Scene()
      
        this.setState({ scene })
     
    }

    setupGui() {
        const {fboMaterial} = this.getState()
        const settings = {
            progress: 0
        }

        console.log(fboMaterial);

        const gui = new GUI();
        gui.add(settings, "progress", 0, 1, 0.01).onChange((val) => {
            fboMaterial.uniforms.uProgress.value = val
        });

        this.setState({gui})
        this.setState({settings})

    }



    setupTextures() {

        const loader = new THREE.TextureLoader()
        const ao = loader.load('./texture-ambient-occlusion.png')
        const fbo = loader.load('./ppic.png')
        const state2 = loader.load('./image.png')
    
        ao.flipY = false
        this.setState({ao})
        this.setState({fbo})
        this.setState({state2})


      
    }  
     setupScene2() {
        const {width,height,vertexShader,fragmentShader, fbo , state2} = this.getState()
        const fboo = new THREE.WebGLRenderTarget(width,height)
        const fboCamera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1)
        const scene2 = new THREE.Scene()
        const fboMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: {value:0},
                uState1: {value: new THREE.TextureLoader().load('./ppic.png')},
                uState2: {value: new THREE.TextureLoader().load('./image.png')},
                uFBO: {value: null}
            },
            vertexShader:vertexShader,
            fragmentShader:fragmentShader
        })

       
        const fboGeo = new THREE.PlaneGeometry(2,2)
        const fboQuad = new THREE.Mesh(fboGeo,fboMaterial)
      
        scene2.add(fboQuad)
        scene2.add(fboCamera)

        console.log(scene2)

        this.setState({scene2})
        this.setState({fboCamera})
        this.setState({fboo})
        this.setState({fboMaterial})

    }
    setupGeometryMaterialMesh() {
        const { scene, ao, fbo} = this.getState();

   
        // const material = new THREE.ShaderMaterial({
        //     // extensions: {
        //     //     derivatives: "#extension GL_OES_standard_derivatives : enable"
        //     // },
        //     side: THREE.DoubleSide,
        //     uniforms: {
        //         uTime: { value: 0 },
        //         uResolution: { value: new THREE.Vector4() }
        //     },
        //     vertexShader,
        //     fragmentShader
        // })
   
             

        const material = new THREE.MeshPhysicalMaterial({
            roughness: 0.65,
            map: ao,
            aoMap: ao,
            aoMapIntensity: 0.75 
           
        })

        const uniforms = {
            time: {value: 0},
            uFbo: {value: null}, //fbo
            aoMap: {value: ao},
            light_color: {value: new THREE.Color('#ffe9e9')},
            ramp_color_one: { value: new THREE.Color('#280A0A') },  // Very dark burgundy
            ramp_color_two: { value: new THREE.Color('#520F0F') },  // Dark maroon
            ramp_color_three: { value: new THREE.Color('#781414') },  // Deep crimson
            ramp_color_four: { value: new THREE.Color('#991B1B') }   // Dark cherry red
            
            
            // ramp_color_one: {value: new THREE.Color('#06082D')},
            // ramp_color_two: {value: new THREE.Color('#020284')},
            // ramp_color_three: {value: new THREE.Color('#0000ff')},
            // ramp_color_four: {value: new THREE.Color('#71c7f5')}
        }

        this.setState({uniforms})

            material.onBeforeCompile = (shader) => {
            
            shader.uniforms = Object.assign(shader.uniforms,uniforms)
   
            shader.vertexShader = shader.vertexShader.replace(
               '#include <common>',
                `
                #include <common>
                uniform sampler2D uFbo;
                uniform float time;
              
                attribute vec2 instanceUV;
                varying float vHeight;
                varying float vHeightUV;
                ${noise}

                
                `
            )

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                
                `
              
                #include <begin_vertex>

                float n = cnoise(vec3(instanceUV.x * 6.,instanceUV.y*6.,time*0.1));
                 
                transformed.y += n*80.;
                float posy = position.y *2.0;
                vHeightUV = clamp(posy ,0.,1.0);
                vec4 transition = texture2D(uFbo, instanceUV);
                transformed *= (transition.g);
                transformed.y += transition.r*100.;
                vHeight = transformed.y;

                ` )

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform vec3 light_color;
                uniform vec3 ramp_color_one;    
                uniform vec3 ramp_color_two;
                uniform vec3 ramp_color_three;
                uniform vec3 ramp_color_four;
                varying float vHeight;
                varying float vHeightUV;

                `
            )

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <color_fragment>',
                `#include <color_fragment>
                
                vec3 highlight = mix(ramp_color_three,ramp_color_four,vHeightUV);
                diffuseColor.rgb = ramp_color_two;
                diffuseColor.rgb = mix(diffuseColor.rgb, ramp_color_three, vHeightUV);
                diffuseColor.rgb = mix(diffuseColor.rgb, highlight, clamp(vHeight/10.0 - 3.,0.0,1.0));

                `
            )
            

        }


        new GLTFLoader().load('./data/bar.glb', gltf => {
          
            const model = gltf.scene.children[0];
    
            this.material = material;



            this.geometry = model.geometry
            this.geometry.scale(40,40,40)

            const iSize = 50;
            const instances = iSize**2;
            const instanceMesh = new THREE.InstancedMesh(this.geometry,this.material,instances)
            let dummy = new THREE.Object3D()
            let width = 60;
            let instanceUV = new Float32Array(instances *2)
            for(let i = 0 ; i < iSize ; i++) {
                for(let j = 0 ; j < iSize ; j++) {
                 
                    instanceUV.set([i / iSize, j / iSize], (i * iSize + j) * 2)
                    dummy.position.set(
                       width * ( i - iSize / 2),
                        0,
                       width * (j - iSize / 2)
                    )
                    dummy.updateMatrix()
                    instanceMesh.setMatrixAt(i * iSize + j,dummy.matrix)
                }
            }

            this.geometry.setAttribute('instanceUV', new THREE.InstancedBufferAttribute(instanceUV,2))
  
            scene.add(instanceMesh);
        })


        // this.setState({  material })
    }
    setupControls() {
        const { scene, width, height, canvas, camera } = this.getState();
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        this.setState({ controls });
    }
    setupCamera() {
        const { scene, width, height } = this.getState();
        const frustumSize = height;
         const aspect = window.innerWidth / window.innerHeight;
         const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -2000, 2000 );
        camera.position.set(2,2,2)
        scene.add(camera)

        this.setState({ camera })


    }
    setupLights() {

        const {scene } = this.getState()
        const Light1 = new THREE.AmbientLight(0xffffff, 2)

        const spotLight = new THREE.SpotLight(0xffe9e9, 10)
         spotLight.position.set(-80*3,200*3,-80*3)
        const target = new THREE.Object3D()
        target.position.set(0, -80, 200)
        spotLight.target =  target
        spotLight.decay = 0.7
        spotLight.angle = 1
        spotLight.penumbra= 1.5
        spotLight.distance = 3000
        scene.add(Light1)
        scene.add(spotLight)
        this.setState({Light1,spotLight})
    }
    setupRenderer() {
        const { width, height, canvas, fbo, fboCamera, scene2 } = this.getState();
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            logarithmicDepthBuffer: true,
            antialias: true
            
        })
        renderer.setClearColor('black');
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
     
        this.setState({ renderer })
    }



    tick() {
        const state = this.getState()
        const { scene, time, renderer, camera, controls , width, height, fboCamera, scene2, fboo, uniforms, fbo} = state;
        controls.update()
        state.time+=0.05;

        
     
        
        renderer.setRenderTarget(fboo)
        renderer.render(scene2,fboCamera)
        window.requestAnimationFrame(this.tick.bind(this))     
        
        renderer.setRenderTarget(null)
        uniforms.uFbo.value = fboo.texture //an fbo
        uniforms.time.value =  time
        
        console.log(uniforms.time.value);
        renderer.render(scene, camera)
    }


    drawCanvasAndWrapper() {
        const {
            canvasContainer,
            width,
            height,
            defaultFont,
        } = this.getState();

        // Draw Canvas
        const canvas = canvasContainer
            ._add({
                tag: "canvas",
                className: "webgl"
            })
            .attr("width", width)
            .attr("height", height)
            .attr("font-family", defaultFont)
            .node()

        this.setState({ canvas });
    }

    initializeEnterExitUpdatePattern() {
        d3.selection.prototype._add = function (params) {
            var container = this;
            var className = params.className;
            var elementTag = params.tag;
            var data = params.data || [className];
            var exitTransition = params.exitTransition || null;
            var enterTransition = params.enterTransition || null;
            // Pattern in action
            var selection = container.selectAll("." + className).data(data, (d, i) => {
                if (typeof d === "object") {
                    if (d.id) {
                        return d.id;
                    }
                }
                return i;
            });
            if (exitTransition) {
                exitTransition(selection);
            } else {
                selection.exit().remove();
            }

            const enterSelection = selection.enter().append(elementTag);
            if (enterTransition) {
                enterTransition(enterSelection);
            }
            selection = enterSelection.merge(selection);
            selection.attr("class", className);
            return selection;
        };
    }

    setDynamicContainer() {
        const attrs = this.getState();

        //Drawing containers
        var canvasContainer = d3.select(attrs.container);
        var containerRect = canvasContainer.node().getBoundingClientRect();
        if (containerRect.width > 0) attrs.width = containerRect.width;

        d3.select(window).on("resize." + attrs.id, function () {
            var containerRect = canvasContainer.node().getBoundingClientRect();
            if (containerRect.width > 0) attrs.width = containerRect.width;

            const { width, height, renderer, camera } = attrs;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        this.setState({ canvasContainer });
    }
}