Template.user_menu.helpers({
  user: function () {
    return Meteor.user();
  },
  menuItems: function () {
    var viewableItems = _.reject(Telescope.menuItems.get("userMenu"), function (item) {
      return (item.adminOnly && !Users.is.admin(Meteor.user()));
    });

    // viewableItems = viewableItems.map(function (item) {
    //   item.parentId = "userMenuRoot";
    //   return item;
    // });

    // viewableItems.push({
    //   id: "userMenuRoot",
    //   template: "user_menu_label"
    // });
    // console.log(viewableItems);

    return viewableItems;
  },
  menuClass: function () {
    if (this.zone === "mobileNav") {
      return 'menu-collapsible';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'menu-dropdown';
    } else {
      return 'menu-collapsible';
    }
  }
});
