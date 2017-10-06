#include <memory.h>
#include <stdlib.h>
#include <time.h>
#include <stdio.h>

#define SHIFT_KEY 0xAFD33C8D // ����ԿӦ��ͻ��˱���һ��, ���ڸ���
#define XOR_KEY 0x2FDB3CED   // ����ԿӦ��ͻ��˱���һ��, ���ڸ���

static unsigned char s_encode_count = 0;


// ����
void _LeftShift(unsigned int * data, int n)
{
    unsigned int da = *data;
    da &= 0xFFFFFFFF << (32 - n);
    da >>= 32 - n;

    *data <<= n;
    *data |= da;
}

// ����
void _RightShift(unsigned int *data, int n)
{
    unsigned int da = *data;
    da &= 0xFFFFFFFF >> (32 - n);
    da <<= 32 - n;

    *data >>= n;
    *data |= da;
}

// ���
void _Xor(unsigned int *data, unsigned int xor)
{
    *data ^= xor;
}

// ȡ������λֵ
unsigned int ProduceShiftCount(unsigned int dataLen, unsigned int randVal)
{
    return (dataLen ^ SHIFT_KEY ^ randVal) % 32;
}

// ȡ����Xorֵ
unsigned int ProduceXor(unsigned int dataLen, unsigned int randVal)
{
    return dataLen ^ XOR_KEY ^ randVal;
}


// �������
unsigned int RandInt()
{
	return (rand() << 16) | rand();
}

// 4�ֽڶ���
char * _EncodeAlignWith4Byte(char * data, int dataLen)
{ 
    // ���Ҫ�������ֽڲ��ܶ���(������һ���ֽ������油���ֽ���)
    int k = 4 - (dataLen + 1) % 4;
    if (k == 4)
        k = 0;

	data -= (k + 1);

    *data = (char)k;

	return data;
}

// ������
char * _DecodeAlignWith4Byte(char * data)
{ 
	data += (int)(*data + 1);
	return data;
}

// ����
char * _EncodeData(char * data, char * dataEnd)
{
	unsigned int nRand, keyXor, keyShift, dataLen;
	unsigned int * pInt;

	dataLen = dataEnd - data;
    // 1. ѹ��

    // 2. ����
	++s_encode_count;
	--data;
	++dataLen;
	*data = s_encode_count;

    // 3. У���

    // 4. ����
    data = _EncodeAlignWith4Byte(data, dataLen);	
	dataLen = dataEnd - data; // ���ȷ����ı���

    // 5. ����
    nRand = RandInt();
    keyXor = ProduceXor(dataLen, nRand);
    keyShift = ProduceShiftCount(dataLen, nRand);

    for (pInt = (unsigned int *)data; pInt < (unsigned int *)dataEnd; ++pInt)
    {
        _Xor(pInt, keyXor);
        _LeftShift(pInt, (int)keyShift);
    }            

    // 6. д�����ֵ
	data -= sizeof(unsigned int);
	*((unsigned int *)data) = nRand;

    return data;
}

char * _DecodeData(char * data, char * dataEnd, unsigned char * encodeCount)
{ 
	unsigned int nRand, dataLen, keyXor, keyShift;
	unsigned int * pInt;

    // 1. ��ȡ���ֵ
    nRand = *((unsigned int *)data);
	data += sizeof(unsigned int);
	dataLen = dataEnd - data;

    // 2. ����
    keyXor = ProduceXor(dataLen, nRand);
    keyShift = ProduceShiftCount(dataLen, nRand);

    for (pInt = (unsigned int *)data; pInt < (unsigned int *)dataEnd; ++pInt)
    {
        _RightShift(pInt, (int)keyShift);
        _Xor(pInt, keyXor);
    }            

    // 3. ������
    data = _DecodeAlignWith4Byte(data);

    // 4. У���

    // 5. ����
	*encodeCount = *data;
	++data;

    // 6. ��ѹ
	return data;
}


