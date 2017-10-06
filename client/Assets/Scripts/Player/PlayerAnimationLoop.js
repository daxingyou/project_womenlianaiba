#pragma strict
#pragma downcast

private var m_animationList: CircleListEnumer;
private var m_loopCount: int = 0;

function Start()
{
    var cfg = CreateRoleConfig.data;
    var p:Player = gameObject.GetComponent(Player);
    var res: Boo.Lang.Hash;
    if (p.isMale())
    {
        res = (cfg["boy"] as Boo.Lang.Hash);    
    }
    else
    {
        res = (cfg["girl"] as Boo.Lang.Hash);            
    }
   	
    m_animationList = new CircleListEnumer();
    m_animationList.mList = res["animation_list"]; 
    m_loopCount = (m_animationList.current() as Boo.Lang.Hash)["loop_count"];
    playAnimation();    
}

function Update()
{
    if (m_animationList)
    {
        var p:Player = gameObject.GetComponent(Player);
        var obj: GameObject = p.getModel().getGameObj();
        
        if (obj && !obj.animation.isPlaying)
        {
            --m_loopCount;
            if (m_loopCount <= 0)
            {
                m_animationList.next();
                m_loopCount = (m_animationList.current() as Boo.Lang.Hash)["loop_count"];
            }
            playAnimation();
        }
    }
}

private function playAnimation()
{
    var aniName: String = (m_animationList.current() as Boo.Lang.Hash)["ani"];
    var p:Player = gameObject.GetComponent(Player);
    p.play(aniName, WrapMode.Once);
}


