using System;
using System.Collections.Generic;

/* 节点
*/
public class AStarNode<TPos>
{
    public TPos mPos;    // 位置信息(可以是二维坐标点，三维坐标点，也可以是格子, 也可以是多边形)
    public int mG;       // 途经点节所消耗的值
    public int mF;       // 总权值 F = G + H, H指到终点的权值
    public bool mIsOpened;     // 是否开启
    public AStarNode<TPos> mParent;  // 父节点，最后用来生成路径的
}

/* 寻路类
 */
public class AStarPathSearcher<TPos>
{
    public delegate void TGetNearList(TPos pos, List<TPos> nearList);
    public delegate int TGetCostValue(TPos a, TPos b);
    public delegate int TComparePos(TPos a, TPos b);
    //-----------------------------------------------------------------------
    // 按F值排序函数
    private class OrderByFValue : IComparer<AStarNode<TPos>>
    {
        public int Compare(AStarNode<TPos> a, AStarNode<TPos> b)
        {
            return a.mF.CompareTo(b.mF);
        }
    }

    //-----------------------------------------------------------------------
    // 按位置排序函数
    private class OrderByPos : IComparer<AStarNode<TPos>>
    {
        public OrderByPos(TComparePos cmp)
        {
            mCmp = cmp;
        }

        public int Compare(AStarNode<TPos> a, AStarNode<TPos> b)
        {
            return mCmp(a.mPos, b.mPos);
        }
        private TComparePos mCmp;
    }

    private OrderByFValue mOrderByFValue;
    private OrderByPos mOrderByPos;
    private TComparePos mComparePos;

    //-----------------------------------------------------------------------
    public AStarPathSearcher(TComparePos cmp)
    {
        mOrderByFValue = new OrderByFValue();
        mOrderByPos = new OrderByPos(cmp);
        mComparePos = cmp;
    }

    //-----------------------------------------------------------------------
    private AStarNode<TPos> createNode(TPos pos, int g, int h, AStarNode<TPos> pParent)
    {
        AStarNode<TPos> p = new AStarNode<TPos>();

        p.mPos = pos;
        p.mG = g;
        p.mF = g + h;
        p.mIsOpened = true;  // 默认开启
        p.mParent = pParent;
        return p;
    }

    //-----------------------------------------------------------------------
    // 按F值二分查找后插入，元素F值可重复
    private void openListAdd(List<AStarNode<TPos>> openList, AStarNode<TPos> nd)
    {
        int idx = openListFind(openList, nd);
        if (idx < 0)
            idx = -idx - 1;

        openList.Insert(idx, nd);
    }

    //-----------------------------------------------------------------------
    // 按F值二分查找
    private int openListFind(List<AStarNode<TPos>> openList, AStarNode<TPos> nd)
    {
        return openList.BinarySearch(nd, mOrderByFValue);
    }

    //-----------------------------------------------------------------------
    // 按位置二分查找后插入，元素不重复
    private void nodeListAdd(List<AStarNode<TPos>> nodeList, AStarNode<TPos> nd)
    {
        int idx = nodeListFind(nodeList, nd);
        if (idx >= 0) // 如果已经存在
        {
            nodeList[idx] = nd;
        }
        else  // 不存在, idx为负数
        {
            idx = -idx - 1;
            nodeList.Insert(idx, nd);
        }
    }

    //-----------------------------------------------------------------------
    // 按TPos二分查找
    private int nodeListFind(List<AStarNode<TPos>> nodeList, AStarNode<TPos> nd)
    {
        return nodeList.BinarySearch(nd, mOrderByPos);
    }

    //-----------------------------------------------------------------------
    public bool run(TPos startPos, TPos endPos,
                            List<TPos> outPath,
                         TGetCostValue getCostValue,    // 回调取G值  
                         TGetNearList getNearList)      // 回调取附近的点
    {
        outPath.Clear();

        List<AStarNode<TPos>> nodeList = new List<AStarNode<TPos>>(); // 节点列表(按位置排序)
        List<AStarNode<TPos>> openList = new List<AStarNode<TPos>>(); // 开启列表(按F值排序)            


        // 加入首个节点
        AStarNode<TPos> curNode = createNode(startPos, 0, 0, null);

        openListAdd(openList, curNode);
        nodeListAdd(nodeList, curNode);

        AStarNode<TPos> tmpNode = createNode(startPos, 0, 0, null); // 为提高效率， 加了个tmpNode
        List<TPos> nearList = new List<TPos>();  // 周边点列表
        for (; openList.Count > 0; )
        {
            // 取出F值最小的节点
            curNode = openList[0];

            // 如果该节点为目标节点, 返回路径，完成寻路
            if (mComparePos(curNode.mPos, endPos) == 0)
            {
                // 取得路径
                for (AStarNode<TPos> p = curNode; p != null; p = p.mParent)
                {
                    outPath.Add(p.mPos);
                }

                // 反转路径
                outPath.Reverse();
                return true;
            }

            // 从开启列表中删除该节点
            openList.RemoveAt(0);

            // 设成关闭状态
            curNode.mIsOpened = false;

            // 取周边的点            
            getNearList(curNode.mPos, nearList);


            // 遍历这些周边点			
            foreach (TPos nearPos in nearList)
                _processNewPos(nearPos, endPos, curNode, tmpNode, nodeList, openList, getCostValue);

        }
        return false;
    }

    //-----------------------------------------------------------------------
    public void _processNewPos(TPos newPos, TPos endPos,
                        AStarNode<TPos> curNode,
                        AStarNode<TPos> tmpNode,
                        List<AStarNode<TPos>> nodeList,
                        List<AStarNode<TPos>> openList,
                        TGetCostValue getCostValue   // 回调取G值  
                        )
    {
        tmpNode.mPos = newPos;
        // 判断newPos是否已在nodeList中(注: nodeList包含开启列表，以及关闭列表)
        int nodeIdx = nodeListFind(nodeList, tmpNode);
        if (nodeIdx >= 0) // 如果找到
        {
            AStarNode<TPos> ndFind = nodeList[nodeIdx];
            if (ndFind.mIsOpened) // 如果在开启列表中
            {
                // 判断是否需更新F值
                int newG = getCostValue(newPos, curNode.mPos) + curNode.mG;
                if (newG < ndFind.mG) // 如果消耗更小
                {
                    // 取得相同F值区间
                    int openIdx = openListFind(openList, ndFind);
                    for (; openIdx < openList.Count && (openList[openIdx].mF == ndFind.mF); ++openIdx)
                    {
                    }
                    --openIdx;
                    for (; openIdx >= 0 && (openList[openIdx].mF == ndFind.mF); --openIdx)
                    {
                        if (openList[openIdx] == ndFind) // 找到对应节点(reference equal)
                        {
                            // 更新开启列表的F值						
                            openList.RemoveAt(openIdx);
                            ndFind.mF -= (ndFind.mG - newG);
                            ndFind.mG = newG;
                            ndFind.mParent = curNode;
                            openListAdd(openList, ndFind);
                            break;
                        }
                    }
                }
            }
        }
        else
        {
            // 创建新节点
            AStarNode<TPos> nd = createNode(newPos,      // 位置
                                            getCostValue(newPos, curNode.mPos) + curNode.mG,  // G值,
                                            getCostValue(newPos, endPos),         // H值	
                                            curNode);                          // 父节点

            // 开启列表加入新节点
            openListAdd(openList, nd);
            nodeListAdd(nodeList, nd);
        }
    }
}