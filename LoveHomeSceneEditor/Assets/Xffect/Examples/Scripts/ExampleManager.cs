using UnityEngine;
using System.Collections;

public class ExampleManager : MonoBehaviour 
{

    public XffectCache EffectCache;

    //loop xffet
    public CompositeXffect XLightBeams;
    protected bool ShowLightBeams = false;
    public XffectComponent XRaining;
    protected bool ShowRaining = false;
    public XftVolumeFogObject XVolumeFog;
    protected bool ShowVolumeFog = false;
    public XffectComponent XWaterfall;
    protected bool ShowWaterfall = false;
    public XffectComponent XSeaWave;
    protected bool ShowSeaWave = false;
    public XffectComponent XPortalCone;
    protected bool ShowPortalCone = false;
    public XffectComponent XTadpoleGate;
    protected bool ShowTadpoleGate = false;
    public CompositeXffect XCrystalEnergy;
    protected bool ShowCrystalEnergy = false;
    public XffectComponent XSurroundSoul;
    protected bool ShowSurroundSoul = false;
    public XffectComponent XPhantomSwordSlash;
    protected bool ShowPhantomSwordSlash = false;
    public XffectComponent XPhantomSword;
    protected bool ShowPhantomSword = false;
    public XffectComponent XTransformSpell;
    protected bool ShowTransformSpell = false;
    public XffectComponent XSpreadSlash;
    protected bool ShowSpreadSlash = false;
    public XffectComponent XPinkSoul;
    protected bool ShowPinkSoul = false;
    public XffectComponent XSakura;
    protected bool ShowSakura = false;

    public Transform Colliders;
    //collision xffect
    public XffectComponent XCollisionTest1;
    public XffectComponent XCollisionTest2;

    //Missiles
    public XffectComponent XMissile1;
    public XffectComponent XMissile2;
    public XffectComponent XMissile3;
    public XffectComponent XMissile4;

    //Explode
    public XffectComponent XExplode1;
    public XffectComponent XExplode2;
    public CompositeXffect XExplode3;


    public Transform BackgroundWall;
    public Transform BackgroundWall2;
    public Transform BackgroundWallBottom;

    //version 1.1.2
    public XffectComponent XBombAffector;


    public XffectComponent XLevelUp;

    public XffectComponent XIceImpact;
    protected bool ShowIceImpact = false;

    protected Vector2 ScrollPosition = Vector2.zero;
	
	void Update () 
    {

        if (ShowLightBeams)
            XLightBeams.Active();
        else
            XLightBeams.DeActive();
        if (ShowRaining)
            XRaining.Active();
        else
            XRaining.DeActive();

        //removed since ver 1.2.3
        //if (ShowSnowing)
        //    XSnowing.Active();
        //else
        //    XSnowing.DeActive();

        if (ShowVolumeFog)
            XVolumeFog.gameObject.active = true;
        else
            XVolumeFog.gameObject.active = false;

        if (ShowWaterfall)
            XWaterfall.Active();
        else
            XWaterfall.DeActive();

        if (ShowSeaWave)
            XSeaWave.Active();
        else
            XSeaWave.DeActive();

        if (ShowPortalCone)
            XPortalCone.Active();
        else
            XPortalCone.DeActive();

        if (ShowTadpoleGate)
            XTadpoleGate.Active();
        else
            XTadpoleGate.DeActive();

        if (ShowCrystalEnergy)
            XCrystalEnergy.Active();
        else
            XCrystalEnergy.DeActive();

        if (ShowSurroundSoul)
            XSurroundSoul.Active();
        else
            XSurroundSoul.DeActive();

        if (ShowPhantomSwordSlash)
            XPhantomSwordSlash.Active();
        else
            XPhantomSwordSlash.DeActive();

        if (ShowPhantomSword)
            XPhantomSword.Active();
        else
            XPhantomSword.DeActive();

        if (ShowTransformSpell)
            XTransformSpell.Active();
        else
            XTransformSpell.DeActive();

        if (ShowSpreadSlash)
            XSpreadSlash.Active();
        else
            XSpreadSlash.DeActive();

        if (ShowPinkSoul)
            XPinkSoul.Active();
        else
            XPinkSoul.DeActive();

        if (ShowSakura)
            XSakura.Active();
        else
            XSakura.DeActive();

        if (ShowIceImpact)
            XIceImpact.Active();
        else
            XIceImpact.DeActive();
	}

    void LateUpdate()
    {
        // if no collision needed, hide the colliders.
        if (XCollisionTest1.gameObject.active == false && XCollisionTest2.gameObject.active == false)
        {
            if (Colliders.gameObject == true)
            {
                foreach (Transform child in Colliders)
                {
                    child.gameObject.active = false;
                }
            }
            Colliders.gameObject.active = false;
        }
    }

