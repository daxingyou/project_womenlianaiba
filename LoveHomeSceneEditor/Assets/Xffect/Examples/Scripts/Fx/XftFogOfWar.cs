using UnityEngine;
using System.Collections;

public class XftFogOfWar : MonoBehaviour
{
    public Shader shader;
    protected Material m_Material;

    public Transform Client;   //the client to "draw" the visible area.
    public Color FogColor = Color.black;
    public int Quality = 256;  //actually is the FogOfWarMap's texture width, don't let it greater than 1000, or may hit the performance.
    public float SpreadEdge = 1f; // relative to Quality
    public float FieldOfView = 8f; // relative to Quality
    public BoxCollider AreaBox; //the box collider to specify the area of fog.

    protected Texture2D FogOfWarMap; //visible area map.
    protected Vector2 AreaOffset;
    protected int Radius;//field of view
    protected int MapWidth;
    protected int MapHeight;

    protected int LastX = -1; //if client not moved, don't update the FogOfWarMap
    protected int LastZ = -1;

    //fast world space reconstruction, copied from build-in ImageEffects: GlobalFog.js
    protected float CAMERA_NEAR = 0.5f;
    protected float CAMERA_FAR = 50.0f;
    protected float CAMERA_FOV = 60.0f;
    protected float CAMERA_ASPECT_RATIO = 1.333333f;

    #region ImageEffectBase
    void Start()
    {
        if (!SystemInfo.supportsImageEffects)
        {
            enabled = false;
            return;
        }

        if (!shader || !shader.isSupported)
            enabled = false;
        CheckSupport();
    }

    protected Material material
    {
        get
        {
            if (m_Material == null)
            {
                m_Material = new Material(shader);
                m_Material.hideFlags = HideFlags.HideAndDontSave;
            }
            return m_Material;
        }
    }

    void OnDisable()
    {
        if (m_Material)
        {
            DestroyImmediate(m_Material);
        }
    }

    #endregion


    void CheckSupport()
    {
        if (QualitySettings.antiAliasing != 0 && camera.renderingPath != RenderingPath.DeferredLighting)
        {
            Debug.LogWarning("Fog Of War Currently is not supported with AA, please disable it or use defered lighting path!");
                enabled = false;
        }
    }

    void OnEnable()
    {
        //Note: In forward lightning path, the depth texture is not automatically generated.
        if (Camera.main.depthTextureMode == DepthTextureMode.None)
            Camera.main.depthTextureMode = DepthTextureMode.Depth;
    }

    void CreateFOWTexture()
    {
        if (AreaBox == null)
        {
            Debug.LogError("please use box collider to identify the fog of war's area!");
            return;
        }
        AreaOffset = new Vector2(AreaBox.bounds.min.x, AreaBox.bounds.min.z);
        float width = AreaBox.bounds.size.x;
        float height = AreaBox.bounds.size.z;
        float scale = height / width;
        MapWidth = Quality;
        MapHeight = (int)(scale * MapWidth);
        Radius = (int)FieldOfView;
        FogOfWarMap = new Texture2D(MapWidth, MapHeight, TextureFormat.Alpha8, false); //we only need alpha channel.
        FogOfWarMap.wrapMode = TextureWrapMode.Clamp;
        for (int i = 0; i < FogOfWarMap.height; i++)
        {
            for (int j = 0; j < FogOfWarMap.width; j++)
            {
                FogOfWarMap.SetPixel(j, i, Color.clear);
            }
        }
        FogOfWarMap.Apply();
    }


    void Awake()
    {
        CreateFOWTexture();

        material.SetColor("_FogColor", FogColor);
        Vector4 oft = Vector4.zero;
        oft.x = AreaOffset.x;
        oft.y = AreaOffset.y;
        material.SetVector("_AreaOffset", oft);
        Vector4 param = Vector4.zero;
        param.x = SpreadEdge / Quality;
        param.y = param.x;
        param.z = AreaBox.bounds.size.x;
        param.w = AreaBox.bounds.size.z;
        material.SetVector("_FOWParams", param);
    }

