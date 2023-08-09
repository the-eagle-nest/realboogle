function openPage(pageName) {
  switch (pageName) {
    case 'lunchMenu':
      window.location.href = 'lunch_menu.html';
      break;
    case 'liveStream':
      window.location.href = 'live_stream.html';
      break;
    case 'artCompetition':
      window.location.href = 'art_competition.html';
      break;
    case 'vote':
      window.location.href = 'vote.html';
      break;
    case 'digitalNewspaper':
      window.location.href = 'digital_newspaper.html';
      break;
    default:
      console.log('Invalid page name:', pageName);
  }
}

function showPopup() {
  document.getElementById('popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

// Show the popup when the page loads
window.onload = function() {
  showPopup();
};

document.addEventListener("DOMContentLoaded", function() {
  // Add event listeners to the buttons
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      var buttonName = this.textContent;
      // Add your code to handle button click actions here
      // For example, you can display different content based on the button clicked
      console.log("Button clicked: " + buttonName);
    });
  });

  // Popup logic
  var popup = document.getElementById("popup");
  var closeButton = document.getElementById("close-button");

  function openPopup() {
    popup.style.display = "flex";
  }

  function closePopup() {
    popup.style.display = "none";
  }

  closeButton.addEventListener("click", closePopup);

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closePopup();
    }
  });
});
