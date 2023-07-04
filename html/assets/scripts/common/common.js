//  --------------------------------
// 375px viewport fixed ------------
//  --------------------------------
const viewport = document.querySelector('meta[name="viewport"]');
const fixViewport = () => {
	const value = window.outerWidth > 374 ? 'width=device-width,initial-scale=1' : 'width=375';
	if (viewport !== null && viewport.getAttribute('content') !== value) {
		viewport.setAttribute('content', value);
	}
};
window.addEventListener('load', fixViewport);
window.addEventListener('resize', fixViewport);
