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
                 row.scene_id = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.house_furniture = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.born_x = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.born_y = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.born_z = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_players = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public house_tplt get(int key){
        return (house_tplt)datas[key];
      }
   }
public class test_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             test_tplt row = new test_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public test_tplt get(int key){
        return (test_tplt)datas[key];
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
                 row.height = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
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
                 row.imageset = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.icon = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.intro_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.overlap = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bind = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_del = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sell_price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sub_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_time_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.voiceid = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dvoiceid = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.uvoiceid = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public item_tplt get(int key){
        return (item_tplt)datas[key];
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
                 row.equip_disp_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.place = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.action = ((XmlNode)ienum.Current).InnerText;
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
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.prop_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dis_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pos = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.rot = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.scale = ((XmlNode)ienum.Current).InnerText;

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
                 row.file_res = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.x = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.y = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.z = Convert.ToSingle(((XmlNode)ienum.Current).InnerText);

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
public class domestic_service_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             domestic_service_tplt row = new domestic_service_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.house_clean = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.discount_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public domestic_service_tplt get(int key){
        return (domestic_service_tplt)datas[key];
      }
   }
public class domestic_price_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             domestic_price_tplt row = new domestic_price_tplt();
            if (ienum.MoveNext())
                 row.house_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.house_level, row);
         }
      }
      public domestic_price_tplt get(int key){
        return (domestic_price_tplt)datas[key];
      }
   }
public class work_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             work_tplt row = new work_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.grade = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_clean = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_health = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_charm = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_active = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.need_disease = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.event_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.event_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.event_rates.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.workImage = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.typeImageSet = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.typeImage = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public work_tplt get(int key){
        return (work_tplt)datas[key];
      }
   }
public class house_magic_box_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_magic_box_tplt row = new house_magic_box_tplt();
            if (ienum.MoveNext())
                 row.house_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.box_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.box_rates.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.max_box_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.player_box_range.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.max_create_box_times = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.house_level, row);
         }
      }
      public house_magic_box_tplt get(int key){
        return (house_magic_box_tplt)datas[key];
      }
   }
public class magic_box_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             magic_box_tplt row = new magic_box_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.money_range.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_rates.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public magic_box_tplt get(int key){
        return (magic_box_tplt)datas[key];
      }
   }
public class player_level_magic_box_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_level_magic_box_tplt row = new player_level_magic_box_tplt();
            if (ienum.MoveNext())
                 row.player_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_box_per_day = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_times = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.player_level, row);
         }
      }
      public player_level_magic_box_tplt get(int key){
        return (player_level_magic_box_tplt)datas[key];
      }
   }
public class house_garbage_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             house_garbage_tplt row = new house_garbage_tplt();
            if (ienum.MoveNext())
                 row.house_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.garbage_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.garbage_rates.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.max_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.house_level, row);
         }
      }
      public house_garbage_tplt get(int key){
        return (house_garbage_tplt)datas[key];
      }
   }
public class garbage_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             garbage_tplt row = new garbage_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.money_range.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_ids.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_rates.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public garbage_tplt get(int key){
        return (garbage_tplt)datas[key];
      }
   }
public class random_garbage_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             random_garbage_tplt row = new random_garbage_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.interval.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.garbage_count.Add(Convert.ToInt32(v));
                }

             datas.Add(row.id, row);
         }
      }
      public random_garbage_tplt get(int key){
        return (random_garbage_tplt)datas[key];
      }
   }
public class work_event_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             work_event_tplt row = new work_event_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.item_rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public work_event_tplt get(int key){
        return (work_event_tplt)datas[key];
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
public class player_property_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_property_tplt row = new player_property_tplt();
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_clean = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_health = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.player_charm = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.active_value = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.property_id, row);
         }
      }
      public player_property_tplt get(int key){
        return (player_property_tplt)datas[key];
      }
   }
