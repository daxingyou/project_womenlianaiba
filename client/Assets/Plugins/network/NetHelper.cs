using UnityEngine;
using System.Collections;

public class NetHelper : MonoBehaviour{

	private static GameSocket sock = new GameSocket();
	
	// Update is called once per frame
	void Update () {
		if (sock != null)
			sock.Update(); 
	}
	

	public static int Connect(string ip, int port, GameSocket.SocketEventHandler handler){
		return sock.Connect(ip, port, handler);
	}
	

	public static int Send(INetPacket packet){
		sock.Send(packet);
		return 0;
	}
	

	public static int Close(){
		sock.Close();
		return 0;
	}
	

	public static void RegistHandler(INetPacket packet, EventDispatcher.EventHandlerDelegate handler) {
		sock.RegistHandler(packet, handler);
	}
	

	public static void UnregistHandler(int eventId){
		sock.UnregistHandler(eventId);
	}
	
	public static void UnregistHandler(short eventId){
		sock.UnregistHandler(eventId);
	}
	
	public static void Pause(){
		sock.Pause();
	}
	
	public static void Continue(){
		sock.Continue();
	}
}
