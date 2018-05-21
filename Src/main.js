var characterType ={
	"金位":["碎牙","迪蘭","實驗體","古魯瓦德","賈漢","卡努拉","納杰爾","龐","羅傑","希歐","雪莉"],
	"黑位":["安潔莉亞SP","夏爾","刃","法蒂瑪","貓眼","璃","娜雅","尼德","諾瓦","雪爾森","黯月","揚波","迪蘭SP"],
	"白位":["安潔莉亞","奧斯塔","芙蕾莉卡","荷絲緹雅","庫爾","琉","麗莎","普吉","夏洛克","希歐SP","西奧多","蒂卡"],
}
var content;
var fontColor=["#000000","#003C9D","#7A0099","#DAA520"];
var rectColor=["#DAA520","#888888","#FFFFFF"];
var fontSize = 16;
var rightCharacter=[];
var ruleForFilter=[];
var oneSkillFliter = false;
var noHighLightStroke = false;
function getResult()
{
	//重置版面
	d3.select("#basicSVG").attr("width",1800).attr("height",500);
	d3.select("#resultGroup").remove();
	d3.select("#basicSVG").append("g").attr("id","resultGroup");

	//資料準備:角色資料
	var myIFrame = document.getElementById("textData");
	content = myIFrame.contentWindow.document.body.childNodes[0].innerHTML;
	content = JSON.parse(content);
	rightCharacter=[];

	//資料準備：篩選選項
	ruleForFilter=[];
	var ruleArray = ["actionType","targetCharacter","buffAndDebuff","passiveRule"];//角色type另外驗證
	for(var i in ruleArray)
	{
		for(var j in d3.select("#"+ruleArray[i]).node().childNodes)//走訪SVG內所有圖形做相交比較
		{
			var node = d3.select("#"+ruleArray[i]).node().childNodes[j]
			var tagName = node.tagName;
			if(tagName=="LABEL")
			{
				for(var k in node.childNodes)
				{
					var cnode = node.childNodes[k];
					var ctagName = cnode.tagName;
					if(ctagName=="INPUT"&&cnode.checked)
					{
						ruleForFilter.push(cnode.value);
					}
				}
			}
		}
	}
	console.log("篩選規則:",ruleForFilter);

	var typeVertify = [];
	for(var i in d3.select("#characterType").node().childNodes)
	{
		var node = d3.select("#characterType").node().childNodes[i];
		var tagName = node.tagName;
		if(tagName=="LABEL")
		{
			for(var k in node.childNodes)
			{
				var cnode = node.childNodes[k];
				var ctagName = cnode.tagName;
				if(ctagName=="INPUT"&&cnode.checked)
				{
					typeVertify.push(cnode.value);
				}
			}
		}
	}
	console.log("角色類型:",typeVertify);

	//走全部的角色資料，確認是否符合全部的勾選項
	for(var name in content)
	{
		var allCorrespond = false;

		if(!oneSkillFliter)
		{
			for(var ruleNo in ruleForFilter)
			{
				var singleCorrespond = false;
				for(var i in content[name])//一魂到參謀
				{
					for(var j in content[name][i])//各技能的細項
					{
						if(content[name][i][j][0].length>1)
						{
							if(ruleForFilter[ruleNo]==content[name][i][j][0])
							{
								singleCorrespond=true;
								break;
							}
						}
						else
						{
							if(ruleForFilter[ruleNo]==content[name][i][j])
							{
								singleCorrespond=true;
								break;
							}
						}
					}
					if(singleCorrespond) break; 
				}
				if(singleCorrespond==false)
				{
					break;
				}
				singleCorrespond = false;
				if(ruleNo==ruleForFilter.length-1)
				{
					allCorrespond = true;
				}
			}
		}
		else//單技能過濾
		{
			for(var i in content[name])//一魂到參謀
			{
				//console.log(name,ruleForFilter,content[name][i]);
				for(var ruleNo in ruleForFilter)//驗證單一技能是否有所有rule
				{
					//console.log(content[name][i],ruleForFilter[ruleNo],content[name][i].indexOf(ruleForFilter[ruleNo]));
					//if(content[name][i].indexOf(ruleForFilter[ruleNo])==-1) break; 不能這樣找 因為有兩層的技能
					var ruleFound = false;
					for(var j in content[name][i])//遍歷單一技能所有細項
					{
						if(content[name][i][j][0].length>1)
						{
							if(content[name][i][j][0]==ruleForFilter[ruleNo])
							{
								ruleFound=true;
								break;
							}
						}
						else
						{
							if(content[name][i][j]==ruleForFilter[ruleNo])
							{
								ruleFound=true;
								break;
							}
						}
						if(j == content[name][i].length-1&&!ruleFound)
							break;
					}			
					if(!ruleFound) break
					if(ruleNo==ruleForFilter.length-1)//到最後一個rule為止都有成功找到搜索條件
					{
						allCorrespond = true;
					}
				}			
			}
		}

		if(allCorrespond)
		{
			if(typeof typeVertify[0] !="undefined")
			{
				for(var typeIndex in typeVertify)
				{
					for(var i in characterType[typeVertify[typeIndex]])
					{
						var comparedName = name;
						if(typeof comparedName.split("Skin")[1] !="undefined")
							comparedName = comparedName.split("Skin")[0];
						if(comparedName == characterType[typeVertify[typeIndex]][i])
							rightCharacter.push(name);
					}
				}
			}
			else{
				rightCharacter.push(name);
			}			
		}
		allCorrespond = false;
	}
	if(typeof typeVertify[0] != "undefined" && typeof ruleForFilter[0] == "undefined")
	{
		for(var name in content)
		{
			for(var typeIndex in typeVertify)
			{
				for(var i in characterType[typeVertify[typeIndex]])
				{
					var comparedName = name;
					if(typeof comparedName.split("Skin")[1] !="undefined")
						comparedName = comparedName.split("Skin")[0];
					if(comparedName == characterType[typeVertify[typeIndex]][i])
						rightCharacter.push(name);
				}
			}
		}		
	}

	if (typeof rightCharacter[0] == "undefined"&& typeof ruleForFilter[0] != "undefined")
	{
		d3.select("#resultGroup").append("text").text("無符合條件的目標").attr("y","150");
	}	
	else
	{
		if((typeof ruleForFilter[0] != "undefined" || typeof typeVertify[0] != "undefined") && typeof rightCharacter[0] != "undefined")
		{
			for(var i in rightCharacter)
			{
				var drawline = true;
				showCharacter(rightCharacter[i],i);
				if(typeof rightCharacter[i].split("Skin")[1] =="undefined")//表原版
				{
					
					for(var j in rightCharacter)
					{
						if(rightCharacter[j]==rightCharacter[i]+"Skin")//表示有skin，就不畫給Skin畫
						{
							drawline = false;
						}
					}										
				}
				if(drawline)
				{
					d3.select("#resultGroup").append("path").attr(
					{
						"d":"M 0,"+(150*i+200*1)+" l 1500,0",
						"stroke":"#886600",
						"stroke-width":"5",
					});
				}		
			}
		}
		else if(typeof ruleForFilter[0] == "undefined"&& typeof typeVertify[0] == "undefined")
		{
			var times=0;
			for(var i in content )
			{
				rightCharacter.push(i);
			}
			for(var i in content )//全部顯示 無條件
			{
				var drawline = true;
				showCharacter(i,times);
				
				if(typeof i.split("Skin")[1] =="undefined")//表原版
				{
					
					for(var j in content)
					{
						if(j==i+"Skin")//表示有skin，就不畫給Skin畫
						{
							drawline = false;
						}
					}										
				}
				if(drawline)
				{
					d3.select("#resultGroup").append("path").attr(
					{
						"d":"M 0,"+(150*times+200*1)+" l 1500,0",
						"stroke":"#886600",
						"stroke-width":"5",
					});
				}
				times++;
			}
		}
	}
}

