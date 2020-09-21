import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const Page3 = () => {
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [pageCount, setPageCount] = useState(1);
  const [searchWord, setSearchWord] = useState("");

  //load all the data in
  useEffect(() => {
    const fetchAPI = async () => {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/photos");
      const data = await res.json();
      console.log(data);
      const slice = data.slice(offset, offset + perPage);
      setPageCount(Math.ceil(data.length / perPage));
      setFilteredData(slice);
      setOriginalData(data);
      // //get a slice of the incoming data
      // const indexOfLastPost = currentPage * postPerPage;
      // const indexOfFirstPost = indexOfLastPost - postPerPage;
      // setPostData(data.slice(indexOfFirstPost, indexOfLastPost));
      setLoading(false);
    };
    fetchAPI();
  }, []);

  //when clicking new page or next/prev more data will be sliced
  const loadMoreData = () => {
    const data = originalData;
    const slice = data.slice(offset, offset + perPage);
    setPageCount(Math.ceil(data.length / perPage));
    setFilteredData(slice);
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;

    setPageCount(selectedPage);
    setOffset(offset);
    loadMoreData();
  };

  //the main logic for search input
  const handleChange = (e) => {
    setSearchWord(e.target.value);
    const data = originalData;
    const slice = data.slice(offset, offset + perPage);

    if (e.target.value !== "") {
      const dataFiltered = (
        data.filter((post) =>
          post.title.toLowerCase().includes(e.target.value)
        )
      );
      setFilteredData(dataFiltered.slice(offset, offset + perPage));
    } else {
      setFilteredData(slice);
    }
  };

  return (
    <div>
      <label>Search through the Data: </label>
      <input
        placeholder="type something to search"
        value={searchWord}
        onChange={handleChange}
      ></input>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div>
          <h1>Welcome!</h1>
          {filteredData.length !== 0
            ? filteredData.map((data, id) => (
                <div key={id}>
                  <span>{data.id}: </span>
                  <div>{data.title}</div>
                </div>
              ))
            : null}
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      )}
    </div>
  );
};

export default Page3;
