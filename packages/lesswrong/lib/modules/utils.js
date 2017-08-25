export const flatten = function(data) {
  var result = {};
  function recurse (cur, prop) {

    if (Object.prototype.toString.call(cur) !== "[object Object]") {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for(var i=0, l=cur.length; i<l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop+"."+p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

export const contentIsEmpty = (content) => {
  console.log("Content Is Empty called", content);
  return content && content.state && content.state.serialized && content.state.serialized.nodes && content.state.serialized.nodes.length == 1 && content.state.serialized.nodes[0].nodes && content.state.serialized.nodes[0].nodes.length == 1 && content.state.serialized.nodes[0].nodes[0].text == ""
}

export const isEmpty = ({ cells, rows,
  layout: { plugin: { name: layout } = {} } = {},
  content: { plugin: { name: content } = {} } = {}
}) =>
  !(cells || []).filter(emptyFilter).length &&
  !(rows || []).filter(emptyFilter).length &&
  !content || contentIsEmpty(content) &&
  !(layout && (rows || []).filter(emptyFilter).length)

export const emptyFilter = (state) => !isEmpty(state)
