/* This file is part of Ezra Project.

   Copyright (C) 2019 - 2020 Tobias Klein <contact@ezra-project.net>

   Ezra Project is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Ezra Project is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Ezra Project. See the file COPYING.
   If not, see <http://www.gnu.org/licenses/>. */


class TagAssignmentMenu {
  constructor() {
    this.menuIsOpened = false;
  }

  init(tabIndex=undefined) {
    var currentVerseListMenu = bible_browser_controller.getCurrentVerseListMenu(tabIndex);
    currentVerseListMenu.find('.assign-tag-menu-button').bind('click', (event) => {
      console.time('show');
      this.handleMenuClick(event); 
      console.timeEnd('show');
    });
  }

  getMenu() {
    return $('#app-container').find('#tag-assignment-menu');
  }

  getCurrentMenuButton() {
    var currentVerseListMenu = bible_browser_controller.getCurrentVerseListMenu();
    var assignTagMenuButton = currentVerseListMenu.find('.assign-tag-menu-button');
    return assignTagMenuButton;  
  }

  hideTagAssignmentMenu() {
    if (this.menuIsOpened) {
      this.getMenu().hide();
      this.menuIsOpened = false;

      var assignTagMenuButton = $('#app-container').find('.assign-tag-menu-button');
      assignTagMenuButton.removeClass('ui-state-active');
    }
  }

  handleMenuClick(event) {
    var assignTagMenuButton = this.getCurrentMenuButton();

    if (assignTagMenuButton.hasClass('ui-state-disabled')) {
      return;
    }

    if (this.menuIsOpened) {
      bible_browser_controller.handleBodyClick();
    } else {

      bible_browser_controller.book_selection_menu.hide_book_menu();
      bible_browser_controller.tag_selection_menu.hideTagMenu();
      bible_browser_controller.module_search.hideSearchMenu();
      bible_browser_controller.optionsMenu.hideDisplayMenu();

      assignTagMenuButton.addClass('ui-state-active');
      var buttonOffset = assignTagMenuButton.offset();
      var menu = this.getMenu();
      var topOffset = buttonOffset.top + assignTagMenuButton.height() + 12;
      var leftOffset = buttonOffset.left;

      menu.css('top', topOffset);
      menu.css('left', leftOffset);

      menu.show();

      if (tags_controller.currentTagList != null) {
        var menuId = 'tag-assignment-menu-taglist';
        var menu = document.getElementById(menuId);
        tags_controller.render_tags_from_list(tags_controller.currentTagList, menu);
      }

      this.menuIsOpened = true;
      event.stopPropagation();
    }
  }

  getTagsContainer() {
    return document.getElementById('tags-content-global');
  }

  getTagsContainerParentId() {
    var tagsContainer = this.getTagsContainer();
    return tagsContainer.parentNode.getAttribute('id');
  }

  moveTagAssignmentList(moveToMenu=false) {
    var tagsSearchInput = document.getElementById('tags-search-input');
    var toolBarId = 'tags-content-global';
    var filterId = 'tag-assignment-menu-filter';

    var assignTagMenuButton = this.getCurrentMenuButton();

    if (moveToMenu) {
      var filter = document.getElementById(filterId);
      filter.appendChild(tagsSearchInput);
      assignTagMenuButton.show();

      var menuId = 'tag-assignment-menu-taglist';
      var menu = document.getElementById(menuId);
      tags_controller.currentTarget = menu;
    } else {
      tags_controller.handle_tag_accordion_change();
      assignTagMenuButton.hide();
      var toolBar = document.getElementById(toolBarId);

      if (tags_controller.currentTagList != null) {
        tags_controller.currentTarget = toolBar;
      }
    }
  }
}

module.exports = TagAssignmentMenu;