import{a$ as s,b0 as n,b2 as m,b1 as w}from"./Tile.js";let e=0;for(e=0;e<29;e++){console.log(e);const o=new s({source:new n});let a=17,r=-165e3+e*140,t=7053e3,l=new m({center:[r,t],zoom:a,maxZoom:20});new w({controls:[],target:"map"+e,layers:[o],view:l})}