import React from 'react';
import { sortBy } from 'lodash';
import styles from './List.module.css';
import cs from 'classnames';
import { ReactComponent as Up } from './up.svg';
import { ReactComponent as Down } from './down.svg';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments'),
  POINT: (list) => sortBy(list, 'points'),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  });

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse
    ? sortFunction(list).reverse()
    : sortFunction(list);

  const icon = (sortKey) => {
    if (sort.sortKey !== sortKey) {
      return;
    }
    return sort.isReverse ? (
      <Down height="30px" width="30px" />
    ) : (
      <Up height="30px" width="30px" />
    );
  };

  return (
    <div>
      <div className={styles.flexContainer}>
        <span className={styles.flexItemLarge}>
          <button
            className={
              sort.sortKey === 'TITLE'
                ? cs(styles.btn, styles.active)
                : styles.btn
            }
            type="button"
            onClick={() => handleSort('TITLE')}
          >
            Title &nbsp;
            {icon('TITLE')}
          </button>
        </span>
        <span className={styles.flexItemMedium}>
          <button
            className={
              sort.sortKey === 'AUTHOR'
                ? cs(styles.btn, styles.active)
                : styles.btn
            }
            type="button"
            onClick={() => handleSort('AUTHOR')}
          >
            Author &nbsp;
            {icon('AUTHOR')}
          </button>
        </span>
        <span className={styles.flexItemSmall}>
          <button
            className={
              sort.sortKey === 'COMMENT'
                ? cs(styles.btn, styles.active)
                : styles.btn
            }
            type="button"
            onClick={() => handleSort('COMMENT')}
          >
            Comments &nbsp;
            {icon('COMMENT')}
          </button>
        </span>
        <span className={styles.flexItemSmall}>
          <button
            className={
              sort.sortKey === 'POINT'
                ? cs(styles.btn, styles.active)
                : styles.btn
            }
            type="button"
            onClick={() => handleSort('POINT')}
          >
            Points &nbsp;
            {icon('POINT')}
          </button>
        </span>
        <span className={styles.flexItemSmall}>Actions</span>
      </div>

      {sortedList.map((item) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
};

const Item = ({ item, onRemoveItem }) => (
  <div className={styles.flexContainer}>
    <span className={styles.flexItemLarge}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span className={styles.flexItemMedium}>{item.author}</span>
    <span className={styles.flexItemSmall}>{item.num_comments}</span>
    <span className={styles.flexItemSmall}>{item.points}</span>
    <span className={styles.flexItemSmall}>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

export default List;
