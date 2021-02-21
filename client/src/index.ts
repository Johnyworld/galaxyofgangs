
const socket = io('http://localhost:7000', { autoConnect: false });

socket.connect();

socket.emit('hello', () => {
  console.log('connection?')
});

let title = <HTMLElement> document.getElementById('title');
title.style.color = 'violet';
title.innerText = 'Hello Galaxy!'

