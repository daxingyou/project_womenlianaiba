#pragma strict
#pragma downcast

// 次文件用来定义代码里需要用到的字符变量,字符从系统消息表里获取


public static function initDefine() : void
{
	unknow = getContent(5000);
	noname = getContent(5001);
	msgtip = getContent(5002);
	ok = getContent(5003);
	cancel = getContent(5004);
	close = getContent(5005);
	buy = getContent(5006);
	refresh = getContent(5007);
	showlog = getContent(5008);
	clearcache = getContent(5009);
	you = getContent(5010);
	me = getContent(5011);
	he = getContent(5012);
	she = getContent(5013);
	it = getContent(5014);
	person = getContent(5015);
	times = getContent(5016);
	level = getContent(5017);
	stock = getContent(5018);
	piece = getContent(5019);
	crystal = getContent(5020);
	exp = getContent(5021);
	score = getContent(5022);
	grade = getContent(5023);
	aibi = getContent(5024);
	year = getContent(5025);
	month = getContent(5026);
	date = getContent(5027);
	day = getContent(5028);
	hour = getContent(5029);
	minute = getContent(5030);
	seconds = getContent(5031);
	remaintime = getContent(5032);
	duetime = getContent(5033);
	effecttime = getContent(5034);
	speaker = getContent(5035);
	secret = getContent(5036);
	say = getContent(5037);
	charm = getContent(5038);
	luxury = getContent(5039);
	skilled = getContent(5040);
	jionperson = getContent(5041);
	scoregain = getContent(5042);
	recoverprice = getContent(5043);
	uselevel = getContent(5044);
	itemlevel = getContent(5045);
	crystalcost = getContent(5046);
	skilllevel = getContent(5047);
	needlevel = getContent(5048);
	malecharm = getContent(5049);
	femalcharm = getContent(5050);
	quicklyenter = getContent(5051);
	bug = getContent(5052);
	fluency = getContent(5053);
	crowd = getContent(5054);
	full = getContent(5055);
	errorcode = getContent(5056);
	unknowtype = getContent(5057);
	clothes = getContent(5058);
	furniture = getContent(5216);
	canuseprop = getContent(5059);
	specialprop = getContent(5060);
	clothesbag = getContent(5061);
	composepaper = getContent(5062);
	composematerial = getContent(5063);
	furniturebag = getContent(5064);
	materialbag = getContent(5065);
	cansend = getContent(5066);
	cannotsend = getContent(5067);
	cannotrecover = getContent(5068);
	canupgrade = getContent(5069);
	cannotupgrade = getContent(5070);
	modifyok = getContent(5071);
	modifyfailed = getContent(5072);
	setok = getContent(5073);
	setfailed = getContent(5074);
	live = getContent(5075);
	side = getContent(5076);
	all = getContent(5077);
	anchor = getContent(5078);
	guest = getContent(5079);
	message = getContent(5080);
	exceptionmsg = getContent(5081);
	stackmsg = getContent(5082);
	gameexception = getContent(5083);
	searchangle = getContent(5217);
}

public static function getContent(id : int) : String
{
	var row : SysMsgRow = Global.GetSysMsgHandler().getSysMsgRow(id);
	return row.msg_content;
}

public static function getContent(id : int, args : String[]) : String
{
	var str : String = getContent(id);
	if (null == args || 0 == args.Length)
		return str;
	
	for (var i = 0; i<args.Length; ++i)
	{
		str = str.Replace("{" + i.ToString() + "}", args[i]);
	}
	return str;
}


public static var unknow : String = "";				// 未知
public static var noname : String = "";				// 无名氏
public static var msgtip : String = "";				// 消息提示
public static var ok : String = "";					// 确定
public static var cancel : String = "";				// 取消
public static var close : String = "";				// 关闭
public static var buy : String = "";				// 购买
public static var refresh : String = "";			// 刷新
public static var showlog : String = "";			// 看日志
public static var clearcache : String = "";			// 清缓存
public static var you : String = "";				// 您
public static var me : String = "";					// 我
public static var he : String = "";					// 他
public static var she : String = "";				// 她
public static var it : String = "";					// 它
public static var person : String = "";				// 人
public static var times : String = "";				// 次
public static var level : String = "";				// 级
public static var stock : String = "";				// 笔
public static var piece : String = "";				// 件
public static var crystal : String = "";			// 水晶
public static var exp : String = "";				// 经验
public static var score : String = "";				// 积分
public static var grade : String = "";				// 等级
public static var aibi : String = "";				// 恋爱币
public static var year : String = "";				// 年
public static var month : String = "";				// 月
public static var date : String = "";				// 日
public static var day : String = "";				// 天
public static var hour : String = "";				// 小时
public static var minute : String = "";				// 分钟
public static var seconds : String = "";			// 秒
public static var remaintime : String = "";			// 剩余时间
public static var duetime : String = "";			// 到期时间
public static var effecttime : String = "";			// 有效时间
public static var speaker : String = "";			// 喇叭
public static var secret : String = "";				// 密
public static var say : String = "";				// 说
public static var charm : String = "";				// 魅力值
public static var luxury : String = "";				// 豪华度
public static var skilled : String = "";			// 熟练度
public static var jionperson : String = "";			// 参与人数
public static var scoregain : String = "";			// 积分获取
public static var recoverprice : String = "";		// 回收价格
public static var uselevel : String = "";			// 使用等级
public static var itemlevel : String = "";			// 物品星级
public static var crystalcost : String = "";		// 水晶消费
public static var skilllevel : String = "";			// 技能等级
public static var needlevel : String = "";			// 需求等级
public static var malecharm : String = "";			// 男性魅力值
public static var femalcharm : String = "";			// 女性魅力值
public static var quicklyenter : String = "";		// 快速进入
public static var bug : String = "";				// 故障
public static var fluency : String = "";			// 流畅
public static var crowd : String = "";				// 拥挤
public static var full : String = "";				// 爆满
public static var errorcode : String = "";			// 错误代码
public static var unknowtype : String = "";			// (未知类型)
public static var clothes : String = "";			// 服装
public static var furniture :String = "";			// 家具
public static var canuseprop : String = "";			// 可使用道具
public static var specialprop : String = "";		// 特殊道具
public static var clothesbag : String = "";			// 服装礼包
public static var composepaper : String = "";		// 合成图纸
public static var composematerial : String = "";	// 合成材料
public static var furniturebag : String = "";		// 家具礼包
public static var materialbag : String = "";		// 材料礼包
public static var cansend : String = "";			// 可赠送
public static var cannotsend : String = "";			// 不可赠送
public static var cannotrecover : String = "";		// 不可回收
public static var canupgrade : String = "";			// 可以升级
public static var cannotupgrade : String = "";		// 不可升级
public static var modifyok : String = "";			// 修改成功
public static var modifyfailed : String = "";		// 修改失败
public static var setok : String = "";				// 设置成功
public static var setfailed : String = "";			// 设置失败
public static var live : String = "";				// 现场
public static var side : String = "";				// 旁听
public static var all : String = "";				// 全部
public static var anchor : String = "";				// 主播
public static var guest : String = "";				// 客人
public static var message : String = "";			// 留言
public static var exceptionmsg : String = "";		// 异常信息
public static var stackmsg : String = "";			// 堆栈信息
public static var gameexception : String = "";		// 游戏异常
public static var searchangle : String = "";		// 搜搜天使