    void OnGUI()
    {
        GUI.Label(new Rect(150, 0, 350, 25), "left button to rotate, middle button to pan, wheel to zoom.");
        GUI.Label(new Rect(200, 18, 200, 25), "xffect pro version 1.3.0");

        ScrollPosition = GUI.BeginScrollView(new Rect(0, 0, 140, 600), ScrollPosition, new Rect(0, 0, 140, 640));
        ShowLightBeams = GUI.Toggle(new Rect(10, 0, 80, 20), ShowLightBeams, "LightBeams");
        ShowRaining = GUI.Toggle(new Rect(10, 20, 80, 20), ShowRaining, "Raining");
        ShowVolumeFog = GUI.Toggle(new Rect(10, 40, 80, 20), ShowVolumeFog, "VolumeFog");
        ShowWaterfall = GUI.Toggle(new Rect(10, 60, 80, 20), ShowWaterfall, "Waterfall");
        ShowSeaWave = GUI.Toggle(new Rect(10, 80, 80, 20), ShowSeaWave, "SeaWave");
        ShowPortalCone = GUI.Toggle(new Rect(10, 100, 80, 20), ShowPortalCone, "PortalCone");
        ShowTadpoleGate = GUI.Toggle(new Rect(10, 120, 80, 20), ShowTadpoleGate, "TadpoleGate");
        ShowCrystalEnergy = GUI.Toggle(new Rect(10, 140, 120, 20), ShowCrystalEnergy, "CrystalEnergy");
        ShowSurroundSoul = GUI.Toggle(new Rect(10, 160, 120, 20), ShowSurroundSoul, "SwingAround");

        if (GUI.Button(new Rect(10, 190, 80, 20), "collision1"))
        {
            XCollisionTest1.Active();
            //show colliders.
            foreach (Transform child in Colliders)
            {
                child.gameObject.active = true;
            }
            Colliders.gameObject.active = true;
        }

        if (GUI.Button(new Rect(10, 210, 80, 20), "collision2"))
        {
            XCollisionTest2.Active();
            //show colliders.
            foreach (Transform child in Colliders)
            {
                child.gameObject.active = true;
            }
            Colliders.gameObject.active = true;
        }

        if (GUI.Button(new Rect(10, 240, 80, 20), "missile1"))
        {
            XMissile1.Active();
            XMissile1.transform.position = new Vector3(0, 0, 50);
            SimpleMissile smile = XMissile1.transform.GetComponent<SimpleMissile>();
            smile.Reset();
        }
        if (GUI.Button(new Rect(10, 260, 80, 20), "missile2"))
        {
            XMissile2.Active();
            XMissile2.transform.position = new Vector3(0, 0, 40);
            SimpleMissile smile = XMissile2.transform.GetComponent<SimpleMissile>();
            smile.Reset();
        }
        if (GUI.Button(new Rect(10, 280, 80, 20), "missile3"))
        {
            XMissile3.Active();
            XMissile3.transform.position = new Vector3(0, 0, 40);
            SimpleMissile smile = XMissile3.transform.GetComponent<SimpleMissile>();
            smile.Reset();
        }
        if (GUI.Button(new Rect(10, 300, 80, 20), "missile4"))
        {
            XMissile4.transform.position = new Vector3(0, 0, 40);
            XMissile4.Active();
            SimpleMissile smile = XMissile4.transform.GetComponent<SimpleMissile>();
            smile.Reset();
        }


        if (GUI.Button(new Rect(10, 330, 80, 20), "explosion1"))
        {
            XExplode1.Active();
        }
        if (GUI.Button(new Rect(10, 350, 80, 20), "explosion2"))
        {
            XExplode2.Active();
        }
        if (GUI.Button(new Rect(10, 370, 80, 20), "explosion3"))
        {
            XExplode3.Active();
        }

        if (GUI.Toggle(new Rect(10, 390, 120, 20), ShowPhantomSwordSlash, "PhantomSlash"))
        {
            ShowPhantomSwordSlash = true;
            BackgroundWall.gameObject.active = true;
            BackgroundWall2.gameObject.active = true;
        }
        else
        {
            ShowPhantomSwordSlash = false;
            BackgroundWall.gameObject.active = false;
            BackgroundWall2.gameObject.active = false;
        }
        ShowPhantomSword = GUI.Toggle(new Rect(10, 410, 120, 20), ShowPhantomSword, "PhantomSword");

        ShowTransformSpell = GUI.Toggle(new Rect(10, 430, 120, 20), ShowTransformSpell, "TransformSpell");

        if (GUI.Button(new Rect(10, 450, 100, 20), "BombAffector"))
        {
            XBombAffector.Active();
        }
        //ver 1.2.1
        ShowSpreadSlash = GUI.Toggle(new Rect(10, 470, 120, 20), ShowSpreadSlash, "SpreadSlash");
        ShowPinkSoul = GUI.Toggle(new Rect(10, 490, 120, 20), ShowPinkSoul, "PinkSoul");
        ShowSakura = GUI.Toggle(new Rect(10, 510, 120, 20), ShowSakura, "Sakura");

        //ver 1.2.2
        if (GUI.Button(new Rect(10, 530, 100, 20), "LevelUp"))
        {
            XLevelUp.Active();
        }

        //ver 1.2.3
        if (GUI.Toggle(new Rect(10, 550, 120, 20), ShowIceImpact, "IceImpact"))
        {
            BackgroundWallBottom.gameObject.active = true;
            ShowIceImpact = true;
        }
        else
        {
            BackgroundWallBottom.gameObject.active = false;
            ShowIceImpact = false;
        }

        GUI.EndScrollView();
    }

    //collisions
    void OnSpreadHit(Vector3 collidePos)
    {
        EffectCache.ReleaseEffect("exp_small", collidePos);
    }

    void OnConcentrateHit(Vector3 collidePos)
    {
        EffectCache.ReleaseEffect("exp_small", collidePos);
    }
}
