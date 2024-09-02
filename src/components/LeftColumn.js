import React, { useEffect, useState } from 'react';

const LeftColumn = ({ onSelectVerse, selectedWord }) => {
  const [verses, setVerses] = useState({});
  const [bookNameLookup, setBookNameLookup] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch Bible verses
    fetch('/Bible_BSB_NT_40.json')
      .then(response => response.json())
      .then(data => {
        // Ensure the data structure is as expected
        if (data && typeof data === 'object' && data.content) {
          setVerses(data.content);
          setIsLoading(false);
        } else {
          console.error('Fetched data is not in the expected format:', data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setIsLoading(false);
      });

    // Fetch book names
    fetch('/book_lookup.json')
      .then(response => response.json())
      .then(data => setBookNameLookup(data.fullname.bsb.en))
      .catch(error => console.error('Error fetching book lookup:', error));
  }, []);

  const handleWordSelect = (wordDetails) => {
    onSelectVerse(wordDetails.book, wordDetails.chapter, wordDetails.verseNumber, wordDetails.strongID, wordDetails.word, wordDetails.monad);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '50%', overflowY: 'scroll' }}>
      {Object.entries(verses).map(([book, chapters]) => (
        <div key={book}>
          <h2>Book {bookNameLookup[book] || book}</h2>
          {Object.entries(chapters).map(([chapter, verseArray]) => (
            <div key={chapter}>
              <h3>Chapter {chapter}</h3>
              {Object.entries(verseArray).map(([verseNumber, wordArrays]) => (
                <p key={verseNumber}>
                  <strong>Verse {verseNumber}</strong>
                  {wordArrays.map(([strongID, word, monad]) => (
                    <span
                      key={strongID}
                      onMouseDown={() => handleWordSelect({ book, chapter, verseNumber, strongID, word, monad })}
                      style={{ backgroundColor: selectedWord?.strongID === strongID ? 'yellow' : 'transparent' }}
                    >
                      {word}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LeftColumn;