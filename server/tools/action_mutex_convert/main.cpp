#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "windows.h"

using namespace std;

void ThrowIf(bool b)
{
	if (b)
		throw b;
}

std::wstring GB2312ToUnicode( const char * str )
{
	int textlen = MultiByteToWideChar( 936, 0, str, -1, NULL, 0 ); 	
	std::wstring buf( textlen, 0 );
	
	MultiByteToWideChar( 936, 0, str, -1, const_cast<LPWSTR>( buf.c_str() ) , buf.size() ); 

	return buf.c_str(); 
}

std::string UnicodeToUTF8( const wchar_t * str )
{
	int textlen = WideCharToMultiByte( CP_UTF8, 0, str, -1, NULL, 0, NULL, NULL );
	std::string buf( textlen, 0 );

	WideCharToMultiByte( CP_UTF8, 0, str, -1, const_cast<LPSTR>( buf.c_str() ), buf.size(), NULL, NULL );

	return buf.c_str();
}

std::string GB2312ToUTF8( const char * str )
{
	return UnicodeToUTF8( GB2312ToUnicode(str).c_str() );
}


string join_string(vector<string> const & arr, char const ch)
{
	char buf[2] = {0};
	buf[0] = ch;

	string s;
	for (unsigned int i = 0; i < arr.size(); ++i)
		s = s + arr[i] + string(buf);
	
	if (s.size() > 0)
		s.resize(s.size() - 1);

	return s;
}

string trim(const string & s)
{
	int startPos = 0;
	int endPos = (int)s.size();
	for (; startPos < (int)s.size(); ++startPos)
	{
		char ch = s[startPos]; 
		if (!(ch == ' ' || ch == '\t' || ch == '\r' || ch == 'n'))
		{
			break;
		}		
	}

	for (; endPos > 0;)
	{
		--endPos;
		char ch = s[endPos]; 
		if (!(ch == ' ' || ch == '\t' || ch == '\r' || ch == 'n'))
		{
			++endPos;
			break;
		}		
	}

	return string(s.c_str() + startPos, endPos - startPos);
}

vector<string> split_string(string const & s, char const ch)
{
	vector<string> arr;
	unsigned int startPos = 0;
	unsigned int endPos = 0;
	for ( ; ; )
	{
		endPos = s.find_first_of(ch, startPos);
		if (endPos < s.size())
		{			
			arr.push_back(trim(string(s.c_str() + startPos, s.c_str() + endPos)));
		}
		else
			break;

		startPos = endPos + 1;
		if (startPos == s.size())
			arr.push_back(string());
	}

	if (startPos < s.size())
		arr.push_back(trim(string(s.c_str() + startPos)));

	return arr;
}

template <typename TStream>
void write_version(TStream & stream)
{
	string s = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
	stream.write(s.c_str(), s.size());
}

template <typename TStream>
void begin_tag(TStream & stream, string const & tag)
{
	string s = "<" + tag + ">";
	stream.write(s.c_str(), s.size());
}

template <typename TStream>
void end_tag(TStream & stream, string const & tag)
{
	string s = "</" + tag + ">";
	stream.write(s.c_str(), s.size());
}

template <typename TStream>
void write_node(TStream & stream, string const & node, string const & val)
{
	begin_tag(stream, node);
	string s = GB2312ToUTF8(val.c_str());
	stream.write(s.c_str(), s.size());
	end_tag(stream, node);
}

template <typename TStream>
void write_new_line(TStream & stream, int nTab)
{
	string s;
	s.resize(nTab + 2, '\t');
	s[0] = '\r';
	s[1] = '\n';
	stream.write(s.c_str(), s.size());
}

vector<string> extract_cols(string const & s)
{
	// 跳过两列
	int const skipCol = 2;	
	vector<string> ret;
	vector<string> arr = split_string(s, ',');
	int iCol = 1;
	for (vector<string>::iterator it = arr.begin();
		it != arr.end();
		++it, ++iCol)
	{
		//if (it->empty())
		//	continue;
		//if (*it == "0")
		//	continue;
		//
		//ret.push_back(*it);
		if (iCol <= skipCol)
		{
			ret.push_back(*it);
			continue;
		}
			 
		if (*it == "C" || *it == "c")
			ret.push_back("1");
		else if (*it == "T" || *it == "t")
			ret.push_back("2");
		else if (*(it->begin()) == 'B' || *(it->begin()) == 'b')
			ret.push_back("3");
		else
			ret.push_back("4");
	}
	// 去掉第二行
	//ret.erase(ret.begin() + 1);
	return ret;
}


