
let refreshDelay = localStorage.getItem('refreshDelay') ? parseInt(localStorage.getItem('refreshDelay')) : 5;
let countdownInterval = null;  // For storing the countdown interval ID


function createRefreshMenu() {
  const menu = document.createElement('div');
  menu.id = 'refresh-menu';  
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.backgroundColor = '#f1f1f1';
  menu.style.padding = '10px';
  menu.style.border = '1px solid #ccc';
  menu.style.zIndex = '1000';
  menu.style.display = 'none'; 

  const label = document.createElement('label');
  label.textContent = 'Set refresh delay (seconds): ';

  const input = document.createElement('input');
  input.type = 'number';
  input.value = refreshDelay;
  input.style.width = '50px';

  const countdownDisplay = document.createElement('p');
  countdownDisplay.id = 'countdown-display';
  countdownDisplay.textContent = `Next refresh in: ${refreshDelay}s`;


  input.addEventListener('change', function() {
    refreshDelay = parseInt(input.value);
    localStorage.setItem('refreshDelay', refreshDelay);
    console.log(`New refresh delay set to ${refreshDelay} seconds`);
    countdownDisplay.textContent = `Next refresh in: ${refreshDelay}s`;
  });

  menu.appendChild(label);
  menu.appendChild(input);
  menu.appendChild(countdownDisplay);
  document.body.appendChild(menu);
}


function showRefreshMenu() {
  const menu = document.getElementById('refresh-menu');
  if (menu) {
    menu.style.display = 'block';  // Show the menu
  }
}


function hideRefreshMenu() {
  const menu = document.getElementById('refresh-menu');
  if (menu) {
    menu.style.display = 'none';  // Hide the menu
  }
}


function startCountdown() {
  let countdown = refreshDelay;
  const countdownDisplay = document.getElementById('countdown-display');

  countdownInterval = setInterval(function() {
    countdown--;
    if (countdownDisplay) {
      countdownDisplay.textContent = `Next refresh in: ${countdown}s`;
    }

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      console.log("Refreshing the page now...");
      location.reload();
    }
  }, 1000);  // Update every second
}


window.addEventListener("load", function() {
  console.log("Window loaded, content script running");


  createRefreshMenu();

  
  if (document.title === "Steam Community :: Error") {
    console.log("Steam error page detected");

    const errorText = document.querySelector('h3');
    if (errorText && errorText.textContent.includes("There was a problem communicating with the Steam servers")) {
      console.log("Steam servers error detected. The page will reload after countdown.");
      showRefreshMenu();  
      startCountdown();  
    } else {
      hideRefreshMenu();  
    }
  } else {
    console.log("Checking for item listing error...");

    const listingErrorElement = document.querySelector('.market_listing_table_message');
    if (listingErrorElement && listingErrorElement.textContent.includes("There was an error getting listings for this item")) {
      console.log("Listing error detected. The page will reload after countdown.");
      showRefreshMenu(); 
      startCountdown();   
    } else {
      hideRefreshMenu();  
      clearInterval(countdownInterval); 
    }
  }
});
