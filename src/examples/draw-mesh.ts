import { Vector4 } from "../core/math/vector4"
import { Color } from "../core/shading/color"
import Texture from "../core/shading/texture"
import { Vertex } from "../core/shading/vertex"
import Raster from "../core/raster"
import { IExample } from "../main"
import Shader, { VertexInput, FragmentInput, ShaderVarying } from "../core/shading/shader"
import { Vector2 } from "../core/math/vector2"


import { Matrix } from "../core/math/matrix"


import MathUtils from "../core/math/math-utils"
import Model from "../core/shading/model"


import objBuffer from 'raw-loader!../../res/african_head.obj'
import diffuseBuffer from '../../res/african_head_diffuse.png'
import normalBuffer from '../../res/african_head_nm.png'
import specBuffer from '../../res/african_head_spec.png'

// import objBuffer from 'raw-loader!../../res/diablo3_pose.obj'
// import diffuseBuffer from '../../res/diablo3_pose_diffuse.png'
// import normalBuffer from '../../res/diablo3_pose_nm.png'
// import specBuffer from '../../res/diablo3_pose_spec.png'

export default class DrawMesh implements IExample{
    protected renderer:Raster

    protected model:Model
    protected diffuseTexture:Texture
    protected normalTexture:Texture
    protected specTexture:Texture

    public constructor(renderer:Raster) {
        this.renderer = renderer
        this.init()
    }

    
    protected init() {
        let eye = new Vector4(1, 1, 3, 1)
        let at = new Vector4(0, 0, 0, 1)
        let up = new Vector4(0, 1, 0, 1)
        let fovy = Math.PI / 4
        let aspect = this.renderer.width / this.renderer.height
        let near = 1
        let far = 500
        this.renderer.setCamera(eye, at, up, fovy, aspect, near, far)
        this.renderer.setBackgroundColor(Color.GRAY)
        this.loadObj()
        this.loadTextures()

        //shader
        let lightDir:Vector4 = (new Vector4(1, 1, 1)).normalize()
        let diffuseTexture = this.diffuseTexture
        let normalTexture = this.normalTexture
        let specTexture = this.specTexture

        let modelMatrix = new Matrix()
        let fragColor:Color = new Color()
        let shader:Shader = new Shader(
            {
                vertexShading: function(vertex:Vertex, input:VertexInput):Vector4{
                    let posWorld = vertex.posModel.transform(modelMatrix)
                    vertex.context.posProject = posWorld.transform(input.viewProject)
                    vertex.context.varyingVec2Dict[ShaderVarying.UV] = vertex.uv
                    vertex.context.varyingVec4Dict[ShaderVarying.WORLD_POS] = posWorld
                    // vertex.context.varyingVec4Dict[ShaderVarying.NORMAL] = vertex.normal
                    return vertex.context.posProject
                },
                fragmentShading: function(input:FragmentInput):Color {
                    //blinn-phong
                    let uv = input.varyingVec2Dict[ShaderVarying.UV]
                    let diffuseColor = diffuseTexture.sample(uv)
                    let normal = normalTexture.sampleAsVector(uv)
                    let specFactor = specTexture.sample(uv).b
                   
                    let n:Vector4 = normal.normalize()
                    let worldPos:Vector4 = input.varyingVec4Dict[ShaderVarying.WORLD_POS] 
                    
                    //diffuse
                    let diffuseIntense = MathUtils.saturate(n.dot(lightDir))
                  
                    //高光
                    let viewDir:Vector4 = eye.sub(worldPos).normalize()
                    let halfDir:Vector4 = lightDir.add(viewDir).normalize()
                    let specIntense = Math.pow( Math.max(0, n.dot(halfDir)), 5*specFactor) //*0.8

                    let factor = diffuseIntense + specIntense
                    let ambient = 5
                    fragColor.set(diffuseColor).multiplyRGB(factor).add(ambient)
                    fragColor.a = 255
                    return fragColor
                }
            }
        )
        this.renderer.setShader(shader)
    }

    protected loadTextures() {
        this.diffuseTexture = Texture.createTextureFromBmpBuffer(diffuseBuffer)
        this.normalTexture = Texture.createTextureFromBmpBuffer(normalBuffer)
        this.specTexture = Texture.createTextureFromBmpBuffer(specBuffer)
    }

    protected loadObj() {
        this.model = new Model()
        this.model.createFromObjBuffer(objBuffer)
        
    }
    public draw() :void{
        let triangles = this.model.triangles
        for (let triangle of triangles) {
            this.renderer.drawTriangle(triangle)
        }
    }

}