vector<string> extract_error_cols(string const & s)
{
	// 跳过两列
	int const skipCol = 2;	
	vector<string> ret;
	vector<string> arr = split_string(s, ',');
	int iCol = 1;
	for (vector<string>::iterator it = arr.begin();
		it != arr.end();
		++it, ++iCol)
	{
		//if (it->empty())
		//	continue;
		//if (*it == "0")
		//	continue;
		//
		//ret.push_back(*it);
		if (iCol <= skipCol)
		{
			ret.push_back(*it);
			continue;
		}
		
		// 取错误类型
		if (it->size() > 0)
		{
			if (*(it->begin()) == 'B' || *(it->begin()) == 'b')
			{
				if (it->size() == 1)
				{
					ret.push_back("2"); // 默认报错类型为2
				}
				else
				{
					string sType = std::string(it->begin() + 1, it->end()); 
					ret.push_back(sType);
				}
			}
			else
			{
				ret.push_back("0");
			}
		}
		else
		{
			ret.push_back("0");
		}
	}
	// 去掉第二行
	//ret.erase(ret.begin() + 1);
	return ret;
}


void csv_to_string_table(string const & filenameCSV, vector<vector<string> > & table)
{
	table.clear();

	ifstream sr;
	sr.open(filenameCSV.c_str(), ios::binary);

	int const bufLen = 1024;
	char buf[bufLen] = {0};

	for (; sr.getline(buf, bufLen); )
	{
		table.push_back(split_string(buf, ','));
	}
}

template <typename TOutStream>
void string_table_to_xml(const string & filename, vector<vector<string> > const & table, TOutStream & sw)
{
	int nTab = 0;
	write_version(sw);

	write_new_line(sw, nTab);
	begin_tag(sw, "root");
	++nTab;

	vector<string> fields = table[0];
	// 跳过行
	for (int row = 1; row < (int)table.size(); ++row)
	{
		write_new_line(sw, nTab);
		begin_tag(sw, filename);
		++nTab;		
		

		vector<string> cols = table[row];
		write_new_line(sw, nTab);
		write_node(sw, "level", cols[0]);
		string sItems;
		sItems.push_back('[');
		for (int i = 1; i < (int)fields.size(); ++i)
		{
			if (cols[i] == "0")
				continue;
			if (i != 1)
				sItems.push_back(',');
			sItems.push_back('{');

			sItems = sItems + fields[i];
			sItems.push_back(',');
			sItems = sItems + cols[i];

			sItems.push_back('}');
		}
		sItems.push_back(']');

		write_new_line(sw, nTab);
		write_node(sw, "items", sItems);
		

		--nTab;
		write_new_line(sw, nTab);
		end_tag(sw, filename);
	}

	--nTab;
	write_new_line(sw, nTab);
	end_tag(sw, "root");
}

void test()
{
	string s;
	s = " abc ";
	ThrowIf(trim(s) != string("abc"));
	s = "abc ";
	ThrowIf(trim(s) != string("abc"));
	s = "abc";
	ThrowIf(trim(s) != string("abc"));
}

int main(int argc, char * argv[])
{
	test();
	string sDir = argv[0];
	size_t dirPos = sDir.find_last_of(":/\\");
	sDir.erase(dirPos, sDir.size() - dirPos);
	//cout << sDir << endl;
	
	SetCurrentDirectoryA(sDir.c_str());
	std::locale loc1 = std::locale::global(std::locale(".936"));

	if (argc < 2)
	{
		cout << "请拖入.csv文件!" << endl;
		cin.get();
		return 0;
	}

	const string csvFile = argv[1];

	string sTail = csvFile;
	sTail.erase(0, csvFile.size() - 4);
	if (sTail != string(".csv"))
	{
		cout << "文件不是csv格式，请先转成.csv文件，再执行!" << endl;
		cin.get();
		return 0;
	}
	
	string xmlName = "make_up_tplt";
	string xmlFile = xmlName + ".xml";

	typedef vector<vector<string> > StringTable;
	StringTable table;
	//cin.get();
	csv_to_string_table(csvFile, table);

	{
		ofstream fout;
		fout.open(xmlFile.c_str(), ios::binary);
		
		string_table_to_xml(xmlName, table, fout);
	}

    std::locale::global(std::locale(loc1));
	cout << endl << "操作成功. 已保存到文件:" << xmlFile << endl;
	cin.get();
	return 0;
}