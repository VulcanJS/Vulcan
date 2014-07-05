Template[getTemplate('error')].errors= function(){
  return Errors.find({show: true});
}