// ������ܺ���������ݳ���(byte)
unsigned int CalcEncodeBinarySize(unsigned int dataLen)
{	
	int k;
    // 1. ѹ��

    // 2. ����      (1�ֽ�)
	++dataLen;

    // 3. У���

    // 4. ����      (1-4�ֽ�)
    k = 4 - (dataLen + 1) % 4;
    if (k == 4)
        k = 0;

	dataLen += (k + 1);   
    // 5. ����      (0�ֽ�) 

    // 6. ���ֵ(4�ֽ�)
	dataLen += 4;
	return dataLen;
}



/**************************************************************************************** 
*   erlang api
*   
*/
#include  "erl_nif.h"

static ERL_NIF_TERM encode(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[])  
{
	unsigned char * pBin;
	unsigned char * pData;
	ERL_NIF_TERM binOut;
	unsigned int newSize;
	ErlNifBinary bin; 

    if (argc != 1 || !enif_inspect_binary(env, argv[0], &bin)) 
	{ 
       return enif_make_badarg(env);  
    }
	else
	{
		newSize = CalcEncodeBinarySize(bin.size);

		pBin = enif_make_new_binary(env, newSize, &binOut);
		
		pData = pBin + newSize - bin.size;
		memcpy(pData, bin.data, bin.size);

		pData = _EncodeData(pData, pBin + newSize);
		if (pData != pBin) // ���ָ�����
			return enif_make_atom(env, "packet_crypto_encode_error_pointer");

		return binOut;
	}
}  


static ERL_NIF_TERM decode(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[])  
{
	unsigned char encodeCount;
	unsigned char * pData;
	unsigned char * pEnd;
	unsigned char * pBin;
	ERL_NIF_TERM binOut;
	unsigned int newSize;
	ErlNifBinary bin; 

    if (argc != 1 || !enif_inspect_binary(env, argv[0], &bin)) 
	{ 
       return enif_make_badarg(env);  
    }
	else
	{
		pEnd = bin.data + bin.size;
		pData = _DecodeData(bin.data, pEnd, &encodeCount);
		if (pData < bin.data || pData > pEnd) // ���ָ�����
			return enif_make_atom(env, "packet_crypto_decode_error");

		newSize = pEnd - pData; 
		pBin = enif_make_new_binary(env, newSize + 1, &binOut); // ������һ�ֽ������Ų���ֵ
		*pBin = encodeCount;
		++pBin;
		memcpy(pBin, pData, newSize);

		return binOut;
	}
}  



static ErlNifFunc nif_funcs[] =
{
{"encode", 1, encode},
{"decode", 1, decode}
};

ERL_NIF_INIT(packet_crypto,nif_funcs,NULL,NULL,NULL,NULL) 

/**************************************************************************************** 
*   ����api����c#���������Ե���
*   
*/
unsigned int GetEncodeDestLen(unsigned int dataLen)
{
	return CalcEncodeBinarySize(dataLen);
}

// �ɹ�����1, ʧ�ܷ���0
int Encode(unsigned char * dest, unsigned int destLen, unsigned char * data, unsigned int dataLen)
{
	unsigned char * p;
	unsigned char * pRet;
	if (GetEncodeDestLen(dataLen) != destLen)
		return 0;

	p = dest + destLen - dataLen;
	memcpy(p, data, dataLen);

	pRet = _EncodeData(p, p + dataLen);
	if (pRet != dest)
		return 0;
	return 1;
}

// ���ؽ��ܺ��������ʼ�±�, ��0��ʼ, ע��:���ݷ���β��
unsigned int Decode(unsigned char * data, unsigned int dataLen)
{
	unsigned char encodeCount;
	unsigned char * p = _DecodeData(data, data + dataLen, &encodeCount);
	return p - data;
}

// ��ʼ��
void Init()
{
	s_encode_count = 0;
	srand((unsigned int)time(NULL));		
}

/**************************************************************************************** 
*   ���²���Ϊ���Դ���
*   ��Ҫ����ʱ���뽫��Ŀ��Ϊconsole, ������main����
*/

void error_if(int b)
{
	char * p = NULL;
	if (b) 
	{
		// �˴������쳣���൱��throw exception
		*p = 0;
	}
}

void xor_test()
{
    error_if(0 != (1 ^ 1));
    error_if(1 != (1 ^ 0));
    error_if(1 != (0 ^ 1));

    error_if(0 != (0 ^ 0));
    error_if(3 != (2 ^ 1));
    error_if(3 != (1 ^ 2));
}

