'use strict';

/* ============================================================
   Velvet Spoon — Minimal Template  |  main.js
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
   スクロール量が 0 より大きい場合に .is-scrolled を付与
   ────────────────────────────────────────────── */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 0);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期実行
}


/* ──────────────────────────────────────────────
   2. モバイルナビゲーション
   ハンバーガーボタンで nav-list の開閉を制御
   ────────────────────────────────────────────── */
function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (!toggle || !navList) return;

  const openNav = () => {
    toggle.classList.add('is-open');
    navList.classList.add('is-open');
    toggle.setAttribute('aria-label', 'ナビゲーションを閉じる');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeNav = () => {
    toggle.classList.remove('is-open');
    navList.classList.remove('is-open');
    toggle.setAttribute('aria-label', 'ナビゲーションを開く');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  // ナビリンクをクリックしたら閉じる
  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ナビ外をクリックしたら閉じる
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) {
      closeNav();
    }
  });
}


/* ──────────────────────────────────────────────
   3. スムーススクロール
   href が "#id" 形式のリンクをクリックした際に
   ヘッダー分のオフセットを考慮して滑らかに移動
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

      const headerH  = header ? header.offsetHeight : 0;
      const targetY  = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}


/* ──────────────────────────────────────────────
   4. スクロールリビール
   .js-reveal を持つ要素がビューポートに入ったとき
   .is-revealed を付与してフェードインさせる
   ────────────────────────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll('.js-reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 兄弟要素に対して連番遅延をかける（グループ内でずらす）
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.children].filter(el => el.classList.contains('js-reveal'))
            : [];
          const index = siblings.indexOf(entry.target);
          const delay = index * 80; // ms

          setTimeout(() => {
            entry.target.classList.add('is-revealed');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  targets.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────────
   5. ナビゲーション アクティブ状態
   スクロール位置に応じて対応する nav-link に
   .is-active を付与する（Intersection Observer）
   ────────────────────────────────────────────── */
function initNavActiveState() {
  const sections = document.querySelectorAll('section[id], div[id]');
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
    {
      rootMargin: '-40% 0px -55% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ──────────────────────────────────────────────
   初期化
   DOM 読み込み完了後にすべての機能を起動
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScroll();
  initScrollReveal();
  initNavActiveState();
});
