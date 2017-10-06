using System.Collections.Generic;
using System.Xml;
using System;
using System.Collections;
using UnityEngine;
public class house_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_tplt row = new house_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.house_furniture = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.born_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_players = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.preview_born = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.struct_info = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.right_grade = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_single = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.big_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.tip = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.internal_decoration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_furniture = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_flowerpot = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bg_music = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.max_guest = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.guest_id = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.waiter_pos = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.waiter_rotate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public house_tplt get(int key){
        return (house_tplt)datas[key];
      }
   }
public class born_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             born row = new born();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dir = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.lookat = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.pitch = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.yaw = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.zoom = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.farclip = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.field = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.watch_mode = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.view_floor = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public born get(int key){
        return (born)datas[key];
      }
   }
public class house_furniture_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_furniture_tplt row = new house_furniture_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.furniture_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_temp_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.x = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.z = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.height = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.flr = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.face = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public house_furniture_tplt get(int key){
        return (house_furniture_tplt)datas[key];
      }
   }
public class item_base_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_base_tplt row = new item_base_tplt();
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.base_item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.item_id, row);
         }
      }
      public item_base_tplt get(int key){
        return (item_base_tplt)datas[key];
      }
   }
public class item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_tplt row = new item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.overlap = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sell_price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sub_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.upgrade_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bind = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_time_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public item_tplt get(int key){
        return (item_tplt)datas[key];
      }
   }
public class item_effect_time_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_effect_time_tplt row = new item_effect_time_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.trade_cut_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.del_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public item_effect_time_tplt get(int key){
        return (item_effect_time_tplt)datas[key];
      }
   }
public class item_dress_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_dress_tplt row = new item_dress_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.equip_pos = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.equip_placeholder.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.model_body = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.place = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.action = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.particle = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.attach_pos = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.type1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public item_dress_tplt get(int key){
        return (item_dress_tplt)datas[key];
      }
   }
public class house_comp_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_comp row = new house_comp();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.prop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pos = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.rot = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.scale = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.cull_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.particle = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.particle_pos = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public house_comp get(int key){
        return (house_comp)datas[key];
      }
   }
public class common_scene_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             common_scene row = new common_scene();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.copy_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_players = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.born_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.furnitures = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.scene_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bg_music = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public common_scene get(int key){
        return (common_scene)datas[key];
      }
   }
public class mutex_actions_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             mutex_actions row = new mutex_actions();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.allow_actions.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public mutex_actions get(int key){
        return (mutex_actions)datas[key];
      }
   }
public class change_looks_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             change_looks_tplt row = new change_looks_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public change_looks_tplt get(int key){
        return (change_looks_tplt)datas[key];
      }
   }
public class teleport_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             teleport_tplt row = new teleport_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.src_scene_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.src_x = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.src_y = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.src_z = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.src_radius = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dest_scene_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dest_x = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dest_y = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dest_z = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dest_dir = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public teleport_tplt get(int key){
        return (teleport_tplt)datas[key];
      }
   }
public class create_random_dress_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             create_random_dress row = new create_random_dress();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fashion1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fashion2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fashion3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fashion4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fashion5 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public create_random_dress get(int key){
        return (create_random_dress)datas[key];
      }
   }
public class npc_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             npc_tplt row = new npc_tplt();
            if (ienum.MoveNext())
                 row.npc_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.body = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.head = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hair = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.equip1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.equip2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.skeleton = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.npc_name = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.npc_id, row);
         }
      }
      public npc_tplt get(int key){
        return (npc_tplt)datas[key];
      }
   }
public class npc_map_mapping_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             npc_map_mapping_tplt row = new npc_map_mapping_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.npc_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.npc_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.x = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.y = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.z = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.script_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.action = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.towards = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public npc_map_mapping_tplt get(int key){
        return (npc_map_mapping_tplt)datas[key];
      }
   }
