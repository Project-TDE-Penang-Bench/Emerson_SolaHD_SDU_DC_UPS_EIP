<?xml version='1.0' encoding='UTF-8'?>
<Project Type="Project" LVVersion="25008000">
	<Property Name="NI.LV.All.SaveVersion" Type="Str">25.0</Property>
	<Property Name="NI.LV.All.SourceOnly" Type="Bool">true</Property>
	<Item Name="My Computer" Type="My Computer">
		<Property Name="server.app.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="server.control.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="server.tcp.enabled" Type="Bool">false</Property>
		<Property Name="server.tcp.port" Type="Int">0</Property>
		<Property Name="server.tcp.serviceName" Type="Str">My Computer/VI Server</Property>
		<Property Name="server.tcp.serviceName.default" Type="Str">My Computer/VI Server</Property>
		<Property Name="server.vi.callsEnabled" Type="Bool">true</Property>
		<Property Name="server.vi.propertiesEnabled" Type="Bool">true</Property>
		<Property Name="specify.custom.address" Type="Bool">false</Property>
		<Item Name="Column Type.ctl" Type="VI" URL="../Control/Column Type.ctl"/>
		<Item Name="Compare_pyWebscraper_Data.vi" Type="VI" URL="../Compare_pyWebscraper_Data.vi"/>
		<Item Name="Parse_pyWebscraper_Data.vi" Type="VI" URL="../Parse_pyWebscraper_Data.vi"/>
		<Item Name="Python Function.ctl" Type="VI" URL="../../Run_Python_Script/Control/Python Function.ctl"/>
		<Item Name="pyWebscraper.vi" Type="VI" URL="../pyWebscraper.vi"/>
		<Item Name="Row Type.ctl" Type="VI" URL="../Control/Row Type.ctl"/>
		<Item Name="Run_Python_Command.vi" Type="VI" URL="../../Run_Python_Script/Run_Python_Command.vi"/>
		<Item Name="String to 2D Array.vi" Type="VI" URL="../SubVI/String to 2D Array.vi"/>
		<Item Name="Dependencies" Type="Dependencies"/>
		<Item Name="Build Specifications" Type="Build"/>
	</Item>
</Project>