unsigned int LeftShift(unsigned int data, int n)
{
	_LeftShift(&data, n);
	return data;
}
unsigned int RightShift(unsigned int data, int n)
{
	_RightShift(&data, n);
	return data;
}


void shift1_test()
{
    unsigned int A = 0x12345678;
    unsigned int B = 0x78123456;
    unsigned int C = 0x56781234;
    unsigned int D = 0x34567812;

    error_if(B != RightShift(A, 8));
    error_if(C != RightShift(B, 8));
    error_if(D != RightShift(C, 8));
    error_if(A != RightShift(D, 8));

    error_if(C != RightShift(A, 16));
    error_if(D != RightShift(A, 24));
    error_if(A != RightShift(A, 0));
    error_if(A != RightShift(A, 32));
}

void shift2_test()
{
    unsigned int A = 0x12345678;
    unsigned int B = 0x78123456;
    unsigned int C = 0x56781234;
    unsigned int D = 0x34567812;

    error_if(C != LeftShift(D, 8));
    error_if(B != LeftShift(C, 8));
    error_if(A != LeftShift(B, 8));
    error_if(D != LeftShift(A, 8));
    

    error_if(C != LeftShift(A, 16));
    error_if(B != LeftShift(A, 24));
    error_if(A != LeftShift(A, 0));
    error_if(A != LeftShift(A, 32));
}


void align1_test()
{
	char buf[256];
	char * data;
	char * dataEnd;
	char * p;
	int dataLen;

	dataEnd = buf + 256;

	dataLen = 0;
	data = dataEnd - dataLen;
	p = _EncodeAlignWith4Byte(data, dataLen);
	error_if(4 != data - p);
	error_if(*p != (char)3);

	dataLen = 1;
	data = dataEnd - dataLen;
	*data = (char)1;
	p = _EncodeAlignWith4Byte(data, dataLen);
	error_if(4 != dataEnd - p);
	error_if(*p != (char)2);
	error_if(p[3] != (char)1);

	dataLen = 2;
	data = dataEnd - dataLen;
	data[0] = (char)1;
	data[1] = (char)2;
	p = _EncodeAlignWith4Byte(data, dataLen);
	error_if(4 != dataEnd - p);
	error_if(*p != (char)1);
	error_if(p[2] != (char)1);
	error_if(p[3] != (char)2);

	dataLen = 3;
	data = dataEnd - dataLen;
	data[0] = (char)1;
	data[1] = (char)2;
	data[2] = (char)3;
	p = _EncodeAlignWith4Byte(data, dataLen);
	error_if(4 != dataEnd - p);
	error_if(*p != (char)0);
	error_if(p[1] != (char)1);
	error_if(p[2] != (char)2);
	error_if(p[3] != (char)3);

	dataLen = 4;
	data = dataEnd - dataLen;
	data[0] = (char)1;
	data[1] = (char)2;
	data[2] = (char)3;
	data[3] = (char)4;
	p = _EncodeAlignWith4Byte(data, dataLen);
	error_if(8 != dataEnd - p);
	error_if(*p != (char)3);
	error_if(p[4] != (char)1);
	error_if(p[5] != (char)2);
	error_if(p[6] != (char)3);
	error_if(p[7] != (char)4);
}

void align2_test()
{
	char buf[256];
	char * p;

	buf[0] = 3;
	p = _DecodeAlignWith4Byte(buf);
	error_if(p - buf != 4);

	buf[0] = 2;
	buf[3] = 1;
	p = _DecodeAlignWith4Byte(buf);
	error_if(p - buf != 3);
	error_if(p[0] != 1);

	buf[0] = 1;
	buf[2] = 1;
	buf[3] = 2;
	p = _DecodeAlignWith4Byte(buf);
	error_if(p - buf != 2);
	error_if(p[0] != 1);
	error_if(p[1] != 2);
	
	buf[0] = 0;
	buf[1] = 1;
	buf[2] = 2;
	buf[3] = 3;
	p = _DecodeAlignWith4Byte(buf);
	error_if(p - buf != 1);
	error_if(p[0] != 1);
	error_if(p[1] != 2);
	error_if(p[2] != 3);

	buf[0] = 3;
	buf[4] = 1;
	buf[5] = 2;
	buf[6] = 3;
	buf[7] = 4;
	p = _DecodeAlignWith4Byte(buf);
	error_if(p - buf != 4);
	error_if(p[0] != 1);
	error_if(p[1] != 2);
	error_if(p[2] != 3);
	error_if(p[3] != 4);
}

