using System;
using System.Collections;
public class req_login : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_login;
    }
    public int version;
    public string login_type = "";
    public string account = "";
    public string password = "";
    public string pf_key = "";
    public string iopenid = "";
    public int srvid;
    public int ch;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(version);
    	byteArray.Write(login_type);
    	byteArray.Write(account);
    	byteArray.Write(password);
    	byteArray.Write(pf_key);
    	byteArray.Write(iopenid);
    	byteArray.Write(srvid);
    	byteArray.Write(ch);
    }

    public void decode(ByteArray byteArray)
    {
        version = byteArray.read_int();
        login_type = byteArray.read_string();
        account = byteArray.read_string();
        password = byteArray.read_string();
        pf_key = byteArray.read_string();
        iopenid = byteArray.read_string();
        srvid = byteArray.read_int();
        ch = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_login);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_login();
    }
}

public class notify_login_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_login_result;
    }
    public int result;
    public string nick_name = "";
    public int sex;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    	byteArray.Write(nick_name);
    	byteArray.Write(sex);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        nick_name = byteArray.read_string();
        sex = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_login_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_login_result();
    }
}

public class stime : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_stime;
    }
    public int year;
    public int month;
    public int day;
    public int hour;
    public int minute;
    public int second;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(year);
    	byteArray.Write(month);
    	byteArray.Write(day);
    	byteArray.Write(hour);
    	byteArray.Write(minute);
    	byteArray.Write(second);
    }

    public void decode(ByteArray byteArray)
    {
        year = byteArray.read_int();
        month = byteArray.read_int();
        day = byteArray.read_int();
        hour = byteArray.read_int();
        minute = byteArray.read_int();
        second = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_stime);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new stime();
    }
}

public class point : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_point;
    }
    public float x;
    public float y;
    public float z;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(x);
    	byteArray.Write(y);
    	byteArray.Write(z);
    }

    public void decode(ByteArray byteArray)
    {
        x = byteArray.read_float();
        y = byteArray.read_float();
        z = byteArray.read_float();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_point);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new point();
    }
}

public class grid_pos : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_grid_pos;
    }
    public int x;
    public int y;
    public int z;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(x);
    	byteArray.Write(y);
    	byteArray.Write(z);
    }

    public void decode(ByteArray byteArray)
    {
        x = byteArray.read_int();
        y = byteArray.read_int();
        z = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_grid_pos);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new grid_pos();
    }
}

public class item_property : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_item_property;
    }
    public string key = "";
    public int value;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(key);
    	byteArray.Write(value);
    }

    public void decode(ByteArray byteArray)
    {
        key = byteArray.read_string();
        value = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_item_property);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new item_property();
    }
}

public class item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_item;
    }
    public UInt64 instance_id;
    public int template_id;
    public stime del_time = new stime();
    public ArrayList property = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(instance_id);
    	byteArray.Write(template_id);
        del_time.encode(byteArray);

        byteArray.Write((UInt16)property.Count);
        for(int i = 0; i < property.Count; i++)
        {
            ((item_property)property[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        instance_id = byteArray.read_uint64();
        template_id = byteArray.read_int();
        del_time.decode(byteArray);
        int CountOfproperty = byteArray.read_uint16();
        item_property[] ArrayOfproperty = new item_property[CountOfproperty];
        for(int i = 0; i < CountOfproperty; i++)
        {
            ArrayOfproperty[i] = new item_property();
            ((item_property)ArrayOfproperty[i]).decode(byteArray);
        }
        property.Clear();
        property.AddRange(ArrayOfproperty);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new item();
    }
}

public class visit_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_visit_log;
    }
    public string account = "";
    public string openid = "";
    public stime visit_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(openid);
        visit_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        openid = byteArray.read_string();
        visit_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_visit_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new visit_log();
    }
}

public class guest_book : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_guest_book;
    }
    public UInt64 id;
    public string account = "";
    public string content = "";
    public int opened;
    public stime create_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(account);
    	byteArray.Write(content);
    	byteArray.Write(opened);
        create_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_uint64();
        account = byteArray.read_string();
        content = byteArray.read_string();
        opened = byteArray.read_int();
        create_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_guest_book);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new guest_book();
    }
}

public class pack_grid : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_pack_grid;
    }
    public int count;
    public int Lock;
    public item item_data = new item();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    	byteArray.Write(Lock);
        item_data.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
        Lock = byteArray.read_int();
        item_data.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_pack_grid);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new pack_grid();
    }
}

public class polymorph : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_polymorph;
    }
    public int id;
    public int duration;
    public stime start_at = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(duration);
        start_at.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        duration = byteArray.read_int();
        start_at.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_polymorph);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new polymorph();
    }
}

public class player_basic_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_basic_data;
    }
    public string account = "";
    public string username = "";
    public int sex;
    public int skin_color;
    public int hair;
    public int face;
    public int beard;
    public float online_time;
    public int hair_color;
    public stime last_login_time = new stime();
    public UInt64 house_id;
    public int mateup_status;
    public int hp;
    public ArrayList body = new ArrayList();
    public stime hp_update_time = new stime();
    public stime create_time = new stime();
    public string first_photo_player = "";
    public int animal_type;
    public stime birthday = new stime();
    public int star;
    public int height;
    public int salary;
    public int blood_type;
    public int education;
    public string contact = "";
    public string interest = "";
    public string signature = "";
    public int city;
    public int province;
    public string career = "";
    public int weight;
    public polymorph alter_body = new polymorph();
    public int charm;
    public int produce_experience;
    public int produce_level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(username);
    	byteArray.Write(sex);
    	byteArray.Write(skin_color);
    	byteArray.Write(hair);
    	byteArray.Write(face);
    	byteArray.Write(beard);
    	byteArray.Write(online_time);
    	byteArray.Write(hair_color);
        last_login_time.encode(byteArray);

    	byteArray.Write(house_id);
    	byteArray.Write(mateup_status);
    	byteArray.Write(hp);
        byteArray.Write((UInt16)body.Count);
        for(int i = 0; i < body.Count; i++)
        {
            ((pack_grid)body[i]).encode(byteArray);
        }
        hp_update_time.encode(byteArray);

        create_time.encode(byteArray);

    	byteArray.Write(first_photo_player);
    	byteArray.Write(animal_type);
        birthday.encode(byteArray);

    	byteArray.Write(star);
    	byteArray.Write(height);
    	byteArray.Write(salary);
    	byteArray.Write(blood_type);
    	byteArray.Write(education);
    	byteArray.Write(contact);
    	byteArray.Write(interest);
    	byteArray.Write(signature);
    	byteArray.Write(city);
    	byteArray.Write(province);
    	byteArray.Write(career);
    	byteArray.Write(weight);
        alter_body.encode(byteArray);

    	byteArray.Write(charm);
    	byteArray.Write(produce_experience);
    	byteArray.Write(produce_level);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        username = byteArray.read_string();
        sex = byteArray.read_int();
        skin_color = byteArray.read_int();
        hair = byteArray.read_int();
        face = byteArray.read_int();
        beard = byteArray.read_int();
        online_time = byteArray.read_float();
        hair_color = byteArray.read_int();
        last_login_time.decode(byteArray);
        house_id = byteArray.read_uint64();
        mateup_status = byteArray.read_int();
        hp = byteArray.read_int();
        int CountOfbody = byteArray.read_uint16();
        pack_grid[] ArrayOfbody = new pack_grid[CountOfbody];
        for(int i = 0; i < CountOfbody; i++)
        {
            ArrayOfbody[i] = new pack_grid();
            ((pack_grid)ArrayOfbody[i]).decode(byteArray);
        }
        body.Clear();
        body.AddRange(ArrayOfbody);
        hp_update_time.decode(byteArray);
        create_time.decode(byteArray);
        first_photo_player = byteArray.read_string();
        animal_type = byteArray.read_int();
        birthday.decode(byteArray);
        star = byteArray.read_int();
        height = byteArray.read_int();
        salary = byteArray.read_int();
        blood_type = byteArray.read_int();
        education = byteArray.read_int();
        contact = byteArray.read_string();
        interest = byteArray.read_string();
        signature = byteArray.read_string();
        city = byteArray.read_int();
        province = byteArray.read_int();
        career = byteArray.read_string();
        weight = byteArray.read_int();
        alter_body.decode(byteArray);
        charm = byteArray.read_int();
        produce_experience = byteArray.read_int();
        produce_level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_basic_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_basic_data();
    }
}

public class player_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_info;
    }
    public player_basic_data basic_data = new player_basic_data();
    public string scenename = "";
    public void encode(ByteArray byteArray)
    {
        basic_data.encode(byteArray);

    	byteArray.Write(scenename);
    }

    public void decode(ByteArray byteArray)
    {
        basic_data.decode(byteArray);
        scenename = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_info();
    }
}

public class npc_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_npc_info;
    }
    public int npc_id;
    public int body;
    public int head;
    public int hair;
    public int equip1;
    public int equip2;
    public int skeleton;
    public string npc_name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(npc_id);
    	byteArray.Write(body);
    	byteArray.Write(head);
    	byteArray.Write(hair);
    	byteArray.Write(equip1);
    	byteArray.Write(equip2);
    	byteArray.Write(skeleton);
    	byteArray.Write(npc_name);
    }

    public void decode(ByteArray byteArray)
    {
        npc_id = byteArray.read_int();
        body = byteArray.read_int();
        head = byteArray.read_int();
        hair = byteArray.read_int();
        equip1 = byteArray.read_int();
        equip2 = byteArray.read_int();
        skeleton = byteArray.read_int();
        npc_name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_npc_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new npc_info();
    }
}

public class npc_map_mapping_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_npc_map_mapping_info;
    }
    public int id;
    public int npc_id;
    public string npc_name = "";
    public point pos = new point();
    public int script_id;
    public int action;
    public string npc_key = "";
    public int towards;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(npc_id);
    	byteArray.Write(npc_name);
        pos.encode(byteArray);

    	byteArray.Write(script_id);
    	byteArray.Write(action);
    	byteArray.Write(npc_key);
    	byteArray.Write(towards);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        npc_id = byteArray.read_int();
        npc_name = byteArray.read_string();
        pos.decode(byteArray);
        script_id = byteArray.read_int();
        action = byteArray.read_int();
        npc_key = byteArray.read_string();
        towards = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_npc_map_mapping_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new npc_map_mapping_info();
    }
}

public class furniture_position : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_furniture_position;
    }
    public int position_index;
    public int is_used;
    public string used_account = "";
    public int status;
    public int func_id;
    public stime use_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(position_index);
    	byteArray.Write(is_used);
    	byteArray.Write(used_account);
    	byteArray.Write(status);
    	byteArray.Write(func_id);
        use_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        position_index = byteArray.read_int();
        is_used = byteArray.read_int();
        used_account = byteArray.read_string();
        status = byteArray.read_int();
        func_id = byteArray.read_int();
        use_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_furniture_position);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new furniture_position();
    }
}

public class furniture_goods_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_furniture_goods_data;
    }
    public int goods_id;
    public int x;
    public int z;
    public float height;
    public int floor;
    public int face;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(goods_id);
    	byteArray.Write(x);
    	byteArray.Write(z);
    	byteArray.Write(height);
    	byteArray.Write(floor);
    	byteArray.Write(face);
    }

    public void decode(ByteArray byteArray)
    {
        goods_id = byteArray.read_int();
        x = byteArray.read_int();
        z = byteArray.read_int();
        height = byteArray.read_float();
        floor = byteArray.read_int();
        face = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_furniture_goods_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new furniture_goods_data();
    }
}

public class setting_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_setting_info;
    }
    public string name = "";
    public int value;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(name);
    	byteArray.Write(value);
    }

    public void decode(ByteArray byteArray)
    {
        name = byteArray.read_string();
        value = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_setting_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new setting_info();
    }
}

public class player_setting : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_setting;
    }
    public string account = "";
    public ArrayList info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        byteArray.Write((UInt16)info.Count);
        for(int i = 0; i < info.Count; i++)
        {
            ((setting_info)info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        int CountOfinfo = byteArray.read_uint16();
        setting_info[] ArrayOfinfo = new setting_info[CountOfinfo];
        for(int i = 0; i < CountOfinfo; i++)
        {
            ArrayOfinfo[i] = new setting_info();
            ((setting_info)ArrayOfinfo[i]).decode(byteArray);
        }
        info.Clear();
        info.AddRange(ArrayOfinfo);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_setting);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_setting();
    }
}

public class house_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_house_furniture;
    }
    public UInt64 instance_id;
    public int template_id;
    public int x;
    public int z;
    public float height;
    public int floor;
    public int face;
    public int item_tempid;
    public int status;
    public stime del_time = new stime();
    public ArrayList property = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(instance_id);
    	byteArray.Write(template_id);
    	byteArray.Write(x);
    	byteArray.Write(z);
    	byteArray.Write(height);
    	byteArray.Write(floor);
    	byteArray.Write(face);
    	byteArray.Write(item_tempid);
    	byteArray.Write(status);
        del_time.encode(byteArray);

        byteArray.Write((UInt16)property.Count);
        for(int i = 0; i < property.Count; i++)
        {
            ((item_property)property[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        instance_id = byteArray.read_uint64();
        template_id = byteArray.read_int();
        x = byteArray.read_int();
        z = byteArray.read_int();
        height = byteArray.read_float();
        floor = byteArray.read_int();
        face = byteArray.read_int();
        item_tempid = byteArray.read_int();
        status = byteArray.read_int();
        del_time.decode(byteArray);
        int CountOfproperty = byteArray.read_uint16();
        item_property[] ArrayOfproperty = new item_property[CountOfproperty];
        for(int i = 0; i < CountOfproperty; i++)
        {
            ArrayOfproperty[i] = new item_property();
            ((item_property)ArrayOfproperty[i]).decode(byteArray);
        }
        property.Clear();
        property.AddRange(ArrayOfproperty);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_house_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new house_furniture();
    }
}

public class room_tex : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_room_tex;
    }
    public int room_id;
    public int type;
    public string tex = "";
    public int floor_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(room_id);
    	byteArray.Write(type);
    	byteArray.Write(tex);
    	byteArray.Write(floor_id);
    }

    public void decode(ByteArray byteArray)
    {
        room_id = byteArray.read_int();
        type = byteArray.read_int();
        tex = byteArray.read_string();
        floor_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_room_tex);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new room_tex();
    }
}

public class house_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_house_info;
    }
    public UInt64 house_id;
    public int template_id;
    public int furniture_permission;
    public ArrayList furniture_vec = new ArrayList();
    public ArrayList room_tex_vec = new ArrayList();
    public string welcome_words = "";
    public int house_permission;
    public ArrayList visit_logs = new ArrayList();
    public stime buy_date = new stime();
    public int level;
    public int house_clean;
    public string boy = "";
    public string girl = "";
    public string name = "";
    public int mateup_status;
    public int decoration;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(template_id);
    	byteArray.Write(furniture_permission);
        byteArray.Write((UInt16)furniture_vec.Count);
        for(int i = 0; i < furniture_vec.Count; i++)
        {
            ((house_furniture)furniture_vec[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)room_tex_vec.Count);
        for(int i = 0; i < room_tex_vec.Count; i++)
        {
            ((room_tex)room_tex_vec[i]).encode(byteArray);
        }
    	byteArray.Write(welcome_words);
    	byteArray.Write(house_permission);
        byteArray.Write((UInt16)visit_logs.Count);
        for(int i = 0; i < visit_logs.Count; i++)
        {
            ((visit_log)visit_logs[i]).encode(byteArray);
        }
        buy_date.encode(byteArray);

    	byteArray.Write(level);
    	byteArray.Write(house_clean);
    	byteArray.Write(boy);
    	byteArray.Write(girl);
    	byteArray.Write(name);
    	byteArray.Write(mateup_status);
    	byteArray.Write(decoration);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        template_id = byteArray.read_int();
        furniture_permission = byteArray.read_int();
        int CountOffurniture_vec = byteArray.read_uint16();
        house_furniture[] ArrayOffurniture_vec = new house_furniture[CountOffurniture_vec];
        for(int i = 0; i < CountOffurniture_vec; i++)
        {
            ArrayOffurniture_vec[i] = new house_furniture();
            ((house_furniture)ArrayOffurniture_vec[i]).decode(byteArray);
        }
        furniture_vec.Clear();
        furniture_vec.AddRange(ArrayOffurniture_vec);
        int CountOfroom_tex_vec = byteArray.read_uint16();
        room_tex[] ArrayOfroom_tex_vec = new room_tex[CountOfroom_tex_vec];
        for(int i = 0; i < CountOfroom_tex_vec; i++)
        {
            ArrayOfroom_tex_vec[i] = new room_tex();
            ((room_tex)ArrayOfroom_tex_vec[i]).decode(byteArray);
        }
        room_tex_vec.Clear();
        room_tex_vec.AddRange(ArrayOfroom_tex_vec);
        welcome_words = byteArray.read_string();
        house_permission = byteArray.read_int();
        int CountOfvisit_logs = byteArray.read_uint16();
        visit_log[] ArrayOfvisit_logs = new visit_log[CountOfvisit_logs];
        for(int i = 0; i < CountOfvisit_logs; i++)
        {
            ArrayOfvisit_logs[i] = new visit_log();
            ((visit_log)ArrayOfvisit_logs[i]).decode(byteArray);
        }
        visit_logs.Clear();
        visit_logs.AddRange(ArrayOfvisit_logs);
        buy_date.decode(byteArray);
        level = byteArray.read_int();
        house_clean = byteArray.read_int();
        boy = byteArray.read_string();
        girl = byteArray.read_string();
        name = byteArray.read_string();
        mateup_status = byteArray.read_int();
        decoration = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_house_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new house_info();
    }
}

public class notify_repeat_login : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_repeat_login;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_repeat_login);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_repeat_login();
    }
}

public class req_create_role : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_create_role;
    }
    public player_basic_data basic_data = new player_basic_data();
    public ArrayList equips = new ArrayList();
    public string iopenid = "";
    public void encode(ByteArray byteArray)
    {
        basic_data.encode(byteArray);

        byteArray.Write((UInt16)equips.Count);
        for(int i = 0; i < equips.Count; i++)
        {
            ((item)equips[i]).encode(byteArray);
        }
    	byteArray.Write(iopenid);
    }

    public void decode(ByteArray byteArray)
    {
        basic_data.decode(byteArray);
        int CountOfequips = byteArray.read_uint16();
        item[] ArrayOfequips = new item[CountOfequips];
        for(int i = 0; i < CountOfequips; i++)
        {
            ArrayOfequips[i] = new item();
            ((item)ArrayOfequips[i]).decode(byteArray);
        }
        equips.Clear();
        equips.AddRange(ArrayOfequips);
        iopenid = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_create_role);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_create_role();
    }
}

public class notify_create_role_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_create_role_result;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_create_role_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_create_role_result();
    }
}

public class req_enter_game : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_enter_game;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_enter_game);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_enter_game();
    }
}

public class notify_enter_game : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_enter_game;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_enter_game);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_enter_game();
    }
}

public class notify_body_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_body_data;
    }
    public ArrayList grid_vec = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)grid_vec.Count);
        for(int i = 0; i < grid_vec.Count; i++)
        {
            ((pack_grid)grid_vec[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgrid_vec = byteArray.read_uint16();
        pack_grid[] ArrayOfgrid_vec = new pack_grid[CountOfgrid_vec];
        for(int i = 0; i < CountOfgrid_vec; i++)
        {
            ArrayOfgrid_vec[i] = new pack_grid();
            ((pack_grid)ArrayOfgrid_vec[i]).decode(byteArray);
        }
        grid_vec.Clear();
        grid_vec.AddRange(ArrayOfgrid_vec);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_body_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_body_data();
    }
}

public class client_ready_for_pop_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_client_ready_for_pop_msg;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_client_ready_for_pop_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new client_ready_for_pop_msg();
    }
}

public class pair_int : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_pair_int;
    }
    public int key;
    public int value;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(key);
    	byteArray.Write(value);
    }

    public void decode(ByteArray byteArray)
    {
        key = byteArray.read_int();
        value = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_pair_int);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new pair_int();
    }
}

public class req_enter_player_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_enter_player_house;
    }
    public int type;
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_enter_player_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_enter_player_house();
    }
}

public class notify_enter_player_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_enter_player_house;
    }
    public int house_tplt_id;
    public house_info data = new house_info();
    public point enter_pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_tplt_id);
        data.encode(byteArray);

        enter_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        house_tplt_id = byteArray.read_int();
        data.decode(byteArray);
        enter_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_enter_player_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_enter_player_house();
    }
}

public class req_scene_copy_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_scene_copy_list;
    }
    public int template_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(template_id);
    }

    public void decode(ByteArray byteArray)
    {
        template_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_scene_copy_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_scene_copy_list();
    }
}

public class notify_scene_copy_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_scene_copy_list;
    }
    public int template_id;
    public ArrayList state_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(template_id);
        byteArray.Write((UInt16)state_list.Count);
        for(int i = 0; i < state_list.Count; i++)
        {
            byteArray.Write((int)state_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        template_id = byteArray.read_int();
        state_list.Clear();
        int CountOfstate_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfstate_list; i++)
        {
             state_list.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_scene_copy_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_scene_copy_list();
    }
}

public class req_enter_common_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_enter_common_scene;
    }
    public int template_id;
    public int copy_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(template_id);
    	byteArray.Write(copy_id);
    }

    public void decode(ByteArray byteArray)
    {
        template_id = byteArray.read_int();
        copy_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_enter_common_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_enter_common_scene();
    }
}

public class notify_enter_common_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_enter_common_scene;
    }
    public int template_id;
    public int copy_id;
    public point enter_pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(template_id);
    	byteArray.Write(copy_id);
        enter_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        template_id = byteArray.read_int();
        copy_id = byteArray.read_int();
        enter_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_enter_common_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_enter_common_scene();
    }
}

public class req_kick_guest : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_kick_guest;
    }
    public string target_player = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(target_player);
    }

    public void decode(ByteArray byteArray)
    {
        target_player = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_kick_guest);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_kick_guest();
    }
}

public class notify_other_player_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_other_player_data;
    }
    public player_info player = new player_info();
    public point curr_pos = new point();
    public point dest_pos = new point();
    public int type;
    public void encode(ByteArray byteArray)
    {
        player.encode(byteArray);

        curr_pos.encode(byteArray);

        dest_pos.encode(byteArray);

    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        player.decode(byteArray);
        curr_pos.decode(byteArray);
        dest_pos.decode(byteArray);
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_other_player_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_other_player_data();
    }
}

public class notify_other_player_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_other_player_info;
    }
    public player_info player = new player_info();
    public void encode(ByteArray byteArray)
    {
        player.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        player.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_other_player_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_other_player_info();
    }
}

public class req_other_player_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_other_player_info;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_other_player_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_other_player_info();
    }
}

public class notify_player_leave_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_leave_scene;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_leave_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_leave_scene();
    }
}

public class req_logout : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_logout;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_logout);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_logout();
    }
}

public class notify_player_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_data;
    }
    public player_basic_data basic_data = new player_basic_data();
    public void encode(ByteArray byteArray)
    {
        basic_data.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        basic_data.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_data();
    }
}

public class req_start_walk : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_walk;
    }
    public point curr_pos = new point();
    public point dest_pos = new point();
    public void encode(ByteArray byteArray)
    {
        curr_pos.encode(byteArray);

        dest_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        curr_pos.decode(byteArray);
        dest_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_walk);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_walk();
    }
}

public class notify_start_walk : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_walk;
    }
    public string account = "";
    public point curr_pos = new point();
    public point dest_pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        curr_pos.encode(byteArray);

        dest_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        curr_pos.decode(byteArray);
        dest_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_walk);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_walk();
    }
}

