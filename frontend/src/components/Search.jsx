import React, { useEffect, useState } from "react";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let query;

    if (searchTerm) {
      query = searchQuery(searchTerm.toLowerCase());
    } else {
      query = feedQuery;
    }

    client.fetch(query).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }, [searchTerm]);

  if (loading) return <Spinner message="Searching for pins..." />;

  return (
    <div>
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No pins found.</div>
      )}
    </div>
  );
};

export default Search;
