'use strict';

/* ============================================================
   Velvet Spoon — Retro Pop Template  |  main.js
   ============================================================
   機能一覧:
     1. スティッキーヘッダー（スクロール時シャドウ）
     2. モバイルナビゲーション（ハンバーガー）
     3. スムーズスクロール
     4. スクロールリビールアニメーション（.js-reveal）
     5. ページトップボタン
     6. ナビリンク アクティブ状態
     7. マーキー ホバーで一時停止
   ============================================================ */

const HEADER_ID  = 'site-header';
const NAV_ID     = 'nav-list';
const TOGGLE_ID  = 'nav-toggle';
const TOP_BTN_ID = 'back-to-top';


/* ============================================================
   1. スティッキーヘッダー
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById(HEADER_ID);
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================================
   2. モバイルナビゲーション
   ============================================================ */
function initMobileNav() {
  const toggle  = document.getElementById(TOGGLE_ID);
  const navList = document.getElementById(NAV_ID);
  if (!toggle || !navList) return;

  const close = () => {
    navList.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const opening = !navList.classList.contains('is-open');
    navList.classList.toggle('is-open', opening);
    toggle.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
  });

  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) close();
  });
}


/* ============================================================
   3. スムーズスクロール
   ============================================================ */
function initSmoothScroll() {
  const offset = document.getElementById(HEADER_ID)?.offsetHeight ?? 64;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ============================================================
   4. スクロールリビール（Intersection Observer）
   ============================================================ */
function initScrollReveal() {
  const items = document.querySelectorAll('.js-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
}


/* ============================================================
   5. ページトップボタン
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById(TOP_BTN_ID);
  if (!btn) return;

  const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 500);

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================================
   6. ナビリンク アクティブ状態（セクション追跡）
   ============================================================ */
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const offset = (document.getElementById(HEADER_ID)?.offsetHeight ?? 64) + 40;

  const update = () => {
    let current = '';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top - offset <= 0) current = s.id;
    });
    links.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}


/* ============================================================
   7. マーキー ホバーで一時停止
   ============================================================ */
function initMarqueePause() {
  document.querySelectorAll('.marquee-strip').forEach(strip => {
    strip.addEventListener('mouseenter', () => strip.classList.add('is-paused'));
    strip.addEventListener('mouseleave', () => strip.classList.remove('is-paused'));
  });
}


/* ============================================================
   初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initBackToTop();
  initNavActive();
  initMarqueePause();
});
