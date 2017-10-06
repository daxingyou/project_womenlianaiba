public interface INetPacket
{
    void encode(ByteArray byteArray);
    void decode(ByteArray byteArray);
    void build(ByteArray byteArray);
	INetPacket Create();
	short getMsgID();
}