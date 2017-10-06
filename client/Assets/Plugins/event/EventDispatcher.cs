using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class EventDispatcher {
	public delegate void EventHandlerDelegate(GameEvent evt, System.Object obj);
	
	private Hashtable events = new Hashtable();
	
	public void RegistHandler(GameEvent evt, EventHandlerDelegate handler){
		RegisterHandlerImpl(evt, handler);
	}
	
//	public void UnregistHandler(GameEvent evt){
//		UnregisterHandlerImpl(evt, null); 
//	}
	
	public void UnregistHandler(GameEvent evt, EventHandlerDelegate handler){
		UnregisterHandlerImpl(evt, handler); 
	}
	
//	public int PostEvent(System.Object src, int eventId){
//		return PostEventImpl(src, eventId, null, null);
//	}
	
	public int PostEvent(GameEvent evt){
		return PostEventImpl(evt.src, evt.id, evt.target, null);
	}
	
	public int PostEvent(System.Object src, int eventId, System.Object args){
		return PostEventImpl(src, eventId, null, args);
	}
	
	public int PostEvent(GameEvent evt, System.Object args){
		return PostEventImpl(evt.src, evt.id, evt.target, args);
	}
	
	public int PostEvent(System.Object src, int eventId, System.Object target, System.Object args){
		return PostEventImpl(src, eventId, target, args);
	}
	
	
	//---------------------------------------------------------------------------------------
	
	private void RegisterHandlerImpl(GameEvent evt, EventHandlerDelegate handler){
		List<EventHandlerDelegate> handlers = (List<EventHandlerDelegate>)events[evt];
		if (handlers == null){
			handlers = new List<EventHandlerDelegate>();
			events.Add(evt, handlers);
		}
		handlers.Add(handler);
	}
	
	private void UnregisterHandlerImpl(GameEvent evt, EventHandlerDelegate handler){
		List<EventHandlerDelegate> handlers = (List<EventHandlerDelegate>)events[evt];
		if (handlers != null){
			handlers.Remove(handler);
			if (handlers.Count == 0)
				events.Remove(evt);
		}
	}    
	
	private int PostEventImpl(System.Object src, int eventId, System.Object target, System.Object args){
		Hashtable table = GetHandlers(eventId, src, target);
		if (table.Count == 0){
			//Debug.Log("post event error, not found event:" + eventId);
			return 0; 
		}
		 
		foreach (DictionaryEntry item in table){
			List<EventHandlerDelegate> handlers = item.Value as List<EventHandlerDelegate>;
			handlers.ForEach(delegate(EventHandlerDelegate h){
				h(item.Key as GameEvent, args);
			});
		}  

		return 0;
	}
	
	private Hashtable GetHandlers(int eventId, System.Object src, System.Object target){
		Hashtable table = new Hashtable();   
		
		GameEvent evt;
		List<EventHandlerDelegate> handlers;
		
		evt = GameEvent.MakeEvent(eventId);
		handlers = Find(evt);
		if (handlers != null)
			table.Add(evt, handlers);
		
		if ((src != null) && (target != null)){
			evt = GameEvent.MakeEventSourceTarget(eventId, src, target);
			handlers = Find(evt);
			if (handlers != null)
				table.Add(evt, handlers);
		}
		else{
			if (src != null){
				evt = GameEvent.MakeEventSource(eventId, src);
				handlers = Find(evt);
				if (handlers != null)
					table.Add(evt, handlers);
			}
			
			if (target != null){
				evt = GameEvent.MakeEventTarget(eventId, target);
				handlers = Find(evt);
				if (handlers != null)
					table.Add(evt, handlers);
			}
		}
		
		return table;  
	}
	
	private List<EventHandlerDelegate> Find(GameEvent evt){
		if (events.Contains(evt))
			return (List<EventHandlerDelegate>)events[evt];
		return null;
	}
}