function showCharacter(charName,order)
{
	var x = 0;
	var y = 100 + 150*order;

	var rectColorIndex;
	for(var i in characterType)
	{
		for(var j in characterType[i])
		{			
			var comparedName = charName;
			if(typeof comparedName.split("Skin")[1] !="undefined")
				comparedName = comparedName.split("Skin")[0];
			//console.log(characterType[i][j],comparedName);
			if(comparedName == characterType[i][j])
			{
				rectColorIndex = i;
				break;
			}
		}
	}
	if(rectColorIndex=="金位") rectColorIndex=0;
	else if(rectColorIndex=="黑位") rectColorIndex=1;
	else if(rectColorIndex=="白位") rectColorIndex=2;	
	d3.select("#resultGroup").append("svg:rect").attr({
		"x":x,
		"y":y-40,
		"width":190,
		"height":150,
		"fill":rectColor[rectColorIndex],
		});		
															
	if(typeof charName.split("Skin")[1] =="undefined")//表非Skin，skin跟原版連著放，skin不給頭圖
	{
		d3.select("#resultGroup").append("svg:image").attr({
		"x":x,
		"y":y,
		"width":70,
		"height":70,
		"xlink:href":"./Img/"+ charName +".png",
		});
	}
	else//只有skin還是要顯示
	{
		var drawPic = true;
		for(var i in rightCharacter)
		{
			if(rightCharacter[i]+"Skin"==charName)//表示有skin，就不畫給Skin畫
			{
				drawPic = false;
			}			
		}
		if(drawPic)
		{
			d3.select("#resultGroup").append("svg:image").attr({
			"x":x,
			"y":y,
			"width":70,
			"height":70,
			"xlink:href":"./Img/"+ charName.split("Skin")[0] +".png",
			});
		}
	}	

	if(y+70>d3.select("#basicSVG").attr("height"))//自動延長y
		d3.select("#basicSVG").attr("height",y+100);
	printText("resultGroup", charName, x + 80, y + 35, fontColor[0]);
	for(var i in content[charName])//一魂到參謀
	{
		var insideY;
		x=-50;
		if(content[charName][i].length<=3) insideY = y + 35;
		else insideY = y + 20; 
		for(var j in content[charName][i])//各細項
		{
			var xSpaceLength = countLength(content[charName][i],j%3);
			if(j==3) insideY = insideY+20;
			if(j==6) insideY = insideY+20;
			if(content[charName][i][j][0].length>1)
			{
				printText("resultGroup", content[charName][i][j][0] , x + (i*1+1)*250 + xSpaceLength*fontSize , insideY, fontColor[content[charName][i][j][1]]);
			}
			else
			{
				printText("resultGroup", content[charName][i][j] , x + (i*1+1)*250 + xSpaceLength*fontSize , insideY, fontColor[0]);
			}
			if(j != content[charName][i].length-1) printText("resultGroup", "，" , x + (i*1+1)*250 + (countLength(content[charName][i],j%3+1)-1)*fontSize , insideY, fontColor[0]);
		}		
	}
}

