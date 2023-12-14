import { useState, useEffect } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import Container from "@mui/material/Container";
// import { getImages } from "services/ApiService";
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Loader from "./Loader";
import Button from "./Button";

// import getImages from "services/api";
import getImages from "../services/api";

document.title = "HW-4 Images";

const App = () => {
    const [hits, setHits] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            if (!searchQuery) {
                return;
            }

            setIsLoading(true);
            try {
                const response = await getImages(searchQuery, page);
                const totalPages = Math.ceil(response.totalHits / 12);

                if (response.hits.length === 0) {
                    Notify.warning(
                        "Sorry, there are no images matching your search query. Please try again."
                    );
                    return;
                }

                setHits((hits) => [...hits, ...response.hits]);

                if (page === 1) {
                    Notify.success(
                        `Hooray! We found ${response.totalHits} images.`
                    );
                } else {
                    setTimeout(() => scroll(), 100);
                }

                if (page >= totalPages) {
                    Notify.warning(
                        "We're sorry, but you've reached the end of search results."
                    );
                    setShowLoadMoreBtn(false);
                } else {
                    setShowLoadMoreBtn(true);
                }
            } catch (err) {
                Notify.failure(`Oops, something went wrong: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [searchQuery, page]);

    // New search query
    const handleSubmit = (evt) => {
        evt.preventDefault();

        const { queryInput } = evt.target.elements;
        const searchQuery = queryInput.value.trim();

        if (searchQuery === "") {
            Notify.failure(
                "Sorry, there are no images matching your search query. Please try again."
            );
            return;
        }

        queryInput.value = "";

        setSearchQuery(searchQuery);
        setPage(1);
        setHits([]);
    };

    const scroll = () => {
        const { clientHeight } = document.documentElement;
        window.scrollBy({
            top: clientHeight - 180,
            behavior: "smooth",
        });
    };

    const isNotEmpty = hits.length !== 0;

    return (
        <>
            <Searchbar onSubmit={handleSubmit} />
            <Container maxWidth="lg" sx={{ pt: 2, pb: 2 }}>
                {isNotEmpty && <ImageGallery hits={hits} />}
                {isLoading ? (
                    <Loader />
                ) : (
                    isNotEmpty &&
                    showLoadMoreBtn && (
                        <Button
                            onLoadMore={() => setPage((page) => page + 1)}
                        />
                    )
                )}
            </Container>
        </>
    );
};

export default App;
