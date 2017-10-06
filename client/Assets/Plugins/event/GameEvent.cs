using UnityEngine;
using System.Collections;


public class GameEvent{
	public int id;
	public System.Object src;
	public System.Object target;
	
    public GameEvent(int id, System.Object src, System.Object target) {
        this.id = id;
        this.src = src;
        this.target= target;
	}
	
	public override bool Equals (System.Object obj){
		GameEvent go = obj as GameEvent;
		return ((this.id==go.id) && (this.src==go.src) && (this.target==go.target));
	}
	
	// TODO: maybe use StringBuilder better
	public override int GetHashCode(){
		string str = id.ToString();
		if (src != null)
			str += "@#$%^&*" + src.GetHashCode().ToString();
		
		if (target != null)
			str += "@#$%^&*" + target.GetHashCode().ToString();
		return str.GetHashCode();
	}
	
	public static GameEvent MakeEvent(int eventId) {
		return new GameEvent(eventId, null, null);
	}
	
	public static GameEvent MakeEventSource(int eventId, System.Object src) {
		return new GameEvent(eventId, src, null);
	}
	
	public static GameEvent MakeEventTarget(int eventId, System.Object target) {
		return new GameEvent(eventId, null, target);
	}
	
	public static GameEvent MakeEventSourceTarget(int eventId, System.Object src, System.Object target) {
		return new GameEvent(eventId, src, target);
	}
}