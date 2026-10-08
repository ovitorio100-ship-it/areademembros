(() => {
  const { axes, maps } = window.CATALOG;
  const icons = { personalidade: '◈', psicopatologia: '✚', biologicas: '✳', desenvolvimento: '◒', metodologia: '⌁', avaliacao: '◎' };
  const storeKey = 'psicologia-visual-favoritos';
  let favorites;
  try { favorites = new Set(JSON.parse(localStorage.getItem(storeKey) || '[]')); } catch { favorites = new Set(); }
  const state = { axis: 'all', query: '', favoritesOnly: false, current: null };
  const $ = id => document.getElementById(id);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normal = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const axisBySlug = slug => axes.find(a => a.slug === slug);
  const src = map => `assets/mapas/${map.file}`;

  function visibleMaps() {
    const term = normal(state.query.trim());
    return maps.filter(map => (state.axis === 'all' || map.axis === state.axis) && (!state.favoritesOnly || favorites.has(map.id)) && (!term || normal(`${map.title} ${axisBySlug(map.axis).name}`).includes(term)));
  }

  function setAxis(slug, favoriteMode = false) {
    state.axis = slug; state.favoritesOnly = favoriteMode; state.query = '';
    $('search').value = ''; $('axis-select').value = slug;
    render();
    if (slug !== 'all' || favoriteMode) $('mapas').scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderNav() {
    $('primary-nav').innerHTML = `<button class="nav-row ${state.axis === 'all' && !state.favoritesOnly ? 'active' : ''}" data-axis="all"><span class="nav-symbol">▦</span><span>Visão geral</span><b>150</b></button><button class="nav-row ${state.favoritesOnly ? 'active' : ''}" data-favorites="1"><span class="nav-symbol">☆</span><span>Favoritos</span><b>${favorites.size}</b></button><div class="side-kicker nav-kicker">EIXOS DE ESTUDO</div>` + axes.map(axis => `<button class="nav-row ${state.axis === axis.slug ? 'active' : ''}" data-axis="${axis.slug}"><span class="nav-symbol colored" style="--axis:${axis.color}">${icons[axis.slug]}</span><span>${escapeHTML(axis.name)}</span><b>${axis.count}</b></button>`).join('');
  }

  function renderCollections() {
    $('collection-grid').innerHTML = axes.map((axis, i) => `<button class="collection-card" style="--axis:${axis.color}" data-axis="${axis.slug}"><span class="collection-icon">${icons[axis.slug]}</span><small>${String(i+1).padStart(2,'0')} / 06</small><strong>${escapeHTML(axis.name)}</strong><span class="collection-tail">${axis.count} mapas <i>↗</i></span></button>`).join('');
  }

  function renderMaps() {
    const list = visibleMaps();
    const active = axisBySlug(state.axis);
    $('breadcrumb').innerHTML = `Biblioteca <b>/</b> ${state.favoritesOnly ? 'Favoritos' : escapeHTML(active?.name || 'Visão geral')}`;
    $('hero-title').innerHTML = state.favoritesOnly ? 'Os mapas que você <em>quer revisitar.</em>' : active ? escapeHTML(active.name) : 'A Psicologia fica mais clara quando você <em>vê as conexões.</em>';
    $('hero-desc').textContent = state.favoritesOnly ? 'Seus mapas salvos ficam reunidos aqui neste navegador.' : active?.description || 'Navegue pelos temas, encontre o conceito que procura e estude com mapas visuais feitos para facilitar a compreensão.';
    $('hero-count').textContent = state.favoritesOnly ? favorites.size : active?.count || 150;
    $('collections-section').hidden = state.axis !== 'all' || state.favoritesOnly;
    $('maps-title').textContent = state.favoritesOnly ? 'Seus favoritos' : active?.name || 'Todos os mapas';
    $('result-count').textContent = `${list.length} ${list.length === 1 ? 'mapa' : 'mapas'}`;
    $('empty').hidden = list.length > 0;
    $('map-grid').innerHTML = list.map(map => { const axis = axisBySlug(map.axis); const title = escapeHTML(map.title); return `<article class="map-card" style="--axis:${axis.color}"><button class="thumbnail" data-open="${map.id}" aria-label="Abrir mapa ${title}"><img src="${src(map)}" alt="Prévia do mapa ${title}" loading="lazy"></button><div class="card-content"><div class="map-meta"><span>${escapeHTML(axis.name)} · ${String(map.number).padStart(2,'0')}</span><button class="favorite ${favorites.has(map.id) ? 'saved' : ''}" data-favorite="${map.id}" aria-label="${favorites.has(map.id) ? 'Remover dos' : 'Adicionar aos'} favoritos">${favorites.has(map.id) ? '★' : '☆'}</button></div><button class="map-name" data-open="${map.id}">${title}</button><div class="card-actions"><button data-open="${map.id}">Visualizar ↗</button><a href="${src(map)}" download>Baixar PNG ↓</a></div></div></article>`; }).join('');
  }

  function render() { renderNav(); renderMaps(); }
  function openMap(id) {
    const map = maps.find(item => item.id === id); if (!map) return;
    state.current = map;
    const axis = axisBySlug(map.axis);
    $('lightbox-label').textContent = `${axis.name.toUpperCase()} · MAPA ${String(map.number).padStart(2,'0')}`;
    $('lightbox-title').textContent = map.title;
    $('lightbox-image').src = src(map); $('lightbox-image').alt = `Mapa visual: ${map.title}`;
    $('download').href = src(map);
    const list = visibleMaps(); const pos = list.findIndex(item => item.id === id);
    $('lightbox-position').textContent = `${pos + 1} de ${list.length}`;
    $('previous').disabled = pos <= 0; $('next').disabled = pos >= list.length - 1;
    $('lightbox').hidden = false; document.body.classList.add('modal-open'); $('close').focus();
  }
  function closeMap() { $('lightbox').hidden = true; $('lightbox-image').removeAttribute('src'); state.current = null; document.body.classList.remove('modal-open'); }
  function step(offset) { const list = visibleMaps(); const pos = list.findIndex(item => item.id === state.current?.id); if (list[pos + offset]) openMap(list[pos + offset].id); }

  document.addEventListener('click', event => {
    const axisButton = event.target.closest('[data-axis]'); if (axisButton) { setAxis(axisButton.dataset.axis); return; }
    if (event.target.closest('[data-favorites]')) { setAxis('all', true); return; }
    const favorite = event.target.closest('[data-favorite]'); if (favorite) { const id = favorite.dataset.favorite; favorites.has(id) ? favorites.delete(id) : favorites.add(id); localStorage.setItem(storeKey, JSON.stringify([...favorites])); render(); return; }
    const open = event.target.closest('[data-open]'); if (open) { openMap(open.dataset.open); return; }
    if (event.target === $('lightbox')) closeMap();
  });
  $('home-link').addEventListener('click', event => { event.preventDefault(); setAxis('all'); });
  $('search').addEventListener('input', event => { state.query = event.target.value; renderMaps(); });
  $('axis-select').innerHTML += axes.map(axis => `<option value="${axis.slug}">${escapeHTML(axis.name)}</option>`).join('');
  $('axis-select').addEventListener('change', event => setAxis(event.target.value));
  $('close').addEventListener('click', closeMap);
  $('previous').addEventListener('click', () => step(-1)); $('next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', event => { if ($('lightbox').hidden) return; if (event.key === 'Escape') closeMap(); if (event.key === 'ArrowLeft') step(-1); if (event.key === 'ArrowRight') step(1); });
  renderCollections(); render();
})();
