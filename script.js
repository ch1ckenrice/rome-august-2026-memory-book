const daysContainer = document.getElementById('days');
const totalCount = document.getElementById('totalCount');
const closingText = document.getElementById('closingText');
const filterButtons = document.querySelectorAll('[data-filter]');

let activeFilter = 'all';

const dayTitles = {
  'Day 1': 'First steps into Rome',
  'Day 2': 'Vatican light and evening streets',
  'Day 3': 'Sea, sunburns, Pantheon, goodbye',
};

function escapeHtml(value){
  return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
}

function groupByDay(items){
  return items.reduce((groups, memory) => {
    if(!groups[memory.day]){
      groups[memory.day] = [];
    }

    groups[memory.day].push(memory);
    return groups;
  }, {});
}

function renderMood(value){
  return Array.from({ length: 5 }, (_, index) => {
    const className = index < value ? 'filled' : '';
    return `<span class="${className}"></span>`;
  }).join('');
}

function renderMemory(memory){
  return `
    <article class="memory-card ${memory.author.toLowerCase()}">
      <img src="${memory.photo}" alt="${escapeHtml(memory.place)}">
      <div class="memory-body">
        <div class="memory-meta">
          <span>${escapeHtml(memory.author)}</span>
          <div class="mood" aria-label="Mood ${memory.mood} out of 5">
            ${renderMood(memory.mood)}
          </div>
        </div>
        <h3>${escapeHtml(memory.place)}</h3>
        <p>${escapeHtml(memory.text)}</p>
      </div>
    </article>
  `;
}

function sortDays(days){
  return Object.keys(days).sort((a, b) => {
    const dayA = Number(a.match(/\d+/)?.[0] || 0);
    const dayB = Number(b.match(/\d+/)?.[0] || 0);
    return dayA - dayB;
  });
}

function filteredMemories(){
  if(activeFilter === 'all'){
    return memories;
  }

  return memories.filter((memory) => memory.author === activeFilter);
}

function renderDays(){
  const items = filteredMemories();
  const groups = groupByDay(items);

  totalCount.textContent = items.length;

  daysContainer.innerHTML = sortDays(groups).map((day) => `
    <section class="day-section">
      <div class="day-heading">
        <p>${day}</p>
        <h2>${dayTitles[day] || day}</h2>
      </div>
      <div class="memory-grid">
        ${groups[day].map(renderMemory).join('')}
      </div>
    </section>
  `).join('');
}

function setClosingNote(){
  const note = memories.find((memory) =>
    memory.author === 'Olena' && memory.place.toLowerCase().includes('загальні')
  );

  if(note){
    closingText.textContent = note.text;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    renderDays();
  });
});

renderDays();
setClosingNote();