public class req_stop_walk : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_stop_walk;
    }
    public point pos = new point();
    public void encode(ByteArray byteArray)
    {
        pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_stop_walk);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_stop_walk();
    }
}

public class notify_stop_walk : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_stop_walk;
    }
    public string account = "";
    public point pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_stop_walk);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_stop_walk();
    }
}

public class req_sync_walk_type : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_sync_walk_type;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_sync_walk_type);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_sync_walk_type();
    }
}

public class notify_sync_walk_type : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sync_walk_type;
    }
    public string account = "";
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sync_walk_type);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sync_walk_type();
    }
}

public class req_sync_position : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_sync_position;
    }
    public point pos = new point();
    public void encode(ByteArray byteArray)
    {
        pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_sync_position);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_sync_position();
    }
}

public class req_walk_for_use_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_walk_for_use_furniture;
    }
    public point curr_pos = new point();
    public point dest_pos = new point();
    public UInt64 instance_id;
    public int function_id;
    public int furni_temp_id;
    public int status;
    public void encode(ByteArray byteArray)
    {
        curr_pos.encode(byteArray);

        dest_pos.encode(byteArray);

    	byteArray.Write(instance_id);
    	byteArray.Write(function_id);
    	byteArray.Write(furni_temp_id);
    	byteArray.Write(status);
    }

    public void decode(ByteArray byteArray)
    {
        curr_pos.decode(byteArray);
        dest_pos.decode(byteArray);
        instance_id = byteArray.read_uint64();
        function_id = byteArray.read_int();
        furni_temp_id = byteArray.read_int();
        status = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_walk_for_use_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_walk_for_use_furniture();
    }
}

public class player_basic_information : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_basic_information;
    }
    public string account = "";
    public string imageurl = "";
    public string nickname = "";
    public int is_yellow_vip;
    public int is_yellow_year_vip;
    public int yellow_vip_level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(imageurl);
    	byteArray.Write(nickname);
    	byteArray.Write(is_yellow_vip);
    	byteArray.Write(is_yellow_year_vip);
    	byteArray.Write(yellow_vip_level);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        imageurl = byteArray.read_string();
        nickname = byteArray.read_string();
        is_yellow_vip = byteArray.read_int();
        is_yellow_year_vip = byteArray.read_int();
        yellow_vip_level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_basic_information);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_basic_information();
    }
}

public class friend_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_friend_item;
    }
    public string account = "";
    public UInt64 house_id;
    public int house_level;
    public int intimate;
    public int crop_event;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(house_id);
    	byteArray.Write(house_level);
    	byteArray.Write(intimate);
    	byteArray.Write(crop_event);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        house_id = byteArray.read_uint64();
        house_level = byteArray.read_int();
        intimate = byteArray.read_int();
        crop_event = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_friend_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new friend_item();
    }
}

public class req_friend_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_friend_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_friend_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_friend_list();
    }
}

public class notify_player_friend_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_friend_list;
    }
    public ArrayList friend_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)friend_list.Count);
        for(int i = 0; i < friend_list.Count; i++)
        {
            ((friend_item)friend_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOffriend_list = byteArray.read_uint16();
        friend_item[] ArrayOffriend_list = new friend_item[CountOffriend_list];
        for(int i = 0; i < CountOffriend_list; i++)
        {
            ArrayOffriend_list[i] = new friend_item();
            ((friend_item)ArrayOffriend_list[i]).decode(byteArray);
        }
        friend_list.Clear();
        friend_list.AddRange(ArrayOffriend_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_friend_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_friend_list();
    }
}

public class req_invite_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_invite_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_invite_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_invite_list();
    }
}

public class notify_invite_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_invite_list;
    }
    public ArrayList friend_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)friend_list.Count);
        for(int i = 0; i < friend_list.Count; i++)
        {
            ((friend_item)friend_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOffriend_list = byteArray.read_uint16();
        friend_item[] ArrayOffriend_list = new friend_item[CountOffriend_list];
        for(int i = 0; i < CountOffriend_list; i++)
        {
            ArrayOffriend_list[i] = new friend_item();
            ((friend_item)ArrayOffriend_list[i]).decode(byteArray);
        }
        friend_list.Clear();
        friend_list.AddRange(ArrayOffriend_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_invite_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_invite_list();
    }
}

public class req_chat_around : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_chat_around;
    }
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_chat_around);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_chat_around();
    }
}

public class notify_chat_around : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_chat_around;
    }
    public string account = "";
    public string player_name = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(player_name);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        player_name = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_chat_around);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_chat_around();
    }
}

public class req_chat_tell : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_chat_tell;
    }
    public string target_player = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(target_player);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        target_player = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_chat_tell);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_chat_tell();
    }
}

public class notify_chat_tell : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_chat_tell;
    }
    public string speaker = "";
    public string speaker_name = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(speaker);
    	byteArray.Write(speaker_name);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        speaker = byteArray.read_string();
        speaker_name = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_chat_tell);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_chat_tell();
    }
}

public class req_chat_world : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_chat_world;
    }
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_chat_world);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_chat_world();
    }
}

public class notify_chat_world : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_chat_world;
    }
    public string account = "";
    public string player_name = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(player_name);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        player_name = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_chat_world);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_chat_world();
    }
}

public class notify_house_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_data;
    }
    public house_info data = new house_info();
    public void encode(ByteArray byteArray)
    {
        data.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        data.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_data();
    }
}

public class furniture_place_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_furniture_place_info;
    }
    public UInt64 instance_id;
    public int x;
    public int z;
    public float height;
    public int floor;
    public int face;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(instance_id);
    	byteArray.Write(x);
    	byteArray.Write(z);
    	byteArray.Write(height);
    	byteArray.Write(floor);
    	byteArray.Write(face);
    }

    public void decode(ByteArray byteArray)
    {
        instance_id = byteArray.read_uint64();
        x = byteArray.read_int();
        z = byteArray.read_int();
        height = byteArray.read_float();
        floor = byteArray.read_int();
        face = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_furniture_place_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new furniture_place_info();
    }
}

public class req_change_furnitures : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_change_furnitures;
    }
    public ArrayList recovery_furnitures = new ArrayList();
    public ArrayList placed_furnitures = new ArrayList();
    public ArrayList move_furnitures = new ArrayList();
    public ArrayList buy_goods_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)recovery_furnitures.Count);
        for(int i = 0; i < recovery_furnitures.Count; i++)
        {
            byteArray.Write((UInt64)recovery_furnitures[i]);
        }
        byteArray.Write((UInt16)placed_furnitures.Count);
        for(int i = 0; i < placed_furnitures.Count; i++)
        {
            ((furniture_place_info)placed_furnitures[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)move_furnitures.Count);
        for(int i = 0; i < move_furnitures.Count; i++)
        {
            ((furniture_place_info)move_furnitures[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)buy_goods_list.Count);
        for(int i = 0; i < buy_goods_list.Count; i++)
        {
            ((furniture_goods_data)buy_goods_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        recovery_furnitures.Clear();
        int CountOfrecovery_furnitures = byteArray.read_uint16();
        for(int i = 0; i < CountOfrecovery_furnitures; i++)
        {
             recovery_furnitures.Add(byteArray.read_uint64());
        }
        int CountOfplaced_furnitures = byteArray.read_uint16();
        furniture_place_info[] ArrayOfplaced_furnitures = new furniture_place_info[CountOfplaced_furnitures];
        for(int i = 0; i < CountOfplaced_furnitures; i++)
        {
            ArrayOfplaced_furnitures[i] = new furniture_place_info();
            ((furniture_place_info)ArrayOfplaced_furnitures[i]).decode(byteArray);
        }
        placed_furnitures.Clear();
        placed_furnitures.AddRange(ArrayOfplaced_furnitures);
        int CountOfmove_furnitures = byteArray.read_uint16();
        furniture_place_info[] ArrayOfmove_furnitures = new furniture_place_info[CountOfmove_furnitures];
        for(int i = 0; i < CountOfmove_furnitures; i++)
        {
            ArrayOfmove_furnitures[i] = new furniture_place_info();
            ((furniture_place_info)ArrayOfmove_furnitures[i]).decode(byteArray);
        }
        move_furnitures.Clear();
        move_furnitures.AddRange(ArrayOfmove_furnitures);
        int CountOfbuy_goods_list = byteArray.read_uint16();
        furniture_goods_data[] ArrayOfbuy_goods_list = new furniture_goods_data[CountOfbuy_goods_list];
        for(int i = 0; i < CountOfbuy_goods_list; i++)
        {
            ArrayOfbuy_goods_list[i] = new furniture_goods_data();
            ((furniture_goods_data)ArrayOfbuy_goods_list[i]).decode(byteArray);
        }
        buy_goods_list.Clear();
        buy_goods_list.AddRange(ArrayOfbuy_goods_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_change_furnitures);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_change_furnitures();
    }
}

public class notify_change_furnitures_fail : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_furnitures_fail;
    }
    public int error_code;
    public ArrayList unfind_bag_items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(error_code);
        byteArray.Write((UInt16)unfind_bag_items.Count);
        for(int i = 0; i < unfind_bag_items.Count; i++)
        {
            byteArray.Write((UInt64)unfind_bag_items[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        error_code = byteArray.read_int();
        unfind_bag_items.Clear();
        int CountOfunfind_bag_items = byteArray.read_uint16();
        for(int i = 0; i < CountOfunfind_bag_items; i++)
        {
             unfind_bag_items.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_furnitures_fail);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_furnitures_fail();
    }
}

public class notify_change_furnitures : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_furnitures;
    }
    public ArrayList del_furnitures = new ArrayList();
    public ArrayList add_furnitures = new ArrayList();
    public ArrayList move_furnitures = new ArrayList();
    public ArrayList add_items = new ArrayList();
    public ArrayList del_items = new ArrayList();
    public int decoration;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)del_furnitures.Count);
        for(int i = 0; i < del_furnitures.Count; i++)
        {
            byteArray.Write((UInt64)del_furnitures[i]);
        }
        byteArray.Write((UInt16)add_furnitures.Count);
        for(int i = 0; i < add_furnitures.Count; i++)
        {
            ((house_furniture)add_furnitures[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)move_furnitures.Count);
        for(int i = 0; i < move_furnitures.Count; i++)
        {
            ((house_furniture)move_furnitures[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)add_items.Count);
        for(int i = 0; i < add_items.Count; i++)
        {
            ((pack_grid)add_items[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)del_items.Count);
        for(int i = 0; i < del_items.Count; i++)
        {
            byteArray.Write((UInt64)del_items[i]);
        }
    	byteArray.Write(decoration);
    }

    public void decode(ByteArray byteArray)
    {
        del_furnitures.Clear();
        int CountOfdel_furnitures = byteArray.read_uint16();
        for(int i = 0; i < CountOfdel_furnitures; i++)
        {
             del_furnitures.Add(byteArray.read_uint64());
        }
        int CountOfadd_furnitures = byteArray.read_uint16();
        house_furniture[] ArrayOfadd_furnitures = new house_furniture[CountOfadd_furnitures];
        for(int i = 0; i < CountOfadd_furnitures; i++)
        {
            ArrayOfadd_furnitures[i] = new house_furniture();
            ((house_furniture)ArrayOfadd_furnitures[i]).decode(byteArray);
        }
        add_furnitures.Clear();
        add_furnitures.AddRange(ArrayOfadd_furnitures);
        int CountOfmove_furnitures = byteArray.read_uint16();
        house_furniture[] ArrayOfmove_furnitures = new house_furniture[CountOfmove_furnitures];
        for(int i = 0; i < CountOfmove_furnitures; i++)
        {
            ArrayOfmove_furnitures[i] = new house_furniture();
            ((house_furniture)ArrayOfmove_furnitures[i]).decode(byteArray);
        }
        move_furnitures.Clear();
        move_furnitures.AddRange(ArrayOfmove_furnitures);
        int CountOfadd_items = byteArray.read_uint16();
        pack_grid[] ArrayOfadd_items = new pack_grid[CountOfadd_items];
        for(int i = 0; i < CountOfadd_items; i++)
        {
            ArrayOfadd_items[i] = new pack_grid();
            ((pack_grid)ArrayOfadd_items[i]).decode(byteArray);
        }
        add_items.Clear();
        add_items.AddRange(ArrayOfadd_items);
        del_items.Clear();
        int CountOfdel_items = byteArray.read_uint16();
        for(int i = 0; i < CountOfdel_items; i++)
        {
             del_items.Add(byteArray.read_uint64());
        }
        decoration = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_furnitures);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_furnitures();
    }
}

public class req_start_edit_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_edit_house;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_edit_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_edit_house();
    }
}

public class notify_start_edit_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_edit_house;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_edit_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_edit_house();
    }
}

public class req_end_edit_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_end_edit_house;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_end_edit_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_end_edit_house();
    }
}

public class notify_end_edit_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_end_edit_house;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_end_edit_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_end_edit_house();
    }
}

public class req_set_house_welcome_words : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_set_house_welcome_words;
    }
    public string words = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(words);
    }

    public void decode(ByteArray byteArray)
    {
        words = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_set_house_welcome_words);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_set_house_welcome_words();
    }
}

public class notify_set_house_welcome_words : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_set_house_welcome_words;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_set_house_welcome_words);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_set_house_welcome_words();
    }
}

public class req_set_house_permission : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_set_house_permission;
    }
    public int house_permission;
    public int furniture_permission;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_permission);
    	byteArray.Write(furniture_permission);
    }

    public void decode(ByteArray byteArray)
    {
        house_permission = byteArray.read_int();
        furniture_permission = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_set_house_permission);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_set_house_permission();
    }
}

public class notify_set_house_permission : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_set_house_permission;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_set_house_permission);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_set_house_permission();
    }
}

public class req_clear_house_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_clear_house_log;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_clear_house_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_clear_house_log();
    }
}

public class notify_clear_house_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_clear_house_log;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_clear_house_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_clear_house_log();
    }
}

public class notify_start_use_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_use_furniture;
    }
    public string account = "";
    public int position_index;
    public UInt64 instance_id;
    public int function_id;
    public point walk_pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(position_index);
    	byteArray.Write(instance_id);
    	byteArray.Write(function_id);
        walk_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        position_index = byteArray.read_int();
        instance_id = byteArray.read_uint64();
        function_id = byteArray.read_int();
        walk_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_use_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_use_furniture();
    }
}

public class req_stop_use_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_stop_use_furniture;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_stop_use_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_stop_use_furniture();
    }
}

public class notify_stop_use_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_stop_use_furniture;
    }
    public string account = "";
    public int position_index;
    public UInt64 instance_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(position_index);
    	byteArray.Write(instance_id);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        position_index = byteArray.read_int();
        instance_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_stop_use_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_stop_use_furniture();
    }
}

public class notify_change_furniture_status : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_furniture_status;
    }
    public string account = "";
    public UInt64 instance_id;
    public int function_id;
    public int new_status;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(instance_id);
    	byteArray.Write(function_id);
    	byteArray.Write(new_status);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        instance_id = byteArray.read_uint64();
        function_id = byteArray.read_int();
        new_status = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_furniture_status);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_furniture_status();
    }
}

public class req_swap_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_swap_item;
    }
    public int type;
    public int index1;
    public int index2;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(index1);
    	byteArray.Write(index2);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        index1 = byteArray.read_int();
        index2 = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_swap_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_swap_item();
    }
}

public class req_use_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_use_item;
    }
    public UInt64 item_inst_id;
    public ArrayList target_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
        byteArray.Write((UInt16)target_list.Count);
        for(int i = 0; i < target_list.Count; i++)
        {
            byteArray.Write((string)target_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
        target_list.Clear();
        int CountOftarget_list = byteArray.read_uint16();
        for(int i = 0; i < CountOftarget_list; i++)
        {
             target_list.Add(byteArray.read_string());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_use_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_use_item();
    }
}

public class notify_use_item_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_use_item_result;
    }
    public UInt64 item_inst_id;
    public int item_tplt_id;
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    	byteArray.Write(item_tplt_id);
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
        item_tplt_id = byteArray.read_int();
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_use_item_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_use_item_result();
    }
}

public class req_move_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_move_item;
    }
    public int pack1_type;
    public int index1;
    public int pack2_type;
    public int index2;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pack1_type);
    	byteArray.Write(index1);
    	byteArray.Write(pack2_type);
    	byteArray.Write(index2);
    }

    public void decode(ByteArray byteArray)
    {
        pack1_type = byteArray.read_int();
        index1 = byteArray.read_int();
        pack2_type = byteArray.read_int();
        index2 = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_move_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_move_item();
    }
}

public class req_delete_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_delete_item;
    }
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_delete_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_delete_item();
    }
}

public class req_split_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_split_item;
    }
    public int type;
    public int src_gindex;
    public int target_gindex;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(src_gindex);
    	byteArray.Write(target_gindex);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        src_gindex = byteArray.read_int();
        target_gindex = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_split_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_split_item();
    }
}

public class req_resize_player_pack : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_resize_player_pack;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_resize_player_pack);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_resize_player_pack();
    }
}

public class req_extend_aging_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_extend_aging_item;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_extend_aging_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_extend_aging_item();
    }
}

public class notify_extend_aging_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_extend_aging_item;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_extend_aging_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_extend_aging_item();
    }
}

public class notiy_use_item_by_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notiy_use_item_by_scene;
    }
    public int item_id;
    public UInt64 item_inst_id;
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    	byteArray.Write(item_inst_id);
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
        item_inst_id = byteArray.read_uint64();
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notiy_use_item_by_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notiy_use_item_by_scene();
    }
}

public class notify_sys_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sys_msg;
    }
    public int code;
    public ArrayList Params = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(code);
        byteArray.Write((UInt16)Params.Count);
        for(int i = 0; i < Params.Count; i++)
        {
            byteArray.Write((string)Params[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        code = byteArray.read_int();
        Params.Clear();
        int CountOfParams = byteArray.read_uint16();
        for(int i = 0; i < CountOfParams; i++)
        {
             Params.Add(byteArray.read_string());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sys_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sys_msg();
    }
}

public class notify_sys_broadcast : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sys_broadcast;
    }
    public UInt64 id;
    public int type;
    public string content = "";
    public int play_times;
    public int priority;
    public int show_seconds;
    public stime start_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(type);
    	byteArray.Write(content);
    	byteArray.Write(play_times);
    	byteArray.Write(priority);
    	byteArray.Write(show_seconds);
        start_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_uint64();
        type = byteArray.read_int();
        content = byteArray.read_string();
        play_times = byteArray.read_int();
        priority = byteArray.read_int();
        show_seconds = byteArray.read_int();
        start_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sys_broadcast);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sys_broadcast();
    }
}

public class req_fixed_broadcast : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_fixed_broadcast;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_fixed_broadcast);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_fixed_broadcast();
    }
}

public class notify_del_broadcast : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_del_broadcast;
    }
    public int type;
    public UInt64 id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_del_broadcast);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_del_broadcast();
    }
}

public class notify_gm_permission : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_gm_permission;
    }
    public string account = "";
    public int enable;
    public int money;
    public int item;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(enable);
    	byteArray.Write(money);
    	byteArray.Write(item);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        enable = byteArray.read_int();
        money = byteArray.read_int();
        item = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_gm_permission);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_gm_permission();
    }
}

public class req_gm_command : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_gm_command;
    }
    public string command = "";
    public ArrayList Params = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(command);
        byteArray.Write((UInt16)Params.Count);
        for(int i = 0; i < Params.Count; i++)
        {
            byteArray.Write((string)Params[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        command = byteArray.read_string();
        Params.Clear();
        int CountOfParams = byteArray.read_uint16();
        for(int i = 0; i < CountOfParams; i++)
        {
             Params.Add(byteArray.read_string());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_gm_command);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_gm_command();
    }
}

public class notify_npc_close_dialog : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_npc_close_dialog;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_npc_close_dialog);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_npc_close_dialog();
    }
}

public class req_npc_command : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_npc_command;
    }
    public int npc_id;
    public string function_name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(npc_id);
    	byteArray.Write(function_name);
    }

    public void decode(ByteArray byteArray)
    {
        npc_id = byteArray.read_int();
        function_name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_npc_command);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_npc_command();
    }
}

public class button : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_button;
    }
    public string name = "";
    public string function_name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(name);
    	byteArray.Write(function_name);
    }

    public void decode(ByteArray byteArray)
    {
        name = byteArray.read_string();
        function_name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_button);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new button();
    }
}

public class notify_npc_open_dialog : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_npc_open_dialog;
    }
    public int npc_id;
    public string talk = "";
    public ArrayList button_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(npc_id);
    	byteArray.Write(talk);
        byteArray.Write((UInt16)button_list.Count);
        for(int i = 0; i < button_list.Count; i++)
        {
            ((button)button_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        npc_id = byteArray.read_int();
        talk = byteArray.read_string();
        int CountOfbutton_list = byteArray.read_uint16();
        button[] ArrayOfbutton_list = new button[CountOfbutton_list];
        for(int i = 0; i < CountOfbutton_list; i++)
        {
            ArrayOfbutton_list[i] = new button();
            ((button)ArrayOfbutton_list[i]).decode(byteArray);
        }
        button_list.Clear();
        button_list.AddRange(ArrayOfbutton_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_npc_open_dialog);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_npc_open_dialog();
    }
}

public class req_employ_waiter_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_employ_waiter_data;
    }
    public UInt64 waiter_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(waiter_id);
    }

    public void decode(ByteArray byteArray)
    {
        waiter_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_employ_waiter_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_employ_waiter_data();
    }
}

public class req_up_waiter_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_up_waiter_data;
    }
    public UInt64 waiter_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(waiter_id);
    }

    public void decode(ByteArray byteArray)
    {
        waiter_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_up_waiter_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_up_waiter_data();
    }
}

public class req_query_waiter_id : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_query_waiter_id;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_query_waiter_id);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_query_waiter_id();
    }
}

public class notify_query_waiter_id : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_query_waiter_id;
    }
    public UInt64 waiter_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(waiter_id);
    }

    public void decode(ByteArray byteArray)
    {
        waiter_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_query_waiter_id);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_query_waiter_id();
    }
}

public class waiter_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_waiter_info;
    }
    public int waiter_type;
    public UInt64 waiter_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(waiter_type);
    	byteArray.Write(waiter_id);
    }

    public void decode(ByteArray byteArray)
    {
        waiter_type = byteArray.read_int();
        waiter_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_waiter_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new waiter_info();
    }
}

public class notify_employ_state : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_employ_state;
    }
    public UInt64 waiter_id;
    public ArrayList waiter_up = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(waiter_id);
        byteArray.Write((UInt16)waiter_up.Count);
        for(int i = 0; i < waiter_up.Count; i++)
        {
            ((waiter_info)waiter_up[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        waiter_id = byteArray.read_uint64();
        int CountOfwaiter_up = byteArray.read_uint16();
        waiter_info[] ArrayOfwaiter_up = new waiter_info[CountOfwaiter_up];
        for(int i = 0; i < CountOfwaiter_up; i++)
        {
            ArrayOfwaiter_up[i] = new waiter_info();
            ((waiter_info)ArrayOfwaiter_up[i]).decode(byteArray);
        }
        waiter_up.Clear();
        waiter_up.AddRange(ArrayOfwaiter_up);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_employ_state);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_employ_state();
    }
}

public class req_player_basic_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_basic_data;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_basic_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_basic_data();
    }
}

public class notify_player_basic_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_basic_data;
    }
    public player_basic_data basic_data = new player_basic_data();
    public void encode(ByteArray byteArray)
    {
        basic_data.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        basic_data.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_basic_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_basic_data();
    }
}

