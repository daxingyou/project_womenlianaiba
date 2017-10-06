using UnityEngine;
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class GameSocket {
	public const int NETWORK_CONNECTED = 100001;
	public const int NETWORK_CLOSE = 100002;
	public const int NETWORK_ERROR = 100003;
	public const int NETWORK_CANNOT_WRITE = 100004;
	public const int NETWORK_CONNECT_ERROR = 100005;
	
	public const int PACKET_HEAD_SIZE = 4;
	
	public delegate void SocketEventHandler(int id, string reason);
	
	private TcpClient client = new TcpClient();
    private string res = String.Empty; 
	private int error_id;
	
	private Queue buffers = Queue.Synchronized(new Queue()); 
	
	//private AsyncCallback cbHeader;
	//private AsyncCallback cbBody;
	
	private bool pause = false;
	
	private Hashtable events = new Hashtable();
	
	private SocketEventHandler eventHandler;
	
	private bool first_send = true;
	
	private string m_ip;
	private int m_port;
	
	public  GameSocket(){
		//cbHeader = new AsyncCallback(DoReadPacketHeader);
		//cbBody = new AsyncCallback(DoReadPacketBody);
	}
	 
	public void Update(){
		ProcessPackets();
	}
	
    public int Connect(string ip, int port, SocketEventHandler handler)
    {
        try {
			m_ip  = ip;
			m_port = port;
			this.eventHandler = handler;
			IPAddress ipAddress = Dns.GetHostEntry (ip).AddressList[0];
			IPEndPoint ipEndPoint = new IPEndPoint (ipAddress, port);
			client.Connect (ipEndPoint);
			//error_id = NETWORK_CONNECTED;
			BinaryPack header = new BinaryPack(PACKET_HEAD_SIZE);
			client.GetStream().BeginRead(header.buffer, 0, PACKET_HEAD_SIZE, new AsyncCallback(DoReadPacketHeader), header);
            return 0;
        } 
        catch(SocketException ex){
			error_id = NETWORK_CONNECT_ERROR;
			res = ex.Message;
            return -1;
        }
		catch(System.Security.SecurityException se){
			error_id = NETWORK_CONNECT_ERROR;
			res = se.Message;
			return -1;
		}
    }
	
	public int Close(){
		client.Close();
		PostSocketEvent(NETWORK_CLOSE, ""); 
		return 0;
	}
	
	public void RegistHandler(INetPacket packet, EventDispatcher.EventHandlerDelegate handler){
		events.Add(packet.getMsgID(), new Handler(packet, handler));
	}
	
	public void UnregistHandler(int eventId){
		events.Remove(eventId);
	}
	
	public void UnregistHandler(short eventId){
		events.Remove(eventId);
	}
	
	// Use a StreamWriter to send a message to server.
	public void Send(INetPacket packet){
		if (first_send){
			//string header = "GET / HTTP/1.1\r\nHost: " + m_ip + ":" + m_port + "\r\n\r\n";
			string header = "tgw_l7_forward\r\nHost: " + m_ip + ":" + m_port + "\r\n\r\n";
			Debug.Log(header);
			byte[] bytes = System.Text.Encoding.Default.GetBytes(header);
			Send(bytes);
			first_send = false;
		}
		SendImpl(packet);
	}
	
	public void Send(byte[] buffer){
		try{
			NetworkStream stream = client.GetStream();
			if (stream.CanWrite){
				stream.Write(buffer, 0, buffer.Length);
		        stream.Flush();
			}
			else{
				error_id = NETWORK_CANNOT_WRITE;
				res = "Sorry.  You cannot write to this NetworkStream.";
			}
		}
		catch(ObjectDisposedException ex){
			error_id = NETWORK_ERROR;
			res = ex.Message;
        }
		catch(IOException eo){
			error_id = NETWORK_ERROR;
			res = eo.Message;
		}
	}
	
    private void SendImpl(INetPacket packet){
		byte[] buffer = Packet.Encode(packet);
		Send(buffer);
    }
	
	// pause network handle message
	public void Pause(){
		pause = true;
	}
	
	// continue network handle message
	public void Continue(){
		pause = false;
	}
	
	private void ProcessPackets(){		
		short id = 0;
		while(!pause && buffers.Count > 0){
            byte[] packBuff = PacketCrypto.Decode((byte[])buffers.Dequeue());
			id = Packet.GetMsgID(packBuff);
			Handler handler = (Handler)events[id];
			if (handler != null){
				INetPacket packet = handler.packet.Create();
				handler.packet = packet;
				Packet.Decode(packBuff, handler.packet);
				Debug.Log("id: " + id.ToString() + ", packet: " + handler.packet);
				PostEvent(id, handler.packet);
			}
		}
		
		if (error_id != 0){
			PostSocketEvent(error_id, res);
			error_id = 0;
			res = String.Empty;
			client.Close();
		}
	}
	
	private void DoReadPacketHeader(IAsyncResult ar)
    {
        try{
			
            int bytesRead = client.GetStream().EndRead(ar);
            if (bytesRead < 1) {
				error_id = NETWORK_ERROR;
                res="Disconnected";
				Debug.Log("read packet body NETWORK_ERROR1:" + res);
				//PostSocketEvent(NETWORK_ERROR, res);
                return;
            }
			
			BinaryPack header = (BinaryPack)ar.AsyncState;
			header.length += bytesRead;
			if (header.length < PACKET_HEAD_SIZE){
				client.GetStream().BeginRead(header.buffer, header.length, PACKET_HEAD_SIZE - header.length, new AsyncCallback(DoReadPacketHeader), header);
			}
			else{
				int size = GetBodySize(header.buffer, 0);
				BinaryPack body = new BinaryPack(size);
				client.GetStream().BeginRead(body.buffer, 0, size, new AsyncCallback(DoReadPacketBody), body);
			}
		}
		catch(ArgumentOutOfRangeException ex){
			error_id = NETWORK_ERROR;
			res = ex.Message;
			Debug.Log("read packet head NETWORK_ERROR2:" + ex.Message);
		}
		catch(IOException eo){
			error_id = NETWORK_ERROR;
			res = eo.Message + ", " + eo.GetBaseException().Message;
			Debug.Log("read packet head NETWORK_ERROR3:" + eo.Message + ", " + eo.GetBaseException().Message);
		}
    }      
	
	private void DoReadPacketBody(IAsyncResult ar)
    {
        try{
            int bytesRead = client.GetStream().EndRead(ar);
            if (bytesRead < 1) {
                res="Disconnected";
				Debug.Log("read packet body NETWORK_ERROR1:" + res);
				PostSocketEvent(NETWORK_ERROR, res);
                return;
            }
			
			BinaryPack body = (BinaryPack)ar.AsyncState;
			body.length += bytesRead;
			if (body.length < body.buffer.Length){
				client.GetStream().BeginRead(body.buffer, body.length, body.buffer.Length - body.length, new AsyncCallback(DoReadPacketBody), body);
			}
			else{
				buffers.Enqueue(body.buffer);
				BinaryPack header = new BinaryPack(PACKET_HEAD_SIZE);
				client.GetStream().BeginRead(header.buffer, 0, PACKET_HEAD_SIZE, new AsyncCallback(DoReadPacketHeader), header);
			}
		}
		catch(ArgumentOutOfRangeException ex){
			error_id = NETWORK_ERROR;
			res = ex.Message;
			Debug.Log("read packet body NETWORK_ERROR2:" + ex.Message);
			//PostSocketEvent(NETWORK_ERROR, ex.Message);
		}
		catch(IOException eo){
			error_id = NETWORK_ERROR;
			res = eo.Message+ ", " + eo.GetBaseException().Message;
			Debug.Log("read packet body NETWORK_ERROR3:" + eo.Message+ ", " + eo.GetBaseException().Message);
			//PostSocketEvent(NETWORK_ERROR, eo.Message);
		}
    }
	
    private int GetBodySize(byte[] buf, int offset)
    {
        return buf[offset] << 24 | buf[offset+1] << 16 | buf[offset+2] << 8 | buf[offset+3];
    }
	
	private int PostEvent(int eventId, object args){
		Handler handler = (Handler)events[eventId];
		if (handler != null)
			handler.handler(null, args);
		return 0;
	}
	
	private int PostEvent(short eventId, object args){
		Handler handler = (Handler)events[eventId];
		if (handler != null)
			handler.handler(null, args);
		return 0;
	}
	
	private int PostSocketEvent(int id, string reason){
		if (eventHandler != null)
			eventHandler(id, reason);
		return 0;
	}
	
	class Handler{
		public INetPacket packet;
		public EventDispatcher.EventHandlerDelegate handler;
		
		public Handler(INetPacket packet, EventDispatcher.EventHandlerDelegate handler){
			this.packet = packet;
			this.handler = handler;
		}
	}
	
	class BinaryPack{
		public byte[] buffer;
		public int length;
		public BinaryPack(int capacity){
			buffer = new byte[capacity];
			length = 0;
		}
	}
}