/**
 * MÓDULO HERO INTERACTIVO (Hero Spec Card, Terminal CLI & Typewriter)
 * - Controla la ventana interactiva y arrastrable de especificaciones técnicas (Spec Card).
 * - Controla la mini terminal interactiva con pestañas (profile.spec / terminal.sh).
 * - Rotador de roles dinámico con efecto máquina de escribir (typewriter).
 * - Animación en cascada para badges de Core Stack.
 */

export function initHeroSpecCard(): (() => void) | undefined {
  // 1. Animación en cascada para badges de Core Stack
  const specTags = document.querySelector<HTMLElement>('.spec-tags');
  let specObserver: IntersectionObserver | null = null;
  if (specTags) {
    specObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          specTags.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    specObserver.observe(specTags);
  }

  // 2. Ventana interactiva arrastrable (Spec Card)
  const specCard = document.getElementById('spec-card');
  const specHeader = document.getElementById('spec-header');
  const specDotReset = document.getElementById('spec-dot-reset');

  let isDragging = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  let currentTranslateX = 0;
  let currentTranslateY = 0;
  let baseLeft = 0;
  let baseTop = 0;
  let cachedMinX = 0;
  let cachedMaxX = 0;
  let cachedMinY = 0;
  let cachedMaxY = 0;
  let dragRafId: number | null = null;

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || window.innerWidth <= 860) return;
    if ((e.target as HTMLElement)?.closest('.spec-dots, .spec-tab-btn, button, a')) return;

    isDragging = true;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    startTranslateX = currentTranslateX;
    startTranslateY = currentTranslateY;

    if (!specCard) return;
    const rect = specCard.getBoundingClientRect();
    baseLeft = rect.left - currentTranslateX;
    baseTop = rect.top - currentTranslateY;

    const cardW = rect.width || 340;
    const cardH = rect.height || 380;
    cachedMinX = (60 - cardW) - baseLeft;
    cachedMaxX = (window.innerWidth - 60) - baseLeft;
    cachedMinY = 75 - baseTop;

    const sobreMiSection = document.getElementById('sobre-mi');
    const heroSection = document.getElementById('hero');
    let maxYSection = Infinity;
    if (sobreMiSection) {
      const sobreMiRect = sobreMiSection.getBoundingClientRect();
      maxYSection = (sobreMiRect.top - 16) - baseTop - cardH;
    } else if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      maxYSection = (heroRect.bottom - 16) - baseTop - cardH;
    }
    const maxYViewport = (window.innerHeight - 50) - baseTop;
    cachedMaxY = Math.min(maxYViewport, maxYSection);

    try {
      specHeader?.setPointerCapture(e.pointerId);
    } catch (_) {}

    specCard.classList.add('is-dragging');
    specCard.style.transition = 'none';
  }

  function updateDragPosition() {
    if (!specCard || !isDragging) {
      dragRafId = null;
      return;
    }
    specCard.style.transform = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0)`;
    dragRafId = null;
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging || !specCard) return;

    const deltaX = e.clientX - startPointerX;
    const deltaY = e.clientY - startPointerY;

    currentTranslateX = Math.max(cachedMinX, Math.min(cachedMaxX, startTranslateX + deltaX));
    currentTranslateY = Math.max(cachedMinY, Math.min(Math.max(cachedMinY, cachedMaxY), startTranslateY + deltaY));

    if (!dragRafId) {
      dragRafId = window.requestAnimationFrame(updateDragPosition);
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging || !specCard) return;
    isDragging = false;

    if (dragRafId) {
      window.cancelAnimationFrame(dragRafId);
      dragRafId = null;
    }

    try {
      specHeader?.releasePointerCapture(e.pointerId);
    } catch (_) {}

    specCard.classList.remove('is-dragging');
    specCard.style.transition = '';
  }

  function resetCardPosition() {
    if (!specCard) return;
    specCard.style.transition = 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 360ms ease';
    currentTranslateX = 0;
    currentTranslateY = 0;
    specCard.style.transform = 'translate3d(0, 0, 0)';
    setTimeout(() => {
      if (specCard) {
        specCard.style.transition = '';
      }
    }, 380);
  }

  if (specHeader) {
    specHeader.addEventListener('pointerdown', onPointerDown);
    specHeader.addEventListener('pointermove', onPointerMove);
    specHeader.addEventListener('pointerup', onPointerUp);
    specHeader.addEventListener('pointercancel', onPointerUp);
    specHeader.addEventListener('dblclick', resetCardPosition);
  }

  const onDotResetClick = (e: MouseEvent) => {
    e.stopPropagation();
    resetCardPosition();
  };
  specDotReset?.addEventListener('click', onDotResetClick);

  const onResize = () => {
    if (window.innerWidth <= 860) {
      if (currentTranslateX !== 0 || currentTranslateY !== 0) {
        resetCardPosition();
      }
      return;
    }
    if ((currentTranslateX === 0 && currentTranslateY === 0) || !specCard) return;
    const cardW = specCard.offsetWidth || 340;
    const cardH = specCard.offsetHeight || 380;
    const rect = specCard.getBoundingClientRect();
    baseLeft = rect.left - currentTranslateX;
    baseTop = rect.top - currentTranslateY;

    const minX = (60 - cardW) - baseLeft;
    const maxX = (window.innerWidth - 60) - baseLeft;
    const minY = 75 - baseTop;

    const sobreMiSection = document.getElementById('sobre-mi');
    const heroSection = document.getElementById('hero');
    let maxYSection = Infinity;

    if (sobreMiSection) {
      const sobreMiRect = sobreMiSection.getBoundingClientRect();
      maxYSection = (sobreMiRect.top - 16) - baseTop - cardH;
    } else if (heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      maxYSection = (heroRect.bottom - 16) - baseTop - cardH;
    }

    const maxYViewport = (window.innerHeight - 50) - baseTop;
    const maxY = Math.min(maxYViewport, maxYSection);

    currentTranslateX = Math.max(minX, Math.min(maxX, currentTranslateX));
    currentTranslateY = Math.max(minY, Math.min(Math.max(minY, maxY), currentTranslateY));
    specCard.style.transform = `translate3d(${currentTranslateX}px, ${currentTranslateY}px, 0)`;
  };

  window.addEventListener('resize', onResize, { passive: true });

  // 3. Pestañas interactivas de Spec Card (profile.spec / terminal.sh)
  const tabProfile = document.getElementById('spec-tab-profile');
  const tabTerminal = document.getElementById('spec-tab-terminal');
  const panelProfile = document.getElementById('spec-panel-profile');
  const panelTerminal = document.getElementById('spec-panel-terminal');
  const terminalForm = document.getElementById('terminal-form') as HTMLFormElement | null;
  const terminalInput = document.getElementById('terminal-input') as HTMLInputElement | null;
  const terminalOutput = document.getElementById('terminal-output');
  const termChips = document.querySelectorAll<HTMLButtonElement>('.term-chip');

  function switchTab(tab: 'profile' | 'terminal') {
    if (tab === 'profile') {
      tabProfile?.classList.add('active');
      tabTerminal?.classList.remove('active');
      panelProfile?.classList.remove('is-hidden');
      panelProfile?.classList.add('is-active');
      panelTerminal?.classList.add('is-hidden');
      panelTerminal?.classList.remove('is-active');
      panelProfile?.classList.remove('hidden');
    } else {
      tabTerminal?.classList.add('active');
      tabProfile?.classList.remove('active');
      panelTerminal?.classList.remove('is-hidden');
      panelTerminal?.classList.add('is-active');
      panelProfile?.classList.add('is-hidden');
      panelProfile?.classList.remove('is-active');
      panelTerminal?.classList.remove('hidden');
      setTimeout(() => terminalInput?.focus(), 50);
    }
  }

  tabProfile?.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('profile');
  });

  tabTerminal?.addEventListener('click', (e) => {
    e.stopPropagation();
    switchTab('terminal');
  });

  function printLine(html: string) {
    if (!terminalOutput) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    terminalOutput.appendChild(div);
    requestAnimationFrame(() => {
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  }

  function executeCommand(rawCmd: string) {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    printLine(`<div class="text-slate-400 mt-1"><span class="text-emerald-400 font-bold">$</span> <span class="text-white">${rawCmd}</span></div>`);

    // Normalizar comando (quitar $ inicial si el usuario lo copió del badge, comillas y espacios redundantes)
    const cleanCmd = cmd
      .toLowerCase()
      .replace(/^\$\s*/, '')
      .replace(/^["']|["']$/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isEn = document.documentElement.getAttribute('lang') === 'en';

    // Easter Egg secreto (coincide con el tag del Hero: $ git checkout engineering-craftmanship)
    if (
      cleanCmd === 'git checkout engineering-craftmanship' ||
      cleanCmd === 'git checkout engineering-craftsmanship' ||
      cleanCmd === 'git switch engineering-craftmanship' ||
      cleanCmd === 'git switch engineering-craftsmanship' ||
      cleanCmd === 'checkout engineering-craftmanship' ||
      cleanCmd === 'checkout engineering-craftsmanship' ||
      cleanCmd === 'git checkout -b engineering-craftmanship'
    ) {
      printLine(`
        <div class="text-[10px] space-y-1 text-slate-300 my-1">
          <p class="text-emerald-400 font-semibold">Switched to branch '<span class="text-white">engineering-craftmanship</span>'</p>
          <p class="text-slate-400">${isEn ? 'Software craftsmanship and technical consistency environment activated.' : 'Entorno de artesanía de software y consistencia técnica activado.'}</p>
          <div class="p-2 rounded bg-black/40 border border-emerald-500/30 text-slate-300 font-mono-code space-y-1 my-1">
            <p><span class="text-orange-400 font-bold">✓ ${isEn ? 'Philosophy:' : 'Filosofía:'}</span> ${isEn ? 'Deterministic code, strict typing, and zero hidden technical debt.' : 'Código determinista, tipado estricto y cero deuda técnica oculta.'}</p>
            <p><span class="text-cyan-400 font-bold">✓ ${isEn ? 'Architecture:' : 'Arquitectura:'}</span> ${isEn ? 'Resilient ETL pipelines, transactional consistency, and low-latency Edge APIs.' : 'Pipelines ETL resilientes, consistencia transaccional y Edge APIs de baja latencia.'}</p>
            <p><span class="text-emerald-400 font-bold">✓ ${isEn ? 'Standard:' : 'Estándar:'}</span> ${isEn ? 'Statistical rigor, end-to-end traceability, and frictionless automation.' : 'Rigor estadístico, trazabilidad total y automatización sin fricción.'}</p>
          </div>
          <p class="text-amber-300 text-[10px]">✨ ${isEn ? 'Craftsman mode active. Ready to build dependable engineering.' : 'Modo artesano activo. Listo para construir ingeniería confiable.'}</p>
        </div>
      `);
      return;
    }

    switch (cleanCmd) {
      case 'help':
        printLine(`
          <div class="text-slate-300 space-y-0.5 text-[10px]">
            <p><span class="text-orange-400 font-bold">cat stack.json</span> - ${isEn ? 'Core stack & tools' : 'Core stack & herramientas'}</p>
            <p><span class="text-orange-400 font-bold">git status</span> - ${isEn ? 'Repository & deployment status' : 'Estado del repositorio y despliegue'}</p>
            <p><span class="text-orange-400 font-bold">run benchmark</span> - ${isEn ? 'Performance metrics & latency' : 'Métricas de rendimiento y latencia'}</p>
            <p><span class="text-orange-400 font-bold">contact</span> - ${isEn ? 'Direct contact channels' : 'Canales directos de contacto'}</p>
            <p><span class="text-orange-400 font-bold">whoami</span> - ${isEn ? 'Professional summary' : 'Resumen del perfil profesional'}</p>
            <p><span class="text-orange-400 font-bold">clear</span> - ${isEn ? 'Clear the terminal' : 'Limpiar la consola'}</p>
          </div>
        `);
        break;

      case 'cat stack.json':
      case 'stack.json':
      case 'stack':
        printLine(`
          <pre class="text-[10px] text-amber-300 bg-black/40 p-1.5 rounded border border-white/5 overflow-x-auto leading-relaxed">{
  <span class="text-cyan-400">"backend"</span>: [<span class="text-emerald-300">"Python"</span>, <span class="text-emerald-300">"FastAPI"</span>, <span class="text-emerald-300">"PostgreSQL"</span>, <span class="text-emerald-300">"Cloudflare Workers"</span>],
  <span class="text-cyan-400">"frontend"</span>: [<span class="text-emerald-300">"TypeScript"</span>, <span class="text-emerald-300">"React"</span>, <span class="text-emerald-300">"Astro"</span>, <span class="text-emerald-300">"TailwindCSS"</span>],
  <span class="text-cyan-400">"data_engine"</span>: [<span class="text-emerald-300">"ETL Pipelines"</span>, <span class="text-emerald-300">"Pandas"</span>, <span class="text-emerald-300">"Deterministic Logic"</span>]
}</pre>
        `);
        break;

      case 'git status':
      case 'status':
        printLine(`
          <div class="text-[10px] text-slate-300 space-y-0.5">
            <p class="text-emerald-400">On branch main (production)</p>
            <p class="text-slate-400">Your branch is up to date with 'origin/main'.</p>
            <p class="text-slate-400">Latest commit: <span class="text-orange-400">perf(edge): zero-cold-start &lt; 20ms</span></p>
            <p class="text-emerald-400">✓ Working tree clean. 100% test coverage passing.</p>
          </div>
        `);
        break;

      case 'run benchmark':
      case 'benchmark':
        printLine(`
          <div class="text-[10px] space-y-0.5 bg-black/30 p-1.5 rounded border border-white/5">
            <p class="text-emerald-400">✓ ${isEn ? 'Data ingestion: 14,200 records/sec' : 'Ingesta de datos: 14,200 registros/seg'}</p>
            <p class="text-cyan-400">✓ ${isEn ? 'Edge latency: 18ms (Cloudflare)' : 'Latencia en Edge: 18ms (Cloudflare)'}</p>
            <p class="text-amber-400">✓ ${isEn ? 'Transactional consistency: 100% audited' : 'Consistencia transaccional: 100% auditada'}</p>
          </div>
        `);
        break;

      case 'contact':
      case 'contact --fast':
        printLine(`
          <div class="text-[10px] text-slate-300 space-y-0.5">
            <p>✉ <a href="mailto:miguelaranguren19x@outlook.com" class="text-orange-400 underline hover:text-orange-300">miguelaranguren19x@outlook.com</a></p>
            <p>🐙 <a href="https://github.com/Miguel19x" target="_blank" rel="noreferrer" class="text-cyan-400 underline hover:text-cyan-300">github.com/Miguel19x</a></p>
            <p>💼 <a href="https://linkedin.com/in/miguela19x" target="_blank" rel="noreferrer" class="text-blue-400 underline hover:text-blue-300">linkedin.com/in/miguela19x</a></p>
          </div>
        `);
        break;

      case 'whoami':
      case 'about':
        printLine(`
          <div class="text-[10px] text-slate-300">
            <p><strong class="text-white">Miguel Angel Aranguren Ramirez</strong></p>
            <p class="text-slate-400">${isEn ? 'Fullstack Developer · UNEXPO Systems Eng. · Caracas, VE (UTC-4)' : 'Desarrollador Fullstack · UNEXPO Ing. de Sistemas · Caracas, VE (UTC-4)'}</p>
          </div>
        `);
        break;

      case 'clear':
        if (terminalOutput) {
          terminalOutput.innerHTML = `
            <div class="text-slate-400">
              <span class="text-emerald-400 font-semibold">sys_v2.0</span> ${isEn ? 'cleared. Type <span class="text-orange-400 font-bold">help</span> or click a command:' : 'cleared. Escribe <span class="text-orange-400 font-bold">help</span> o pulsa un comando:'}
            </div>
          `;
        }
        break;

      default:
        printLine(`<div class="text-red-400 text-[10px]">${isEn ? `Command not recognized: "${rawCmd}". Type <span class="text-orange-400 font-bold">help</span> to view options.` : `Comando no reconocido: "${rawCmd}". Escribe <span class="text-orange-400 font-bold">help</span> para ver opciones.`}</div>`);
        break;
    }
  }

  terminalForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!terminalInput) return;
    const value = terminalInput.value;
    terminalInput.value = '';
    executeCommand(value);
  });

  termChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });

  // 4. Rotador de roles con efecto typewriter
  const typewriterTarget = document.getElementById('hero-typewriter-text');
  let typewriterTimeout: number | undefined;
  let typewriterObserver: IntersectionObserver | null = null;

  if (typewriterTarget) {
    const rolesByLang: Record<string, string[]> = {
      es: [
        'Fullstack Developer (Python & TS)',
        'Pipelines ETL & Datos Complejos',
        'Arquitecturas Serverless & Edge',
        'TypeScript, React & SQL',
      ],
      en: [
        'Fullstack Developer (Python & TS)',
        'ETL Pipelines & Complex Data',
        'Serverless & Edge Architectures',
        'TypeScript, React & SQL',
      ],
    };

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isTypewriterActive = true;

    const getCurrentRoles = (): string[] => {
      const lang = document.documentElement.getAttribute('lang') || 'es';
      return rolesByLang[lang] || rolesByLang.es;
    };

    const typeRole = () => {
      if (!isTypewriterActive) return;
      const roles = getCurrentRoles();
      const currentRole = roles[roleIdx % roles.length];

      if (isDeleting) {
        charIdx--;
        typewriterTarget.textContent = currentRole.substring(0, charIdx);
      } else {
        charIdx++;
        typewriterTarget.textContent = currentRole.substring(0, charIdx);
      }

      let speed = isDeleting ? 28 : 55;

      if (!isDeleting && charIdx === currentRole.length) {
        speed = 2200; // pausa al completar
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx++;
        speed = 350; // pausa antes del siguiente
      }

      typewriterTimeout = window.setTimeout(typeRole, speed);
    };

    typeRole();

    // Pausar rotación en segundo plano cuando no está en pantalla para ahorrar CPU/batería en móvil
    if ('IntersectionObserver' in window) {
      typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isTypewriterActive) {
              isTypewriterActive = true;
              typeRole();
            }
          } else {
            isTypewriterActive = false;
            if (typewriterTimeout) clearTimeout(typewriterTimeout);
          }
        });
      }, { threshold: 0.05 });
      typewriterObserver.observe(typewriterTarget);
    }

    const onLangChange = () => {
      charIdx = 0;
      isDeleting = false;
      if (typewriterTimeout) clearTimeout(typewriterTimeout);
      typeRole();
    };

    document.addEventListener('portfolio:languagechange', onLangChange);
  }

  return () => {
    specObserver?.disconnect();
    typewriterObserver?.disconnect();
    if (specHeader) {
      specHeader.removeEventListener('pointerdown', onPointerDown);
      specHeader.removeEventListener('pointermove', onPointerMove);
      specHeader.removeEventListener('pointerup', onPointerUp);
      specHeader.removeEventListener('pointercancel', onPointerUp);
      specHeader.removeEventListener('dblclick', resetCardPosition);
    }
    specDotReset?.removeEventListener('click', onDotResetClick);
    window.removeEventListener('resize', onResize);
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
  };
}
