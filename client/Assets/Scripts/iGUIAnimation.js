#pragma strict
#pragma downcast
import iGUI;

/*--------------------------------------------------
动画控件(2013/3/6 create by hezhr)
--------------------------------------------------*/



private class iGUIAnimationImpl
{
	protected var mRoot : iGUIRoot = null;
	protected var mImage : iGUIImage = null;
	protected var mTextureAni : iGUITextureAnimation = null;
	//--------------------------------------------------
	public function iGUIAnimationImpl(root : iGUIRoot)
	{
		if (null == root)
			throw "iGUIAnimationImpl -> constructor.";
		
		mRoot = root;
		mImage = root.addElement("iGUIImage");
		mTextureAni = mImage.addTextureAnimation();
		mTextureAni.targetField = "image";
		mTextureAni.autoPlay = false;
	}
	//--------------------------------------------------
	public function iGUIAnimationImpl(root : iGUIRoot, posAndSize : Rect, layer : int)
	{
		iGUIAnimationImpl(root);
		mImage.setPositionAndSize(posAndSize);
		mImage.setLayer(layer);
	}
	//--------------------------------------------------
	public function destory() : void
	{
		if (null == mRoot)
			return;
		
		mRoot.removeElement(mImage);
	}
	//--------------------------------------------------
	public function getImage() : iGUIImage
	{
		return mImage;
	}
	//--------------------------------------------------
	public function setFrames(frames : Array, frameStep : float) : void
	{
		if (null == mTextureAni || frameStep <= 0.0f)
			return;
		
		for (var i:int = 0; i<frames.Count; ++i)
		{
			mTextureAni.images.Add(frames[i]);
		}
		mTextureAni.framesPerSecond = frameStep;
	}
	//--------------------------------------------------
	public function play() : void
	{
		if (null == mTextureAni || 0 == mTextureAni.images.Count)
			return;
		
		mTextureAni.loopType = iGUITextureAnimationLoopType.Loop;
		mTextureAni.playFromStart();
	}
	//--------------------------------------------------
}





public class iGUIAnimation extends iGUIAnimationImpl
{
	private var mLifeTimer : TimerEx = null;
	public var param : System.Object = null;
	public static var AniCtrl : Controller = new Controller();
	//--------------------------------------------------
	public function iGUIAnimation(root : iGUIRoot, life : float)
	{
		super(root);
		createTimer(life);
	}
	//--------------------------------------------------
	public function iGUIAnimation(root : iGUIRoot, posAndSize : Rect, layer : int, life : float)
	{
		super(root, posAndSize, layer);
		createTimer(life);
	}
	//--------------------------------------------------
	public function play() : void
	{
		super.play();
		startTimer();
	}
	//--------------------------------------------------
	public function play(tex : Texture) : void
	{
		mImage.image = tex;
		startTimer();
	}
	//--------------------------------------------------
	private function createTimer(life : float) : void
	{
		if (0.0f == life)
			return;
		
		mLifeTimer = mImage.gameObject.AddComponent("TimerEx");
		mLifeTimer.init(life, 1, null, completeTimer, null);
	}
	//--------------------------------------------------
	private function startTimer() : void
	{
		if (mLifeTimer)
		{
			mLifeTimer.start();
		}
	}
	//--------------------------------------------------
	private function completeTimer(obj : System.Object) : void
	{
		super.destory();
		AniCtrl.Excute("DESTROY_ANIMATION", param);
	}
	//--------------------------------------------------
}





public class iGUIAnimationEx extends iGUIAnimation
{
	private var mIcon : AsynIcon = null;
	private var mIconArr : Array = new Array();
	private var mTexArr : Array = null;
	private var mTimeStep : float = 0.0f;
	public var CallbackLoadFinished : Function = null;
	//--------------------------------------------------
	public function iGUIAnimationEx(root : iGUIRoot, life : float, layer : int, igClicks : boolean)
	{
		super(root, life);
		mImage.setLayer(layer);
		mImage.ignoreClicks = igClicks;
	}
	//--------------------------------------------------
	public function play(res : String) : void
	{
		mIcon = new AsynIcon(onLoadIconFinished, null);
		mIcon.load(res);
	}
	//--------------------------------------------------
	public function play(resArr : Array, timeStep : float) : void
	{
		mTexArr = new Array(resArr.Count);
		mTimeStep = timeStep;
		for (var i:int = 0; i<resArr.Count; ++i)
		{
			var icon : AsynIconEx = new AsynIconEx(onLoadIconArrFinished, null);
			icon.param = i;
			icon.load(resArr[i]);
			mIconArr.Add(icon);
		}
	}
	//--------------------------------------------------
	public function destroy() : void
	{
		if (mIcon)
		{
			mIcon.cancel();
			mIcon = null;
		}
		for (var icon : AsynIcon in mIconArr)
		{
			icon.cancel();
		}
		mIconArr.Clear();
		if (mTexArr)
		{
			mTexArr.Clear();
		}
		super.destory();
	}
	//--------------------------------------------------
	private function onLoadIconFinished(tex : Texture) : void
	{
		onLoadFinished(tex);
		super.play(tex);
	}
	//--------------------------------------------------
	private function onLoadIconArrFinished(tex : Texture, index : int) : void
	{
		mTexArr[index] = tex;
		if (isIconArrLoaded())
		{
			onLoadFinished(tex);
			setFrames(mTexArr, mTimeStep);
			super.play();
		}
	}
	//--------------------------------------------------
	private function onLoadFinished(tex : Texture) : void
	{
		mImage.setWidth(tex.width);
		mImage.setHeight(tex.height);
		if (CallbackLoadFinished)
		{
			CallbackLoadFinished();
		}
	}
	//--------------------------------------------------
	private function isIconArrLoaded() : boolean
	{
		for (var tex : Texture in mTexArr)
		{
			if (null == tex)
				return false;
		}
		return true;
	}
	//--------------------------------------------------
}


