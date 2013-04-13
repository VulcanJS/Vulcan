// Work around the lack of limit/offset in clientside queries.
// 
// We fetch all the clients from the cursor, pick out the right ones,
// and decorate them with a special property that tells us the order they should
// appear in.
//
// This is a bit of a hack, and should probably be supported in core (somehow!)
limitDocuments = function(cursor, limit) {
  var i = 0;
  var documents = [];
  cursor.forEach(function(doc) {
    if (i < limit) {
      doc._rank = i;
      documents.push(doc);
    }
    
    i += 1;
  });
  
  return documents;
}