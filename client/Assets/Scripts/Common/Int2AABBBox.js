#pragma strict
#pragma downcast
/** 2维整数矢量的AABB box
*/
class Int2AABBBox
{
	var	mXmin : int;
	var mYmin : int;
	var mXmax : int;
	var mYmax : int;
	var mIsNull : boolean;
		
	function Int2AABBBox()
	{
		reset();
	}

	function reset()
	{
		mIsNull = true;
		mXmin = 0;
		mYmin = 0;
		mXmax = 0;
		mYmax = 0;
	}

	function merge(x : int , y : int)
	{
		makeFloor(x,y);
		makeCeil(x,y);
	}

	function merge(box : Int2AABBBox)
	{
		if ( box.mIsNull )
			return;
		makeFloor(box.mXmin, box.mYmin);
		makeCeil(box.mXmax, box.mYmax);
	}

	function intersects(x : int , y : int) : boolean
	{
		if ( mIsNull )
			return false;
		return (x>= mXmin && x<=mXmax && y>=mYmin && y<=mYmax);
	}

	function intersects(box : Int2AABBBox) : boolean
	{
		if ( mIsNull || box.mIsNull )
			return false;
		return (box.mXmin>= mXmin && box.mXmax<=mXmax && box.mYmin>=mYmin && box.mYmax<=mYmax);
	}

	//return [x,y]
	function getSize()
	{
		var x : int;
		var y : int;
		
		if (mIsNull)
		{
			x = 0;
			y = 0;
		}
		else
		{
			x = mXmax - mXmin + 1;	//注意这里
			y = mYmax - mYmin + 1;
		}
		
		return [x,y];
	}

	function volume() : int
	{
		var rts = getSize();
		
		return (rts[0] * rts[1]);
	}

	function linearIndex(x : int , y : int) : int
	{
		return ((mYmax-mYmin+1)*(x-mXmin) + (y-mYmin));
	}
		
	function makeCeil(Mx : int, My : int)
	{
		if ( mIsNull )
		{
			setExtents(Mx, My, Mx, My);
		}
		else
		{
			if ( Mx > mXmax ) mXmax = Mx;
			if ( My > mYmax ) mYmax = My;
		}
	}

	function makeFloor(mx : int, my : int)
	{
		if ( mIsNull )
		{
			setExtents(mx, my, mx, my);
		}
		else
		{
			if ( mx < mXmin ) mXmin = mx;
			if ( my < mYmin ) mYmin = my;
		}
	}

	function setExtents(mx : int, my : int, Mx : int, My : int)
	{
		mIsNull = false;
		mXmin = mx;
		mYmin = my;
		mXmax = Mx;
		mYmax = My;
	}
	
	//return [x, y]
	static function rotateQuarter(x : int , y : int, qua : int, reverse : boolean)
	{
		var a : int = x;
		var b : int = y;
		var face : int = qua;
		
		if ( reverse )
		{
			if ( qua == 1)
				face = 3;
			else if ( qua == 3 )
				face = 1;
		}

		if ( face == 0)
		{
		}
		else if ( face == 1 )
		{
			x = -b;
			y = a;
		}
		else if ( face == 2 )
		{
			x = -a;
			y = -b;
		}
		else if ( face == 3 )
		{
			x = b;
			y = -a;
		}
		
		return [x, y];
	}
}