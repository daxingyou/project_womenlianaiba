���¼�ϵͳ���þ�ȷ�¼�ϵͳ��ģ��, ������ÿ����Ķ��󶼶�ĳ���¼�����Ȥ, Ҳ������ÿ����Ĳ�ͬ����Բ�ͬ���¼�����Ȥ

��ϵͳ���¼������������й�(�¼�ID, �¼�����Դsrc, �¼�Ŀ��target)

1.�����¼�:
    ͨ������GameEvent�� public static GameEvent MakeEvent(int eventId)  ֻ���¼�ID����Ȥ
	                public static GameEvent MakeEventSource(int eventId, GameObject src)  ���¼�ID����Ϣ����Դ����Ȥ
	                public static GameEvent MakeEventTarget(int eventId, GameObject target)  ���¼�ID����ϢĿ�����Ȥ
	                public static GameEvent MakeEventSourceTarget(int eventId, GameObject src, GameObject target) �����߶�����Ȥ
    �����ĸ��������Թ������ͬ���¼�����

2.���ÿ��ϵͳ���������Ϣ����Դ, ��������Ϣ�Ľ��շ�, ��ôÿ��ϵͳ����һ��EventDispatcher����˵ÿ��ϵͳ����ӵ��һ��EventDispatcher(���Լ̳л��߰���EventDispatcherʵ��)
������Բ���GameSocket.cs��EventCenter.cs, �����ĺô���ÿ��ϵͳ�����Ƿ�յ�, ���������keyֵ��ͻ������(����IDֵ����һ��, ���ǲ�ͬ��ϵͳ��ID���岻һ��), ��������Ҳ������

3.ÿ��ϵͳ���Ը���������ص��ע��ͽ��ע��Ľӿ�, ��μ�GameSocket.cs�е�RegistHandler��UnregistHandler����