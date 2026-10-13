import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';
try {
 const manifest=JSON.parse(await readFile(new URL('../public/assets/generated/manifest.json',import.meta.url),'utf8'));
 if(manifest.transparent){console.log('Transparent artwork already exists. No new task was submitted.');process.exit(0);}
}catch{}
const key = process.env.KIE_API_KEY;
if (!key) { console.error('Set KIE_API_KEY in environment settings.'); process.exit(1); }
const cache = new URL('../.cache/kie-cutout.json', import.meta.url);
const assets = new URL('../public/assets/generated/', import.meta.url);
async function request(url, options={}) {
 const response = await fetch(url,{...options,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(30000)});
 if(!response.ok) throw new Error(`Kie.ai HTTP ${response.status}`);
 const result=await response.json();
 if(result.code!==200) throw new Error(`Kie.ai returned code ${result.code}. Check the task in your account dashboard.`);
 return result.data;
}
try{
 let taskId;
 try {taskId=JSON.parse(await readFile(cache,'utf8')).taskId;}catch{}
 if(!taskId){
  const generation=JSON.parse(await readFile(new URL('../.cache/kie-generation.json',import.meta.url),'utf8'));
  const original=await request(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(generation.taskId)}`);
  const imageUrl=JSON.parse(original.resultJson).resultUrls[0];
  const task=await request('https://api.kie.ai/api/v1/jobs/createTask',{method:'POST',body:JSON.stringify({model:'recraft/remove-background',input:{image:imageUrl}})});
  taskId=task?.taskId;
  if(!taskId)throw new Error('Kie.ai did not return a task ID.');
  await mkdir(new URL('../.cache/',import.meta.url),{recursive:true});
  await writeFile(cache,JSON.stringify({taskId}));
  console.log('Background removal submitted:',taskId);
 }
 let imageUrl;
 for(let i=0;i<60;i++){
  const task=await request(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`);
  if(task.state==='fail') throw new Error('Background removal failed.');
  if(task.state==='success'){imageUrl=JSON.parse(task.resultJson).resultUrls[0];break;}
  if(i%6===0)console.log('Cutout status:',task.state);
  await pause(5000);
 }
 if(!imageUrl)throw new Error('Cutout not complete. Rerun to resume the cached task.');
 const url=new URL(imageUrl);
 if(url.protocol!=='https:')throw new Error('Insecure output URL.');
 const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw new Error(`Cutout download HTTP ${response.status}. Check the output CDN network access.`);
 const bytes=new Uint8Array(await response.arrayBuffer());
 if(bytes[0]!==137||bytes[1]!==80||bytes[2]!==78||bytes[3]!==71)throw new Error('Expected PNG output.');
 await writeFile(new URL('plane-cutout.png',assets),bytes);
 await writeFile(new URL('manifest.json',assets),JSON.stringify({heroPlane:'/assets/generated/plane-cutout.png',transparent:true,model:'nano-banana-pro + recraft/remove-background',generatedAt:new Date().toISOString()},null,2));
 console.log('Saved the transparent Kie.ai plane.');
}catch(error){console.error(error.message);process.exitCode=1;}
