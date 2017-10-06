本事件系统采用精确事件系统的模型, 可以让每个类的对象都对某个事件感兴趣, 也可以让每个类的不同对象对不同的事件感兴趣

本系统的事件和三个因素有关(事件ID, 事件发送源src, 事件目标target)

1.构造事件:
    通过调用GameEvent的 public static GameEvent MakeEvent(int eventId)  只对事件ID感兴趣
	                public static GameEvent MakeEventSource(int eventId, GameObject src)  对事件ID和消息发送源感兴趣
	                public static GameEvent MakeEventTarget(int eventId, GameObject target)  对事件ID和消息目标感兴趣
	                public static GameEvent MakeEventSourceTarget(int eventId, GameObject src, GameObject target) 对三者都感兴趣
    的这四个函数可以构造出不同的事件类型

2.如果每个系统本身就是消息发送源, 而不是消息的接收方, 那么每个系统就是一个EventDispatcher或者说每个系统可以拥有一个EventDispatcher(可以继承或者包含EventDispatcher实例)
具体可以参照GameSocket.cs和EventCenter.cs, 这样的好处是每个系统本身是封闭的, 不容易造成key值冲突的问题(比如ID值定义一样, 但是不同的系统的ID意义不一样), 在性能上也有优势

3.每个系统可以根据自身的特点简化注册和解除注册的接口, 请参见GameSocket.cs中的RegistHandler和UnregistHandler函数