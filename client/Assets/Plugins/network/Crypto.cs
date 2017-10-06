using System;

public class Crypto
{ 
    private static UInt32  SHIFT_KEY = 0xAFD33C8D; // 此密钥应与客户端保持一致, 定期更换
    private static UInt32 XOR_KEY = 0x2FDB3CED;   // 此密钥应与客户端保持一致, 定期更换

    private static byte s_encode_count = 0;

    // 左移
    UInt32 _LeftShift(UInt32 data, int n)
    {
        UInt32 da = data;
        da &= 0xFFFFFFFF << (32 - n);
        da >>= 32 - n;

        data <<= n;
        data |= da;
        return data;
    }

    // 右移
    UInt32 _RightShift(UInt32 data, int n)
    {
        UInt32 da = data;
        da &= 0xFFFFFFFF >> (32 - n);
        da <<= 32 - n;

        data >>= n;
        data |= da;
        return data;
    }

    // 异或
    UInt32 _Xor(UInt32 data, UInt32 xor)
    {
        data ^= xor;
        return data;
    }

    // 取加密移位值
    UInt32 ProduceShiftCount(UInt32 dataLen, UInt32 randVal)
    {
        return (dataLen ^ SHIFT_KEY ^ randVal) % 32;
    }

    // 取加密Xor值
    UInt32 ProduceXor(UInt32 dataLen, UInt32 randVal)
    {
        return dataLen ^ XOR_KEY ^ randVal;
    }


    // 随机整数
    UInt32 RandInt()
    {
        Random r = new Random();
        
        return ((UInt32)(r.Next() << 16)) | (UInt32)r.Next();
    }

    // 4字节对齐
    int _EncodeAlignWith4Byte(byte[] data, int dataPoint, int dataLen)
    { 
        // 算出要补几个字节才能对齐(多用了一个字节用来存补的字节数)
        byte k = (byte)(4 - (dataLen + 1) % 4);
        if (k == 4)
            k = 0;

        dataPoint -= (k + 1);

        data[dataPoint] = k;

        return dataPoint;
    }

    // 反对齐
    int _DecodeAlignWith4Byte(byte[] data, int dataPoint)
    {
        dataPoint += (int)data[dataPoint] + 1;
        return dataPoint;
    }

    // 加密
    int _EncodeData(byte[] dest, int destPoint, int dataLen)
    {
        // 1. 压缩

        // 2. 步进
        ++s_encode_count;
        destPoint--;
        dataLen++;
        dest[destPoint] = s_encode_count;

        // 3. 校验和

        // 4. 对齐
        destPoint = _EncodeAlignWith4Byte(dest, destPoint, dataLen);
        dataLen = dest.Length - destPoint; // 长度发生改变了

        // 5. 加密
        UInt32 nRand = RandInt();
        UInt32 keyXor = ProduceXor((UInt32)dataLen, nRand);
        UInt32 keyShift = ProduceShiftCount((UInt32)dataLen, nRand);

        for (int i = destPoint; i < dest.Length; i+=4)
        {
            UInt32 v = _Xor(BitConverter.ToUInt32(dest, i), keyXor);
            v = _LeftShift(v, (int)keyShift);
            byte[] b = BitConverter.GetBytes(v);
            fill(dest, i, b);
        }            

        // 6. 写入随机值
        destPoint -= sizeof(UInt32);
        fill(dest, destPoint, BitConverter.GetBytes(nRand));

        return destPoint;
    }

    byte[] _DecodeData(byte[] data)
    { 
        UInt32 keyXor, keyShift;

        int dataPoint = 0;
        // 1. 读取随机值
        UInt32 nRand = BitConverter.ToUInt32(data, 0);
        dataPoint += sizeof(UInt32);
        UInt32 dataLen = (UInt32)(data.Length - dataPoint);

        // 2. 解密
        keyXor = ProduceXor(dataLen, nRand);
        keyShift = ProduceShiftCount(dataLen, nRand);

        for (int i = dataPoint; i < data.Length; i += 4)
        {
            UInt32 v = _RightShift(BitConverter.ToUInt32(data, i), (int)keyShift);
            v = _Xor(v, keyXor);
            byte[] b = BitConverter.GetBytes(v);
            fill(data, i, b);
        }

        // 3. 反对齐
        dataPoint = _DecodeAlignWith4Byte(data, dataPoint);

        // 4. 校验和

        // 5. 步进
        //*encodeCount = *data;
        //++data;
        dataPoint++;

        // 6. 解压
        

        // 恢复成原始数据
        int len = data.Length - dataPoint;
        byte[] ret = new byte[len];
        for (int i = 0; i < len; i++)
            ret[i] = data[dataPoint + i];
        return ret;
    }


    // 计算加密后二进制数据长度(byte)
    UInt32 CalcEncodeBinarySize(UInt32 dataLen)
    {
        // 1. 压缩

        // 2. 步进      (1字节)
        ++dataLen;

        // 3. 校验和

        // 4. 对齐      (1-4字节)
        UInt32 k = 4 - (dataLen + 1) % 4;
        if (k == 4)
            k = 0;
        dataLen += (k + 1);  

        // 5. 加密      (0字节) 

        // 6. 随机值(4字节)
        dataLen += 4;
        return dataLen;
    }

    void fill(byte[] dest, int destPoint, byte[] src){
        for (int i = 0; i < src.Length; i++)
            dest[destPoint + i] = src[i];
    }

    /**************************************************************************************** 
    *   其它api，供c#或其它语言调用
    *   
    */
    UInt32 GetEncodeDestLen(UInt32 dataLen)
    {
        return CalcEncodeBinarySize(dataLen);
    }

    // 成功返回Encode后的数据, 失败返回null
    public byte[] Encode(byte[] data)
    {
        UInt32 dataLen = (UInt32)data.Length;
        UInt32 destLen = GetEncodeDestLen(dataLen);
        byte[] dest = new byte[destLen];

        //if (GetEncodeDestLen((UInt32)dest.Length) != data.Length)
	    //    return null;

        int pIndex = dest.Length - data.Length;
        for (int i = 0; i < data.Length; i++)
            dest[pIndex+i] = data[i];

        _EncodeData(dest, pIndex, data.Length);
        // TODO: 做校验, 把下面注释掉的代码变成可用
        //if (pRet != dest)
	    //    return null;
        return dest;
    }

    // 返回解密后的数据起始下标, 从0开始, 注意:数据放在尾部
    public byte[] Decode(byte[]data)
    {
        return _DecodeData(data);
    }

    // 初始化
    void Init()
    {
        //srand((UInt32)time(NULL));		
    }

}