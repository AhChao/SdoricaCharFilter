var characterType ={
	"金位":["碎牙","迪蘭","實驗體","古魯瓦德","賈漢","卡努拉","納杰爾","龐","羅傑","希歐","雪莉"],
	"黑位":["安潔莉亞SP","夏爾","刃","法蒂瑪","貓眼","璃","娜雅","尼德","諾瓦","雪爾森","黯月","揚波","迪蘭SP"],
	"白位":["安潔莉亞","奧斯塔","芙蕾莉卡","荷絲緹雅","庫爾","琉","麗莎","普吉","夏洛克","希歐SP","西奧多","蒂卡"],
}
var content;
var fontColor=["#000000","#003C9D","#7A0099","#EEEE00"];
var fontSize = 16;
function getResult()
{
	//找那些打勾的放到一個陣列
	//用陣列去找讀檔讀到的資料
	//列出符合條件的
	//空陣列就全列出

	//資料準備:角色資料
	var myIFrame = document.getElementById("textData");
	content = myIFrame.contentWindow.document.body.childNodes[0].innerHTML;
	content = JSON.parse(content);
	//console.log(content);
	var rightCharacter=[];

	//資料準備：篩選選項
	var ruleForFilter=[];
	var ruleArray = ["characterType","actionType","targetCharacter","buffAndDebuff"];
	for(var i in ruleArray)
	{
		for(var j in d3.select("#"+ruleArray[i]).node().childNodes)//走訪SVG內所有圖形做相交比較
		{
			var node = d3.select("#"+ruleArray[i]).node().childNodes[j]
			var tagName = node.tagName;
			if(tagName=="INPUT")
			{
				if(node.checked)
				{
					ruleForFilter.push(node.value);
				}
			}
		}
	}
	console.log(ruleForFilter);

	//走全部的角色資料，確認是否符合全部的勾選項
	for(var name in content)
	{
		var allCorrespond = false;
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
		if(allCorrespond)
		{
			rightCharacter.push(name);
		}
		allCorrespond = false;
	}

	//console.log(ruleForFilter,rightCharacter,typeof rightCharacter[0]);
	if (typeof rightCharacter[0] == "undefined")
	{
		d3.select("#resultGroup").append("text").text("無符合條件的目標").attr("y","150");
	}	
	else
	{
		if(typeof ruleForFilter[0] != "undefined" && typeof rightCharacter[0] != "undefined")
		{
			for(var i in rightCharacter)
			{
				var drawline = true;
				showCharacter(rightCharacter[i],i);
				console.log("畫:",rightCharacter[i],i);
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
		else if(typeof ruleForFilter[0] == "undefined")
		{
			for(var i in content );//全部顯示 無條件
		}
	}
}

function showCharacter(charName,order)
{
	var x = 0;
	var y = 100 + 150*order;
	console.log(charName,charName.split("Skin"));
	if(typeof charName.split("Skin")[1] =="undefined")//skin跟原版連著放，skin不給頭圖
	{
		d3.select("#resultGroup").append("svg:image").attr({
		"x":x,
		"y":y,
		"width":70,
		"height":70,
		"xlink:href":"./Img/"+ charName +".png",
		});
	}	
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
			//console.log(xSpaceLength,x + (i*1+1)*200 + xSpaceLength*fontSize,x,(i*1+1)*250,xSpaceLength*fontSize);
			if(j>=3)
				insideY = insideY+20;
			if(content[charName][i][j][0].length>1)
			{
				printText("resultGroup", content[charName][i][j][0] , x + (i*1+1)*250 + xSpaceLength*fontSize , insideY, fontColor[content[charName][i][j][1]]);
			}
			else
			{
				printText("resultGroup", content[charName][i][j] , x + (i*1+1)*250 + xSpaceLength*fontSize , insideY, fontColor[0]);
			}
			if(j != content[charName][i].length-1) printText("resultGroup", "，" , x + (i*1+1)*250 + (countLength(content[charName][i],j+1)-1)*fontSize , insideY, fontColor[0]);
		}		
	}
	//console.log(content[charName]);
}

function countLength(anArray,index)
{
	var length = 0;
	for(var i in anArray)
	{
		if(i<index)
		{
			if(anArray[i][0].length>1)
			{
				//console.log("朝");
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
	d3.select("#resultGroup").append("svg:text").text(text).attr({
		"x": x,
		"y": y,
		"fill":color,
		"font-size":fontSize,
	});
}