import React from 'react';
import styles from './List.module.css';

const LastSearches = ({ lastSearches, onLastSearch }) => (
  <>
    {lastSearches.map((searchTerm, index) => (
      <span
        key={(searchTerm, index)}
        className={styles.flexItemMedium}
      >
        <button onClick={() => onLastSearch(searchTerm)}>
          {searchTerm}
        </button>
      </span>
    ))}
  </>
);

export default LastSearches;