public class req_start_body_action : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_body_action;
    }
    public string action_status = "";
    public string action_type = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(action_status);
    	byteArray.Write(action_type);
    }

    public void decode(ByteArray byteArray)
    {
        action_status = byteArray.read_string();
        action_type = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_body_action);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_body_action();
    }
}

public class notify_start_body_action : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_body_action;
    }
    public string account = "";
    public string action_status = "";
    public string action_type = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(action_status);
    	byteArray.Write(action_type);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        action_status = byteArray.read_string();
        action_type = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_body_action);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_body_action();
    }
}

public class req_play_animation : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_play_animation;
    }
    public string target_account = "";
    public int loop;
    public string ani = "";
    public string action = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(target_account);
    	byteArray.Write(loop);
    	byteArray.Write(ani);
    	byteArray.Write(action);
    }

    public void decode(ByteArray byteArray)
    {
        target_account = byteArray.read_string();
        loop = byteArray.read_int();
        ani = byteArray.read_string();
        action = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_play_animation);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_play_animation();
    }
}

public class notify_play_animation : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_play_animation;
    }
    public string player_account = "";
    public string target_account = "";
    public int loop;
    public string ani = "";
    public string action = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(player_account);
    	byteArray.Write(target_account);
    	byteArray.Write(loop);
    	byteArray.Write(ani);
    	byteArray.Write(action);
    }

    public void decode(ByteArray byteArray)
    {
        player_account = byteArray.read_string();
        target_account = byteArray.read_string();
        loop = byteArray.read_int();
        ani = byteArray.read_string();
        action = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_play_animation);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_play_animation();
    }
}

public class req_end_body_action : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_end_body_action;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_end_body_action);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_end_body_action();
    }
}

public class notify_end_body_action : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_end_body_action;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_end_body_action);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_end_body_action();
    }
}

public class req_sync_body_state : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_sync_body_state;
    }
    public int body_state;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(body_state);
    }

    public void decode(ByteArray byteArray)
    {
        body_state = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_sync_body_state);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_sync_body_state();
    }
}

public class notify_other_body_state : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_other_body_state;
    }
    public string other_account = "";
    public int body_state;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(other_account);
    	byteArray.Write(body_state);
    }

    public void decode(ByteArray byteArray)
    {
        other_account = byteArray.read_string();
        body_state = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_other_body_state);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_other_body_state();
    }
}

public class req_start_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_change_looks;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_change_looks();
    }
}

public class notify_start_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_change_looks;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_change_looks();
    }
}

public class req_cancel_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_cancel_change_looks;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_cancel_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_cancel_change_looks();
    }
}

public class req_end_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_end_change_looks;
    }
    public int new_hair;
    public int new_hair_color;
    public int new_face;
    public int new_skin_color;
    public int new_beard;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(new_hair);
    	byteArray.Write(new_hair_color);
    	byteArray.Write(new_face);
    	byteArray.Write(new_skin_color);
    	byteArray.Write(new_beard);
    }

    public void decode(ByteArray byteArray)
    {
        new_hair = byteArray.read_int();
        new_hair_color = byteArray.read_int();
        new_face = byteArray.read_int();
        new_skin_color = byteArray.read_int();
        new_beard = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_end_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_end_change_looks();
    }
}

public class notify_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_looks;
    }
    public string account = "";
    public int new_hair;
    public int new_hair_color;
    public int new_face;
    public int new_skin_color;
    public int new_beard;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(new_hair);
    	byteArray.Write(new_hair_color);
    	byteArray.Write(new_face);
    	byteArray.Write(new_skin_color);
    	byteArray.Write(new_beard);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        new_hair = byteArray.read_int();
        new_hair_color = byteArray.read_int();
        new_face = byteArray.read_int();
        new_skin_color = byteArray.read_int();
        new_beard = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_looks();
    }
}

public class notify_end_change_looks : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_end_change_looks;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_end_change_looks);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_end_change_looks();
    }
}

public class req_start_change_dress : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_change_dress;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_change_dress);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_change_dress();
    }
}

public class notify_start_change_dress : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_change_dress;
    }
    public player_basic_data owner = new player_basic_data();
    public player_basic_data lover = new player_basic_data();
    public void encode(ByteArray byteArray)
    {
        owner.encode(byteArray);

        lover.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        owner.decode(byteArray);
        lover.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_change_dress);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_change_dress();
    }
}

public class req_change_dress : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_change_dress;
    }
    public int type;
    public ArrayList goods_list = new ArrayList();
    public ArrayList lover_goods_list = new ArrayList();
    public ArrayList item_list = new ArrayList();
    public ArrayList putoff_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
        byteArray.Write((UInt16)goods_list.Count);
        for(int i = 0; i < goods_list.Count; i++)
        {
            byteArray.Write((int)goods_list[i]);
        }
        byteArray.Write((UInt16)lover_goods_list.Count);
        for(int i = 0; i < lover_goods_list.Count; i++)
        {
            byteArray.Write((int)lover_goods_list[i]);
        }
        byteArray.Write((UInt16)item_list.Count);
        for(int i = 0; i < item_list.Count; i++)
        {
            ((item)item_list[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)putoff_list.Count);
        for(int i = 0; i < putoff_list.Count; i++)
        {
            byteArray.Write((UInt64)putoff_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        goods_list.Clear();
        int CountOfgoods_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfgoods_list; i++)
        {
             goods_list.Add(byteArray.read_int());
        }
        lover_goods_list.Clear();
        int CountOflover_goods_list = byteArray.read_uint16();
        for(int i = 0; i < CountOflover_goods_list; i++)
        {
             lover_goods_list.Add(byteArray.read_int());
        }
        int CountOfitem_list = byteArray.read_uint16();
        item[] ArrayOfitem_list = new item[CountOfitem_list];
        for(int i = 0; i < CountOfitem_list; i++)
        {
            ArrayOfitem_list[i] = new item();
            ((item)ArrayOfitem_list[i]).decode(byteArray);
        }
        item_list.Clear();
        item_list.AddRange(ArrayOfitem_list);
        putoff_list.Clear();
        int CountOfputoff_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfputoff_list; i++)
        {
             putoff_list.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_change_dress);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_change_dress();
    }
}

public class notify_change_dress : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_dress;
    }
    public int type;
    public ArrayList item_list = new ArrayList();
    public ArrayList body = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
        byteArray.Write((UInt16)item_list.Count);
        for(int i = 0; i < item_list.Count; i++)
        {
            ((item)item_list[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)body.Count);
        for(int i = 0; i < body.Count; i++)
        {
            ((pack_grid)body[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        int CountOfitem_list = byteArray.read_uint16();
        item[] ArrayOfitem_list = new item[CountOfitem_list];
        for(int i = 0; i < CountOfitem_list; i++)
        {
            ArrayOfitem_list[i] = new item();
            ((item)ArrayOfitem_list[i]).decode(byteArray);
        }
        item_list.Clear();
        item_list.AddRange(ArrayOfitem_list);
        int CountOfbody = byteArray.read_uint16();
        pack_grid[] ArrayOfbody = new pack_grid[CountOfbody];
        for(int i = 0; i < CountOfbody; i++)
        {
            ArrayOfbody[i] = new pack_grid();
            ((pack_grid)ArrayOfbody[i]).decode(byteArray);
        }
        body.Clear();
        body.AddRange(ArrayOfbody);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_dress);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_dress();
    }
}

public class notify_around_change_dress : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_around_change_dress;
    }
    public string account = "";
    public ArrayList body = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        byteArray.Write((UInt16)body.Count);
        for(int i = 0; i < body.Count; i++)
        {
            ((pack_grid)body[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        int CountOfbody = byteArray.read_uint16();
        pack_grid[] ArrayOfbody = new pack_grid[CountOfbody];
        for(int i = 0; i < CountOfbody; i++)
        {
            ArrayOfbody[i] = new pack_grid();
            ((pack_grid)ArrayOfbody[i]).decode(byteArray);
        }
        body.Clear();
        body.AddRange(ArrayOfbody);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_around_change_dress);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_around_change_dress();
    }
}

public class req_invite_someone : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_invite_someone;
    }
    public ArrayList target_list = new ArrayList();
    public int type;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)target_list.Count);
        for(int i = 0; i < target_list.Count; i++)
        {
            byteArray.Write((string)target_list[i]);
        }
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        target_list.Clear();
        int CountOftarget_list = byteArray.read_uint16();
        for(int i = 0; i < CountOftarget_list; i++)
        {
             target_list.Add(byteArray.read_string());
        }
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_invite_someone);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_invite_someone();
    }
}

public class notify_invitation : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_invitation;
    }
    public string invitor = "";
    public string invitor_name = "";
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(invitor);
    	byteArray.Write(invitor_name);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        invitor = byteArray.read_string();
        invitor_name = byteArray.read_string();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_invitation);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_invitation();
    }
}

public class req_agree_invitation : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_agree_invitation;
    }
    public string invitor = "";
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(invitor);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        invitor = byteArray.read_string();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_agree_invitation);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_agree_invitation();
    }
}

public class goods_atom : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_goods_atom;
    }
    public int goods_id;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(goods_id);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        goods_id = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_goods_atom);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new goods_atom();
    }
}

public class req_buy_sys_shop_goods : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_buy_sys_shop_goods;
    }
    public int goods_id;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(goods_id);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        goods_id = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_buy_sys_shop_goods);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_buy_sys_shop_goods();
    }
}

public class notify_buy_sys_shop_goods : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_buy_sys_shop_goods;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_buy_sys_shop_goods);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_buy_sys_shop_goods();
    }
}

public class req_mutli_buy_sys_shop_goods : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mutli_buy_sys_shop_goods;
    }
    public ArrayList goods_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)goods_list.Count);
        for(int i = 0; i < goods_list.Count; i++)
        {
            ((goods_atom)goods_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgoods_list = byteArray.read_uint16();
        goods_atom[] ArrayOfgoods_list = new goods_atom[CountOfgoods_list];
        for(int i = 0; i < CountOfgoods_list; i++)
        {
            ArrayOfgoods_list[i] = new goods_atom();
            ((goods_atom)ArrayOfgoods_list[i]).decode(byteArray);
        }
        goods_list.Clear();
        goods_list.AddRange(ArrayOfgoods_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mutli_buy_sys_shop_goods);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mutli_buy_sys_shop_goods();
    }
}

public class flag_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_flag_info;
    }
    public string key = "";
    public int value;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(key);
    	byteArray.Write(value);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        key = byteArray.read_string();
        value = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_flag_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new flag_info();
    }
}

public class task_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_task_info;
    }
    public UInt64 inst_id;
    public int task_id;
    public int type;
    public stime give_date = new stime();
    public stime complete_date = new stime();
    public stime reward_date = new stime();
    public ArrayList info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(task_id);
    	byteArray.Write(type);
        give_date.encode(byteArray);

        complete_date.encode(byteArray);

        reward_date.encode(byteArray);

        byteArray.Write((UInt16)info.Count);
        for(int i = 0; i < info.Count; i++)
        {
            ((flag_info)info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        task_id = byteArray.read_int();
        type = byteArray.read_int();
        give_date.decode(byteArray);
        complete_date.decode(byteArray);
        reward_date.decode(byteArray);
        int CountOfinfo = byteArray.read_uint16();
        flag_info[] ArrayOfinfo = new flag_info[CountOfinfo];
        for(int i = 0; i < CountOfinfo; i++)
        {
            ArrayOfinfo[i] = new flag_info();
            ((flag_info)ArrayOfinfo[i]).decode(byteArray);
        }
        info.Clear();
        info.AddRange(ArrayOfinfo);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_task_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new task_info();
    }
}

public class notify_task_flag : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_task_flag;
    }
    public UInt64 inst_id;
    public ArrayList info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
        byteArray.Write((UInt16)info.Count);
        for(int i = 0; i < info.Count; i++)
        {
            ((flag_info)info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        int CountOfinfo = byteArray.read_uint16();
        flag_info[] ArrayOfinfo = new flag_info[CountOfinfo];
        for(int i = 0; i < CountOfinfo; i++)
        {
            ArrayOfinfo[i] = new flag_info();
            ((flag_info)ArrayOfinfo[i]).decode(byteArray);
        }
        info.Clear();
        info.AddRange(ArrayOfinfo);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_task_flag);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_task_flag();
    }
}

public class notify_task_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_task_list;
    }
    public ArrayList tasks = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)tasks.Count);
        for(int i = 0; i < tasks.Count; i++)
        {
            ((task_info)tasks[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOftasks = byteArray.read_uint16();
        task_info[] ArrayOftasks = new task_info[CountOftasks];
        for(int i = 0; i < CountOftasks; i++)
        {
            ArrayOftasks[i] = new task_info();
            ((task_info)ArrayOftasks[i]).decode(byteArray);
        }
        tasks.Clear();
        tasks.AddRange(ArrayOftasks);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_task_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_task_list();
    }
}

public class notify_add_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_task;
    }
    public ArrayList tasks = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)tasks.Count);
        for(int i = 0; i < tasks.Count; i++)
        {
            ((task_info)tasks[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOftasks = byteArray.read_uint16();
        task_info[] ArrayOftasks = new task_info[CountOftasks];
        for(int i = 0; i < CountOftasks; i++)
        {
            ArrayOftasks[i] = new task_info();
            ((task_info)ArrayOftasks[i]).decode(byteArray);
        }
        tasks.Clear();
        tasks.AddRange(ArrayOftasks);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_task();
    }
}

public class notify_dec_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_dec_task;
    }
    public ArrayList inst_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)inst_ids.Count);
        for(int i = 0; i < inst_ids.Count; i++)
        {
            byteArray.Write((UInt64)inst_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        inst_ids.Clear();
        int CountOfinst_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOfinst_ids; i++)
        {
             inst_ids.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_dec_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_dec_task();
    }
}

public class notify_complete_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_complete_task;
    }
    public task_info info = new task_info();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_complete_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_complete_task();
    }
}

public class notify_reward_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_reward_task;
    }
    public task_info info = new task_info();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_reward_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_reward_task();
    }
}

public class req_get_task_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_task_reward;
    }
    public UInt64 inst_id;
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_task_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_task_reward();
    }
}

public class notify_get_task_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_get_task_reward;
    }
    public UInt64 inst_id;
    public int task_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(task_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        task_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_get_task_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_get_task_reward();
    }
}

public class req_change_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_change_task;
    }
    public UInt64 inst_id;
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_change_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_change_task();
    }
}

public class notify_change_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_change_task;
    }
    public UInt64 inst_id;
    public task_info info = new task_info();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_change_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_change_task();
    }
}

public class req_immediate_complete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_immediate_complete;
    }
    public UInt64 inst_id;
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_immediate_complete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_immediate_complete();
    }
}

public class req_move_camera : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_move_camera;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_move_camera);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_move_camera();
    }
}

public class req_move_player : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_move_player;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_move_player);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_move_player();
    }
}

public class req_close_windows : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_close_windows;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_close_windows);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_close_windows();
    }
}

public class ring_task_atom : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_ring_task_atom;
    }
    public Int64 inst_id;
    public int ring_count;
    public int type;
    public int content_id;
    public int rule_id;
    public stime complete_date = new stime();
    public stime due_date = new stime();
    public int is_view;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(ring_count);
    	byteArray.Write(type);
    	byteArray.Write(content_id);
    	byteArray.Write(rule_id);
        complete_date.encode(byteArray);

        due_date.encode(byteArray);

    	byteArray.Write(is_view);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
        ring_count = byteArray.read_int();
        type = byteArray.read_int();
        content_id = byteArray.read_int();
        rule_id = byteArray.read_int();
        complete_date.decode(byteArray);
        due_date.decode(byteArray);
        is_view = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_ring_task_atom);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new ring_task_atom();
    }
}

public class notify_add_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_ring_task;
    }
    public ring_task_atom task = new ring_task_atom();
    public void encode(ByteArray byteArray)
    {
        task.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        task.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_ring_task();
    }
}

public class notify_show_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_show_ring_task;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_show_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_show_ring_task();
    }
}

public class notify_delete_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_delete_ring_task;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_delete_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_delete_ring_task();
    }
}

public class req_give_up_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_give_up_ring_task;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_give_up_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_give_up_ring_task();
    }
}

public class req_stop_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_stop_ring_task;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_stop_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_stop_ring_task();
    }
}

public class notify_stop_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_stop_ring_task;
    }
    public Int64 inst_id;
    public stime due_date = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
        due_date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
        due_date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_stop_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_stop_ring_task();
    }
}

public class req_immediate_complete_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_immediate_complete_ring_task;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_immediate_complete_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_immediate_complete_ring_task();
    }
}

public class notify_complete_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_complete_ring_task;
    }
    public Int64 inst_id;
    public stime complete_date = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
        complete_date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
        complete_date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_complete_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_complete_ring_task();
    }
}

public class req_view_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_view_ring_task;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_view_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_view_ring_task();
    }
}

public class notify_view_ring_task : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_view_ring_task;
    }
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_view_ring_task);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_view_ring_task();
    }
}

public class req_ring_task_target : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_ring_task_target;
    }
    public Int64 inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_int64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_ring_task_target);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_ring_task_target();
    }
}

public class notify_ring_task_target : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_ring_task_target;
    }
    public ArrayList targets = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)targets.Count);
        for(int i = 0; i < targets.Count; i++)
        {
            byteArray.Write((int)targets[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        targets.Clear();
        int CountOftargets = byteArray.read_uint16();
        for(int i = 0; i < CountOftargets; i++)
        {
             targets.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_ring_task_target);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_ring_task_target();
    }
}

public class req_mind_quiz_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mind_quiz_count;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mind_quiz_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mind_quiz_count();
    }
}

public class notify_mind_quiz_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mind_quiz_count;
    }
    public int count;
    public int love_coin_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    	byteArray.Write(love_coin_count);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
        love_coin_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mind_quiz_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mind_quiz_count();
    }
}

public class req_start_mind_quiz : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_mind_quiz;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_mind_quiz);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_mind_quiz();
    }
}

public class notify_start_mind_quiz : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_mind_quiz;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_mind_quiz);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_mind_quiz();
    }
}

public class req_mind_quiz_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mind_quiz_reward;
    }
    public int level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(level);
    }

    public void decode(ByteArray byteArray)
    {
        level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mind_quiz_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mind_quiz_reward();
    }
}

public class notify_mind_quiz_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mind_quiz_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mind_quiz_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mind_quiz_reward();
    }
}

public class req_recharge_love_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_recharge_love_coin;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_recharge_love_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_recharge_love_coin();
    }
}

public class notify_recharge_love_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_recharge_love_coin;
    }
    public int love_coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(love_coin);
    }

    public void decode(ByteArray byteArray)
    {
        love_coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_recharge_love_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_recharge_love_coin();
    }
}

public class notify_init_love_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_init_love_coin;
    }
    public int love_coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(love_coin);
    }

    public void decode(ByteArray byteArray)
    {
        love_coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_init_love_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_init_love_coin();
    }
}

public class notify_love_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_love_coin;
    }
    public int love_coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(love_coin);
    }

    public void decode(ByteArray byteArray)
    {
        love_coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_love_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_love_coin();
    }
}

public class notify_open_recharge_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_recharge_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_recharge_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_recharge_ui();
    }
}

public class notify_open_yy_recharge_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_yy_recharge_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_yy_recharge_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_yy_recharge_ui();
    }
}

public class req_open_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_open_ui;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_open_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_open_ui();
    }
}

public class notify_open_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_ui;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_ui();
    }
}

public class req_sys_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_sys_time;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_sys_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_sys_time();
    }
}

public class notify_sys_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sys_time;
    }
    public stime sys_time = new stime();
    public void encode(ByteArray byteArray)
    {
        sys_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        sys_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sys_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sys_time();
    }
}

public class notify_wallow_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wallow_time;
    }
    public int wallow_seconds;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(wallow_seconds);
    }

    public void decode(ByteArray byteArray)
    {
        wallow_seconds = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wallow_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wallow_time();
    }
}

public class notify_player_health_status : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_health_status;
    }
    public int status;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(status);
    }

    public void decode(ByteArray byteArray)
    {
        status = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_health_status);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_health_status();
    }
}

public class notify_disease_special_event : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_disease_special_event;
    }
    public int special_event_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(special_event_id);
    }

    public void decode(ByteArray byteArray)
    {
        special_event_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_disease_special_event);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_disease_special_event();
    }
}

public class notify_show_picture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_show_picture;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_show_picture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_show_picture();
    }
}

public class req_is_active_game : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_is_active_game;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_is_active_game);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_is_active_game();
    }
}

public class notify_active_game_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_active_game_result;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_active_game_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_active_game_result();
    }
}

public class req_create_party : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_create_party;
    }
    public UInt64 house_id;
    public string house_name = "";
    public string player_name = "";
    public int type;
    public string title = "";
    public string description = "";
    public ArrayList cost_items = new ArrayList();
    public ArrayList food_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(house_name);
    	byteArray.Write(player_name);
    	byteArray.Write(type);
    	byteArray.Write(title);
    	byteArray.Write(description);
        byteArray.Write((UInt16)cost_items.Count);
        for(int i = 0; i < cost_items.Count; i++)
        {
            byteArray.Write((int)cost_items[i]);
        }
        byteArray.Write((UInt16)food_ids.Count);
        for(int i = 0; i < food_ids.Count; i++)
        {
            byteArray.Write((int)food_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        house_name = byteArray.read_string();
        player_name = byteArray.read_string();
        type = byteArray.read_int();
        title = byteArray.read_string();
        description = byteArray.read_string();
        cost_items.Clear();
        int CountOfcost_items = byteArray.read_uint16();
        for(int i = 0; i < CountOfcost_items; i++)
        {
             cost_items.Add(byteArray.read_int());
        }
        food_ids.Clear();
        int CountOffood_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOffood_ids; i++)
        {
             food_ids.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_create_party);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_create_party();
    }
}

public class notify_create_party_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_create_party_result;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_create_party_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_create_party_result();
    }
}

public class req_edit_party : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_edit_party;
    }
    public UInt64 house_id;
    public int type;
    public string title = "";
    public string description = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(type);
    	byteArray.Write(title);
    	byteArray.Write(description);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        type = byteArray.read_int();
        title = byteArray.read_string();
        description = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_edit_party);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_edit_party();
    }
}

public class notify_edit_party_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_edit_party_result;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_edit_party_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_edit_party_result();
    }
}

public class req_delete_party : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_delete_party;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_delete_party);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_delete_party();
    }
}

public class notify_delete_party_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_delete_party_result;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_delete_party_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_delete_party_result();
    }
}

public class notify_private_party_need_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_private_party_need_item;
    }
    public int item_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_private_party_need_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_private_party_need_item();
    }
}

public class req_get_party_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_party_list;
    }
    public int type;
    public int page;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(page);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        page = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_party_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_party_list();
    }
}

public class party_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_party_data;
    }
    public UInt64 house_id;
    public string house_name = "";
    public string account = "";
    public string player_name = "";
    public int type;
    public string title = "";
    public string desc = "";
    public stime create_time = new stime();
    public int freeze_seconds;
    public int rest_time;
    public int exp;
    public int cur_person;
    public int max_person;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(house_name);
    	byteArray.Write(account);
    	byteArray.Write(player_name);
    	byteArray.Write(type);
    	byteArray.Write(title);
    	byteArray.Write(desc);
        create_time.encode(byteArray);

    	byteArray.Write(freeze_seconds);
    	byteArray.Write(rest_time);
    	byteArray.Write(exp);
    	byteArray.Write(cur_person);
    	byteArray.Write(max_person);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        house_name = byteArray.read_string();
        account = byteArray.read_string();
        player_name = byteArray.read_string();
        type = byteArray.read_int();
        title = byteArray.read_string();
        desc = byteArray.read_string();
        create_time.decode(byteArray);
        freeze_seconds = byteArray.read_int();
        rest_time = byteArray.read_int();
        exp = byteArray.read_int();
        cur_person = byteArray.read_int();
        max_person = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_party_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new party_data();
    }
}