public class player_level_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_level_tplt row = new player_level_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.online_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public player_level_tplt get(int key){
        return (player_level_tplt)datas[key];
      }
   }
public class sys_shop_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             sys_shop_tplt row = new sys_shop_tplt();
            if (ienum.MoveNext())
                 row.goods_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.point = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.commend = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.broadcast_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.visible = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.newcomer = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.goods_id, row);
         }
      }
      public sys_shop_tplt get(int key){
        return (sys_shop_tplt)datas[key];
      }
   }
public class npc_shop_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             npc_shop_tplt row = new npc_shop_tplt();
            if (ienum.MoveNext())
                 row.goods_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sale_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.goods_id, row);
         }
      }
      public npc_shop_tplt get(int key){
        return (npc_shop_tplt)datas[key];
      }
   }
public class furni_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             furni_tplt row = new furni_tplt();
            if (ienum.MoveNext())
                 row.furniture_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_use_player = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.permission = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.function_list.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.use_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.status_qty = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.furniture_id, row);
         }
      }
      public furni_tplt get(int key){
        return (furni_tplt)datas[key];
      }
   }
public class furni_interact_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             furni_interact_tplt row = new furni_interact_tplt();
            if (ienum.MoveNext())
                 row.function_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.status = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.function_id, row);
         }
      }
      public furni_interact_tplt get(int key){
        return (furni_interact_tplt)datas[key];
      }
   }
public class common_define_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             common_define_tplt row = new common_define_tplt();
            if (ienum.MoveNext())
                 row.key = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.value = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.key, row);
         }
      }
      public common_define_tplt get(string key){
        return (common_define_tplt)datas[key];
      }
   }
public class player_disease_probability_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_disease_probability_tplt row = new player_disease_probability_tplt();
            if (ienum.MoveNext())
                 row.player_health = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.probability = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.player_health, row);
         }
      }
      public player_disease_probability_tplt get(int key){
        return (player_disease_probability_tplt)datas[key];
      }
   }
public class player_disease_type_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_disease_type_tplt row = new player_disease_type_tplt();
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.upgrate_probability = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.treatment_costs = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.min = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.special_event_id.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.event_id_probability.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.special_event_probability = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.type, row);
         }
      }
      public player_disease_type_tplt get(int key){
        return (player_disease_type_tplt)datas[key];
      }
   }
public class player_disease_special_event_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_disease_special_event_tplt row = new player_disease_special_event_tplt();
            if (ienum.MoveNext())
                 row.special_event_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.special_event_id, row);
         }
      }
      public player_disease_special_event_tplt get(int key){
        return (player_disease_special_event_tplt)datas[key];
      }
   }
public class house_transaction_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_transaction_tplt row = new house_transaction_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.recommend = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pay_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.house_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.broadcast_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public house_transaction_tplt get(int key){
        return (house_transaction_tplt)datas[key];
      }
   }
public class sys_broadcast_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             sys_broadcast_tplt row = new sys_broadcast_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.show_seconds = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public sys_broadcast_tplt get(int key){
        return (sys_broadcast_tplt)datas[key];
      }
   }
public class holiday_gift_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             holiday_gift row = new holiday_gift();
            if (ienum.MoveNext())
                 row.sequence_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.start_day = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.duration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.group_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.gift_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.sequence_id, row);
         }
      }
      public holiday_gift get(int key){
        return (holiday_gift)datas[key];
      }
   }
public class level_info_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             level_info_tplt row = new level_info_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_hp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hp_restore_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_decoration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.party_owner_calc_exp_a = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.party_guest_calc_exp_b = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.party_cost_money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.party_add_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public level_info_tplt get(int key){
        return (level_info_tplt)datas[key];
      }
   }
public class flower_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             flower_tplt row = new flower_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.flower_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.grow = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.particle = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public flower_tplt get(int key){
        return (flower_tplt)datas[key];
      }
   }
