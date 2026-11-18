/* =========================================================
   第三組「健康稻理－食在永續」互動元件
   每個元件都會先檢查頁面上有沒有對應的區塊，沒有就跳過，
   所以所有頁面可以共用這一個檔案。
   ========================================================= */

function loadData(key, fallback) {
  try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; } catch (e) { return fallback; }
}
function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 瀏覽器不允許儲存時就略過 */ }
}

/* ---------- 1. 滑動閱讀：捲到畫面時淡入（所有展區）---------- */
var reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  reveals.forEach(function (el) { io.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add('is-in'); });
}

/* ---------- 2. 首頁策展命題輪播 ---------- */
var motto = document.getElementById('motto');
if (motto) {
  var MOTTOS = [
    '走過千山萬水，不如吃得「一鹿健康」',
    '吃一口無毒純淨，遇見身體與土地的「鹿（綠）光」',
    '吃對每一口，讓身體「鹿」出健康，讓土地「米」上自然'
  ];
  var dots = document.getElementById('motto-dots');
  var mi = 0;
  MOTTOS.forEach(function (t, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', '第 ' + (i + 1) + ' 句命題');
    b.addEventListener('click', function () { showMotto(i); stopAuto(); });
    dots.appendChild(b);
  });
  function showMotto(i) {
    mi = i;
    motto.textContent = MOTTOS[i];
    dots.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  }
  var timer = setInterval(function () { showMotto((mi + 1) % MOTTOS.length); }, 4500);
  function stopAuto() { clearInterval(timer); }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) stopAuto();
  showMotto(0);
}

/* ---------- 3. 翻牌知識卡（02 和土地好好相處）---------- */
document.querySelectorAll('.flip').forEach(function (card) {
  card.addEventListener('click', function () {
    var flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
  });
});

/* ---------- 4. 稻穀的旅程（04 日光溫室曬穀）---------- */
var journey = document.getElementById('journey');
if (journey) {
  var steps = journey.querySelectorAll('button');
  var panel = document.getElementById('journey-panel');
  var bar = document.getElementById('journey-bar');
  function goStep(i) {
    steps.forEach(function (b, j) { if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    var b = steps[i];
    panel.innerHTML = '<p class="big">' + (i + 1) + '. ' + b.textContent + '</p><p>' + b.dataset.detail + '</p>' +
      (i < steps.length - 1 ? '<p class="note">下一步：' + steps[i + 1].textContent + '</p>' : '<p class="note">旅程完成！這碗飯，走了好長一段路。</p>');
    bar.style.width = ((i + 1) / steps.length * 100) + '%';
  }
  steps.forEach(function (b, i) { b.addEventListener('click', function () { goStep(i); }); });
  goStep(0);
}

/* ---------- 5. 小測驗（05 回到自己的生活）---------- */
var QUIZ = [
  { q: '鹿光米農場在哪裡？', opts: ['南投鹿谷鄉瑞田村', '臺東池上鄉', '宜蘭三星鄉'], a: 0, ex: '瑞田村是濁水溪與清水溝溪的合流處，被稱為「鹿谷穀倉」。' },
  { q: '農場用什麼方法趕麻雀？', opts: ['撒毒餌', '拉防鳥線', '放鞭炮'], a: 1, ex: '用棉線拉陣，麻雀以為是陷阱就不敢下來，驅鳥而不傷鳥。' },
  { q: '收割的稻子倒掛風乾大約幾天？', opts: ['1～2 天', '10～15 天', '60 天'], a: 1, ex: '參考日式垂吊工序改良，讓米粒慢慢自然風乾。' },
  { q: '田埂預留多寬的草，讓小動物有地方住？', opts: ['3 公分', '30 公分', '3 公尺'], a: 1, ex: '留草 30 公分，山羌、野兔等動物就多一點棲地。' },
  { q: '同樣一碗飯，哪一種的膳食纖維比較多？', opts: ['白米', '糙米', '差不多'], a: 1, ex: '一碗糙米約 3.2 公克，白米約 0.6 公克（國健署資料）。' }
];
var quizBox = document.getElementById('quiz');
if (quizBox) {
  var qi = 0, score = 0;
  var qText = document.getElementById('quiz-q');
  var qOpts = document.getElementById('quiz-opts');
  var qFeed = document.getElementById('quiz-feed');
  var qNext = document.getElementById('quiz-next');
  var qCount = document.getElementById('quiz-count');
  function renderQ() {
    var item = QUIZ[qi];
    qCount.textContent = '第 ' + (qi + 1) + ' / ' + QUIZ.length + ' 題';
    qText.textContent = item.q;
    qOpts.innerHTML = '';
    qFeed.textContent = '';
    qNext.disabled = true;
    item.opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = o;
      b.addEventListener('click', function () {
        qOpts.querySelectorAll('button').forEach(function (x, j) {
          x.disabled = true;
          if (j === item.a) x.classList.add('right');
        });
        if (i === item.a) { score++; qFeed.innerHTML = '<span class="ok">答對了！</span>' + item.ex; }
        else { b.classList.add('wrong'); qFeed.innerHTML = '再想想～' + item.ex; }
        qNext.disabled = false;
      });
      qOpts.appendChild(b);
    });
    qNext.textContent = qi === QUIZ.length - 1 ? '看結果' : '下一題';
  }
  qNext.addEventListener('click', function () {
    if (qi < QUIZ.length - 1) { qi++; renderQ(); return; }
    qCount.textContent = '測驗完成';
    qText.textContent = '你答對了 ' + score + ' / ' + QUIZ.length + ' 題！';
    qOpts.innerHTML = '';
    qFeed.textContent = score >= 4 ? '你已經是鹿光米小專家了！' : '回到前面的展區再逛逛，答案都在裡面喔。';
    qNext.textContent = '再玩一次';
    qNext.disabled = false;
    qi = -1; score = 0;   /* 再按一次就從第 1 題重新開始 */
  });
  renderQ();
}