	void Update () 
    {

        float scale = AreaBox.bounds.size.x / MapWidth;

        //world to area coord.
        int cx = (int)((Client.transform.position.x - AreaOffset.x)/ scale);
        int cz = (int)((Client.transform.position.z - AreaOffset.y)/ scale);

        //if client not moved, don't update the FogOfWarMap
        if (LastX == cx && LastZ == cz)
            return;

        LastX = cx;
        LastZ = cz;

        int sx = cx - Radius;
        int sz = cz - Radius;

        for (int z = sz; z < sz + 2 * Radius; z++)
        {
            for (int x = sx; x < sx + 2 * Radius; x++)
            {
                if (x < 0 || x > FogOfWarMap.width || z < 0 || z > FogOfWarMap.height)
                    continue;
                    
                int dx = x - cx;
                int dz = z - cz;
                if (dx * dx + dz * dz < Radius * Radius)
                {
                    FogOfWarMap.SetPixel(x, z, Color.white);
                }
            }
        }

        //this function is very expensive, so the texture's size shouldn't be too big.
        FogOfWarMap.Apply();
	}

    void OnRenderImage(RenderTexture source, RenderTexture destination)
    {
        material.SetTexture("_FogOfWarMap", FogOfWarMap);
        
        //fast world space reconstruction, copied from build-in ImageEffects: GlobalFog.js
        CAMERA_NEAR = camera.nearClipPlane;
		CAMERA_FAR = camera.farClipPlane;
		CAMERA_FOV = camera.fieldOfView;
		CAMERA_ASPECT_RATIO = camera.aspect;
		Matrix4x4 frustumCorners = Matrix4x4.identity;
		float fovWHalf = CAMERA_FOV * 0.5f;
		Vector3 toRight  = camera.transform.right * CAMERA_NEAR * Mathf.Tan (fovWHalf * Mathf.Deg2Rad) * CAMERA_ASPECT_RATIO;
		Vector3 toTop = camera.transform.up * CAMERA_NEAR * Mathf.Tan (fovWHalf * Mathf.Deg2Rad);
		Vector3 topLeft = (camera.transform.forward * CAMERA_NEAR - toRight + toTop);
		float CAMERA_SCALE = topLeft.magnitude * CAMERA_FAR/CAMERA_NEAR;	
		topLeft.Normalize();
		topLeft *= CAMERA_SCALE;
		Vector3 topRight = (camera.transform.forward * CAMERA_NEAR + toRight + toTop);
		topRight.Normalize();
		topRight *= CAMERA_SCALE;
		Vector3 bottomRight = (camera.transform.forward * CAMERA_NEAR + toRight - toTop);
		bottomRight.Normalize();
		bottomRight *= CAMERA_SCALE;
		Vector3 bottomLeft = (camera.transform.forward * CAMERA_NEAR - toRight - toTop);
		bottomLeft.Normalize();
		bottomLeft *= CAMERA_SCALE;
		frustumCorners.SetRow (0, topLeft); 
		frustumCorners.SetRow (1, topRight);		
		frustumCorners.SetRow (2, bottomRight);
		frustumCorners.SetRow (3, bottomLeft);						
		material.SetMatrix ("_FrustumCornersWS", frustumCorners);
		material.SetVector ("_CameraWS", camera.transform.position);
        CustomGraphicsBlit(source, destination, material, 0);
    }

    static void CustomGraphicsBlit (RenderTexture source, RenderTexture dest, Material fxMaterial, int passNr) {
		RenderTexture.active = dest;
		       
		fxMaterial.SetTexture ("_MainTex", source);	        
	        	        
		GL.PushMatrix ();
		GL.LoadOrtho ();	
	    	
		fxMaterial.SetPass (passNr);	
		
	    GL.Begin (GL.QUADS);
							
		GL.MultiTexCoord2 (0, 0.0f, 0.0f); 
		GL.Vertex3 (0.0f, 0.0f, 3.0f); // BL
		
		GL.MultiTexCoord2 (0, 1.0f, 0.0f); 
		GL.Vertex3 (1.0f, 0.0f, 2.0f); // BR
		
		GL.MultiTexCoord2 (0, 1.0f, 1.0f); 
		GL.Vertex3 (1.0f, 1.0f, 1.0f); // TR
		
		GL.MultiTexCoord2 (0, 0.0f, 1.0f); 
		GL.Vertex3 (0.0f, 1.0f, 0.0f); // TL
		
		GL.End ();
	    GL.PopMatrix ();
	}		
}