public class gift_box_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             gift_box_tplt row = new gift_box_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.intro = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public gift_box_tplt get(int key){
        return (gift_box_tplt)datas[key];
      }
   }
public class props_item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             props_item_tplt row = new props_item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.target = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.del = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.movie = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.ui = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.audio = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.sysmsg = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.module = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.arguments = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public props_item_tplt get(int key){
        return (props_item_tplt)datas[key];
      }
   }
public class player_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_task_tplt row = new player_task_tplt();
            if (ienum.MoveNext())
                 row.task_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.title = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.describe = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.require_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.require_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.experience = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.point = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_show = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.q_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.target1 = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target2 = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target3 = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_player_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.task_id, row);
         }
      }
      public player_task_tplt get(int key){
        return (player_task_tplt)datas[key];
      }
   }
public class daily_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             daily_task_tplt row = new daily_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.task_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public daily_task_tplt get(int key){
        return (daily_task_tplt)datas[key];
      }
   }
public class chain_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             chain_task_tplt row = new chain_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.task_id.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.next_chain.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public chain_task_tplt get(int key){
        return (chain_task_tplt)datas[key];
      }
   }
public class house_right_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_right_tplt row = new house_right_tplt();
            if (ienum.MoveNext())
                 row.grade = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.money_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material1_shop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.num1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material2_shop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.num2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material3_shop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.num3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material4_shop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.num4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.hover_icon = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.grade, row);
         }
      }
      public house_right_tplt get(int key){
        return (house_right_tplt)datas[key];
      }
   }
public class special_house_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             special_house_tplt row = new special_house_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.house_tplt_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.q_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.broadcast_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public special_house_tplt get(int key){
        return (special_house_tplt)datas[key];
      }
   }
public class player_special_house_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_special_house_tplt row = new player_special_house_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.unlock_house_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.broadcast_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.big_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.decoration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.furniture_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_show = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public player_special_house_tplt get(int key){
        return (player_special_house_tplt)datas[key];
      }
   }
public class player_login_reward_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_login_reward_tplt row = new player_login_reward_tplt();
            if (ienum.MoveNext())
                 row.day = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.point = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.day, row);
         }
      }
      public player_login_reward_tplt get(int key){
        return (player_login_reward_tplt)datas[key];
      }
   }
public class polymorph_props_item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             polymorph_props_item_tplt row = new polymorph_props_item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.duration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.message = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public polymorph_props_item_tplt get(int key){
        return (polymorph_props_item_tplt)datas[key];
      }
   }
public class lottery_item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             lottery_item_tplt row = new lottery_item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.group_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public lottery_item_tplt get(int key){
        return (lottery_item_tplt)datas[key];
      }
   }
public class score_lottery_item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             score_lottery_item_tplt row = new score_lottery_item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.group_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public score_lottery_item_tplt get(int key){
        return (score_lottery_item_tplt)datas[key];
      }
   }
public class search_item_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             search_item_tplt row = new search_item_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public search_item_tplt get(int key){
        return (search_item_tplt)datas[key];
      }
   }
public class charm_rate_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             charm_rate_tplt row = new charm_rate_tplt();
            if (ienum.MoveNext())
                 row.charm = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.charm, row);
         }
      }
      public charm_rate_tplt get(int key){
        return (charm_rate_tplt)datas[key];
      }
   }
public class rate_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             rate_tplt row = new rate_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public rate_tplt get(int key){
        return (rate_tplt)datas[key];
      }
   }
public class item_dress_additional_properties_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_dress_additional_properties_tplt row = new item_dress_additional_properties_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.charm = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public item_dress_additional_properties_tplt get(int key){
        return (item_dress_additional_properties_tplt)datas[key];
      }
   }
public class furniture_additional_properties_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             furniture_additional_properties_tplt row = new furniture_additional_properties_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.decoration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public furniture_additional_properties_tplt get(int key){
        return (furniture_additional_properties_tplt)datas[key];
      }
   }
