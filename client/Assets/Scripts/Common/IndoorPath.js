#pragma strict
#pragma downcast
import System.Collections.Generic;

class IndoorPath
{
    //-----------------------------------------------------------------------
    // 寻路
    public static function findPath(startPos: Vector3, endPos: Vector3, 
		    hs: HouseScene): Array
	{
		if (null == hs)
			return null;
		
	    var path = eqFindPath(convertVector3(startPos), 
	                       convertVector3(endPos), hs);
	    if (path)
	    {
	        var newPath = new Array();
	        for (var pos: Vector3 in path)
	        {
	            newPath.Add(convertVector3(pos));	            
	        }
	        return newPath;
	    }
	    return path;
	}
		 

    //-----------------------------------------------------------------------
    // Ogre的寻路,x坐标与unity是相反的
    private static function eqFindPath(startPos: Vector3, endPos: Vector3, 
		    hs: HouseScene): Array
    {        
	    var startGrid: HouseSceneGrid = hs.gridByPosition(startPos); 
	    var endGrid: HouseSceneGrid = hs.gridByPosition(endPos);	  
	    
	    if (null==startGrid || null==endGrid)
	    	return null;
	    
	    //如果不是同一层. 则返回. 我们目前只支持同层的寻路
	    if (startGrid.Creator != endGrid.Creator)
	    	return null;
		
	    if (startGrid && endGrid)
	    {  
	        // 判断结束点， 是否嵌入到墙壁或阻挡中
	        if (_invalidPos(endPos, endGrid))
	            return null;
	        
		    var ListOfGrid = new List.<HouseSceneGrid>(); 
		    (new AStarPathSearcher.<HouseSceneGrid>(compareGrid) // 因HouseSceneGrid没实现IComparer接口，所以直接传函数
		                           ).run(startGrid, endGrid, ListOfGrid, 
								    getCostValue,    // 回调从一格移动到另一格所需权值
								    getNearList      // 回调取附近的点
								    );
								    
			// 把.net的List转成js 的Array						    
			var rawGrids: Array = new Array(ListOfGrid.ToArray());
		    if (rawGrids.length > 0) // 如果找到路径
		    {
			    // 由于头尾点并非格子中心点，所以需要重新组织点和格子的关系
			    var rawPosArr: Array = new Array();
			    rawPosArr.Add(startPos);
			    if (rawGrids.length == 1) // 只有一格，无条件可以行走
			    {
			        rawPosArr.Add(endPos);		    			        
			        return rawPosArr;			    
			    }
			    
			    var raw_grid : HouseSceneGrid = null;
			    
			    for (var i: int = 1; i < rawGrids.length - 1; ++i)
			    {
			    	raw_grid = rawGrids[i] as HouseSceneGrid;
	    		    rawPosArr.Add(convertVector3(raw_grid.GetPosition(Space.World)));
			    }
			    rawPosArr.Add(endPos);		    
			   
               
			    // 直线行走优化
			    var posArray: Array = new Array();		    
			    
			    for (var beginIdx: int = 0; beginIdx < rawGrids.length; ++beginIdx)
			    {
				    // 取得一个楼层
				    raw_grid = rawGrids[beginIdx] as HouseSceneGrid;
				    var curFloor: HouseSceneFloor = raw_grid.Creator;
				    
				    var endIdx: int = beginIdx + 1;
				    for (; endIdx < rawGrids.length; ++endIdx)
				    {
				    	raw_grid = rawGrids[endIdx] as HouseSceneGrid;
					    if (raw_grid.Creator != curFloor)
						    break;
				    }

				    // 优化这个楼层路径
				    _processFloorPath(rawPosArr, beginIdx, endIdx, hs, curFloor, rawGrids[0], posArray);

				    beginIdx = endIdx;
			    }

			    // 最终填充路径
			    return posArray;
		    }
	    }
	    return null;
    }    
    //-----------------------------------------------------------------------
    // 判断是否嵌入到墙壁中, 或阻挡中
	private static function _invalidPos(pos: Vector3, grid: HouseSceneGrid): boolean
	{
	    var playerRadius: float = 0.05f; // 玩家半径, 这个值太小的话, 玩家会嵌入到墙壁中
	    var halfGrid: float = HouseSceneDef.HOUSE_GRID_SIZE / 2; // 格子半径
	    var mid: Vector3 = convertVector3(grid.GetPosition(Space.World));
	    
	    for (var i: int = 0; i <= 3; ++i)
	    {
	        var rts = grid.getFaceGridNo(i);
		    var x: int = rts[0];
		    var z: int = rts[1];
	        var faceGrid: HouseSceneGrid = grid.Creator.GetGrid(x, z);
	        if (grid.WallFace[i] || (faceGrid && faceGrid.Blocked)) 
	        {
	            switch( i )
		        {
		        case 0: // ++x;
		            if (pos.x + playerRadius - mid.x > halfGrid)
		                return true;
			        break;
		        case 1: // --z;
		            if (mid.z - (pos.z - playerRadius) > halfGrid)
		                return true;
			        break;
		        case 2: // --x;
		            if (mid.x - (pos.x - playerRadius) > halfGrid)
		                return true;
			        break;
		        case 3: // ++z;
		            if (pos.z + playerRadius - mid.z > halfGrid)
		                return true;
			        break;
		        }
	        }    
	    }	     
	    
	    return false;
	}	   
    //-----------------------------------------------------------------------
    // 判断能否通过两个格子
    private static function _canPass(x1: int, z1: int, x2: int, z2: int, 
						    floor: HouseSceneFloor, firstGrid: HouseSceneGrid): boolean
    {
	    var a: HouseSceneGrid = floor.GetGrid(x1, z1);
	    var b: HouseSceneGrid = floor.GetGrid(x2, z2);

	    // 如果包含空格子, 肯定是无法直线穿越的
	    if (!(a && b))
		    return false;


	    // 如果有阻挡, 也是无法直线穿越的
	    if (a.Blocked || b.Blocked)
	    {
	        // 起始格不判断阻挡
	        if (a != firstGrid && b != firstGrid)
		        return false;
		}

       // 如果中间有墙, 也是无法直线穿越的
	    var face: int = a.isNeighborGrid(b);
	    if (face >= 0)
	    {
		    if (a.getWallFace(face))
		    {
			    return false;
		    }
	    }	

	    return true;
    }

