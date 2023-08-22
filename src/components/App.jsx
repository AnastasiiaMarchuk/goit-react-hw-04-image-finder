import React, { useEffect, useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages } from 'services/api';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState(true);

  useEffect(() => {
    if (query === '') return;
    async function getImages() {
      try {
        setLoading(true);
        const images = await fetchImages(query, page);
        if (images.length === 0) {
          toast.warn(
            'Sorry, no images were found for your request. Enter a valid query',
            { autoClose: 1500 }
          );
          return;
        }
        setImages(prevImages => [...prevImages, ...images]);
        setMore(images.length === 12);
      } catch (error) {
        toast.error('An error occurred while fetching images.', {
          autoClose: 1500,
        });
      } finally {
        setLoading(false);
      }
    }

    getImages();
  }, [query, page]);

  const changeQuery = newQuery => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
    setMore(true);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <Searchbar handleSubmit={changeQuery} />
      {loading && <Loader />}
      <ImageGallery images={images} />
      {images.length > 0 && more && <Button loadMore={handleLoadMore} />}
      <ToastContainer />
    </>
  );
};