public class event_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             event_tplt row = new event_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.event = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public event_tplt get(int key){
        return (event_tplt)datas[key];
      }
   }
public class produce_level_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             produce_level_tplt row = new produce_level_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.experience = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.horizontal = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public produce_level_tplt get(int key){
        return (produce_level_tplt)datas[key];
      }
   }
public class produce_manual_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             produce_manual_tplt row = new produce_manual_tplt();
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.produce_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.consume_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.material_item = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.finished_item = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.success_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.experience = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.item_id, row);
         }
      }
      public produce_manual_tplt get(int key){
        return (produce_manual_tplt)datas[key];
      }
   }
public class daily_active_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             daily_active_tplt row = new daily_active_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;
           foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.event.Add(v);
                }
            if (ienum.MoveNext())
                 row.add_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public daily_active_tplt get(int key){
        return (daily_active_tplt)datas[key];
      }
   }
public class daily_active_score_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             daily_active_score_tplt row = new daily_active_score_tplt();
            if (ienum.MoveNext())
                 row.score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.point = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.score, row);
         }
      }
      public daily_active_score_tplt get(int key){
        return (daily_active_score_tplt)datas[key];
      }
   }
public class daily_active_tplt_1_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             daily_active_tplt_1 row = new daily_active_tplt_1();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;
           foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.event.Add(v);
                }
            if (ienum.MoveNext())
                 row.add_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public daily_active_tplt_1 get(int key){
        return (daily_active_tplt_1)datas[key];
      }
   }
public class daily_active_score_tplt_1_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             daily_active_score_tplt_1 row = new daily_active_score_tplt_1();
            if (ienum.MoveNext())
                 row.score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.score, row);
         }
      }
      public daily_active_score_tplt_1 get(int key){
        return (daily_active_score_tplt_1)datas[key];
      }
   }
public class crop_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             crop_tplt row = new crop_tplt();
            if (ienum.MoveNext())
                 row.crop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.price_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.event_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ripe_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.seedling = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.fruit_model = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.crop_id, row);
         }
      }
      public crop_tplt get(int key){
        return (crop_tplt)datas[key];
      }
   }
public class ring_task_front_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             ring_task_front_task_tplt row = new ring_task_front_task_tplt();
            if (ienum.MoveNext())
                 row.ring_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.ring_count, row);
         }
      }
      public ring_task_front_task_tplt get(int key){
        return (ring_task_front_task_tplt)datas[key];
      }
   }
public class dialogue_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             dialogue_task_tplt row = new dialogue_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_options = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.npc_name = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public dialogue_task_tplt get(int key){
        return (dialogue_task_tplt)datas[key];
      }
   }
public class deliver_goods_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             deliver_goods_task_tplt row = new deliver_goods_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_options = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.npc_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.require_item = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public deliver_goods_task_tplt get(int key){
        return (deliver_goods_task_tplt)datas[key];
      }
   }
public class find_item_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             find_item_task_tplt row = new find_item_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_options = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.npc_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.area_event_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.map_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.reward_item = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public find_item_task_tplt get(int key){
        return (find_item_task_tplt)datas[key];
      }
   }
public class collect_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             collect_task_tplt row = new collect_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.require_item = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public collect_task_tplt get(int key){
        return (collect_task_tplt)datas[key];
      }
   }
public class function_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             function_task_tplt row = new function_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.target = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.event = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public function_task_tplt get(int key){
        return (function_task_tplt)datas[key];
      }
   }
public class post_reward_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             post_reward_task_tplt row = new post_reward_task_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.require_item1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item1_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item1_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.require_item2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item2_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item2_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.require_item3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item3_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.require_item3_content = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reward_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public post_reward_task_tplt get(int key){
        return (post_reward_task_tplt)datas[key];
      }
   }