    // 基本原理
    // 直线斜率公式:k = (z2 - z1) / (x2 - x1) 
    // 所以有
    //        z = z1 + (x - x1) * k;  当x 值知道时，这个可用来求z
    //        x = x1 + (z - z1) / k;  当z 值知道时，这个可用来求x

    // 所以就能算出直线与格子四边的交点, 进而知道哪些格子被直线穿过
    //	 _____ /
    //	|     |  
    //	|    /|
    //	|___/_|
    //	   /	 
    //	  /
    //-----------------------------------------------------------------------
    // 判断能否直线穿越(只能对同一房间进行判断)
    private static function _canLineThrough(startPos: Vector3, endPos: Vector3,
				       hs: HouseScene, 
				       floor: HouseSceneFloor, firstGrid: HouseSceneGrid): boolean
    {
	    var centerVec: Vector3 = convertVector3(hs.GetPosition(Space.World));
        
	    var startVec: Vector3 = startPos - centerVec;
	    var endVec: Vector3 = endPos - centerVec;
	    var x1: float = endVec.x / HouseSceneDef.HOUSE_GRID_SIZE;
	    var z1: float = endVec.z / HouseSceneDef.HOUSE_GRID_SIZE;
	    var x2: float = startVec.x / HouseSceneDef.HOUSE_GRID_SIZE;
	    var z2: float = startVec.z / HouseSceneDef.HOUSE_GRID_SIZE;
    	
	    var playerRadius: float = 0.05f / HouseSceneDef.HOUSE_GRID_SIZE; // 玩家半径(单位厘米), 这个值太大会影响操作

	    var fBase: float = (x2 - x1);
	    // 防止除0
	    if (Mathf.Abs(fBase) < 0.000001)
	    {
		    fBase = fBase > 0.0 ? 0.000001 : -(0.000001);
	    }
	    // 求出直线斜率
	    var k: float = (z2 - z1) / fBase;

	    var tmp: int = 0;
	    var x: int = 0;
	    var z: int = 0;
	    //{// 通过与X轴交叉的点, 算出被穿过的格子 
		    // 终点加上身体半径，比较准确
		    var startX: int = (x1 < x2) ? Mathf.FloorToInt(x1 - playerRadius) : Mathf.FloorToInt(x1 + playerRadius);
		    // 起点就不考率身体半径了，不然有时会走不出来
		    var endX: int = (x1 < x2) ? Mathf.FloorToInt(x2) : Mathf.FloorToInt(x2);

		    if (endX < startX)
		    {
		        tmp = startX;
		        startX = endX;
		        endX = tmp;
		    }

		    for (x = startX + 1; x <= endX; x += 1)
		    {
			    var zFloat: float = z1 + (x - x1) * k;

			    // 人的身体是需要占用空间的, 所以分成两点来处理
			    z = Mathf.FloorToInt(zFloat + playerRadius);
			    if (!_canPass(x -1, z, x, z, floor, firstGrid)) 
				    return false;

			    z = Mathf.FloorToInt(zFloat - playerRadius);
			    if (!_canPass(x -1, z, x, z, floor, firstGrid)) 
				    return false;
		    }
	    //}

	    //{// 通过与Z轴交叉的点, 算出被穿过的格子 
		    // 终点加上身体半径，比较准确
		    var startZ: int = (z1 < z2) ? Mathf.FloorToInt(z1 - playerRadius) : Mathf.FloorToInt(z1 + playerRadius);
		    var endZ: int = (z1 < z2) ? Mathf.FloorToInt(z2) : Mathf.FloorToInt(z2);

		    if (endZ < startZ)
		    {
		        tmp = startZ;
		        startZ = endZ;
		        endZ = tmp;
            }

		    for (z = startZ + 1; z <= endZ; z += 1)
		    {
			    var xFloat: float = x1 + (z - z1) / k;

			    // 人的身体是需要占用空间的, 所以分成两点来处理
			    x = Mathf.FloorToInt(xFloat + playerRadius);	
			    if (!_canPass(x, z - 1, x, z, floor, firstGrid)) 
				    return false;

			    x = Mathf.FloorToInt(xFloat - playerRadius);				
			    if (!_canPass(x, z - 1, x, z, floor, firstGrid)) 
				    return false;
		    }
	    //}

	    return true;
    }

