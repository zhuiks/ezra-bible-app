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
   along with Ezra Project. See the file LICENSE.
   If not, see <http://www.gnu.org/licenses/>. */


class UiHelper {
  constructor() {}

  configureButtonStyles(context = null) {
    if (context == null) {
      context = document;
    } else {
      var context = document.querySelector(context);
    }
  
    var buttons = context.querySelectorAll('.fg-button');
  
    for (var i = 0; i < buttons.length; i++) {
      var currentButton = buttons[i];
      var currentButtonClasses = currentButton.classList;
  
      if (!currentButtonClasses.contains("ui-state-disabled") && !currentButtonClasses.contains("events-configured")) {
        currentButton.addEventListener('mouseover', function(e) {
          $(e.target).closest('.fg-button').addClass('ui-state-hover');
        });
  
        currentButton.addEventListener('mouseout', function(e) {
          $(e.target).closest('.fg-button').removeClass('ui-state-hover');
        });
  
        currentButton.addEventListener('mousedown', function(e) {
          uiHelper.handleButtonMousedown($(e.target).closest('.fg-button'), e.target.nodeName != 'INPUT');
        });
  
        currentButton.addEventListener('mouseup', function(e) {
          if(!$(e.target).closest('.fg-button').is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
            $(e.target).closest('.fg-button').removeClass("ui-state-active");
          }
        });
  
        currentButton.classList.add('events-configured');
      }
    }
  }
  
  handleButtonMousedown(element, click_checkbox) {
    $(element).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
    if ($(element).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active')) {
      $(element).removeClass("ui-state-active");
    } else { 
      $(element).addClass("ui-state-active");
    }
  
    if (click_checkbox) {
      var embedded_input = $(element).find('input:first');
  
      if (embedded_input.attr('type') == 'checkbox') {
        embedded_input[0].click();
      }
    }
  }
  
  initProgressBar(progressBar) {
    var progressLabel = progressBar.find(".progress-label");
  
    progressBar.progressbar({
      value: false,
      change: function() {
        progressLabel.text( progressBar.progressbar( "value" ) + "%" );
      },
      complete: function() {
        progressLabel.text(i18n.t('general.completed'));
      }
    });
  }

  adaptVerseList(verseListFrame=undefined) {
    if (verseListFrame === undefined) {
      verseListFrame = bible_browser_controller.getCurrentVerseListFrame();
    }
    
    if (verseListFrame.width() < 650) {
      verseListFrame.addClass('verse-list-frame-small-screen');
    } else {
      verseListFrame.removeClass('verse-list-frame-small-screen');
    }
  }
  
  resizeVerseList(tabIndex=undefined) {
    if (tabIndex === undefined) {
      tabIndex = bible_browser_controller.tab_controller.getSelectedTabIndex();
    }
  
    var verseListComposite = bible_browser_controller.getCurrentVerseListComposite(tabIndex);
    var navigationPane = verseListComposite.find('.navigation-pane');
    var verseListFrame = verseListComposite.find('.verse-list-frame');
  
    var newVerseListHeight = app_container_height - 135;
    navigationPane.css('height', newVerseListHeight);
    verseListFrame.css('height', newVerseListHeight);
  
    this.adaptVerseList(verseListFrame);
  }
  
  // FIXME: Optimize this to be tab-specific
  resizeAppContainer(e) {
    app_container_height = $(window).height() - 10;
    $("#app-container").css("height", app_container_height);
    // Notes disabled
    // $('#general-notes-textarea').css('height', new_app_container_height - 210);
  
    var tagsToolBarHeight = $('#tags-toolbar').height();
  
    if (bible_browser_controller.optionsMenu.strongsSwitchChecked()) {
      $('#tags-content-global').css('height', app_container_height - tagsToolBarHeight - 415);
      $('#dictionary-info-box-panel').css('height', 302);
    } else {
      $('#tags-content-global').css('height', app_container_height - tagsToolBarHeight - 55);
    }
  
    if (e === undefined) {
      // If there was no event then we don't react after the window was resized
      this.resizeVerseList();
    } else {
      // If the window was resized we get an event. In this case we need to resize all verse lists in all tabs
      var tabCount = bible_browser_controller.tab_controller.getTabCount();
      for (var i = 0; i < tabCount; i++) {
        this.resizeVerseList(i);
      }
    }
  }
}

module.exports = UiHelper;