public class notify_party_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_list;
    }
    public int max_page;
    public ArrayList partys = new ArrayList();
    public ArrayList hot_partys = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(max_page);
        byteArray.Write((UInt16)partys.Count);
        for(int i = 0; i < partys.Count; i++)
        {
            ((party_data)partys[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)hot_partys.Count);
        for(int i = 0; i < hot_partys.Count; i++)
        {
            ((party_data)hot_partys[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        max_page = byteArray.read_int();
        int CountOfpartys = byteArray.read_uint16();
        party_data[] ArrayOfpartys = new party_data[CountOfpartys];
        for(int i = 0; i < CountOfpartys; i++)
        {
            ArrayOfpartys[i] = new party_data();
            ((party_data)ArrayOfpartys[i]).decode(byteArray);
        }
        partys.Clear();
        partys.AddRange(ArrayOfpartys);
        int CountOfhot_partys = byteArray.read_uint16();
        party_data[] ArrayOfhot_partys = new party_data[CountOfhot_partys];
        for(int i = 0; i < CountOfhot_partys; i++)
        {
            ArrayOfhot_partys[i] = new party_data();
            ((party_data)ArrayOfhot_partys[i]).decode(byteArray);
        }
        hot_partys.Clear();
        hot_partys.AddRange(ArrayOfhot_partys);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_list();
    }
}

public class req_get_my_party_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_my_party_info;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_my_party_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_my_party_info();
    }
}

public class notify_my_party_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_my_party_info;
    }
    public party_data data = new party_data();
    public int need_money;
    public void encode(ByteArray byteArray)
    {
        data.encode(byteArray);

    	byteArray.Write(need_money);
    }

    public void decode(ByteArray byteArray)
    {
        data.decode(byteArray);
        need_money = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_my_party_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_my_party_info();
    }
}

public class notify_start_party_exp_timer : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_party_exp_timer;
    }
    public int seconds;
    public int hide_seconds;
    public int exp;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(seconds);
    	byteArray.Write(hide_seconds);
    	byteArray.Write(exp);
    }

    public void decode(ByteArray byteArray)
    {
        seconds = byteArray.read_int();
        hide_seconds = byteArray.read_int();
        exp = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_party_exp_timer);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_party_exp_timer();
    }
}

public class notify_stop_party_exp_timer : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_stop_party_exp_timer;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_stop_party_exp_timer);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_stop_party_exp_timer();
    }
}

public class req_add_party_score : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_add_party_score;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_add_party_score);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_add_party_score();
    }
}

public class notify_party_score : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_score;
    }
    public int score;
    public int has_vote;
    public int remain_times;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(score);
    	byteArray.Write(has_vote);
    	byteArray.Write(remain_times);
    }

    public void decode(ByteArray byteArray)
    {
        score = byteArray.read_int();
        has_vote = byteArray.read_int();
        remain_times = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_score);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_score();
    }
}

public class notify_add_party_score : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_party_score;
    }
    public int total_score;
    public int add_score;
    public string guest_account = "";
    public string guest_name = "";
    public string master_account = "";
    public string master_name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(total_score);
    	byteArray.Write(add_score);
    	byteArray.Write(guest_account);
    	byteArray.Write(guest_name);
    	byteArray.Write(master_account);
    	byteArray.Write(master_name);
    }

    public void decode(ByteArray byteArray)
    {
        total_score = byteArray.read_int();
        add_score = byteArray.read_int();
        guest_account = byteArray.read_string();
        guest_name = byteArray.read_string();
        master_account = byteArray.read_string();
        master_name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_party_score);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_party_score();
    }
}

public class notify_party_gain : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_gain;
    }
    public ArrayList grade_scores = new ArrayList();
    public int score;
    public int item_id;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)grade_scores.Count);
        for(int i = 0; i < grade_scores.Count; i++)
        {
            ((pair_int)grade_scores[i]).encode(byteArray);
        }
    	byteArray.Write(score);
    	byteArray.Write(item_id);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgrade_scores = byteArray.read_uint16();
        pair_int[] ArrayOfgrade_scores = new pair_int[CountOfgrade_scores];
        for(int i = 0; i < CountOfgrade_scores; i++)
        {
            ArrayOfgrade_scores[i] = new pair_int();
            ((pair_int)ArrayOfgrade_scores[i]).decode(byteArray);
        }
        grade_scores.Clear();
        grade_scores.AddRange(ArrayOfgrade_scores);
        score = byteArray.read_int();
        item_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_gain);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_gain();
    }
}

public class notify_party_exp_buffs : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_exp_buffs;
    }
    public ArrayList buff_exps = new ArrayList();
    public ArrayList lights = new ArrayList();
    public int total_add_percent;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)buff_exps.Count);
        for(int i = 0; i < buff_exps.Count; i++)
        {
            ((pair_int)buff_exps[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)lights.Count);
        for(int i = 0; i < lights.Count; i++)
        {
            byteArray.Write((int)lights[i]);
        }
    	byteArray.Write(total_add_percent);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfbuff_exps = byteArray.read_uint16();
        pair_int[] ArrayOfbuff_exps = new pair_int[CountOfbuff_exps];
        for(int i = 0; i < CountOfbuff_exps; i++)
        {
            ArrayOfbuff_exps[i] = new pair_int();
            ((pair_int)ArrayOfbuff_exps[i]).decode(byteArray);
        }
        buff_exps.Clear();
        buff_exps.AddRange(ArrayOfbuff_exps);
        lights.Clear();
        int CountOflights = byteArray.read_uint16();
        for(int i = 0; i < CountOflights; i++)
        {
             lights.Add(byteArray.read_int());
        }
        total_add_percent = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_exp_buffs);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_exp_buffs();
    }
}

public class notify_party_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_items;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((pack_grid)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        pack_grid[] ArrayOfitems = new pack_grid[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new pack_grid();
            ((pack_grid)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_items();
    }
}

public class notify_update_party_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_party_items;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((pack_grid)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        pack_grid[] ArrayOfitems = new pack_grid[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new pack_grid();
            ((pack_grid)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_party_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_party_items();
    }
}

public class notify_party_stop : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_stop;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_stop);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_stop();
    }
}

public class req_party_food_eat : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_party_food_eat;
    }
    public UInt64 food_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(food_id);
    }

    public void decode(ByteArray byteArray)
    {
        food_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_party_food_eat);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_party_food_eat();
    }
}

public class notify_party_food_eat_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_food_eat_count;
    }
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_food_eat_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_food_eat_count();
    }
}

public class notify_party_food_ids : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_food_ids;
    }
    public ArrayList food_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)food_ids.Count);
        for(int i = 0; i < food_ids.Count; i++)
        {
            byteArray.Write((int)food_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        food_ids.Clear();
        int CountOffood_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOffood_ids; i++)
        {
             food_ids.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_food_ids);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_food_ids();
    }
}

public class req_equip_off : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_equip_off;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_equip_off);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_equip_off();
    }
}

public class notify_equip_off : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_equip_off;
    }
    public string account = "";
    public int equip_pos;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(equip_pos);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        equip_pos = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_equip_off);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_equip_off();
    }
}

public class req_equip_on : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_equip_on;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_equip_on);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_equip_on();
    }
}

public class notify_equip_on : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_equip_on;
    }
    public string account = "";
    public int equip_pos;
    public pack_grid item_grid = new pack_grid();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(equip_pos);
        item_grid.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        equip_pos = byteArray.read_int();
        item_grid.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_equip_on);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_equip_on();
    }
}

public class notify_lover_package : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_lover_package;
    }
    public ArrayList grid_vec = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)grid_vec.Count);
        for(int i = 0; i < grid_vec.Count; i++)
        {
            ((pack_grid)grid_vec[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgrid_vec = byteArray.read_uint16();
        pack_grid[] ArrayOfgrid_vec = new pack_grid[CountOfgrid_vec];
        for(int i = 0; i < CountOfgrid_vec; i++)
        {
            ArrayOfgrid_vec[i] = new pack_grid();
            ((pack_grid)ArrayOfgrid_vec[i]).decode(byteArray);
        }
        grid_vec.Clear();
        grid_vec.AddRange(ArrayOfgrid_vec);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_lover_package);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_lover_package();
    }
}

public class notify_lover_diamond : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_lover_diamond;
    }
    public int amount;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(amount);
    }

    public void decode(ByteArray byteArray)
    {
        amount = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_lover_diamond);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_lover_diamond();
    }
}

public class req_delete_lover_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_delete_lover_item;
    }
    public ArrayList item_inst_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)item_inst_ids.Count);
        for(int i = 0; i < item_inst_ids.Count; i++)
        {
            byteArray.Write((UInt64)item_inst_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_ids.Clear();
        int CountOfitem_inst_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOfitem_inst_ids; i++)
        {
             item_inst_ids.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_delete_lover_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_delete_lover_item();
    }
}

public class notify_add_lover_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_lover_items;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((pack_grid)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        pack_grid[] ArrayOfitems = new pack_grid[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new pack_grid();
            ((pack_grid)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_lover_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_lover_items();
    }
}

public class pair_item_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_pair_item_count;
    }
    public UInt64 item_inst_id;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_pair_item_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new pair_item_count();
    }
}

public class notify_update_items_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_items_count;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((pair_item_count)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        pair_item_count[] ArrayOfitems = new pair_item_count[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new pair_item_count();
            ((pair_item_count)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_items_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_items_count();
    }
}

public class req_lock_lover_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_lock_lover_item;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_lock_lover_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_lock_lover_item();
    }
}

public class req_unlock_lover_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_lover_item;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_lover_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_lover_item();
    }
}

public class notify_lock_lover_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_lock_lover_item;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_lock_lover_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_lock_lover_item();
    }
}

public class notify_unlock_lover_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_lover_item;
    }
    public UInt64 item_inst_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_lover_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_lover_item();
    }
}

public class req_house_guest_book : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_house_guest_book;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_house_guest_book);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_house_guest_book();
    }
}

public class notify_house_guest_book : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_guest_book;
    }
    public string account = "";
    public string lover_account = "";
    public ArrayList guest_books = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(lover_account);
        byteArray.Write((UInt16)guest_books.Count);
        for(int i = 0; i < guest_books.Count; i++)
        {
            ((guest_book)guest_books[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        lover_account = byteArray.read_string();
        int CountOfguest_books = byteArray.read_uint16();
        guest_book[] ArrayOfguest_books = new guest_book[CountOfguest_books];
        for(int i = 0; i < CountOfguest_books; i++)
        {
            ArrayOfguest_books[i] = new guest_book();
            ((guest_book)ArrayOfguest_books[i]).decode(byteArray);
        }
        guest_books.Clear();
        guest_books.AddRange(ArrayOfguest_books);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_guest_book);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_guest_book();
    }
}

public class req_house_visit_log_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_house_visit_log_add;
    }
    public string guest = "";
    public string openid = "";
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(guest);
    	byteArray.Write(openid);
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        guest = byteArray.read_string();
        openid = byteArray.read_string();
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_house_visit_log_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_house_visit_log_add();
    }
}

public class notify_house_visit_log_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_visit_log_add;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_visit_log_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_visit_log_add();
    }
}

public class req_house_visit_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_house_visit_log;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_house_visit_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_house_visit_log();
    }
}

public class notify_house_visit_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_visit_log;
    }
    public ArrayList visit_logs = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)visit_logs.Count);
        for(int i = 0; i < visit_logs.Count; i++)
        {
            ((visit_log)visit_logs[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfvisit_logs = byteArray.read_uint16();
        visit_log[] ArrayOfvisit_logs = new visit_log[CountOfvisit_logs];
        for(int i = 0; i < CountOfvisit_logs; i++)
        {
            ArrayOfvisit_logs[i] = new visit_log();
            ((visit_log)ArrayOfvisit_logs[i]).decode(byteArray);
        }
        visit_logs.Clear();
        visit_logs.AddRange(ArrayOfvisit_logs);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_visit_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_visit_log();
    }
}

public class req_guest_book_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_guest_book_delete;
    }
    public string account = "";
    public UInt64 id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_guest_book_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_guest_book_delete();
    }
}

public class notify_guest_book_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_guest_book_delete;
    }
    public int result;
    public UInt64 id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_guest_book_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_guest_book_delete();
    }
}

public class req_guest_book_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_guest_book_add;
    }
    public string owner = "";
    public string guest = "";
    public string content = "";
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(owner);
    	byteArray.Write(guest);
    	byteArray.Write(content);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        owner = byteArray.read_string();
        guest = byteArray.read_string();
        content = byteArray.read_string();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_guest_book_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_guest_book_add();
    }
}

public class notify_new_guest_book : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_new_guest_book;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_new_guest_book);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_new_guest_book();
    }
}

public class notify_guest_book_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_guest_book_add;
    }
    public int result;
    public guest_book item = new guest_book();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
        item.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        item.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_guest_book_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_guest_book_add();
    }
}

public class req_guest_book_clear : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_guest_book_clear;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_guest_book_clear);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_guest_book_clear();
    }
}

public class notify_guest_book_clear : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_guest_book_clear;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_guest_book_clear);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_guest_book_clear();
    }
}

public class req_create_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_create_flower;
    }
    public UInt64 house_id;
    public int flower_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(flower_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        flower_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_create_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_create_flower();
    }
}

public class req_get_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_flower;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_flower();
    }
}

public class notify_flower_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_data;
    }
    public int operate;
    public UInt64 house_id;
    public int id;
    public int level;
    public int grow;
    public stime start_time = new stime();
    public stime fruit_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(operate);
    	byteArray.Write(house_id);
    	byteArray.Write(id);
    	byteArray.Write(level);
    	byteArray.Write(grow);
        start_time.encode(byteArray);

        fruit_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        operate = byteArray.read_int();
        house_id = byteArray.read_uint64();
        id = byteArray.read_int();
        level = byteArray.read_int();
        grow = byteArray.read_int();
        start_time.decode(byteArray);
        fruit_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_data();
    }
}

public class req_can_water_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_can_water_flower;
    }
    public UInt64 my_house_id;
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(my_house_id);
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        my_house_id = byteArray.read_uint64();
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_can_water_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_can_water_flower();
    }
}

public class notify_can_water_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_can_water_flower;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_can_water_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_can_water_flower();
    }
}

public class req_water_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_water_flower;
    }
    public UInt64 my_house_id;
    public string name = "";
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(my_house_id);
    	byteArray.Write(name);
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        my_house_id = byteArray.read_uint64();
        name = byteArray.read_string();
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_water_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_water_flower();
    }
}

public class req_fertilize_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_fertilize_flower;
    }
    public UInt64 my_house_id;
    public string name = "";
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(my_house_id);
    	byteArray.Write(name);
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        my_house_id = byteArray.read_uint64();
        name = byteArray.read_string();
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_fertilize_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_fertilize_flower();
    }
}

public class req_pick_fruit : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_pick_fruit;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_pick_fruit);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_pick_fruit();
    }
}

public class req_change_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_change_flower;
    }
    public UInt64 house_id;
    public int flower_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(flower_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        flower_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_change_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_change_flower();
    }
}

public class flower_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_flower_log;
    }
    public string name = "";
    public int op;
    public stime time = new stime();
    public int grow;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(name);
    	byteArray.Write(op);
        time.encode(byteArray);

    	byteArray.Write(grow);
    }

    public void decode(ByteArray byteArray)
    {
        name = byteArray.read_string();
        op = byteArray.read_int();
        time.decode(byteArray);
        grow = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_flower_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new flower_log();
    }
}

public class req_flower_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_flower_log;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_flower_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_flower_log();
    }
}

public class notify_flower_log : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_log;
    }
    public ArrayList logs = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)logs.Count);
        for(int i = 0; i < logs.Count; i++)
        {
            ((flower_log)logs[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOflogs = byteArray.read_uint16();
        flower_log[] ArrayOflogs = new flower_log[CountOflogs];
        for(int i = 0; i < CountOflogs; i++)
        {
            ArrayOflogs[i] = new flower_log();
            ((flower_log)ArrayOflogs[i]).decode(byteArray);
        }
        logs.Clear();
        logs.AddRange(ArrayOflogs);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_log);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_log();
    }
}

public class req_ask_today_water_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_ask_today_water_flower;
    }
    public UInt64 owner_house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(owner_house_id);
    }

    public void decode(ByteArray byteArray)
    {
        owner_house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_ask_today_water_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_ask_today_water_flower();
    }
}

public class notify_today_water_flower : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_today_water_flower;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_today_water_flower);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_today_water_flower();
    }
}

public class check_in : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_check_in;
    }
    public string id = "";
    public string account = "";
    public string content = "";
    public int opened;
    public stime create_date = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(account);
    	byteArray.Write(content);
    	byteArray.Write(opened);
        create_date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_string();
        account = byteArray.read_string();
        content = byteArray.read_string();
        opened = byteArray.read_int();
        create_date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_check_in);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new check_in();
    }
}

public class req_checkin_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_checkin_add;
    }
    public string account = "";
    public string content = "";
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(content);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        content = byteArray.read_string();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_checkin_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_checkin_add();
    }
}

public class notify_checkin_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_checkin_add;
    }
    public check_in item = new check_in();
    public void encode(ByteArray byteArray)
    {
        item.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        item.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_checkin_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_checkin_add();
    }
}

public class notify_new_checkin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_new_checkin;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_new_checkin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_new_checkin();
    }
}

public class req_last_checkins : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_last_checkins;
    }
    public string owner = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(owner);
    }

    public void decode(ByteArray byteArray)
    {
        owner = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_last_checkins);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_last_checkins();
    }
}

public class notify_last_checkins : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_last_checkins;
    }
    public check_in owner = new check_in();
    public check_in lover = new check_in();
    public void encode(ByteArray byteArray)
    {
        owner.encode(byteArray);

        lover.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        owner.decode(byteArray);
        lover.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_last_checkins);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_last_checkins();
    }
}

public class req_checkin_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_checkin_list;
    }
    public string owner = "";
    public string start_id = "";
    public int page_index;
    public int page_size;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(owner);
    	byteArray.Write(start_id);
    	byteArray.Write(page_index);
    	byteArray.Write(page_size);
    }

    public void decode(ByteArray byteArray)
    {
        owner = byteArray.read_string();
        start_id = byteArray.read_string();
        page_index = byteArray.read_int();
        page_size = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_checkin_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_checkin_list();
    }
}

public class notify_checkin_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_checkin_list;
    }
    public ArrayList checkins = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)checkins.Count);
        for(int i = 0; i < checkins.Count; i++)
        {
            ((check_in)checkins[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfcheckins = byteArray.read_uint16();
        check_in[] ArrayOfcheckins = new check_in[CountOfcheckins];
        for(int i = 0; i < CountOfcheckins; i++)
        {
            ArrayOfcheckins[i] = new check_in();
            ((check_in)ArrayOfcheckins[i]).decode(byteArray);
        }
        checkins.Clear();
        checkins.AddRange(ArrayOfcheckins);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_checkin_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_checkin_list();
    }
}

public class req_checkin_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_checkin_delete;
    }
    public string account = "";
    public string id = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        id = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_checkin_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_checkin_delete();
    }
}

public class notify_checkin_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_checkin_delete;
    }
    public int result;
    public string id = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        id = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_checkin_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_checkin_delete();
    }
}

public class req_modify_love_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_modify_love_time;
    }
    public UInt64 house_id;
    public stime love_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
        love_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        love_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_modify_love_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_modify_love_time();
    }
}

public class req_get_love_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_love_time;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_love_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_love_time();
    }
}

public class notify_love_time : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_love_time;
    }
    public UInt64 house_id;
    public int love_time;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(love_time);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        love_time = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_love_time);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_love_time();
    }
}

public class commemoration_day : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_commemoration_day;
    }
    public UInt64 id;
    public int show_other;
    public stime time = new stime();
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(show_other);
        time.encode(byteArray);

    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_uint64();
        show_other = byteArray.read_int();
        time.decode(byteArray);
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_commemoration_day);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new commemoration_day();
    }
}

public class req_add_commemoration : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_add_commemoration;
    }
    public UInt64 house_id;
    public stime time = new stime();
    public int show_other;
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
        time.encode(byteArray);

    	byteArray.Write(show_other);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        time.decode(byteArray);
        show_other = byteArray.read_int();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_add_commemoration);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_add_commemoration();
    }
}

public class req_get_commemoration : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_commemoration;
    }
    public UInt64 house_id;
    public UInt64 my_house_id;
    public int page;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(my_house_id);
    	byteArray.Write(page);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        my_house_id = byteArray.read_uint64();
        page = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_commemoration);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_commemoration();
    }
}

public class notify_commemoration : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_commemoration;
    }
    public ArrayList days = new ArrayList();
    public int total;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)days.Count);
        for(int i = 0; i < days.Count; i++)
        {
            ((commemoration_day)days[i]).encode(byteArray);
        }
    	byteArray.Write(total);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfdays = byteArray.read_uint16();
        commemoration_day[] ArrayOfdays = new commemoration_day[CountOfdays];
        for(int i = 0; i < CountOfdays; i++)
        {
            ArrayOfdays[i] = new commemoration_day();
            ((commemoration_day)ArrayOfdays[i]).decode(byteArray);
        }
        days.Clear();
        days.AddRange(ArrayOfdays);
        total = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_commemoration);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_commemoration();
    }
}

public class req_delete_commemoration : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_delete_commemoration;
    }
    public UInt64 house_id;
    public UInt64 id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_delete_commemoration);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_delete_commemoration();
    }
}

public class req_modify_commemoration : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_modify_commemoration;
    }
    public UInt64 house_id;
    public UInt64 id;
    public int show_other;
    public stime time = new stime();
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(id);
    	byteArray.Write(show_other);
        time.encode(byteArray);

    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        id = byteArray.read_uint64();
        show_other = byteArray.read_int();
        time.decode(byteArray);
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_modify_commemoration);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_modify_commemoration();
    }
}

public class req_platform_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_platform_info;
    }
    public ArrayList open_ids = new ArrayList();
    public int token;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)open_ids.Count);
        for(int i = 0; i < open_ids.Count; i++)
        {
            byteArray.Write((string)open_ids[i]);
        }
    	byteArray.Write(token);
    }

    public void decode(ByteArray byteArray)
    {
        open_ids.Clear();
        int CountOfopen_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOfopen_ids; i++)
        {
             open_ids.Add(byteArray.read_string());
        }
        token = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_platform_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_platform_info();
    }
}

public class notify_platform_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_platform_info;
    }
    public ArrayList player_informations = new ArrayList();
    public int token;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)player_informations.Count);
        for(int i = 0; i < player_informations.Count; i++)
        {
            ((player_basic_information)player_informations[i]).encode(byteArray);
        }
    	byteArray.Write(token);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfplayer_informations = byteArray.read_uint16();
        player_basic_information[] ArrayOfplayer_informations = new player_basic_information[CountOfplayer_informations];
        for(int i = 0; i < CountOfplayer_informations; i++)
        {
            ArrayOfplayer_informations[i] = new player_basic_information();
            ((player_basic_information)ArrayOfplayer_informations[i]).decode(byteArray);
        }
        player_informations.Clear();
        player_informations.AddRange(ArrayOfplayer_informations);
        token = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_platform_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_platform_info();
    }
}

public class req_daily_visit : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_daily_visit;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_daily_visit);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_daily_visit();
    }
}

public class notify_daily_visit : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_daily_visit;
    }
    public ArrayList visit_firends = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)visit_firends.Count);
        for(int i = 0; i < visit_firends.Count; i++)
        {
            byteArray.Write((UInt64)visit_firends[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        visit_firends.Clear();
        int CountOfvisit_firends = byteArray.read_uint16();
        for(int i = 0; i < CountOfvisit_firends; i++)
        {
             visit_firends.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_daily_visit);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_daily_visit();
    }
}

public class req_player_guide : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_guide;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_guide);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_guide();
    }
}

