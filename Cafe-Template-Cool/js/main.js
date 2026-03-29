'use strict';

/* ============================================================
   Velvet Spoon — Cool Template  |  main.js
   ============================================================
   機能:
     1. スティッキーヘッダー（スクロール検知）
     2. モバイルナビゲーション（ハンバーガーメニュー）
     3. スムーススクロール（アンカーリンク）
     4. スクロールリビール（.js-reveal 要素をフェードイン）
     5. ナビゲーション アクティブ状態（スクロール位置に連動）
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
  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });
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
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
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
   ────────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(
              el => el.classList.contains('js-reveal')
            )
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('is-revealed');
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
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
   初期化
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initNavActiveState();
});