void calc_size_test()
{
	error_if(CalcEncodeBinarySize(0) != 8);
	error_if(CalcEncodeBinarySize(1) != 8);
	error_if(CalcEncodeBinarySize(2) != 8);
	error_if(CalcEncodeBinarySize(3) != 12);
	error_if(CalcEncodeBinarySize(4) != 12);
	error_if(CalcEncodeBinarySize(5) != 12);
	error_if(CalcEncodeBinarySize(6) != 12);
	error_if(CalcEncodeBinarySize(7) != 16);
}

void encode_decode1_test()
{
	unsigned char encodeCount;
	unsigned int dataLen;
	char * p;
	char * data;
	char * dataEnd;
	char buf[256];

	dataEnd = buf + 256;

	dataLen = 0;
	data = dataEnd - dataLen;
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	
	dataLen = 1;
	data = dataEnd - dataLen;
	data[0] = 'a';
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	error_if(data[0] != 'a');

	dataLen = 2;
	data = dataEnd - dataLen;
	data[0] = 'a';
	data[1] = 'b';
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	error_if(data[0] != 'a');
	error_if(data[1] != 'b');

	dataLen = 3;
	data = dataEnd - dataLen;
	data[0] = 'a';
	data[1] = 'b';
	data[2] = 'c';
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	error_if(data[0] != 'a');
	error_if(data[1] != 'b');
	error_if(data[2] != 'c');

	dataLen = 4;
	data = dataEnd - dataLen;
	data[0] = 'a';
	data[1] = 'b';
	data[2] = 'c';
	data[3] = 'd';
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	error_if(data[0] != 'a');
	error_if(data[1] != 'b');
	error_if(data[2] != 'c');
	error_if(data[3] != 'd');

	dataLen = 5;
	data = dataEnd - dataLen;
	data[0] = 'a';
	data[1] = 'b';
	data[2] = 'c';
	data[3] = 'd';
	data[4] = 'e';
	p = _EncodeData(data, dataEnd);
	error_if(p > data);
	error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
	error_if(data[0] != 'a');
	error_if(data[1] != 'b');
	error_if(data[2] != 'c');
	error_if(data[3] != 'd');
	error_if(data[4] != 'e');
}

void pause()
{	
	getchar();
}

// ��һ���������������
void random_encode_decode_test()
{
	unsigned int testCount;
	unsigned int beginTime, costTime;
	unsigned int i, k;
	unsigned int dataLen;
	unsigned char encodeCount;
	char * p;
	char * data;
	char * dataEnd;
	char buf[1024];
	char bufSave[1024];

	dataEnd = buf + 1024;

	beginTime = clock();
	// �������
	testCount = 100000;
	for (k = 0; k < testCount; ++k)
	{
		dataLen = rand() % 256;
		data = dataEnd - dataLen;
		for (i = 0; i < dataLen; ++i)
		{
			data[i] = (char)(rand() % 256);
		}
		memcpy(bufSave, buf, 1024);

		p = _EncodeData(data, dataEnd);
		error_if(p > data);
		error_if(_DecodeData(p, dataEnd, &encodeCount) != data);
		for (i = 0; i < dataLen; ++i)
		{
			error_if(data[i] != bufSave[1024 - dataLen + i]);
		}
	}	
	
	costTime = clock() - beginTime;
	
	printf("run encode_decode %d times, cost time %d clocks\n", testCount, costTime);
}

void base_test()
{
	error_if(sizeof(unsigned int) != 4);
}

void test()
{	
	base_test();
	xor_test();
	shift1_test();
	shift2_test();
	align1_test();
	align2_test();
	calc_size_test();

	encode_decode1_test();

	random_encode_decode_test();
}


int main()
{
	Init();

	test();

	printf("test ok.\n");

	pause();
	return 0;
}
