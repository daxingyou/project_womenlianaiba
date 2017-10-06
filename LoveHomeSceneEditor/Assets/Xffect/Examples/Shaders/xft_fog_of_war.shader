Shader "Xffect/FogOfWar" {
Properties {
	_MainTex ("Base (RGB)", 2D) = "white" {}
	_FogOfWarMap ("Base (RGB)", 2D) = "white" {}
	_FogColor ("Fog Color", Color) = (1,1,1,1)
}

SubShader {
	Pass {
		ZTest Always Cull Off ZWrite Off
		Fog { Mode off }
				
CGPROGRAM
#pragma target 3.0
#pragma vertex vert
#pragma fragment frag
#pragma fragmentoption ARB_precision_hint_fastest 
#include "UnityCG.cginc"

uniform sampler2D _CameraDepthTexture;
uniform float4 _FogColor;
uniform sampler2D _MainTex;
uniform sampler2D _FogOfWarMap;
uniform float4 _FOWParams;
uniform float4 _AreaOffset;

uniform float4 _MainTex_ST;
uniform float4x4 _CameraToWorld;

uniform float4x4 _FrustumCornersWS;
uniform float4 _CameraWS;
uniform float4 _MainTex_TexelSize;

inline float4 ProcessFogOfWar(float4 scene, float3 position)
{

	float2 FOWUV = float2(0,0);
	FOWUV = ( (position.xz - _AreaOffset.xy) / _FOWParams.zw );

	float FOWIntensity  = tex2D( _FogOfWarMap, FOWUV ).a;

	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2( -1,  0 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2(  1,  0 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2(  0, -1 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2(  0,  1 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2( -1,  1 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2(  1,  1 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2( -1, -1 ) ).a;
	FOWIntensity += tex2D( _FogOfWarMap, FOWUV + _FOWParams.xy * float2(  1, -1 ) ).a;
	FOWIntensity /= 9;

	//if out of the fog area, don't lerp it.
	if (FOWUV.x < 0 || FOWUV.x > 1|| FOWUV.y < 0 || FOWUV.y >1)
		return scene;

	return float4( lerp( _FogColor.rgb, scene.rgb, FOWIntensity ), scene.a * FOWIntensity );
}

struct v2f {
    float4 pos : SV_POSITION;
	float2 uv : TEXCOORD0;
	float4 interpolatedRay : TEXCOORD1;
};


v2f vert (appdata_base v)
{
	v2f o;
	half index = v.vertex.z;
	v.vertex.z = 0.1;
	o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
	o.uv = v.texcoord.xy;
		
	#if SHADER_API_D3D9
	if (_MainTex_TexelSize.y < 0)
		o.uv.y = 1-o.uv.y;
	#endif				
	o.interpolatedRay = _FrustumCornersWS[(int)index];
	o.interpolatedRay.w = index;
	return o;
}

float4 frag (v2f i) : COLOR
{
	float4 color = float4(1,1,1,1);
	float4 scene = tex2D(_MainTex, i.uv);
	float dpth = Linear01Depth(UNITY_SAMPLE_DEPTH(tex2D(_CameraDepthTexture,i.uv)));
	float4 wsDir = dpth * i.interpolatedRay;
	float4 wpos = _CameraWS + wsDir;

	color = ProcessFogOfWar(scene, wpos.xyz);
	return color;
}

ENDCG

	}
}
Fallback off
}