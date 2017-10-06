using UnityEngine;
using System.Collections;

public class CompositeXffect : MonoBehaviour {

    ArrayList XffectList = new ArrayList();
	void Start ()
    {
        foreach (Transform child in transform)
        {
            XffectComponent xft = child.GetComponent<XffectComponent>();
            if (xft == null)
                continue;
            xft.Initialize();
            XffectList.Add(xft);
        }
	}

    public void Active()
    {
        if (gameObject.active == false)
            gameObject.active = true;
        foreach (XffectComponent xft in XffectList)
        {
            xft.Active();
        }
    }

    public void DeActive()
    {
        foreach (XffectComponent xft in XffectList)
        {
            xft.DeActive();
        }
    }
}
