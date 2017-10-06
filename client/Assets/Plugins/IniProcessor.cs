using System;
using System.Text.RegularExpressions;
using System.Collections;


/*********************************************************************
   DWG INI Parser 1.0
        作者：DWG
            Copyright(C)2002-2003
作者网站：http://asp.6to23.com/mulansystem
版权声明：
(1)版权归“DWG”所有，任何个人或企业未经许可不得用于商业用途;
(2)个人可免费使用本程序，但不得去除版权信息，修改后的版本不得去除原作者信息;
   若要发布修改版本，应该先给作者发一份修改后的源程序;
(3)本源程序发布在http://asp.6to23.com/mulansystem 技术/原创作品展示
使用方法：
   请参考http://asp.6to23.com/mulansystem 技术/原创作品展示内的相关文档;
*********************************************************************/

public class IniProcessor
{
    public delegate void OnDebugMessage(bool errorflag, string msg);
    public event OnDebugMessage OnDebug;
    private Regex regex;
    private MatchCollection mc;
    private IniComment cm;
    private IniConvert cv;
    // Temporary swap variable
    private string strA, strAA;
    private string[] strB, strBB;
    // Control flags
    private string iniEOL;
    private bool iniCleanSpilthEOL, iniProcError, iniCaseSensitive;
    //
    public void Ini()
    {
        cm = new IniComment();
        cv = new IniConvert();
        ResetDefaultOptions();
        OnDebug += new OnDebugMessage(OnDefaultDebugMessage);
    }
    ///////////////////////////// Interface Functions /////////////////////////////////
    public string SetString(string src_ini, string mainkey, string subkey, string val)
    {
        string temp = cv.EncodeString(val);

        if (temp.Length == src_ini.Length)
            return AutoSetKeyValue(src_ini, mainkey, subkey, temp);

        return AutoSetKeyValue(src_ini, mainkey, subkey, "\"" + temp + "\"");
    }

    public string GetString(string src_ini, string mainkey, string subkey)
    {
        string temp = GetKeyValue(src_ini, mainkey, subkey);
        if (!iniProcError)
        {
            if (temp.IndexOf("\"") == 0 && temp.IndexOf("\"", temp.Length - 1) == temp.Length - 1 && temp.Length > 2)
                return cv.DecodeString(temp.Substring(1, temp.Length - 2));
            else
                return temp;
        }

        return "";
    }