public class ring_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             ring_task_tplt row = new ring_task_tplt();
            if (ienum.MoveNext())
                 row.ring_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.due_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.start_require_item = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.stop_require_item = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.stop_require_item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reward_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.q_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.ring_count, row);
         }
      }
      public ring_task_tplt get(int key){
        return (ring_task_tplt)datas[key];
      }
   }
public class mind_quiz_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             mind_quiz_tplt row = new mind_quiz_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_items_probability = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reward_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public mind_quiz_tplt get(int key){
        return (mind_quiz_tplt)datas[key];
      }
   }
public class intimate_level_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             intimate_level row = new intimate_level();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.toplimit = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.tooltip = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.level, row);
         }
      }
      public intimate_level get(int key){
        return (intimate_level)datas[key];
      }
   }
public class mateup_diamond_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             mateup_diamond row = new mateup_diamond();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public mateup_diamond get(int key){
        return (mateup_diamond)datas[key];
      }
   }
public class make_up_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             make_up_tplt row = new make_up_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.items = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.level, row);
         }
      }
      public make_up_tplt get(int key){
        return (make_up_tplt)datas[key];
      }
   }
public class flower_shake_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             flower_shake_tplt row = new flower_shake_tplt();
            if (ienum.MoveNext())
                 row.nthtime = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.nthtime, row);
         }
      }
      public flower_shake_tplt get(int key){
        return (flower_shake_tplt)datas[key];
      }
   }
public class flower_love_coin_shake_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             flower_love_coin_shake_tplt row = new flower_love_coin_shake_tplt();
            if (ienum.MoveNext())
                 row.nthtime = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.nthtime, row);
         }
      }
      public flower_love_coin_shake_tplt get(int key){
        return (flower_love_coin_shake_tplt)datas[key];
      }
   }
public class single_payment_return_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             single_payment_return_tplt row = new single_payment_return_tplt();
            if (ienum.MoveNext())
                 row.consume_amount = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.award_items = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.consume_amount, row);
         }
      }
      public single_payment_return_tplt get(int key){
        return (single_payment_return_tplt)datas[key];
      }
   }
public class total_payment_return_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             total_payment_return_tplt row = new total_payment_return_tplt();
            if (ienum.MoveNext())
                 row.consume_amount = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.return_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.return_items = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.consume_amount, row);
         }
      }
      public total_payment_return_tplt get(int key){
        return (total_payment_return_tplt)datas[key];
      }
   }
public class item_upgrade_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             item_upgrade_tplt row = new item_upgrade_tplt();
            if (ienum.MoveNext())
                 row.item_sub_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.consume_items = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.consume_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.upgraded_item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.upgraded_property = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.item_sub_id, row);
         }
      }
      public item_upgrade_tplt get(int key){
        return (item_upgrade_tplt)datas[key];
      }
   }
public class yy_gift_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             yy_gift_tplt row = new yy_gift_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hot = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.recv_price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.probability = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.back_price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.display_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.display_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public yy_gift_tplt get(int key){
        return (yy_gift_tplt)datas[key];
      }
   }
public class love_coin_recharge_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             love_coin_recharge_tplt row = new love_coin_recharge_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.buy_love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.q_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public love_coin_recharge_tplt get(int key){
        return (love_coin_recharge_tplt)datas[key];
      }
   }
public class flowerpot_unlock_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             flowerpot_unlock row = new flowerpot_unlock();
            if (ienum.MoveNext())
                 row.number = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.goods_id1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.goods_id2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.goods_id3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_id4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.goods_id4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.number, row);
         }
      }
      public flowerpot_unlock get(int key){
        return (flowerpot_unlock)datas[key];
      }
   }
public class normal_sprite_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             normal_sprite_tplt row = new normal_sprite_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.appraise = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.buff_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.modal = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.show = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.dispear = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.particle = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public normal_sprite_tplt get(int key){
        return (normal_sprite_tplt)datas[key];
      }
   }
