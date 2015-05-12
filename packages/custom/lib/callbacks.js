function alertThanks (post) {
  alert("Thanks for submitting a post!");
  return post;
}
Telescope.callbacks.register("postSubmitClient", alertThanks);