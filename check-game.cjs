const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/dist/index.html','utf8');const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(code);
function load(seed){const elements=new Map();const store=new Map(seed?[['emberkeep-v1',seed]]:[]);const el=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',style:{},dataset:{},classList:{toggle(){}},setAttribute(){},focus(){},matches(){return false},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect(){return {left:0,top:0,width:1000,height:620}}});return elements.get(id);};const paint=new Proxy({createRadialGradient(){return {addColorStop(){}}}},{get:(o,k)=>o[k]||(()=>{})});el('field').getContext=()=>paint;const context=vm.createContext({document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},window:{addEventListener(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},console});vm.runInContext(code,context);return {run:x=>vm.runInContext(x,context),store};}
const game=load();assert.equal(game.run('s.gold'),180);game.run('placeTower(115,235);placeTower(280,240)');assert.equal(game.run('s.towers.length'),2);assert.equal(game.run('s.gold'),60);game.run('draw(.016);startWave();for(let i=0;i<6000&&running;i++)tick(.025,.025)');assert.equal(game.run('running'),false);assert.equal(game.run('s.wave'),2);assert.equal(game.run('s.best'),1);assert.ok(game.run('s.gold>100'));game.run('save()');const restored=load(game.store.get('emberkeep-v1'));assert.equal(restored.run('s.towers.length'),2);assert.equal(restored.run('s.wave'),2);
restored.run('s.gold=1000; $("workshop").onclick({target:{dataset:{up:"income"}}})');assert.equal(restored.run('s.up.income'),1);const before=restored.run('s.gold');restored.run('tick(1,1)');assert.equal(restored.run('s.gold'),before+2);restored.run('paused=true;tick(1,1)');assert.equal(restored.run('s.gold'),before+2);
const fail=load();fail.run('startWave();for(let i=0;i<15000&&running;i++)tick(.025,.025)');assert.equal(fail.run('defeated'),false); // Wave one has eight enemies: losing 56 health is survivable.
fail.run('startWave();for(let i=0;i<15000&&running;i++)tick(.025,.025)');assert.equal(fail.run('defeated'),true);fail.run('startWave()');assert.equal(fail.run('s.hp'),100);assert.equal(fail.run('running'),true);
restored.run('paused=false;s.best=20;$("prestige").onclick();$("confirm").onclick()');assert.equal(restored.run('s.renown'),2);assert.equal(restored.run('s.gold'),180);assert.equal(restored.run('s.towers.length'),0);assert.ok(Math.abs(restored.run('mult()')-1.2)<1e-9);
const saved=JSON.parse(game.store.get('emberkeep-v1'));saved.saved=Date.now()-3600000;saved.up.income=1;const idle=load(JSON.stringify(saved));assert.ok(idle.run('s.gold')>=saved.gold+7199);
console.log('PASS: JS syntax, canvas rendering, tower purchase, wave combat and reward, save/reload, mine upgrades, pause, defeat/rebuild, prestige, offline earnings.');


// Object-fit containment must map taps to game coordinates in either orientation.
for(const [width,height] of [[390,600],[640,220]]){
 const mobile=load();mobile.run(`canvas.getBoundingClientRect=()=>({left:10,top:20,width:${width},height:${height}})`);
 const a=mobile.run('fieldToClient(115,235)'),b=mobile.run('fieldToClient(280,240)');
 mobile.run(`canvas.onclick({clientX:${a.x},clientY:${a.y}})`);
 assert.ok(Math.abs(mobile.run('s.towers[0].x')-115)<1e-6);
 mobile.run(`canvas.onclick({clientX:${b.x},clientY:${b.y}})`);
 assert.ok(Math.abs(mobile.run('s.towers[1].x')-280)<1e-6);
 mobile.run(`canvas.onclick({clientX:${a.x},clientY:${a.y}})`);
 assert.equal(mobile.run('activePanel'),'tower');mobile.run('closePanel()');assert.equal(mobile.run('activePanel'),null);
 mobile.run('canvas.onclick({clientX:10,clientY:20})');assert.equal(mobile.run('selected'),0);
}
console.log('PASS: portrait/landscape letterbox tap mapping, tower panel opening/closing, and ignoring taps outside the battlefield.');

const free=load();free.run('s.gold=5000');assert.equal(free.run('placeTower(90,285)'),true);assert.equal(free.run('s.towers[0].x'),90);assert.equal(free.run('s.towers[0].y'),285);const gold=free.run('s.gold');
for(const [x,y] of [[190,200],[95,290],[940,390],[5,90],[300,20]]){assert.equal(free.run(`placeTower(${x},${y})`),false);assert.equal(free.run('s.gold'),gold);assert.equal(free.run('s.towers.length'),1);}
free.run('save()');const freeReload=load(free.store.get('emberkeep-v1'));assert.equal(freeReload.run('s.towers[0].x'),90);assert.equal(freeReload.run('s.towers[0].y'),285);
const oldSave=JSON.parse(free.store.get('emberkeep-v1'));oldSave.towers=[{pad:0,type:'archer',level:3,cd:0},{pad:7,type:'frost',level:2,cd:0}];const migrated=load(JSON.stringify(oldSave));assert.equal(migrated.run('s.towers[0].x'),115);assert.equal(migrated.run('s.towers[0].y'),235);assert.equal(migrated.run('s.towers[0].level'),3);assert.equal(migrated.run('s.towers[1].x'),855);assert.equal(migrated.run('s.towers[1].level'),2);migrated.run('save()');assert.equal(JSON.parse(migrated.store.get('emberkeep-v1')).towers[0].pad,undefined);
const many=load();many.run('s.gold=10000');for(const [x,y] of [[50,80],[120,80],[270,80],[350,80],[450,80],[530,80],[610,80],[690,80],[770,80],[850,80],[930,80]])assert.equal(many.run(`placeTower(${x},${y})`),true);assert.equal(many.run('s.towers.length'),11);
const poor=load();poor.run('s.gold=0');assert.equal(poor.run('placeTower(90,285)'),false);assert.equal(poor.run('s.towers.length'),0);
console.log('PASS: arbitrary placement, road/keep/edge/overlap rejection without spending gold, coordinate save/reload, legacy save migration, more than eight towers, and insufficient funds.');

const upright=load();upright.run('canvas.getBoundingClientRect=()=>({left:0,top:0,width:390,height:580});draw(.016)');assert.equal(upright.run('canvas.width'),620);assert.equal(upright.run('canvas.height'),1000);for(const [x,y] of [[90,285],[380,250],[800,80]]){const pt=upright.run(`fieldToClient(${x},${y})`);const back=upright.run(`fieldPoint({clientX:${pt.x},clientY:${pt.y}})`);assert.ok(Math.abs(back.x-x)<1e-6&&Math.abs(back.y-y)<1e-6);}upright.run('canvas.onkeydown({key:"ArrowDown",preventDefault(){}})');assert.equal(upright.run('placement.x'),135);assert.equal(upright.run('placement.y'),235);console.log('PASS: tall upright map, reversible portrait tap mapping, and screen-relative keyboard movement.');
