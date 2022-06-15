export function helloworld (n?: any):void {
  const app = document.getElementById('app')
  const helloworld = document.createElement('div');
  helloworld.innerText = 'helloworld';
  
  app.appendChild(helloworld)
}