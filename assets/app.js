'use strict';

const cases = {
  "pipeline": {
    "meta": "Walmart Global Tech / Data engineering",
    "title": "Faster production pipelines.",
    "intro": "High-volume order processing required improvements to Spark execution performance and the reliability of the surrounding production systems.",
    "details": [
      "Optimized five production Spark jobs using distributed query optimization, hash-based repartitioning, AQE tuning, and shuffle reduction.",
      "Built pipelines with Apache Spark, Apache Hudi, and Airflow as part of a migration from Kubernetes-based microservices to distributed processing.",
      "Applied reliability improvements and data-quality checks across Kafka processing, Spark workloads, databases, and services."
    ],
    "result": "10–30% reduction in execution time across the five optimized Spark jobs. Related reliability work reduced production incidents by 25–40%. The batch-processing migration contributed to a 40% reduction in operational alerts.",
    "context": "The optimization work covered five production Spark jobs. Separate batch-pipeline development used Spark, Hudi, and Airflow as part of a migration from Kubernetes-based microservices to distributed processing.",
    "projection": "Projected migration outcome: $1M in annual cloud savings. The 40% reduction in operational alerts is an achieved result, separate from this savings projection."
  },
  "events": {
    "meta": "Arizona State University / Full-stack development",
    "title": "Less friction at the door.",
    "intro": "An event-management platform needed to support multi-host event workflows and make attendee verification more efficient.",
    "details": [
      "Implemented React interfaces and Spring Boot microservices supporting multi-host event management and stateless services.",
      "Introduced QR code-based verification to streamline attendee check-in.",
      "Deployed services on AWS with Kubernetes and provisioned infrastructure using Terraform."
    ],
    "result": "Result: 20% reduction in event check-in time.",
    "context": "Developed at Arizona State University for a platform serving 1,000+ users. The work spanned React interfaces, Spring Boot microservices, attendee verification, and AWS deployment."
  },
  "research": {
    "meta": "Arizona State University / Graduate research",
    "title": "Forecasting and grid security.",
    "intro": "The research addressed electricity-demand forecasting and the detection and mitigation of load-redistribution attacks on power grids.",
    "details": [
      "Built an end-to-end electricity load-forecasting system with automated data pipelines and machine-learning models.",
      "Engineered a detection and mitigation framework for load-redistribution attacks on power grids as part of an Israel–US BIRD Foundation research project."
    ],
    "result": "Results: 10% forecasting-accuracy improvement over the previous baseline and 90% attack-detection accuracy.",
    "context": "Two related research contributions at Arizona State University: an end-to-end forecasting system, and an attack-detection framework within an Israel–US BIRD Foundation research project."
  },
  "simulation": {
    "meta": "Tata Consultancy Services / Engineering tooling",
    "title": "A more efficient testing loop.",
    "intro": "ADAS engineers needed interactive simulation workflows and automated collection and reporting of test results.",
    "details": [
      "Built interactive simulation workflows for a platform serving 350+ engineers.",
      "Automated simulation-result collection and test-report generation.",
      "Streamlined failure analysis and reduced manual reporting effort for ADAS engineers."
    ],
    "result": "Result: 30% improvement in testing efficiency.",
    "context": "Developed a closed-loop Software-in-the-Loop platform at Tata Consultancy Services, supporting workflows for 350+ engineers."
  }
};

const dialog = document.getElementById('case-dialog');
let caseTrigger = null;
let currentCase = null;
let caseReturnFocus = true;

function fillCase(key) {
  const data = cases[key];
  if (!data) return false;
  currentCase = key;
  document.getElementById('case-meta').textContent = data.meta;
  document.getElementById('case-title').textContent = data.title;
  document.getElementById('case-intro').textContent = data.intro;
  document.getElementById('case-context').textContent = data.context;
  const details = data.details.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  });
  document.getElementById('case-details').replaceChildren(...details);
  document.getElementById('case-result').textContent = data.result;
  const projection = document.getElementById('case-projection');
  projection.hidden = !data.projection;
  projection.textContent = data.projection || '';
  document.getElementById('case-copy-status').textContent = '';
  return true;
}

function openCase(key, trigger, updateUrl = true) {
  if (!fillCase(key)) return;
  caseTrigger = trigger || document.querySelector('[data-case="' + key + '"]');
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('case', key);
    url.hash = 'work';
    history.pushState({ case: key }, '', url);
  }
}

function removeCaseFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('case');
  history.replaceState(null, '', url);
}

document.querySelectorAll('[data-case]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openCase(link.dataset.case, link);
  });
});
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (caseReturnFocus) {
    removeCaseFromUrl();
    caseTrigger?.focus({ preventScroll: true });
  }
  caseReturnFocus = true;
  currentCase = null;
});
function restoreCaseFromUrl() {
  const key = new URL(window.location.href).searchParams.get('case');
  if (cases[key]) {
    openCase(key, null, false);
  } else if (dialog.open) {
    caseReturnFocus = false;
    dialog.close();
  }
}
window.addEventListener('popstate', restoreCaseFromUrl);
restoreCaseFromUrl();
document.getElementById('copy-case').addEventListener('click', async () => {
  if (!currentCase) return;
  const url = new URL(window.location.href);
  url.searchParams.set('case', currentCase);
  url.hash = 'work';
  const status = document.getElementById('case-copy-status');
  try {
    await navigator.clipboard.writeText(url.href);
    status.textContent = 'Case-study link copied.';
  } catch {
    status.textContent = url.href;
  }
});

const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  document.querySelectorAll('.project').forEach(project => {
    const visible = button.dataset.filter === 'all' || project.dataset.category.split(' ').includes(button.dataset.filter);
    project.hidden = !visible;
    if (visible) count++;
  });
  document.getElementById('filter-status').textContent = count + ' work summaries shown';
}));

const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(button, focus = false) {
  tabs.forEach(tab => {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) button.focus();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectTab(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});

const menu = document.getElementById('menu-toggle');
const links = document.getElementById('navlinks');
function closeMenu(returnFocus = false) {
  links.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  links.classList.toggle('open', open);
});
links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && links.classList.contains('open')) closeMenu(true);
});

const theme = document.getElementById('theme-toggle');
function setTheme(mode) {
  const selected = mode === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = selected;
  theme.setAttribute('aria-label', selected === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  theme.setAttribute('aria-pressed', String(selected === 'dark'));
}
try { setTheme(localStorage.getItem('ak-theme')); } catch { setTheme('light'); }
theme.addEventListener('click', () => {
  const mode = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(mode);
  try { localStorage.setItem('ak-theme', mode); } catch { /* Theme remains usable without storage. */ }
});

document.getElementById('copy-email').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('avinashkodali45@gmail.com');
    status.textContent = 'Email address copied.';
  } catch { status.textContent = 'Email: avinashkodali45@gmail.com'; }
});

const navSections = [...document.querySelectorAll('main section[id]')];
let scrollQueued = false;
function updateActiveNavigation() {
  const marker = window.innerHeight * 0.3;
  let current = '';
  for (const section of navSections) {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  }
  links.querySelectorAll('a').forEach(link => {
    const active = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActiveNavigation); }
}, { passive: true });
window.addEventListener('resize', updateActiveNavigation);
updateActiveNavigation();
