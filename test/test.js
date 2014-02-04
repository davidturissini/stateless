var stateless = require('./../src/stateless');
var staticDir = process.browser ? '' : __dirname;
var Q = require('q');
var pigeon = require('pigeon');
var Page = require('./../src/Page');

stateless
	
	.setPort(process.env.PORT || 8888)
	.setServerRoot(staticDir)
	.setLayoutsDirectory('/layouts')
	.setDefaultLayoutFile('main.html')

	.setRoutes([{

		path:'/',

		template:staticDir + '/views/home/index.html',
		
		action:function (document, routeData) {
			var defer = Q.defer();

			pigeon.get('http://local.traveladdict.me:3000/dave-and-melissa/posts')
				.then(function (postsData) {
					var posts = JSON.parse(postsData);
					var ul = document.querySelector('.posts');

					posts.forEach(function (post) {
						var href = '/post/' + post.slug;

						var li = document.createElement('li');
						var a = document.createElement('a');
						a.setAttribute('href', href);
						a.innerHTML = post.title;

						li.appendChild(a);
						ul.appendChild(li);


					});



					defer.resolve();

				});

			

			return defer.promise;
		},

		onLoad: function () {
			
		},

		onUnload: function () {

		}

	},{

		path:"/post/:post_id",

		template:staticDir + '/views/foo/index.html',
		
		action:function (document, params) {
			var defer = Q.defer();

			pigeon.get('http://local.traveladdict.me:3000/dave-and-melissa/posts/' + params.post_id)
				.then(function (postData) {
					var post = JSON.parse(postData);

					document.title = post.title;
					
					document.querySelector('.title').innerHTML = post.title;
					document.querySelector('.body').innerHTML = post.body;


					defer.resolve();

				});

			

			return defer.promise;

			
		},

		onLoad: function () {
			
		},

		onUnload: function () {
			
		}

	}])

	.activate();