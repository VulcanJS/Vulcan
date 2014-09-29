Template.MedBookMainPage.crfs = function () {
      return CRFmetadataCollection.find({}).map(function (x){
            x.id=x.collection;
            x.type="insert";
            console.log(x);
            return x;
      });
};

window.change_crf_form_selection = function () {
    $(".crf_form").hide();
    $("#" + $("#crf_form_selection").val()).show();
}

Template.MedBookMainPage.render = function () {
    window.change_crf_form_selection();
}
