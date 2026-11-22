const map = document.querySelector('.ai-map');
const svg = map.querySelector('svg');
function drawMap() {
  const frame = map.getBoundingClientRect();
  if (!frame.width) return;
  const boxes = {};
  map.querySelectorAll('[data-node]').forEach(el => {
    const b = el.getBoundingClientRect(), x=b.left-frame.left, y=b.top-frame.top;
    boxes[el.dataset.node]={x,y,w:b.width,h:b.height,c:x+b.width/2,v:y+b.height/2};
  });
  const paths=[];
  function path(d){paths.push('<path d="'+d+'" fill="none" stroke="#698173" stroke-width="1.4" marker-end="url(#tip)"/>');}
  function down(from,to,endOffset=0){
    const a=boxes[from],b=boxes[to],y=a.y+a.h, mid=(y+b.y)/2;
    path('M '+a.c+' '+y+' V '+mid+' H '+(b.c+endOffset)+' V '+(b.y-3));
  }
  down('player','context',-15); down('action','context'); down('director','context',15);
  down('context','llm',-13);down('memory','llm',13);down('llm','rules');
  down('rules','world');down('world','record');
  const z=boxes.record, a=boxes.action, m=boxes.memory;
  const lane=frame.width-5;
  path('M '+(z.x+z.w)+' '+z.v+' H '+lane+' V '+m.v+' H '+(m.x+m.w+3));
  path('M '+z.x+' '+z.v+' H 5 V '+(a.y-13)+' H '+a.c+' V '+(a.y-3));
  svg.querySelector('g').innerHTML=paths.join('');
}
new ResizeObserver(drawMap).observe(map);document.fonts.ready.then(drawMap);drawMap();
