/* Exact integer-money min-cost maximum flow. No ML model or fuzzy identity inference.
   A certificate proves optimality only inside the explicit candidate-edge model. */
export const scales = {HKD:2,USD:2,EUR:2,GBP:2,SGD:2,AUD:2,CAD:2,CHF:2,CNY:2,JPY:0};
const fail = message => { throw new Error(message); };
const integer = (n,label) => Number.isSafeInteger(n) || fail(`${label} must be a safe integer`);
export function money(s,currency) {
  if(typeof s !== 'string' || !/^\d{1,7}(\.\d{1,2})?$/.test(s)) fail('Amounts must be positive decimal strings, at most 7 integer digits');
  if(typeof currency!=='string'||!Object.hasOwn(scales,currency))fail('Unsupported currency');const scale=scales[currency];
  const [a,b='']=s.split('.'); if(b.length>scale) fail(`Too many decimal places for ${currency}`);
  const n=Number(a)*10**scale+Number(b.padEnd(scale,'0')); if(n<=0 || n>100000000) fail('Amount outside supported range'); return n;
}
export function display(n,currency) { integer(n,'Money'); return (n/10**scales[currency]).toFixed(scales[currency]); }
function date(s){if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))fail('Dates must use YYYY-MM-DD');const d=new Date(`${s}T00:00:00Z`);if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)fail('Invalid calendar date');return +d/86400000;}
function party(s){return s.trim().toLowerCase().replace(/\s+/g,' ');}
export function validate(input){
  if(!input||!Array.isArray(input.payments)||!Array.isArray(input.invoices))fail('Provide payments and invoices arrays');
  const days=input.maxDays??30; if(!Number.isInteger(days)||days<0||days>120)fail('maxDays must be an integer from 0 to 120');
  const result={maxDays:days};
  for(const kind of ['payments','invoices']){
    if(input[kind].length>30)fail('Prototype limit: 30 payments and 30 invoices');
    const ids=new Set(); result[kind]=input[kind].map(row=>{
      if(!row||typeof row.id!=='string'||!row.id.trim()||row.id.length>80||ids.has(row.id))fail(`Missing, duplicate or too-long ${kind} ID`);ids.add(row.id);
      if(typeof row.counterparty!=='string'||!row.counterparty.trim()||row.counterparty.length>160)fail('Each row needs a counterparty, at most 160 characters');
      const value=money(row.amount,row.currency); const day=date(row.date);
      return {id:row.id,counterparty:row.counterparty,currency:row.currency,amount:row.amount,date:row.date,value,day,party:party(row.counterparty)};
    });
  } return result;
}
function graph(input,currency){
  const payments=input.payments.filter(x=>x.currency===currency), invoices=input.invoices.filter(x=>x.currency===currency);
  const N=2+payments.length+invoices.length, S=N-2,T=N-1, adj=Array.from({length:N},()=>[]), original=[], candidates=[];
  const labels=[...payments.map(x=>'payment:'+x.id),...invoices.map(x=>'invoice:'+x.id),'SOURCE','SINK'];
  function add(u,v,cap,cost,meta){const a={u,v,cap,initial:cap,cost,meta,rev:null},b={u:v,v:u,cap:0,initial:0,cost:-cost,meta:null,rev:a};a.rev=b;adj[u].push(a);adj[v].push(b);original.push(a);return a;}
  payments.forEach((x,p)=>add(S,p,x.value,0)); invoices.forEach((x,i)=>add(payments.length+i,T,x.value,0));
  payments.forEach((p,pi)=>invoices.forEach((i,ii)=>{const gap=Math.abs(p.day-i.day);if(p.party===i.party&&gap<=input.maxDays)candidates.push(add(pi,payments.length+ii,Math.min(p.value,i.value),gap,{payment:p.id,invoice:i.id}));}));
  return {N,S,T,adj,original,candidates,payments,invoices,labels};
}
// Bellman-Ford is small and explicit here. At most 62 vertices / 900 candidate edges.
function shortest(g,start,all=false){
  const d=Array(g.N).fill(all?0:Infinity),prev=Array(g.N).fill(null);d[start]=0;
  for(let k=0;k<g.N;k++){let changed=false;for(let u=0;u<g.N;u++)if(Number.isFinite(d[u]))for(const e of g.adj[u])if(e.cap>0&&d[e.v]>d[u]+e.cost){d[e.v]=d[u]+e.cost;prev[e.v]=e;changed=true;if(k===g.N-1)fail('Negative residual cycle detected');}if(!changed)break;}
  return {d,prev};
}
function reachable(g){const seen=new Set([g.S]),q=[g.S];for(const u of q)for(const e of g.adj[u])if(e.cap>0&&!seen.has(e.v)){seen.add(e.v);q.push(e.v);}return seen;}
function allocations(g){return g.candidates.filter(e=>e.initial-e.cap>0).map(e=>({...e.meta,minor:e.initial-e.cap,amount:display(e.initial-e.cap,g.currency),dayGap:e.cost}));}
function ambiguity(g,potentials){
  // Find a simple zero-reduced-cost residual cycle containing a candidate edge.
  // Exclude its exact reverse: a two-arc backtrack changes no assignment.
  const zero=e=>e.cap>0&&e.cost+potentials[e.u]-potentials[e.v]===0;
  for(const f of g.candidates.flatMap(e=>[e,e.rev]))if(zero(f)){
    const previous=Array(g.N).fill(null),seen=new Set([f.v]),q=[f.v];
    for(const u of q){for(const e of g.adj[u])if(e!==f.rev&&zero(e)&&!seen.has(e.v)){seen.add(e.v);previous[e.v]=e;q.push(e.v);}if(seen.has(f.u))break;}
    if(!seen.has(f.u))continue;
    const cycle=[f];let v=f.u;while(v!==f.v){const e=previous[v];cycle.push(e);v=e.u;}
    const delta=Math.min(...cycle.map(e=>e.cap));for(const e of cycle){e.cap-=delta;e.rev.cap+=delta;}
    const alternative=allocations(g);for(const e of cycle){e.cap+=delta;e.rev.cap-=delta;}
    return {ambiguous:true,shiftMinor:delta,cycle:cycle.map(e=>({from:g.labels[e.u],to:g.labels[e.v],cost:e.cost})),alternative};
  }return {ambiguous:false,alternative:null};
}
export function solve(raw){
  const input=validate(raw),currencies=[...new Set([...input.payments,...input.invoices].map(x=>x.currency))].sort(),reports=[];
  for(const currency of currencies){
    const g=graph(input,currency);g.currency=currency;let matched=0,cost=0,iterations=0;
    while(true){const {d,prev}=shortest(g,g.S);if(!Number.isFinite(d[g.T]))break;if(++iterations>2000)fail('Computation limit reached; reduce batch size');let delta=Infinity;for(let v=g.T;v!==g.S;v=prev[v].u)delta=Math.min(delta,prev[v].cap);for(let v=g.T;v!==g.S;v=prev[v].u){const e=prev[v];e.cap-=delta;e.rev.cap+=delta;}matched+=delta;cost+=delta*d[g.T];integer(cost,'Cost');}
    const cut=reachable(g),potentials=shortest(g,0,true).d, matches=allocations(g);
    const remaining=(rows,field)=>rows.map(r=>({id:r.id,minor:r.value-matches.filter(m=>m[field]===r.id).reduce((a,m)=>a+m.minor,0)})).filter(r=>r.minor>0).map(r=>({...r,amount:display(r.minor,currency)}));
    reports.push({currency,matchedMinor:matched,matchedAmount:display(matched,currency),costMinorDays:cost,matches,unallocatedPayments:remaining(g.payments,'payment'),unpaidInvoices:remaining(g.invoices,'invoice'),ambiguity:ambiguity(g,potentials),certificate:{reachable:[...cut].map(v=>g.labels[v]),potentials:Object.fromEntries(g.labels.map((label,v)=>[label,potentials[v]]))}});
  }
  const result={version:'reconproof-1',objective:'maximum allocated minor units, then minimum absolute-date-gap cost, separately by currency',input:raw,reports};
  const check=verify(result);if(!check.valid)fail('Internal certificate verification failed: '+check.error);return result;
}
export function verify(bundle){
 try{
  if(bundle?.version!=='reconproof-1'||!Array.isArray(bundle.reports))fail('Unknown audit format');
  const input=validate(bundle.input),currencies=[...new Set([...input.payments,...input.invoices].map(x=>x.currency))].sort();
  if(bundle.reports.length!==currencies.length)fail('Missing currency report');
  for(const currency of currencies){
    const reports=bundle.reports.filter(r=>r.currency===currency);if(reports.length!==1)fail('Missing or repeated currency report');const r=reports[0],g=graph(input,currency);g.currency=currency;
    if(!Array.isArray(r.matches))fail('Missing allocation');const byKey=new Map(g.candidates.map(e=>[JSON.stringify([e.meta.payment,e.meta.invoice]),e])),seen=new Set();
    let value=0,cost=0;for(const m of r.matches){const key=JSON.stringify([m.payment,m.invoice]),e=byKey.get(key);integer(m.minor,'Allocation');if(!e||m.minor<=0||m.minor>e.initial||seen.has(key))fail('Invalid allocation edge/amount');seen.add(key);e.cap-=m.minor;e.rev.cap+=m.minor;value+=m.minor;cost+=m.minor*e.cost;}
    for(const e of g.original)if(!e.meta){let flow;if(e.u===g.S)flow=g.adj[e.v].filter(x=>x.meta).reduce((a,x)=>a+x.initial-x.cap,0);else flow=g.candidates.filter(x=>x.v===e.u).reduce((a,x)=>a+x.initial-x.cap,0);if(flow>e.initial)fail('Capacity exceeded');e.cap-=flow;e.rev.cap+=flow;}
    integer(r.matchedMinor,'Objective');integer(r.costMinorDays,'Cost');if(value!==r.matchedMinor||cost!==r.costMinorDays)fail('Objective does not match allocation');
    const labels=new Map(g.labels.map((x,i)=>[x,i]));if(!Array.isArray(r.certificate?.reachable))fail('Missing cut certificate');const cut=new Set(r.certificate.reachable.map(label=>{if(!labels.has(label))fail('Unknown cut node');return labels.get(label);}));
    if(!cut.has(g.S)||cut.has(g.T))fail('Invalid source/sink cut');const cap=g.original.filter(e=>cut.has(e.u)&&!cut.has(e.v)).reduce((a,e)=>a+e.initial,0);if(cap!==value)fail('Cut capacity does not equal flow');
    const p=g.labels.map(label=>r.certificate.potentials?.[label]);p.forEach(x=>{integer(x,'Potential');if(Math.abs(x)>1000000)fail('Potential outside verifier bounds');});for(let u=0;u<g.N;u++)for(const e of g.adj[u])if(e.cap>0&&e.cost+p[u]-p[e.v]<0)fail('Negative reduced cost: optimality not certified');
  }
  return {valid:true,scope:'Feasibility, maximum flow and minimum day-gap cost in the supplied candidate model. Display strings and ambiguity annotations are not certified.'};
 }catch(error){return {valid:false,error:error.message};}
}
export const sample={maxDays:30,payments:[{id:'BANK-101',counterparty:'Cedar Studio',currency:'HKD',amount:'180.00',date:'2026-10-18'},{id:'BANK-102',counterparty:'Cedar Studio',currency:'HKD',amount:'120.00',date:'2026-10-18'},{id:'BANK-103',counterparty:'Unmatched Shop',currency:'HKD',amount:'40.00',date:'2026-10-18'}],invoices:[{id:'INV-11',counterparty:'Cedar Studio',currency:'HKD',amount:'150.00',date:'2026-10-17'},{id:'INV-12',counterparty:'Cedar Studio',currency:'HKD',amount:'150.00',date:'2026-10-17'}]};
