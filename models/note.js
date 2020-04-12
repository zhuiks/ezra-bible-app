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

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    verseReferenceId: DataTypes.INTEGER,
    text: DataTypes.TEXT,
    bibleBookId: DataTypes.VIRTUAL,
    absoluteVerseNrEng: DataTypes.VIRTUAL,
    absoluteVerseNrHeb: DataTypes.VIRTUAL
  }, {});

  Note.associate = function(models) {
    Note.belongsTo(models.VerseReference);
  };

  Note.findByVerseReferenceIds = function(verseReferenceIds) {
    var query = "SELECT n.*, b.shortTitle AS bibleBookId, vr.absoluteVerseNrEng, vr.absoluteVerseNrHeb" + 
                " FROM VerseReferences vr " +
                " INNER JOIN BibleBooks b ON vr.bibleBookId = b.id" +
                " INNER JOIN Notes n ON n.verseReferenceId = vr.id" +
                " WHERE vr.id IN (" + verseReferenceIds + ")" +
                " ORDER BY b.number ASC, vr.absoluteVerseNrEng ASC";

    return sequelize.query(query, { model: models.Note });
  };

  Note.groupNotesByVerse = function(notes, versification) {
    var groupedVerseNotes = {};

    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      var bibleBookId = note.bibleBookId.toLowerCase()

      var absoluteVerseNr = (versification == 'eng' ? note.absoluteVerseNrEng : note.absoluteVerseNrHeb);
      var verseReferenceId = versification + '-' + bibleBookId + '-' + absoluteVerseNr;
      
      groupedVerseNotes[verseReferenceId] = note;
    }

    return groupedVerseNotes;
  };

  Note.persistNote = function(noteValue, verseBox) {
    models.VerseReference.findOrCreateFromVerseBox(verseBox).then(vr => {
      vr.getOrCreateNote().then(n => {
        if (noteValue != "") {
          // Save the note if it has content
          n.text = noteValue;
          n.save();
        } else {
          // Delete the note if it does not have any content
          n.destroy();
        }
      })
    });
  };
  
  return Note;
};