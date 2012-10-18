Template.loading.rendered = function() {
  if (! this.spinner)
    this.spinner = new Spinner().spin(this.find('#loading'));
}
