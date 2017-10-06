using System;
using System.IO;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class PacketCrypto
{
    private static bool bCrypto = true; // 
	private static Crypto crypto = new Crypto();

    public static byte[] Encode(byte[] data)
    {
        if (bCrypto)
            return crypto.Encode(data);
        else
            return data;
    }

    public static byte[] Decode(byte[] data)
    {
        if (bCrypto)
        {
            //UInt32 dataLen = (UInt32)data.Length;
            byte[] ret = crypto.Decode(data);
            //if (idx >= dataLen)
            //    throw new Exception("packet crypto decode error");
            return ret;
        }
        else
            return data;
    }
}

public class Packet {
	public static byte[] Encode(INetPacket packet){
        if (packet != null)
        {
			ByteArray bytes = new ByteArray();
			packet.build(bytes);
            byte[] bodyBytes = PacketCrypto.Encode(bytes.GetBytes());
			List<byte> pack = swab32(bodyBytes.Length);
            pack.AddRange(bodyBytes);
			return pack.ToArray();
        }
		return null;
    }
	
 	public static void Decode(byte[] buffer, INetPacket packet)
    {
		ushort IdSize = sizeof(ushort);
		ByteArray bytes = new ByteArray(buffer, IdSize);
		packet.decode(bytes);
    }
	
	public static short GetMsgID(byte[] buffer){
		return GetMsgID(buffer, 0);
	}
	
	private static short GetMsgID(byte[] buffer, int index){
		return BitConverter.ToInt16(buffer, index);
	}
	
	private static List<byte> swab32(int x) 
	{
		List<byte> buf = new List<byte>();
		buf.Add((byte)((x&0xff000000) >> 24));
		buf.Add((byte)((x&0x00ff0000) >> 16));
		buf.Add((byte)((x&0x0000ff00) >> 8));
		buf.Add((byte)((x&0x000000ff)));
		return buf;
	}
}
