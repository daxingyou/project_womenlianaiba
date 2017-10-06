using System;
using System.Collections.Generic;
using System.Text;

public class ByteArray
{
	private List<byte> write_bytes;
    private byte[] read_bytes;
    private int readPtr = 0;

    public ByteArray()
    {
        write_bytes = new List<byte>();
    }

    public ByteArray(byte[] stream, int startPtr)
    {
        read_bytes = stream;
		readPtr = startPtr;
    }

    public byte[] GetBytes()
    {
        return write_bytes.ToArray();
    }

    public void Write(bool v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(Int16 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(UInt16 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(Int32 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(UInt32 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(Int64 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(UInt64 v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }


    public void Write(Single v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(Double v)
    {
        byte[] b = BitConverter.GetBytes(v);
        write_bytes.AddRange(b);
    }

    public void Write(string v)
    {
        byte[] str = System.Text.Encoding.UTF8.GetBytes(v);
		Write((UInt16)str.Length);
        write_bytes.AddRange(str);
    }

    public bool read_bool()
    {
        bool v = BitConverter.ToBoolean(read_bytes, readPtr);
        readPtr += sizeof(bool);
        return v;
    }

    public Int16 read_int16()
    {
        return read_short();
    }

    public Int16 read_short()
    {
        Int16 v = BitConverter.ToInt16(read_bytes, readPtr);
        readPtr += sizeof(Int16);
        return v;
    }

    public UInt16 read_uint16()
    {
        return read_ushort();
    }

    public UInt16 read_ushort()
    {
        UInt16 v = BitConverter.ToUInt16(read_bytes, readPtr);
        readPtr += sizeof(UInt16);
        return v;
    }

    public Int32 read_int()
    {
        Int32 v = BitConverter.ToInt32(read_bytes, readPtr);
        readPtr += sizeof(Int32);
        return v;
    }

    public UInt32 read_uint()
    {
        UInt32 v = BitConverter.ToUInt32(read_bytes, readPtr);
        readPtr += sizeof(UInt32);
        return v;
    }

    public Int64 read_int64()
    {
        Int64 v = BitConverter.ToInt64(read_bytes, readPtr);
        readPtr += sizeof(Int64);
        return v;
    }

    public UInt64 read_uint64()
    {
        UInt64 v = BitConverter.ToUInt64(read_bytes, readPtr);
        readPtr += sizeof(UInt64);
        return v;
    }

    public float read_float()
    {
        float v = BitConverter.ToSingle(read_bytes, readPtr);
        readPtr += sizeof(float);
        return v;
    }

    public double read_double()
    {
        double v = BitConverter.ToDouble(read_bytes, readPtr);
        readPtr += sizeof(double);
        return v;
    }

    public string read_string()
    {
        Int16 length = read_short();
        string str = System.Text.Encoding.UTF8.GetString(read_bytes, readPtr, length);
        readPtr += length;
        return str;
    }
}