public class player_property_by_stime_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_property_by_stime_tplt row = new player_property_by_stime_tplt();
            if (ienum.MoveNext())
                 row.min_property = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_property = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ref_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.min_property, row);
         }
      }
      public player_property_by_stime_tplt get(int key){
        return (player_property_by_stime_tplt)datas[key];
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
                 row.sex = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.price = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.commend = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.broadcast_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

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
                 row.title = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.intention = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.step_count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.props.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.props_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.require_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.require_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.describe = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.select_reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.select_reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.fixed_reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.fixed_reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reward_game_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_eq_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.time_limit = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.property_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_repeat = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_show = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_give_up = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.task_id, row);
         }
      }
      public player_task_tplt get(int key){
        return (player_task_tplt)datas[key];
      }
   }
public class farm_task_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_task_tplt row = new farm_task_tplt();
            if (ienum.MoveNext())
                 row.task_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.title = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.intention = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.describe = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.imageset = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.fixed_reward_items.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.fixed_reward_items_count.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reward_game_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reward_eq_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.time_limit = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_repeat = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.task_id, row);
         }
      }
      public farm_task_tplt get(int key){
        return (farm_task_tplt)datas[key];
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
                 row.task_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.tasks.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.is_repeat = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.is_restart = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.task_id, row);
         }
      }
      public chain_task_tplt get(int key){
        return (chain_task_tplt)datas[key];
      }
   }
public class farm_seed_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_seed_tplt row = new farm_seed_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.expect_output = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sprout_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.s_leaf_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.b_leaf_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bloom_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pick_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.drought_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pest_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.grass_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.use_level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.pick_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.redland = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public farm_seed_tplt get(int key){
        return (farm_seed_tplt)datas[key];
      }
   }
public class farm_damage_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_damage_tplt row = new farm_damage_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sprout_ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.s_leaf_ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.b_leaf_ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.bloom_ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.interval = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.reduce_health = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public farm_damage_tplt get(int key){
        return (farm_damage_tplt)datas[key];
      }
   }
public class farm_pet_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_pet_tplt row = new farm_pet_tplt();
            if (ienum.MoveNext())
                 row.pet_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.rate = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.min_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.max_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.pet_id, row);
         }
      }
      public farm_pet_tplt get(int key){
        return (farm_pet_tplt)datas[key];
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
public class farm_shop_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_shop_tplt row = new farm_shop_tplt();
            if (ienum.MoveNext())
                 row.item_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.gameprice = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.eqprice = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.intro = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.special = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.repeat_buy = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.add_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
           foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.rewards.Add(v);
                }

             datas.Add(row.item_id, row);
         }
      }
      public farm_shop_tplt get(int key){
        return (farm_shop_tplt)datas[key];
      }
   }
public class farm_assart_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_assart_tplt row = new farm_assart_tplt();
            if (ienum.MoveNext())
                 row.plot_index = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.plot_index, row);
         }
      }
      public farm_assart_tplt get(int key){
        return (farm_assart_tplt)datas[key];
      }
   }
public class farm_level_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_level_tplt row = new farm_level_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.next_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.sow_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.water_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.weed_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.worm_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.hoeing_exp = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.title = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.level, row);
         }
      }
      public farm_level_tplt get(int key){
        return (farm_level_tplt)datas[key];
      }
   }
public class farm_decoration_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_decoration_tplt row = new farm_decoration_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.static_model = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.dynamic_model = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.scene_name = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public farm_decoration_tplt get(int key){
        return (farm_decoration_tplt)datas[key];
      }
   }
public class farm_decoration_init_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_decoration_init_tplt row = new farm_decoration_init_tplt();
            if (ienum.MoveNext())
                 row.background = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.house = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.doghouse = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.signpost = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fence = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.scarecrow = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.billboard = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.billboard_content = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.background, row);
         }
      }
      public farm_decoration_init_tplt get(int key){
        return (farm_decoration_init_tplt)datas[key];
      }
   }
