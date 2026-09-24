document.addEventListener('DOMContentLoaded', function() {
  const percentSlider = document.getElementById('percent');
  const percentVal = document.getElementById('percent-val');
  const viewsSlider = document.getElementById('views');
  const viewsVal = document.getElementById('views-val');
  const saveBtn = document.querySelector('.save-btn');

  // 1. Data load karna (storage se)
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['percentLimit', 'viewsLimit'], function(data) {
      if (data.percentLimit) {
        percentSlider.value = data.percentLimit;
        percentVal.innerText = data.percentLimit + '%';
      }
      if (data.viewsLimit) {
        viewsSlider.value = data.viewsLimit;
        viewsVal.innerText = data.viewsLimit + (data.viewsLimit == 1 ? ' time' : ' times');
      }
    });
  }

  // 2. Slider move hone par text update
  percentSlider.addEventListener('input', function() {
    percentVal.innerText = this.value + '%';
    saveBtn.classList.remove('locked');
    saveBtn.innerText = 'Apply Filter';
  });

  viewsSlider.addEventListener('input', function() {
    viewsVal.innerText = this.value + (this.value == 1 ? ' time' : ' times');
    saveBtn.classList.remove('locked');
    saveBtn.innerText = 'Apply Filter';
  });

  // 3. Apply click hone par data save karna
  saveBtn.addEventListener('click', function() {
    saveBtn.classList.add('locked');
    saveBtn.innerText = 'Applied ✓';
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 
        percentLimit: percentSlider.value, 
        viewsLimit: viewsSlider.value 
      });
    }
  });

  // --- CALENDAR UI ---
  const grid = document.getElementById('calendar-grid');
  const header = document.getElementById('month-year-display'); 

  if (grid && header) {
    const d = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    header.innerText = monthNames[d.getMonth()] + " " + d.getFullYear();
    
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const shades = ['#ffffff', '#fffafa', '#fff0f5']; 

    function makeBox(txt) {
      const box = document.createElement('div');
      box.className = 'box';
      box.innerText = txt;
      box.style.backgroundColor = shades[Math.floor(Math.random() * shades.length)];
      
      if (txt === d.getDate()) { 
          box.style.fontWeight = 'bold'; 
          box.style.background = '#4a154b'; 
          box.style.color = '#fff0f5'; 
      }
      grid.appendChild(box);
    }

    for (let i = 0; i < firstDay; i++) makeBox('');
    for (let day = 1; day <= daysInMonth; day++) makeBox(day);
    const rem = (7 - ((firstDay + daysInMonth) % 7)) % 7;
    for (let j = 0; j < rem; j++) makeBox('');
  }
});