public class notify_player_guide : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_guide;
    }
    public ArrayList flags = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)flags.Count);
        for(int i = 0; i < flags.Count; i++)
        {
            byteArray.Write((int)flags[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        flags.Clear();
        int CountOfflags = byteArray.read_uint16();
        for(int i = 0; i < CountOfflags; i++)
        {
             flags.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_guide);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_guide();
    }
}

public class req_update_player_guide : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_update_player_guide;
    }
    public ArrayList flags = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)flags.Count);
        for(int i = 0; i < flags.Count; i++)
        {
            byteArray.Write((int)flags[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        flags.Clear();
        int CountOfflags = byteArray.read_uint16();
        for(int i = 0; i < CountOfflags; i++)
        {
             flags.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_update_player_guide);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_update_player_guide();
    }
}

public class notify_update_player_guide : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_player_guide;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_player_guide);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_player_guide();
    }
}

public class notify_active_holiday_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_active_holiday_gift;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_active_holiday_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_active_holiday_gift();
    }
}

public class req_get_holiday_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_holiday_gift;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_holiday_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_holiday_gift();
    }
}

public class notify_get_holiday_gift_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_get_holiday_gift_result;
    }
    public int result;
    public int item_id;
    public int item_count;
    public int diamond;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    	byteArray.Write(item_id);
    	byteArray.Write(item_count);
    	byteArray.Write(diamond);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        item_id = byteArray.read_int();
        item_count = byteArray.read_int();
        diamond = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_get_holiday_gift_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_get_holiday_gift_result();
    }
}

public class lottery_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_lottery_item;
    }
    public int item_id;
    public int item_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    	byteArray.Write(item_count);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
        item_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_lottery_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new lottery_item();
    }
}

public class notify_use_lottery_item_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_use_lottery_item_result;
    }
    public UInt64 item_inst_id;
    public ArrayList items = new ArrayList();
    public int hit_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_inst_id);
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((lottery_item)items[i]).encode(byteArray);
        }
    	byteArray.Write(hit_index);
    }

    public void decode(ByteArray byteArray)
    {
        item_inst_id = byteArray.read_uint64();
        int CountOfitems = byteArray.read_uint16();
        lottery_item[] ArrayOfitems = new lottery_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new lottery_item();
            ((lottery_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
        hit_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_use_lottery_item_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_use_lottery_item_result();
    }
}

public class notify_heartbeat : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_heartbeat;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_heartbeat);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_heartbeat();
    }
}

public class notify_player_setting : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_setting;
    }
    public player_setting setting = new player_setting();
    public void encode(ByteArray byteArray)
    {
        setting.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        setting.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_setting);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_setting();
    }
}

public class req_player_setting : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_setting;
    }
    public setting_info setting = new setting_info();
    public void encode(ByteArray byteArray)
    {
        setting.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        setting.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_setting);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_setting();
    }
}

public class req_update_house_name : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_update_house_name;
    }
    public string name = "";
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(name);
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        name = byteArray.read_string();
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_update_house_name);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_update_house_name();
    }
}

public class notify_update_house_name : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_house_name;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_house_name);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_house_name();
    }
}

public class req_mateup : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mateup;
    }
    public string boy_number = "";
    public string girl_number = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(boy_number);
    	byteArray.Write(girl_number);
    }

    public void decode(ByteArray byteArray)
    {
        boy_number = byteArray.read_string();
        girl_number = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mateup);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mateup();
    }
}

public class notify_mateup_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mateup_list;
    }
    public ArrayList mateup_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)mateup_list.Count);
        for(int i = 0; i < mateup_list.Count; i++)
        {
            ((player_basic_information)mateup_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfmateup_list = byteArray.read_uint16();
        player_basic_information[] ArrayOfmateup_list = new player_basic_information[CountOfmateup_list];
        for(int i = 0; i < CountOfmateup_list; i++)
        {
            ArrayOfmateup_list[i] = new player_basic_information();
            ((player_basic_information)ArrayOfmateup_list[i]).decode(byteArray);
        }
        mateup_list.Clear();
        mateup_list.AddRange(ArrayOfmateup_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mateup_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mateup_list();
    }
}

public class notify_mateup_wait : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mateup_wait;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mateup_wait);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mateup_wait();
    }
}

public class notify_mateup_fail : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mateup_fail;
    }
    public string message = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(message);
    }

    public void decode(ByteArray byteArray)
    {
        message = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mateup_fail);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mateup_fail();
    }
}

public class req_mateup_select : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mateup_select;
    }
    public string match_account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(match_account);
    }

    public void decode(ByteArray byteArray)
    {
        match_account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mateup_select);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mateup_select();
    }
}

public class notify_mateup_success : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mateup_success;
    }
    public player_basic_information boy = new player_basic_information();
    public player_basic_information girl = new player_basic_information();
    public void encode(ByteArray byteArray)
    {
        boy.encode(byteArray);

        girl.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        boy.decode(byteArray);
        girl.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mateup_success);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mateup_success();
    }
}

public class req_mateup_number : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mateup_number;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mateup_number);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mateup_number();
    }
}

public class notify_mateup_number : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mateup_number;
    }
    public string boy_number = "";
    public string girl_number = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(boy_number);
    	byteArray.Write(girl_number);
    }

    public void decode(ByteArray byteArray)
    {
        boy_number = byteArray.read_string();
        girl_number = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mateup_number);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mateup_number();
    }
}

public class notify_house_warming : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_warming;
    }
    public string title = "";
    public string desc = "";
    public string summary = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(title);
    	byteArray.Write(desc);
    	byteArray.Write(summary);
    }

    public void decode(ByteArray byteArray)
    {
        title = byteArray.read_string();
        desc = byteArray.read_string();
        summary = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_warming);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_warming();
    }
}

public class client_device_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_client_device_info;
    }
    public string operate_system = "";
    public string cpu = "";
    public int cpu_count;
    public int memory;
    public string graphics_card = "";
    public int graphics_card_memory;
    public int graphics_card_id;
    public string graphics_card_verson = "";
    public string graphics_card_vendor = "";
    public int graphics_card_vendor_id;
    public int graphics_card_shader_level;
    public int graphics_card_pixel_fillrate;
    public int support_shadow;
    public int support_render_texture;
    public int support_image_effect;
    public string device_name = "";
    public string device_unique_identify = "";
    public string device_model = "";
    public string browser = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(operate_system);
    	byteArray.Write(cpu);
    	byteArray.Write(cpu_count);
    	byteArray.Write(memory);
    	byteArray.Write(graphics_card);
    	byteArray.Write(graphics_card_memory);
    	byteArray.Write(graphics_card_id);
    	byteArray.Write(graphics_card_verson);
    	byteArray.Write(graphics_card_vendor);
    	byteArray.Write(graphics_card_vendor_id);
    	byteArray.Write(graphics_card_shader_level);
    	byteArray.Write(graphics_card_pixel_fillrate);
    	byteArray.Write(support_shadow);
    	byteArray.Write(support_render_texture);
    	byteArray.Write(support_image_effect);
    	byteArray.Write(device_name);
    	byteArray.Write(device_unique_identify);
    	byteArray.Write(device_model);
    	byteArray.Write(browser);
    }

    public void decode(ByteArray byteArray)
    {
        operate_system = byteArray.read_string();
        cpu = byteArray.read_string();
        cpu_count = byteArray.read_int();
        memory = byteArray.read_int();
        graphics_card = byteArray.read_string();
        graphics_card_memory = byteArray.read_int();
        graphics_card_id = byteArray.read_int();
        graphics_card_verson = byteArray.read_string();
        graphics_card_vendor = byteArray.read_string();
        graphics_card_vendor_id = byteArray.read_int();
        graphics_card_shader_level = byteArray.read_int();
        graphics_card_pixel_fillrate = byteArray.read_int();
        support_shadow = byteArray.read_int();
        support_render_texture = byteArray.read_int();
        support_image_effect = byteArray.read_int();
        device_name = byteArray.read_string();
        device_unique_identify = byteArray.read_string();
        device_model = byteArray.read_string();
        browser = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_client_device_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new client_device_info();
    }
}

public class notify_level_exp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_level_exp;
    }
    public int level;
    public int exp;
    public int max_exp;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(level);
    	byteArray.Write(exp);
    	byteArray.Write(max_exp);
    }

    public void decode(ByteArray byteArray)
    {
        level = byteArray.read_int();
        exp = byteArray.read_int();
        max_exp = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_level_exp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_level_exp();
    }
}

public class notify_hp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_hp;
    }
    public int hp;
    public int max_hp;
    public int total_seconds;
    public int restore_seconds;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(hp);
    	byteArray.Write(max_hp);
    	byteArray.Write(total_seconds);
    	byteArray.Write(restore_seconds);
    }

    public void decode(ByteArray byteArray)
    {
        hp = byteArray.read_int();
        max_hp = byteArray.read_int();
        total_seconds = byteArray.read_int();
        restore_seconds = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_hp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_hp();
    }
}

public class req_start_recover_hp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_start_recover_hp;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_start_recover_hp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_start_recover_hp();
    }
}

public class notify_start_recover_hp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_start_recover_hp;
    }
    public int count;
    public int hp;
    public int love_coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    	byteArray.Write(hp);
    	byteArray.Write(love_coin);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
        hp = byteArray.read_int();
        love_coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_start_recover_hp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_start_recover_hp();
    }
}

public class req_recover_hp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_recover_hp;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_recover_hp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_recover_hp();
    }
}

public class notify_recover_hp : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_recover_hp;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_recover_hp);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_recover_hp();
    }
}

public class req_add_attention : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_add_attention;
    }
    public string account = "";
    public string name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(name);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_add_attention);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_add_attention();
    }
}

public class notify_add_attention : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_attention;
    }
    public friend_item info = new friend_item();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_attention);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_attention();
    }
}

public class req_cancel_attention : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_cancel_attention;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_cancel_attention);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_cancel_attention();
    }
}

public class notify_cancel_attention : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_cancel_attention;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_cancel_attention);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_cancel_attention();
    }
}

public class req_get_attention_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_attention_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_attention_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_attention_list();
    }
}

public class notify_attention_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_attention_list;
    }
    public ArrayList attentions = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)attentions.Count);
        for(int i = 0; i < attentions.Count; i++)
        {
            ((friend_item)attentions[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfattentions = byteArray.read_uint16();
        friend_item[] ArrayOfattentions = new friend_item[CountOfattentions];
        for(int i = 0; i < CountOfattentions; i++)
        {
            ArrayOfattentions[i] = new friend_item();
            ((friend_item)ArrayOfattentions[i]).decode(byteArray);
        }
        attentions.Clear();
        attentions.AddRange(ArrayOfattentions);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_attention_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_attention_list();
    }
}

public class req_opposite_sex_photos : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_opposite_sex_photos;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_opposite_sex_photos);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_opposite_sex_photos();
    }
}

public class notify_opposite_sex_photos : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_opposite_sex_photos;
    }
    public ArrayList photos = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)photos.Count);
        for(int i = 0; i < photos.Count; i++)
        {
            ((player_basic_information)photos[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfphotos = byteArray.read_uint16();
        player_basic_information[] ArrayOfphotos = new player_basic_information[CountOfphotos];
        for(int i = 0; i < CountOfphotos; i++)
        {
            ArrayOfphotos[i] = new player_basic_information();
            ((player_basic_information)ArrayOfphotos[i]).decode(byteArray);
        }
        photos.Clear();
        photos.AddRange(ArrayOfphotos);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_opposite_sex_photos);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_opposite_sex_photos();
    }
}

public class gift_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_gift_info;
    }
    public UInt64 gift_id;
    public string receiver = "";
    public string sender = "";
    public int gift_box;
    public item gift = new item();
    public stime date = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(gift_id);
    	byteArray.Write(receiver);
    	byteArray.Write(sender);
    	byteArray.Write(gift_box);
        gift.encode(byteArray);

        date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        gift_id = byteArray.read_uint64();
        receiver = byteArray.read_string();
        sender = byteArray.read_string();
        gift_box = byteArray.read_int();
        gift.decode(byteArray);
        date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_gift_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new gift_info();
    }
}

public class house_gift_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_house_gift_info;
    }
    public UInt64 gift_id;
    public int gift_box;
    public stime date = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(gift_id);
    	byteArray.Write(gift_box);
        date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        gift_id = byteArray.read_uint64();
        gift_box = byteArray.read_int();
        date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_house_gift_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new house_gift_info();
    }
}

public class req_send_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_send_gift;
    }
    public gift_info gift = new gift_info();
    public void encode(ByteArray byteArray)
    {
        gift.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        gift.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_send_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_send_gift();
    }
}

public class notify_send_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_send_gift;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_send_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_send_gift();
    }
}

public class req_house_gift_box_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_house_gift_box_list;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_house_gift_box_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_house_gift_box_list();
    }
}

public class notify_house_gift_box_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_gift_box_list;
    }
    public string boy = "";
    public string girl = "";
    public ArrayList boy_boxes = new ArrayList();
    public ArrayList girl_boxes = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(boy);
    	byteArray.Write(girl);
        byteArray.Write((UInt16)boy_boxes.Count);
        for(int i = 0; i < boy_boxes.Count; i++)
        {
            ((house_gift_info)boy_boxes[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)girl_boxes.Count);
        for(int i = 0; i < girl_boxes.Count; i++)
        {
            ((house_gift_info)girl_boxes[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        boy = byteArray.read_string();
        girl = byteArray.read_string();
        int CountOfboy_boxes = byteArray.read_uint16();
        house_gift_info[] ArrayOfboy_boxes = new house_gift_info[CountOfboy_boxes];
        for(int i = 0; i < CountOfboy_boxes; i++)
        {
            ArrayOfboy_boxes[i] = new house_gift_info();
            ((house_gift_info)ArrayOfboy_boxes[i]).decode(byteArray);
        }
        boy_boxes.Clear();
        boy_boxes.AddRange(ArrayOfboy_boxes);
        int CountOfgirl_boxes = byteArray.read_uint16();
        house_gift_info[] ArrayOfgirl_boxes = new house_gift_info[CountOfgirl_boxes];
        for(int i = 0; i < CountOfgirl_boxes; i++)
        {
            ArrayOfgirl_boxes[i] = new house_gift_info();
            ((house_gift_info)ArrayOfgirl_boxes[i]).decode(byteArray);
        }
        girl_boxes.Clear();
        girl_boxes.AddRange(ArrayOfgirl_boxes);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_gift_box_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_gift_box_list();
    }
}

public class notify_add_house_gift_box : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_house_gift_box;
    }
    public string account = "";
    public ArrayList boxes = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        byteArray.Write((UInt16)boxes.Count);
        for(int i = 0; i < boxes.Count; i++)
        {
            ((house_gift_info)boxes[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        int CountOfboxes = byteArray.read_uint16();
        house_gift_info[] ArrayOfboxes = new house_gift_info[CountOfboxes];
        for(int i = 0; i < CountOfboxes; i++)
        {
            ArrayOfboxes[i] = new house_gift_info();
            ((house_gift_info)ArrayOfboxes[i]).decode(byteArray);
        }
        boxes.Clear();
        boxes.AddRange(ArrayOfboxes);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_house_gift_box);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_house_gift_box();
    }
}

public class notify_del_house_gift_box : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_del_house_gift_box;
    }
    public string account = "";
    public ArrayList boxes = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        byteArray.Write((UInt16)boxes.Count);
        for(int i = 0; i < boxes.Count; i++)
        {
            ((house_gift_info)boxes[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        int CountOfboxes = byteArray.read_uint16();
        house_gift_info[] ArrayOfboxes = new house_gift_info[CountOfboxes];
        for(int i = 0; i < CountOfboxes; i++)
        {
            ArrayOfboxes[i] = new house_gift_info();
            ((house_gift_info)ArrayOfboxes[i]).decode(byteArray);
        }
        boxes.Clear();
        boxes.AddRange(ArrayOfboxes);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_del_house_gift_box);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_del_house_gift_box();
    }
}

public class req_receive_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_receive_gift;
    }
    public ArrayList gift_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)gift_ids.Count);
        for(int i = 0; i < gift_ids.Count; i++)
        {
            byteArray.Write((UInt64)gift_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        gift_ids.Clear();
        int CountOfgift_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOfgift_ids; i++)
        {
             gift_ids.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_receive_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_receive_gift();
    }
}

public class notify_receive_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_receive_gift;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_receive_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_receive_gift();
    }
}

public class req_receive_gift_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_receive_gift_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_receive_gift_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_receive_gift_list();
    }
}

public class notify_receive_gift_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_receive_gift_list;
    }
    public ArrayList gift = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)gift.Count);
        for(int i = 0; i < gift.Count; i++)
        {
            ((gift_info)gift[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgift = byteArray.read_uint16();
        gift_info[] ArrayOfgift = new gift_info[CountOfgift];
        for(int i = 0; i < CountOfgift; i++)
        {
            ArrayOfgift[i] = new gift_info();
            ((gift_info)ArrayOfgift[i]).decode(byteArray);
        }
        gift.Clear();
        gift.AddRange(ArrayOfgift);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_receive_gift_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_receive_gift_list();
    }
}

public class req_received_gift_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_received_gift_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_received_gift_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_received_gift_list();
    }
}

public class notify_received_gift_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_received_gift_list;
    }
    public ArrayList gift = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)gift.Count);
        for(int i = 0; i < gift.Count; i++)
        {
            ((gift_info)gift[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfgift = byteArray.read_uint16();
        gift_info[] ArrayOfgift = new gift_info[CountOfgift];
        for(int i = 0; i < CountOfgift; i++)
        {
            ArrayOfgift[i] = new gift_info();
            ((gift_info)ArrayOfgift[i]).decode(byteArray);
        }
        gift.Clear();
        gift.AddRange(ArrayOfgift);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_received_gift_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_received_gift_list();
    }
}

public class req_wish_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_wish_add;
    }
    public UInt64 goods_id;
    public int wish_type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(goods_id);
    	byteArray.Write(wish_type);
    }

    public void decode(ByteArray byteArray)
    {
        goods_id = byteArray.read_uint64();
        wish_type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_wish_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_wish_add();
    }
}

public class player_love_wish : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_love_wish;
    }
    public string account = "";
    public UInt64 wish_id;
    public UInt64 goods_id;
    public stime wish_time = new stime();
    public int wish_type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(wish_id);
    	byteArray.Write(goods_id);
        wish_time.encode(byteArray);

    	byteArray.Write(wish_type);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        wish_id = byteArray.read_uint64();
        goods_id = byteArray.read_uint64();
        wish_time.decode(byteArray);
        wish_type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_love_wish);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_love_wish();
    }
}

public class notify_wish_add : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_add;
    }
    public player_love_wish wish = new player_love_wish();
    public void encode(ByteArray byteArray)
    {
        wish.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        wish.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_add);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_add();
    }
}

public class notify_wish_add_fail : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_add_fail;
    }
    public string message = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(message);
    }

    public void decode(ByteArray byteArray)
    {
        message = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_add_fail);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_add_fail();
    }
}

public class req_wish_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_wish_delete;
    }
    public string account = "";
    public UInt64 wish_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(wish_id);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        wish_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_wish_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_wish_delete();
    }
}

public class notify_wish_delete : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_delete;
    }
    public UInt64 wish_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(wish_id);
    }

    public void decode(ByteArray byteArray)
    {
        wish_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_delete);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_delete();
    }
}

public class req_wish_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_wish_list;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_wish_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_wish_list();
    }
}

public class notify_wish_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_list;
    }
    public ArrayList wish_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)wish_list.Count);
        for(int i = 0; i < wish_list.Count; i++)
        {
            ((player_love_wish)wish_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfwish_list = byteArray.read_uint16();
        player_love_wish[] ArrayOfwish_list = new player_love_wish[CountOfwish_list];
        for(int i = 0; i < CountOfwish_list; i++)
        {
            ArrayOfwish_list[i] = new player_love_wish();
            ((player_love_wish)ArrayOfwish_list[i]).decode(byteArray);
        }
        wish_list.Clear();
        wish_list.AddRange(ArrayOfwish_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_list();
    }
}

public class player_love_wish_history : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_love_wish_history;
    }
    public UInt64 goods_id;
    public string satisfy_account = "";
    public int wish_type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(goods_id);
    	byteArray.Write(satisfy_account);
    	byteArray.Write(wish_type);
    }

    public void decode(ByteArray byteArray)
    {
        goods_id = byteArray.read_uint64();
        satisfy_account = byteArray.read_string();
        wish_type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_love_wish_history);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_love_wish_history();
    }
}

public class req_wish_history_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_wish_history_list;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_wish_history_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_wish_history_list();
    }
}

public class notify_wish_history_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_history_list;
    }
    public ArrayList history_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)history_list.Count);
        for(int i = 0; i < history_list.Count; i++)
        {
            ((player_love_wish_history)history_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfhistory_list = byteArray.read_uint16();
        player_love_wish_history[] ArrayOfhistory_list = new player_love_wish_history[CountOfhistory_list];
        for(int i = 0; i < CountOfhistory_list; i++)
        {
            ArrayOfhistory_list[i] = new player_love_wish_history();
            ((player_love_wish_history)ArrayOfhistory_list[i]).decode(byteArray);
        }
        history_list.Clear();
        history_list.AddRange(ArrayOfhistory_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_history_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_history_list();
    }
}

public class req_wish_satisfy : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_wish_satisfy;
    }
    public UInt64 wish_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(wish_id);
    }

    public void decode(ByteArray byteArray)
    {
        wish_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_wish_satisfy);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_wish_satisfy();
    }
}

public class notify_wish_satisfy_successfully : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_satisfy_successfully;
    }
    public UInt64 wish_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(wish_id);
    }

    public void decode(ByteArray byteArray)
    {
        wish_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_satisfy_successfully);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_satisfy_successfully();
    }
}

public class notify_wish_satisfy_fail : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_wish_satisfy_fail;
    }
    public UInt64 wish_id;
    public string message = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(wish_id);
    	byteArray.Write(message);
    }

    public void decode(ByteArray byteArray)
    {
        wish_id = byteArray.read_uint64();
        message = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_wish_satisfy_fail);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_wish_satisfy_fail();
    }
}

public class req_complete_share : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_complete_share;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_complete_share);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_complete_share();
    }
}

public class base_person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_base_person_info;
    }
    public int animal_type;
    public stime birthday = new stime();
    public int star;
    public int city;
    public int province;
    public int height;
    public int salary;
    public int blood_type;
    public string career = "";
    public int education;
    public string contact = "";
    public string interest = "";
    public int weight;
    public string signature = "";
    public string name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(animal_type);
        birthday.encode(byteArray);

    	byteArray.Write(star);
    	byteArray.Write(city);
    	byteArray.Write(province);
    	byteArray.Write(height);
    	byteArray.Write(salary);
    	byteArray.Write(blood_type);
    	byteArray.Write(career);
    	byteArray.Write(education);
    	byteArray.Write(contact);
    	byteArray.Write(interest);
    	byteArray.Write(weight);
    	byteArray.Write(signature);
    	byteArray.Write(name);
    }

    public void decode(ByteArray byteArray)
    {
        animal_type = byteArray.read_int();
        birthday.decode(byteArray);
        star = byteArray.read_int();
        city = byteArray.read_int();
        province = byteArray.read_int();
        height = byteArray.read_int();
        salary = byteArray.read_int();
        blood_type = byteArray.read_int();
        career = byteArray.read_string();
        education = byteArray.read_int();
        contact = byteArray.read_string();
        interest = byteArray.read_string();
        weight = byteArray.read_int();
        signature = byteArray.read_string();
        name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_base_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new base_person_info();
    }
}

