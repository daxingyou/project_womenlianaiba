#pragma strict
#pragma downcast



class YYGift2D
{
	private var mAnimation : iGUIAnimationEx = null;
	private var mStartPos : Vector3 = Vector3.zero;
	private var mEndPos : Vector3 = Vector3.zero;
	private static var mLayer : int = 20;
	//--------------------------------------------------
	public function YYGift2D(root : iGUIRoot, res : String, life : float, start : Vector3, end : Vector3)
	{
		initialize(root, life, start, end);
		mAnimation.play("YYGift/" + res);
	}
	//--------------------------------------------------
	public function YYGift2D(root : iGUIRoot, resArr : Array, timeStep : float, life : float, start : Vector3, end : Vector3)
	{
		initialize(root, life, start, end);
		var temp : Array = new Array();
		for (var res : String in resArr)
		{
			temp.Add("YYGift/" + res);
		}
		mAnimation.play(temp, timeStep);
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		mAnimation.destroy();
		mAnimation = null;
	}
	//--------------------------------------------------
	private function initialize(root : iGUIRoot, life : float, start : Vector3, end : Vector3) : void
	{
		mAnimation = new iGUIAnimationEx(root, life, mLayer++, true);
		mAnimation.param = "yygift2d";
		mAnimation.CallbackLoadFinished = onLoadFinished;
		mStartPos = start;
		mEndPos = end;
	}
	//--------------------------------------------------
	private function onLoadFinished() : void
	{
		var img : iGUIImage = mAnimation.getImage();
		img.setX(Random.Range(mStartPos.x, mEndPos.x - img.positionAndSize.width));
		img.setY(Random.Range(mStartPos.y, mEndPos.y - img.positionAndSize.height));
	}
	//--------------------------------------------------
	public static function createYYGift2D(root : iGUIRoot, row : YYGiftDisplayRow) : YYGift2D
	{
		if (null == root || null == row || 0 == row.display.Count)
			return null;
		else if (1 == row.display.Count)
			return new YYGift2D(root, row.display[0], row.display_time, row.start_pos, row.end_pos);
		else
			return new YYGift2D(root, row.display, row.frame_rate, row.display_time, row.start_pos, row.end_pos);
	}
	//--------------------------------------------------
}


