public class EventCenter {
	private static EventDispatcher center = new EventDispatcher();
	
	public static void RegistHandler(GameEvent evt, EventDispatcher.EventHandlerDelegate handler){
		center.RegistHandler(evt, handler);
	}
	
	public static void UnregistHandler(GameEvent evt, EventDispatcher.EventHandlerDelegate handler){
		center.UnregistHandler(evt, handler); 
	}
	
//	public static int PostEvent(System.Object src, int eventId){
//		return center.PostEvent(src, eventId, null, null);
//	}
	
	public static int PostEvent(GameEvent evt){
		return center.PostEvent(evt.src, evt.id, evt.target, null);
	}
	
	public static int PostEvent(System.Object src, int eventId, System.Object args){
		return center.PostEvent(src, eventId, null, args);
	}
	
	public static int PostEvent(GameEvent evt, System.Object args){
		return center.PostEvent(evt.src, evt.id, evt.target, args);
	}
	
	public static int PostEvent(System.Object src, int eventId, System.Object target, System.Object args){
		return center.PostEvent(src, eventId, target, args);
	}
}
