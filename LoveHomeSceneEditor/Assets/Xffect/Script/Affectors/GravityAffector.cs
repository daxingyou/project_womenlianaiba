//----------------------------------------------
//            Xffect Editor
// Copyright © 2012- Shallway Studio
// http://shallway.net
//----------------------------------------------

using UnityEngine;
using System.Collections;
using Xft;

namespace Xft
{

    public enum GAFTTYPE
    {
        Planar,
        Spherical
    }

    public class GravityAffector : Affector
    {
        protected GAFTTYPE GType;
        protected MAGTYPE MType;
        protected float Magnitude;
        protected AnimationCurve MagCurve;
        protected Vector3 Dir;
        protected Transform GravityObj;
        protected bool IsAccelerate = true;

        public void SetAttraction(Transform goal)
        {
            GravityObj = goal;
        }

        public GravityAffector(Transform obj, GAFTTYPE gtype, MAGTYPE mtype,bool isacc, Vector3 dir, float mag,AnimationCurve curve,EffectNode node)
            : base(node, AFFECTORTYPE.GravityAffector)
        {
            GType = gtype;
            MType = mtype;
            Magnitude = mag;
            MagCurve = curve;
            Dir = obj.rotation * dir;
            Dir.Normalize();
            GravityObj = obj;
            IsAccelerate = isacc;
        }

        public override void Update(float deltaTime)
        {
            float strength = 0f;

            if (MType == MAGTYPE.Fixed)
                strength = Magnitude;
            else
                strength = MagCurve.Evaluate(Node.GetElapsedTime());

            if (GType == GAFTTYPE.Planar)
            {
                if (IsAccelerate)
                    Node.Velocity += Dir * strength * deltaTime;
                else
                    Node.Position += Dir * strength * deltaTime;
            }
            else if (GType == GAFTTYPE.Spherical)
            {
                Vector3 dir;
                dir = GravityObj.position - Node.GetRealPosition();
                if (IsAccelerate)
                    Node.Velocity += dir * strength * deltaTime;
                else
                    Node.Position += dir.normalized * strength * deltaTime;
            }
        }
    }
}