/* ---------- 6. 投票：你家最常吃哪種米？（05）---------- */
/* 票數只存在這個瀏覽器。要全班共享，請改用 Google 表單。 */
var voteBox = document.getElementById('vote');
if (voteBox) {
  var VOTE_KEY = 'g3-vote';
  var SEED = { '白米': 9, '糙米': 3, '胚芽米': 2, '混合米': 4 }; /* 示範用的起始票數 */
  var votes = loadData(VOTE_KEY, null) || { counts: SEED, mine: null };
  var result = document.getElementById('vote-result');
  function renderVote() {
    var total = 0;
    Object.keys(votes.counts).forEach(function (k) { total += votes.counts[k]; });
    result.innerHTML = '';
    Object.keys(votes.counts).forEach(function (k) {
      var pct = total ? Math.round(votes.counts[k] / total * 100) : 0;
      var row = document.createElement('div');
      row.className = 'vote-bar';
      row.innerHTML = '<span>' + k + '</span><div class="bar"><span style="width:' + pct + '%"></span></div><span>' + pct + '%</span>';
      result.appendChild(row);
    });
    voteBox.querySelectorAll('.vote-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.v === votes.mine ? 'true' : 'false'); });
  }
  voteBox.querySelectorAll('.vote-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      if (votes.mine) votes.counts[votes.mine]--;
      votes.mine = b.dataset.v;
      votes.counts[votes.mine]++;
      saveData(VOTE_KEY, votes);
      renderVote();
    });
  });
  renderVote();
}

/* ---------- 7. 餐桌情境（05）---------- */
document.querySelectorAll('.meal-btn').forEach(function (b, _, all) {
  b.addEventListener('click', function () {
    all.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    document.getElementById('meal-tip').textContent = b.dataset.tip;
  });
});

/* ---------- 8. 我的一碗飯：白米與糙米混煮（06 健康區）---------- */
/* 數值：一碗 160 g，國健署資料 */
var RICE = {
  brown: { kcal: 290, fiber: 3.2, b1: 0.28 },
  white: { kcal: 283, fiber: 0.6, b1: 0.06 }
};
var mix = document.getElementById('mix');
if (mix) {
  function updateMix() {
    var p = parseInt(mix.value, 10) / 100;
    function v(k) { return RICE.brown[k] * p + RICE.white[k] * (1 - p); }
    document.getElementById('mix-label').textContent = '糙米 ' + Math.round(p * 100) + '%　白米 ' + Math.round((1 - p) * 100) + '%';
    document.getElementById('mix-kcal').textContent = Math.round(v('kcal'));
    document.getElementById('mix-fiber').textContent = v('fiber').toFixed(1);
    document.getElementById('mix-b1').textContent = v('b1').toFixed(2);
    document.getElementById('bowl-brown').setAttribute('height', String(60 * p));
    document.getElementById('bowl-brown').setAttribute('y', String(110 - 60 * p));
    document.getElementById('mix-msg').innerHTML = p >= 1 / 3
      ? '<span class="ok">達標！</span>糙米佔了三分之一以上，符合「每天主食至少 1/3 未精製全穀雜糧」的建議。'
      : '再多加一點糙米吧！建議每天主食至少 1/3 是未精製的全穀雜糧。';
  }
  mix.addEventListener('input', updateMix);
  updateMix();
}