public class farm_setting_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_setting_tplt row = new farm_setting_tplt();
            if (ienum.MoveNext())
                 row.water = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.weed = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.worm = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.put_grass = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.put_pest = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.water, row);
         }
      }
      public farm_setting_tplt get(string key){
        return (farm_setting_tplt)datas[key];
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
public class farm_prop_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farm_prop_tplt row = new farm_prop_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_range = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.effect_output = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.effect_stage.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.reduce_time = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public farm_prop_tplt get(int key){
        return (farm_prop_tplt)datas[key];
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
public class player_property_interaction_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             player_property_interaction_tplt row = new player_property_interaction_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.monitor_player_clean = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.monitor_player_health = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.monitor_player_charm = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.monitor_active_value = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ref_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public player_property_interaction_tplt get(int key){
        return (player_property_interaction_tplt)datas[key];
      }
   }
public class farmland_upgrade_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farmland_upgrade_tplt row = new farmland_upgrade_tplt();
            if (ienum.MoveNext())
                 row.land_num = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.money = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.land_num, row);
         }
      }
      public farmland_upgrade_tplt get(int key){
        return (farmland_upgrade_tplt)datas[key];
      }
   }
public class red_farmland_harvest_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             red_farmland_harvest_tplt row = new red_farmland_harvest_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.data = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.id, row);
         }
      }
      public red_farmland_harvest_tplt get(int key){
        return (red_farmland_harvest_tplt)datas[key];
      }
   }
public class farmfruit_aberrance_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farmfruit_aberrance_tplt row = new farmfruit_aberrance_tplt();
            if (ienum.MoveNext())
                 row.seed_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id1 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id2 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id3 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id4 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio5 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id5 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio6 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id6 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio7 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id7 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio8 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id8 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio9 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id9 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio10 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id10 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio11 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id11 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio12 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.fruit_id12 = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.seed_id, row);
         }
      }
      public farmfruit_aberrance_tplt get(int key){
        return (farmfruit_aberrance_tplt)datas[key];
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
                 row.game_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.eq_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.model_id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.imageset = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public gift_box_tplt get(int key){
        return (gift_box_tplt)datas[key];
      }
   }
public class gift_card_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             gift_card_tplt row = new gift_card_tplt();
            if (ienum.MoveNext())
                 row.id = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.type = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.name = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.game_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.eq_coin = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.imageset = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.image = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.desc = ((XmlNode)ienum.Current).InnerText;
            if (ienum.MoveNext())
                 row.url = ((XmlNode)ienum.Current).InnerText;

             datas.Add(row.id, row);
         }
      }
      public gift_card_tplt get(int key){
        return (gift_card_tplt)datas[key];
      }
   }
public class farmhoeing_awards_tplt_table{
    public Hashtable datas = new Hashtable();
    public void read(string xmlStr){
         XmlDocument xd = new XmlDocument();
	     xd.LoadXml(xmlStr);

         if(!xd.HasChildNodes)
             return;

         foreach(XmlElement r in xd.DocumentElement.ChildNodes)
         {
             IEnumerator ienum = r.ChildNodes.GetEnumerator();
             farmhoeing_awards_tplt row = new farmhoeing_awards_tplt();
            if (ienum.MoveNext())
                 row.level = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                 row.ratio = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);
            if (ienum.MoveNext())
                   foreach(string v in ((XmlNode)ienum.Current).InnerText.Split(new string[]{" ", ",", ", "}, StringSplitOptions.RemoveEmptyEntries)){
                     row.item_id.Add(Convert.ToInt32(v));
                }
            if (ienum.MoveNext())
                 row.count = Convert.ToInt32(((XmlNode)ienum.Current).InnerText);

             datas.Add(row.level, row);
         }
      }
      public farmhoeing_awards_tplt get(int key){
        return (farmhoeing_awards_tplt)datas[key];
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

             datas.Add(row.id, row);
         }
      }
      public flower_tplt get(int key){
        return (flower_tplt)datas[key];
      }
   }