public class req_change_person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_change_person_info;
    }
    public base_person_info info = new base_person_info();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_change_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_change_person_info();
    }
}

public class req_close_person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_close_person_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_close_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_close_person_info();
    }
}

public class person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_person_info;
    }
    public string account = "";
    public string username = "";
    public int sex;
    public base_person_info info = new base_person_info();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(username);
    	byteArray.Write(sex);
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        username = byteArray.read_string();
        sex = byteArray.read_int();
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new person_info();
    }
}

public class req_person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_person_info;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_person_info();
    }
}

public class notify_person_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_person_info;
    }
    public person_info info = new person_info();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_person_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_person_info();
    }
}

public class notify_show_buy_dialog : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_show_buy_dialog;
    }
    public string token = "";
    public string Params = "";
    public string context = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(token);
    	byteArray.Write(Params);
    	byteArray.Write(context);
    }

    public void decode(ByteArray byteArray)
    {
        token = byteArray.read_string();
        Params = byteArray.read_string();
        context = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_show_buy_dialog);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_show_buy_dialog();
    }
}

public class req_cancel_qq_order : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_cancel_qq_order;
    }
    public string context = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(context);
    }

    public void decode(ByteArray byteArray)
    {
        context = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_cancel_qq_order);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_cancel_qq_order();
    }
}

public class notify_cancel_order : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_cancel_order;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_cancel_order);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_cancel_order();
    }
}

public class req_vip_gift_receive_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_vip_gift_receive_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_vip_gift_receive_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_vip_gift_receive_info();
    }
}

public class notify_vip_gift_receive_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_vip_gift_receive_info;
    }
    public int beginner;
    public int daily;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(beginner);
    	byteArray.Write(daily);
    }

    public void decode(ByteArray byteArray)
    {
        beginner = byteArray.read_int();
        daily = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_vip_gift_receive_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_vip_gift_receive_info();
    }
}

public class vip_gift_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_vip_gift_item;
    }
    public int item_id;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_vip_gift_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new vip_gift_item();
    }
}

public class req_receive_vip_beginner_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_receive_vip_beginner_gift;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((vip_gift_item)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        vip_gift_item[] ArrayOfitems = new vip_gift_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new vip_gift_item();
            ((vip_gift_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_receive_vip_beginner_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_receive_vip_beginner_gift();
    }
}

public class req_receive_vip_daily_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_receive_vip_daily_gift;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((vip_gift_item)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        vip_gift_item[] ArrayOfitems = new vip_gift_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new vip_gift_item();
            ((vip_gift_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_receive_vip_daily_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_receive_vip_daily_gift();
    }
}

public class notify_vip_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_vip_gift;
    }
    public int status;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(status);
    }

    public void decode(ByteArray byteArray)
    {
        status = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_vip_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_vip_gift();
    }
}

public class login_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_login_info;
    }
    public stime login_date = new stime();
    public stime reward_date = new stime();
    public void encode(ByteArray byteArray)
    {
        login_date.encode(byteArray);

        reward_date.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        login_date.decode(byteArray);
        reward_date.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_login_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new login_info();
    }
}

public class req_give_login_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_give_login_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_give_login_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_give_login_reward();
    }
}

public class notify_give_login_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_give_login_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_give_login_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_give_login_reward();
    }
}

public class req_login_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_login_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_login_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_login_list();
    }
}

public class notify_login_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_login_list;
    }
    public ArrayList info = new ArrayList();
    public int type;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)info.Count);
        for(int i = 0; i < info.Count; i++)
        {
            ((login_info)info[i]).encode(byteArray);
        }
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfinfo = byteArray.read_uint16();
        login_info[] ArrayOfinfo = new login_info[CountOfinfo];
        for(int i = 0; i < CountOfinfo; i++)
        {
            ArrayOfinfo[i] = new login_info();
            ((login_info)ArrayOfinfo[i]).decode(byteArray);
        }
        info.Clear();
        info.AddRange(ArrayOfinfo);
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_login_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_login_list();
    }
}

public class req_offline_notify : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_offline_notify;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_offline_notify);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_offline_notify();
    }
}

public class notify_offline_notify : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_offline_notify;
    }
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_offline_notify);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_offline_notify();
    }
}

public class req_buy_house_right : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_buy_house_right;
    }
    public int grade;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(grade);
    }

    public void decode(ByteArray byteArray)
    {
        grade = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_buy_house_right);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_buy_house_right();
    }
}

public class notify_house_right_grade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_right_grade;
    }
    public int grade;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(grade);
    }

    public void decode(ByteArray byteArray)
    {
        grade = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_right_grade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_right_grade();
    }
}

public class req_unlock_special_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_special_house;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_special_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_special_house();
    }
}

public class notify_unlock_special_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_special_house;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_special_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_special_house();
    }
}

public class req_unlock_special_house_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_special_house_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_special_house_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_special_house_info();
    }
}

public class notify_unlock_special_house_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_special_house_info;
    }
    public ArrayList ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)ids.Count);
        for(int i = 0; i < ids.Count; i++)
        {
            byteArray.Write((int)ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        ids.Clear();
        int CountOfids = byteArray.read_uint16();
        for(int i = 0; i < CountOfids; i++)
        {
             ids.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_special_house_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_special_house_info();
    }
}

public class special_house_goods : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_special_house_goods;
    }
    public int id;
    public int house_tplt_id;
    public int remain_count;
    public int q_coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(house_tplt_id);
    	byteArray.Write(remain_count);
    	byteArray.Write(q_coin);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        house_tplt_id = byteArray.read_int();
        remain_count = byteArray.read_int();
        q_coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_special_house_goods);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new special_house_goods();
    }
}

public class req_special_house_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_special_house_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_special_house_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_special_house_list();
    }
}

public class notify_special_house_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_special_house_list;
    }
    public ArrayList house_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)house_list.Count);
        for(int i = 0; i < house_list.Count; i++)
        {
            ((special_house_goods)house_list[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfhouse_list = byteArray.read_uint16();
        special_house_goods[] ArrayOfhouse_list = new special_house_goods[CountOfhouse_list];
        for(int i = 0; i < CountOfhouse_list; i++)
        {
            ArrayOfhouse_list[i] = new special_house_goods();
            ((special_house_goods)ArrayOfhouse_list[i]).decode(byteArray);
        }
        house_list.Clear();
        house_list.AddRange(ArrayOfhouse_list);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_special_house_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_special_house_list();
    }
}

public class notify_buy_special_house_success : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_buy_special_house_success;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_buy_special_house_success);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_buy_special_house_success();
    }
}

public class req_self_special_house_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_self_special_house_list;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_self_special_house_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_self_special_house_list();
    }
}

public class notify_self_special_house_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_self_special_house_list;
    }
    public ArrayList house_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)house_list.Count);
        for(int i = 0; i < house_list.Count; i++)
        {
            byteArray.Write((int)house_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        house_list.Clear();
        int CountOfhouse_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfhouse_list; i++)
        {
             house_list.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_self_special_house_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_self_special_house_list();
    }
}

public class req_buy_special_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_buy_special_house;
    }
    public int house_tplt_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_tplt_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_tplt_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_buy_special_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_buy_special_house();
    }
}

public class req_move_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_move_house;
    }
    public int new_house_tplt_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(new_house_tplt_id);
    }

    public void decode(ByteArray byteArray)
    {
        new_house_tplt_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_move_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_move_house();
    }
}

public class notify_move_house_success : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_move_house_success;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_move_house_success);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_move_house_success();
    }
}

public class req_get_free_count_for_moving_special_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_free_count_for_moving_special_house;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_free_count_for_moving_special_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_free_count_for_moving_special_house();
    }
}

public class notify_get_free_count_for_moving_special_house : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_get_free_count_for_moving_special_house;
    }
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_get_free_count_for_moving_special_house);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_get_free_count_for_moving_special_house();
    }
}

public class req_invite_active : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_invite_active;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_invite_active);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_invite_active();
    }
}

public class notify_invite_active : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_invite_active;
    }
    public int count;
    public ArrayList invite_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
        byteArray.Write((UInt16)invite_list.Count);
        for(int i = 0; i < invite_list.Count; i++)
        {
            byteArray.Write((string)invite_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
        invite_list.Clear();
        int CountOfinvite_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfinvite_list; i++)
        {
             invite_list.Add(byteArray.read_string());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_invite_active);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_invite_active();
    }
}

public class req_invite_award : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_invite_award;
    }
    public int count;
    public int diamond;
    public int item_id;
    public ArrayList invite_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(count);
    	byteArray.Write(diamond);
    	byteArray.Write(item_id);
        byteArray.Write((UInt16)invite_list.Count);
        for(int i = 0; i < invite_list.Count; i++)
        {
            byteArray.Write((string)invite_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        count = byteArray.read_int();
        diamond = byteArray.read_int();
        item_id = byteArray.read_int();
        invite_list.Clear();
        int CountOfinvite_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfinvite_list; i++)
        {
             invite_list.Add(byteArray.read_string());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_invite_award);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_invite_award();
    }
}

public class notify_invite_award : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_invite_award;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_invite_award);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_invite_award();
    }
}

public class req_open_search_items_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_open_search_items_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_open_search_items_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_open_search_items_ui();
    }
}

public class notify_open_search_items_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_search_items_ui;
    }
    public int rate;
    public int item_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(rate);
    	byteArray.Write(item_count);
    }

    public void decode(ByteArray byteArray)
    {
        rate = byteArray.read_int();
        item_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_search_items_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_search_items_ui();
    }
}

public class req_search_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_search_items;
    }
    public int is_npc;
    public string friend_account = "";
    public string friend_name = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(is_npc);
    	byteArray.Write(friend_account);
    	byteArray.Write(friend_name);
    }

    public void decode(ByteArray byteArray)
    {
        is_npc = byteArray.read_int();
        friend_account = byteArray.read_string();
        friend_name = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_search_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_search_items();
    }
}

public class notify_searching_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_searching_items;
    }
    public int is_npc;
    public string friend_account = "";
    public string friend_name = "";
    public int remain_seconds;
    public int whip_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(is_npc);
    	byteArray.Write(friend_account);
    	byteArray.Write(friend_name);
    	byteArray.Write(remain_seconds);
    	byteArray.Write(whip_count);
    }

    public void decode(ByteArray byteArray)
    {
        is_npc = byteArray.read_int();
        friend_account = byteArray.read_string();
        friend_name = byteArray.read_string();
        remain_seconds = byteArray.read_int();
        whip_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_searching_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_searching_items();
    }
}

public class req_quick_search_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_quick_search_items;
    }
    public int whip_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(whip_count);
    }

    public void decode(ByteArray byteArray)
    {
        whip_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_quick_search_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_quick_search_items();
    }
}

public class req_whip : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_whip;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_whip);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_whip();
    }
}

public class notify_search_items_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_search_items_result;
    }
    public int is_npc;
    public string friend_account = "";
    public string friend_name = "";
    public int grid_count;
    public ArrayList gain_items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(is_npc);
    	byteArray.Write(friend_account);
    	byteArray.Write(friend_name);
    	byteArray.Write(grid_count);
        byteArray.Write((UInt16)gain_items.Count);
        for(int i = 0; i < gain_items.Count; i++)
        {
            ((vip_gift_item)gain_items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        is_npc = byteArray.read_int();
        friend_account = byteArray.read_string();
        friend_name = byteArray.read_string();
        grid_count = byteArray.read_int();
        int CountOfgain_items = byteArray.read_uint16();
        vip_gift_item[] ArrayOfgain_items = new vip_gift_item[CountOfgain_items];
        for(int i = 0; i < CountOfgain_items; i++)
        {
            ArrayOfgain_items[i] = new vip_gift_item();
            ((vip_gift_item)ArrayOfgain_items[i]).decode(byteArray);
        }
        gain_items.Clear();
        gain_items.AddRange(ArrayOfgain_items);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_search_items_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_search_items_result();
    }
}

public class notify_new_self_msgs : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_new_self_msgs;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_new_self_msgs);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_new_self_msgs();
    }
}

public class hire_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_hire_msg;
    }
    public stime time = new stime();
    public int is_npc;
    public string friend_account = "";
    public int cost_money;
    public void encode(ByteArray byteArray)
    {
        time.encode(byteArray);

    	byteArray.Write(is_npc);
    	byteArray.Write(friend_account);
    	byteArray.Write(cost_money);
    }

    public void decode(ByteArray byteArray)
    {
        time.decode(byteArray);
        is_npc = byteArray.read_int();
        friend_account = byteArray.read_string();
        cost_money = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_hire_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new hire_msg();
    }
}

public class be_hire_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_be_hire_msg;
    }
    public stime time = new stime();
    public string friend_account = "";
    public int gain_exp;
    public void encode(ByteArray byteArray)
    {
        time.encode(byteArray);

    	byteArray.Write(friend_account);
    	byteArray.Write(gain_exp);
    }

    public void decode(ByteArray byteArray)
    {
        time.decode(byteArray);
        friend_account = byteArray.read_string();
        gain_exp = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_be_hire_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new be_hire_msg();
    }
}

public class be_whip_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_be_whip_msg;
    }
    public stime time = new stime();
    public string friend_account = "";
    public void encode(ByteArray byteArray)
    {
        time.encode(byteArray);

    	byteArray.Write(friend_account);
    }

    public void decode(ByteArray byteArray)
    {
        time.decode(byteArray);
        friend_account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_be_whip_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new be_whip_msg();
    }
}

public class whip_msg : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_whip_msg;
    }
    public stime time = new stime();
    public string account = "";
    public int is_npc;
    public int whip_count;
    public string friend_account = "";
    public void encode(ByteArray byteArray)
    {
        time.encode(byteArray);

    	byteArray.Write(account);
    	byteArray.Write(is_npc);
    	byteArray.Write(whip_count);
    	byteArray.Write(friend_account);
    }

    public void decode(ByteArray byteArray)
    {
        time.decode(byteArray);
        account = byteArray.read_string();
        is_npc = byteArray.read_int();
        whip_count = byteArray.read_int();
        friend_account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_whip_msg);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new whip_msg();
    }
}

public class req_self_msgs : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_self_msgs;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_self_msgs);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_self_msgs();
    }
}

public class notify_self_msgs : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_self_msgs;
    }
    public ArrayList hire_msgs = new ArrayList();
    public ArrayList be_hire_msgs = new ArrayList();
    public ArrayList be_whip_msgs = new ArrayList();
    public ArrayList whip_msgs = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)hire_msgs.Count);
        for(int i = 0; i < hire_msgs.Count; i++)
        {
            ((hire_msg)hire_msgs[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)be_hire_msgs.Count);
        for(int i = 0; i < be_hire_msgs.Count; i++)
        {
            ((be_hire_msg)be_hire_msgs[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)be_whip_msgs.Count);
        for(int i = 0; i < be_whip_msgs.Count; i++)
        {
            ((be_whip_msg)be_whip_msgs[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)whip_msgs.Count);
        for(int i = 0; i < whip_msgs.Count; i++)
        {
            ((whip_msg)whip_msgs[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfhire_msgs = byteArray.read_uint16();
        hire_msg[] ArrayOfhire_msgs = new hire_msg[CountOfhire_msgs];
        for(int i = 0; i < CountOfhire_msgs; i++)
        {
            ArrayOfhire_msgs[i] = new hire_msg();
            ((hire_msg)ArrayOfhire_msgs[i]).decode(byteArray);
        }
        hire_msgs.Clear();
        hire_msgs.AddRange(ArrayOfhire_msgs);
        int CountOfbe_hire_msgs = byteArray.read_uint16();
        be_hire_msg[] ArrayOfbe_hire_msgs = new be_hire_msg[CountOfbe_hire_msgs];
        for(int i = 0; i < CountOfbe_hire_msgs; i++)
        {
            ArrayOfbe_hire_msgs[i] = new be_hire_msg();
            ((be_hire_msg)ArrayOfbe_hire_msgs[i]).decode(byteArray);
        }
        be_hire_msgs.Clear();
        be_hire_msgs.AddRange(ArrayOfbe_hire_msgs);
        int CountOfbe_whip_msgs = byteArray.read_uint16();
        be_whip_msg[] ArrayOfbe_whip_msgs = new be_whip_msg[CountOfbe_whip_msgs];
        for(int i = 0; i < CountOfbe_whip_msgs; i++)
        {
            ArrayOfbe_whip_msgs[i] = new be_whip_msg();
            ((be_whip_msg)ArrayOfbe_whip_msgs[i]).decode(byteArray);
        }
        be_whip_msgs.Clear();
        be_whip_msgs.AddRange(ArrayOfbe_whip_msgs);
        int CountOfwhip_msgs = byteArray.read_uint16();
        whip_msg[] ArrayOfwhip_msgs = new whip_msg[CountOfwhip_msgs];
        for(int i = 0; i < CountOfwhip_msgs; i++)
        {
            ArrayOfwhip_msgs[i] = new whip_msg();
            ((whip_msg)ArrayOfwhip_msgs[i]).decode(byteArray);
        }
        whip_msgs.Clear();
        whip_msgs.AddRange(ArrayOfwhip_msgs);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_self_msgs);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_self_msgs();
    }
}

public class req_update_search_items : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_update_search_items;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_update_search_items);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_update_search_items();
    }
}

public class notify_polymorph_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_polymorph_result;
    }
    public string account = "";
    public polymorph alter_body = new polymorph();
    public string message = "";
    public string user = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        alter_body.encode(byteArray);

    	byteArray.Write(message);
    	byteArray.Write(user);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        alter_body.decode(byteArray);
        message = byteArray.read_string();
        user = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_polymorph_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_polymorph_result();
    }
}

public class req_purify_polymorph : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_purify_polymorph;
    }
    public string target_account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(target_account);
    }

    public void decode(ByteArray byteArray)
    {
        target_account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_purify_polymorph);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_purify_polymorph();
    }
}

public class req_player_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_info;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_info();
    }
}

public class notify_player_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_info;
    }
    public player_basic_data player = new player_basic_data();
    public void encode(ByteArray byteArray)
    {
        player.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        player.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_info();
    }
}

public class req_produce : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_produce;
    }
    public UInt64 produce_manual_id;
    public int lucky_stone_count;
    public int has_insurance;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(produce_manual_id);
    	byteArray.Write(lucky_stone_count);
    	byteArray.Write(has_insurance);
    }

    public void decode(ByteArray byteArray)
    {
        produce_manual_id = byteArray.read_uint64();
        lucky_stone_count = byteArray.read_int();
        has_insurance = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_produce);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_produce();
    }
}

public class notify_produce_ack : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_produce_ack;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_produce_ack);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_produce_ack();
    }
}

public class notify_produce : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_produce;
    }
    public int result;
    public string message = "";
    public item finished = new item();
    public player_basic_data player = new player_basic_data();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    	byteArray.Write(message);
        finished.encode(byteArray);

        player.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
        message = byteArray.read_string();
        finished.decode(byteArray);
        player.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_produce);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_produce();
    }
}

public class notify_produce_level : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_produce_level;
    }
    public int level;
    public int experience;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(level);
    	byteArray.Write(experience);
    }

    public void decode(ByteArray byteArray)
    {
        level = byteArray.read_int();
        experience = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_produce_level);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_produce_level();
    }
}

public class req_ranking : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_ranking;
    }
    public int type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_ranking);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_ranking();
    }
}

public class ranking_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_ranking_data;
    }
    public string account = "";
    public int data;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(data);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        data = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_ranking_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new ranking_data();
    }
}

public class notify_ranking : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_ranking;
    }
    public int type;
    public int self_ranking;
    public ArrayList data = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(type);
    	byteArray.Write(self_ranking);
        byteArray.Write((UInt16)data.Count);
        for(int i = 0; i < data.Count; i++)
        {
            ((ranking_data)data[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        type = byteArray.read_int();
        self_ranking = byteArray.read_int();
        int CountOfdata = byteArray.read_uint16();
        ranking_data[] ArrayOfdata = new ranking_data[CountOfdata];
        for(int i = 0; i < CountOfdata; i++)
        {
            ArrayOfdata[i] = new ranking_data();
            ((ranking_data)ArrayOfdata[i]).decode(byteArray);
        }
        data.Clear();
        data.AddRange(ArrayOfdata);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_ranking);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_ranking();
    }
}

public class req_score_ranking : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_score_ranking;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_score_ranking);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_score_ranking();
    }
}

public class notify_score_ranking : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_score_ranking;
    }
    public int self_score;
    public ArrayList data = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(self_score);
        byteArray.Write((UInt16)data.Count);
        for(int i = 0; i < data.Count; i++)
        {
            ((ranking_data)data[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        self_score = byteArray.read_int();
        int CountOfdata = byteArray.read_uint16();
        ranking_data[] ArrayOfdata = new ranking_data[CountOfdata];
        for(int i = 0; i < CountOfdata; i++)
        {
            ArrayOfdata[i] = new ranking_data();
            ((ranking_data)ArrayOfdata[i]).decode(byteArray);
        }
        data.Clear();
        data.AddRange(ArrayOfdata);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_score_ranking);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_score_ranking();
    }
}

public class req_set_guest_book_opened : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_set_guest_book_opened;
    }
    public UInt64 id;
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_uint64();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_set_guest_book_opened);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_set_guest_book_opened();
    }
}

public class notify_set_guest_book_opened : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_set_guest_book_opened;
    }
    public UInt64 id;
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_uint64();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_set_guest_book_opened);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_set_guest_book_opened();
    }
}

public class req_set_checkin_opened : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_set_checkin_opened;
    }
    public string id = "";
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_string();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_set_checkin_opened);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_set_checkin_opened();
    }
}

public class notify_set_checkin_opened : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_set_checkin_opened;
    }
    public string id = "";
    public int opened;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(opened);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_string();
        opened = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_set_checkin_opened);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_set_checkin_opened();
    }
}

public class crop_event : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_crop_event;
    }
    public int id;
    public int type;
    public int time;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(type);
    	byteArray.Write(time);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        type = byteArray.read_int();
        time = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_crop_event);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new crop_event();
    }
}

public class crop_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_crop_data;
    }
    public UInt64 inst_id;
    public int item_id;
    public int rest_time;
    public ArrayList fruit_id = new ArrayList();
    public ArrayList fruit_count = new ArrayList();
    public ArrayList evt = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(inst_id);
    	byteArray.Write(item_id);
    	byteArray.Write(rest_time);
        byteArray.Write((UInt16)fruit_id.Count);
        for(int i = 0; i < fruit_id.Count; i++)
        {
            byteArray.Write((int)fruit_id[i]);
        }
        byteArray.Write((UInt16)fruit_count.Count);
        for(int i = 0; i < fruit_count.Count; i++)
        {
            byteArray.Write((int)fruit_count[i]);
        }
        byteArray.Write((UInt16)evt.Count);
        for(int i = 0; i < evt.Count; i++)
        {
            ((crop_event)evt[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        inst_id = byteArray.read_uint64();
        item_id = byteArray.read_int();
        rest_time = byteArray.read_int();
        fruit_id.Clear();
        int CountOffruit_id = byteArray.read_uint16();
        for(int i = 0; i < CountOffruit_id; i++)
        {
             fruit_id.Add(byteArray.read_int());
        }
        fruit_count.Clear();
        int CountOffruit_count = byteArray.read_uint16();
        for(int i = 0; i < CountOffruit_count; i++)
        {
             fruit_count.Add(byteArray.read_int());
        }
        int CountOfevt = byteArray.read_uint16();
        crop_event[] ArrayOfevt = new crop_event[CountOfevt];
        for(int i = 0; i < CountOfevt; i++)
        {
            ArrayOfevt[i] = new crop_event();
            ((crop_event)ArrayOfevt[i]).decode(byteArray);
        }
        evt.Clear();
        evt.AddRange(ArrayOfevt);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_crop_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new crop_data();
    }
}

public class req_plant_crop : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_plant_crop;
    }
    public UInt64 flowerpot_id;
    public UInt64 seed_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(flowerpot_id);
    	byteArray.Write(seed_id);
    }

    public void decode(ByteArray byteArray)
    {
        flowerpot_id = byteArray.read_uint64();
        seed_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_plant_crop);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_plant_crop();
    }
}