    public string[] GetMainkeyNames(string src_ini)
    {
        strB = new string[] { "" };
        strAA = CleanComments(src_ini);
        if (!iniProcError)
        {
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int cnt = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length != 0)
                    cnt++;
            strB = new string[cnt];
            cnt = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length != 0)
                    strB[cnt++] = mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim();
            SendOkMsg("Get mainkey names OK.");
            return strB;
        }

        return strB;
    }

    public string[] GetSubkeyNames(string src_ini, string mainkey)
    {
        strB = new string[] { "" };
        if (TestMainkeyExist(src_ini, mainkey))
        {
            strB = new string[] { "" };
            strAA = CleanComments(src_ini);
            if (!iniProcError)
            {
                cm.WithoutContainer();
                strA = cm.EmptyComments(strAA, "\"", "\"");
                mainkey = CaseProc(mainkey.Trim());
                regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
                mc = regex.Matches(strA);
                int sloc = 0, length = 0;
                for (int i = 0; i < mc.Count; i++)
                    if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length != 0)
                        if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                        {
                            sloc = mc[i].Index + mc[i].Value.Length;
                            if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                            else length = strA.Substring(sloc).Length;
                            break;
                        }
                strB = strAA.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
                length = 0;
                for (int i = 0; i < strB.Length; i++)
                    if (strB[i].Trim().Replace("\ua1a1", "").Length != 0)
                        if (strB[i].Trim().Replace("\ua1a1", "").Split('=').Length > 1)
                            length++;
                strBB = new String[length];
                length = 0;
                for (int i = 0; i < strB.Length; i++)
                    if (strB[i].Trim().Replace("\ua1a1", "").Length != 0)
                        if (strB[i].Trim().Replace("\ua1a1", "").Split('=').Length > 1)
                            strBB[length++] = strB[i].Split('=')[0].Trim();
                SendOkMsg("Get subkey names OK.");
                return strBB;
            }
            return strB;
        }

        return strB;
    }

    public bool TestKeyExist(string src_ini, string mainkey, string subkey)
    {
        if (mainkey.Trim().Length == 0 && subkey.Trim().Length == 0)
        {
            SendErrorMsg("Test key exist exception:must be specify the mainkey & subkey names.");
            return false;
        }
        else if (subkey.Trim().Length == 0)
            return TestMainkeyExist(src_ini, mainkey);

        return TestSubkeyExist(src_ini, mainkey, subkey);
    }

    public string GetKeyValue(string src_ini, string mainkey, string subkey)
    {
        if (TestSubkeyExist(src_ini, mainkey, subkey))
        {
            strAA = CleanComments(src_ini);
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            if (iniProcError) return "";
            mainkey = CaseProc(mainkey.Trim());
            subkey = CaseProc(subkey.Trim());
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int sloc = 0, length = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length != 0)
                    if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                    {
                        sloc = mc[i].Index + mc[i].Value.Length;
                        if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                        else length = strA.Substring(sloc).Length;
                        break;
                    }
            strB = strAA.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
            strA = "";
            for (int i = 0; i < strB.Length; i++)
                if (strB[i].Trim().Replace("\ua1a1", "").Length != 0)
                    if (strB[i].Trim().Replace("\ua1a1", "").Split('=').Length > 1)
                        if (CaseProc(strB[i].Split('=')[0].Trim()) == subkey)
                            strA = strB[i].Substring(strB[i].IndexOf("=") + 1).Trim();
            SendOkMsg("The value of key:\"" + mainkey.Trim() + "." + subkey + "\" is " + strA + ".");
            return strA;
        }

        return "";
    }

    public long GetKeyValueLong(string src_ini, string mainkey, string subkey)
    {
        strA = GetKeyValue(src_ini, mainkey, subkey);
        if (!iniProcError && strA.Trim().Length != 0)
        {
            regex = new Regex(@"[^0-9]*");
            mc = regex.Matches(strA);
            if (mc.Count == 0) return Int64.Parse(strA.Trim());
            else return 0;
        }
        else return 0;
    }
    public string SetKeyValue(string src_ini, string mainkey, string subkey, string val)
    {
        if (TestSubkeyExist(src_ini, mainkey, subkey))
        {
            strAA = EmptyComments(src_ini);
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            mainkey = CaseProc(mainkey.Trim());
            subkey = CaseProc(subkey.Trim());
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int sloc = 0, length = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length > 0)
                    if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                    {
                        sloc = mc[i].Index + mc[i].Value.Length;
                        if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                        else length = strA.Substring(sloc).Length;
                        break;
                    }
            strB = strAA.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
            strBB = src_ini.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
            strA = "";
            for (int i = 0; i < strB.Length; i++)
                if (strB[i].Trim().Replace("\ua1a1", "").Length != 0)
                {
                    if (strB[i].Trim().Split('=').Length > 1)
                    {
                        if (CaseProc(strB[i].Split('=')[0].Trim()) == subkey)
                        {
                            strA += strB[i].Trim().Split('=')[0].Trim() + "=" + val.Trim();
                            if (strBB[i].IndexOf(@";") != -1 && strBB[i].IndexOf(@"//") != -1)
                            {
                                if (strBB[i].IndexOf(@";") < strBB[i].IndexOf(@"//"))
                                    strA += strBB[i].Substring(strBB[i].IndexOf(@";"));
                                else
                                    strA += strBB[i].Substring(strBB[i].IndexOf(@"//"));
                            }
                            else if (strBB[i].IndexOf(@"//") != -1)
                            {
                                strA += strBB[i].Substring(strBB[i].IndexOf("//"));
                            }
                            else if (strBB[i].IndexOf(@";") != -1)
                            {
                                strA += strBB[i].Substring(strBB[i].IndexOf(@";"));
                            }
                            strA += iniEOL;
                        }
                        else strA += strBB[i] + iniEOL;
                    }
                    else strA += strBB[i] + iniEOL;
                }
                else strA += strBB[i] + iniEOL;
            SendOkMsg("Set the value of key:\"" + mainkey.Trim() + "." + subkey + "\" to \"" + val.Trim() + "\".");
            strA = src_ini.Substring(0, sloc) + strA + src_ini.Substring(sloc + length);
            return CleaningSpilthEOL(strA);
        }
        else return src_ini;
    }
    public string SetKeyValueLong(string src_ini, string mainkey, string subkey, long val)
    {
        return SetKeyValue(src_ini, mainkey, subkey, val.ToString());
    }
    public string AutoSetKeyValue(string src_ini, string mainkey, string subkey, string val)
    {
        if (!TestMainkeyExist(src_ini, mainkey)) src_ini = CreateMainkey(src_ini, mainkey);
        return CreateSubkey(src_ini, mainkey, subkey, val);
    }
    public string CleanComments(string src_ini)
    {
        if (src_ini.Trim() != "")
        {
            cm.WithoutContainer("\"", "\"", "\'", "\'");
            strA = cm.CleanComments(src_ini, @"/*", @"*/", @"//", "", @";", "");
            SendOkMsg("Clean comments OK.");
            return CleaningSpilthEOL(strA);
        }
        else
        {
            SendErrorMsg("Source ini string empty exception when cleaning comments.");
            return src_ini;
        }
    }
    public void ResetDefaultOptions()
    {
        iniEOL = "\r\n";
        iniCleanSpilthEOL = true;
        iniProcError = false;
        iniCaseSensitive = true;
        cm.EOL = iniEOL;
        cm.CleanSpilthEOL = iniCleanSpilthEOL;
    }
    public string DeleteKey(string src_ini, string mainkey, string subkey)
    {
        if (subkey.Trim().Length == 0) return DeleteMainkey(src_ini, mainkey);
        else return DeleteSubkey(src_ini, mainkey, subkey);
    }
    /////////////////////////////// Internal functions ////////////////////////////////
    protected string CreateMainkey(string src_ini, string mainkey)
    {
        if (mainkey.Trim().Length == 0)
        {
            SendErrorMsg(@"Internal:create mainkey error,must specify the mainkey name.");
            return src_ini;
        }
        else
        {
            if (TestMainkeyExist(src_ini, mainkey)) src_ini = CleaningSpilthEOL(DeleteMainkey(src_ini, mainkey));
            src_ini += iniEOL + "[" + mainkey.Trim() + "]" + iniEOL;
            SendOkMsg("Internal:create mainkey \"" + mainkey.Trim() + "\" OK.");
            return CleaningSpilthEOL(src_ini);
        }
    }
    protected string CreateSubkey(string src_ini, string mainkey, string subkey, string val)
    {
        if (TestMainkeyExist(src_ini, mainkey))
        {
            if (TestSubkeyExist(src_ini, mainkey, subkey)) return SetKeyValue(src_ini, mainkey, subkey, val);
            strAA = EmptyComments(src_ini);
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            mainkey = CaseProc(mainkey.Trim());
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int sloc = 0, length = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length > 0)
                    if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                    {
                        sloc = mc[i].Index + mc[i].Value.Length;
                        if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                        else length = strA.Substring(sloc).Length;
                        break;
                    }
            strA = src_ini.Substring(0, sloc + length) + iniEOL + subkey + "=" + val.Trim() + iniEOL + src_ini.Substring(sloc + length);
            SendOkMsg("Create the subkey:\"" + mainkey.Trim() + "." + subkey.Trim() + "\" OK.");
            return CleaningSpilthEOL(strA);
        }
        else return src_ini;
    }
    protected string DeleteMainkey(string src_ini, string mainkey)
    {
        if (TestMainkeyExist(src_ini, mainkey))
        {
            strAA = EmptyComments(src_ini);
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            mainkey = CaseProc(mainkey.Trim());
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int sloc = 0, length = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length > 0)
                    if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                    {
                        sloc = mc[i].Index;
                        if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                        else length = strA.Substring(sloc).Length;
                        break;
                    }
            strA = src_ini.Substring(0, sloc) + iniEOL + src_ini.Substring(sloc + length);
            SendOkMsg("Delete the mainkey:\"" + mainkey.Trim() + "\" OK.");
            return CleaningSpilthEOL(strA);
        }
        else return src_ini;
    }
    protected string DeleteSubkey(string src_ini, string mainkey, string subkey)
    {
        if (TestSubkeyExist(src_ini, mainkey, subkey))
        {
            strAA = EmptyComments(src_ini);
            cm.WithoutContainer();
            strA = cm.EmptyComments(strAA, "\"", "\"");
            mainkey = CaseProc(mainkey.Trim());
            subkey = CaseProc(subkey.Trim());
            regex = new Regex(@"(\r\n)?\[[\x20\ua1a1]*\S+[\x20\ua1a1]*\]\s*(\r\n)?");
            mc = regex.Matches(strA);
            int sloc = 0, length = 0;
            for (int i = 0; i < mc.Count; i++)
                if (mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim().Replace("\ua1a1", "").Length > 0)
                    if (CaseProc(mc[i].Value.Replace(iniEOL, "").Replace("[", "").Replace("]", "").Trim()) == mainkey)
                    {
                        sloc = mc[i].Index + mc[i].Value.Length;
                        if ((i + 1) != mc.Count) length = mc[i + 1].Index - sloc;
                        else length = strA.Substring(sloc).Length;
                        break;
                    }
            strB = strAA.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
            strBB = src_ini.Substring(sloc, length).Replace(iniEOL, "\n").Split('\n');
            strA = "";
            for (int i = 0; i < strB.Length; i++)
                if (strB[i].Trim().Replace("\ua1a1", "").Length != 0)
                {
                    if (strB[i].Trim().Replace("\ua1a1", "").Split('=').Length > 1)
                    {
                        if (CaseProc(strB[i].Split('=')[0].Trim()) != subkey) strA += strBB[i] + iniEOL;
                    }
                    else strA += strBB[i] + iniEOL;
                }
                else strA += strBB[i] + iniEOL;
            SendOkMsg("Delete the subkey:\"" + mainkey.Trim() + "." + subkey + "\" OK.");
            strA = src_ini.Substring(0, sloc) + strA + src_ini.Substring(sloc + length);
            return CleaningSpilthEOL(strA);
        }
        else return src_ini;
    }
    protected string EmptyComments(string src_ini)
    {
        if (src_ini.Trim().Length != 0)
        {
            cm.WithoutContainer("\"", "\"", "\'", "\'");
            strA = cm.EmptyComments(src_ini, @"/*", @"*/", @"//", "", @";", "");
            SendOkMsg(@"Internal:empty comments OK.");
            return strA;
        }
        else
        {
            SendErrorMsg(@"Internal:source ini empty exception.");
            return src_ini;
        }
    }
    protected bool TestMainkeyExist(string src_ini, string mainkey)
    {
        strB = GetMainkeyNames(src_ini);
        if (!iniProcError)
        {
            mainkey = CaseProc(mainkey.Trim());
            if (mainkey.Length == 0)
            {
                SendErrorMsg("Test mainkey exist exception:must specify the mainkey name.");
                return false;
            }
            for (int i = 0; i < strB.Length; i++)
                if (CaseProc(strB[i]) == mainkey)
                {
                    SendOkMsg("The main key:\"" + mainkey + "\" to be exist.");
                    return true;
                }
            SendOkMsg("The main key:\"" + mainkey + "\" not exist.");
            return false;
        }
        else return false;
    }
    protected bool TestSubkeyExist(string src_ini, string mainkey, string subkey)
    {
        if (TestMainkeyExist(src_ini, mainkey))
        {
            strB = new string[] { "" };
            strB = GetSubkeyNames(src_ini, mainkey);
            if (!iniProcError)
            {
                subkey = CaseProc(subkey.Trim());
                if (subkey.Length == 0)
                {
                    SendErrorMsg("Test subkey exist exception:must specify the subkey name.");
                    return false;
                }
                if (strB.Length > 0)
                {
                    for (int i = 0; i < strB.Length; i++)
                        if (CaseProc(strB[i]) == subkey)
                        {
                            SendOkMsg("The key:\"" + mainkey.Trim() + "." + subkey + "\" to be exist.");
                            return true;
                        }
                }
                SendOkMsg("The key:\"" + mainkey.Trim() + "." + subkey + "\" not exist.");
                return false;
            }
            else return false;
        }
        else return false;
    }
    private string CleaningSpilthEOL(string src_ini)
    {
        strA = src_ini;
        if (iniCleanSpilthEOL)
        {
            for (int i = 0; i < 3; i++) strA = strA.Replace(iniEOL + iniEOL, iniEOL);
            while (strA.IndexOf(iniEOL) == 0)
            {
                strA = strA.Substring(iniEOL.Length);
            }
        }
        return strA;
    }
    private void SendOkMsg(string msg)
    {
        iniProcError = false;
        OnDebug(iniProcError, msg);
    }
    private void SendErrorMsg(string msg)
    {
        iniProcError = true;
        OnDebug(iniProcError, msg);
    }
    private void OnDefaultDebugMessage(bool error, string msg)
    {
    }
    private string CaseProc(string str)
    {
        if (iniCaseSensitive) return str;
        else return str.ToLower();
    }
    /////////////////////////////// Attributes function ///////////////////////////////
    public string EOL
    {
        get
        {
            return iniEOL;
        }
        set
        {
            iniEOL = value;
            cm.EOL = iniEOL;
        }
    }
    public bool CleanSpilthEOL
    {
        get
        {
            return iniCleanSpilthEOL;
        }
        set
        {
            iniCleanSpilthEOL = value;
            cm.CleanSpilthEOL = iniCleanSpilthEOL;
        }
    }
    public bool CaseSensitive
    {
        get
        {
            return iniCaseSensitive;
        }
        set
        {
            iniCaseSensitive = value;
        }
    }
    public bool Error
    {
        get
        {
            return iniProcError;
        }
    }
}
public class IniConvert
{
    public string DecodeString(string src)
    {
        if (src.Trim().Length > 0)
        {
            src = src.Replace(@"\a", "\a");
            src = src.Replace(@"\b", "\b");
            src = src.Replace(@"\t", "\t");
            src = src.Replace(@"\r", "\r");
            src = src.Replace(@"\v", "\v");
            src = src.Replace(@"\f", "\f");
            src = src.Replace(@"\n", "\n");
            src = src.Replace(@"\d", "\x22");
            src = src.Replace(@"\s", "\x27");
            src = src.Replace(@"\m", "\\");
            int loc = 0, begin = 0;
            string temp = "";
            while (loc < src.Length && src.IndexOf(@"\", loc) > -1)
            {
                loc = src.IndexOf(@"\", loc);
                for (int i = begin; i < loc; i++) temp += src[i].ToString();
                temp += StringToValue(src, ref loc);
                begin = loc;
                if (loc >= src.Length) break;
            }
            if (loc <= src.Length - 1)
            {
                for (int i = loc; i <= src.Length - 1; i++)
                    temp += src[i].ToString();
            }
            return temp;
        }
        else return src;
    }
    public string EncodeString(string src)
    {
        if (src.Trim().Length > 0)
        {
            src = src.Replace("\\", @"\m");
            src = src.Replace("\a", @"\a");
            src = src.Replace("\b", @"\b");
            src = src.Replace("\t", @"\t");
            src = src.Replace("\r", @"\r");
            src = src.Replace("\v", @"\v");
            src = src.Replace("\f", @"\f");
            src = src.Replace("\n", @"\n");
            src = src.Replace("\x22", @"\d");
            src = src.Replace("\x27", @"\s");
            string temp = "";
            for (int i = 0; i < src.Length; i++)
            {
                if (src[i] <= '\x1f' || (src[i] >= '\x7f' && src[i] <= '\xff')) temp += ToHexString(src[i]);
                else temp += src[i].ToString();
            }
            return temp;
        }
        else return src;
    }
    public string StringToValue(string src, ref int loc)
    {
        string temp;
        if (loc + 1 < src.Length)
        {
            if (loc + 1 < src.Length - 1)
            {
                temp = src.Substring(loc + 1);
                ushort a = 0, b = 0, c = 0;
                if (temp[0] == '0')
                {
                    if (temp[1] >= '0' && temp[1] <= '7')
                    {
                        a = (ushort)(temp[1] - '0');
                        if (temp.Length >= 3)
                        {
                            if (temp[2] >= '0' && temp[2] <= '7')
                            {
                                b = (ushort)(temp[2] - '0');
                                if (temp.Length >= 4)
                                {
                                    if (temp[3] >= '0' && temp[3] <= '7')
                                    {
                                        c = (ushort)(temp[3] - '0');
                                        loc += 5;
                                        return ((char)(a * 64 + b * 8 + c)).ToString();
                                    }
                                    else
                                    {
                                        loc += 4;
                                        return ((char)(a * 8 + b)).ToString();
                                    }
                                }
                                else
                                {
                                    loc += 4;
                                    return ((char)(a * 8 + b)).ToString();
                                }
                            }
                            else
                            {
                                loc += 3;
                                return ((char)a).ToString();
                            }
                        }
                        else
                        {
                            loc += 3;
                            return ((char)a).ToString();
                        }
                    }
                    else
                    {
                        loc += 2;
                        return @"\0";
                    }
                }
                else if (temp[0].ToString().ToLower() == "x")
                {
                    if ((temp[1] >= '0' && temp[1] <= '9') || ((temp[1] | 0x20) >= 'a' && (temp[1] | 0x20) <= 'f'))
                    {
                        if (temp[1] <= '9')
                        {
                            a = (ushort)(temp[1] - '0');
                        }
                        else
                        {
                            a = (ushort)((temp[1] | 0x20) - 'a' + 10);
                        }
                        if (temp.Length >= 3)
                        {
                            if ((temp[2] >= '0' && temp[2] <= '9') || ((temp[2] | 0x20) >= 'a' && (temp[2] | 0x20) <= 'f'))
                            {
                                if (temp[2] <= '9')
                                {
                                    b = (ushort)(temp[2] - '0');
                                }
                                else
                                {
                                    b = (ushort)((temp[2] | 0x20) - 'a' + 10);
                                }
                                loc += 4;
                                return ((char)(a * 16 + b)).ToString();
                            }
                            else
                            {
                                loc += 3;
                                return ((char)a).ToString();
                            }
                        }
                        else
                        {
                            loc += 3;
                            return ((char)a).ToString();
                        }
                    }
                    else
                    {
                        loc += 2;
                        return @"\" + temp[0].ToString();
                    }
                }
                else
                {
                    loc++;
                    return @"\";
                }
            }
            else
            {
                loc += 2;
                return @"\" + src[loc - 1].ToString();
            }
        }
        else
        {
            loc++;
            return @"\";
        }
    }
    protected string ToHexString(char val)
    {
        ushort baseradix = 16;
        return @"\x" + HexCode((ushort)(val / baseradix)) + HexCode((ushort)(val % baseradix));
    }
    protected string ToOctString(char val)
    {
        int baseradix = 8, a = 0, b = 0, c = 0, v;
        v = (int)val;
        if (v > baseradix * baseradix)
            a = v / (baseradix * baseradix);
        if (v > baseradix)
            b = (v - a * baseradix * baseradix) / baseradix;
        c = (ushort)(v - a * baseradix * baseradix - b * baseradix);
        return @"\0" + a.ToString() + b.ToString() + c.ToString();
    }
    private string HexCode(ushort val)
    {
        val = (ushort)(val % 16);
        string temp = val.ToString();
        if (val > 9)
        {
            switch (val)
            {
                case 10:
                    temp = "a";
                    break;
                case 11:
                    temp = "b";
                    break;
                case 12:
                    temp = "c";
                    break;
                case 13:
                    temp = "d";
                    break;
                case 14:
                    temp = "e";
                    break;
                case 15:
                    temp = "f";
                    break;
            }
        }
        return temp;
    }
}
public class IniComment
{
    private string comEOL, strA;
    private string[] strB;
    private const char splitor = ',';
    //
    private int[,] info;
    private string[,] without;
    private bool comCleanSpilthEOL;
    //
    public IniComment()
    {
        ResetDefault();
    }
    public void ResetDefault()
    {
        comEOL = "\r\n";
        info = new int[0, 0];
        without = new string[0, 0];
        comCleanSpilthEOL = true;
    }
    ///////////////////////////////////// Public Functions /////////////////////////////////////
    public void WithoutContainer(params string[] para)
    {
        if (para.GetUpperBound(0) == -1)
        {
            without = new string[0, 0];
        }
        else
        {
            int count = para.GetUpperBound(0) + 1;
            int cnt = count / 2;
            if (count % 2 == 1) cnt++;
            without = new string[cnt, 2];
            for (int i = 0, j = 0; i < cnt; i++)
            {
                without[i, 0] = para[j++].Trim();
                if (j + 1 >= count)
                    without[i, 1] = "";
                else
                    without[i, 1] = para[j++].Trim();
            }
        }
        info = new int[0, 0];
    }
    public void ProcessComments(string src, params string[] para)
    {
        if (src == null)
            strA = "";
        info = new int[0, 0];
        if (src.Trim().Length > 0 && para.GetUpperBound(0) != -1)
        {
            int count = para.GetUpperBound(0) + 1;
            int cnt = count / 2;
            if (count % 2 == 1) cnt++;
            string[,] keyword = new String[cnt, 3];
            for (int i = 0, j = 0; i < cnt; i++)
            {
                keyword[i, 0] = i.ToString();
                keyword[i, 1] = para[j++].Trim();
                if (j + 1 >= count)
                    keyword[i, 2] = "";
                else
                    keyword[i, 2] = para[j++].Trim();
            }
            //check double first
            int loc, end, begin;
            string temp;
            bool prev = false;
            strA = src;
            string al = "";
            for (int z = 0; z < 2; z++)
            {
                for (int i = 0; i < cnt; i++)
                {
                    if (z == 0) { if (keyword[i, 2].Length == 0) continue; }
                    else { if (keyword[i, 2].Length > 0) continue; }
                    loc = 0;
                    while (strA.IndexOf(keyword[i, 1], loc) != -1 && loc < strA.Length)
                    {
                        loc = strA.IndexOf(keyword[i, 1], loc);
                        temp = LineOfIndex(strA, loc, out begin);
                        if (OnTheContainer(temp, loc - begin))
                        {
                            loc += keyword[i, 1].Length;
                            continue;
                        }
                        else
                        { //checking if on prefore
                            prev = false;
                            for (int j = 0; j < cnt; j++)
                            {
                                if (j != i)
                                {
                                    if (temp.IndexOf(keyword[j, 1]) != -1)
                                    {
                                        if (!OnTheContainer(temp, temp.IndexOf(keyword[j, 1])))
                                        {
                                            if (temp.IndexOf(keyword[j, 1]) < loc - begin)
                                            {
                                                prev = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (!prev)
                            {
                                end = loc + keyword[i, 1].Length;
                                if (end >= strA.Length - 1)
                                    end = strA.Length - 1;
                                if (z == 0)
                                {
                                    end = strA.IndexOf(keyword[i, 2], end);
                                    if (end == -1)
                                    {
                                        end = strA.Length - 1;
                                        begin = end + 1;
                                    }
                                    else
                                    {
                                        end += keyword[i, 2].Length - 1;
                                        begin = end + 1;
                                    }
                                }
                                else
                                {
                                    end = strA.IndexOf(comEOL, end);
                                    if (end == -1)
                                    {
                                        end = strA.Length - 1;
                                        begin = end + 1;
                                    }
                                    else
                                    {
                                        end += comEOL.Length - 1;
                                        begin = end + 1;
                                    }
                                }
                                strA = MakeBlank(strA, loc, end);
                                if (al.Length != 0) al += splitor.ToString();
                                al += i.ToString() + splitor.ToString() + loc.ToString() + splitor.ToString() + end.ToString();
                                loc = begin;
                                if (begin >= strA.Length) break;
                            }
                            else
                            {
                                loc += keyword[i, 1].Length;
                            }
                        }//else
                    }//while
                }//for
            }//for
            strB = al.Split(splitor);
            count = strB.Length / 3;
            if (count != 0)
            {
                info = new int[count, 3];
                for (cnt = 0, begin = 0; cnt < count; cnt++)
                {
                    for (loc = 0; loc < 3; loc++)
                        info[cnt, loc] = (int)Int32.Parse(strB[begin++]);
                }
            }
        }
    }
    public string EmptyComments(string src, params string[] para)
    {
        if (src == null)
            strA = "";
        ProcessComments(src, para);
        return strA;
    }

    public string CleanComments(string src, params string[] para)
    {
        if (src == null)
            strA = "";
        ProcessComments(src, para);
        strB = Split(strA, comEOL);
        if (strB.Length > 1)
        {
            strA = "";
            for (int i = 0; i < strB.Length; i++)
            {
                strA += strB[i].Trim() + comEOL;
            }
            return CleaningSpilthEOL(strA);
        }

        return CleaningSpilthEOL(strB[0].Trim());
    }

    public static string[] Split(string src, string separator)
    {
        if (src == null)
            src = "";
        string[] str = new string[1] { src };
        if (src.Trim().Length != 0)
        {
            if (src.IndexOf(separator) > -1)
            {
                int cnt = 0, loc = 0, begin = 0;
                while (loc < src.Length && src.IndexOf(separator, loc) > -1)
                {
                    cnt++;
                    loc = src.IndexOf(separator, loc) + separator.Length;
                    if (loc >= src.Length) break;
                }
                if (loc <= src.Length - 1) cnt++;
                str = new string[cnt];
                loc = 0;
                cnt = 0;
                while (loc < src.Length && src.IndexOf(separator, loc) > -1)
                {
                    loc = src.IndexOf(separator, loc);
                    str[cnt] = "";
                    for (int i = begin; i < loc; i++) str[cnt] += src[i].ToString();
                    loc += separator.Length;
                    begin = loc;
                    if (loc >= src.Length) break;
                    cnt++;
                }
                if (loc <= src.Length - 1)
                {
                    for (int i = loc; i <= src.Length - 1; i++) str[cnt] += src[i].ToString();
                }
                return str;
            }
        }

        return str;
    }
    ///////////////////////////////////// Internal functions /////////////////////////////////////
    protected string MakeBlank(string src, int start, int end)
    {
        if (start == end || src.Trim().Length == 0) return src;
        else
        {
            string temp, tempA;
            tempA = src.Substring(start, end - start + 1);
            if (tempA.IndexOf(comEOL) == -1)
            {
                tempA = "";
                for (int i = 0; i < end - start + 1; i++) tempA += " ";
            }
            else
            {
                int at = 0, begin = 0;
                temp = "";
                while (tempA.IndexOf(comEOL, at) != -1 && at < tempA.Length)
                {
                    at = tempA.IndexOf(comEOL, at);
                    for (int i = begin; i < at; i++) temp += " ";
                    temp += comEOL;
                    at += comEOL.Length;
                    begin = at;
                }
                if (at <= tempA.Length - 1)
                {
                    for (int i = at; i <= tempA.Length - 1; i++) temp += " ";
                }
                tempA = temp;
            }
            return src.Substring(0, start) + tempA + src.Substring(end + 1);
        }
    }
    protected string LineOfIndex(string src, int idx, out int begin)
    {
        int start = 0;
        bool equ = false;
        for (int loc = idx; loc >= 0; loc--)
        {
            if (src[loc] == comEOL[comEOL.Length - 1])
            {
                equ = false;
                if (comEOL.Length > 1)
                {
                    if (loc - 1 >= comEOL.Length - 2)
                    {
                        for (int j = 0; j <= comEOL.Length - 2; j++)
                        {
                            if (src[loc - j - 1] == comEOL[comEOL.Length - j - 2]) equ = true;
                            else equ = false;
                        }
                    }
                    else equ = false;
                }
                else equ = true;
                if (equ)
                {
                    start = loc + 1;
                    break;
                }
            }
        }
        begin = start;
        if (src.IndexOf(comEOL, start) == -1) return src.Substring(start);
        else return src.Substring(start, src.IndexOf(comEOL, start) - start);
    }
    protected bool OnTheContainer(string str, int idx)
    {
        if (without.GetUpperBound(0) != -1 && without.GetUpperBound(1) != -1)
        {
            int cnt = without.GetUpperBound(0) + 1;
            int left = 0, right = 0;
            for (int i = 0; i < cnt; i++)
            {
                right = -1;
                while (str.IndexOf(without[i, 0], right + 1) != -1 && right + 1 <= str.Length)
                {
                    left = str.IndexOf(without[i, 0], right + 1);
                    if (without[i, 1].Length == 0)
                        right = str.IndexOf(without[i, 0], left + without[i, 0].Length);
                    else
                        right = str.IndexOf(without[i, 1], left + without[i, 0].Length);
                    if (right == -1) break;
                    else if (idx > left && idx < right) return true;
                }
            }
            return false;
        }
        else return false;
    }
    protected string CleaningSpilthEOL(string src_ini)
    {
        strA = src_ini;
        if (comCleanSpilthEOL)
        {
            for (int i = 0; i < 3; i++) strA = strA.Replace(comEOL + comEOL, comEOL);
            while (true)
            {
                if (strA.IndexOf(comEOL) == 0) strA = strA.Substring(comEOL.Length);
                else break;
            }
        }
        return strA;
    }
    ///////////////////////////////////// public attrib /////////////////////////////////////
    public string EOL
    {
        get
        {
            return comEOL;
        }
        set
        {
            comEOL = value;
        }
    }
    public bool CleanSpilthEOL
    {
        get
        {
            return comCleanSpilthEOL;
        }
        set
        {
            comCleanSpilthEOL = value;
        }
    }
    public int Count
    {
        get
        {
            if (info.GetUpperBound(0) != -1 && info.GetUpperBound(1) != -1)
            {
                return info.GetUpperBound(0) + 1;
            }
            else return 0;
        }
    }
    public void GetInfo(int index, out int start, out int end, out int type)
    {
        if (index < this.Count)
        {
            start = info[index, 1];
            end = info[index, 2];
            type = info[index, 0];
        }
        else
        {
            start = 0;
            end = 0;
            type = 0;
        }
    }
}