export function helloworld () {
  addDom('div')
}

const addDom = (type: string) => {
  const app = document.getElementById('app')
  const helloworld = document.createElement(type);
  helloworld.innerText = 'ts --- helloworld' + process.env.NODE_ENV;
  app.appendChild(helloworld)
}