public class notify_farm_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_farm_data;
    }
    public UInt64 house_id;
    public ArrayList crops = new ArrayList();
    public int water_limit;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
        byteArray.Write((UInt16)crops.Count);
        for(int i = 0; i < crops.Count; i++)
        {
            ((crop_data)crops[i]).encode(byteArray);
        }
    	byteArray.Write(water_limit);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        int CountOfcrops = byteArray.read_uint16();
        crop_data[] ArrayOfcrops = new crop_data[CountOfcrops];
        for(int i = 0; i < CountOfcrops; i++)
        {
            ArrayOfcrops[i] = new crop_data();
            ((crop_data)ArrayOfcrops[i]).decode(byteArray);
        }
        crops.Clear();
        crops.AddRange(ArrayOfcrops);
        water_limit = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_farm_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_farm_data();
    }
}

public class req_crop_event : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_crop_event;
    }
    public UInt64 house_id;
    public UInt64 inst_id;
    public int event_type;
    public int event_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(inst_id);
    	byteArray.Write(event_type);
    	byteArray.Write(event_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        inst_id = byteArray.read_uint64();
        event_type = byteArray.read_int();
        event_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_crop_event);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_crop_event();
    }
}

public class req_all_crop_event : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_all_crop_event;
    }
    public UInt64 house_id;
    public int event_type;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(event_type);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        event_type = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_all_crop_event);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_all_crop_event();
    }
}

public class req_delete_crop : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_delete_crop;
    }
    public UInt64 crop_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(crop_id);
    }

    public void decode(ByteArray byteArray)
    {
        crop_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_delete_crop);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_delete_crop();
    }
}

public class notify_delete_crop : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_delete_crop;
    }
    public UInt64 crop_id;
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(crop_id);
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        crop_id = byteArray.read_uint64();
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_delete_crop);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_delete_crop();
    }
}

public class notify_crop_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_crop_data;
    }
    public UInt64 house_id;
    public int op;
    public crop_data crop = new crop_data();
    public int water_limit;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(op);
        crop.encode(byteArray);

    	byteArray.Write(water_limit);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        op = byteArray.read_int();
        crop.decode(byteArray);
        water_limit = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_crop_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_crop_data();
    }
}

public class req_pick_crop_fruit : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_pick_crop_fruit;
    }
    public UInt64 crop_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(crop_id);
    }

    public void decode(ByteArray byteArray)
    {
        crop_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_pick_crop_fruit);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_pick_crop_fruit();
    }
}

public class notify_pick_crop_fruit : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_pick_crop_fruit;
    }
    public UInt64 house_id;
    public UInt64 crop_id;
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(crop_id);
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        crop_id = byteArray.read_uint64();
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_pick_crop_fruit);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_pick_crop_fruit();
    }
}

public class req_house_max_flowerpot : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_house_max_flowerpot;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_house_max_flowerpot);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_house_max_flowerpot();
    }
}

public class notify_house_max_flowerpot : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_house_max_flowerpot;
    }
    public UInt64 house_id;
    public int owner_number;
    public int max_number;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(owner_number);
    	byteArray.Write(max_number);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        owner_number = byteArray.read_int();
        max_number = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_house_max_flowerpot);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_house_max_flowerpot();
    }
}

public class req_add_flowerpot_number : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_add_flowerpot_number;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_add_flowerpot_number);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_add_flowerpot_number();
    }
}

public class req_breakup : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_breakup;
    }
    public int diamond;
    public ArrayList expect_items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(diamond);
        byteArray.Write((UInt16)expect_items.Count);
        for(int i = 0; i < expect_items.Count; i++)
        {
            ((item)expect_items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        diamond = byteArray.read_int();
        int CountOfexpect_items = byteArray.read_uint16();
        item[] ArrayOfexpect_items = new item[CountOfexpect_items];
        for(int i = 0; i < CountOfexpect_items; i++)
        {
            ArrayOfexpect_items[i] = new item();
            ((item)ArrayOfexpect_items[i]).decode(byteArray);
        }
        expect_items.Clear();
        expect_items.AddRange(ArrayOfexpect_items);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_breakup);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_breakup();
    }
}

public class notify_breakup_ack : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_breakup_ack;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_breakup_ack);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_breakup_ack();
    }
}

public class notify_breakup_error : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_breakup_error;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_breakup_error);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_breakup_error();
    }
}

public class req_player_breakup : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_breakup;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_breakup);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_breakup();
    }
}

public class notify_player_breakup_none : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_breakup_none;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_breakup_none);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_breakup_none();
    }
}

public class notify_player_breakup : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_breakup;
    }
    public string account = "";
    public int diamond;
    public ArrayList unobtained_items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(diamond);
        byteArray.Write((UInt16)unobtained_items.Count);
        for(int i = 0; i < unobtained_items.Count; i++)
        {
            byteArray.Write((int)unobtained_items[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        diamond = byteArray.read_int();
        unobtained_items.Clear();
        int CountOfunobtained_items = byteArray.read_uint16();
        for(int i = 0; i < CountOfunobtained_items; i++)
        {
             unobtained_items.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_breakup);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_breakup();
    }
}

public class req_player_breakup_diamond : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_player_breakup_diamond;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_player_breakup_diamond);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_player_breakup_diamond();
    }
}

public class notify_player_breakup_diamond : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_breakup_diamond;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_breakup_diamond);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_breakup_diamond();
    }
}

public class notify_player_be_breakuped : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_be_breakuped;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_be_breakuped);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_be_breakuped();
    }
}

public class require_item_atom : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_require_item_atom;
    }
    public int item_id;
    public int item_count;
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    	byteArray.Write(item_count);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
        item_count = byteArray.read_int();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_require_item_atom);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new require_item_atom();
    }
}

public class reward_item_atom : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_reward_item_atom;
    }
    public int item_id;
    public int item_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(item_id);
    	byteArray.Write(item_count);
    }

    public void decode(ByteArray byteArray)
    {
        item_id = byteArray.read_int();
        item_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_reward_item_atom);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new reward_item_atom();
    }
}

public class req_open_post_reward_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_open_post_reward_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_open_post_reward_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_open_post_reward_ui();
    }
}

public class notify_open_post_reward_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_post_reward_ui;
    }
    public string content = "";
    public ArrayList require_items = new ArrayList();
    public ArrayList reward_items = new ArrayList();
    public int reward_diamond;
    public int reward_exp;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(content);
        byteArray.Write((UInt16)require_items.Count);
        for(int i = 0; i < require_items.Count; i++)
        {
            ((require_item_atom)require_items[i]).encode(byteArray);
        }
        byteArray.Write((UInt16)reward_items.Count);
        for(int i = 0; i < reward_items.Count; i++)
        {
            ((reward_item_atom)reward_items[i]).encode(byteArray);
        }
    	byteArray.Write(reward_diamond);
    	byteArray.Write(reward_exp);
    }

    public void decode(ByteArray byteArray)
    {
        content = byteArray.read_string();
        int CountOfrequire_items = byteArray.read_uint16();
        require_item_atom[] ArrayOfrequire_items = new require_item_atom[CountOfrequire_items];
        for(int i = 0; i < CountOfrequire_items; i++)
        {
            ArrayOfrequire_items[i] = new require_item_atom();
            ((require_item_atom)ArrayOfrequire_items[i]).decode(byteArray);
        }
        require_items.Clear();
        require_items.AddRange(ArrayOfrequire_items);
        int CountOfreward_items = byteArray.read_uint16();
        reward_item_atom[] ArrayOfreward_items = new reward_item_atom[CountOfreward_items];
        for(int i = 0; i < CountOfreward_items; i++)
        {
            ArrayOfreward_items[i] = new reward_item_atom();
            ((reward_item_atom)ArrayOfreward_items[i]).decode(byteArray);
        }
        reward_items.Clear();
        reward_items.AddRange(ArrayOfreward_items);
        reward_diamond = byteArray.read_int();
        reward_exp = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_post_reward_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_post_reward_ui();
    }
}

public class req_complete_post_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_complete_post_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_complete_post_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_complete_post_reward();
    }
}

public class notify_complete_post_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_complete_post_reward;
    }
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_complete_post_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_complete_post_reward();
    }
}

public class notify_active_score_lottery : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_active_score_lottery;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_active_score_lottery);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_active_score_lottery();
    }
}

public class req_open_score_lottery_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_open_score_lottery_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_open_score_lottery_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_open_score_lottery_ui();
    }
}

public class notify_open_score_lottery_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_open_score_lottery_ui;
    }
    public ArrayList items = new ArrayList();
    public int remain_count;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((lottery_item)items[i]).encode(byteArray);
        }
    	byteArray.Write(remain_count);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        lottery_item[] ArrayOfitems = new lottery_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new lottery_item();
            ((lottery_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
        remain_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_open_score_lottery_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_open_score_lottery_ui();
    }
}

public class req_score_lottery : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_score_lottery;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_score_lottery);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_score_lottery();
    }
}

public class notify_score_lottery_result : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_score_lottery_result;
    }
    public ArrayList items = new ArrayList();
    public int hit_index;
    public int remain_count;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((lottery_item)items[i]).encode(byteArray);
        }
    	byteArray.Write(hit_index);
    	byteArray.Write(remain_count);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        lottery_item[] ArrayOfitems = new lottery_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new lottery_item();
            ((lottery_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
        hit_index = byteArray.read_int();
        remain_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_score_lottery_result);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_score_lottery_result();
    }
}

public class req_refresh_score_lottery_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_refresh_score_lottery_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_refresh_score_lottery_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_refresh_score_lottery_ui();
    }
}

public class notify_refresh_score_lottery_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_refresh_score_lottery_ui;
    }
    public ArrayList items = new ArrayList();
    public int remain_count;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((lottery_item)items[i]).encode(byteArray);
        }
    	byteArray.Write(remain_count);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        lottery_item[] ArrayOfitems = new lottery_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new lottery_item();
            ((lottery_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
        remain_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_refresh_score_lottery_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_refresh_score_lottery_ui();
    }
}

public class req_daily_reward_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_daily_reward_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_daily_reward_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_daily_reward_ui();
    }
}

public class notify_daily_reward_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_daily_reward_ui;
    }
    public ArrayList progress_list = new ArrayList();
    public ArrayList reward_score_list = new ArrayList();
    public ArrayList has_reward_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)progress_list.Count);
        for(int i = 0; i < progress_list.Count; i++)
        {
            byteArray.Write((int)progress_list[i]);
        }
        byteArray.Write((UInt16)reward_score_list.Count);
        for(int i = 0; i < reward_score_list.Count; i++)
        {
            byteArray.Write((int)reward_score_list[i]);
        }
        byteArray.Write((UInt16)has_reward_list.Count);
        for(int i = 0; i < has_reward_list.Count; i++)
        {
            byteArray.Write((int)has_reward_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        progress_list.Clear();
        int CountOfprogress_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfprogress_list; i++)
        {
             progress_list.Add(byteArray.read_int());
        }
        reward_score_list.Clear();
        int CountOfreward_score_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfreward_score_list; i++)
        {
             reward_score_list.Add(byteArray.read_int());
        }
        has_reward_list.Clear();
        int CountOfhas_reward_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfhas_reward_list; i++)
        {
             has_reward_list.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_daily_reward_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_daily_reward_ui();
    }
}

public class req_daily_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_daily_reward;
    }
    public int score;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(score);
    }

    public void decode(ByteArray byteArray)
    {
        score = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_daily_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_daily_reward();
    }
}

public class notify_daily_active_can_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_daily_active_can_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_daily_active_can_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_daily_active_can_reward();
    }
}

public class req_close_daily_reward_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_close_daily_reward_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_close_daily_reward_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_close_daily_reward_ui();
    }
}

public class req_immediate_complete_daily_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_immediate_complete_daily_reward;
    }
    public int index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(index);
    }

    public void decode(ByteArray byteArray)
    {
        index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_immediate_complete_daily_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_immediate_complete_daily_reward();
    }
}

public class req_open_daily_task_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_open_daily_task_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_open_daily_task_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_open_daily_task_ui();
    }
}

public class req_close_daily_task_ui : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_close_daily_task_ui;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_close_daily_task_ui);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_close_daily_task_ui();
    }
}

public class req_get_buff : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_buff;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_buff);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_buff();
    }
}

public class player_buff_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_player_buff_data;
    }
    public int id;
    public int rest_time;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(rest_time);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        rest_time = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_player_buff_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new player_buff_data();
    }
}

public class notify_player_buff : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_player_buff;
    }
    public string account = "";
    public ArrayList buffs = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
        byteArray.Write((UInt16)buffs.Count);
        for(int i = 0; i < buffs.Count; i++)
        {
            ((player_buff_data)buffs[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        int CountOfbuffs = byteArray.read_uint16();
        player_buff_data[] ArrayOfbuffs = new player_buff_data[CountOfbuffs];
        for(int i = 0; i < CountOfbuffs; i++)
        {
            ArrayOfbuffs[i] = new player_buff_data();
            ((player_buff_data)ArrayOfbuffs[i]).decode(byteArray);
        }
        buffs.Clear();
        buffs.AddRange(ArrayOfbuffs);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_player_buff);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_player_buff();
    }
}

public class notify_add_buff : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_add_buff;
    }
    public player_buff_data buff = new player_buff_data();
    public void encode(ByteArray byteArray)
    {
        buff.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        buff.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_add_buff);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_add_buff();
    }
}

public class pub_account_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_pub_account_info;
    }
    public string account = "";
    public string name = "";
    public int level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(name);
    	byteArray.Write(level);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        name = byteArray.read_string();
        level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_pub_account_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new pub_account_info();
    }
}

public class pub_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_pub_info;
    }
    public UInt64 pub_id;
    public pub_account_info owner_info = new pub_account_info();
    public string pub_name = "";
    public int person_count1;
    public int person_count2;
    public int max_person;
    public int status;
    public ArrayList admin_list = new ArrayList();
    public UInt64 voice_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pub_id);
        owner_info.encode(byteArray);

    	byteArray.Write(pub_name);
    	byteArray.Write(person_count1);
    	byteArray.Write(person_count2);
    	byteArray.Write(max_person);
    	byteArray.Write(status);
        byteArray.Write((UInt16)admin_list.Count);
        for(int i = 0; i < admin_list.Count; i++)
        {
            ((pub_account_info)admin_list[i]).encode(byteArray);
        }
    	byteArray.Write(voice_id);
    }

    public void decode(ByteArray byteArray)
    {
        pub_id = byteArray.read_uint64();
        owner_info.decode(byteArray);
        pub_name = byteArray.read_string();
        person_count1 = byteArray.read_int();
        person_count2 = byteArray.read_int();
        max_person = byteArray.read_int();
        status = byteArray.read_int();
        int CountOfadmin_list = byteArray.read_uint16();
        pub_account_info[] ArrayOfadmin_list = new pub_account_info[CountOfadmin_list];
        for(int i = 0; i < CountOfadmin_list; i++)
        {
            ArrayOfadmin_list[i] = new pub_account_info();
            ((pub_account_info)ArrayOfadmin_list[i]).decode(byteArray);
        }
        admin_list.Clear();
        admin_list.AddRange(ArrayOfadmin_list);
        voice_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_pub_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new pub_info();
    }
}

public class req_pub_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_pub_list;
    }
    public int page;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(page);
    }

    public void decode(ByteArray byteArray)
    {
        page = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_pub_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_pub_list();
    }
}

public class notify_pub_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_pub_list;
    }
    public UInt64 my_channel_id;
    public int max_page;
    public ArrayList pubs = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(my_channel_id);
    	byteArray.Write(max_page);
        byteArray.Write((UInt16)pubs.Count);
        for(int i = 0; i < pubs.Count; i++)
        {
            ((pub_info)pubs[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        my_channel_id = byteArray.read_uint64();
        max_page = byteArray.read_int();
        int CountOfpubs = byteArray.read_uint16();
        pub_info[] ArrayOfpubs = new pub_info[CountOfpubs];
        for(int i = 0; i < CountOfpubs; i++)
        {
            ArrayOfpubs[i] = new pub_info();
            ((pub_info)ArrayOfpubs[i]).decode(byteArray);
        }
        pubs.Clear();
        pubs.AddRange(ArrayOfpubs);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_pub_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_pub_list();
    }
}

public class req_leave_pub_channel : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_leave_pub_channel;
    }
    public UInt64 pub_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pub_id);
    }

    public void decode(ByteArray byteArray)
    {
        pub_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_leave_pub_channel);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_leave_pub_channel();
    }
}

public class req_enter_pub_channel : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_enter_pub_channel;
    }
    public UInt64 pub_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pub_id);
    }

    public void decode(ByteArray byteArray)
    {
        pub_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_enter_pub_channel);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_enter_pub_channel();
    }
}

public class notify_enter_pub_channel : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_enter_pub_channel;
    }
    public pub_info info = new pub_info();
    public ArrayList accounts = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        info.encode(byteArray);

        byteArray.Write((UInt16)accounts.Count);
        for(int i = 0; i < accounts.Count; i++)
        {
            ((pub_account_info)accounts[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        info.decode(byteArray);
        int CountOfaccounts = byteArray.read_uint16();
        pub_account_info[] ArrayOfaccounts = new pub_account_info[CountOfaccounts];
        for(int i = 0; i < CountOfaccounts; i++)
        {
            ArrayOfaccounts[i] = new pub_account_info();
            ((pub_account_info)ArrayOfaccounts[i]).decode(byteArray);
        }
        accounts.Clear();
        accounts.AddRange(ArrayOfaccounts);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_enter_pub_channel);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_enter_pub_channel();
    }
}

public class req_update_pub_voice_id : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_update_pub_voice_id;
    }
    public UInt64 pub_id;
    public UInt64 voice_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pub_id);
    	byteArray.Write(voice_id);
    }

    public void decode(ByteArray byteArray)
    {
        pub_id = byteArray.read_uint64();
        voice_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_update_pub_voice_id);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_update_pub_voice_id();
    }
}

public class notify_update_pub_voice_id : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_pub_voice_id;
    }
    public UInt64 pub_id;
    public UInt64 voice_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(pub_id);
    	byteArray.Write(voice_id);
    }

    public void decode(ByteArray byteArray)
    {
        pub_id = byteArray.read_uint64();
        voice_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_pub_voice_id);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_pub_voice_id();
    }
}

public class req_chat_channel : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_chat_channel;
    }
    public UInt64 channel_id;
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(channel_id);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        channel_id = byteArray.read_uint64();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_chat_channel);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_chat_channel();
    }
}

public class notify_chat_channel : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_chat_channel;
    }
    public UInt64 channel_id;
    public string account = "";
    public string player_name = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(channel_id);
    	byteArray.Write(account);
    	byteArray.Write(player_name);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        channel_id = byteArray.read_uint64();
        account = byteArray.read_string();
        player_name = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_chat_channel);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_chat_channel();
    }
}

public class notify_channel_add_player : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_channel_add_player;
    }
    public UInt64 channel_id;
    public pub_account_info account_info = new pub_account_info();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(channel_id);
        account_info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        channel_id = byteArray.read_uint64();
        account_info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_channel_add_player);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_channel_add_player();
    }
}

public class notify_channel_del_player : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_channel_del_player;
    }
    public UInt64 channel_id;
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(channel_id);
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        channel_id = byteArray.read_uint64();
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_channel_del_player);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_channel_del_player();
    }
}

public class req_channel_tell : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_channel_tell;
    }
    public string target_player = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(target_player);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        target_player = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_channel_tell);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_channel_tell();
    }
}

public class notify_channel_tell : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_channel_tell;
    }
    public string speaker = "";
    public string speaker_name = "";
    public string content = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(speaker);
    	byteArray.Write(speaker_name);
    	byteArray.Write(content);
    }

    public void decode(ByteArray byteArray)
    {
        speaker = byteArray.read_string();
        speaker_name = byteArray.read_string();
        content = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_channel_tell);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_channel_tell();
    }
}

public class broadcast_kick_pub_player : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_broadcast_kick_pub_player;
    }
    public string kicker = "";
    public string be_kicket = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(kicker);
    	byteArray.Write(be_kicket);
    }

    public void decode(ByteArray byteArray)
    {
        kicker = byteArray.read_string();
        be_kicket = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_broadcast_kick_pub_player);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new broadcast_kick_pub_player();
    }
}

public class notify_update_pub_player_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_update_pub_player_count;
    }
    public int person_count1;
    public int max_count1;
    public int person_count2;
    public int max_count2;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(person_count1);
    	byteArray.Write(max_count1);
    	byteArray.Write(person_count2);
    	byteArray.Write(max_count2);
    }

    public void decode(ByteArray byteArray)
    {
        person_count1 = byteArray.read_int();
        max_count1 = byteArray.read_int();
        person_count2 = byteArray.read_int();
        max_count2 = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_update_pub_player_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_update_pub_player_count();
    }
}

public class req_send_yy_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_send_yy_gift;
    }
    public string recver_account = "";
    public int gift_id;
    public int gift_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(recver_account);
    	byteArray.Write(gift_id);
    	byteArray.Write(gift_count);
    }

    public void decode(ByteArray byteArray)
    {
        recver_account = byteArray.read_string();
        gift_id = byteArray.read_int();
        gift_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_send_yy_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_send_yy_gift();
    }
}

public class broadcast_send_yy_gift : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_broadcast_send_yy_gift;
    }
    public int gift_id;
    public int gift_count;
    public pub_account_info sender_info = new pub_account_info();
    public pub_account_info recver_info = new pub_account_info();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(gift_id);
    	byteArray.Write(gift_count);
        sender_info.encode(byteArray);

        recver_info.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        gift_id = byteArray.read_int();
        gift_count = byteArray.read_int();
        sender_info.decode(byteArray);
        recver_info.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_broadcast_send_yy_gift);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new broadcast_send_yy_gift();
    }
}

public class req_kick_channel_player : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_kick_channel_player;
    }
    public string account = "";
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_kick_channel_player);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_kick_channel_player();
    }
}

public class notify_unlock_furniture_list : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_furniture_list;
    }
    public ArrayList unlock_list = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)unlock_list.Count);
        for(int i = 0; i < unlock_list.Count; i++)
        {
            byteArray.Write((int)unlock_list[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        unlock_list.Clear();
        int CountOfunlock_list = byteArray.read_uint16();
        for(int i = 0; i < CountOfunlock_list; i++)
        {
             unlock_list.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_furniture_list);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_furniture_list();
    }
}

public class req_unlock_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_furniture;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_furniture();
    }
}

public class notify_unlock_furniture : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_furniture;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_furniture);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_furniture();
    }
}

public class req_exchange : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_exchange;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_exchange);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_exchange();
    }
}

public class notify_exchange : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_exchange;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_exchange);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_exchange();
    }
}

public class notify_friend_intimate : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_friend_intimate;
    }
    public string account = "";
    public int intimate;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(account);
    	byteArray.Write(intimate);
    }

    public void decode(ByteArray byteArray)
    {
        account = byteArray.read_string();
        intimate = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_friend_intimate);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_friend_intimate();
    }
}

public class req_flower_shake : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_flower_shake;
    }
    public UInt64 house_id;
    public int shake_count;
    public int enable_props;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    	byteArray.Write(shake_count);
    	byteArray.Write(enable_props);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
        shake_count = byteArray.read_int();
        enable_props = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_flower_shake);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_flower_shake();
    }
}