    //-----------------------------------------------------------------------
    // 优化这个房间路径
    private static function _processFloorPath(rawPath: Array, beginIdx: int, endIdx: int, 
						    hs: HouseScene, floor: HouseSceneFloor, firstGrid: HouseSceneGrid,
						    path: Array)
    {  
	    for (var a: int = beginIdx;;)
	    {
		    // 如果路径不足3点， 返回
		    if (endIdx - a < 3)
		    {
			    for (; a < endIdx; ++a)
			    {
				    path.Add(rawPath[a]);
			    }
			    return;
		    }

		    // 找直线路径
		    var b: int = a + 1;
		    var c: int = b + 1;
		    for (; c < endIdx; )
		    {
			    if (!_canLineThrough(rawPath[a], rawPath[c], hs, floor, firstGrid))
				    break;
				++b;
				++c;
		    }

		    path.Add(rawPath[a]);

		    a = b;
	    }
    }   

    //-----------------------------------------------------------------------
    // 回调函数
    // 功能：计算从一格移动到另一格所需权值
	private static function getCostValue (src: HouseSceneGrid, dest: HouseSceneGrid): int
	{
		// 因为室内是四方向寻路，所以权值直接用格子距离abs(x - x0) + abs(y - y0) + abs(z - z0)来算	
		// 权值计算(y方向需要换算成格子单位)
		return Mathf.Abs(src.X - dest.X) + Mathf.Abs(src.Z - dest.Z) + 
		        Mathf.Abs(src.Creator.FloorHeight - dest.Creator.FloorHeight) / HouseSceneDef.HOUSE_GRID_SIZE;
	}

    //-----------------------------------------------------------------------
    // 回调函数
    // 功能：收集相邻的非阻挡格子
	private static function getNearList(src: HouseSceneGrid, aroundList: List.<HouseSceneGrid>)
	{	    
	    aroundList.Clear();
		var x: int = src.X;
		var z: int = src.Z;

		// 取楼层
		var floor: HouseSceneFloor = src.Creator;

		// 左 
		_addToAroundList(x - 1, z, aroundList, src, floor);

		// 右 
		_addToAroundList(x + 1, z, aroundList, src, floor);

		// 上 
		_addToAroundList(x, z - 1, aroundList, src, floor);

		// 下 
		_addToAroundList(x, z + 1, aroundList, src, floor);

		// TODO: 目前HouseScene里没有房间连接数据, 这个需要补充
 	}

	private static function _addToAroundList(x: int, z: int,
											aroundList: List.<HouseSceneGrid>, 
											src: HouseSceneGrid,
											floor: HouseSceneFloor)
	{			 
		var grid: HouseSceneGrid = floor.GetGrid(x, z);
		
		// 判断是否有阻挡, 是否有墙
		if (grid && !grid.Blocked) 
		{
			var face: int = grid.isNeighborGrid(src);			
			if (face >= 0)
			{
				if (!grid.getWallFace(face))
				{   
				   	aroundList.Add(grid);					
				}
			}
		}
	}
	
    //-----------------------------------------------------------------------
    // 自已实现比较算法
    private static function compareInt(a: int, b: int): int
    {
        if (a < b)
            return -1;
        if (b < a)
            return 1;
        return 0;
    }
    
    //-----------------------------------------------------------------------
    // 自已实现比较算法
    public static function compareGrid(a: HouseSceneGrid, b: HouseSceneGrid): int
    {
        var cmp: int = compareInt(a.Creator.FloorNO, a.Creator.FloorNO);
        if (cmp != 0)
            return cmp;
        cmp = compareInt(a.X, b.X);
        if (cmp != 0)
            return cmp;
        return compareInt(a.Z, b.Z);       
    }
    //-----------------------------------------------------------------------
    // Ogre x坐标与unity是相反的
    private static function convertVector3(pos: Vector3): Vector3
    {
        return pos; 
        //return Vector3(-pos.x, pos.y, pos.z);
    }

}