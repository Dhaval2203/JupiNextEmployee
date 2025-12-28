// Smooth scroll to section considering the fixed header height
export const scrollToSection = (key) => {
    if (!key) return;
    const el = document.getElementById(key);
    if (!el) return;
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 90;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
};