public class req_flower_love_coin_shake : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_flower_love_coin_shake;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_flower_love_coin_shake);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_flower_love_coin_shake();
    }
}

public class notify_flower_shake : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_shake;
    }
    public int diamond;
    public int exp;
    public ArrayList items = new ArrayList();
    public int shake_prop_count;
    public int free_shake;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(diamond);
    	byteArray.Write(exp);
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((lottery_item)items[i]).encode(byteArray);
        }
    	byteArray.Write(shake_prop_count);
    	byteArray.Write(free_shake);
    }

    public void decode(ByteArray byteArray)
    {
        diamond = byteArray.read_int();
        exp = byteArray.read_int();
        int CountOfitems = byteArray.read_uint16();
        lottery_item[] ArrayOfitems = new lottery_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new lottery_item();
            ((lottery_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
        shake_prop_count = byteArray.read_int();
        free_shake = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_shake);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_shake();
    }
}

public class notify_flower_shake_prop_required : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_shake_prop_required;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_shake_prop_required);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_shake_prop_required();
    }
}

public class req_flower_shaked : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_flower_shaked;
    }
    public UInt64 house_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(house_id);
    }

    public void decode(ByteArray byteArray)
    {
        house_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_flower_shaked);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_flower_shaked();
    }
}

public class notify_flower_shaked : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_shaked;
    }
    public int free_shake;
    public int total_shake_count;
    public int free_shake_time;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(free_shake);
    	byteArray.Write(total_shake_count);
    	byteArray.Write(free_shake_time);
    }

    public void decode(ByteArray byteArray)
    {
        free_shake = byteArray.read_int();
        total_shake_count = byteArray.read_int();
        free_shake_time = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_shaked);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_shaked();
    }
}

public class notify_flower_love_coin_shaked : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_love_coin_shaked;
    }
    public int total_shake_count;
    public int love_coin_shake;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(total_shake_count);
    	byteArray.Write(love_coin_shake);
    }

    public void decode(ByteArray byteArray)
    {
        total_shake_count = byteArray.read_int();
        love_coin_shake = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_love_coin_shaked);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_love_coin_shaked();
    }
}

public class notify_flower_shake_overflow : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_flower_shake_overflow;
    }
    public int available;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(available);
    }

    public void decode(ByteArray byteArray)
    {
        available = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_flower_shake_overflow);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_flower_shake_overflow();
    }
}

public class req_first_payment_return_status : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_first_payment_return_status;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_first_payment_return_status);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_first_payment_return_status();
    }
}

public class notify_first_payment_return_status : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_first_payment_return_status;
    }
    public int returned;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(returned);
    }

    public void decode(ByteArray byteArray)
    {
        returned = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_first_payment_return_status);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_first_payment_return_status();
    }
}

public class req_first_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_first_payment_return_reward;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_first_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_first_payment_return_reward();
    }
}

public class notify_first_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_first_payment_return_reward;
    }
    public int returned;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(returned);
    }

    public void decode(ByteArray byteArray)
    {
        returned = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_first_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_first_payment_return_reward();
    }
}

public class single_payment_return_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_single_payment_return_item;
    }
    public int return_diamond;
    public int return_count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(return_diamond);
    	byteArray.Write(return_count);
    }

    public void decode(ByteArray byteArray)
    {
        return_diamond = byteArray.read_int();
        return_count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_single_payment_return_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new single_payment_return_item();
    }
}

public class req_single_payment_return : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_single_payment_return;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_single_payment_return);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_single_payment_return();
    }
}

public class notify_single_payment_return : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_single_payment_return;
    }
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((single_payment_return_item)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfitems = byteArray.read_uint16();
        single_payment_return_item[] ArrayOfitems = new single_payment_return_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new single_payment_return_item();
            ((single_payment_return_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_single_payment_return);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_single_payment_return();
    }
}

public class req_single_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_single_payment_return_reward;
    }
    public int return_diamond;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(return_diamond);
    }

    public void decode(ByteArray byteArray)
    {
        return_diamond = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_single_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_single_payment_return_reward();
    }
}

public class notify_single_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_single_payment_return_reward;
    }
    public int returned;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(returned);
    }

    public void decode(ByteArray byteArray)
    {
        returned = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_single_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_single_payment_return_reward();
    }
}

public class total_payment_return_item : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_total_payment_return_item;
    }
    public int consume_amount;
    public ArrayList return_items = new ArrayList();
    public int returned;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(consume_amount);
        byteArray.Write((UInt16)return_items.Count);
        for(int i = 0; i < return_items.Count; i++)
        {
            ((lottery_item)return_items[i]).encode(byteArray);
        }
    	byteArray.Write(returned);
    }

    public void decode(ByteArray byteArray)
    {
        consume_amount = byteArray.read_int();
        int CountOfreturn_items = byteArray.read_uint16();
        lottery_item[] ArrayOfreturn_items = new lottery_item[CountOfreturn_items];
        for(int i = 0; i < CountOfreturn_items; i++)
        {
            ArrayOfreturn_items[i] = new lottery_item();
            ((lottery_item)ArrayOfreturn_items[i]).decode(byteArray);
        }
        return_items.Clear();
        return_items.AddRange(ArrayOfreturn_items);
        returned = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_total_payment_return_item);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new total_payment_return_item();
    }
}

public class req_total_payment_return : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_total_payment_return;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_total_payment_return);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_total_payment_return();
    }
}

public class notify_total_payment_return : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_total_payment_return;
    }
    public int total_amount;
    public ArrayList items = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(total_amount);
        byteArray.Write((UInt16)items.Count);
        for(int i = 0; i < items.Count; i++)
        {
            ((total_payment_return_item)items[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        total_amount = byteArray.read_int();
        int CountOfitems = byteArray.read_uint16();
        total_payment_return_item[] ArrayOfitems = new total_payment_return_item[CountOfitems];
        for(int i = 0; i < CountOfitems; i++)
        {
            ArrayOfitems[i] = new total_payment_return_item();
            ((total_payment_return_item)ArrayOfitems[i]).decode(byteArray);
        }
        items.Clear();
        items.AddRange(ArrayOfitems);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_total_payment_return);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_total_payment_return();
    }
}

public class req_total_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_total_payment_return_reward;
    }
    public int consume_amount;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(consume_amount);
    }

    public void decode(ByteArray byteArray)
    {
        consume_amount = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_total_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_total_payment_return_reward();
    }
}

public class notify_total_payment_return_reward : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_total_payment_return_reward;
    }
    public int returned;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(returned);
    }

    public void decode(ByteArray byteArray)
    {
        returned = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_total_payment_return_reward);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_total_payment_return_reward();
    }
}

public class req_item_upgrade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_item_upgrade;
    }
    public UInt64 instance_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(instance_id);
    }

    public void decode(ByteArray byteArray)
    {
        instance_id = byteArray.read_uint64();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_item_upgrade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_item_upgrade();
    }
}

public class notify_item_upgrade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_item_upgrade;
    }
    public UInt64 upgrade_item_instanceid;
    public int result;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(upgrade_item_instanceid);
    	byteArray.Write(result);
    }

    public void decode(ByteArray byteArray)
    {
        upgrade_item_instanceid = byteArray.read_uint64();
        result = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_item_upgrade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_item_upgrade();
    }
}

public class req_mutli_item_upgrade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_mutli_item_upgrade;
    }
    public ArrayList inst_ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)inst_ids.Count);
        for(int i = 0; i < inst_ids.Count; i++)
        {
            byteArray.Write((UInt64)inst_ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        inst_ids.Clear();
        int CountOfinst_ids = byteArray.read_uint16();
        for(int i = 0; i < CountOfinst_ids; i++)
        {
             inst_ids.Add(byteArray.read_uint64());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_mutli_item_upgrade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_mutli_item_upgrade();
    }
}

public class notify_mutli_item_upgrade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_mutli_item_upgrade;
    }
    public ArrayList furnitures = new ArrayList();
    public int decoration;
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)furnitures.Count);
        for(int i = 0; i < furnitures.Count; i++)
        {
            ((house_furniture)furnitures[i]).encode(byteArray);
        }
    	byteArray.Write(decoration);
    }

    public void decode(ByteArray byteArray)
    {
        int CountOffurnitures = byteArray.read_uint16();
        house_furniture[] ArrayOffurnitures = new house_furniture[CountOffurnitures];
        for(int i = 0; i < CountOffurnitures; i++)
        {
            ArrayOffurnitures[i] = new house_furniture();
            ((house_furniture)ArrayOffurnitures[i]).decode(byteArray);
        }
        furnitures.Clear();
        furnitures.AddRange(ArrayOffurnitures);
        decoration = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_mutli_item_upgrade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_mutli_item_upgrade();
    }
}

public class notify_make_up_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_make_up_info;
    }
    public int level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(level);
    }

    public void decode(ByteArray byteArray)
    {
        level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_make_up_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_make_up_info();
    }
}

public class req_enter_pub_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_enter_pub_scene;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_enter_pub_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_enter_pub_scene();
    }
}

public class notify_enter_pub_scene : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_enter_pub_scene;
    }
    public int template_id;
    public pub_info info = new pub_info();
    public ArrayList accounts = new ArrayList();
    public point enter_pos = new point();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(template_id);
        info.encode(byteArray);

        byteArray.Write((UInt16)accounts.Count);
        for(int i = 0; i < accounts.Count; i++)
        {
            ((pub_account_info)accounts[i]).encode(byteArray);
        }
        enter_pos.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        template_id = byteArray.read_int();
        info.decode(byteArray);
        int CountOfaccounts = byteArray.read_uint16();
        pub_account_info[] ArrayOfaccounts = new pub_account_info[CountOfaccounts];
        for(int i = 0; i < CountOfaccounts; i++)
        {
            ArrayOfaccounts[i] = new pub_account_info();
            ((pub_account_info)ArrayOfaccounts[i]).decode(byteArray);
        }
        accounts.Clear();
        accounts.AddRange(ArrayOfaccounts);
        enter_pos.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_enter_pub_scene);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_enter_pub_scene();
    }
}

public class req_get_sprites : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_get_sprites;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_get_sprites);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_get_sprites();
    }
}

public class req_click_sprite : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_click_sprite;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_click_sprite);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_click_sprite();
    }
}

public class sprite : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_sprite;
    }
    public int id;
    public int curr_exp;
    public int level;
    public int remain_time;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(curr_exp);
    	byteArray.Write(level);
    	byteArray.Write(remain_time);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        curr_exp = byteArray.read_int();
        level = byteArray.read_int();
        remain_time = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_sprite);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new sprite();
    }
}

public class notify_sprite_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sprite_data;
    }
    public int appraise;
    public ArrayList sprites = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(appraise);
        byteArray.Write((UInt16)sprites.Count);
        for(int i = 0; i < sprites.Count; i++)
        {
            ((sprite)sprites[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        appraise = byteArray.read_int();
        int CountOfsprites = byteArray.read_uint16();
        sprite[] ArrayOfsprites = new sprite[CountOfsprites];
        for(int i = 0; i < CountOfsprites; i++)
        {
            ArrayOfsprites[i] = new sprite();
            ((sprite)ArrayOfsprites[i]).decode(byteArray);
        }
        sprites.Clear();
        sprites.AddRange(ArrayOfsprites);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sprite_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sprite_data();
    }
}

public class notify_del_sprite : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_del_sprite;
    }
    public int id;
    public int del;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(del);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        del = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_del_sprite);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_del_sprite();
    }
}

public class req_click_guest : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_click_guest;
    }
    public int appraise;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(appraise);
    }

    public void decode(ByteArray byteArray)
    {
        appraise = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_click_guest);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_click_guest();
    }
}

public class notify_can_click_guest : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_can_click_guest;
    }
    public int canClick;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(canClick);
    }

    public void decode(ByteArray byteArray)
    {
        canClick = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_can_click_guest);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_can_click_guest();
    }
}

public class notify_sprite_upgrade : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_sprite_upgrade;
    }
    public int id;
    public int level;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(level);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        level = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_sprite_upgrade);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_sprite_upgrade();
    }
}

public class req_unlock_food : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_food;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_food);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_food();
    }
}

public class notify_unlock_food : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_food;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_food);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_food();
    }
}

public class req_unlock_food_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_unlock_food_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_unlock_food_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_unlock_food_info();
    }
}

public class notify_unlock_food_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_unlock_food_info;
    }
    public ArrayList ids = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)ids.Count);
        for(int i = 0; i < ids.Count; i++)
        {
            byteArray.Write((int)ids[i]);
        }
    }

    public void decode(ByteArray byteArray)
    {
        ids.Clear();
        int CountOfids = byteArray.read_uint16();
        for(int i = 0; i < CountOfids; i++)
        {
             ids.Add(byteArray.read_int());
        }
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_unlock_food_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_unlock_food_info();
    }
}

public class req_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_expand_food_stock;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_expand_food_stock();
    }
}

public class food_stock_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_food_stock_info;
    }
    public int id;
    public int size;
    public int value;
    public int seconds;
    public stime due_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(size);
    	byteArray.Write(value);
    	byteArray.Write(seconds);
        due_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        size = byteArray.read_int();
        value = byteArray.read_int();
        seconds = byteArray.read_int();
        due_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_food_stock_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new food_stock_info();
    }
}

public class notify_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_expand_food_stock;
    }
    public int id;
    public stime due_time = new stime();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
        due_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        due_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_expand_food_stock();
    }
}

public class notify_settlement_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_settlement_expand_food_stock;
    }
    public int id;
    public int size;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(size);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        size = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_settlement_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_settlement_expand_food_stock();
    }
}

public class req_food_stock_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_food_stock_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_food_stock_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_food_stock_info();
    }
}

public class notify_food_stock_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_food_stock_info;
    }
    public ArrayList stock_info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)stock_info.Count);
        for(int i = 0; i < stock_info.Count; i++)
        {
            ((food_stock_info)stock_info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfstock_info = byteArray.read_uint16();
        food_stock_info[] ArrayOfstock_info = new food_stock_info[CountOfstock_info];
        for(int i = 0; i < CountOfstock_info; i++)
        {
            ArrayOfstock_info[i] = new food_stock_info();
            ((food_stock_info)ArrayOfstock_info[i]).decode(byteArray);
        }
        stock_info.Clear();
        stock_info.AddRange(ArrayOfstock_info);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_food_stock_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_food_stock_info();
    }
}

public class req_cancel_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_cancel_expand_food_stock;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_cancel_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_cancel_expand_food_stock();
    }
}

public class notify_cancel_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_cancel_expand_food_stock;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_cancel_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_cancel_expand_food_stock();
    }
}

public class req_complete_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_complete_expand_food_stock;
    }
    public int id;
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_complete_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_complete_expand_food_stock();
    }
}

public class notify_complete_expand_food_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_complete_expand_food_stock;
    }
    public int id;
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_complete_expand_food_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_complete_expand_food_stock();
    }
}

public class req_immediately_complete_expand_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_immediately_complete_expand_stock;
    }
    public int id;
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_immediately_complete_expand_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_immediately_complete_expand_stock();
    }
}

public class notify_immediately_complete_expand_stock : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_immediately_complete_expand_stock;
    }
    public int id;
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_immediately_complete_expand_stock);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_immediately_complete_expand_stock();
    }
}

public class req_expand_produce_area : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_expand_produce_area;
    }
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_expand_produce_area);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_expand_produce_area();
    }
}

public class notify_expand_produce_area : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_expand_produce_area;
    }
    public int number;
    public int grid_index;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(number);
    	byteArray.Write(grid_index);
    }

    public void decode(ByteArray byteArray)
    {
        number = byteArray.read_int();
        grid_index = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_expand_produce_area);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_expand_produce_area();
    }
}

public class req_produce_area : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_produce_area;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_produce_area);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_produce_area();
    }
}

public class notify_produce_area : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_produce_area;
    }
    public int number;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(number);
    }

    public void decode(ByteArray byteArray)
    {
        number = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_produce_area);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_produce_area();
    }
}

public class req_upgrade_food : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_upgrade_food;
    }
    public int id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_upgrade_food);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_upgrade_food();
    }
}

public class notify_upgrade_food : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_upgrade_food;
    }
    public int id;
    public int upgrade_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(upgrade_id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        upgrade_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_upgrade_food);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_upgrade_food();
    }
}

public class food_upgrade_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_food_upgrade_info;
    }
    public int id;
    public int upgrade_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(upgrade_id);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        upgrade_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_food_upgrade_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new food_upgrade_info();
    }
}

public class req_food_upgrade_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_food_upgrade_info;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_food_upgrade_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_food_upgrade_info();
    }
}

public class notify_food_upgrade_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_food_upgrade_info;
    }
    public ArrayList upgrade_info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)upgrade_info.Count);
        for(int i = 0; i < upgrade_info.Count; i++)
        {
            ((food_upgrade_info)upgrade_info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        int CountOfupgrade_info = byteArray.read_uint16();
        food_upgrade_info[] ArrayOfupgrade_info = new food_upgrade_info[CountOfupgrade_info];
        for(int i = 0; i < CountOfupgrade_info; i++)
        {
            ArrayOfupgrade_info[i] = new food_upgrade_info();
            ((food_upgrade_info)ArrayOfupgrade_info[i]).decode(byteArray);
        }
        upgrade_info.Clear();
        upgrade_info.AddRange(ArrayOfupgrade_info);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_food_upgrade_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_food_upgrade_info();
    }
}

public class product_atom : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_product_atom;
    }
    public int id;
    public int copies;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(copies);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        copies = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_product_atom);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new product_atom();
    }
}

public class req_make_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_make_product;
    }
    public ArrayList products = new ArrayList();
    public stime start_time = new stime();
    public void encode(ByteArray byteArray)
    {
        byteArray.Write((UInt16)products.Count);
        for(int i = 0; i < products.Count; i++)
        {
            ((product_atom)products[i]).encode(byteArray);
        }
        start_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        int CountOfproducts = byteArray.read_uint16();
        product_atom[] ArrayOfproducts = new product_atom[CountOfproducts];
        for(int i = 0; i < CountOfproducts; i++)
        {
            ArrayOfproducts[i] = new product_atom();
            ((product_atom)ArrayOfproducts[i]).decode(byteArray);
        }
        products.Clear();
        products.AddRange(ArrayOfproducts);
        start_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_make_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_make_product();
    }
}

public class notify_make_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_make_product;
    }
    public stime start_time = new stime();
    public void encode(ByteArray byteArray)
    {
        start_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        start_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_make_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_make_product();
    }
}

public class req_remove_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_remove_product;
    }
    public int position;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(position);
    }

    public void decode(ByteArray byteArray)
    {
        position = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_remove_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_remove_product();
    }
}

public class notify_remove_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_remove_product;
    }
    public stime start_time = new stime();
    public void encode(ByteArray byteArray)
    {
        start_time.encode(byteArray);

    }

    public void decode(ByteArray byteArray)
    {
        start_time.decode(byteArray);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_remove_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_remove_product();
    }
}

public class req_complete_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_complete_product;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_complete_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_complete_product();
    }
}

public class notify_complete_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_complete_product;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_complete_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_complete_product();
    }
}

public class req_immediately_complete_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_immediately_complete_product;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_immediately_complete_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_immediately_complete_product();
    }
}

public class notify_immediately_complete_product : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_immediately_complete_product;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_immediately_complete_product);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_immediately_complete_product();
    }
}

public class req_products : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_products;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_products);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_products();
    }
}

public class product_info : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_product_info;
    }
    public int id;
    public int product_id;
    public int copies;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(product_id);
    	byteArray.Write(copies);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        product_id = byteArray.read_int();
        copies = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_product_info);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new product_info();
    }
}

public class notify_products : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_products;
    }
    public stime start_time = new stime();
    public ArrayList info = new ArrayList();
    public void encode(ByteArray byteArray)
    {
        start_time.encode(byteArray);

        byteArray.Write((UInt16)info.Count);
        for(int i = 0; i < info.Count; i++)
        {
            ((product_info)info[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        start_time.decode(byteArray);
        int CountOfinfo = byteArray.read_uint16();
        product_info[] ArrayOfinfo = new product_info[CountOfinfo];
        for(int i = 0; i < CountOfinfo; i++)
        {
            ArrayOfinfo[i] = new product_info();
            ((product_info)ArrayOfinfo[i]).decode(byteArray);
        }
        info.Clear();
        info.AddRange(ArrayOfinfo);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_products);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_products();
    }
}

public class notify_food_settlement_diamond : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_food_settlement_diamond;
    }
    public int diamond;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(diamond);
    }

    public void decode(ByteArray byteArray)
    {
        diamond = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_food_settlement_diamond);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_food_settlement_diamond();
    }
}

public class notify_reset_temp_diamond : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_reset_temp_diamond;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_reset_temp_diamond);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_reset_temp_diamond();
    }
}

public class req_ask_drink_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_ask_drink_count;
    }
    public int drink_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(drink_id);
    }

    public void decode(ByteArray byteArray)
    {
        drink_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_ask_drink_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_ask_drink_count();
    }
}

public class shout_data : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_shout_data;
    }
    public int id;
    public int count;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(id);
    	byteArray.Write(count);
    }

    public void decode(ByteArray byteArray)
    {
        id = byteArray.read_int();
        count = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_shout_data);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new shout_data();
    }
}

public class notify_drink_count : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_drink_count;
    }
    public int scene_player_count;
    public int cost;
    public ArrayList shout = new ArrayList();
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(scene_player_count);
    	byteArray.Write(cost);
        byteArray.Write((UInt16)shout.Count);
        for(int i = 0; i < shout.Count; i++)
        {
            ((shout_data)shout[i]).encode(byteArray);
        }
    }

    public void decode(ByteArray byteArray)
    {
        scene_player_count = byteArray.read_int();
        cost = byteArray.read_int();
        int CountOfshout = byteArray.read_uint16();
        shout_data[] ArrayOfshout = new shout_data[CountOfshout];
        for(int i = 0; i < CountOfshout; i++)
        {
            ArrayOfshout[i] = new shout_data();
            ((shout_data)ArrayOfshout[i]).decode(byteArray);
        }
        shout.Clear();
        shout.AddRange(ArrayOfshout);
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_drink_count);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_drink_count();
    }
}

public class req_party_drink : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_party_drink;
    }
    public int drink_id;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(drink_id);
    }

    public void decode(ByteArray byteArray)
    {
        drink_id = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_party_drink);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_party_drink();
    }
}

public class req_calc_player_charm : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_req_calc_player_charm;
    }
    public void encode(ByteArray byteArray)
    {
    }

    public void decode(ByteArray byteArray)
    {
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_req_calc_player_charm);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new req_calc_player_charm();
    }
}

public class notify_calc_player_charm : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_calc_player_charm;
    }
    public int charm;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(charm);
    }

    public void decode(ByteArray byteArray)
    {
        charm = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_calc_player_charm);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_calc_player_charm();
    }
}

public class notify_init_party_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_init_party_coin;
    }
    public int coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(coin);
    }

    public void decode(ByteArray byteArray)
    {
        coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_init_party_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_init_party_coin();
    }
}

public class notify_party_score_coin : INetPacket
{
    public short getMsgID()
    {
        return NetMsgType.msg_notify_party_score_coin;
    }
    public int coin;
    public void encode(ByteArray byteArray)
    {
    	byteArray.Write(coin);
    }

    public void decode(ByteArray byteArray)
    {
        coin = byteArray.read_int();
    }
    public void build(ByteArray byteArray)
    {
        byteArray.Write(NetMsgType.msg_notify_party_score_coin);
        encode(byteArray);
    }
    public INetPacket Create()
    {
       return new notify_party_score_coin();
    }
}
