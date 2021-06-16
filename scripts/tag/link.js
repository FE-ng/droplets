/*
 * @Author: your name
 * @Date: 2021-06-16 16:01:23
 * @LastEditTime: 2021-06-16 17:42:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/scripts/tag/link.js
 */

'use strict';

// {% link title, url %}
// {% link title, url, img %}
hexo.extend.tag.register('link', function (args) {
  if (args.length < 2) {
    return;
  }
  const [text, url, img] = args;
  // 发现如果不套一层 div 在其它可渲染 md 的容器中容易被分解
  let result = '';
  result += '<div class="tag link"><a class="link-card" title="' + text + '" href="' + url + '">';
  // left
  result += '<div class="left">';
  result += '<img src="' + (img || hexo.theme.config.tag_plugins.link.placeholder) + '"/>';
  result += '</div>';
  // right
  result += '<div class="right"><p class="text">' + text + '</p><p class="url">' + url + '</p></div>';
  result += '</a></div>';
  return result;
});

hexo.extend.tag.register(
  'linkgroup',
  function (args, content) {
    let ret = '';
    ret += '<div class="link-group">';
    ret += content;
    ret += '</div>';
    return ret;
  },
  { ends: true },
);
