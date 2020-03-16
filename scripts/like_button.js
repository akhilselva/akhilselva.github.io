function tick() {
    const element = (
      <div id="home">
        {new Date().toLocaleTimeString()}
      </div>
    );
    ReactDOM.render(element, document.getElementById('time'));
  }
  
  setInterval(tick, 1000);