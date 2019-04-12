// 配置文件的入口文件，也可以是YML或toml
module.exports = {
	locales: {
		// 键名是该语言所属的子路径
		// 作为特例，默认语言可以使用 '/' 作为其路径。
		'/': {
			lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
			title: 'L-holy',
			description: '个人博客'
		}
		// '/en/': {
		// 	lang: 'en-US',
		// 	title: 'L-holy',
		// 	description: 'blog'
		// }
	},
	markdown: {
		lineNumbers: true
	},
	serviceWorker: true,
	themeConfig: {
		// 显示github连接
		repo: 'holylovelqq',
		docsRepo: 'holylovelqq/vuepress-blog',
		docsDir: 'docs',
		editLinks: true,
		locales: {
			'/': {
				// 显示最后更新时间
				lastUpdated: '上次更新',
				// 多语言下拉菜单的标题
				selectText: '选择语言',
				// 该语言在下拉菜单中的标签
				label: '简体中文',
				// 编辑链接文字
				editLinkText: '帮我改进此页',
				// Service Worker 的配置
				serviceWorker: {
					updatePopup: {
						message: "发现新内容可用.",
						buttonText: "刷新"
					}
				},
				// 当前 locale 的 algolia docsearch 选项
				algolia: {},
				nav: [{
						text: 'vue',
						link: '/vue/'
					},
					{
						text: '前端知识',
						link: '/frondend/'
					},
					{
						text: '服务器部署',
						link: '/server/'
					},
					{
						text: '无关技术',
						link: '/life/'
					}
				],
				sidebar: {
					'/vue/': [
						'VueCommon',
						'VueUnitTest'
					],
					'/frondend/': [
						'JS',
						'CSS',
						'codingRules',
						'summary',
						'usefullWeb'
					],
					'/server/': [
						'AWS',
						'ALIBABA'
					],
					'/life/': [
						'noSay'
					],
					'/': [ /* ... */ ]
				}
			},
			// '/en/': {
			// 	selectText: 'Languages',
			// 	label: 'English',
			// 	editLinkText: 'Edit this page on GitHub',
			// 	serviceWorker: {
			// 		updatePopup: {
			// 			message: "New content is available.",
			// 			buttonText: "Refresh"
			// 		}
			// 	},
			// 	algolia: {},
			// 	nav: [{
			// 		text: 'Nested',
			// 		link: '/en/nested/'
			// 	}],
			// 	sidebar: {
			// 		'/en/': [ /* ... */ ],
			// 		'/en/nested/': [ /* ... */ ]
			// 	}
			// }
		}
	},
	head: [
		['link', { rel: 'icon', href: `/logo.png` }],
		['link', { rel: 'manifest', href: '/manifest.json' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
		['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
		['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
		['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
		['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
		['meta', { name: 'msapplication-TileColor', content: '#000000' }],
		// ['script', { src: '/assets/js/article.js'}]
	],
	evergreen: true //取消对ie及旧版本浏览器的支持，默认是支持的

}