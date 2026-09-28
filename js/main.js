/**
 * KASA (Kogakuin AeroSpace Adventurers) - Main Interaction Script
 */

// ==========================================
// 1. Note (ブログ) 連携設定
// ==========================================
// note 記事は GitHub Actions（.github/workflows/update-note.yml）が1時間ごとに取得し、
// data/note.json に書き出す。アカウントを変えるときは scripts/fetch_note.py の CREATOR_ID を書き換える。
const NOTE_CONFIG = {
  dataUrl: './data/note.json', // 取得済みの記事一覧
  maxCount: 3,              // 表示する最大記事数
  defaultThumbnail: './assets/images/workshop_machining.jpg' // サムネイルがない場合の画像
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. ScrollSpy (Active nav highlight)
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  // セクションの高さに関係なく判定できるよう、「画面上部の基準線を越えた最後のセクション」を現在地とする
  // （IntersectionObserver の割合判定だと、スマホで縦長のセクションが一度も判定されなかった）
  let spyTicking = false;

  const updateScrollSpy = () => {
    spyTicking = false;
    const marker = header.offsetHeight + window.innerHeight * 0.25;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let currentId = sections.length ? sections[0].id : '';

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) {
        currentId = section.id;
      }
    });
    if (atBottom && sections.length) {
      currentId = sections[sections.length - 1].id;
    }

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', () => {
    if (!spyTicking) {
      spyTicking = true;
      requestAnimationFrame(updateScrollSpy);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollSpy);
  updateScrollSpy();

  // 4. Modal Image Viewer
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClose = document.getElementById('modalClose');

  if (modal && modalImg) {
    const triggerImages = document.querySelectorAll('[data-preview-img]');
    let lastTrigger = null;

    triggerImages.forEach(el => {
      // キーボード（Tab → Enter / Space）でも拡大表示できるようにする
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });

      el.addEventListener('click', () => {
        lastTrigger = el;
        const src = el.getAttribute('data-preview-img') || el.getAttribute('src');
        const title = el.getAttribute('data-title') || el.getAttribute('alt') || '写真プレビュー';
        const desc = el.getAttribute('data-desc') || '';

        modalImg.src = src;
        modalImg.alt = title;
        modalTitle.textContent = title;
        if (desc && desc.trim().length > 0) {
          modalDesc.textContent = desc;
          modalDesc.style.display = 'block';
          modalTitle.style.marginBottom = '0.25rem';
        } else {
          modalDesc.textContent = '';
          modalDesc.style.display = 'none';
          modalTitle.style.marginBottom = '0';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (modalClose) modalClose.focus();
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      // 開く前に操作していた写真へフォーカスを戻す
      if (lastTrigger) lastTrigger.focus();
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'Tab') {
        // モーダル内の操作可能要素は閉じるボタンのみなので、背景へフォーカスが抜けないよう固定
        e.preventDefault();
        if (modalClose) modalClose.focus();
      }
    });
  }

  // 5. Contact Form Handler (FormSubmit AJAX to kogakuin.kasa@gmail.com)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = (document.getElementById('name')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const category = (document.getElementById('category')?.value || '').trim();
      const message = (document.getElementById('message')?.value || '').trim();

      if (!name || !email || !category || !message) {
        showStatus('error', '必須項目をすべてご記入ください。');
        return;
      }

      // 送信中表示
      const originalBtnHtml = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<span class="btn-spinner"></span> 送信中...';
      hideStatus();

      // 件名を分かりやすく更新
      const formSubject = document.getElementById('formSubject');
      if (formSubject) {
        formSubject.value = `【KASA公式HPお問い合わせ】${category} (${name}様)`;
      }

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/kogakuin.kasa@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true)) {
          showStatus('success', '✓ お問い合わせを送信いたしました。担当者（kogakuin.kasa@gmail.com）よりご記入いただいたメールアドレス宛てに順次返信いたします。');
          contactForm.reset();
        } else {
          throw new Error(result.message || '送信エラーが発生しました');
        }
      } catch (err) {
        console.warn('FormSubmit submission error, showing direct mail fallback:', err);
        const mailtoSubject = encodeURIComponent(`【KASA公式HPお問い合わせ】${category} (${name}様)`);
        const mailtoBody = encodeURIComponent(`【お名前】: ${name}\n【メールアドレス】: ${email}\n【種別】: ${category}\n\n【お問い合わせ内容】:\n${message}`);
        const mailtoUrl = `mailto:kogakuin.kasa@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        showStatus('error', `
          <div style="margin-bottom: 0.5rem;">
            <strong>送信処理に失敗しました。</strong><br>
            お使いの環境または通信状況により送信が完了できませんでした。お手数をおかけしますが、以下のボタンよりメールアプリを起動して直接送信いただくか、<a href="mailto:kogakuin.kasa@gmail.com" style="text-decoration: underline; color: inherit; font-weight: bold;">kogakuin.kasa@gmail.com</a> 宛てにご連絡ください。
          </div>
          <a href="${mailtoUrl}" class="btn btn-secondary" style="display: inline-flex; font-size: 0.85rem; padding: 0.45rem 1rem; margin-top: 0.5rem; text-decoration: none;">
            ✉️ メールアプリで直接送信する
          </a>
        `);
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnHtml;
      }
    });

    function showStatus(type, htmlContent) {
      if (!formStatus) return;
      formStatus.className = `form-status form-status-${type}`;
      formStatus.innerHTML = htmlContent;
      formStatus.style.display = 'block';
    }

    function hideStatus() {
      if (!formStatus) return;
      formStatus.style.display = 'none';
      formStatus.innerHTML = '';
    }
  }

  // ==========================================
  // 6. Note RSS 自動取得＆表示
  // ==========================================
  async function loadNoteFeed() {
    const noteContainer = document.getElementById('noteArticlesContainer');
    if (!noteContainer) return;

    // note から来た値は信用せず、HTML として解釈させない。
    // innerHTML は使わず、要素を組み立てて textContent で文字として入れる。
    const isSafeUrl = (value, prefix) => {
      try {
        return typeof value === 'string' && new URL(value).href.startsWith(prefix);
      } catch (e) {
        return false;
      }
    };

    const el = (tag, className, text) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    };

    try {
      // 公開のたびに最新を取りに行く（ブラウザの古いキャッシュを使わない）
      const response = await fetch(NOTE_CONFIG.dataUrl, { cache: 'no-cache' });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (Array.isArray(data.items) && data.items.length > 0) {
        // 既存のプレースホルダーをクリア
        noteContainer.replaceChildren();

        // note の記事URL以外（javascript: など）はカードにしない
        const articles = data.items
          .filter(item => isSafeUrl(item.link, 'https://note.com/'))
          .slice(0, NOTE_CONFIG.maxCount);

        articles.forEach(item => {
          const title = String(item.title || '');

          // 日付は取得スクリプトが日本時間の YYYY-MM-DD で書き出している
          const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(item.date || ''));

          // サムネイル（note の見出し画像。https の画像のみ使う）
          const thumb = isSafeUrl(item.thumbnail, 'https://') ? item.thumbnail : NOTE_CONFIG.defaultThumbnail;

          // 本文の抜粋
          const cleanText = String(item.excerpt || '');
          const snippet = cleanText.length > 85 ? cleanText.substring(0, 85) + '...' : cleanText;

          // カード要素の作成
          const card = el('article', 'news-card fade-init');
          card.setAttribute('data-category', 'note');

          const imgWrapper = el('div', 'news-card-img-wrapper');
          const img = el('img', 'news-card-img');
          img.src = thumb;
          img.alt = title;
          img.loading = 'lazy';
          img.addEventListener('error', () => {
            if (img.getAttribute('src') !== NOTE_CONFIG.defaultThumbnail) {
              img.src = NOTE_CONFIG.defaultThumbnail;
            }
          });
          imgWrapper.appendChild(img);

          const body = el('div', 'news-body');
          const meta = el('div', 'news-meta');
          const category = el('span', 'news-category category-note');
          category.append(el('span', 'note-dot'), 'note');
          meta.appendChild(category);
          if (dateMatch) {
            const [, year, month, day] = dateMatch;
            const time = el('time', '', `${year}.${month}.${day}`);
            time.dateTime = `${year}-${month}-${day}`;
            meta.appendChild(time);
          }

          const link = el('a', 'news-link link-note', 'noteで読む →');
          link.href = item.link;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';

          body.append(meta, el('h3', 'news-title', title), el('p', 'news-snippet', snippet), link);
          card.append(imgWrapper, body);

          noteContainer.appendChild(card);
          if (revealObserver) {
            revealObserver.observe(card);
          }
        });

        // フィルターボタンを再バインド
        applyCurrentFilter();
      }
    } catch (err) {
      console.log('Note feed not available yet, keeping default fallback cards:', err);
    }
  }

  // ==========================================
  // 7. News & Blog フィルター機能
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsEmpty = document.getElementById('newsEmpty');
  let currentFilter = 'all';

  function applyCurrentFilter() {
    const allCards = document.querySelectorAll('.news-card');
    let visibleCount = 0;
    allCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (currentFilter === 'all' || cat === currentFilter) {
        card.style.display = 'flex';
        visibleCount++;
        // フィルターで再表示されたカードが非表示のままにならないよう表示クラスを付与
        if (card.classList.contains('fade-init')) {
          card.classList.add('is-visible');
        }
      } else {
        card.style.display = 'none';
      }
    });

    // 該当カードが0件のときは空状態のメッセージを表示
    if (newsEmpty) {
      if (visibleCount === 0) {
        newsEmpty.textContent = currentFilter === 'note'
          ? '公式 note の記事は現在準備中です。公開され次第ここに自動で表示されます。'
          : 'このカテゴリーの記事はまだありません。';
        newsEmpty.hidden = false;
      } else {
        newsEmpty.hidden = true;
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.getAttribute('data-filter');
      applyCurrentFilter();
    });
  });

  // 初回フィード読み込み実行
  loadNoteFeed();

  // ==========================================
  // 8. スクロール連動フェード表示 (Scroll Reveal)
  // ==========================================
  let revealObserver = null;

  function initScrollReveal() {
    // IntersectionObserver 未対応ブラウザへの配慮
    if (!('IntersectionObserver' in window)) {
      document.body.classList.remove('reveal-ready');
      return;
    }

    document.body.classList.add('reveal-ready');

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-init');
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // ファーストビュー（画面上部）に既に位置している要素は少し間隔を空けて順次表示
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => {
          el.classList.add('is-visible');
        }, 50);
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // スクロールフェードの初期化
  initScrollReveal();
});

