const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 process.env.DASHSCOPE_INTL_API_KEY='fixture-only';process.env.QWEN_OMNI_BASE='https://fixture.invalid';
 const previous=global.fetch,calls=[];
 global.fetch=async(url,init)=>{calls.push(JSON.parse(init.body));return new Response('data: [DONE]\n\n',{headers:{'Content-Type':'text/event-stream'}})};
 try{
  const tts=require('../api/tts');
  const res={setHeader(){},status(){return this},json(x){throw Error(JSON.stringify(x))},writeHead(){this.headersSent=true},write(){},end(){}};
  await tts({method:'POST',headers:{origin:'capacitor://localhost'},body:{omni:{sys:'x'.repeat(16000),msgs:[{text:'Hello'}]}}},res);
  const edge=await import('data:text/javascript;base64,'+Buffer.from(fs.readFileSync(require.resolve('../api/longcat.js'))).toString('base64'));
  const out=await edge.default(new Request('https://fixture/api/longcat',{method:'POST',headers:{origin:'capacitor://localhost','content-type':'application/json'},body:JSON.stringify({omni:{sys:'x'.repeat(16000),msgs:[{text:'Hello'}]}})}));await out.text();
  assert.equal(calls.length,2);
  for(const body of calls){assert(body.messages[0].content.startsWith('Safety rules:'));assert(body.messages[0].content.includes('sexual content involving minors'));assert(body.messages[0].content.length<=12000);assert.equal(body.messages[1].content,'Hello')}
  console.log('PASS actual TTS and LongCat native voice payloads retain policy under long prompts');
 }finally{global.fetch=previous}
})().catch(e=>{console.error(e);process.exitCode=1});
