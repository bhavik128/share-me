import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  // console.log(categoryId);

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
    // console.log(pins);
  }, [categoryId]);

  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />;
  }

  if (!pins?.length) {
    return (
      <div className="flex flex-col justify center items-center">
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          Be the first one to create {categoryId} pin.
        </h2>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
          onClick={() => {
            navigate("/create-pin");
          }}
        >
          Create pin
        </button>
      </div>
    );
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
