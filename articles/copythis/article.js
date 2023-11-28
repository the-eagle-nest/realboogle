document.addEventListener('DOMContentLoaded', function () {
  // Values to be customized
  
  var articleTitle = "Replace this with the article title";
  var articleContent = "Replace this with your article";
  var articleWriter = "Replace this with the writer's name";
  var articleDescription = "Replace this with a short description of the article";
  var articlePictureUrl = "Replace this with the link of the article picture. Must be 300x300 and a .webp file";

// DO NOT EDIT BELOW HERE.  IT WILL BREAK THE WEBSITE.

  var articleTitleElement = document.getElementById('article-title');
  articleTitleElement.innerText = articleTitle;
  document.getElementById('article-content').innerHTML = articleContent;
  var articleWriterElement = document.getElementById('article-writer');
  articleWriterElement.innerText = "Written by: " + articleWriter;
  var articleDescriptionElement = document.getElementById('article-description');
  articleDescriptionElement.innerText = articleDescription;
  var articlePictureElement = document.getElementById('article-picture');
  articlePictureElement.src = articlePictureUrl;
});

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
