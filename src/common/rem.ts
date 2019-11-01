export default () => {
	// var wH = window.innerHeight; // 当前窗口的高度
	let wW = window.innerWidth // 当前窗口的宽度
	let whdef = 100 / 1920 // 表示1920的设计图,使用100PX的默认值
	let rem: number
	let html: HTMLElement
	if (wW > 1400) {
		rem = wW * whdef // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
		html = document.documentElement
		html.style.fontSize = rem + 'px' // 适用于以后网站
	} else {
		rem = 1400 * whdef
		html = document.documentElement
		html.style.fontSize = rem + 'px'
	}
}
