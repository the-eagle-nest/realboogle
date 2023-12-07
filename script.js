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