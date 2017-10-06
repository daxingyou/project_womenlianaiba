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
    public class VortexAffector : Affector
    {
        AnimationCurve VortexCurve;
        protected Vector3 Direction;
        protected Transform VortexObj;
        protected MAGTYPE MType;
        protected bool InheritRotation;
        float Magnitude;

        public VortexAffector(Transform obj, MAGTYPE mtype, float mag, AnimationCurve vortexCurve, Vector3 dir, bool inhRot,EffectNode node)
            : base(node, AFFECTORTYPE.VortexAffector)
        {
            VortexCurve = vortexCurve;
            Direction = dir;
            InheritRotation = inhRot;
            VortexObj = obj;
            MType = mtype;
            Magnitude = mag;

            //ver 1.2.1
            if (node.Owner.IsRandomVortexDir)
            {
                Direction.x = Random.Range(-1f, 1f);
                Direction.y = Random.Range(-1f, 1f);
                Direction.z = Random.Range(-1f, 1f);
            }
            Direction.Normalize();
        }

        public override void Update(float deltaTime)
        {
            Vector3 diff;

            diff = Node.GetRealPosition() - VortexObj.position;

            float distance = diff.magnitude;

            if (distance == 0f)
                return;

            Vector3 direction = Direction;
            if (InheritRotation)
                direction = Node.Owner.ClientTransform.rotation * direction;


            float segParam = Vector3.Dot(direction, diff);
            diff -= segParam * direction;

            Vector3 deltaV = Vector3.zero;
            if (diff == Vector3.zero)
            {
                deltaV = diff;
            }
            else
            {
                deltaV = Vector3.Cross(direction, diff).normalized;
            }
            float time = Node.GetElapsedTime();
            float magnitude;
            if (MType == MAGTYPE.Curve)
                magnitude = VortexCurve.Evaluate(time);
            else
                magnitude = Magnitude;
            deltaV *= magnitude * deltaTime;
            Node.Position += deltaV;
        }
    }
}
