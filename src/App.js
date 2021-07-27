import React from 'react';
import axios from 'axios';
import styles from './List.module.css';
import SearchForm from './SearchForm';
import LastSearches from './LastSearches';
import List from './List';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const extractSearchTerm = (url) => {
  const fullSearchTerm = url.replace(API_ENDPOINT, '');
  const end = fullSearchTerm.indexOf('page') - 1;
  return fullSearchTerm.slice(0, end);
};
const getUrl = (searchTerm, page = 0) =>
  `${API_ENDPOINT}${searchTerm}&page=${page}`;

const getLastSearches = (urls) =>
  urls.slice(-6, -1).map((url) => extractSearchTerm(url));

const removeDuplicate = (urls, searchTerm) => {
  const index = urls.findIndex((url) => url.indexOf(searchTerm) > -1);
  index > -1 && urls.splice(index, 1);
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload.hits,
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1];
      const result = await axios.get(lastUrl);
      console.log(result.data);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    handleSearch(searchTerm);
    event.preventDefault();
  };

  const handleLastSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  const handleSearch = (searchTerm) => {
    setUrls((prevUrls) => {
      removeDuplicate(prevUrls, searchTerm);
      return [...prevUrls.concat(getUrl(searchTerm))];
    });
  };

  const handleNext = () => {
    setUrls((prevUrls) => {
      prevUrls.pop();
      return [
        ...prevUrls.concat(getUrl(searchTerm, stories.page + 1)),
      ];
    });
  };

  const lastSearches = getLastSearches(urls);

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <div className={styles.flexContainer}>
        <SearchForm
          className={styles.flexItemLarge}
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />
        <LastSearches
          lastSearches={lastSearches}
          onLastSearch={handleLastSearch}
        />
      </div>
      <button onClick={handleNext}>Next</button>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

export default App;
