const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/dist/index.html','utf8');const code=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(code);
function load(seed){const elements=new Map();const store=new Map(seed?[['emberkeep-v1',seed]]:[]);const el=id=>{if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',style:{},dataset:{},classList:{toggle(){}},setAttribute(){},focus(){},matches(){return false},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect(){return {left:0,top:0,width:1000,height:620}}});return elements.get(id);};const paint=new Proxy({createRadialGradient(){return {addColorStop(){}}}},{get:(o,k)=>o[k]||(()=>{})});el('field').getContext=()=>paint;const context=vm.createContext({document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},window:{addEventListener(){}},requestAnimationFrame(){},setTimeout(){},clearTimeout(){},console});vm.runInContext(code,context);return {run:x=>vm.runInContext(x,context),store};}
const game=load();assert.equal(game.run('s.gold'),180);game.run('choosePad(0);choosePad(1)');assert.equal(game.run('s.towers.length'),2);assert.equal(game.run('s.gold'),60);game.run('draw(.016);startWave();for(let i=0;i<6000&&running;i++)tick(.025,.025)');assert.equal(game.run('running'),false);assert.equal(game.run('s.wave'),2);assert.equal(game.run('s.best'),1);assert.ok(game.run('s.gold>100'));game.run('save()');const restored=load(game.store.get('emberkeep-v1'));assert.equal(restored.run('s.towers.length'),2);assert.equal(restored.run('s.wave'),2);
restored.run('s.gold=1000; $("workshop").onclick({target:{dataset:{up:"income"}}})');assert.equal(restored.run('s.up.income'),1);const before=restored.run('s.gold');restored.run('tick(1,1)');assert.equal(restored.run('s.gold'),before+2);restored.run('paused=true;tick(1,1)');assert.equal(restored.run('s.gold'),before+2);
const fail=load();fail.run('startWave();for(let i=0;i<15000&&running;i++)tick(.025,.025)');assert.equal(fail.run('defeated'),false); // Wave one has eight enemies: losing 56 health is survivable.
fail.run('startWave();for(let i=0;i<15000&&running;i++)tick(.025,.025)');assert.equal(fail.run('defeated'),true);fail.run('startWave()');assert.equal(fail.run('s.hp'),100);assert.equal(fail.run('running'),true);
restored.run('paused=false;s.best=20;$("prestige").onclick();$("confirm").onclick()');assert.equal(restored.run('s.renown'),2);assert.equal(restored.run('s.gold'),180);assert.equal(restored.run('s.towers.length'),0);assert.ok(Math.abs(restored.run('mult()')-1.2)<1e-9);
const saved=JSON.parse(game.store.get('emberkeep-v1'));saved.saved=Date.now()-3600000;saved.up.income=1;const idle=load(JSON.stringify(saved));assert.ok(idle.run('s.gold')>=saved.gold+7199);
console.log('PASS: JS syntax, canvas rendering, tower purchase, wave combat and reward, save/reload, mine upgrades, pause, defeat/rebuild, prestige, offline earnings.');


// Object-fit containment must map taps to game coordinates in either orientation.
for(const [width,height] of [[390,600],[640,220]]){
 const mobile=load();mobile.run(`canvas.getBoundingClientRect=()=>({left:10,top:20,width:${width},height:${height}})`);
 const scale=Math.min(width/1000,height/620),left=10+(width-1000*scale)/2,top=20+(height-620*scale)/2;
 mobile.run(`canvas.onclick({clientX:${left+115*scale},clientY:${top+235*scale}})`);
 assert.equal(mobile.run('s.towers[0].pad'),0);
 mobile.run(`canvas.onclick({clientX:${left+280*scale},clientY:${top+240*scale}})`);
 assert.equal(mobile.run('s.towers[1].pad'),1);
 mobile.run(`canvas.onclick({clientX:${left+115*scale},clientY:${top+235*scale}})`);
 assert.equal(mobile.run('activePanel'),'tower');mobile.run('closePanel()');assert.equal(mobile.run('activePanel'),null);
 mobile.run('canvas.onclick({clientX:10,clientY:20})');assert.equal(mobile.run('selected'),0);
}
console.log('PASS: portrait/landscape letterbox tap mapping, tower panel opening/closing, and ignoring taps outside the battlefield.');