function countLength(anArray,index)
{
	var length = 0; 
	var startIndex = Math.floor(index/3);
	var endIndex = Math.floor(index/3) + index%3;
	for(var i in anArray)
	{
		if(i<index)
		{
			if(anArray[i][0].length>1)
			{
				length = length*1 + anArray[i][0].length*1 + 1;
			}
			else
				length = length*1 + anArray[i].length*1 + 1;
		}
	}
	return length;
}

function printText(targetSVG,text,x,y,color)
{
	var highLightStroke = false;
	for (var i in ruleForFilter) 
	{
		if(text==ruleForFilter[i])
			highLightStroke = true;
	}
	d3.select("#resultGroup").append("svg:text").text(text).attr({
	"x": x,
	"y": y,
	"fill":color,
	"font-size":fontSize,
	});
	if(noHighLightStroke) highLightStroke =false;
	if(highLightStroke)
	{
		d3.select("#resultGroup").append("svg:rect").attr({
		"x": x-2,
		"y": y-fontSize-1,
		"width":text.length*fontSize+3,
		"height":fontSize*1+5,
		"fill": "None",
		"stroke": "#B22222",
		"stroke-width": 3,
		"stroke-alignment":"outside",
		});
	}
}

function clearRule()
{
	var ruleArray = ["characterType","actionType","targetCharacter","buffAndDebuff","passiveRule"];//角色type另外驗證
	for(var i in ruleArray)
	{		
		for(var j in d3.select("#"+ruleArray[i]).node().childNodes)//走訪SVG內所有圖形做相交比較
		{
			var node = d3.select("#"+ruleArray[i]).node().childNodes[j];
			var tagName = node.tagName;
			if(tagName=="LABEL")
			{
				for(var k in node.childNodes)
				{
					var cnode = node.childNodes[k];
					var ctagName = cnode.tagName;

					if(ctagName=="INPUT")
					{
						cnode.checked = false;
					}
				}				
			}						
		}
	}
}

function changeFliterWay()
{
	oneSkillFliter = !oneSkillFliter;
}

function changeHighLightStroke()
{
	noHighLightStroke = !noHighLightStroke;
}