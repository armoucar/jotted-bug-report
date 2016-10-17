angular
    .module('myApp', [])
    .directive('customJotted', function() {
        return {
            restrict: 'EA',
            scope: {
                html: '@myHtml',
                js: '@myJs',
                css: '@myCss'
            },
            link: link
        }

        function link(scope, el, attrs) {

            var jotted = new Jotted(el[0], {
                files: [
                    { type: 'html', url: scope.html },
                    { type: 'js', url: scope.js }
                ],

                plugins: [{
                    name: 'codemirror',
                    options: {
                        extraKeys: { "F11": toggleFullscreen, "Esc": exitFullscreen }
                    }
                }]
            });

            var reScript = /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
                reLinks = /<link[\s\S]*?>[\s\S]*?(<\/link>)*/gi,
                scripts = [],
                links = [],
                firstExecution = true;

            jotted.on('change', function (params, callback) {
                if (params.type === "html") {
                    if (firstExecution) {
                        firstExecution = false;

                        scripts = params.cmEditor.getValue().match(reScript);
                        links = params.cmEditor.getValue().match(reLinks);

                        var visualCode = params
                            .cmEditor
                            .getValue()
                            .replace(reScript, '')
                            .replace(reLinks, '')
                            .trim();

                        params.cmEditor.setValue(visualCode);
                    }

                    var toRender = '';
                    if (scripts && scripts.length) toRender += scripts.join('\n');
                    if (links && links.length) toRender += links.join('\n');

                    params.content = toRender + params.content;
                }

                callback(null, params)
            });

            function toggleFullscreen(cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                var nav = document.querySelector(".jotted-nav");
                nav.style.display = nav.style.display === 'none' ? '' : 'none';
            }

            function exitFullscreen(cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                var nav = document.querySelector(".jotted-nav");
                nav.style.display = '';
            }

        }
    });