public class sprite_upgrade_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             sprite_upgrade_tplt row = new sprite_upgrade_tplt();
            if (ienum.MoveNext())
                 row.index = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.show_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.award_money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.award_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.award_item = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.index, row);
         }
      }
      public sprite_upgrade_tplt get(int key){
        return (sprite_upgrade_tplt)datas[key];
      }
   }
public class sys_shop_class_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             sys_shop_class_tplt row = new sys_shop_class_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.buytype = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.description = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.newcomer = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.auto_fitment = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.unlock = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.unlock_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.unlock_money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.unlock_material.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.unlock_material_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.unlock_material_shop_id.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public sys_shop_class_tplt get(int key){
        return (sys_shop_class_tplt)datas[key];
      }
   }
public class exp_transition_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             exp_transition row = new exp_transition();
            if (ienum.MoveNext())
                 row.old_min = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.old_max = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.new_min = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.new_max = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.old_min, row);
         }
      }
      public exp_transition get(int key){
        return (exp_transition)datas[key];
      }
   }
public class exchange_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             exchange_tplt row = new exchange_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item1_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item1_num = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item2_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item2_num = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item3_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item3_num = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item4_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item4_num = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_module = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.source_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.reward_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.reward_params = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public exchange_tplt get(int key){
        return (exchange_tplt)datas[key];
      }
   }
public class player_food_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_food_tplt row = new player_food_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.upgrade_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_lock = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.min_stock = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_stock = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.expand_stock_diamond.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.expand_stock_time.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.expand_stock_love_coin.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.max_upgrade_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.house_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.unlock_diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.particle = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.unsatisfy = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public player_food_tplt get(int key){
        return (player_food_tplt)datas[key];
      }
   }
public class player_food_upgrade_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_food_upgrade_tplt row = new player_food_upgrade_tplt();
            if (ienum.MoveNext())
                 row.upgrade_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.shop_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.decoration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.next_upgrade_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.upgrade_id, row);
         }
      }
      public player_food_upgrade_tplt get(int key){
        return (player_food_upgrade_tplt)datas[key];
      }
   }
public class player_food_product_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_food_product_tplt row = new player_food_product_tplt();
            if (ienum.MoveNext())
                 row.product_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.consume_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.copies = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.consume_speed = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sale_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.love_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.product_id, row);
         }
      }
      public player_food_product_tplt get(int key){
        return (player_food_product_tplt)datas[key];
      }
   }
public class player_food_produce_area_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_food_produce_area_tplt row = new player_food_produce_area_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.shop_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public player_food_produce_area_tplt get(int key){
        return (player_food_produce_area_tplt)datas[key];
      }
   }
public class buff_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             buff_tplt row = new buff_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.duration = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.normal_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.disable_icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.hint = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.sys_msg = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.param = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public buff_tplt get(int key){
        return (buff_tplt)datas[key];
      }
   }
public class waiter_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             waiter_tplt row = new waiter_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.waiter_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.waiter_lv = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.waiter_type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_lv = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.explain = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.coin_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.item_drop_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.speciality_explain = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.employ_money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.waiter_mod_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.picture = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.up_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.up_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.up_house_lv = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public waiter_tplt get(int key){
        return (waiter_tplt)datas[key];
      }
   }
public class party_drink_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             party_drink_tplt row = new party_drink_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.master_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.guest_score = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.shout_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.shouted_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public party_drink_tplt get(int key){
        return (party_drink_tplt)datas[key];
      }
   }
public class player_charm_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_charm_tplt row = new player_charm_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public player_charm_tplt get(int key){
        return (player_charm_tplt)datas[key];
      }
   }
public class party_food_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             party_food_tplt row = new party_food_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.diamond = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.point = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_counts.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_rate.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.food_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.model_name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_box_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_box_counts.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public party_food_tplt get(int key){
        return (party_food_tplt)datas[key];
      }
   }
