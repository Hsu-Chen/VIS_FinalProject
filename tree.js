function is_through_root(items){
    var TF=[items.length];
    for(var i=0; i<items.length; i++){
        var temp=[items.length];
        for(var j=0; j<items.length; j++){
            if(items[i].id.split(".")[1]!=items[j].id.split(".")[1]){
                temp[j]=true;
            }
            else{
                temp[j]=false;
            }
        }
        TF[i]=temp;
    }
    return TF;
}
function distanceGenerator(items){
    var distance=[];
    for(var i=0;i<items.length;i++){
      distance[i]=[];
      for(var j=0;j<items.length;j++){
        distance[i][j]=computedistance(items[i],items[j]);
      }
    }
    return distance;
}
function computedistance(x,y){
    var X=x.id.split(".");
    var Y=y.id.split(".");
    var max=Math.max(X.length,Y.length);
    var min=Math.min(X.length,Y.length);
    var overlap =0;
    for(var i=0;i<min;i++){
      if(X[i]===Y[i]){
        overlap++;
      }
    }
    return max + min -2*overlap;
}
function getArrRelation(items,item){
    return items.indexOf(items.find(itemfind => itemfind.id == item ));
}
function toPieChart(items,id,TFArr,DisArr){
    var R = 400;
    var nameIndex = getArrRelation(items,id);
    var passRootCount = 0;
    var calcDistCount = 0;
    var itemPassRoot = [];
    var itemCalcDist = [];
    var distsArr = [];
    var svg = d3.select("svg");
    var g = svg.select("g");
    g.attr("opacity",0)
    var h = svg.append("g")
        .attr("class","PC")
        .attr("transform", "translate(" + (width / 2 ) + "," + (height / 2 ) + ")");

    for(var i = 0; i < items.length; i++){
        if(TFArr[nameIndex][i]){
            passRootCount+=1;
            itemPassRoot[itemPassRoot.length] = items[i];
        }
        else{
            calcDistCount+=1;
            itemCalcDist[itemCalcDist.length] = items[i];
            itemCalcDist[itemCalcDist.length-1].dist = DisArr[nameIndex][i];
            if(!distsArr[DisArr[nameIndex][i]])
                distsArr[DisArr[nameIndex][i]] = 1;
            else
                distsArr[DisArr[nameIndex][i]] += 1;
        }

    }

    var arc = (passRootCount == 0) ? Math.PI : 2*Math.PI/passRootCount;
    
    for(var i = 0; i < itemPassRoot.length; i++){
        var gg = h.append("g")
            .attr("class","pieNode")
            .attr("transform", "translate("+(- R*Math.cos(arc*i+Math.PI/2))+","+(- R*Math.sin(arc*i+Math.PI/2))+")")
            gg.append("text")
            .attr("fill", "#D00")
            .attr("dy", "1.5em")
            .text(function() { return itemPassRoot[i].id.substring(itemPassRoot[i].id.lastIndexOf(".") + 1); })
            gg.append("circle")
            .attr("fill", "#D00")
            .attr("r", 3)
            .attr("id",itemPassRoot[i].id)
            .on("click",toNextPie)
            .on("mouseover", handleMouseOverPic)
            .on("mouseout", handleMouseOutPic);
    }
    
    var distsCount = distsArr.length;
    var ringSpace = R/(distsCount+1);
    var layerCount = 0;
    h.append("circle")
        .attr("class","rootSep")
        .attr("r",function(){return ringSpace*distsCount})
        .attr('stroke-width','5')
        .attr('stroke','red')
        .attr('fill','none')
    for(var i = 0; i < distsArr.length; i++){
        if(distsArr[i] == 0)
            continue;
        layerCount = 0;
        arc = 2*Math.PI/distsArr[i];
        h.append("circle")
            .attr("class","distSep")
            .attr("r",function(){return ringSpace*i})
            .attr('stroke-width','1.5')
            .attr('stroke','black')
            .attr('stroke-dasharray','5,10')
            .attr('fill','none')
        for(var j = 0; j < itemCalcDist.length; j++){
            if(itemCalcDist[j].dist == i){
                var gg = h.append("g")
                .attr("class","pieNode")
                .attr("transform", "translate("+(- ringSpace*i*Math.cos(arc*layerCount+Math.PI/2))+","+(- ringSpace*i*Math.sin(arc*layerCount+Math.PI/2))+")")
                gg.append("text")
                .attr("fill", "black")
                .attr("dy", "1.5em")
                .text(function() { return itemCalcDist[j].id.substring(itemCalcDist[j].id.lastIndexOf(".") + 1); })
                gg.append("circle")
                .attr("class","innerNode")
                .attr("fill", "black")
                .attr("r", 3)
                .attr("id",itemCalcDist[j].id)
                .attr("center",i)
                .on("click",toNextPie)
                .on("mouseover", handleMouseOverPic)
                .on("mouseout", handleMouseOutPic)
                layerCount += 1;
            }
        }
    }
    return 0;
}
function toTree(){
    d3.select("svg").select("g")
    .attr("opacity",1)
    d3.select("body").selectAll(".tooltip")
    .style("opacity",0)
    d3.select("svg").selectAll(".PC").remove();
}
function toNextPie(){
    if(d3.select(this).attr('center') == 0){
        toTree();
        return;
    }
    d3.select("svg").selectAll(".PC").remove();
    toPieChart(items,d3.select(this).attr('id'),TFArr,DisArr)
}