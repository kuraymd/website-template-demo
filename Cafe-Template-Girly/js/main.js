'use strict';

/* ============================================================
   Velvet Spoon — Girly Template  |  main.js
   ============================================================
   機能:
     1. スティッキーヘッダー（スクロール検知）
     2. モバイルナビゲーション（ハンバーガーメニュー）
     3. スムーススクロール（アンカーリンク）
     4. スクロールリビール（.js-reveal 要素をバネ感でフェードイン）
     5. ナビゲーション アクティブ状態（スクロール位置に連動）
     6. 浮遊デコレーション要素の初期化（data-* 属性から位置/サイズを設定）
   ============================================================ */


/* ──────────────────────────────────────────────
   1. スティッキーヘッダー
   ────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ──────────────────────────────────────────────
   2. モバイルナビゲーション
   ────────────────────────────────────────────── */
function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (!toggle || !navList) return;

  const openNav = () => {
    toggle.classList.add('is-open');
    navList.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'ナビゲーションを閉じる');
  };
  const closeNav = () => {
    toggle.classList.remove('is-open');
    navList.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'ナビゲーションを開く');
  };

  toggle.addEventListener('click', () => {
    navList.classList.contains('is-open') ? closeNav() : openNav();
  });

  // ナビリンクをタップしたら閉じる
  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ナビ外をタップしたら閉じる
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) closeNav();
  });
}


/* ──────────────────────────────────────────────
   3. スムーススクロール
   ────────────────────────────────────────────── */
function initSmoothScroll() {
  const header = document.getElementById('site-header');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}


/* ──────────────────────────────────────────────
   4. スクロールリビール
   .js-reveal が画面に入ったとき .is-revealed を付与
   グループ内で連番の遅延差をつけてふわっと登場させる
   ────────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // 親要素内の .js-reveal 兄弟に対して連番遅延を適用
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(
              el => el.classList.contains('js-reveal')
            )
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 90; // ms（グループ内の遅延）

        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────────
   5. ナビゲーション アクティブ状態
   ────────────────────────────────────────────── */
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${id}`
          );
        });
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}


/* ──────────────────────────────────────────────
   6. 浮遊デコレーション要素の初期化
   HTML の data-* 属性（size / top / right / left / delay）を
   読み取って各 .float 要素のスタイルを動的に設定する
   ────────────────────────────────────────────── */
function initFloats() {
  document.querySelectorAll('.float').forEach(el => {
    const size  = el.dataset.size  || 24;
    const top   = el.dataset.top;
    const right = el.dataset.right;
    const left  = el.dataset.left;
    const delay = el.dataset.delay || 0;

    el.style.width           = `${size}px`;
    el.style.height           = `${size}px`;
    el.style.animationDelay   = `${delay}s`;
    if (top)   el.style.top   = `${top}%`;
    if (right) el.style.right = `${right}%`;
    if (left)  el.style.left  = `${left}%`;
  });
}


/* ──────────────────────────────────────────────
   初期化
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initNavActiveState();
  initFloats();
});
